// ==UserScript==
// @name         PokeCatch 全图鉴与推图助手
// @namespace    local.pokecatch.assistant
// @version      0.1.0
// @description  推图、缺失图鉴、徘徊神兽、第五队和果子自动化。只读取游戏状态并通过正常界面点击操作。
// @match        https://pokecatch-online.netlify.app/*
// @match        https://pokecatch-online.pages.dev/*
// @run-at       document-idle
// @grant        GM_notification
// ==/UserScript==

(() => {
  "use strict";

  if (window.__pokeCatchAssistant) return;

  const DATA = /*__GAME_DATA__*/;
  const SAVE_KEY = "gachamon-save-v1";
  const SETTINGS_KEY = "pca.settings.v1";
  const SESSION_KEY = "pca.session.v1";
  const PANEL_ID = "pca-panel";
  const VERSION = "0.1.0";

  const BERRIES = {
    "razz-berry": { family: "capture", label: "普通捕获果 ×1.25" },
    "golden-razz-berry": { family: "capture", label: "金色捕获果 ×1.5" },
    "nanab-berry": { family: "rare", label: "稀有遭遇果" },
    "enigma-berry": { family: "dex", label: "缺失图鉴果" },
    "pinap-berry": { family: "xp", label: "经验果" },
    "lansat-berry": { family: "money", label: "金钱果" },
    "starf-berry": { family: "shiny", label: "异色果" },
  };

  const DEFAULT_SETTINGS = {
    collapsed: false,
    activeTab: "push",
    panelPosition: null,
    lockTeam5: false,
    desktopNotifications: false,
    soundNotifications: true,
    regionScope: "current",
    customRegions: ["kanto", "johto"],
    manualTargets: [],
    roamingPriority: [243, 244, 245],
    berries: Object.fromEntries(Object.keys(BERRIES).map((key) => [key, { enabled: false, reserve: 0 }])),
  };

  const runtime = {
    mode: "idle",
    paused: false,
    busy: false,
    target: null,
    targetPlan: null,
    expectedChapter: null,
    pushRegion: null,
    teamStatus: "未生成",
    teamPlan: null,
    userTeamOverride: false,
    lastTeamSignature: "",
    lastTeamCheckAt: 0,
    lastBerryCheckAt: 0,
    lastRoamTries: {},
    lastDeaths: {},
    failureTeams: new Map(),
    observedEnemies: new Map(),
    lastOpponent: new Map(),
    deathSeries: new Map(),
    attempts: 0,
    logs: [],
    error: null,
    timer: null,
  };

  let settings = loadSettings();

  function mergeDeep(base, value) {
    const output = { ...base };
    for (const [key, item] of Object.entries(value || {})) {
      output[key] = item && typeof item === "object" && !Array.isArray(item)
        ? mergeDeep(base[key] || {}, item)
        : item;
    }
    return output;
  }

  function loadSettings() {
    try {
      return mergeDeep(DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"));
    } catch {
      return structuredClone(DEFAULT_SETTINGS);
    }
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function readSave() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) throw new Error("找不到游戏存档");
    const save = JSON.parse(raw);
    if (!save?.adv || !Array.isArray(save.mons) || !save.dex || !save.teamSets?.list) {
      throw new Error("游戏存档结构不兼容");
    }
    return save;
  }

  function gameBuild() {
    const script = [...document.scripts].map((item) => item.src).find((src) => /\/app\.[^.]+\.js/.test(src));
    return script?.match(/\/app\.([^.]+)\.js/)?.[1] || "unknown";
  }

  function validateCompatibility() {
    const build = gameBuild();
    const selectors = ["#side-chapter", "#timeline", "#team-sets", "#team-slots", "#bag-panel"];
    const missing = selectors.filter((selector) => !document.querySelector(selector));
    return {
      ok: build === DATA.appBuild && missing.length === 0,
      build,
      expected: DATA.appBuild,
      missing,
    };
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const jitter = (min = 350, max = 750) => sleep(Math.round(min + Math.random() * (max - min)));

  async function waitFor(getter, { timeout = 6_000, interval = 80, label = "页面状态" } = {}) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const value = getter();
      if (value) return value;
      await sleep(interval);
    }
    throw new Error(`等待${label}超时`);
  }

  async function exclusive(label, action) {
    if (runtime.busy) return false;
    runtime.busy = true;
    renderStatus();
    try {
      await action();
      return true;
    } catch (error) {
      diagnostic(label, error);
      return false;
    } finally {
      runtime.busy = false;
      renderStatus();
    }
  }

  function log(message, level = "info") {
    const item = { at: Date.now(), message, level };
    runtime.logs.unshift(item);
    runtime.logs.length = Math.min(runtime.logs.length, 80);
    console[level === "error" ? "error" : "log"](`[PCA] ${message}`);
    renderLog();
  }

  function diagnostic(phase, error, extra = {}) {
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    runtime.error = {
      at: new Date().toISOString(),
      phase,
      target: runtime.target,
      currentChapter: save?.adv?.chapter,
      targetChapter: runtime.targetPlan?.chapter ?? runtime.expectedChapter,
      expected: extra.expected || "正常界面操作成功",
      observed: extra.observed || String(error?.message || error),
      retryCount: extra.retryCount || 0,
      gameVersion: gameBuild(),
      safeStopped: true,
      suggestion: extra.suggestion || "暂停后重新打开相应页面；若游戏刚更新，请更新助手数据。",
    };
    runtime.paused = true;
    log(`${phase}：${runtime.error.observed}`, "error");
    notifyUser("PokeCatch 助手已安全暂停", `${phase}：${runtime.error.observed}`);
    renderStatus();
  }

  function notifyUser(title, body) {
    if (settings.soundNotifications) beep();
    if (settings.desktopNotifications && typeof GM_notification === "function") {
      GM_notification({ title, text: body, timeout: 8_000 });
    }
  }

  function beep() {
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 740;
      gain.gain.value = 0.035;
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.16);
    } catch { /* browser may block audio */ }
  }

  function species(id) {
    return DATA.species[String(id)] || DATA.species[id] || null;
  }

  function chapter(index) {
    return DATA.chapters[index] || null;
  }

  function currentRegion(save) {
    return chapter(save.adv.chapter)?.region || chapter(save.adv.unlocked)?.region || "kanto";
  }

  function isCaught(save, id) {
    return Number(save.dex?.[id]?.caught || 0) > 0;
  }

  function typeEffect(attackType, defenderTypes) {
    const row = DATA.typeChart[attackType] || {};
    return (defenderTypes || []).reduce((value, type) => value * (row[type] ?? 1), 1);
  }

  function learnedMoves(meta, level) {
    return (meta?.l || [])
      .filter(([learnLevel, key]) => learnLevel <= level && DATA.moves[key]?.[1] > 0)
      .map(([, key]) => ({ key, type: DATA.moves[key][0], power: DATA.moves[key][1], accuracy: DATA.moves[key][2] }));
  }

  function enemyProfiles(enemyIds) {
    return enemyIds.map((id) => species(id)).filter(Boolean);
  }

  function scoreCandidate(mon, enemies, continuitySet, selected) {
    const meta = species(mon.id);
    if (!meta) return { score: -Infinity, reason: "缺少资料" };
    const stats = meta.s;
    const bst = stats.reduce((sum, value) => sum + value, 0);
    const moves = learnedMoves(meta, mon.level);
    const enemyList = enemies.length ? enemies : [{ t: ["normal"], s: [50, 50, 50, 50, 50, 50] }];

    const offense = enemyList.reduce((sum, enemy) => {
      const best = moves.reduce((max, move) => {
        const stab = meta.t.includes(move.type) ? 1.5 : 1;
        return Math.max(max, move.power * move.accuracy / 100 * stab * typeEffect(move.type, enemy.t));
      }, 20);
      return sum + best;
    }, 0) / enemyList.length;

    const defense = enemyList.reduce((sum, enemy) => {
      const danger = Math.max(...enemy.t.map((type) => typeEffect(type, meta.t)), 1);
      return sum + 1 / danger;
    }, 0) / enemyList.length;

    const samePrimary = selected.filter((item) => species(item.id)?.t?.[0] === meta.t[0]).length;
    const continuity = continuitySet.has(mon.uid) ? 18 : 0;
    const levelContribution = Math.min(100, mon.level) * 0.22;
    const score = bst * 0.21 + offense * 0.82 + defense * 34 + stats[5] * 0.08 + levelContribution + continuity - samePrimary * 16;
    return {
      score,
      reason: `能力${bst} · 克制${offense.toFixed(0)} · 防守${defense.toFixed(2)} · Lv.${mon.level}`,
    };
  }

  function recommendTeam(save, enemyIds, excludedSignatures = new Set()) {
    const enemies = enemyProfiles(enemyIds);
    const currentFive = new Set(save.teamSets?.list?.[4] || []);
    const candidates = save.mons.filter((mon) => mon?.uid && mon.level > 0);
    const selected = [];
    const details = [];
    while (selected.length < 6 && selected.length < candidates.length) {
      const ranked = candidates
        .filter((mon) => !selected.some((item) => item.uid === mon.uid))
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected) }))
        .sort((a, b) => b.score - a.score);
      const choice = ranked[0];
      if (!choice) break;
      selected.push(choice.mon);
      details.push({ uid: choice.mon.uid, id: choice.mon.id, name: species(choice.mon.id)?.n || choice.mon.id, score: choice.score, reason: choice.reason });
    }

    const signature = selected.map((mon) => mon.uid).sort().join("|");
    if (excludedSignatures.has(signature) && candidates.length > 6) {
      const last = selected.pop();
      const replacement = candidates
        .filter((mon) => !selected.some((item) => item.uid === mon.uid) && mon.uid !== last.uid)
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected) }))
        .sort((a, b) => b.score - a.score)[0];
      if (replacement) selected.push(replacement.mon);
    }
    return { mons: selected, details, enemyIds, signature: selected.map((mon) => mon.uid).sort().join("|") };
  }

  function targetEnemyIdsForChapter(chapterIndex) {
    const ids = chapter(chapterIndex)?.boss?.team?.map(([id]) => id) || [];
    const observed = runtime.observedEnemies.get(chapterIndex) || new Set();
    return [...new Set([...ids, ...observed])];
  }

  async function openScreen(name) {
    const button = document.querySelector(`#tabs [data-screen="${name}"]`);
    if (!button) throw new Error(`找不到${name}页面按钮`);
    if (!button.classList.contains("active")) {
      button.click();
      await waitFor(() => button.classList.contains("active"), { label: `${name}页面` });
      await jitter();
    }
  }

  async function switchChapter(chapterIndex) {
    runtime.expectedChapter = chapterIndex;
    await openScreen("adventure");
    let visibleRow = document.querySelector(`.mp-row[data-ch="${chapterIndex}"]`);
    if (!visibleRow) document.querySelector("#side-chapter")?.click();
    const row = await waitFor(
      () => document.querySelector(`.mp-row[data-ch="${chapterIndex}"]`),
      { label: `章节${chapterIndex}列表项` },
    );
    row.click();
    const go = await waitFor(
      () => document.querySelector(`.mp-go[data-go="${chapterIndex}"]`),
      { label: `章节${chapterIndex}进入按钮` },
    );
    await jitter();
    go.click();
    await waitFor(() => readSave().adv.chapter === chapterIndex, { timeout: 10_000, label: `进入章节${chapterIndex}` });
    await jitter(500, 900);
    runtime.expectedChapter = null;
    log(`已进入：${chapter(chapterIndex)?.name || `章节${chapterIndex}`}`);
  }

  async function resetChapter(plan) {
    const save = readSave();
    if (plan.roaming) {
      const region = currentRegion(save);
      const transit = DATA.chapters
        .filter((item) => item.region === region && item.index <= save.adv.unlocked && item.index !== plan.chapter)
        .sort((a, b) => Math.abs(a.index - plan.chapter) - Math.abs(b.index - plan.chapter))[0];
      if (!transit) throw new Error("找不到神兽章节的中转章节");
      await switchChapter(transit.index);
      await switchChapter(plan.chapter);
      return;
    }
    const alternatives = plansForSpecies(save, plan.speciesId).filter((item) => item.chapter !== plan.chapter);
    if (alternatives.length) {
      runtime.targetPlan = alternatives[0];
      await switchChapter(alternatives[0].chapter);
      return;
    }
    const region = currentRegion(save);
    const transit = DATA.chapters
      .filter((item) => item.region === region && item.index <= save.adv.unlocked && item.index !== plan.chapter)
      .sort((a, b) => Math.abs(a.index - plan.chapter) - Math.abs(b.index - plan.chapter))[0];
    if (!transit) throw new Error("找不到可用中转章节");
    await switchChapter(transit.index);
    await switchChapter(plan.chapter);
  }

  async function applyRecommendedTeam(plan, reason) {
    runtime.teamPlan = plan;
    runtime.teamStatus = `推荐完成：${reason}`;
    renderStatus();
    if (settings.lockTeam5 || runtime.userTeamOverride) {
      log(`第五队已锁定，仅生成推荐：${plan.details.map((item) => item.name).join("、")}`);
      return;
    }
    await configurePreset(4, plan.mons.map((mon) => mon.uid));
    runtime.lastTeamSignature = (readSave().teamSets?.list?.[4] || []).join("|");
    runtime.teamStatus = `已应用：${plan.details.map((item) => item.name).join("、")}`;
    log(runtime.teamStatus);
  }

  async function configurePreset(presetIndex, desiredUids) {
    if (desiredUids.length < 1) throw new Error("推荐阵容为空");
    await openScreen("team");
    const preset = await waitFor(() => document.querySelector(`#team-sets [data-set="${presetIndex}"]`), { label: `队伍${presetIndex + 1}` });
    preset.click();
    await waitFor(() => readSave().teamSets?.on === presetIndex, { label: `切换到队伍${presetIndex + 1}` });
    await jitter();

    document.querySelector("#pc-evo.on")?.click();
    document.querySelector("#pc-shiny.on")?.click();
    for (const filter of [...document.querySelectorAll("#pc-active button")]) filter.click();
    const search = document.querySelector("#pc-search");
    if (search) {
      search.value = "";
      search.dispatchEvent(new Event("input", { bubbles: true }));
    }

    let current = [...readSave().team];
    for (const uid of current.filter((item) => !desiredUids.includes(item))) {
      if (readSave().team.length <= 1) break;
      document.querySelector(`#team-slots [data-team-uid="${CSS.escape(uid)}"]`)?.click();
      await waitFor(() => !readSave().team.includes(uid), { label: "移除队伍成员" });
      await jitter(180, 360);
    }

    for (const uid of desiredUids) {
      if (readSave().team.includes(uid)) continue;
      const mon = readSave().mons.find((item) => item.uid === uid);
      if (!mon) continue;
      if (search) {
        search.value = species(mon.id)?.n || "";
        search.dispatchEvent(new Event("input", { bubbles: true }));
        await sleep(120);
      }
      const card = await waitFor(
        () => document.querySelector(`#pc-grid .pc-cell[data-uid="${CSS.escape(uid)}"]`),
        { label: `电脑中的${species(mon.id)?.n || mon.id}` },
      );
      card.click();
      await waitFor(() => readSave().team.includes(uid), { label: "加入队伍" });
      await jitter(180, 360);
    }

    current = [...readSave().team];
    for (const uid of current.filter((item) => !desiredUids.includes(item))) {
      if (readSave().team.length <= desiredUids.length) break;
      document.querySelector(`#team-slots [data-team-uid="${CSS.escape(uid)}"]`)?.click();
      await waitFor(() => !readSave().team.includes(uid), { label: "清理多余成员" });
      await jitter(180, 360);
    }

    if (search) {
      search.value = "";
      search.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const final = readSave().team;
    if (desiredUids.some((uid) => !final.includes(uid))) throw new Error("第五队未能完整应用");
  }

  function habitatForRoute(route) {
    const exact = `${route.sourceName}|${route.areas.join("+")}`;
    if (DATA.habitats[exact]) return DATA.habitats[exact];
    const match = Object.entries(DATA.habitats).find(([key]) => key.startsWith(`${route.sourceName}|`));
    return match?.[1] || null;
  }

  function routeWeights(route) {
    const weights = {};
    const add = (id, value) => { weights[id] = Math.max(weights[id] || 0, Number(value) || 0); };
    for (const id of route.species || []) add(id, 1);
    const habitat = habitatForRoute(route);
    const hour = new Date().getHours();
    const timeKey = hour >= 6 && hour < 18 ? "day" : "night";
    const activeTables = habitat ? [habitat.base, habitat[timeKey]] : [];
    for (const table of activeTables) {
      if (!table || typeof table !== "object") continue;
      for (const [id, weight] of Object.entries(table)) if (weight > 0) add(id, weight);
    }
    if (!habitat) {
      for (const area of route.areas || []) {
        for (const entry of DATA.encounters[area] || []) {
          const [id, , , weight, method] = entry;
          if (method === "gift") continue;
          add(id, weight || 1);
        }
      }
    }
    return weights;
  }

  function availableChapters(save) {
    const region = currentRegion(save);
    return DATA.chapters.filter((item) => {
      if (item.index > save.adv.unlocked) return false;
      if (settings.regionScope === "current") return item.region === region;
      if (settings.regionScope === "custom") return settings.customRegions.includes(item.region);
      return true;
    });
  }

  function plansForSpecies(save, speciesId) {
    const plans = [];
    for (const item of availableChapters(save)) {
      for (const route of item.routes) {
        const weight = routeWeights(route)[speciesId] || 0;
        if (weight <= 0) continue;
        const prefixCost = route.stepIndex + 1;
        const score = weight * Math.max(1, route.wild) / prefixCost;
        plans.push({
          speciesId: Number(speciesId),
          chapter: item.index,
          chapterName: item.name,
          zone: route.name,
          sourceZone: route.sourceName,
          wild: route.wild,
          prefixCost,
          weight,
          score,
        });
      }
    }
    return plans.sort((a, b) => b.score - a.score || a.prefixCost - b.prefixCost);
  }

  function chooseMissingPlan(save) {
    if (settings.manualTargets.length) {
      for (const id of settings.manualTargets) {
        if (isCaught(save, id)) continue;
        const option = plansForSpecies(save, id)[0];
        if (option) return option;
      }
    }
    const plans = [];
    for (const [id] of Object.entries(DATA.species)) {
      if (isCaught(save, id)) continue;
      const options = plansForSpecies(save, Number(id));
      if (options.length) plans.push(options[0]);
    }
    return plans.sort((a, b) => b.score - a.score || a.prefixCost - b.prefixCost)[0] || null;
  }

  function activeRoamers(save) {
    const now = Date.now();
    return settings.roamingPriority
      .filter((id) => !isCaught(save, id))
      .map((id) => {
        const state = save.roam?.at?.[id] || {};
        return { id, chapter: state.ch ?? state.chapter, until: state.until ?? state.at ?? 0 };
      })
      .filter((item) => Number.isInteger(item.chapter) && item.until > now);
  }

  function timelinePlanStatus(plan) {
    const nodes = [...document.querySelectorAll("#timeline .tl-node")];
    const matchesZone = (node) => {
      const title = node.title || "";
      return title.startsWith(`${plan.zone} ·`) || title.startsWith(`${plan.sourceZone} ·`);
    };
    const relevant = nodes.map((node, index) => ({ node, index })).filter(({ node }) => matchesZone(node));
    const wild = relevant.filter(({ node }) => node.classList.contains("wild"));
    return {
      nodes,
      relevant,
      wild,
      lastWild: wild.at(-1)?.index ?? -1,
      current: nodes.findIndex((node) => node.classList.contains("current")),
    };
  }

  function observeBattle(save) {
    const battle = save.adv?.battle;
    if (!battle) return;
    const enemies = [
      ...(battle.enemies || []),
      ...(battle.foes || []),
    ];
    const ids = enemies.map((item) => Number(item?.id ?? item)).filter((id) => species(id));
    if (!ids.length) return;
    const set = runtime.observedEnemies.get(save.adv.chapter) || new Set();
    ids.forEach((id) => set.add(id));
    runtime.observedEnemies.set(save.adv.chapter, set);
    runtime.lastOpponent.set(save.adv.chapter, {
      signature: [...ids].sort((a, b) => a - b).join("-"),
      ids,
      maxLevel: Math.max(...enemies.map((item) => Number(item?.level || 0)), 0),
    });
  }

  async function pushTick(save) {
    const region = runtime.pushRegion || currentRegion(save);
    const regionChapters = DATA.chapters.filter((item) => item.region === region && item.index <= save.adv.unlocked);
    const frontierData = regionChapters.at(-1);
    if (!frontierData) throw new Error(`当前地区${region}没有可挑战章节`);
    const frontier = frontierData.index;
    const finalRegionChapter = DATA.chapters.filter((item) => item.region === region).at(-1);
    const finalBadge = finalRegionChapter?.boss?.badge;
    if (frontier === finalRegionChapter?.index && finalBadge && save.adv.badges?.includes(finalBadge)) {
      notifyUser("当前地区推图完成", `${finalRegionChapter.name}已经通关。`);
      log(`当前地区已完成：${finalRegionChapter.name}`);
      stopMode();
      return;
    }
    if (save.adv.chapter !== frontier && !runtime.busy) {
      await exclusive("切换剧情前沿", () => switchChapter(frontier));
      return;
    }

    const targetKey = `push:${frontier}`;
    if (runtime.target !== targetKey) {
      runtime.target = targetKey;
      runtime.targetPlan = { chapter: frontier, chapterName: chapter(frontier)?.name };
      runtime.userTeamOverride = false;
      const failures = runtime.failureTeams.get(frontier) || new Set();
      const plan = recommendTeam(save, targetEnemyIdsForChapter(frontier), failures);
      await exclusive("生成推图阵容", () => applyRecommendedTeam(plan, chapter(frontier)?.name || `章节${frontier}`));
      return;
    }

    const deaths = Number(save.adv.deaths?.[frontier] || 0);
    const previous = Number(runtime.lastDeaths[frontier] ?? deaths);
    if (deaths > previous) {
      const delta = deaths - previous;
      runtime.attempts += delta;
      const bossLevels = chapter(frontier)?.boss?.team?.map(([, level]) => level) || [];
      const opponent = runtime.lastOpponent.get(frontier);
      const enemyMax = opponent?.maxLevel || Math.max(...bossLevels, 1);
      const teamMons = (save.teamSets?.list?.[4] || []).map((uid) => save.mons.find((mon) => mon.uid === uid)).filter(Boolean);
      const ourMin = teamMons.length ? Math.min(...teamMons.map((mon) => mon.level)) : 0;
      const signature = opponent?.signature || "unknown";
      const priorSeries = runtime.deathSeries.get(frontier);
      const series = priorSeries?.signature === signature
        ? { signature, count: priorSeries.count + delta }
        : { signature, count: delta };
      runtime.deathSeries.set(frontier, series);
      if (teamMons.length === 6 && ourMin >= enemyMax && series.count >= 3) {
        runtime.deathSeries.set(frontier, { signature, count: 0 });
        const failed = runtime.failureTeams.get(frontier) || new Set();
        if (runtime.teamPlan?.signature) failed.add(runtime.teamPlan.signature);
        runtime.failureTeams.set(frontier, failed);
        const plan = recommendTeam(save, targetEnemyIdsForChapter(frontier), failed);
        notifyUser("阵容需要调整", `同一章节连续失败，重新配置${chapter(frontier)?.name || "当前章节"}阵容。`);
        await exclusive("失败后重新配队", () => applyRecommendedTeam(plan, "连续失败后调整"));
      }
    }
    runtime.lastDeaths[frontier] = deaths;
  }

  async function collectTick(save) {
    const roamers = activeRoamers(save);
    if (roamers.length) {
      const roamer = roamers[0];
      const targetKey = `roam:${roamer.id}`;
      if (runtime.target !== targetKey) {
        runtime.target = targetKey;
        runtime.targetPlan = {
          speciesId: roamer.id,
          chapter: roamer.chapter,
          chapterName: chapter(roamer.chapter)?.name,
          roaming: true,
          until: roamer.until,
        };
        runtime.userTeamOverride = false;
        runtime.attempts = 0;
        const plan = recommendTeam(save, [roamer.id]);
        await exclusive("配置神兽阵容", async () => {
          await applyRecommendedTeam(plan, species(roamer.id)?.n || String(roamer.id));
          if (readSave().adv.chapter !== roamer.chapter) await switchChapter(roamer.chapter);
        });
        return;
      }

      const tries = Number(save.legTries?.[roamer.id] || 0);
      const previous = Number(runtime.lastRoamTries[roamer.id] ?? tries);
      if (tries > previous && !isCaught(save, roamer.id)) {
        runtime.attempts += tries - previous;
        runtime.lastRoamTries[roamer.id] = tries;
        await exclusive("神兽捕获失败后重置", () => resetChapter(runtime.targetPlan));
      } else {
        runtime.lastRoamTries[roamer.id] = tries;
      }
      return;
    }

    if (runtime.target?.startsWith("roam:")) {
      runtime.target = null;
      runtime.targetPlan = null;
      runtime.teamPlan = null;
      runtime.attempts = 0;
      log("神兽捕获或离开，重新规划普通缺失图鉴");
    }

    if (!runtime.targetPlan || isCaught(save, runtime.targetPlan.speciesId)) {
      const next = chooseMissingPlan(save);
      if (!next) {
        runtime.paused = true;
        notifyUser("自动捕获目标已完成", "当前范围只剩进化、孵蛋、交换、特殊事件或条件尚未满足的目标。 ");
        log("没有可自动刷取的缺失目标，已进入等待状态");
        return;
      }
      runtime.targetPlan = next;
      runtime.target = `dex:${next.speciesId}`;
      runtime.userTeamOverride = false;
      runtime.attempts = 0;
      const plan = recommendTeam(save, [next.speciesId]);
      await exclusive("规划缺失图鉴", async () => {
        await applyRecommendedTeam(plan, species(next.speciesId)?.n || String(next.speciesId));
        if (readSave().adv.chapter !== next.chapter) await switchChapter(next.chapter);
      });
      return;
    }

    if (save.adv.chapter !== runtime.targetPlan.chapter) {
      await exclusive("返回目标章节", () => switchChapter(runtime.targetPlan.chapter));
      return;
    }

    const timeline = timelinePlanStatus(runtime.targetPlan);
    if (timeline.lastWild < 0) {
      await exclusive("本轮没有有效野生节点", () => resetChapter(runtime.targetPlan));
      return;
    }
    if (timeline.current > timeline.lastWild || (timeline.current < 0 && save.adv.node > timeline.lastWild)) {
      runtime.attempts += timeline.wild.length;
      await exclusive("有效节点已刷完", () => resetChapter(runtime.targetPlan));
    }
  }

  async function manageBerries(save) {
    if (Date.now() - runtime.lastBerryCheckAt < 5_000) return;
    runtime.lastBerryCheckAt = Date.now();
    const enabled = Object.entries(settings.berries).filter(([, config]) => config.enabled);
    const byFamily = new Map();
    for (const [key, config] of enabled) {
      const info = BERRIES[key];
      if (!info) continue;
      const list = byFamily.get(info.family) || [];
      list.push({ key, config, info });
      byFamily.set(info.family, list);
    }

    for (const [family, options] of byFamily) {
      const active = save.buffs?.[family];
      if (active?.until > Date.now()) continue;
      options.sort((a, b) => Number(b.key === "golden-razz-berry") - Number(a.key === "golden-razz-berry"));
      const choice = options.find(({ key, config }) => Number(save.items?.[key] || 0) > Number(config.reserve || 0));
      if (!choice) continue;
      const button = document.querySelector(`#bag-panel .bag-cell[data-k="${choice.key}"]`);
      if (!button) {
        log(`已启用${choice.info.label}，但页面没有对应按钮`, "error");
        continue;
      }
      button.click();
      log(`自动使用：${choice.info.label}`);
      await jitter();
      break;
    }
  }

  function detectManualTeamChange(save) {
    if (Date.now() - runtime.lastTeamCheckAt < 1_500 || !runtime.teamPlan || runtime.busy) return;
    runtime.lastTeamCheckAt = Date.now();
    const signature = (save.teamSets?.list?.[4] || []).join("|");
    if (runtime.lastTeamSignature && signature && signature !== runtime.lastTeamSignature) {
      runtime.userTeamOverride = true;
      runtime.teamStatus = "用户阵容（本目标不再覆盖）";
      runtime.lastTeamSignature = signature;
      log("检测到用户修改第五队，本目标改用用户阵容");
    }
  }

  async function tick() {
    if (runtime.mode === "idle" || runtime.paused || runtime.busy) {
      renderStatus();
      return;
    }
    try {
      const save = readSave();
      observeBattle(save);
      detectManualTeamChange(save);
      await manageBerries(save);
      if (runtime.mode === "push") await pushTick(save);
      else if (runtime.mode === "collect") await collectTick(save);
      renderStatus();
    } catch (error) {
      diagnostic("主循环", error);
    }
  }

  function startMode(mode) {
    const compatibility = validateCompatibility();
    if (!compatibility.ok) {
      diagnostic("兼容性检查", new Error(
        compatibility.build !== compatibility.expected
          ? `游戏版本${compatibility.build}与助手数据${compatibility.expected}不同`
          : `缺少页面节点：${compatibility.missing.join(", ")}`,
      ));
      return;
    }
    runtime.mode = mode;
    runtime.pushRegion = mode === "push" ? currentRegion(readSave()) : null;
    runtime.paused = false;
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.teamPlan = null;
    runtime.userTeamOverride = false;
    runtime.error = null;
    runtime.attempts = 0;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ mode, running: true, at: Date.now() }));
    log(mode === "push" ? "推图模式已启动" : "全图鉴收集模式已启动");
    tick();
  }

  function pauseMode() {
    if (runtime.mode === "idle") return;
    runtime.paused = !runtime.paused;
    log(runtime.paused ? "任务已暂停" : "任务已继续");
    renderStatus();
  }

  function stopMode() {
    runtime.mode = "idle";
    runtime.paused = false;
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.teamPlan = null;
    runtime.userTeamOverride = false;
    runtime.expectedChapter = null;
    runtime.pushRegion = null;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ mode: "idle", running: false, at: Date.now() }));
    log("自动任务已停止");
    renderStatus();
  }

  async function copyTeam() {
    const source = Number(document.querySelector("#pca-copy-from")?.value);
    const destination = Number(document.querySelector("#pca-copy-to")?.value);
    if (source === destination) return alert("来源和目标不能相同");
    const save = readSave();
    const uids = save.teamSets?.list?.[source] || [];
    if (!uids.length) return alert(`队伍${source + 1}为空`);
    const target = save.teamSets?.list?.[destination] || [];
    const names = uids.map((uid) => {
      const mon = save.mons.find((item) => item.uid === uid);
      return species(mon?.id)?.n || "?";
    });
    if (target.length && !confirm(`队伍${destination + 1}非空，确定覆盖为：\n${names.join("、")}`)) return;
    await exclusive("复制队伍", () => configurePreset(destination, uids));
    log(`已将队伍${source + 1}复制到队伍${destination + 1}`);
  }

  function renderPanel() {
    const style = document.createElement("style");
    style.textContent = `
      #${PANEL_ID}{position:fixed;right:14px;bottom:14px;width:min(360px,calc(100vw - 28px));max-height:82vh;z-index:2147483646;color:#eef2ff;background:#151827;border:1px solid #46506c;border-radius:14px;box-shadow:0 14px 42px #0009;font:13px/1.45 system-ui,-apple-system,"PingFang SC",sans-serif;overflow:hidden}
      #${PANEL_ID} *{box-sizing:border-box}#${PANEL_ID} button,#${PANEL_ID} select,#${PANEL_ID} input{font:inherit}
      .pca-head{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#20253a;border-bottom:1px solid #343b56;cursor:move;touch-action:none;user-select:none}.pca-head b{flex:1}.pca-head button{cursor:pointer}.pca-ver{color:#8ea0ca;font-size:11px}
      .pca-body{overflow:auto;max-height:calc(82vh - 46px)}#${PANEL_ID}.collapsed .pca-body{display:none}#${PANEL_ID}.collapsed{width:min(245px,calc(100vw - 28px))}
      .pca-tabs{display:flex;overflow-x:auto;background:#181c2c;border-bottom:1px solid #343b56;padding:0 6px}.pca-tab{flex:0 0 auto;border:0;border-bottom:2px solid transparent;background:transparent;color:#94a3c8;padding:9px 8px;cursor:pointer}.pca-tab:hover{color:#dbe5ff}.pca-tab.active{color:#fff;border-bottom-color:#6f9cff;background:#20263a}
      .pca-tabpanel{display:none;padding:10px 12px}.pca-tabpanel.active{display:block}
      .pca-row{display:flex;gap:7px;align-items:center;margin:7px 0}.pca-row>*{min-width:0}.pca-grow{flex:1}
      .pca-btn{border:1px solid #536080;background:#2b3350;color:#fff;border-radius:8px;padding:6px 9px;cursor:pointer}.pca-btn:hover{background:#3a466c}.pca-btn.primary{background:#3668d8;border-color:#5d87e4}.pca-btn.danger{background:#7b2f3c;border-color:#a44756}.pca-btn:disabled{opacity:.5;cursor:not-allowed}
      .pca-card{background:#1d2235;border:1px solid #323a55;border-radius:10px;padding:8px 9px;margin:8px 0}.pca-card h4{margin:0 0 6px;font-size:13px;color:#a9b9e4}.pca-kv{display:grid;grid-template-columns:72px 1fr;gap:4px 8px}.pca-kv span:nth-child(odd){color:#8fa0c6}.pca-status.run{color:#7ee787}.pca-status.pause{color:#f2cc60}.pca-status.err{color:#ff7b72}
      .pca-berries{display:grid;grid-template-columns:1fr 54px;gap:4px 6px}.pca-berry{display:flex;gap:6px;align-items:center}.pca-berries input[type=number]{width:54px;background:#111524;color:#fff;border:1px solid #46506c;border-radius:6px;padding:3px}
      .pca-select{background:#111524;color:#fff;border:1px solid #46506c;border-radius:7px;padding:5px}.pca-log{max-height:120px;overflow:auto;white-space:pre-wrap;color:#aeb9d6;font-size:11px}.pca-log .error{color:#ff8a82}.pca-note{color:#8999bd;font-size:11px}.pca-team{white-space:normal;color:#d8e1ff}
    `;
    document.head.append(style);

    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.className = settings.collapsed ? "collapsed" : "";
    panel.innerHTML = `
      <div class="pca-head"><b>PokéCatch 助手</b><span class="pca-ver">v${VERSION}</span><button class="pca-btn" data-act="collapse">${settings.collapsed ? "展开" : "收起"}</button></div>
      <div class="pca-body">
        <div class="pca-tabs" role="tablist" aria-label="助手功能">
          ${[["push","推图"],["collect","全图鉴"],["team","阵容"],["berries","果子"],["diagnostics","诊断"]].map(([key,label]) => `<button class="pca-tab ${settings.activeTab === key ? "active" : ""}" type="button" role="tab" aria-selected="${settings.activeTab === key}" data-tab="${key}">${label}</button>`).join("")}
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "push" ? "active" : ""}" role="tabpanel" data-tabpanel="push">
          <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="push">开始推图</button><button class="pca-btn pca-grow" data-act="pause">暂停/继续</button><button class="pca-btn danger" data-act="stop">停止</button></div>
          <div class="pca-note">从当前地区的剧情前沿持续推进；推图期间不会追踪神兽。</div>
          ${statusCardHtml()}
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "collect" ? "active" : ""}" role="tabpanel" data-tabpanel="collect">
          <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="collect">开始全图鉴收集</button><button class="pca-btn pca-grow" data-act="pause">暂停/继续</button><button class="pca-btn danger" data-act="stop">停止</button></div>
          ${statusCardHtml()}
          <div class="pca-card"><h4>收集范围与优先级</h4>
            <div class="pca-row"><span>地区</span><select class="pca-select pca-grow" data-select-setting="regionScope"><option value="current" ${settings.regionScope === "current" ? "selected" : ""}>当前地区</option><option value="all" ${settings.regionScope === "all" ? "selected" : ""}>所有已解锁地区</option><option value="custom" ${settings.regionScope === "custom" ? "selected" : ""}>自定义地区</option></select></div>
            <div class="pca-row pca-note">${[["kanto","关都"],["johto","城都"],["hoenn","丰缘"],["sinnoh","神奥"],["unova","合众"]].map(([key,label])=>`<label><input type="checkbox" data-region="${key}" ${settings.customRegions.includes(key)?"checked":""}>${label}</label>`).join(" ")}</div>
            <div class="pca-row"><span>神兽</span><select class="pca-select pca-grow" data-select-setting="roamingOrder"><option value="243,244,245" ${settings.roamingPriority.join() === "243,244,245" ? "selected" : ""}>雷公 → 炎帝 → 水君</option><option value="245,243,244" ${settings.roamingPriority.join() === "245,243,244" ? "selected" : ""}>水君 → 雷公 → 炎帝</option><option value="244,245,243" ${settings.roamingPriority.join() === "244,245,243" ? "selected" : ""}>炎帝 → 水君 → 雷公</option></select></div>
            <div class="pca-row"><input class="pca-select pca-grow" id="pca-manual-targets" value="${settings.manualTargets.join(",")}" placeholder="手动优先图鉴编号，如 214,155"><button class="pca-btn" data-act="targets">应用</button></div>
            <div class="pca-note">手动列表只接受尚未捕获且可在野外获得的目标；按填写顺序优先。</div>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "team" ? "active" : ""}" role="tabpanel" data-tabpanel="team">
          <div class="pca-card"><h4>阵容与队伍复制</h4>
          <label class="pca-row"><input type="checkbox" data-setting="lockTeam5" ${settings.lockTeam5 ? "checked" : ""}>锁定第五队，不自动覆盖</label>
          <div class="pca-row"><select class="pca-select pca-grow" id="pca-copy-from">${[0,1,2,3,4].map((i)=>`<option value="${i}">队伍${i+1}</option>`).join("")}</select><span>→</span><select class="pca-select pca-grow" id="pca-copy-to">${[0,1,2,3,4].map((i)=>`<option value="${i}" ${i===4?"selected":""}>队伍${i+1}</option>`).join("")}</select><button class="pca-btn" data-act="copy">复制</button></div>
          <button class="pca-btn" data-act="reteam">重新生成当前目标阵容</button>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "berries" ? "active" : ""}" role="tabpanel" data-tabpanel="berries">
          <div class="pca-card"><h4>战斗增益果子（全部默认关闭）</h4><div class="pca-berries">
          ${Object.entries(BERRIES).map(([key, info]) => `<label class="pca-berry"><input type="checkbox" data-berry="${key}" ${settings.berries[key]?.enabled ? "checked" : ""}>${info.label}</label><input type="number" min="0" title="最低保留数量" data-reserve="${key}" value="${settings.berries[key]?.reserve || 0}">`).join("")}
          </div><div class="pca-note">右侧数字为最低保留量；普通与金色捕获果同时开启时优先金色。</div></div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "diagnostics" ? "active" : ""}" role="tabpanel" data-tabpanel="diagnostics">
          <div class="pca-card"><h4>通知</h4><label class="pca-row"><input type="checkbox" data-setting="soundNotifications" ${settings.soundNotifications ? "checked" : ""}>页面提示音</label><label class="pca-row"><input type="checkbox" data-setting="desktopNotifications" ${settings.desktopNotifications ? "checked" : ""}>桌面通知</label></div>
          <div class="pca-card"><h4>诊断</h4><div id="pca-error" class="pca-note">无异常</div><div class="pca-row"><button class="pca-btn" data-act="copydiag">复制诊断</button></div></div>
          <div class="pca-card"><h4>日志</h4><div id="pca-log" class="pca-log"></div></div>
        </div>
      </div>`;
    document.body.append(panel);
    applyPanelPosition(panel);
    enablePanelDragging(panel);

    panel.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-tab]")?.dataset.tab;
      if (tab) {
        selectPanelTab(panel, tab);
        return;
      }
      const action = event.target.closest("[data-act]")?.dataset.act;
      if (!action) return;
      if (action === "collapse") {
        settings.collapsed = !settings.collapsed;
        saveSettings();
        panel.classList.toggle("collapsed", settings.collapsed);
        event.target.textContent = settings.collapsed ? "展开" : "收起";
        requestAnimationFrame(() => keepPanelInViewport(panel));
      } else if (action === "push") startMode("push");
      else if (action === "collect") startMode("collect");
      else if (action === "pause") pauseMode();
      else if (action === "stop") stopMode();
      else if (action === "copy") copyTeam();
      else if (action === "reteam") regenerateTeam();
      else if (action === "targets") applyManualTargets();
      else if (action === "copydiag") navigator.clipboard.writeText(JSON.stringify(runtime.error || { status: "无异常", build: gameBuild() }, null, 2));
    });

    panel.addEventListener("change", (event) => {
      const setting = event.target.dataset.setting;
      if (setting) {
        settings[setting] = event.target.checked;
        saveSettings();
      }
      const berry = event.target.dataset.berry;
      if (berry) {
        settings.berries[berry].enabled = event.target.checked;
        saveSettings();
      }
      const reserve = event.target.dataset.reserve;
      if (reserve) {
        settings.berries[reserve].reserve = Math.max(0, Number(event.target.value) || 0);
        saveSettings();
      }
      const selectSetting = event.target.dataset.selectSetting;
      if (selectSetting === "regionScope") {
        settings.regionScope = event.target.value;
        saveSettings();
      } else if (selectSetting === "roamingOrder") {
        settings.roamingPriority = event.target.value.split(",").map(Number);
        saveSettings();
      }
      const region = event.target.dataset.region;
      if (region) {
        settings.customRegions = event.target.checked
          ? [...new Set([...settings.customRegions, region])]
          : settings.customRegions.filter((item) => item !== region);
        saveSettings();
      }
    });
    window.addEventListener("resize", () => keepPanelInViewport(panel));
    renderStatus();
    renderLog();
  }

  function statusCardHtml() {
    return `<div class="pca-card"><h4>当前任务状态</h4><div class="pca-kv">
      <span>任务</span><b data-status="mode">空闲</b><span>目标</span><b data-status="target">—</b><span>位置</span><b data-status="place">—</b><span>尝试</span><b data-status="attempts">0</b><span>增益</span><b data-status="buffs">—</b><span>第五队</span><b data-status="team" class="pca-team">未生成</b>
    </div></div>`;
  }

  function selectPanelTab(panel, tab) {
    const allowed = new Set(["push", "collect", "team", "berries", "diagnostics"]);
    if (!allowed.has(tab)) return;
    settings.activeTab = tab;
    saveSettings();
    panel.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    panel.querySelectorAll("[data-tabpanel]").forEach((tabpanel) => tabpanel.classList.toggle("active", tabpanel.dataset.tabpanel === tab));
  }

  function applyPanelPosition(panel) {
    if (!settings.panelPosition) return;
    panel.style.left = `${settings.panelPosition.left}px`;
    panel.style.top = `${settings.panelPosition.top}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    keepPanelInViewport(panel);
  }

  function keepPanelInViewport(panel) {
    if (!panel.style.left && !panel.style.top) return;
    const rect = panel.getBoundingClientRect();
    const left = Math.max(0, Math.min(rect.left, window.innerWidth - rect.width));
    const top = Math.max(0, Math.min(rect.top, window.innerHeight - Math.min(rect.height, window.innerHeight)));
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    settings.panelPosition = { left: Math.round(left), top: Math.round(top) };
    saveSettings();
  }

  function enablePanelDragging(panel) {
    const handle = panel.querySelector(".pca-head");
    let drag = null;
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("button")) return;
      const rect = panel.getBoundingClientRect();
      drag = { pointerId: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
      panel.style.left = `${rect.left}px`;
      panel.style.top = `${rect.top}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const left = Math.max(0, Math.min(event.clientX - drag.dx, window.innerWidth - panel.offsetWidth));
      const top = Math.max(0, Math.min(event.clientY - drag.dy, window.innerHeight - Math.min(panel.offsetHeight, window.innerHeight)));
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
    });
    const finish = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag = null;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      keepPanelInViewport(panel);
    };
    handle.addEventListener("pointerup", finish);
    handle.addEventListener("pointercancel", finish);
  }

  async function regenerateTeam() {
    if (!runtime.targetPlan) return alert("当前没有目标");
    runtime.userTeamOverride = false;
    const save = readSave();
    const enemyIds = runtime.target?.startsWith("push:")
      ? targetEnemyIdsForChapter(save.adv.chapter)
      : [runtime.targetPlan.speciesId].filter(Boolean);
    const plan = recommendTeam(save, enemyIds);
    await exclusive("手动重新生成阵容", () => applyRecommendedTeam(plan, "用户要求重新生成"));
  }

  function applyManualTargets() {
    const input = document.querySelector("#pca-manual-targets");
    const tokens = String(input?.value || "").split(/[，,\s]+/).filter(Boolean);
    const byName = new Map(Object.entries(DATA.species).map(([id, meta]) => [meta.n, Number(id)]));
    const ids = tokens.map((token) => /^\d+$/.test(token) ? Number(token) : byName.get(token)).filter((id) => species(id));
    settings.manualTargets = [...new Set(ids)];
    if (input) input.value = settings.manualTargets.join(",");
    saveSettings();
    runtime.target = null;
    runtime.targetPlan = null;
    log(settings.manualTargets.length ? `手动优先目标：${settings.manualTargets.map((id) => species(id).n).join("、")}` : "已恢复自动缺失图鉴排序");
  }

  function renderStatus() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    const modeLabel = runtime.mode === "push" ? "推图" : runtime.mode === "collect" ? "全图鉴收集" : "空闲";
    const modeText = `${modeLabel}${runtime.paused ? "（暂停）" : runtime.busy ? "（操作中）" : ""}`;
    panel.querySelectorAll('[data-status="mode"]').forEach((node) => {
      node.textContent = modeText;
      node.className = runtime.error ? "pca-status err" : runtime.paused ? "pca-status pause" : runtime.mode !== "idle" ? "pca-status run" : "";
    });
    const targetName = runtime.targetPlan?.speciesId ? species(runtime.targetPlan.speciesId)?.n : runtime.targetPlan?.chapterName;
    panel.querySelectorAll('[data-status="target"]').forEach((node) => { node.textContent = targetName || "—"; });
    panel.querySelectorAll('[data-status="place"]').forEach((node) => { node.textContent = `${chapter(save?.adv?.chapter)?.name || "—"}${runtime.targetPlan?.zone ? ` / ${runtime.targetPlan.zone}` : ""}`; });
    let attemptText = String(runtime.attempts);
    if (runtime.targetPlan?.roaming && runtime.attempts > 0) {
      const captureKey = save?.buffs?.capture?.key;
      const multiplier = captureKey === "golden-razz-berry" ? 1.5 : captureKey === "razz-berry" ? 1.25 : 1;
      const probability = 1 - (1 - 0.04 * multiplier) ** runtime.attempts;
      attemptText += ` · 累计${(probability * 100).toFixed(1)}%`;
    }
    panel.querySelectorAll('[data-status="attempts"]').forEach((node) => { node.textContent = attemptText; });
    const activeBuffs = Object.values(save?.buffs || {}).filter((buff) => buff?.until > Date.now()).map((buff) => {
      const left = Math.max(0, buff.until - Date.now());
      return `${BERRIES[buff.key]?.label || buff.key} ${Math.ceil(left / 60_000)}分`;
    });
    panel.querySelectorAll('[data-status="buffs"]').forEach((node) => { node.textContent = activeBuffs.join("、") || "—"; });
    panel.querySelectorAll('[data-status="team"]').forEach((node) => { node.textContent = runtime.teamStatus; });
    panel.querySelector("#pca-error").textContent = runtime.error ? `${runtime.error.phase}：${runtime.error.observed}\n建议：${runtime.error.suggestion}` : `无异常 · 游戏 ${gameBuild()} · 数据 ${DATA.appBuild}`;
  }

  function renderLog() {
    const root = document.querySelector("#pca-log");
    if (!root) return;
    root.innerHTML = runtime.logs.slice(0, 25).map((item) => `<div class="${item.level === "error" ? "error" : ""}">${new Date(item.at).toLocaleTimeString()} ${escapeHtml(item.message)}</div>`).join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function offerResume() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!session?.running || !["push", "collect"].includes(session.mode)) return;
      log(`检测到上次未结束的${session.mode === "push" ? "推图" : "收集"}任务，请手动点击开始以恢复`);
      notifyUser("发现未结束任务", "为安全起见没有自动恢复，请在面板中确认启动。 ");
    } catch { /* ignore */ }
  }

  function init() {
    renderPanel();
    offerResume();
    runtime.timer = setInterval(tick, 900);
    document.addEventListener("click", (event) => {
      if (runtime.mode === "idle" || runtime.busy || !event.isTrusted) return;
      const manualGo = event.target.closest?.(".mp-go[data-go]");
      if (!manualGo) return;
      runtime.paused = true;
      log("检测到用户手动切换章节，自动任务已暂停");
      renderStatus();
    }, true);
    window.__pokeCatchAssistant = {
      version: VERSION,
      startPush: () => startMode("push"),
      startCollect: () => startMode("collect"),
      pause: pauseMode,
      stop: stopMode,
      state: runtime,
      dataBuild: DATA.appBuild,
      previewTeam: (chapterIndex = readSave().adv.chapter) => recommendTeam(readSave(), targetEnemyIdsForChapter(chapterIndex)).details,
      previewMissing: () => chooseMissingPlan(readSave()),
    };
    log(`助手已加载，游戏数据版本 ${DATA.appBuild}`);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
