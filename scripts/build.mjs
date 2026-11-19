import fs from "node:fs";
import os from "node:os";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [, , bundlePath, langPath] = process.argv;
if (!bundlePath || !langPath) {
  throw new Error("usage: node scripts/build.mjs <app-bundle.js> <lang-zh-Hans.js>");
}

async function readBuildSource(inputPath) {
  if (fs.existsSync(inputPath)) return fs.readFileSync(inputPath, "utf8");
  const filename = path.basename(inputPath).replace(/^pokecatch-/, "");
  const cached = path.join(os.tmpdir(), "pokecatch-battle-model", path.basename(inputPath));
  if (fs.existsSync(cached)) return fs.readFileSync(cached, "utf8");
  const response = await fetch(`https://pokecatch-online.pages.dev/bundle/${filename}`);
  if (!response.ok) throw new Error(`failed to download ${filename}: HTTP ${response.status}`);
  return response.text();
}

const bundle = await readBuildSource(bundlePath);
const langSource = await readBuildSource(langPath);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const template = fs.readFileSync(path.join(root, "src/template.user.js"), "utf8");

function extractLiteral(marker, open, close) {
  const start = bundle.indexOf(marker);
  if (start < 0) throw new Error(`marker not found: ${marker}`);
  const literalStart = start + marker.length - 1;
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = literalStart; i < bundle.length; i += 1) {
    const char = bundle[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === open) depth += 1;
    else if (char === close && --depth === 0) {
      return bundle.slice(literalStart, i + 1);
    }
  }
  throw new Error(`unterminated literal: ${marker}`);
}

function extractLiteralFromPattern(pattern, open, close) {
  const match = bundle.match(pattern);
  if (!match || match.index == null) throw new Error(`pattern not found: ${pattern}`);
  const literalStart = bundle.indexOf(open, match.index);
  if (literalStart < 0) throw new Error(`literal not found after pattern: ${pattern}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = literalStart; i < bundle.length; i += 1) {
    const char = bundle[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === open) depth += 1;
    else if (char === close && --depth === 0) return bundle.slice(literalStart, i + 1);
  }
  throw new Error(`unterminated literal after pattern: ${pattern}`);
}

function evaluateLiteral(source, args = {}) {
  return Function(...Object.keys(args), `"use strict"; return (${source});`)(...Object.values(args));
}

const pokedex = evaluateLiteral(extractLiteral("a.POKEDEX=[", "[", "]"));
const moves = evaluateLiteral(extractLiteral("a.MOVES={", "{", "}"));
const evolutions = evaluateLiteral(extractLiteral("a.EVOLUTIONS={", "{", "}"));
const statusMoves = evaluateLiteral(extractLiteral("a.STATUS=function(){const t={", "{", "}"));
const typeChart = evaluateLiteral(extractLiteral("a.TYPE_CHART={", "{", "}"));
const encounters = evaluateLiteral(extractLiteral("a.ENCOUNTERS={", "{", "}"));
const habitats = evaluateLiteral(extractLiteral("a.HABITATS={", "{", "}"));
const weather = evaluateLiteral(extractLiteral("WEATHER:{", "{", "}"));
const roamingWeather = evaluateLiteral(extractLiteral("MIN_LEVEL:100,WEATHER:{", "{", "}"));
const shinyStatBonus = Number(bundle.match(/SHINY_STAT_BONUS:([.\d]+)/)?.[1]);
const undergroundStats = bundle.match(/RANK_MAX:(\d+),RANK_STAT:([.\d]+)/);
if (!Number.isFinite(shinyStatBonus) || !undergroundStats) throw new Error("stat bonus constants not found");
const forms = evaluateLiteral(extractLiteralFromPattern(/\.FORMS=function\(\)\{const [A-Za-z_$][\w$]*=\[/, "[", "]"));
const specialHelperMatch = bundle.match(
  /const ([A-Za-z_$][\w$]*)=\{kind:"owns",ids:\[243,244,245\][^}]*\},([A-Za-z_$][\w$]*)=\{kind:"owns",ids:\[144,145,146\][^}]*\},[A-Za-z_$][\w$]*=\{[^;]*\},([A-Za-z_$][\w$]*)=[^=]*=>\(\{cond:\{kind:"door",key:[^}]+\}\}\)/,
);
if (!specialHelperMatch) throw new Error("special zone helper names not found");
const [, beastsConditionName, birdsConditionName, doorConditionName] = specialHelperMatch;
const specialZones = evaluateLiteral(
  extractLiteralFromPattern(/[A-Za-z_$][\w$]*=\[\{id:145,weather:"storm"/, "[", "]"),
  {
    [beastsConditionName]: { kind: "owns", ids: [243, 244, 245], text: "Possède les 3 bêtes légendaires" },
    [birdsConditionName]: { kind: "owns", ids: [144, 145, 146], text: "Possède les 3 oiseaux légendaires" },
    [doorConditionName]: (key) => ({ cond: { kind: "door", key } }),
  },
);
const compactWeather = {
  slotMs: weather.SLOT_MS,
  chance: weather.CHANCE,
  climates: weather.CLIMATES,
  regionOff: weather.REGION_OFF,
  regionWeights: weather.REGION_WEIGHTS,
  translate: weather.TRANSLATE,
  types: weather.TYPES,
};
const storyRegions = evaluateLiteral(extractLiteralFromPattern(/REGIONS:\[\{key:"kanto"/, "[", "]"));
const chapterLiteral = extractLiteral("CHAPTERS:[", "[", "]");
const unownLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "!", "?"];
const unownIds = unownLetters.map((_, index) => index === 0 ? 201 : 20100 + index);
const chapters = evaluateLiteral(chapterLiteral, { a: { UNOWN: { ids: unownIds } } });
const chapterRegions = [];
let chapterRegion = "kanto";
for (const chapter of chapters) {
  chapterRegion = chapter.reg || chapterRegion;
  chapterRegions.push(chapterRegion);
}
const storyRegionByKey = new Map(storyRegions.filter((region) => region.key).map((region) => [region.key, region]));
const exactChapterAce = chapters.map((chapter, index) => {
  if (chapter.ace != null) return chapter.ace;
  const region = storyRegionByKey.get(chapterRegions[index]);
  if (!region?.ace) return null;
  const ordinal = chapters.filter((previous, previousIndex) => (
    previousIndex < index && chapterRegions[previousIndex] === chapterRegions[index] && previous.ace == null
  )).length;
  return region.ace[0] + region.ace[1] * ordinal + (chapter.aceUp || 0);
});
const exactChapterCaps = chapters.map((chapter, index) => {
  const margin = chapter.capMargin ?? (chapter.league ? 3 : 0);
  let cap = Number(exactChapterAce[index] || 100) + margin;
  const champion = (chapter.steps || []).some((step) => step.champion);
  if (chapter.league && chapter.capMargin == null && !champion) {
    const leagueMax = Math.max(...chapters.map((item, itemIndex) => (
      item.league && chapterRegions[itemIndex] === chapterRegions[index] ? Number(exactChapterAce[itemIndex] || 0) : 0
    )));
    cap = Math.min(cap, leagueMax);
  }
  return Math.min(100, cap);
});

const exactChapterBands = chapters.map((chapter, index) => {
  const ace = exactChapterAce[index];
  if (ace == null) return null;
  const region = storyRegionByKey.get(chapterRegions[index]);
  const first = chapters.findIndex((item, itemIndex) => chapterRegions[itemIndex] === chapterRegions[index]);
  const previousAce = index > first ? exactChapterAce[index - 1] : null;
  return [previousAce ?? Number(region?.base || 0) + 2, ace - 1];
});

const context = { window: {} };
vm.createContext(context);
vm.runInContext(langSource, context, { timeout: 2_000 });
const lang = context.window.I18N_DATA?.["zh-Hans"] || {};
const translations = context.window.I18N?.["zh-Hans"] || {};

const translate = (value) => translations[value] || value;
const pokemonNames = Object.fromEntries(
  Object.entries(lang.pokemon || {}).map(([id, data]) => [id, data?.[0] || String(id)]),
);

let inheritedRegion = "kanto";
const compactChapters = chapters.map((chapter, index) => {
  inheritedRegion = chapter.reg || inheritedRegion;
  const steps = chapter.steps || [];
  const routeSteps = steps.filter((step) => step.kind === "route");
  const routeBands = new Map(routeSteps.map((step, routeIndex) => {
    if (step.lv) return [step, step.lv];
    const band = exactChapterBands[index];
    if (!band) return [step, null];
    const width = (band[1] - band[0]) / Math.max(1, routeSteps.length);
    const min = Math.round(band[0] + width * routeIndex);
    const max = Math.round(band[0] + width * (routeIndex + 1));
    return [step, [min, Math.max(min + 1, max)]];
  }));
  const boss = [...steps].reverse().find((step) => step.kind === "gym" || step.kind === "trainer");
  return {
    index,
    name: translate(chapter.name),
    sourceName: chapter.name,
    region: inheritedRegion,
    league: !!chapter.league,
    day: !!chapter.day,
    weather: chapter.weather,
    ace: chapter.ace || boss?.team?.reduce((max, [, level]) => Math.max(max, level), 0) || 1,
    gym: steps.some((step) => step.kind === "gym"),
    champion: steps.some((step) => step.champion),
    levelCap: exactChapterCaps[index],
    steps: steps.map((step, stepIndex) => ({
      stepIndex,
      kind: step.kind,
      name: translate(step.name),
      sourceName: step.name,
      ...(step.kind === "route" ? {
        wild: step.wild || 0,
        trainers: step.trainers || 0,
        areas: step.areas || [],
        species: step.species || [],
        habitat: step.habitat || null,
        bg: step.bg || null,
        indoor: step.indoor,
        climate: step.climate || null,
        weather: step.weather,
        levelBand: routeBands.get(step),
      } : {}),
      ...(step.kind === "trainer" ? {
        team: step.team || [],
        scale: !!step.scale,
        below: step.below ?? null,
        double: !!step.double,
      } : {}),
      ...(step.kind === "static" ? {
        id: step.id,
        level: step.level ?? null,
        power: step.power || 1,
      } : {}),
      ...(step.kind === "gym" ? {
        team: step.team || [],
        ace: step.ace ?? null,
        aceOffset: step.aceOffset || 0,
        power: step.power || 1,
        double: !!step.double,
        badge: step.badge || null,
        champion: !!step.champion,
        type: step.type || null,
      } : {}),
    })),
    routes: steps
      .map((step, stepIndex) => ({
        stepIndex,
        kind: step.kind,
        name: translate(step.name),
        sourceName: step.name,
        habitat: step.habitat || null,
        bg: step.bg || null,
        indoor: step.indoor,
        weather: step.weather,
        wild: step.wild || 0,
        trainers: step.trainers || 0,
        areas: step.areas || [],
        species: step.species || [],
        day: !!step.day,
        night: !!step.night,
        skies: step.skies || [],
        climate: step.climate || null,
        levelBand: routeBands.get(step),
      }))
      .filter((step) => step.wild > 0),
    staticEncounters: steps
      .map((step, stepIndex) => ({
        stepIndex,
        kind: step.kind,
        id: step.id,
        name: translate(step.name),
        sourceName: step.name,
        bg: step.bg || null,
        indoor: step.indoor,
        climate: step.climate || null,
        weather: step.weather,
        skies: step.skies || [],
        day: !!step.day,
        night: !!step.night,
        chance: step.chance || 1,
        caught: step.caught || [],
        once: step.once || null,
        level: step.level || null,
        rate: step.rate || null,
      }))
      .filter((step) => step.kind === "static" && step.id != null && step.chance < 1 && step.caught.length),
    boss: boss
      ? {
          name: translate(boss.leader || boss.trainer || boss.name),
          type: boss.type || null,
          team: boss.team || [],
          badge: boss.badge || null,
          champion: !!boss.champion,
          ace: boss.ace ?? null,
          aceOffset: boss.aceOffset || 0,
          power: boss.power || 1,
          double: !!boss.double,
        }
      : null,
  };
});

const preEvolution = new Map();
for (const [from, options] of Object.entries(evolutions)) {
  for (const option of options) if (!preEvolution.has(Number(option.to))) preEvolution.set(Number(option.to), Number(from));
}

function inheritedLearnset(pokemon) {
  const rows = [];
  const seen = new Set();
  for (let id = pokemon.id; id != null; id = preEvolution.get(Number(id))) {
    const ancestor = pokedex.find((entry) => Number(entry.id) === Number(id));
    for (const [level, key] of ancestor?.learn || []) {
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push([level, key]);
    }
  }
  return rows.sort((a, b) => a[0] - b[0] || a[1].localeCompare(b[1]));
}

const compactSpecies = Object.fromEntries(
  pokedex.map((pokemon) => [
    pokemon.id,
    {
      n: pokemonNames[pokemon.id] || pokemon.name,
      t: pokemon.types,
      s: [pokemon.stats.hp, pokemon.stats.atk, pokemon.stats.def, pokemon.stats.spa, pokemon.stats.spd, pokemon.stats.spe],
      l: inheritedLearnset(pokemon),
      g: !!pokemon.legendary,
      m: !!pokemon.mythical,
    },
  ]),
);

const singleFormBases = new Set(forms.filter((form) => form.single).map((form) => form.base));
for (const base of singleFormBases) {
  if (compactSpecies[base]) compactSpecies[base].u = base;
}

const baseUnown = compactSpecies[201];
baseUnown.n = `${baseUnown.n} A`;
baseUnown.d = "201-A";
for (let index = 1; index < unownLetters.length; index += 1) {
  const id = unownIds[index];
  compactSpecies[id] = { ...baseUnown, n: `${pokemonNames[201]} ${unownLetters[index]}`, d: `201-${unownLetters[index]}` };
}

const formIndexes = new Map();
for (const form of forms) {
  const base = compactSpecies[form.base];
  if (!base) continue;
  const index = formIndexes.get(form.base) || 0;
  formIndexes.set(form.base, index + 1);
  const suffix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index];
  const stats = form.stats
    ? [form.stats.hp, form.stats.atk, form.stats.def, form.stats.spa, form.stats.spd, form.stats.spe]
    : base.s;
  const extraMoves = [form.move, ...(form.moves || [])].filter((key) => key && moves[key]);
  compactSpecies[form.id] = {
    ...base,
    n: `${pokemonNames[form.base]} (${translate(form.form)})`,
    t: form.types || base.t,
    s: stats,
    l: [...base.l, ...extraMoves.map((key) => [50, key])],
    d: `${form.base}-${suffix}`,
    ...(singleFormBases.has(form.base) ? { u: form.base } : {}),
  };
}

const compactMoves = Object.fromEntries(
  Object.entries(moves).map(([key, move]) => [key, [move.type, move.power || 0, move.acc || 100, move.cat || "status"]]),
);

const compactStatusMoves = Object.fromEntries(
  Object.entries(statusMoves).map(([key, [status, chance]]) => [key, [status, chance]]),
);

const compactEvolutions = Object.fromEntries(
  Object.entries(evolutions).map(([id, options]) => [id, options.map((option) => ({
    to: option.to,
    ...(option.level != null ? { level: option.level } : {}),
    ...(option.item ? { item: option.item } : {}),
  }))]),
);

const numericConfig = (key, fallback) => {
  const match = bundle.match(new RegExp(`${key}:([.\\d]+)`));
  return match ? Number(match[1]) : fallback;
};

const gymTrainerConfig = bundle.match(/GYM_TRAINERS:\{counts:\[([.\d,]+)\],below:\[([.\d,]+)\],damage:([.\d]+)\}/);

const battle = {
  maxLevel: numericConfig("MAX_LEVEL", 100),
  leagueDoneCap: numericConfig("LEAGUE_DONE_CAP", 100),
  levelGap: numericConfig("LEVEL_GAP", 1.06),
  damageRoll: 0.85,
  gymDamage: numericConfig("GYM_DAMAGE", 1.3),
  gymHpMult: numericConfig("GYM_HP_MULT", 1.3),
  gymTeamExp: numericConfig("GYM_TEAM_EXP", 0.7),
  enemyHpPerAlly: numericConfig("ENEMY_HP_PER_ALLY", 0.7),
  enemyDamage: {
    wild: Number(bundle.match(/ENEMY_DAMAGE:\{wild:([.\d]+)/)?.[1] || 0.85),
    trainer: Number(bundle.match(/ENEMY_DAMAGE:\{wild:[.\d]+,trainer:([.\d]+)/)?.[1] || 0.9),
    static: Number(bundle.match(/ENEMY_DAMAGE:\{wild:[.\d]+,trainer:[.\d]+,static:([.\d]+)/)?.[1] || 1),
  },
  gymTrainers: {
    counts: gymTrainerConfig?.[1].split(",").map(Number) || [1, 2, 2, 3],
    below: gymTrainerConfig?.[2].split(",").map(Number) || [4, 2, 2],
    damage: Number(gymTrainerConfig?.[3] || 0.8),
  },
  hpLevelScale: numericConfig("HP_LEVEL_SCALE", 1.5),
  hpLevelMax: numericConfig("HP_LEVEL_MAX", 2.5),
  hpBoost: numericConfig("HP_BOOST", 1.1),
  statusMoveChance: numericConfig("STATUS_MOVE_CHANCE", 0.3),
  fullParalysisChance: numericConfig("FULL_PARA_CHANCE", 0.25),
  confusionSelfHitChance: numericConfig("CONFUSION_SELF_HIT", 1 / 3),
  thawChance: numericConfig("THAW_CHANCE", 0.2),
  statusFx: {
    dotTurns: Number(bundle.match(/STATUS_FX:\{STAT:\{[^}]+\},DOT_TURNS:(\d+)/)?.[1] || 5),
    paralysisTurns: Number(bundle.match(/STATUS_FX:\{STAT:\{[^}]+\},DOT_TURNS:\d+,PARA_TURNS:(\d+)/)?.[1] || 3),
  },
  bossStatus: {
    hurt: numericConfig("HURT", 60),
    dotTurns: Number(bundle.match(/BOSS_STATUS:\{HURT:[.\d]+,DOT_TURNS:(\d+)/)?.[1] || 4),
    lockMax: Number(bundle.match(/BOSS_STATUS:\{HURT:[.\d]+,DOT_TURNS:\d+,LOCK_MAX:(\d+)/)?.[1] || 2),
    paralysisBlock: Number(bundle.match(/BOSS_STATUS:\{[^}]+PARA_BLOCK:([.\d]+)/)?.[1] || 0.2),
  },
  trainerItemEvolutionLevel: numericConfig("TRAINER_ITEM_EVO_LEVEL", 40),
};

const compactCondition = (condition) => condition ? {
  kind: condition.kind,
  ...(condition.ids ? { ids: condition.ids } : {}),
  ...(condition.region ? { region: condition.region } : {}),
  ...(condition.item ? { item: condition.item } : {}),
  ...(condition.key ? { key: condition.key } : {}),
  ...(condition.types ? { types: condition.types } : {}),
  ...(condition.type ? { type: condition.type } : {}),
  ...(condition.dex ? { dex: condition.dex } : {}),
  ...(condition.need != null ? { need: condition.need } : {}),
  ...(condition.field ? { field: condition.field } : {}),
  ...(condition.zone != null ? { zone: condition.zone } : {}),
  ...(condition.tier != null ? { tier: condition.tier } : {}),
  ...(condition.text ? { text: translate(condition.text) } : {}),
  ...(condition.list ? { list: condition.list.map(compactCondition) } : {}),
} : null;

const compactSpecialZones = specialZones.map((zone) => ({
  id: zone.id,
  region: zone.region,
  zone: translate(zone.zone),
  sourceZone: zone.zone,
  areas: zone.areas || [],
  dex: zone.dex || null,
  level: zone.level || 100,
  badge: zone.badge || null,
  badgeName: zone.badge ? translate(zone.badge) : null,
  condition: compactCondition(zone.cond),
}));

const appMatch = bundlePath.match(/app\.([^.]+)\.js$/);
const langMatch = langPath.match(/lang-zh-Hans\.([^.]+)\.js$/);
const gameData = {
  appBuild: appMatch?.[1] || "unknown",
  langBuild: langMatch?.[1] || "unknown",
  species: compactSpecies,
  moves: compactMoves,
  statusMoves: compactStatusMoves,
  evolutions: compactEvolutions,
  typeChart,
  chapters: compactChapters,
  encounters,
  habitats,
  weather: compactWeather,
  roamingWeather,
  specialZones: compactSpecialZones,
  shinyStatBonus,
  rankMax: Number(undergroundStats[1]),
  rankStatMultiplier: Number(undergroundStats[2]),
  battle,
};

if (!template.includes("/*__GAME_DATA__*/")) throw new Error("template placeholder missing");
const output = template.replace("/*__GAME_DATA__*/", JSON.stringify(gameData));
fs.writeFileSync(path.join(root, "dist/pokecatch-assistant.user.js"), output);
console.log(`built dist/pokecatch-assistant.user.js (${output.length.toLocaleString()} bytes)`);
