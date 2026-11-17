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
const textStart = source.indexOf("const TEXT = ") + "const TEXT = ".length;
const textEnd = source.indexOf(";\n\n  const DEFAULT_SETTINGS", textStart);
const uiText = vm.runInThisContext(`(${source.slice(textStart, textEnd)})`);

function sourceFunctionText(name) {
  const signature = `function ${name}(`;
  const functionStart = source.indexOf(signature);
  assert.notEqual(functionStart, -1, `missing function ${name}`);
  const parametersStart = source.indexOf("(", functionStart);
  let parameterDepth = 0;
  let bodyStart = -1;
  for (let index = parametersStart; index < source.length; index += 1) {
    if (source[index] === "(") parameterDepth += 1;
    if (source[index] === ")" && --parameterDepth === 0) {
      bodyStart = source.indexOf("{", index);
      break;
    }
  }
  assert.notEqual(bodyStart, -1, `missing function body for ${name}`);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(functionStart, index + 1);
  }
  throw new Error(`unterminated function ${name}`);
}

function sourceFunction(name) {
  return vm.runInThisContext(`(${sourceFunctionText(name)})`);
}

function sourceFunctions(names, context = {}) {
  const sandbox = { ...context, result: null };
  vm.createContext(sandbox);
  vm.runInContext(`${names.map(sourceFunctionText).join("\n")}\nresult = { ${names.join(", ")} };`, sandbox);
  return sandbox.result;
}

test("generated data matches the inspected game build", () => {
  assert.equal(data.appBuild, "7acad22262");
  assert.equal(data.langBuild, "e31962e671");
  assert.equal(Object.keys(data.species).length, 721);
  assert.equal(data.species[4].n, "小火龙");
  assert.deepEqual(data.species[4].t, ["fire"]);
});

test("userscript and development metadata share version 0.10.1", () => {
  assert.equal(packageJson.version, "0.10.1");
  assert.ok(source.includes("// @version      0.10.1"));
  assert.ok(source.includes('const VERSION = "0.10.1"'));
  assert.ok(viteConfig.includes('version: "0.10.1"'));
  assert.ok(source.includes("// @updateURL    https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js"));
  assert.ok(source.includes("// @downloadURL  https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js"));
  assert.ok(viteConfig.includes('namespace: "local.pokecatch.assistant.dev"'));
  const readme = fs.readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const changelog = fs.readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8");
  assert.ok(readme.includes("version-0.10.1-blue"));
  assert.ok(readme.includes("安装 PokeCatch 助手 v0.10.1"));
  assert.ok(changelog.includes("## 0.10.1"));
});

test("compatibility verifies known bundles and allows structurally compatible unknown bundles", () => {
  const document = {
    scripts: [{ src: "https://pokecatch-online.pages.dev/bundle/app.7acad22262.js" }],
    querySelector: () => ({}),
  };
  const { validateCompatibility } = sourceFunctions(["gameBuild", "validateCompatibility"], {
    DATA: data,
    COMPATIBLE_APP_BUILDS: new Set([data.appBuild, "021c85dbba", "6e45170313"]),
    document,
  });
  assert.deepEqual(
    { ok: validateCompatibility().ok, verified: validateCompatibility().verified },
    { ok: true, verified: true },
  );
  document.scripts = [{ src: "https://pokecatch-online.pages.dev/bundle/app.021c85dbba.js" }];
  assert.equal(validateCompatibility().verified, true);
  document.scripts = [{ src: "https://pokecatch-online.pages.dev/bundle/app.6e45170313.js" }];
  assert.equal(validateCompatibility().verified, true);
  document.scripts = [{ src: "https://pokecatch-online.pages.dev/bundle/app.unknown.js" }];
  const unknown = validateCompatibility();
  assert.equal(unknown.ok, true);
  assert.equal(unknown.verified, false);
  assert.equal(unknown.expected, "7acad22262, 021c85dbba, 6e45170313");
  document.querySelector = (selector) => selector === "#timeline" ? null : {};
  const incompatible = validateCompatibility();
  assert.equal(incompatible.ok, false);
  assert.deepEqual(Array.from(incompatible.missing), ["#timeline"]);
});

test("league chapters use the shared Pokemon League map entry", () => {
  const league = data.chapters.filter((item) => item.league);
  assert.ok(league.some((item) => item.index === 9));
  assert.ok(league.some((item) => item.index === 64));
  assert.ok(league.some((item) => item.index === 82));
  assert.equal(data.chapters[8].league, false);
  const switchChapter = source.slice(
    source.indexOf("async function switchChapter"),
    source.indexOf("async function enterSpecialZone"),
  );
  assert.ok(switchChapter.includes('const mapChapter = targetChapter.league ? "L" : chapterIndex;'));
  assert.ok(switchChapter.includes('`.mp-row[data-ch="${mapChapter}"]`'));
  assert.ok(switchChapter.includes('`.mp-go[data-go="${mapChapter}"]`'));
  assert.ok(switchChapter.includes("readSave().adv.chapter === chapterIndex"));
});

test("Rotom forms are extracted as conditional static encounters", () => {
  const encounters = data.chapters.flatMap((item) => (
    (item.staticEncounters || []).map((encounter) => ({ chapter: item.index, ...encounter }))
  ));
  const rotom = encounters.filter((item) => item.id >= 47901 && item.id <= 47905);
  assert.deepEqual(rotom.map((item) => item.id).sort((a, b) => a - b), [47901, 47902, 47903, 47904, 47905]);
  assert.ok(rotom.every((item) => item.chance === 0.1 && item.caught.includes(479)));
  assert.deepEqual(rotom.find((item) => item.id === 47901).skies, ["ash", "sun"]);
  assert.deepEqual(rotom.find((item) => item.id === 47902).skies, ["rain", "storm"]);
  assert.equal(rotom.find((item) => item.id === 47903).night, true);
  assert.deepEqual(rotom.find((item) => item.id === 47904).skies, ["storm"]);
  assert.equal(rotom.find((item) => item.id === 47905).day, true);
  assert.ok(source.includes("for (const encounter of item.staticEncounters || [])"));
  assert.ok(source.includes('await exclusive("静态事件本轮未生成"'));
});

test("Rotom static plans honor ownership, daytime, and route weather", () => {
  const settings = { regionScope: "all", customRegions: [] };
  const helpers = sourceFunctions([
    "chapter", "currentRegion", "isCaught", "habitatForRoute", "daytimePhaseAt", "weatherHash",
    "routeClimate", "chapterClimate", "generatedWeatherForRoute", "currentWeatherForRoute",
    "habitatWeights", "routeWeights", "unlockedRegions", "collectionScopeRegions", "availableChapters",
    "plansForSpecies",
  ], { DATA: data, settings });
  const save = {
    adv: { chapter: 65, unlocked: 65, gifts: {} },
    dex: { 479: { caught: 1 } },
    roam: { at: {} },
  };
  const start = new Date(2026, 10, 17, 0, 0, 0).getTime();
  const available = new Set();
  for (let hour = 0; hour < 24 * 14; hour += 1) {
    const at = start + hour * data.weather.slotMs;
    for (const id of [47901, 47902, 47903, 47904, 47905]) {
      if (helpers.plansForSpecies(save, id, at).some((plan) => plan.static)) available.add(id);
    }
  }
  assert.deepEqual([...available].sort((a, b) => a - b), [47901, 47902, 47903, 47904, 47905]);
  assert.equal(helpers.plansForSpecies({ ...save, dex: {} }, 47905, start + 12 * data.weather.slotMs).length, 0);
  const mowDay = helpers.plansForSpecies(save, 47905, start + 12 * data.weather.slotMs)[0];
  assert.equal(mowDay.static, true);
  assert.equal(mowDay.chapter, 52);
  assert.equal(helpers.plansForSpecies(save, 47905, start + 22 * data.weather.slotMs).length, 0);
});

test("new regions accept missing presets and only recommend locally available Pokemon", () => {
  const readSave = sourceFunctionText("readSave");
  const makeReader = (value) => {
    const sandbox = {
      SAVE_KEY: "gachamon-save-v1",
      localStorage: { getItem: () => JSON.stringify(value) },
      result: null,
    };
    vm.createContext(sandbox);
    vm.runInContext(`${readSave}\nresult = readSave;`, sandbox);
    return sandbox.result;
  };
  const separatedSave = {
    adv: { chapter: 30, unlocked: 30 },
    mons: [],
    dex: {},
    team: [],
    link: { from: "johto", to: "hoenn", side: "to", stash: { teamSets: { list: [] } } },
  };
  assert.doesNotThrow(() => makeReader(separatedSave)());
  assert.throws(
    () => makeReader({ ...separatedSave, teamSets: {} })(),
    /游戏存档结构不兼容/,
  );

  const { pokemonHomeRegion, isMonAvailableInCurrentRegion, availableTeamCandidates, requiredTeamSize } = sourceFunctions([
    "pokemonHomeRegion",
    "isMonAvailableInCurrentRegion",
    "availableTeamCandidates",
    "baseStatTotal",
    "undergroundRank",
    "combinedStatMultiplier",
    "combinedStatValue",
    "normalizeCandidatePool",
    "teamIdentity",
    "preferredTeamCandidates",
    "teamCandidatesForRecommendation",
    "requiredTeamSize",
  ], { DATA: data, species: (id) => data.species[id], settings: { candidatePool: { enabled: false, minPower: 500, uids: [] } } });
  const mons = [
    { uid: "old-1", id: 1, level: 90, reg: "kanto" },
    { uid: "old-2", id: 152, level: 80, reg: "kanto2" },
    ...Array.from({ length: 4 }, (_, index) => ({ uid: `new-${index + 1}`, id: 252 + index, level: 5 + index, reg: "hoenn" })),
  ];
  const save = { ...separatedSave, mons };
  assert.deepEqual(
    Array.from(availableTeamCandidates(save), (mon) => mon.uid),
    ["new-1", "new-2", "new-3", "new-4"],
  );
  assert.equal(isMonAvailableInCurrentRegion(save, mons[0]), false);
  assert.equal(isMonAvailableInCurrentRegion(save, mons[2]), true);
  assert.equal(pokemonHomeRegion(mons[1]), "johto");
  assert.equal(requiredTeamSize(save), 4);
  assert.equal(requiredTeamSize({ ...save, link: { ...save.link, side: "from" } }), 2);
  assert.ok(source.includes("const candidates = teamCandidatesForRecommendation(save);"));
  assert.ok(source.includes("const fullTeamSize = requiredTeamSize(save);"));
});

test("automatic teams never recommend duplicate species or mutually exclusive forms", () => {
  const { teamIdentity } = sourceFunctions(["teamIdentity"], { species: (id) => data.species[id] });
  assert.equal(teamIdentity({ id: 25, shiny: false }), teamIdentity({ id: 25, shiny: true }));
  assert.equal(teamIdentity({ id: 386 }), teamIdentity({ id: 38601 }));
  assert.notEqual(teamIdentity({ id: 351 }), teamIdentity({ id: 35101 }));

  const { recommendTeam } = sourceFunctions(["recommendTeam"], {
    DEFAULT_LEVEL_WEIGHT: 0.22,
    enemyProfiles: () => [],
    teamCandidatesForRecommendation: (save) => save.mons,
    preferredTeamCandidates: () => [],
    teamIdentity,
    scoreCandidate: (mon) => ({ score: mon.score, reason: String(mon.score) }),
    species: (id) => data.species[id],
  });
  const plan = recommendTeam({
    team: [],
    mons: [
      { uid: "weak-25", id: 25, score: 10 },
      { uid: "best-25", id: 25, score: 100 },
      { uid: "form-386", id: 38601, score: 90 },
      { uid: "base-386", id: 386, score: 80 },
      ...[1, 2, 3, 4, 5].map((id) => ({ uid: `unique-${id}`, id, score: 70 - id })),
    ],
  }, []);
  assert.equal(plan.mons.length, 6);
  assert.ok(plan.mons.some((mon) => mon.uid === "best-25"));
  assert.equal(plan.mons.filter((mon) => mon.id === 25).length, 1);
  assert.equal(plan.mons.filter((mon) => [386, 38601].includes(mon.id)).length, 1);
  assert.equal(new Set(plan.mons.map(teamIdentity)).size, plan.mons.length);

  const retryWithoutSeventhSpecies = recommendTeam({
    team: [],
    mons: [...plan.mons, { uid: "another-25", id: 25, score: 5 }],
  }, [], { excludedSignatures: new Set([plan.signature]) });
  assert.equal(retryWithoutSeventhSpecies.mons.length, 6);
  assert.equal(retryWithoutSeventhSpecies.signature, plan.signature);
});

test("training candidates are preferred and remaining slots use other available species", () => {
  const settings = { candidatePool: { enabled: true, minPower: 0, uids: ["preferred-1", "preferred-2", "preferred-duplicate"] } };
  const { recommendTeam } = sourceFunctions([
    "pokemonHomeRegion",
    "isMonAvailableInCurrentRegion",
    "availableTeamCandidates",
    "baseStatTotal",
    "undergroundRank",
    "combinedStatMultiplier",
    "combinedStatValue",
    "normalizeCandidatePool",
    "preferredTeamCandidates",
    "teamCandidatesForRecommendation",
    "teamIdentity",
    "recommendTeam",
  ], {
    DATA: data,
    settings,
    species: (id) => data.species[id],
    DEFAULT_LEVEL_WEIGHT: 0.22,
    enemyProfiles: () => [],
    scoreCandidate: (mon) => ({ score: mon.score, reason: String(mon.score) }),
  });
  const plan = recommendTeam({
    team: [],
    mons: [
      { uid: "preferred-1", id: 1, level: 10, score: 1 },
      { uid: "preferred-2", id: 2, level: 10, score: 2 },
      { uid: "preferred-duplicate", id: 1, level: 10, score: 3 },
      ...[3, 4, 5, 6, 7].map((id) => ({ uid: `fallback-${id}`, id, level: 10, score: 100 - id })),
    ],
  }, []);
  assert.equal(plan.mons.length, 6);
  assert.ok(plan.mons.some((mon) => mon.uid === "preferred-duplicate"));
  assert.ok(plan.mons.some((mon) => mon.uid === "preferred-2"));
  assert.equal(new Set(plan.mons.map((mon) => mon.id)).size, 6);
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

test("Unova Victory Road includes the new midpoint Pokemon Center split", () => {
  const victoryRoad = data.chapters[76];
  const routes = victoryRoad.routes.filter((route) => route.sourceName === "Route Victoire");
  assert.equal(routes.length, 2);
  assert.deepEqual(routes.map((route) => [route.wild, route.trainers]), [[4, 3], [2, 1]]);
  assert.deepEqual(routes.map((route) => route.stepIndex), [2, 4]);
  assert.ok(routes[1].areas.includes("bw:unova-victory-road-outside"));
});

test("routes with explicit habitat keys use their special encounter tables", () => {
  const summit = data.chapters.flatMap((chapter) => chapter.routes).find((route) => route.sourceName === "Sommet");
  assert.equal(summit.habitat, "k2:Sommet");
  const { habitatForRoute, habitatWeights } = sourceFunctions(["habitatForRoute", "habitatWeights"], { DATA: data });
  const habitat = habitatForRoute(summit);
  assert.equal(habitatWeights(habitat, "night", null)[200], 12);
});

test("special legendary zones include locations and unlock conditions", () => {
  const lugia = data.specialZones.find((item) => item.id === 249);
  const hoOh = data.specialZones.find((item) => item.id === 250);
  assert.equal(lugia.zone, "漩涡列岛");
  assert.deepEqual(lugia.condition.ids, [144, 145, 146]);
  assert.equal(hoOh.zone, "铃铛塔");
  assert.equal(hoOh.badge, "Brume");
  assert.deepEqual(hoOh.condition.ids, [243, 244, 245]);
  assert.ok(source.includes('document.querySelector(`.mp-go[data-zone="${plan.speciesId}"]`)'));
  assert.ok(source.includes('Number(readSave().adv.zone?.id) === Number(plan.speciesId)'));
  const { species, isCaught, specialConditionStatus, regionInCollectionScope, specialTargetStatus } = sourceFunctions(
    ["species", "isCaught", "specialConditionStatus", "regionInCollectionScope", "specialTargetStatus"],
    { DATA: data, settings: { regionScope: "all", customRegions: [] }, language: () => "zh", t: (key) => key },
  );
  const locked = specialConditionStatus({ dex: { 144: { caught: 1 }, 145: { caught: 1 } } }, lugia.condition, lugia);
  assert.equal(locked.met, false);
  assert.ok(locked.reason.includes("火焰鸟"));
  assert.equal(specialConditionStatus({ dex: { 144: { caught: 1 }, 145: { caught: 1 }, 146: { caught: 1 } } }, lugia.condition, lugia).met, true);
  const save = {
    adv: { unlocked: data.chapters.length - 1, badges: ["Brume"] },
    dex: Object.fromEntries([144, 145, 146, 243, 244, 245].map((id) => [id, { caught: 1 }])),
  };
  assert.equal(specialTargetStatus(save, 249).open, true);
  assert.equal(specialTargetStatus(save, 250).open, true);
});

test("alternate forms use the game's visible Pokedex numbers", () => {
  assert.equal(Object.keys(data.species).length, 721);
  assert.equal(data.species[201].d, "201-A");
  assert.equal(data.species[20107].d, "201-H");
  assert.equal(data.species[20107].n, "未知图腾 H");
  assert.equal(data.species[49301].d, "493-A");
  assert.deepEqual(data.species[49301].t, ["fire"]);
  assert.equal(data.species[49316].d, "493-P");
  assert.equal(data.species[48701].d, "487-A");
  assert.equal(data.species[49201].d, "492-A");
  assert.equal(data.species[20100], undefined);
  const ruins = data.chapters.flatMap((item) => item.routes).find((route) => route.sourceName === "Ruines d'Alpha");
  assert.ok(ruins.species.includes(201));
  assert.equal(ruins.species.includes(20100), false);
});

test("collection planning follows the game's daytime boundaries and replans expired targets", () => {
  const daytimePhaseAt = sourceFunction("daytimePhaseAt");
  const localTime = (hour) => new Date(2026, 10, 16, hour, 0, 0).getTime();
  assert.equal(daytimePhaseAt(localTime(7)), "night");
  assert.equal(daytimePhaseAt(localTime(8)), "morning");
  assert.equal(daytimePhaseAt(localTime(10)), "day");
  assert.equal(daytimePhaseAt(localTime(19)), "day");
  assert.equal(daytimePhaseAt(localTime(20)), "night");
  assert.equal(daytimePhaseAt(localTime(23), true), "day");

  const habitatWeights = sourceFunction("habitatWeights");
  const route29 = data.habitats["Route 29|gsc:johto-route-29-area"];
  assert.equal(habitatWeights(route29, "day", null)[155], undefined);
  assert.equal(habitatWeights(route29, "night", null)[155], 4);
  assert.ok(source.includes("当前昼夜或天气条件已变化，重新规划目标"));
});

test("weather is calculated per chapter and applied to encounter tables", () => {
  assert.equal(data.weather.slotMs, 3_600_000);
  assert.equal(data.weather.chance, 0.54);
  assert.equal(data.chapters[5].region, "kanto");
  assert.equal(data.chapters[14].region, "johto");
  assert.ok(source.includes("const chapterKey = `ch${item.index}`"));
  assert.ok(source.includes("currentWeatherForRoute(save, item, route, timestamp, phase)"));
  assert.ok(source.includes("habitat?.[weather]"));
  assert.ok(source.includes("nextConditionalPlan(save)"));

  const habitatWeights = sourceFunction("habitatWeights");
  const route29 = data.habitats["Route 29|gsc:johto-route-29-area"];
  assert.equal(habitatWeights(route29, "day", "rain")[60], 6);
  assert.equal(habitatWeights(route29, "day", null)[60], undefined);
  assert.equal(habitatWeights(route29, "night", null)[16], undefined);

  const weatherFunctions = sourceFunctions([
    "weatherHash",
    "routeClimate",
    "chapterClimate",
    "generatedWeatherForRoute",
    "currentWeatherForRoute",
  ], { DATA: data });
  const save = { adv: { unlocked: 50 }, roam: { at: {} } };
  const wing = data.chapters[14];
  const steel = data.chapters[19];
  const wingRoute29 = wing.routes.find((route) => route.name === "29号道路");
  const steelRoute39 = steel.routes.find((route) => route.name === "39号道路");
  const weatherAt = (item, route, value, phase = "day") => weatherFunctions.currentWeatherForRoute(
    save,
    item,
    route,
    Date.parse(value),
    phase,
  );
  assert.equal(weatherAt(wing, wingRoute29, "2026-11-16T19:30:00+08:00"), null);
  assert.equal(weatherAt(steel, steelRoute39, "2026-11-16T19:30:00+08:00"), "rain");
  assert.equal(weatherAt(wing, wingRoute29, "2026-11-16T21:00:00+08:00", "night"), "rain");
  assert.equal(weatherAt(wing, wingRoute29, "2026-11-16T23:00:00+08:00", "night"), "storm");
});

test("weather-limited forms stay eligible and outrank ordinary automatic targets", () => {
  const settings = { regionScope: "all", customRegions: [], manualTargets: [] };
  const { chapter, currentRegion, habitatForRoute, availableChapters, potentialWildTarget,
    weatherFlexibility, planPriority, comparePriority } = sourceFunctions([
    "chapter", "currentRegion", "habitatForRoute", "unlockedRegions", "collectionScopeRegions",
    "availableChapters", "chaptersInCollectionScope", "routeCanContainSpecies", "potentialWildTarget",
    "pokemonHomeRegion", "collectionRegionRank", "collectionTeamLevelForRegion", "collectionLevelFactor",
    "collectionPlanEfficiency", "weatherFlexibility", "planPriority", "comparePriority",
  ], { DATA: data, REGION_ORDER: ["kanto", "johto", "hoenn", "sinnoh", "unova"], settings });
  const save = { adv: { chapter: 15, unlocked: 20 } };
  assert.equal(potentialWildTarget(save, 20127), true);
  const stormOnly = { speciesId: 20124, chapter: 15, zone: "阿露福遗迹", sourceZone: "Ruines d'Alpha", weatherLimited: true, weight: 2, score: 2 };
  const rainOrStorm = { speciesId: 20120, chapter: 15, zone: "阿露福遗迹", sourceZone: "Ruines d'Alpha", weatherLimited: true, weight: 3, score: 3 };
  assert.equal(weatherFlexibility(save, stormOnly), 1);
  assert.equal(weatherFlexibility(save, rainOrStorm), 2);
  assert.ok(comparePriority(planPriority(save, stormOnly), planPriority(save, rainOrStorm)) < 0);
  settings.manualTargets = [20120];
  assert.ok(comparePriority(planPriority(save, rainOrStorm), planPriority(save, stormOnly)) < 0);
  assert.equal(chapter(15).name, "昆虫徽章");
  assert.equal(currentRegion(save), "johto");
  assert.ok(availableChapters(save).length > 0);
});

test("collection queue keeps region order and penalizes maps above the local team's level", () => {
  const settings = { regionScope: "all", customRegions: [], manualTargets: [] };
  const helpers = sourceFunctions([
    "species",
    "chapter",
    "currentRegion",
    "pokemonHomeRegion",
    "unlockedRegions",
    "collectionScopeRegions",
    "collectionRegionRank",
    "collectionTeamLevelForRegion",
    "collectionLevelFactor",
    "collectionPlanEfficiency",
    "compareCollectionPlans",
    "weatherFlexibility",
    "planPriority",
    "comparePriority",
  ], { DATA: data, REGION_ORDER: ["kanto", "johto", "hoenn", "sinnoh", "unova"], settings });
  const hoennStart = data.chapters.find((item) => item.region === "hoenn");
  const save = {
    adv: { chapter: hoennStart.index, unlocked: hoennStart.index },
    mons: [
      ...Array.from({ length: 6 }, (_, index) => ({ uid: `kanto-${index}`, reg: "kanto", level: 50 })),
      ...Array.from({ length: 4 }, (_, index) => ({ uid: `hoenn-${index}`, reg: "hoenn", level: 5 + index })),
    ],
  };
  const kantoPlan = { speciesId: 10, chapter: 0, score: 1, prefixCost: 2 };
  const hoennPlan = { speciesId: 279, chapter: hoennStart.index, score: 100, prefixCost: 1 };
  assert.ok(helpers.comparePriority(
    helpers.planPriority(save, kantoPlan),
    helpers.planPriority(save, hoennPlan),
  ) < 0, "an efficient later-region target must not jump ahead of an earlier region");

  const easyKantoPlan = { speciesId: 10, chapter: 0, score: 2, prefixCost: 2 };
  const hardKantoChapter = data.chapters
    .filter((item) => item.region === "kanto")
    .sort((a, b) => b.ace - a.ace)[0];
  const hardKantoPlan = { speciesId: 11, chapter: hardKantoChapter.index, score: 2, prefixCost: 2 };
  assert.equal(helpers.collectionLevelFactor(save, easyKantoPlan), 1);
  assert.ok(helpers.collectionLevelFactor(save, hardKantoPlan) < 1);
  assert.ok(helpers.compareCollectionPlans(save, easyKantoPlan, hardKantoPlan) < 0);
  assert.ok(helpers.collectionPlanEfficiency(save, easyKantoPlan)
    > helpers.collectionPlanEfficiency(save, hardKantoPlan));
});

test("collection queue UI shows at most five automatic targets and waiting farms the strongest unlocked chapter", () => {
  assert.ok(source.includes('id="pca-collection-queue"'));
  assert.ok(source.includes(".filter((plan) => !settings.manualTargets.includes(plan.speciesId))"));
  assert.ok(source.includes("const COLLECTION_QUEUE_LIMIT = 5;"));
  assert.ok(source.includes(".slice(0, COLLECTION_QUEUE_LIMIT)"));
  assert.ok(source.includes("runtime.timer = setInterval(tick, 900)"));
  assert.ok(source.includes("Number(item?.until) > now ? 1 : 0"));
  assert.ok(source.includes("JSON.stringify(save.stats?.byReg || {})"));
  assert.ok(source.includes('collectTick(save, { trackRoamers: false, collectMissing: true })'));
  assert.ok(source.includes('collectTick(save, { trackRoamers: true, collectMissing: false })'));
  assert.ok(source.includes('collectTick(save, { trackRoamers: true, collectMissing: true })'));
  const settings = { regionScope: "all", customRegions: [], manualTargets: [] };
  const { chapter, currentRegion, availableChapters, moneyFarmPlan } = sourceFunctions(
    ["chapter", "currentRegion", "unlockedRegions", "collectionScopeRegions", "availableChapters", "moneyFarmPlan"],
    { DATA: data, settings },
  );
  const save = { adv: { chapter: 15, unlocked: 20 } };
  const expected = data.chapters.filter((item) => item.index <= 20 && item.routes.some((route) => route.wild > 0))
    .sort((a, b) => (b.ace || 0) - (a.ace || 0) || b.index - a.index)[0];
  const farm = moneyFarmPlan(save);
  assert.equal(farm.chapter, expected.index);
  assert.equal(farm.moneyFarm, true);
  assert.equal(chapter(farm.chapter).name, expected.name);
  assert.equal(currentRegion(save), "johto");
  assert.ok(availableChapters(save).some((item) => item.index === farm.chapter));
});

test("collection route boundary follows saved nodes and stops after Route 34", () => {
  const savedTimelinePlanStatus = sourceFunction("savedTimelinePlanStatus");
  const plan = { zone: "34号道路", sourceZone: "Route 34" };
  const nodes = [
    { name: "Bois aux Chênes", type: "wild" },
    { name: "Route 34", type: "trainer" },
    { name: "Route 34", type: "wild" },
    { name: "Route 34", type: "wild" },
    { name: "Route 34", type: "wild" },
    { name: "Route 35", type: "wild" },
    { name: "Route 35", type: "trainer" },
  ];

  const onLastTargetNode = savedTimelinePlanStatus({ adv: { nodes, node: 4 } }, plan);
  assert.equal(onLastTargetNode.lastWild, 4);
  assert.equal(onLastTargetNode.current, 4);
  assert.equal(onLastTargetNode.wild.length, 3);

  const afterTargetRoute = savedTimelinePlanStatus({ adv: { nodes, node: 5 } }, plan);
  assert.ok(afterTargetRoute.current > afterTargetRoute.lastWild);
  assert.equal(afterTargetRoute.relevant.some(({ node }) => node.name === "Route 35"), false);
  assert.ok(source.includes('runtime.timelineObserver = new MutationObserver'));
  assert.ok(source.includes('timelinePlanStatus(save, runtime.targetPlan)'));
});

test("static collection retries generation and stops only after its matching event node", () => {
  const savedStaticPlanStatus = sourceFunction("savedStaticPlanStatus");
  const plan = { speciesId: 47905 };
  const absent = savedStaticPlanStatus({ adv: { nodes: [{ type: "wild", id: 47905 }], node: 0 } }, plan);
  assert.equal(absent.target, -1);
  const generated = savedStaticPlanStatus({
    adv: { nodes: [{ type: "wild" }, { type: "static", id: 47905 }, { type: "trainer" }], node: 1 },
  }, plan);
  assert.equal(generated.target, 1);
  assert.equal(generated.current, 1);
  const passed = savedStaticPlanStatus({
    adv: { nodes: [{ type: "wild" }, { type: "static", id: 47905 }, { type: "trainer" }], node: 2 },
  }, plan);
  assert.ok(passed.current > passed.target);
  assert.ok(source.includes('if (runtime.targetPlan.static)'));
  assert.ok(source.includes('await exclusive("静态事件捕获未成功"'));
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
  assert.ok(source.includes('data-setting="autoPushForCollection"'));
  assert.ok(source.includes('autoPushForCollection: true'));
});

test("daily raids run before automatic tasks and keep their dedicated team", () => {
  assert.ok(source.includes('data-setting="prioritizeDailyRaid"'));
  assert.ok(source.includes('prioritizeDailyRaid: true'));
  assert.ok(source.includes('await prioritizeDailyRaid(save)'));
  assert.ok(source.includes('root.querySelectorAll("[data-raid-go]")'));
  assert.ok(source.includes('save.eventTeams?.[`raid:${region}`]'));
  const raidFlow = sourceFunctionText("prioritizeDailyRaid");
  assert.equal(raidFlow.includes("configurePreset"), false, "daily raids must not overwrite Team 5");
  assert.ok(raidFlow.indexOf("await optimizeDailyRaidTeam(root, region)")
    < raidFlow.indexOf("await selectFirstDailyRaidAllies(root, region)"));
  assert.ok(raidFlow.indexOf("await selectFirstDailyRaidAllies(root, region)")
    < raidFlow.indexOf("await pacedClick(go"));
  assert.ok(sourceFunctionText("optimizeDailyRaidTeam").includes("#evt-pick.open #evt-opt"));
  assert.ok(sourceFunctionText("selectFirstDailyRaidAllies").includes("#modal-root.open .raid-dlg [data-pick]"));
  assert.ok(raidFlow.includes('root.querySelector(".rc-card, [data-p]")'));
  assert.equal(raidFlow.includes('root.querySelector(".rc-card, [data-p], .pg-empty")'), false);
  assert.ok(raidFlow.includes("runtime.dailyRaidRetryAt = Date.now() + 5 * 60_000"));

  const { raidDateKey, raidSetupStatus } = sourceFunctions(["raidDateKey", "raidSetupStatus"]);
  assert.equal(raidDateKey(Date.parse("2026-11-17T23:30:00Z")), "2026-11-18");
  const save = {
    mons: [{ uid: "mine-1" }, { uid: "mine-2" }],
    eventTeams: { "raid:kanto": ["mine-1", "missing", "mine-2"] },
    raids: { pick: { kanto: ["ally-1", "ally-2"] } },
  };
  assert.deepEqual(
    JSON.parse(JSON.stringify(raidSetupStatus(save, "kanto"))),
    { team: ["mine-1", "mine-2"], allies: ["ally-1", "ally-2"], ready: true },
  );
  assert.equal(raidSetupStatus({ ...save, raids: { pick: { kanto: ["ally-1"] } } }, "kanto").ready, false);
});

test("collection scope and story-locked targets are resolved independently", () => {
  const settings = { regionScope: "current", customRegions: [] };
  const helpers = sourceFunctions([
    "chapter",
    "currentRegion",
    "habitatForRoute",
    "unlockedRegions",
    "collectionScopeRegions",
    "routeCanContainSpecies",
    "chaptersInCollectionScope",
    "storyLockedChapterForSpecies",
  ], { DATA: data, settings });
  const hoennStart = data.chapters.find((item) => item.region === "hoenn");
  const save = { adv: { chapter: hoennStart.index, unlocked: hoennStart.index } };
  assert.deepEqual(Array.from(helpers.collectionScopeRegions(save)), ["hoenn"]);

  settings.regionScope = "all";
  assert.ok(Array.from(helpers.collectionScopeRegions(save)).includes("johto"));
  assert.ok(helpers.chaptersInCollectionScope(save).some((item) => (
    item.region === "johto" && item.routes.some((route) => helpers.routeCanContainSpecies(route, 200))
  )), "all unlocked regions should include Johto #200 Misdreavus");
  settings.regionScope = "custom";
  settings.customRegions = ["johto"];
  assert.deepEqual(Array.from(helpers.collectionScopeRegions(save)), ["johto"]);
  settings.customRegions = ["hoenn", "kanto", "johto"];
  assert.deepEqual(Array.from(helpers.collectionScopeRegions(save)), ["kanto", "johto", "hoenn"]);
  settings.customRegions = [];
  assert.deepEqual(Array.from(helpers.collectionScopeRegions(save)), []);

  settings.regionScope = "current";
  const laterHoenn = data.chapters.find((item) => item.region === "hoenn" && item.index > hoennStart.index
    && item.routes.some((route) => {
      const habitat = helpers.habitatForRoute(route);
      return habitat && Object.values(habitat).some((table) => Object.keys(table || {}).length);
    }));
  const lockedId = Number(Object.keys(helpers.habitatForRoute(laterHoenn.routes.find((route) => helpers.habitatForRoute(route)))?.base || {})[0]);
  assert.equal(helpers.storyLockedChapterForSpecies(save, lockedId)?.region, "hoenn");
});

test("cross-region collection switches chapter before recommending the target-side team", () => {
  const planning = source.slice(source.indexOf('await exclusive("规划缺失图鉴"'));
  assert.ok(planning.indexOf("await switchChapter(next.chapter)") < planning.indexOf("recommendTeam(targetSave,"));
  assert.ok(source.includes('const region = chapter(plan.chapter)?.region || currentRegion(save);'));
  assert.ok(source.includes('${region ? `${t(region)} · ` : ""}'));
});

test("collection story advancement runs before passive condition waiting", () => {
  const collectionStart = source.indexOf("async function collectTick");
  const collectionEnd = source.indexOf("async function manageBerries", collectionStart);
  const collectTick = source.slice(collectionStart, collectionEnd);
  assert.ok(collectTick.indexOf("const unlock = collectionStoryUnlockPlan(save)") < collectTick.indexOf("const waiting = nextConditionalPlan(save)"));
  assert.ok(collectTick.includes("collectionUnlockTick(save, unlock)"));
  assert.ok(source.includes("下一次章节解锁后立即重新扫描"));
});

test("collection UI separates ordinary targets from roaming legendaries", () => {
  assert.ok(source.includes('ordinaryTargets: "普通野外目标"'));
  assert.ok(source.includes('ordinaryTargets: "Ordinary wild targets"'));
  assert.ok(source.includes('${t("ordinaryTargets")}'));
  assert.ok(source.includes('${t("roamers")}'));
  assert.ok(source.includes('id="pca-roaming-priority"'));
  assert.ok(source.includes('data-act="roam-up"'));
  assert.ok(source.includes('data-act="roam-down"'));
  assert.equal(source.includes('data-select-setting="roamingOrder"'), false);
});

test("ordinary collection, roaming tracking, and combined collection are independently selectable", () => {
  assert.ok(source.includes('data-act="collect">${t("dexCollection")}'));
  assert.ok(source.includes('data-act="roaming">${t("roamOnly")}'));
  assert.ok(source.includes('data-act="combined">${t("combined")}'));
  assert.ok(source.includes('collectTick(save, { trackRoamers: false, collectMissing: true })'));
  assert.ok(source.includes('collectTick(save, { trackRoamers: true, collectMissing: false })'));
  assert.ok(source.includes('collectTick(save, { trackRoamers: true, collectMissing: true })'));
});

test("assistant UI supports automatic, Chinese, and English language selection", () => {
  assert.ok(source.includes('language: "auto"'));
  assert.ok(source.includes('localStorage.getItem("pokecatch.lang")'));
  assert.ok(source.includes('data-select-setting="language"'));
  assert.ok(source.includes('value="zh"'));
  assert.ok(source.includes('value="en"'));
  assert.ok(source.includes('assistant: "PokéCatch 助手"'));
  assert.ok(source.includes('assistant: "PokéCatch Assistant"'));
  assert.ok(source.includes('settings.language = event.target.value'));
  assert.ok(source.includes("renderPanel();"));

  let gameLanguage = "zh-Hans";
  const settings = { language: "auto" };
  const languageFunctions = sourceFunctions(["language", "t"], {
    TEXT: uiText,
    settings,
    localStorage: { getItem: () => gameLanguage },
    document: { documentElement: { lang: "en" } },
  });
  assert.equal(languageFunctions.language(), "zh");
  assert.equal(languageFunctions.t("assistant"), "PokéCatch 助手");
  gameLanguage = "en";
  assert.equal(languageFunctions.language(), "en");
  assert.equal(languageFunctions.t("assistant"), "PokéCatch Assistant");
  settings.language = "zh";
  assert.equal(languageFunctions.t("startPush"), "开始推图");
  settings.language = "en";
  assert.equal(languageFunctions.t("startPush"), "Start story");
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
  assert.ok(source.includes("recommendRoamingTeam(readSave(), roamer.id)"));
  assert.ok(source.includes("recommendTeam(targetSave, [next.speciesId], { levelWeight: COLLECTION_LEVEL_WEIGHT })"));
  assert.ok(source.includes("const levelWeight = storyTarget ? DEFAULT_LEVEL_WEIGHT : COLLECTION_LEVEL_WEIGHT"));
});

test("training pool adds combined stat filtering without replacing main features", () => {
  assert.equal(data.shinyStatBonus, 0.1);
  assert.equal(data.rankStatMultiplier, 1.15);
  assert.equal(data.rankMax, 5);
  const { baseStatTotal, undergroundRank, combinedStatMultiplier, combinedStatValue, normalizeCandidatePool } = sourceFunctions(
    ["baseStatTotal", "undergroundRank", "combinedStatMultiplier", "combinedStatValue", "normalizeCandidatePool"],
    { DATA: data, species: (id) => data.species[id] },
  );
  assert.equal(baseStatTotal(36), 483);
  assert.equal(undergroundRank({ rank: 9 }), 5);
  assert.equal(combinedStatValue({ id: 36, shiny: true, rank: 0 }), 531.3);
  assert.equal(combinedStatValue({ id: 36, shiny: false, rank: 1 }), 555.45);
  assert.equal(combinedStatMultiplier({ shiny: true, rank: 2 }), 1.1 * 1.15 ** 2);
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeCandidatePool({ enabled: true, minBst: 500, uids: [1, "1", "2"] }))),
    { enabled: true, minPower: 500, uids: ["1", "2"] },
  );

  assert.ok(source.includes('trainingTab: "培养"'));
  assert.ok(source.includes('data-tabpanel="training"'));
  assert.ok(source.includes("综合能力值 = 当前形态六项种族值总和"));
  assert.ok(source.includes('data-act="dup-on"'), "main duplicate-retention controls must remain");
  assert.ok(source.includes('data-act="copy"'), "main team-copy control must remain");
  assert.ok(source.includes('data-act="combined"'), "main combined collection mode must remain");
  assert.ok(source.includes('data-setting="autoPushForCollection"'), "main collection story-advance option must remain");
  assert.ok(sourceFunctionText("renderCandidatePool").includes("try"));
  assert.ok(sourceFunctionText("renderCandidatePool").includes('t("trainingNoSave")'));
});

test("roaming legendary teams strongly prioritize level 90 or above with fallback", () => {
  const roamingLevelPriorityScore = sourceFunction("roamingLevelPriorityScore");
  assert.equal(roamingLevelPriorityScore(100, 90), 1_040);
  assert.equal(roamingLevelPriorityScore(90, 90), 1_000);
  assert.equal(roamingLevelPriorityScore(89, 90), -20);
  assert.equal(roamingLevelPriorityScore(70, 90), -400);
  assert.equal(roamingLevelPriorityScore(70), 0);
  assert.ok(source.includes("const ROAMING_PREFERRED_LEVEL = 90;"));
  assert.ok(source.includes("preferredLevel: ROAMING_PREFERRED_LEVEL"));
  assert.ok(source.includes("recommendRoamingTeam(readSave(), roamer.id)"));
  assert.ok(source.includes("recommendRoamingTeam(save, runtime.targetPlan.speciesId)"));
});

test("berry controls provide Chinese and English names followed by their effects", () => {
  for (const label of [
    "蔓莓果（捕获率 ×1.25）",
    "金色蔓莓果（捕获率 ×1.5）",
    "蕉香果（区域稀有种类 ×2）",
    "谜芝果（本地区未捕获种类 ×3）",
    "凰梨果（战斗经验 +25%）",
    "兰萨果（金币 +25%）",
    "星桃果（野生异色 ×2）",
    "雾莲果（徘徊宝可梦停留 30 分钟）",
  ]) assert.ok(source.includes(label), `missing berry label: ${label}`);
  for (const label of ["Razz Berry (catch rate ×1.25)", "Golden Razz Berry (catch rate ×1.5)", "Pinap Berry (battle XP +25%)", "Rowap Berry (roamers stay for 30 min)"]) {
    assert.ok(source.includes(label), `missing English berry label: ${label}`);
  }
  assert.ok(source.includes('"rowap-berry": { family: "roam"'));
  assert.equal(source.includes('label: "经验果"'), false);
  for (const label of ["橙橙果", "桃桃果", "文柚果", "靛莓果", "培育屋产蛋进度 +5 分钟", "百变怪下一颗蛋的异色率 ×2"]) {
    assert.ok(source.includes(label), `missing Day Care berry text: ${label}`);
  }
  assert.ok(source.includes('data-act="pension-berries"'));
  assert.ok(source.includes('data-berry-stock="${key}"'));
  assert.ok(source.includes('node.dataset.berryStock'));
});

test("berry renewal respects families, reserve, strength, and region-side buffs", () => {
  const berries = {
    "razz-berry": { family: "capture" },
    "golden-razz-berry": { family: "capture" },
    "rowap-berry": { family: "roam" },
  };
  const settings = { berries: {
    "razz-berry": { enabled: true, reserve: 1 },
    "golden-razz-berry": { enabled: true, reserve: 0 },
    "rowap-berry": { enabled: true, reserve: 2 },
  } };
  const { berryUseCandidates } = sourceFunctions(["berryUseCandidates"], { BERRIES: berries, settings, Date });
  const base = { lastTick: 1_000, items: { "razz-berry": 5, "golden-razz-berry": 1, "rowap-berry": 2 }, buffs: {} };
  assert.deepEqual(Array.from(berryUseCandidates(base, 1_000), (item) => item.key), ["golden-razz-berry"]);
  assert.deepEqual(Array.from(berryUseCandidates({ ...base, buffs: { capture: { until: 2_000 } } }, 1_000), (item) => item.key), []);
  assert.deepEqual(
    Array.from(berryUseCandidates({ ...base, link: { side: "to" }, buffs: { capture: { until: 2_000, side: "from" } } }, 1_000), (item) => item.key),
    ["golden-razz-berry"],
  );
});

test("expired berries renew independently using the game's clock and verify activation", () => {
  const activeBuffAt = sourceFunction("activeBuffAt");
  assert.equal(activeBuffAt({ buffs: { xp: { key: "pinap-berry", until: 2_000 } } }, "xp", 1_999)?.key, "pinap-berry");
  assert.equal(activeBuffAt({ buffs: { xp: { key: "pinap-berry", until: 2_000 } } }, "xp", 2_000), null);
  assert.equal(activeBuffAt({ buffs: { roam: { key: "rowap-berry", until: 2_000 } } }, "roam", 1_999)?.key, "rowap-berry");
  assert.ok(source.includes("function berryUseCandidates(save, now = Number(save.lastTick) || Date.now())"));
  assert.ok(source.includes("if (!runtime.paused && !runtime.error) await manageBerries(save);"));
  assert.ok(source.indexOf("await manageBerries(save)") < source.indexOf('if (runtime.mode === "idle" || runtime.paused)'));
  assert.ok(source.includes("const countBefore = Number(save.items?.[choice.key] || 0);"));
  assert.ok(source.includes("buff?.key === choice.key"));
  assert.ok(source.includes('`${berryLabel(choice.info)}生效`'));
});

test("manual target input previews Pokedex numbers and names", () => {
  assert.ok(source.includes('id="pca-manual-target-preview"'));
  assert.ok(source.includes("function manualTargetPreviewHtml"));
  assert.ok(source.includes('event.target.id === "pca-manual-targets"'));
  assert.ok(source.includes('String(id).padStart(3, "0")'));
});

test("manual targets resolve visible alternate-form numbers", () => {
  const { resolveManualTarget } = sourceFunctions(["resolveManualTarget"], { DATA: data });
  assert.equal(resolveManualTarget("201-H"), 20107);
  assert.equal(resolveManualTarget("201H"), 20107);
  assert.equal(resolveManualTarget("No.493-A"), 49301);
  assert.equal(resolveManualTarget("493A"), 49301);
  assert.equal(resolveManualTarget("未知图腾H"), 20107);
});

test("duplicate retention bulk controls check each owned Pokedex number", () => {
  assert.ok(source.includes('data-act="dup-on"'));
  assert.ok(source.includes('data-act="dup-off"'));
  assert.ok(source.includes('data-act="dup-cancel"'));
  assert.ok(source.includes('data-duplicate-region="${key}"'));
  assert.ok(source.includes('detail.querySelector(".keep-row")'));
  const { species, pokemonHomeRegion, duplicateKeepCandidates } = sourceFunctions(
    ["species", "pokemonHomeRegion", "duplicateKeepCandidates"],
    { DATA: data },
  );
  assert.deepEqual(
    Array.from(duplicateKeepCandidates({ mons: [{ uid: "a", id: 1, reg: "kanto" }, { uid: "b", id: 2, reg: "kanto2" }, { uid: "c", id: 4, reg: "hoenn" }] }, ["johto"]), (item) => item.id),
    [2],
  );
  assert.deepEqual(
    Array.from(duplicateKeepCandidates({ mons: [{ uid: "a", id: 1 }, { uid: "b", id: 1, reg: "kanto" }, { uid: "c", id: 4, reg: "hoenn" }] }, ["kanto", "hoenn"]), (item) => item.id),
    [1, 4],
  );
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
  assert.ok(source.includes("await pacedClick(go, targetChapter.league"));
  assert.ok(source.includes("await pacedClick(preset"));
  assert.ok(source.includes("await pacedClick(button, berryLabel(choice.info))"));
  assert.equal((source.match(/\.click\(\)/g) || []).length, 1, "automated clicks must go through pacedClick");
  assert.ok(source.includes('await jitter(35, 85);'));
  assert.ok(source.includes('await jitter(450, 1_100);'));
});

test("cross-region chapter switching selects the target region before its chapter", () => {
  const switchChapter = source.slice(
    source.indexOf("async function switchChapter"),
    source.indexOf("async function enterSpecialZone"),
  );
  assert.ok(switchChapter.includes("const targetChapter = chapter(chapterIndex);"));
  assert.ok(switchChapter.includes("const targetRegion = targetChapter?.region;"));
  assert.ok(switchChapter.includes('`.rg.open[data-rg="${targetRegion}"]`'));
  assert.ok(switchChapter.indexOf("await pacedClick(regionButton") < switchChapter.indexOf("const row = await waitFor"));
});

test("assistant status mounts into the native top bar instead of floating over game content", () => {
  assert.ok(source.includes('document.querySelector(".topbar .tb-sep")'));
  assert.ok(source.includes('host.classList.add("pca-host")'));
  assert.ok(source.includes("host.append(panel)"));
  assert.ok(source.includes(".topbar .tb-sep.pca-host"));
  assert.ok(!source.includes("enablePanelDragging(panel)"));
  assert.ok(!source.includes('data-act="pin"'));
});

test("task status remains visible in the native bar while settings use a dismissable modal", () => {
  assert.equal((source.match(/\$\{statusSummaryHtml\(\)\}/g) || []).length, 1);
  assert.ok(source.includes('class="pca-native-bar"'));
  assert.ok(source.includes('class="pca-modal-shade" data-act="collapse"'));
  assert.ok(source.includes('role="dialog" aria-modal="${!settings.floating}"'));
  assert.ok(source.includes("#${PANEL_ID}:not(.collapsed) .pca-modal{display:flex}"));
  assert.ok(source.includes('data-status="mode"'));
  assert.ok(source.includes('data-status="target"'));
  assert.ok(source.includes('data-status="attempts"'));
});

test("docked settings attach below the game top bar instead of centering", () => {
  assert.ok(source.includes("align-items:flex-start"));
  assert.ok(source.includes("padding:var(--pca-dock-top,12px)"));
  assert.equal(source.includes("align-items:center;justify-content:center;padding:24px"), false);
  const dock = sourceFunctionText("applyDockPosition");
  assert.ok(dock.includes('document.querySelector(".topbar")'));
  assert.ok(dock.includes('panel.querySelector(".pca-native-bar")'));
  assert.ok(dock.includes('panel.style.setProperty("--pca-dock-top"'));
  assert.ok(source.includes("settings.floating ? applyFloatPosition(panel) : applyDockPosition(panel)"));
});

test("native assistant can opt into a draggable resizable floating window and remember its geometry", () => {
  assert.ok(source.includes('floating: false'));
  assert.ok(source.includes('floatPosition: null'));
  assert.ok(source.includes('floatSize: null'));
  assert.ok(source.includes('data-act="float"'));
  assert.ok(source.includes('panel.classList.toggle("floating", settings.floating)'));
  assert.ok(source.includes("#${PANEL_ID}.floating .pca-modal-shade{display:none}"));
  assert.ok(source.includes("resize:both"));
  assert.ok(sourceFunctionText("enableFloatDragging").includes('handle.addEventListener("pointermove"'));
  assert.ok(sourceFunctionText("applyFloatPosition").includes("settings.floatPosition"));
  assert.ok(sourceFunctionText("applyFloatPosition").includes("settings.floatSize"));
  assert.ok(sourceFunctionText("observeFloatSize").includes("new ResizeObserver"));
});

test("local development uses vite-plugin-monkey", () => {
  assert.equal(packageJson.scripts.dev, "vite --host 127.0.0.1 --port 5173 --strictPort");
  assert.equal(packageJson.scripts.predev, "npm run build");
  assert.ok(packageJson.devDependencies["vite-plugin-monkey"]);
  assert.ok(viteConfig.includes('name: "Dev: PokeCatch Assistant / 全图鉴与推图助手"'));
  assert.ok(viteConfig.includes("prefix: false"));
  assert.ok(viteConfig.includes('entry: "src/template.user.js"'));
});
