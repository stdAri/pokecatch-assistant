import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const [, , bundlePath, langPath] = process.argv;
if (!bundlePath || !langPath) {
  throw new Error("usage: node scripts/build.mjs <app-bundle.js> <lang-zh-Hans.js>");
}

const bundle = fs.readFileSync(bundlePath, "utf8");
const langSource = fs.readFileSync(langPath, "utf8");
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
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
const typeChart = evaluateLiteral(extractLiteral("a.TYPE_CHART={", "{", "}"));
const encounters = evaluateLiteral(extractLiteral("a.ENCOUNTERS={", "{", "}"));
const habitats = evaluateLiteral(extractLiteral("a.HABITATS={", "{", "}"));
const weather = evaluateLiteral(extractLiteral("WEATHER:{", "{", "}"));
const roamingWeather = evaluateLiteral(extractLiteral("MIN_LEVEL:100,WEATHER:{", "{", "}"));
const shinyStatBonus = Number(bundle.match(/SHINY_STAT_BONUS:([.\d]+)/)?.[1]);
const undergroundStats = bundle.match(/RANK_MAX:(\d+),RANK_STAT:([.\d]+)/);
if (!Number.isFinite(shinyStatBonus) || !undergroundStats) throw new Error("stat bonus constants not found");
const forms = evaluateLiteral(extractLiteralFromPattern(/\.FORMS=function\(\)\{const [A-Za-z_$][\w$]*=\[/, "[", "]"));
const specialZones = evaluateLiteral(
  extractLiteralFromPattern(/[A-Za-z_$][\w$]*=\[\{id:145,weather:"storm"/, "[", "]"),
  {
    i: { kind: "owns", ids: [243, 244, 245], text: "Possède les 3 bêtes légendaires" },
    P: { kind: "owns", ids: [144, 145, 146], text: "Possède les 3 oiseaux légendaires" },
    Me: (key) => ({ cond: { kind: "door", key } }),
    r: { kind: "owns", ids: [243, 244, 245], text: "Possède les 3 bêtes légendaires" },
    te: { kind: "owns", ids: [144, 145, 146], text: "Possède les 3 oiseaux légendaires" },
    xe: (key) => ({ cond: { kind: "door", key } }),
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
const chapterLiteral = extractLiteral("CHAPTERS:[", "[", "]");
const unownLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "!", "?"];
const unownIds = unownLetters.map((_, index) => index === 0 ? 201 : 20100 + index);
const chapters = evaluateLiteral(chapterLiteral, { a: { UNOWN: { ids: unownIds } } });

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
  const boss = [...steps].reverse().find((step) => step.kind === "gym" || step.kind === "trainer");
  return {
    index,
    name: translate(chapter.name),
    sourceName: chapter.name,
    region: inheritedRegion,
    day: !!chapter.day,
    weather: chapter.weather,
    ace: chapter.ace || boss?.team?.reduce((max, [, level]) => Math.max(max, level), 0) || 1,
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
      }))
      .filter((step) => step.wild > 0),
    boss: boss
      ? {
          name: translate(boss.leader || boss.trainer || boss.name),
          type: boss.type || null,
          team: boss.team || [],
          badge: boss.badge || null,
          champion: !!boss.champion,
        }
      : null,
  };
});

const compactSpecies = Object.fromEntries(
  pokedex.map((pokemon) => [
    pokemon.id,
    {
      n: pokemonNames[pokemon.id] || pokemon.name,
      t: pokemon.types,
      s: [pokemon.stats.hp, pokemon.stats.atk, pokemon.stats.def, pokemon.stats.spa, pokemon.stats.spd, pokemon.stats.spe],
      l: pokemon.learn,
      g: !!pokemon.legendary,
      m: !!pokemon.mythical,
    },
  ]),
);

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
  };
}

const compactMoves = Object.fromEntries(
  Object.entries(moves).map(([key, move]) => [key, [move.type, move.power || 0, move.acc || 100, move.cat || "status"]]),
);

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
};

if (!template.includes("/*__GAME_DATA__*/")) throw new Error("template placeholder missing");
const output = template.replace("/*__GAME_DATA__*/", JSON.stringify(gameData));
fs.writeFileSync(path.join(root, "dist/pokecatch-assistant.user.js"), output);
console.log(`built dist/pokecatch-assistant.user.js (${output.length.toLocaleString()} bytes)`);
