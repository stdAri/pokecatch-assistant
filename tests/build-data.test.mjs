import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(new URL("../dist/pokecatch-assistant.user.js", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const viteConfig = fs.readFileSync(new URL("../vite.config.mjs", import.meta.url), "utf8");
const marker = "const DATA = ";
const start = source.indexOf(marker) + marker.length;
const end = source.indexOf(";\n  const SAVE_KEY", start);
const data = JSON.parse(source.slice(start, end));

test("generated data matches the inspected game build", () => {
  assert.equal(data.appBuild, "c0081498f2");
  assert.equal(data.langBuild, "01332b3d04");
  assert.equal(Object.keys(data.species).length, 649);
  assert.equal(data.species[4].n, "小火龙");
  assert.deepEqual(data.species[4].t, ["fire"]);
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

test("roaming capture failure is detected from the first attempt and resets immediately", () => {
  assert.ok(source.includes("runtime.lastRoamTries[roamer.id] = Number(save.legTries?.[roamer.id] || 0);"));
  assert.ok(source.includes('await exclusive("神兽捕获失败后重置", () => resetChapter(runtime.targetPlan))'));
  assert.ok(source.includes('phase: "transit"'));
  assert.ok(source.includes('await exclusive("继续章节重置", continueChapterReset)'));
  assert.ok(source.includes("中转已完成，立即返回"));
  assert.ok(source.includes("runtime.chapterReset = null;"));
  assert.ok(source.includes("章节重置完成"));
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
