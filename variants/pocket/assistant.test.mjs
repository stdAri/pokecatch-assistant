import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { parseHTML } from "./linkedom.worker.mjs";

const script = fs.readFileSync(new URL("./pokecatch-assistant.user.js", import.meta.url), "utf8");
const game = fs.readFileSync(new URL("./game-reference.txt", import.meta.url), "utf8");
const pure = { module: { exports: {} }, structuredClone };
vm.runInNewContext(script, pure);
const api = pure.module.exports;
const plain = (value) => JSON.parse(JSON.stringify(value));
const mon = (uid, id, reg = "sinnoh", level = 70) => ({ uid, id, reg, level, shiny: false });
const baseSave = () => ({ adv: { chapter: 59, unlocked: 59 }, link: { to: "sinnoh", side: "to" }, mons: [], team: [], teamSets: { on: 0, list: [[], null, null, null, null] }, dex: {}, items: {} });

const collectionIds = [47902, 47905, 47901, 47903, 47904, 41201];
const rainyDay = { now: new Date(2026, 10, 16, 12).getTime(), phase: "day", weatherAt: () => "rain" };
const rotomSave = () => { const save = baseSave(); save.dex[479] = { caught: 1 }; return save; };

test("单文件用户脚本限定两个游戏域名、顶层页面，且没有外部运行依赖", () => {
  const metadata = script.slice(0, script.indexOf('// ==/UserScript=='));
  assert.ok(script.startsWith('// ==UserScript=='));
  assert.equal((metadata.match(/@match\s+/g) || []).length, 2);
  assert.match(metadata, /@noframes\s/);
  assert.match(metadata, /@run-at\s+document-idle/);
  assert.doesNotMatch(metadata, /@(require|resource|connect|downloadURL|updateURL)\s/);
  assert.ok(!script.includes('/*__GAME_DATA__*/'));
});

test("暴力猴沙箱下的重复初始化只保留一个面板与一个定时器", (t) => {
  const f = fixture({ scriptHandler: 'Violentmonkey' });
  t.after(() => f.document.defaultView.__pokeCatchAssistant?.destroy());
  f.api.init(); f.api.init();
  assert.equal(f.document.querySelectorAll('#pca-panel').length, 1);
  assert.equal(f.intervalCount(), 1);
  assert.equal(f.document.querySelector('#pca-panel').dataset.pcaSource, 'Violentmonkey');
  assert.equal(f.document.querySelector('#pca-panel').dataset.pcaVersion, '0.1.5-pocket.2');
});

test("安装迁移只恢复一次草稿，保留已保存候选池与果子配置", (t) => {
  const f = fixture({ scriptHandler: 'Violentmonkey' });
  t.after(() => f.document.defaultView.__pokeCatchAssistant?.destroy());
  f.api.settings.candidatePool = { enabled: true, minBst: 495, uids: ['a','b'] };
  f.api.settings.berries['pinap-berry'].enabled = true;
  const saved = JSON.stringify(f.api.settings);
  f.store.set('pca.settings.v1', saved);
  const draft = { enabled: true, minBst: 480, uids: ['d','e'], query: '395', onlyEligible: false };
  f.sessionStore.set('pca.installMigration.v1',JSON.stringify({settings:f.api.settings,draft,intent:'collect',paused:false}));
  f.api.init();
  assert.deepEqual(plain(f.api.getPoolDraft()), draft);
  assert.equal(f.store.get('pca.settings.v1'),saved);
  assert.equal(f.sessionStore.has('pca.installMigration.v1'),false);
  const receipt = JSON.parse(f.sessionStore.get('pca.installReceipt.v1'));
  assert.equal(receipt.settingsPreserved,true); assert.equal(receipt.draftPreserved,true);
  assert.equal(receipt.source,'Violentmonkey');
  f.api.getPoolDraft().minBst=400;
  f.api.restoreInstallationDraft();
  assert.equal(f.api.getPoolDraft().minBst,400);
});

test("复现遗漏：洛托姆形态来自static而非野生表，并受条件与解锁限制", () => {
  const save = rotomSave();
  const plan = api.chooseMissingPlan(save, rainyDay, collectionIds);
  assert.deepEqual(plain(plan.speciesIds), [47902, 47905]);
  assert.equal(plan.chapter, 52);
  assert.deepEqual(plain(plan.targets).map((p) => [p.kind, p.stepIndex, p.sourceZone]), [["static", 6, "Route 213"], ["static", 11, "Jardin Trophée"]]);
  assert.equal(api.plansForSpecies(save, 47901, rainyDay).length, 0);
  assert.equal(api.plansForSpecies(save, 47902, { ...rainyDay, weatherAt: () => null }).length, 0);
  assert.equal(api.plansForSpecies(save, 47905, { ...rainyDay, phase: "night" }).length, 0);
  assert.equal(api.plansForSpecies(save, 47903, { ...rainyDay, phase: "night", weatherAt: () => "blizzard" })[0].chapter, 55);
  assert.equal(api.plansForSpecies(save, 47904, { ...rainyDay, weatherAt: () => "storm" })[0].chapter, 49);
  save.adv.unlocked = 65;
  assert.equal(api.plansForSpecies(save, 47901, { ...rainyDay, weatherAt: () => "ash" })[0].chapter, 65);
  delete save.dex[479];
  assert.equal(api.plansForSpecies(save, 47902, rainyDay).length, 0);
  save.dex[479] = { caught: 1 };
  save.adv.gifts = { "rotom-wash": true };
  assert.equal(api.plansForSpecies(save, 47902, rainyDay).length, 0);
});

test("同章合并：抓到前段继续后段，抓到后段则缩短到前段", () => {
  const f = fixture();
  f.save.dex[479] = { caught: 1 };
  f.api.settings.manualTargets = collectionIds;
  const plan = f.api.chooseMissingPlan(f.save, rainyDay);
  assert.equal(plan.lastStepIndex, 11);
  f.save.dex[47902] = { caught: 1 };
  const tail = f.api.refreshCollectPlan(f.save, plan, rainyDay);
  assert.deepEqual(plain(tail.speciesIds), [47905]);
  assert.equal(tail.lastStepIndex, 11);
  delete f.save.dex[47902];
  f.save.dex[47905] = { caught: 1 };
  const head = f.api.refreshCollectPlan(f.save, plan, rainyDay);
  assert.deepEqual(plain(head.speciesIds), [47902]);
  assert.equal(head.lastStepIndex, 6);
  f.save.dex[47902] = { caught: 1 };
  assert.equal(f.api.refreshCollectPlan(f.save, plan, rainyDay), null);
});

test("只走实际生成的节点：两处、单处、全未生成及天气已变化", () => {
  const save = rotomSave();
  save.adv.chapter = 52;
  const plan = api.chooseMissingPlan(save, rainyDay, collectionIds);
  save.adv.nodes = [{ name: "Route 213", type: "wild" }, { name: "Route 213", type: "static", id: 47902 }, { name: "Grand Marais", type: "wild" }, { name: "Jardin Trophée", type: "static", id: 47905 }, { name: "Route 212 (nord)", type: "wild" }];
  save.adv.node = 2;
  assert.equal(api.timelinePlanStatus(plan, save).lastWild, 3);
  save.adv.nodes.splice(3, 1);
  assert.equal(api.timelinePlanStatus(plan, save).lastWild, 1);
  assert.equal(api.timelinePlanStatus(plan, save).current, 2);
  assert.equal(api.plansForSpecies(save, 47902, { ...rainyDay, weatherAt: () => null }).length, 1);
  save.adv.nodes.splice(1, 1);
  assert.equal(api.timelinePlanStatus(plan, save).lastWild, -1);
});

test("普通野生目标也同章合并，零权重时间条件不会被基础表覆盖", () => {
  const save = baseSave();
  const route = api.DATA.chapters[50].routes[0];
  const weights = api.routeWeights(route, save, 50, rainyDay);
  const ids = Object.keys(weights).filter((id) => weights[id] > 0).slice(0, 2).map(Number);
  const plan = api.chooseMissingPlan(save, rainyDay, ids);
  assert.ok(plan.speciesIds.every((id) => ids.includes(id)));
  assert.equal(plan.speciesIds.length, 2);
  const [key, habitat] = Object.entries(api.DATA.habitats).find(([, item]) => Object.values(item.night || {}).includes(0));
  const id = Object.keys(habitat.night).find((value) => habitat.night[value] === 0);
  const testRoute = { habitat: key, sourceName: key.split("|")[0], areas: [], bg: "prairie" };
  assert.equal(api.routeWeights(testRoute, save, 50, { ...rainyDay, phase: "night" })[id], 0);
});

// 从游戏主文件提取原始函数，对照而非用助手自己的结果生成期望值。
function functionBody(marker) {
  const start = game.indexOf(marker) + marker.length - 1;
  assert.ok(start >= marker.length - 1);
  let depth = 0, quote = null, escaped = false;
  for (let i = start; i < game.length; i += 1) {
    const ch = game[i];
    if (quote) { if (escaped) escaped = false; else if (ch === "\\") escaped = true; else if (ch === quote) quote = null; }
    else if (["\"", "'", "`"].includes(ch)) quote = ch;
    else if (ch === "{") depth += 1;
    else if (ch === "}" && --depth === 0) return game.slice(start, i + 1);
  }
  throw new Error("函数未闭合");
}

test("天气与昼夜按实际游戏函数对照，覆盖7天、多个形态地区与时段", () => {
  const save = rotomSave();
  const context = { now: 0, e: (text) => text, zn() {}, CustomEvent: class {}, a: { CONFIG: { WEATHER: api.DATA.weather }, Game: { S: save }, dispatchEvent() {} } };
  context.a.Clock = { now: () => context.now };
  context.a.STORY = { CHAPTERS: api.DATA.chapters.map((ch) => ({ ...ch, steps: ch.steps.map((s) => ({ ...s, name: s.sourceName })) })), regionOf: (index) => ({ key: api.DATA.chapters[index].region }) };
  vm.runInNewContext(`a.DAYTIME=(function()${functionBody("a.DAYTIME=function(){")})();a.WEATHER=(function()${functionBody("a.WEATHER=function(){")})();`, context);
  for (let day = 15; day < 22; day += 1) for (const hour of [1, 8, 12, 19, 21]) {
    context.now = new Date(2026, 10, day, hour).getTime();
    for (const index of [49, 52, 55, 65]) for (const step of api.DATA.chapters[index].steps.filter((s) => s.kind === "static")) {
      const expected = context.a.WEATHER.current({ ...step, name: step.sourceName, ch: index });
      assert.equal(api.weatherAt(save, step, index, context.now), expected, `${day}/${hour}/${index}/${step.id}`);
    }
  }
});

test("每日树位置与游戏原函数逐日一致；412-A只在砂土地点当天进入候选", () => {
  const source = "const " + game.slice(game.indexOf("X=k=>(k=Math.imul(k^k>>>16,2146121005)"), game.indexOf("const L=(k,M)=>k===M||M?.startsWith(k+\"|\")"));
  assert.ok(source.length > 1000);
  const context = {};
  vm.runInNewContext(`${source};this.actualSpot=T;`, context);
  const honey = api.DATA.dailySpots.find((spot) => spot.honey);
  const save = rotomSave();
  for (let day = 2; day <= 30; day += 1) {
    const now = new Date(2026, 10, day, 12).getTime();
    const expected = context.actualSpot(honey, Date.UTC(2026, 10, day) / 864e5);
    assert.equal(api.dailySpotZone(honey, now), expected);
    const routes = api.plansForSpecies(save, 41201, { ...rainyDay, now });
    if (["Route 206", "Route 211"].includes(expected)) { assert.ok(routes.length); assert.ok(routes.every((r) => r.sourceZone === expected)); }
    else assert.equal(routes.length, 0, expected);
  }
});

test("优先目标条件不满足时等待，不退回无关目标；完成后恢复全图鉴", () => {
  const save = rotomSave();
  assert.equal(api.chooseMissingPlan(save, { ...rainyDay, phase: "night", weatherAt: () => null }, collectionIds), null);
  for (const id of collectionIds) save.dex[id] = { caught: 1 };
  assert.ok(api.chooseMissingPlan(save, rainyDay, collectionIds));
});

function collectionFixture() {
  const f = fixture();
  f.save.dex[479] = { caught: 1 };
  Object.assign(f.save.adv, { chapter: 52, node: 0, nodes: [{ type: "static", id: 47902, name: "Route 213" }, { type: "wild", name: "Grand Marais" }, { type: "static", id: 47905, name: "Jardin Trophée" }, { type: "wild", name: "Route 212 (nord)" }] });
  f.api.settings.manualTargets = collectionIds;
  f.api.settings.roamingPriority = [];
  f.api.runtime.mode = "collect";
  f.api.runtime.targetPlan = f.api.chooseMissingPlan(f.save, rainyDay);
  const visits = [];
  for (const index of [51, 52]) {
    const row = f.document.createElement("button"); row.className = "mp-row"; row.dataset.ch = index;
    const go = f.document.createElement("button"); go.className = "mp-go"; go.dataset.go = index;
    go.onclick = () => { visits.push(index); f.save.adv.chapter = index; f.save.adv.node = 0; persist(); };
    f.document.body.append(row, go);
  }
  const persist = () => f.store.set("gachamon-save-v1", JSON.stringify(f.save));
  persist();
  return { ...f, visits, persist };
}

test("主收集流程抓到B后继续E，到E结束才通过界面中转并返回原章", async () => {
  const f = collectionFixture();
  f.save.dex[47902] = { caught: 1 }; f.save.adv.node = 1; f.persist();
  await f.api.collectTick(f.save);
  assert.deepEqual(plain(f.api.runtime.targetPlan.speciesIds), [47905]);
  assert.deepEqual(f.visits, []);
  f.save.adv.node = 3; f.persist();
  await f.api.collectTick(f.save);
  assert.deepEqual(f.visits, [51, 52]);
  assert.equal(f.save.adv.chapter, 52);
});

test("奖励待结算时等待，切章中停止会取消后续操作而不报超时", async () => {
  const f = collectionFixture();
  // 已生成的静态事件不依赖执行测试时的真实天气；在第一次正常切章回调中
  // 停止，避免1ms定时器与异步界面的竞态，也验证后续返回原章确实被取消。
  f.api.settings.manualTargets = [47902];
  f.save.adv.nodes = [{ type: "static", id: 47902, name: "Route 213" }];
  f.save.adv.node = 1;
  f.save.adv.pending = { choose: true }; f.persist();
  await f.api.collectTick(f.save);
  assert.deepEqual(f.visits, []);
  delete f.save.adv.pending; f.persist();
  const go = f.document.querySelector('.mp-go[data-go="51"]');
  const originalClick = go.onclick;
  go.onclick = () => { originalClick(); f.api.stopMode(); };
  await f.api.collectTick(f.save);
  assert.equal(f.api.runtime.mode, "idle");
  assert.deepEqual(f.visits, [51]);
  assert.equal(f.api.runtime.error, null);
});

test("本轮没有目标节点时不打无关战斗，直接中转返回", async () => {
  const f = collectionFixture();
  const weights = f.api.routeWeights(f.api.DATA.chapters[52].routes[0], f.save, 52);
  const id = Number(Object.keys(weights).find((key) => weights[key] > 0));
  f.api.settings.manualTargets = [id];
  f.api.runtime.targetPlan = f.api.refreshCollectPlan(f.save, { chapter: 52, speciesIds: [id] });
  assert.ok(f.api.runtime.targetPlan);
  f.save.adv.nodes = [{ type: "trainer", name: "Route 213" }]; f.persist();
  await f.api.collectTick(f.save);
  assert.deepEqual(f.visits, [51, 52]);
});

test("联盟是合并入口L，已解锁后段也必须从首位进入，内部按实际进度继续", () => {
  const save = baseSave();
  save.adv.unlocked = 63;
  save.adv.chapter = 55;
  assert.ok(api.DATA.chapters.slice(60, 65).every((ch) => ch.league));
  assert.equal(api.DATA.chapters[65].league, false);
  assert.equal(api.pushFrontier(save), 60);
  save.adv.chapter = 61;
  assert.equal(api.pushFrontier(save), 61);
  save.adv.chapter = 60; // 战败回到首位，不能跳回已解锁的63。
  assert.equal(api.pushFrontier(save), 60);
  save.adv.unlocked = 65;
  assert.equal(api.pushFrontier(save), 65);
});

test("从刷图恢复联盟时点击合并入口并配队，不再等待不存在的数字章节行", async () => {
  const f = fixture();
  f.save.adv.chapter = 55; f.save.adv.unlocked = 60;
  f.api.runtime.mode = "push";
  f.api.settings.candidatePool = { enabled: true, minBst: 0, uids: ["a", "b", "c"] };
  const visits = [];
  const row = f.document.createElement("button"); row.className = "mp-row"; row.dataset.ch = "L";
  const go = f.document.createElement("button"); go.className = "mp-go"; go.dataset.go = "L";
  go.onclick = () => { visits.push("L"); f.save.adv.chapter = 60; f.store.set("gachamon-save-v1", JSON.stringify(f.save)); };
  f.document.body.append(row, go);
  f.store.set("gachamon-save-v1", JSON.stringify(f.save));
  await f.api.pushTick(f.save);
  assert.deepEqual(visits, ["L"]);
  assert.equal(f.save.adv.chapter, 60);
  await f.api.pushTick(f.save);
  assert.equal(f.api.runtime.target, "push:60");
  assert.equal(f.api.runtime.error, null);
  assert.deepEqual(new Set(f.save.team), new Set(["a", "b", "c"]));
});

test("联盟战败后依实际首位重新配队，不尝试直达已解锁后段", async () => {
  const f = fixture();
  f.save.adv.unlocked = 63; f.save.adv.chapter = 61;
  f.api.runtime.mode = "push"; f.api.settings.lockTeam5 = true;
  f.store.set("gachamon-save-v1", JSON.stringify(f.save));
  await f.api.pushTick(f.save);
  assert.equal(f.api.runtime.target, "push:61");
  f.save.adv.chapter = 60;
  f.store.set("gachamon-save-v1", JSON.stringify(f.save));
  await f.api.pushTick(f.save);
  assert.equal(f.api.runtime.target, "push:60");
  assert.equal(f.api.runtime.error, null);
});

test("自动轮换：优先名单全部完成即推图，不退回其他缺失图鉴", () => {
  const f = fixture();
  f.api.settings.manualTargets = [47902, 47905];
  f.save.dex[47902] = { caught: 1 }; f.save.dex[47905] = { caught: 1 };
  assert.deepEqual(plain(f.api.autoModeDecision(f.save, rainyDay)), { mode: "push", reason: "优先目标已全部捕获" });
});

test("自动轮换：天气/时段不可刷则推图，条件恢复后重回收集", () => {
  const f = fixture();
  f.save.dex[479] = { caught: 1 };
  f.api.settings.manualTargets = [47902, 47905];
  const blocked = { ...rainyDay, phase: "night", weatherAt: () => null };
  assert.equal(f.api.autoModeDecision(f.save, blocked).mode, "push");
  assert.equal(f.api.autoModeDecision(f.save, rainyDay).mode, "collect");
  f.api.runtime.intent = "collect"; f.api.runtime.collectRegion = "sinnoh"; f.api.runtime.mode = "collect";
  assert.equal(f.api.reconcileAutomaticMode(f.save, blocked), true);
  assert.equal(f.api.runtime.mode, "push");
  assert.equal(f.api.reconcileAutomaticMode(f.save, rainyDay), true);
  assert.equal(f.api.runtime.mode, "collect");
  const logs = f.api.runtime.logs.length;
  assert.equal(f.api.reconcileAutomaticMode(f.save, rainyDay), false);
  assert.equal(f.api.runtime.logs.length, logs);
});

test("自动轮换：章节未解锁先推图，解锁且天气合适后恢复该形态", () => {
  const f = fixture(); f.save.dex[479] = { caught: 1 }; f.api.settings.manualTargets = [47901];
  const ash = { ...rainyDay, weatherAt: () => "ash" };
  assert.equal(f.api.autoModeDecision(f.save, ash).mode, "push");
  f.save.adv.unlocked = 65;
  assert.equal(f.api.autoModeDecision(f.save, ash).mode, "collect");
});

test("10%本轮未生成仍属于可刷，不在收集和推图之间抖动；已生成节点保留", () => {
  const f = fixture(); f.save.dex[479] = { caught: 1 }; f.api.settings.manualTargets = [47903];
  f.save.adv.nodes = [];
  assert.equal(f.api.autoModeDecision(f.save, { ...rainyDay, phase: "night", weatherAt: () => "blizzard" }).mode, "collect");
  f.api.settings.manualTargets = [47902];
  Object.assign(f.save.adv, { chapter: 52, nodes: [{ type: "static", id: 47902, name: "Route 213" }] });
  assert.equal(f.api.autoModeDecision(f.save, { ...rainyDay, phase: "night", weatherAt: () => null }).mode, "collect");
});

test("战斗/奖励结算/暂停/忙时不切换；停止后不自行恢复，纯推图不受打断", () => {
  const f = fixture(); f.api.settings.manualTargets = [47901];
  Object.assign(f.api.runtime, { intent: "collect", mode: "collect", collectRegion: "sinnoh" });
  for (const state of ["battle", "pending"]) {
    f.save.adv[state] = {};
    assert.equal(f.api.reconcileAutomaticMode(f.save), false);
    delete f.save.adv[state];
  }
  for (const state of ["paused", "busy"]) {
    f.api.runtime[state] = true;
    assert.equal(f.api.reconcileAutomaticMode(f.save), false);
    f.api.runtime[state] = false;
  }
  assert.equal(f.api.reconcileAutomaticMode(f.save), true);
  assert.equal(f.api.runtime.mode, "push");
  f.api.stopMode();
  assert.equal(f.api.reconcileAutomaticMode(f.save), false);
  assert.equal(f.api.runtime.mode, "idle");
  Object.assign(f.api.runtime, { mode: "push", intent: "push" });
  f.api.settings.manualTargets = [47905]; f.save.dex[479] = { caught: 1 };
  assert.equal(f.api.reconcileAutomaticMode(f.save, rainyDay), false);
  assert.equal(f.api.runtime.mode, "push");
});

test("自动切换保留候选池、有效BST、道具、草稿和失败记录，会话保留收集意图", () => {
  const f = fixture();
  f.api.settings.manualTargets = [47901];
  f.api.settings.candidatePool = { enabled: true, minBst: 495, uids: ["a", "b"] };
  f.api.settings.berries['golden-razz-berry'] = { enabled: true, reserve: 2 };
  Object.assign(f.api.getPoolDraft(), { minBst: 480, uids: ["d"], query: "395" });
  const settings = JSON.stringify(f.api.settings), draft = JSON.stringify(f.api.getPoolDraft());
  Object.assign(f.api.runtime, { intent: "collect", mode: "collect", collectRegion: "sinnoh", targetPlan: { chapter: 55 }, teamPlan: { old: true } });
  f.api.runtime.failureTeams.set(60, new Set(["test"]));
  assert.equal(f.api.reconcileAutomaticMode(f.save), true);
  assert.equal(JSON.stringify(f.api.settings), settings);
  assert.equal(JSON.stringify(f.api.getPoolDraft()), draft);
  assert.ok(f.api.runtime.failureTeams.get(60).has("test"));
  assert.equal(f.api.runtime.targetPlan, null);
  assert.equal(f.api.runtime.teamPlan, null);
  const session = JSON.parse(f.store.get('pca.session.v1'));
  assert.equal(session.mode, "collect"); assert.equal(session.phase, "push");
});

test("自动回退实际进入联盟并从原候选池配队", async () => {
  const f = fixture();
  f.save.adv.chapter = 55; f.save.adv.unlocked = 60; f.api.settings.manualTargets = [47901];
  f.api.settings.candidatePool = { enabled: true, minBst: 495, uids: ["a", "b"] };
  Object.assign(f.api.runtime, { intent: "collect", mode: "collect", collectRegion: "sinnoh" });
  const row = f.document.createElement("button"); row.className = "mp-row"; row.dataset.ch = "L";
  const go = f.document.createElement("button"); go.className = "mp-go"; go.dataset.go = "L";
  go.onclick = () => { f.save.adv.chapter = 60; f.store.set('gachamon-save-v1',JSON.stringify(f.save)); };
  f.document.body.append(row, go); f.store.set('gachamon-save-v1',JSON.stringify(f.save));
  await f.api.tick(); await f.api.tick();
  assert.equal(f.api.runtime.mode, "push"); assert.equal(f.api.runtime.intent, "collect");
  assert.equal(f.api.runtime.target, "push:60"); assert.equal(f.api.runtime.error, null);
  assert.deepEqual(new Set(f.save.team), new Set(["a", "b"]));
});

test("面板能关闭自动轮换，关闭后返回普通收集而非持续自动推图", () => {
  const f = fixture(); f.api.renderPanel();
  const checkbox = f.document.querySelector('[data-setting="autoPushWhenWaiting"]');
  assert.ok(checkbox); assert.ok(checkbox.hasAttribute('checked'));
  Object.assign(f.api.runtime, { intent: "collect", mode: "push", collectRegion: "sinnoh" });
  checkbox.checked = false; checkbox.dispatchEvent(new f.document.defaultView.Event('change',{bubbles:true}));
  assert.equal(f.api.settings.autoPushWhenWaiting, false);
  assert.equal(f.api.reconcileAutomaticMode(f.save), true);
  assert.equal(f.api.runtime.mode, "collect");
});

// 对照的是实际游戏的地区函数，不用修正版自身的判断充当预期答案。
const regionStart = game.indexOf("function ka(t){");
const regionEnd = game.indexOf("function de(t){", regionStart);
assert.ok(regionStart > 0 && regionEnd > regionStart);
function gameCan(save, pokemon, targetRegion) {
  const context = { d: save, Wa: { kanto2: "johto" }, hn: () => save.mons, e: (text) => text, a: { STORY: { REGIONS: [...new Set(api.DATA.chapters.map((item) => item.region))].map((key) => ({ key })), regionOf: (index) => ({ key: api.DATA.chapters[index].region }) } } };
  vm.runInNewContext(`${game.slice(regionStart, regionEnd)};this.actualCan=O;`, context);
  return !context.actualCan(pokemon, targetRegion ? "region" : "adventure", targetRegion);
}

test("所有游戏形态别名均可往返解析，且基础种与形态保持独立", () => {
  for (const [alias, id] of Object.entries(api.DATA.dexAliases)) {
    assert.deepEqual(plain(api.parseTargetInput(alias.toLowerCase())).ids, [id]);
    assert.equal(api.formatDexId(id), alias);
  }
  assert.deepEqual(plain(api.parseTargetInput("479,479-A,479-B")), { ids: [479, 47901, 47902], invalid: [] });
  assert.equal(api.species(47901).n, "洛托姆 (加热形态)");
  assert.deepEqual(plain(api.species(47901).t), ["electric", "fire"]);
  assert.ok(api.species(47901).l.some(([, move]) => move === "overheat"));
});

test("兼容全角、小写、不同短横线、内部编号、名称、去重与无效反馈", () => {
  assert.deepEqual(plain(api.parseTargetInput("＃４７９－ａ，47901；479–B 201-? 201-! 洛托姆 479-Z 99999")), { ids: [47901, 47902, 20127, 20126, 479], invalid: ["479-Z", "99999"] });
  assert.deepEqual(plain(api.parseTargetInput(api.species(47902).n)), { ids: [47902], invalid: [] });
  assert.deepEqual(plain(api.parseTargetInput("烈咬陆鲨")), { ids: [445], invalid: [] });
});

test("形态捕获标记不会被基础种误替代，没有野生路线不会虚构路线", () => {
  const save = baseSave();
  save.dex[479] = { caught: 1 };
  assert.equal(api.isCaught(save, 47901), false);
  assert.equal(api.plansForSpecies(save, 47901).length, 0);
  save.dex[47901] = { caught: 1 };
  assert.equal(api.isCaught(save, 47901), true);
});

test("地区筛选逐项符合真实 Game.can，包括通关合并、旧地区和缺省来源", () => {
  const save = baseSave();
  for (const link of [null, { to: "sinnoh", side: "to" }, { to: "sinnoh", side: "from" }, { to: "johto", side: "to" }]) {
    save.link = link;
    for (const reg of ["sinnoh", "kanto", "johto", "hoenn", "kanto2", undefined, "unknown"]) {
      const item = mon("a", 445, reg);
      if (reg === undefined) delete item.reg;
      assert.equal(api.canBattleMon(save, item), gameCan(save, item), JSON.stringify({ link, reg }));
    }
  }
});

test("按目标章节判断跨地区候选；高等级外地区成员不能混入神奥队伍", () => {
  const save = baseSave();
  save.mons = [mon("foreign", 249, "johto", 100), mon("native", 445), mon("sameSpeciesWrongHome", 445, "kanto", 100)];
  const result = api.recommendTeam(save, [130]);
  assert.deepEqual(plain(result.mons).map((item) => item.uid), ["native"]);
  const oldChapter = api.DATA.chapters.find((chapter) => chapter.region === "johto").index;
  assert.equal(api.canBattleMon(save, save.mons[0], oldChapter), gameCan(save, save.mons[0], "johto"));
});

test("推荐队伍遵守游戏重复成员规则，形态不会相互挤出导致配队超时", () => {
  const save = baseSave();
  save.mons = [mon("a", 479), mon("b", 47901), mon("c", 47902), mon("d", 445), mon("e", 445), { ...mon("f", 445), shiny: true }];
  const selected = api.recommendTeam(save, [130]).mons;
  assert.equal(selected.filter((item) => [479, 47901, 47902].includes(item.id)).length, 1);
  assert.equal(selected.filter((item) => item.id === 445).length, 2);
});

// 使用游戏原始的 pointerdown/move/up 和 L()提交函数作为交互对照。
// 仅替代布局、声音、虚拟列表及存盘介质；不执行游戏网络或主循环。
const dragStart = game.indexOf("let he=null;const $a=(C,A,Le)=>A>=C.left");
const dragEnd = game.indexOf("const q=C=>C.item", dragStart);
assert.ok(dragStart > 0 && dragEnd > dragStart);
const actualDragSource = game.slice(dragStart, dragEnd);

function fixture({ badGeometry = false, scriptHandler = null } = {}) {
  const { document, window } = parseHTML(`<html><head></head><body><nav id="tabs"><button data-screen="adventure" class="active"></button><button data-screen="team"></button></nav><div id="team-sets"></div><div id="team-slots"></div><div id="team-mini"></div><input id="pc-search"><input id="pca-manual-targets"><select id="pc-sort"><option value="recent">recent</option></select><div id="pc-active"></div><div id="pc-grid"></div></body></html>`);
  Object.defineProperty(document, "scripts", { get: () => document.querySelectorAll("script") });
  const save = baseSave();
  save.mons = [mon("a", 445), mon("b", 448), mon("c", 392), mon("d", 395), mon("e", 475), mon("f", 476), mon("g", 398), mon("h", 405), mon("foreign", 249, "johto", 100)];
  save.team = save.mons.slice(0, 6).map((item) => item.uid);
  save.teamSets.list[0] = save.team;
  const store = new Map();
  let detailClicks = 0;
  let intervalCount = 0;
  const sessionStore = new Map();
  const context = { module: { exports: {} }, structuredClone, document, console: { log() {}, error() {} }, Date, Math, DOMException, CSS: { escape: (value) => value }, setTimeout: (callback, ms) => setTimeout(callback, Math.min(ms, 3)), clearTimeout, clearInterval, Event: window.Event, scrollX: 0, scrollY: 0, innerHeight: 900, scrollBy() {}, addEventListener() {}, removeEventListener() {}, cancelAnimationFrame() {}, nn: () => 1, Oe: { matches: false }, ht: [], he: null, s: (selector) => document.querySelector(selector), e: (text) => text, H: String, z() {}, ha: () => !!document.querySelector("#pc-search").value, ve: () => null, xe: (_layout, action) => action() };
  class PointerEvent extends window.Event { constructor(type, values) { super(type, values); for (const [key, value] of Object.entries(values)) { if (!["bubbles", "cancelable"].includes(key)) Object.defineProperty(this, key, { value }); } } }
  context.PointerEvent = PointerEvent;
  context.setInterval = () => ++intervalCount;
  context.sessionStorage = { getItem: (key) => sessionStore.get(key) || null, setItem: (key, value) => sessionStore.set(key, value), removeItem: (key) => sessionStore.delete(key) };
  if (scriptHandler) context.GM_info = { scriptHandler };
  context.ue = () => {}; // 浮动队伍栏布局更新，不影响拖动提交。
  context.window = window;
  context.localStorage = { getItem: (key) => store.get(key) || null, setItem: (key, value) => store.set(key, value) };
  const rect = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height });
  const setRect = (element, value) => { element.getBoundingClientRect = () => value; element.scrollIntoView = () => {}; };
  setRect(document.querySelector("#team-slots"), rect(0, 0, 600, 100));
  setRect(document.querySelector("#pc-grid"), rect(0, 200, 800, 400));
  function persist() { save.teamSets.list[save.teamSets.on] = save.team; store.set("gachamon-save-v1", JSON.stringify(save)); }
  function render() {
    const team = document.querySelector("#team-slots");
    team.innerHTML = "";
    for (let i = 0; i < 6; i += 1) {
      const cell = document.createElement("div");
      const uid = save.team[i];
      cell.className = uid ? "filled" : "empty";
      if (uid) { cell.dataset.uid = uid; cell.dataset.teamUid = uid; cell.addEventListener("pointerdown", (event) => context.va(event, cell, "team")); }
      setRect(cell, rect(i * 100, 0, 95, 90));
      team.append(cell);
    }
    const grid = document.querySelector("#pc-grid");
    grid.innerHTML = "";
    context.ht = save.mons.filter((item) => !save.team.includes(item.uid) && (!document.querySelector("#pc-search").value || String(item.id) === document.querySelector("#pc-search").value)).map((item) => item.uid);
    for (const [index, uid] of context.ht.entries()) {
      const cell = document.createElement("div");
      cell.className = "pc-cell";
      cell.dataset.uid = uid;
      setRect(cell, rect(index * 100, 220, badGeometry ? 0 : 90, 80));
      cell.addEventListener("pointerdown", (event) => context.va(event, cell, "pc"));
      cell.addEventListener("click", () => { detailClicks += 1; });
      grid.append(cell);
    }
  }
  context.B = { S: save, getMon: (uid) => save.mons.find((item) => item.uid === uid), can: (item) => gameCan(save, item) ? null : "region locked", keepOne: () => null, storageFull: () => false, save: persist, DEX: api.DATA.species };
  context.a = { UI: { touchHold: { start() {}, end() {}, waiting: () => false } }, Sfx: { click() {}, buy() {}, error() {} }, App: { refresh: render } };
  context.Za = { pin() {}, rect: (index) => document.querySelectorAll("#pc-grid .pc-cell")[index].getBoundingClientRect(), nearest: () => 0, offset: () => ({ dx: 0, dy: 0 }), cells: (callback) => [...document.querySelectorAll("#pc-grid .pc-cell")].forEach(callback) };
  for (const button of document.querySelectorAll("#tabs button")) button.onclick = () => { for (const item of document.querySelectorAll("#tabs button")) item.classList.toggle("active", item === button); };
  for (let i = 0; i < 5; i += 1) {
    const button = document.createElement("button");
    button.dataset.set = String(i);
    button.onclick = () => { save.teamSets.on = i; save.teamSets.list[i] ||= []; save.team = save.teamSets.list[i]; persist(); render(); };
    document.querySelector("#team-sets").append(button);
  }
  document.querySelector("#pc-search").addEventListener("input", render);
  vm.createContext(context);
  vm.runInContext(`${actualDragSource};this.va=va;`, context);
  vm.runInContext(script, context);
  persist();
  render();
  return { api: context.module.exports, save, document, detailClicks: () => detailClicks, store, sessionStore, intervalCount: () => intervalCount };
}

test("复现旧故障：点击电脑卡片仅打开详情，队伍保持不变", () => {
  const f = fixture();
  const before = [...f.save.team];
  f.document.querySelector('#pc-grid [data-uid="g"]').click();
  assert.equal(f.detailClicks(), 1);
  assert.deepEqual(f.save.team, before);
});

test("通过真实游戏拖动处理器从空第五队装入六名成员并返回冒险", async () => {
  const f = fixture();
  const original = [...f.save.team];
  const desired = ["g", "b", "c", "d", "e", "f"];
  await f.api.configurePreset(4, desired);
  assert.deepEqual(f.save.team, desired);
  assert.deepEqual(f.save.teamSets.list[0], original);
  assert.equal(f.save.teamSets.on, 4);
  assert.equal(f.detailClicks(), 0);
  assert.equal(f.document.querySelector("#tabs .active").dataset.screen, "adventure");
});

test("满队支持替换、重排及缩短为三人，保留正确顺序", async () => {
  const f = fixture();
  await f.api.configurePreset(4, ["a", "b", "c", "d", "e", "f"]);
  await f.api.configurePreset(4, ["h", "b", "g", "d", "e", "f"]);
  await f.api.configurePreset(4, ["g", "h", "b"]);
  assert.deepEqual(f.save.team, ["g", "h", "b"]);
  assert.equal(f.detailClicks(), 0);
});

test("拒绝非法地区成员时不切换或改写队伍", async () => {
  const f = fixture();
  const before = JSON.stringify(f.save.teamSets);
  await assert.rejects(f.api.configurePreset(4, ["foreign"]), /当前地区不能出战/);
  assert.equal(JSON.stringify(f.save.teamSets), before);
});

test("拖动区域失效时恢复原活动预设，避免留下空队出战", async () => {
  const f = fixture({ badGeometry: true });
  const original = [...f.save.team];
  await assert.rejects(f.api.configurePreset(4, ["g"]), /拖动区域尚未显示/);
  assert.equal(f.save.teamSets.on, 0);
  assert.deepEqual(f.save.team, original);
});

test("等待界面时停止任务会取消后续配队并保留原队伍", async () => {
  const f = fixture();
  const original = [...f.save.team];
  const pending = f.api.configurePreset(4, ["g"]);
  f.api.stopMode();
  await assert.rejects(pending, (error) => error.name === "AbortError");
  assert.equal(f.save.teamSets.on, 0);
  assert.deepEqual(f.save.team, original);
});

test("应用形态输入保存独立编号；全无效输入不清空旧目标", () => {
  const f = fixture();
  const input = f.document.querySelector("#pca-manual-targets");
  input.value = "479,479-a,201-?";
  f.api.applyManualTargets();
  assert.deepEqual(plain(f.api.settings.manualTargets), [479, 47901, 20127]);
  assert.equal(input.value, "479,479-A,201-?");
  input.value = "479-Z";
  f.api.applyManualTargets();
  assert.deepEqual(plain(f.api.settings.manualTargets), [479, 47901, 20127]);
  assert.equal(f.store.has("pca.settings.v1"), true);
});

test("候选池按个体严格限定，排除池外高等级、低BST与外地区成员", () => {
  const f = fixture();
  f.api.settings.candidatePool = { enabled: true, minBst: 500, uids: ["b", "d", "g", "foreign"] };
  const result = f.api.recommendTeam(f.save, [130]);
  assert.deepEqual(new Set(plain(result.mons).map((item) => item.uid)), new Set(["b", "d"]));
  assert.equal(f.api.poolSummary(f.save).eligible, 2);
});

test("500门槛含边界，0可取消门槛；关闭候选池恢复原选择范围", () => {
  const f = fixture();
  f.save.mons.push(mon("bronze", 437));
  f.api.settings.candidatePool = { enabled: true, minBst: 500, uids: ["bronze", "g"] };
  assert.equal(f.api.baseStatTotal(437), 500);
  assert.deepEqual(plain(f.api.teamCandidates(f.save)).map((item) => item.uid), ["bronze"]);
  f.api.settings.candidatePool.minBst = 501;
  assert.equal(f.api.teamCandidates(f.save).length, 0);
  f.api.settings.candidatePool.minBst = 0;
  assert.equal(f.api.teamCandidates(f.save).length, 2);
  f.api.settings.candidatePool.enabled = false;
  assert.equal(f.api.teamCandidates(f.save).length, 9);
});

test("同种新个体不会自动入池，进化保留选择，普通与异色可以独立勾选", () => {
  const f = fixture();
  f.save.mons.push({ ...mon("shiny", 445), shiny: true }, mon("new", 445));
  f.api.settings.candidatePool = { enabled: true, minBst: 0, uids: ["shiny"] };
  assert.deepEqual(plain(f.api.recommendTeam(f.save, [130]).mons).map((item) => item.uid), ["shiny"]);
  f.save.mons.find((item) => item.uid === "shiny").id = 47901;
  assert.deepEqual(plain(f.api.teamCandidates(f.save)).map((item) => item.uid), ["shiny"]);
});

test("空池或失效个体不会退回全电脑，也不会把空队激活出战", async () => {
  const f = fixture();
  const original = [...f.save.team];
  f.api.settings.candidatePool = { enabled: true, minBst: 500, uids: ["no-longer-owned"] };
  const plan = f.api.recommendTeam(f.save, [130]);
  assert.equal(plan.mons.length, 0);
  assert.equal(f.api.poolSummary(f.save).missing, 1);
  await f.api.applyRecommendedTeam(plan, "回归测试");
  assert.equal(f.api.runtime.paused, true);
  assert.equal(f.api.runtime.error, null);
  assert.deepEqual(f.save.team, original);
  assert.equal(f.save.teamSets.on, 0);
});

test("失败后重新配队仍只在已保存池内轮换", () => {
  const f = fixture();
  f.api.settings.candidatePool = { enabled: true, minBst: 0, uids: ["a", "b", "c", "d", "e", "f", "h"] };
  const first = f.api.recommendTeam(f.save, [130]);
  const next = f.api.recommendTeam(f.save, [130], new Set([first.signature]));
  assert.notEqual(next.signature, first.signature);
  assert.ok(next.mons.every((item) => f.api.settings.candidatePool.uids.includes(item.uid)));
});

test("候选池不会固定一套队伍，不同属性对手仍影响选人", () => {
  const f = fixture();
  f.save.mons = [392, 395, 445, 448, 475, 437, 461, 472, 466].map((id) => mon(`p${id}`, id));
  f.api.settings.candidatePool = { enabled: true, minBst: 500, uids: f.save.mons.map((item) => item.uid) };
  const waterFlying = f.api.recommendTeam(f.save, [130]);
  const grassIce = f.api.recommendTeam(f.save, [460]);
  assert.notDeepEqual(plain(waterFlying.mons).map((item) => item.id), plain(grassIce.mons).map((item) => item.id));
  for (const result of [waterFlying, grassIce]) assert.ok(result.mons.every((item) => f.api.settings.candidatePool.uids.includes(item.uid)));
});

test("候选池草稿、批量筛选与保存均通过真实面板事件工作", () => {
  const f = fixture();
  f.api.renderPanel();
  assert.ok(f.document.querySelector('[data-tab="pool"]'));
  const first = f.document.querySelector('#pca-pool-list [data-pool-uid="b"]');
  assert.ok(first);
  first.checked = true;
  first.dispatchEvent(new f.document.defaultView.Event("change", { bubbles: true }));
  assert.equal(f.api.settings.candidatePool.enabled, false);
  assert.equal(f.store.has("pca.settings.v1"), false);
  const originalSave = f.store.get("gachamon-save-v1");
  f.document.querySelector('[data-act="pool-save"]').click();
  assert.deepEqual(plain(f.api.settings.candidatePool), { enabled: true, minBst: 500, uids: ["b"] });
  assert.deepEqual(JSON.parse(f.store.get("pca.settings.v1")).candidatePool, { enabled: true, minBst: 500, uids: ["b"] });
  assert.equal(f.store.get("gachamon-save-v1"), originalSave);
  f.document.querySelector('[data-act="pool-clear"]').click();
  assert.equal(f.api.getPoolDraft().uids.length, 0);
  assert.equal(f.api.settings.candidatePool.uids.length, 1);
  f.document.querySelector('[data-act="pool-reset"]').click();
  assert.deepEqual(plain(f.api.getPoolDraft().uids), ["b"]);
  const search = f.document.querySelector("#pca-pool-search");
  search.value = "445";
  search.dispatchEvent(new f.document.defaultView.Event("input", { bubbles: true }));
  f.document.querySelector('[data-act="pool-select-visible"]').click();
  assert.deepEqual(new Set(plain(f.api.getPoolDraft().uids)), new Set(["a", "b"]));
});

test("运行中保存新池后重新配队，保留原捕获目标并支持少于六名", async () => {
  const f = fixture();
  const oldFirst = [...f.save.team];
  f.api.runtime.mode = "collect";
  f.api.runtime.target = "dex:443";
  const target = { speciesId: 443, chapter: 59, zone: "测试路线" };
  f.api.runtime.targetPlan = target;
  Object.assign(f.api.getPoolDraft(), { enabled: true, minBst: 500, uids: ["b", "d"] });
  assert.equal(f.api.saveCandidatePool(), true);
  assert.equal(f.api.runtime.reteamRequested, true);
  await f.api.tick();
  assert.equal(f.save.teamSets.on, 4);
  assert.deepEqual(new Set(f.save.team), new Set(["b", "d"]));
  assert.deepEqual(f.save.teamSets.list[0], oldFirst);
  assert.equal(f.api.runtime.targetPlan, target);
  assert.equal(f.api.runtime.reteamRequested, false);
  assert.equal(f.api.runtime.error, null);
});

test("配队进行时保存不生效；可保留草稿，后续再提交", () => {
  const f = fixture();
  Object.assign(f.api.getPoolDraft(), { enabled: true, minBst: 500, uids: ["b"] });
  f.api.runtime.busy = true;
  assert.equal(f.api.saveCandidatePool(), false);
  assert.equal(f.api.settings.candidatePool.enabled, false);
  assert.equal(f.api.getPoolDraft().uids.length, 1);
  f.api.runtime.busy = false;
  assert.equal(f.api.saveCandidatePool(), true);
});

test("候选池列表支持形态搜索，配置畸形值会被归一化", () => {
  const f = fixture();
  f.save.mons.push(mon("form", 47901));
  const rows = f.api.poolRows(f.save, { enabled: true, minBst: 0, uids: ["form"], query: "479-A", onlyEligible: true });
  assert.deepEqual(plain(rows).map((item) => item.uid), ["form"]);
  assert.equal(rows[0].checked, true);
  assert.deepEqual(plain(f.api.normalizePool(null)), { enabled: false, minBst: 500, uids: [] });
  assert.deepEqual(plain(f.api.normalizePool({ enabled: true, minBst: -2, uids: ["b", "b", null] })), { enabled: true, minBst: 0, uids: ["b"] });
});

test("异色皮克西按483×1.10=531.3进入500候选，普通皮克西仍被排除", () => {
  const f = fixture();
  f.save.mons = [mon("plain", 36), { ...mon("shiny", 36), shiny: true }];
  f.api.settings.candidatePool = { enabled: true, minBst: 500, uids: ["plain", "shiny"] };
  assert.equal(f.api.baseStatTotal(36), 483);
  assert.equal(f.api.effectiveStatTotal(f.save.mons[1]), 531.3);
  assert.deepEqual(plain(f.api.teamCandidates(f.save)).map((m) => m.uid), ["shiny"]);
  const rows = f.api.poolRows(f.save, { enabled: true, minBst: 500, uids: [], query: "36", onlyEligible: true });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].baseBst, 483);
  assert.equal(rows[0].bst, 531.3);
  assert.match(rows[0].statNote, /异色\+10%/);
});

test("宝石每档乘1.15，异色与强化相乘，筛选保留小数不提前取整", () => {
  const f = fixture();
  const item = { ...mon("gem", 36), rank: 1 };
  assert.equal(f.api.effectiveStatTotal(item), 555.45);
  item.shiny = true;
  assert.equal(f.api.effectiveStatTotal(item), 610.995);
  assert.notEqual(f.api.effectiveStatTotal(item), 483 * 1.25);
  item.rank = 2;
  assert.equal(f.api.effectiveStatTotal(item), 702.64425);
  f.save.mons = [{ ...item, rank: 1 }];
  f.api.settings.candidatePool = { enabled: true, minBst: 611, uids: ["gem"] };
  assert.equal(f.api.teamCandidates(f.save).length, 0);
  f.api.settings.candidatePool.minBst = 610;
  assert.equal(f.api.teamCandidates(f.save).length, 1);
});

test("强化档数与真实游戏rankOf一致，异常/小数档数不会越界", () => {
  const f = fixture();
  const begin = game.indexOf("ga=t=>Math.min(s.UNDERGROUND.RANK_MAX");
  const end = game.indexOf(",na=", begin);
  assert.ok(begin > 0 && end > begin);
  const context = { s: { UNDERGROUND: { RANK_MAX: 5 } } };
  vm.runInNewContext(`const ${game.slice(begin, end)};this.rankOf=ga`, context);
  for (const rank of [undefined, null, -1, 0, 1, "2", 2.9, 5, 99, "invalid", Infinity]) {
    assert.equal(f.api.rankOf({ rank }), context.rankOf({ rank }));
  }
  assert.equal(f.api.DATA.rankStatMultiplier, 1.15);
  assert.equal(f.api.DATA.shinyStatBonus, 0.1);
});

test("推荐评分与列表同样计入异色和强化，选入当前队伍也用有效值", () => {
  const f = fixture();
  f.save.mons = [mon("plain", 36), { ...mon("shiny", 36), shiny: true }, { ...mon("ranked", 36), rank: 1 }];
  f.api.settings.candidatePool = { enabled: true, minBst: 500, uids: ["plain", "shiny", "ranked"] };
  const plan = f.api.recommendTeam(f.save, [130]);
  assert.equal(plan.mons[0].uid, "ranked");
  assert.ok(plan.details.every((detail) => detail.reason.includes("有效BST")));
  f.save.team = ["plain", "shiny", "ranked"];
  f.store.set("gachamon-save-v1", JSON.stringify(f.save));
  Object.assign(f.api.getPoolDraft(), { enabled: true, minBst: 500, uids: [] });
  f.api.poolSelectionAction("pool-current");
  assert.deepEqual(plain(f.api.getPoolDraft().uids), ["shiny", "ranked"]);
});

test("自动树果与当前游戏BUFF_BERRIES完全一致，新增游走选项默认关闭", () => {
  const begin = game.indexOf("BUFF_BERRIES:") + "BUFF_BERRIES:".length;
  const end = game.indexOf(",UNDERGROUND:", begin);
  const actual = vm.runInNewContext(`(${game.slice(begin, end)})`);
  assert.deepEqual(Object.keys(api.BERRIES).sort(), Object.keys(actual).sort());
  assert.equal(Object.keys(api.BERRIES).length, 8);
  assert.equal(api.settings.berries["rowap-berry"].enabled, false);
  assert.equal(api.BERRIES["rowap-berry"].family, "roam");
  assert.match(api.BERRIES["rowap-berry"].label, /30 min/);
  assert.equal(api.BERRIES["rowap-berry"].minutes, 60);
  assert.equal(Object.keys(api.DATA.otherBerries).length, 4);
});

test("游走果自动续用遵守保留量、未到期增益及地区侧限制", () => {
  const f = fixture();
  const now = Date.now();
  f.save.items["rowap-berry"] = 2;
  f.api.settings.berries["rowap-berry"] = { enabled: true, reserve: 2 };
  assert.equal(f.api.berryUseCandidates(f.save, now).length, 0);
  f.api.settings.berries["rowap-berry"].reserve = 1;
  assert.equal(f.api.berryUseCandidates(f.save, now)[0].key, "rowap-berry");
  f.save.buffs = { roam: { key: "rowap-berry", until: now + 60000, side: "to" } };
  assert.equal(f.api.berryUseCandidates(f.save, now).length, 0);
  f.save.buffs.roam.side = "from";
  assert.equal(f.api.berryUseCandidates(f.save, now).length, 1);
  f.save.buffs.roam.side = "to";
  f.save.buffs.roam.until = now;
  assert.equal(f.api.berryUseCandidates(f.save, now).length, 1);
});

test("同类捕获果优先金色，不覆盖有效增益，培育果不会混入自动消耗", () => {
  const f = fixture();
  f.save.items = { "razz-berry": 10, "golden-razz-berry": 2, "belue-berry": 5 };
  f.api.settings.berries["razz-berry"].enabled = true;
  f.api.settings.berries["golden-razz-berry"].enabled = true;
  f.api.settings.berries["belue-berry"] = { enabled: true, reserve: 0 };
  assert.equal(f.api.berryUseCandidates(f.save)[0].key, "golden-razz-berry");
  f.api.settings.berries["golden-razz-berry"].reserve = 2;
  assert.equal(f.api.berryUseCandidates(f.save)[0].key, "razz-berry");
  f.save.buffs = { capture: { key: "golden-razz-berry", until: Date.now() + 60000 } };
  assert.equal(f.api.berryUseCandidates(f.save).length, 0);
});

test("果子面板列全12种及库存，游走续用只点击一次且跳过不可用按钮", async () => {
  const f = fixture();
  f.save.items["rowap-berry"] = 3;
  f.store.set("gachamon-save-v1", JSON.stringify(f.save));
  f.api.renderPanel();
  assert.equal(f.document.querySelectorAll("[data-berry]").length, 8);
  assert.equal(f.document.querySelectorAll("[data-other-berry]").length, 4);
  assert.equal(f.document.querySelector('[data-berry-stock="rowap-berry"]').textContent, "3");
  assert.ok(f.document.querySelector('[data-act="pension-berries"]'));
  const bag = f.document.createElement("div");
  bag.id = "bag-panel";
  bag.innerHTML = '<button class="bag-cell" data-k="rowap-berry"></button>';
  f.document.body.append(bag);
  const button = bag.querySelector("button");
  let clicks = 0;
  button.onclick = () => { clicks += 1; f.save.items["rowap-berry"] -= 1; };
  f.api.settings.berries["rowap-berry"].enabled = true;
  button.disabled = true;
  await f.api.manageBerries(f.save);
  assert.equal(clicks, 0);
  button.disabled = false;
  f.api.runtime.lastBerryCheckAt = 0;
  await f.api.manageBerries(f.save);
  assert.equal(clicks, 1);
  assert.equal(f.save.items["rowap-berry"], 2);
});
