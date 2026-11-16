import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../dist/pokecatch-assistant.user.js", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const viteConfig = fs.readFileSync(new URL("../vite.config.mjs", import.meta.url), "utf8");
const marker = "const DATA = ";
const start = source.indexOf(marker) + marker.length;
const end = source.indexOf(";\n  const SAVE_KEY", start);
const data = JSON.parse(source.slice(start, end));

function sourceFunction(name) {
  const signature = `function ${name}(`;
  const functionStart = source.indexOf(signature);
  assert.notEqual(functionStart, -1, `missing function ${name}`);
  const bodyStart = source.indexOf("{", functionStart);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return vm.runInThisContext(`(${source.slice(functionStart, index + 1)})`);
  }
  throw new Error(`unterminated function ${name}`);
}

test("generated data matches the inspected game build", () => {
  assert.equal(data.appBuild, "c0081498f2");
  assert.equal(data.langBuild, "01332b3d04");
  assert.equal(Object.keys(data.species).length, 649);
  assert.equal(data.species[4].n, "小火龙");
  assert.deepEqual(data.species[4].t, ["fire"]);
});

test("userscript and development metadata share version 0.2.0", () => {
  assert.equal(packageJson.version, "0.2.0");
  assert.ok(source.includes("// @version      0.2.0"));
  assert.ok(source.includes('const VERSION = "0.2.0"'));
  assert.ok(viteConfig.includes('version: "0.2.0"'));
});

test("Johto finale contains Red's actual six Pokemon", () => {
  const silver = data.chapters.find((chapter) => chapter.name === "白银山");
  assert.ok(silver, "missing translated Mt. Silver chapter");
  assert.deepEqual(silver.boss.team.map(([id]) => id), [25, 196, 143, 3, 6, 9]);
  assert.equal(silver.boss.name, "赤红");
  assert.equal(silver.boss.badge, "Légende");
});

test("route and encounter data can locate Charmander on Route 3", () => {
  const route3 = data.chapters.flatMap((chapter) => chapter.routes.map((route) => ({ chapter, route })))
    .find(({ route }) => route.name === "3号道路");
  assert.ok(route3, "missing Route 3");
  assert.ok(route3.route.areas.includes("kanto-route-3-area"));
});

test("userscript never writes the game save key", () => {
  assert.equal(source.includes("localStorage.setItem(SAVE_KEY"), false);
  assert.equal(source.includes("localStorage.removeItem(SAVE_KEY"), false);
});

test("control panel separates features into dedicated tabs", () => {
  for (const tab of ["push", "collect", "team", "berries", "diagnostics"]) {
    assert.ok(source.includes(`data-tabpanel="${tab}"`), `missing ${tab} tab panel`);
  }
  assert.ok(source.includes('role="tablist"'));
  assert.ok(source.includes('data-select-setting="regionScope"'));
});

test("collection UI separates ordinary targets from roaming legendaries", () => {
  assert.ok(source.includes("<h4>普通野外目标</h4>"));
  assert.ok(source.includes("<h4>徘徊神兽</h4>"));
  assert.ok(source.includes('id="pca-roaming-priority"'));
  assert.ok(source.includes('data-act="roam-up"'));
  assert.ok(source.includes('data-act="roam-down"'));
  assert.equal(source.includes('data-select-setting="roamingOrder"'), false);
});

test("ordinary collection, roaming tracking, and combined collection are independently selectable", () => {
  assert.ok(source.includes('data-act="collect">普通图鉴收集'));
  assert.ok(source.includes('data-act="roaming">仅追踪神兽'));
  assert.ok(source.includes('data-act="combined">普通 + 神兽协同'));
  assert.ok(source.includes('collectTick(save, { trackRoamers: false, collectMissing: true })'));
  assert.ok(source.includes('collectTick(save, { trackRoamers: true, collectMissing: false })'));
  assert.ok(source.includes('collectTick(save, { trackRoamers: true, collectMissing: true })'));
});

test("collection task buttons share one consistent layout and style", () => {
  assert.ok(source.includes('class="pca-task-grid"'));
  assert.equal((source.match(/class="pca-btn primary pca-task-btn"/g) || []).length, 3);
  assert.ok(source.includes('class="pca-row pca-controls"'));
});

test("captured roamers absent from roam.at never enter the live candidate list", () => {
  const activeRoamersFromState = sourceFunction("activeRoamersFromState");
  const candidates = activeRoamersFromState({
    244: { ch: 12, until: 2_000 },
  }, [243, 244, 245], 1_000);
  assert.deepEqual(candidates, [{ id: 244, chapter: 12, until: 2_000 }]);
  assert.equal(source.match(/function activeRoamers\(save\)[\s\S]*?\n  }/)?.[0].includes("isCaught"), false);
});

test("the first failed roaming capture resets immediately while the live entry remains", () => {
  const roamingTargetTransition = sourceFunction("roamingTargetTransition");
  assert.deepEqual(
    roamingTargetTransition({ id: 243 }, 1, 0, () => false),
    { type: "failed", attempts: 1 },
  );
  assert.ok(source.includes('await exclusive("神兽捕获失败后重置", () => resetChapter(runtime.targetPlan))'));
  assert.ok(source.includes('phase: "transit"'));
  assert.ok(source.includes('await exclusive("继续章节重置", continueChapterReset)'));
  assert.ok(source.includes("中转已完成，立即返回"));
  assert.ok(source.includes("runtime.chapterReset = null;"));
  assert.ok(source.includes("章节重置完成"));
});

test("a disappeared roaming target confirms its result once before replanning", () => {
  const roamingTargetTransition = sourceFunction("roamingTargetTransition");
  let confirmations = 0;
  const transition = roamingTargetTransition(null, 1, 0, () => {
    confirmations += 1;
    return true;
  });
  assert.deepEqual(transition, { type: "disappeared", caught: true });
  assert.equal(confirmations, 1);
  assert.ok(source.includes("结束当前神兽目标并重新规划"));
  assert.ok(source.includes("已离开实时列表，取消未完成的章节重置"));
  assert.ok(source.includes("runtime.targetPlan = null;"));
});

test("simultaneous live roamers follow the user's priority order", () => {
  const activeRoamersFromState = sourceFunction("activeRoamersFromState");
  const candidates = activeRoamersFromState({
    243: { ch: 8, until: 2_000 },
    244: { ch: 9, until: 2_000 },
    245: { ch: 10, until: 2_000 },
  }, [245, 243, 244], 1_000);
  assert.deepEqual(candidates.map((item) => item.id), [245, 243, 244]);
});

test("a caught status that conflicts with a live entry pauses safely", () => {
  const roamingTargetTransition = sourceFunction("roamingTargetTransition");
  assert.deepEqual(
    roamingTargetTransition({ id: 243 }, 0, 0, () => true),
    { type: "conflict" },
  );
  assert.ok(source.includes('diagnostic("神兽状态冲突"'));
  assert.ok(source.includes("仍在实时列表，但 roam.caught 或图鉴已显示捕获"));
});

test("collection team recommendations give current level a higher weight", () => {
  assert.ok(source.includes("const DEFAULT_LEVEL_WEIGHT = 0.22;"));
  assert.ok(source.includes("const COLLECTION_LEVEL_WEIGHT = 1.2;"));
  assert.ok(source.includes("Math.min(100, mon.level) * levelWeight"));
  assert.ok(source.includes("recommendTeam(save, [roamer.id], { levelWeight: COLLECTION_LEVEL_WEIGHT })"));
  assert.ok(source.includes("recommendTeam(save, [next.speciesId], { levelWeight: COLLECTION_LEVEL_WEIGHT })"));
  assert.ok(source.includes('runtime.target?.startsWith("push:") ? DEFAULT_LEVEL_WEIGHT : COLLECTION_LEVEL_WEIGHT'));
});

test("berry controls use in-game names followed by their effects", () => {
  for (const label of [
    "蔓莓果（捕获率 ×1.25）",
    "金色蔓莓果（捕获率 ×1.5）",
    "蕉香果（区域稀有种类 ×2）",
    "谜芝果（本地区未捕获种类 ×3）",
    "凰梨果（战斗经验 +25%）",
    "兰萨果（金币 +25%）",
    "星桃果（野生异色 ×2）",
  ]) assert.ok(source.includes(label), `missing berry label: ${label}`);
  assert.equal(source.includes('label: "经验果"'), false);
});

test("expired berries renew independently using the game's clock and verify activation", () => {
  const activeBuffAt = sourceFunction("activeBuffAt");
  assert.equal(activeBuffAt({ buffs: { xp: { key: "pinap-berry", until: 2_000 } } }, "xp", 1_999)?.key, "pinap-berry");
  assert.equal(activeBuffAt({ buffs: { xp: { key: "pinap-berry", until: 2_000 } } }, "xp", 2_000), null);
  assert.ok(source.includes("const gameNow = Number(save.lastTick) || Date.now();"));
  assert.ok(source.includes("if (!runtime.paused && !runtime.error) await manageBerries(save);"));
  assert.ok(source.indexOf("await manageBerries(save)") < source.indexOf('if (runtime.mode === "idle" || runtime.paused)'));
  assert.ok(source.includes("const countBefore = Number(save.items?.[choice.key] || 0);"));
  assert.ok(source.includes("buff?.key === choice.key"));
  assert.ok(source.includes('label: `${choice.info.label}生效`'));
});

test("manual target input previews Pokedex numbers and names", () => {
  assert.ok(source.includes('id="pca-manual-target-preview"'));
  assert.ok(source.includes("function manualTargetPreviewHtml"));
  assert.ok(source.includes('event.target.id === "pca-manual-targets"'));
  assert.ok(source.includes('String(id).padStart(3, "0")'));
});

test("team automation uses the game's drag interaction instead of opening details", () => {
  assert.ok(source.includes("async function dragPokemon"));
  assert.ok(source.includes('event("pointerdown"'));
  assert.ok(source.includes('event("pointermove"'));
  assert.ok(source.includes('event("pointerup"'));
  assert.equal(source.includes("card.click();"), false);
});

test("automated page actions use randomized conservative pacing", () => {
  assert.ok(source.includes("async function pacedAction"));
  assert.ok(source.includes("beforeMin = 700"));
  assert.ok(source.includes("beforeMax = 1_700"));
  assert.ok(source.includes("afterMin = 450"));
  assert.ok(source.includes("afterMax = 1_100"));
  assert.ok(source.includes("runtime.lastAutomatedActionAt"));
  assert.ok(source.includes('await pacedClick(go, `章节${chapterIndex}进入按钮`)'));
  assert.ok(source.includes("await pacedClick(preset"));
  assert.ok(source.includes("await pacedClick(button, choice.info.label)"));
  assert.equal((source.match(/\.click\(\)/g) || []).length, 1, "automated clicks must go through pacedClick");
  assert.ok(source.includes('await jitter(35, 85);'));
  assert.ok(source.includes('await jitter(450, 1_100);'));
});

test("floating panel can be dragged and remembers its position", () => {
  assert.ok(source.includes('handle.addEventListener("pointerdown"'));
  assert.ok(source.includes('handle.addEventListener("pointermove"'));
  assert.ok(source.includes("settings.panelPosition ="));
  assert.ok(source.includes("keepPanelInViewport(panel)"));
});

test("local development uses vite-plugin-monkey", () => {
  assert.equal(packageJson.scripts.dev, "vite --host 127.0.0.1 --port 5173 --strictPort");
  assert.equal(packageJson.scripts.predev, "npm run build");
  assert.ok(packageJson.devDependencies["vite-plugin-monkey"]);
  assert.ok(viteConfig.includes('name: "开发：PokeCatch 全图鉴与推图助手"'));
  assert.ok(viteConfig.includes("prefix: false"));
  assert.ok(viteConfig.includes('entry: "src/template.user.js"'));
});
