// ==UserScript==
// @name         PokeCatch Assistant / 全图鉴与推图助手
// @namespace    local.pokecatch.assistant
// @version      0.3.0
// @description  Bilingual story, Pokédex, roaming, team and berry automation / 中英双语推图、图鉴、神兽、队伍和果子自动化。
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
  const VERSION = "0.3.0";
  const ROAMING_LEGENDARIES = [243, 244, 245];
  const DEFAULT_LEVEL_WEIGHT = 0.22;
  const COLLECTION_LEVEL_WEIGHT = 1.2;
  const ROAMING_PREFERRED_LEVEL = 90;

  const BERRIES = {
    "razz-berry": { family: "capture", zh: "蔓莓果（捕获率 ×1.25）", en: "Razz Berry (catch rate ×1.25)" },
    "golden-razz-berry": { family: "capture", zh: "金色蔓莓果（捕获率 ×1.5）", en: "Golden Razz Berry (catch rate ×1.5)" },
    "nanab-berry": { family: "rare", zh: "蕉香果（区域稀有种类 ×2）", en: "Nanab Berry (regional rare species ×2)" },
    "enigma-berry": { family: "dex", zh: "谜芝果（本地区未捕获种类 ×3）", en: "Enigma Berry (uncaught regional species ×3)" },
    "pinap-berry": { family: "xp", zh: "凰梨果（战斗经验 +25%）", en: "Pinap Berry (battle XP +25%)" },
    "lansat-berry": { family: "money", zh: "兰萨果（金币 +25%）", en: "Lansat Berry (money +25%)" },
    "starf-berry": { family: "shiny", zh: "星桃果（野生异色 ×2）", en: "Starf Berry (wild shiny rate ×2)" },
  };

  const TEXT = {
    zh: {
      assistant: "PokéCatch 助手", auto: "跟随游戏", expand: "展开", collapse: "收起",
      pushTab: "推图", collectTab: "收集", teamTab: "阵容", berriesTab: "果子", diagnosticsTab: "诊断",
      startPush: "开始推图", pauseResume: "暂停/继续", stop: "停止",
      pushNote: "从当前地区的剧情前沿持续推进；推图期间不会追踪神兽。",
      selectCollection: "选择收集任务", dexCollection: "普通图鉴收集", roamOnly: "仅追踪神兽", combined: "普通 + 神兽协同",
      collectionNote: "三个入口互相独立：普通收集不会追踪神兽；仅追踪神兽不会刷普通目标；需要时才选择协同。",
      ordinaryTargets: "普通野外目标", region: "地区", currentRegion: "当前地区", allRegions: "所有已解锁地区", customRegions: "自定义地区",
      manualPlaceholder: "手动优先图鉴编号，如 214,155", apply: "应用",
      targetNote: "只会加入尚未捕获、且在所选范围内有野外地点的目标；按填写顺序优先。",
      roamers: "徘徊神兽", roamerNote: "当前固定追踪雷公、炎帝、水君。出现位置从游戏存档实时读取，不受上方地区筛选限制；出现时会暂停普通目标。",
      teamCopy: "阵容与队伍复制", lockTeam: "锁定第五队，不自动覆盖", team: "队伍", copy: "复制", regenerate: "重新生成当前目标阵容",
      berryTitle: "战斗增益果子（全部默认关闭）", reserve: "最低保留数量", berryNote: "右侧数字为最低保留量；普通与金色捕获果同时开启时优先金色。",
      notifications: "通知", sound: "页面提示音", desktop: "桌面通知", diagnostic: "诊断", noError: "无异常", copyDiagnostic: "复制诊断", logs: "日志",
      statusTitle: "当前任务状态", task: "任务", target: "目标", place: "位置", attempts: "尝试", buffs: "增益", fifthTeam: "第五队", idle: "空闲", notGenerated: "未生成",
      notAppeared: "未出现", caught: "已捕获", appearing: "出现中", minutes: "分", moveUp: "上移", moveDown: "下移",
      targetPrompt: "输入编号或名称后，这里会显示对应的宝可梦。", unknownPokemon: "无对应宝可梦", available: "可加入",
      managedRoamer: "徘徊神兽，由下方优先级管理", caughtSkip: "已捕获，不会加入", noWildPlace: "当前范围没有可用野外地点", legendaryWild: "神兽/幻兽 · 可作为野外目标",
      kanto: "关都", johto: "城都", hoenn: "丰缘", sinnoh: "神奥", unova: "合众",
      waitingRoamers: "等待雷公、炎帝或水君出现", paused: "暂停", working: "操作中", cumulative: "累计", suggestion: "建议", game: "游戏", data: "数据",
    },
    en: {
      assistant: "PokéCatch Assistant", auto: "Follow game", expand: "Expand", collapse: "Collapse",
      pushTab: "Story", collectTab: "Collect", teamTab: "Team", berriesTab: "Berries", diagnosticsTab: "Diagnostics",
      startPush: "Start story", pauseResume: "Pause / Resume", stop: "Stop",
      pushNote: "Continue from the current region's story frontier; roaming legendaries are not tracked in Story mode.",
      selectCollection: "Choose a collection task", dexCollection: "Pokédex collection", roamOnly: "Roamers only", combined: "Pokédex + roamers",
      collectionNote: "These modes are independent: Pokédex collection ignores roamers, Roamers only ignores ordinary targets, and Combined coordinates both.",
      ordinaryTargets: "Ordinary wild targets", region: "Region", currentRegion: "Current region", allRegions: "All unlocked regions", customRegions: "Custom regions",
      manualPlaceholder: "Priority Pokédex numbers, e.g. 214,155", apply: "Apply",
      targetNote: "Only uncaught targets with a wild location in the selected scope are added, in the order entered.",
      roamers: "Roaming legendaries", roamerNote: "Tracks Raikou, Entei and Suicune. Live locations come from the game save, ignore the region filter above, and pause ordinary targets while active.",
      teamCopy: "Team recommendation and copy", lockTeam: "Lock Team 5; never overwrite it", team: "Team", copy: "Copy", regenerate: "Regenerate team for current target",
      berryTitle: "Battle berries (all off by default)", reserve: "Minimum reserve", berryNote: "The number on the right is the reserve. Golden Razz is preferred when both catch berries are enabled.",
      notifications: "Notifications", sound: "Page sound", desktop: "Desktop notifications", diagnostic: "Diagnostics", noError: "No errors", copyDiagnostic: "Copy diagnostics", logs: "Logs",
      statusTitle: "Current task", task: "Mode", target: "Target", place: "Location", attempts: "Attempts", buffs: "Buffs", fifthTeam: "Team 5", idle: "Idle", notGenerated: "Not generated",
      notAppeared: "Not active", caught: "Caught", appearing: "Active", minutes: "min", moveUp: "Move up", moveDown: "Move down",
      targetPrompt: "Enter a Pokédex number or name to preview the target.", unknownPokemon: "No matching Pokémon", available: "Available",
      managedRoamer: "Roaming legendary; managed by the priority list below", caughtSkip: "Already caught; will not be added", noWildPlace: "No available wild location in the current scope", legendaryWild: "Legendary/Mythical · available as a wild target",
      kanto: "Kanto", johto: "Johto", hoenn: "Hoenn", sinnoh: "Sinnoh", unova: "Unova",
      waitingRoamers: "Waiting for Raikou, Entei or Suicune", paused: "Paused", working: "Working", cumulative: "Cumulative", suggestion: "Suggestion", game: "Game", data: "Data",
    },
  };

  const DEFAULT_SETTINGS = {
    collapsed: false,
    language: "auto",
    activeTab: "push",
    panelPosition: null,
    lockTeam5: false,
    desktopNotifications: false,
    soundNotifications: true,
    regionScope: "current",
    customRegions: ["kanto", "johto"],
    manualTargets: [],
    roamingPriority: [...ROAMING_LEGENDARIES],
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
    chapterReset: null,
    lastAutomatedActionAt: 0,
    panelResizeBound: false,
  };

  let settings = loadSettings();

  function language() {
    if (settings.language === "zh" || settings.language === "en") return settings.language;
    return String(localStorage.getItem("pokecatch.lang") || document.documentElement.lang || "zh-Hans").startsWith("zh") ? "zh" : "en";
  }

  function t(key) {
    return TEXT[language()]?.[key] || TEXT.zh[key] || key;
  }

  function berryLabel(info) {
    return info?.[language()] || info?.zh || "";
  }

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

  async function pacedAction(action, {
    beforeMin = 700,
    beforeMax = 1_700,
    afterMin = 450,
    afterMax = 1_100,
  } = {}) {
    const targetGap = Math.round(beforeMin + Math.random() * (beforeMax - beforeMin));
    const elapsed = Date.now() - runtime.lastAutomatedActionAt;
    await sleep(runtime.lastAutomatedActionAt ? Math.max(0, targetGap - elapsed) : targetGap);
    await action();
    runtime.lastAutomatedActionAt = Date.now();
    await jitter(afterMin, afterMax);
  }

  async function pacedClick(element, label, pacing) {
    if (!element) throw new Error(`找不到${label}`);
    await pacedAction(() => element.click(), pacing);
  }

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

  function activeBuffAt(save, family, now = Number(save?.lastTick) || Date.now()) {
    const buff = save?.buffs?.[family];
    return buff?.until > now ? buff : null;
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

  function roamingLevelPriorityScore(level, preferredLevel = null) {
    if (!preferredLevel) return 0;
    const normalized = Number(level) || 0;
    return normalized >= preferredLevel
      ? 1_000 + (normalized - preferredLevel) * 4
      : -(preferredLevel - normalized) * 20;
  }

  function scoreCandidate(mon, enemies, continuitySet, selected, levelWeight = DEFAULT_LEVEL_WEIGHT, preferredLevel = null) {
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
    const levelContribution = Math.min(100, mon.level) * levelWeight;
    const preferredLevelScore = roamingLevelPriorityScore(mon.level, preferredLevel);
    const score = bst * 0.21 + offense * 0.82 + defense * 34 + stats[5] * 0.08
      + levelContribution + preferredLevelScore + continuity - samePrimary * 16;
    return {
      score,
      reason: `能力${bst} · 克制${offense.toFixed(0)} · 防守${defense.toFixed(2)} · Lv.${mon.level}`,
    };
  }

  function recommendTeam(save, enemyIds, {
    excludedSignatures = new Set(),
    levelWeight = DEFAULT_LEVEL_WEIGHT,
    preferredLevel = null,
  } = {}) {
    const enemies = enemyProfiles(enemyIds);
    const currentFive = new Set(save.teamSets?.list?.[4] || []);
    const candidates = save.mons.filter((mon) => mon?.uid && mon.level > 0);
    const selected = [];
    const details = [];
    while (selected.length < 6 && selected.length < candidates.length) {
      const ranked = candidates
        .filter((mon) => !selected.some((item) => item.uid === mon.uid))
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected, levelWeight, preferredLevel) }))
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
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected, levelWeight, preferredLevel) }))
        .sort((a, b) => b.score - a.score)[0];
      if (replacement) selected.push(replacement.mon);
    }
    return { mons: selected, details, enemyIds, signature: selected.map((mon) => mon.uid).sort().join("|") };
  }

  function recommendRoamingTeam(save, enemyId) {
    const plan = recommendTeam(save, [enemyId], {
      levelWeight: COLLECTION_LEVEL_WEIGHT,
      preferredLevel: ROAMING_PREFERRED_LEVEL,
    });
    return plan;
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
      await pacedClick(button, `${name}页面按钮`);
      await waitFor(() => button.classList.contains("active"), { label: `${name}页面` });
    }
  }

  async function switchChapter(chapterIndex, { settle = true } = {}) {
    runtime.expectedChapter = chapterIndex;
    await openScreen("adventure");
    let visibleRow = document.querySelector(`.mp-row[data-ch="${chapterIndex}"]`);
    if (!visibleRow) await pacedClick(document.querySelector("#side-chapter"), "章节列表按钮");
    const row = await waitFor(
      () => document.querySelector(`.mp-row[data-ch="${chapterIndex}"]`),
      { label: `章节${chapterIndex}列表项` },
    );
    await pacedClick(row, `章节${chapterIndex}列表项`);
    const go = await waitFor(
      () => document.querySelector(`.mp-go[data-go="${chapterIndex}"]`),
      { label: `章节${chapterIndex}进入按钮` },
    );
    await pacedClick(go, `章节${chapterIndex}进入按钮`);
    await waitFor(() => readSave().adv.chapter === chapterIndex, { timeout: 10_000, label: `进入章节${chapterIndex}` });
    if (settle) await jitter(500, 900);
    runtime.expectedChapter = null;
    log(`已进入：${chapter(chapterIndex)?.name || `章节${chapterIndex}`}`);
  }

  async function continueChapterReset() {
    const reset = runtime.chapterReset;
    if (!reset) return true;

    const current = readSave().adv.chapter;
    if (reset.phase === "transit") {
      if (current !== reset.transitChapter) {
        await switchChapter(reset.transitChapter);
      }
      reset.phase = "target";
      log(`中转已完成，立即返回：${chapter(reset.targetChapter)?.name || `章节${reset.targetChapter}`}`);
      return false;
    }

    if (readSave().adv.chapter !== reset.targetChapter) {
      await switchChapter(reset.targetChapter);
    }
    if (readSave().adv.chapter !== reset.targetChapter) return false;

    runtime.chapterReset = null;
    log(`章节重置完成：${chapter(reset.targetChapter)?.name || `章节${reset.targetChapter}`}`);
    return true;
  }

  async function resetChapter(plan) {
    const save = readSave();
    if (plan.roaming) {
      const region = currentRegion(save);
      const transit = DATA.chapters
        .filter((item) => item.region === region && item.index <= save.adv.unlocked && item.index !== plan.chapter)
        .sort((a, b) => Math.abs(a.index - plan.chapter) - Math.abs(b.index - plan.chapter))[0];
      if (!transit) throw new Error("找不到神兽章节的中转章节");
      runtime.chapterReset = {
        phase: "transit",
        transitChapter: transit.index,
        targetChapter: plan.chapter,
      };
      await continueChapterReset();
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
    runtime.chapterReset = {
      phase: "transit",
      transitChapter: transit.index,
      targetChapter: plan.chapter,
    };
    await continueChapterReset();
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

  let syntheticPointerId = 10_000;

  async function dragPokemon(source, destination, label) {
    if (!source || !destination) throw new Error(`找不到${label}的拖放位置`);
    const targetGap = Math.round(700 + Math.random() * 1_000);
    const elapsed = Date.now() - runtime.lastAutomatedActionAt;
    await sleep(runtime.lastAutomatedActionAt ? Math.max(0, targetGap - elapsed) : targetGap);
    const from = source.getBoundingClientRect();
    const to = destination.getBoundingClientRect();
    const pointerId = syntheticPointerId += 1;
    const event = (type, x, y, buttons) => new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId,
      pointerType: "mouse",
      button: 0,
      buttons,
      clientX: x,
      clientY: y,
    });
    const fromX = from.left + from.width / 2;
    const fromY = from.top + from.height / 2;
    const toX = to.left + to.width / 2;
    const toY = to.top + Math.min(to.height / 2, 24);
    source.dispatchEvent(event("pointerdown", fromX, fromY, 1));
    await jitter(35, 85);
    document.dispatchEvent(event("pointermove", fromX + Math.sign(toX - fromX || 1) * 8, fromY + Math.sign(toY - fromY || 1) * 8, 1));
    await jitter(35, 85);
    document.dispatchEvent(event("pointermove", toX, toY, 1));
    await jitter(35, 85);
    document.dispatchEvent(event("pointerup", toX, toY, 0));
    runtime.lastAutomatedActionAt = Date.now();
    await jitter(450, 1_100);
  }

  async function configurePreset(presetIndex, desiredUids) {
    if (desiredUids.length < 1) throw new Error("推荐阵容为空");
    await openScreen("team");
    const preset = await waitFor(() => document.querySelector(`#team-sets [data-set="${presetIndex}"]`), { label: `队伍${presetIndex + 1}` });
    await pacedClick(preset, `队伍${presetIndex + 1}预设`);
    await waitFor(() => readSave().teamSets?.on === presetIndex, { label: `切换到队伍${presetIndex + 1}` });

    const quickPacing = { beforeMin: 140, beforeMax: 360, afterMin: 100, afterMax: 260 };
    const evoFilter = document.querySelector("#pc-evo.on");
    if (evoFilter) await pacedClick(evoFilter, "进化筛选", quickPacing);
    const shinyFilter = document.querySelector("#pc-shiny.on");
    if (shinyFilter) await pacedClick(shinyFilter, "异色筛选", quickPacing);
    for (const filter of [...document.querySelectorAll("#pc-active button")]) {
      await pacedClick(filter, "电脑筛选按钮", quickPacing);
    }
    const search = document.querySelector("#pc-search");
    if (search) {
      search.value = "";
      await jitter(140, 360);
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await jitter(180, 420);
    }

    let current = [...readSave().team];
    for (const uid of current.filter((item) => !desiredUids.includes(item))) {
      const slot = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(uid)}"]`);
      const pcGrid = document.querySelector("#pc-grid");
      await dragPokemon(slot, pcGrid, "移除队伍成员");
      await waitFor(() => !readSave().team.includes(uid), { label: "移除队伍成员" });
    }

    for (const uid of desiredUids) {
      if (readSave().team.includes(uid)) continue;
      const mon = readSave().mons.find((item) => item.uid === uid);
      if (!mon) continue;
      if (search) {
        search.value = species(mon.id)?.n || "";
        await jitter(140, 360);
        search.dispatchEvent(new Event("input", { bubbles: true }));
        await jitter(180, 420);
      }
      const card = await waitFor(
        () => document.querySelector(`#pc-grid .pc-cell[data-uid="${CSS.escape(uid)}"]`),
        { label: `电脑中的${species(mon.id)?.n || mon.id}` },
      );
      const emptySlot = document.querySelector("#team-slots .slot.empty");
      await dragPokemon(card, emptySlot, `将${species(mon.id)?.n || mon.id}加入队伍`);
      await waitFor(() => readSave().team.includes(uid), { label: "加入队伍" });
    }

    current = [...readSave().team];
    for (const uid of current.filter((item) => !desiredUids.includes(item))) {
      if (readSave().team.length <= desiredUids.length) break;
      const slot = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(uid)}"]`);
      const pcGrid = document.querySelector("#pc-grid");
      await dragPokemon(slot, pcGrid, "清理多余成员");
      await waitFor(() => !readSave().team.includes(uid), { label: "清理多余成员" });
    }

    if (search) {
      search.value = "";
      await jitter(140, 360);
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await jitter(180, 420);
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

  function daytimePhaseAt(timestamp, forceDay = false) {
    if (forceDay) return "day";
    const hour = new Date(timestamp).getHours();
    if (hour >= 20 || hour < 8) return "night";
    if (hour >= 10) return "day";
    return "morning";
  }

  function currentDaytimePhase(save, chapterIndex = save.adv.chapter) {
    const forcedDay = Boolean(chapter(chapterIndex)?.day && !(save.adv.unlocked > chapterIndex));
    return daytimePhaseAt(Number(save.lastTick) || Date.now(), forcedDay);
  }

  function weatherHash(value) {
    let hash = 2_166_136_261;
    for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16_777_619);
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 2_246_822_507);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 3_266_489_909);
    hash ^= hash >>> 16;
    return (hash >>> 0) / 4_294_967_296;
  }

  function routeClimate(route, region) {
    const config = DATA.weather;
    const source = (typeof route.climate === "string" ? config.climates[route.climate] : route.climate)
      || config.climates[route.bg];
    if (!source) return null;
    const climate = { ...source };
    for (const key of config.regionOff?.[region] || []) delete climate[key];
    for (const weights of [config.regionWeights?.[region]?.all, config.regionWeights?.[region]?.[route.bg]]) {
      for (const [key, multiplier] of Object.entries(weights || {})) {
        if (climate[key]) climate[key] *= multiplier;
      }
    }
    return Object.keys(climate).length ? climate : null;
  }

  function chapterClimate(item) {
    const climate = {};
    for (const route of item.routes) {
      if (route.indoor) continue;
      for (const [key, weight] of Object.entries(routeClimate(route, item.region) || {})) {
        climate[key] = (climate[key] || 0) + weight;
      }
    }
    return Object.keys(climate).length ? climate : null;
  }

  function generatedWeatherForRoute(item, route, timestamp, phase) {
    const ownClimate = routeClimate(route, item.region);
    if (!ownClimate || route.indoor) return null;
    const slot = Math.floor(timestamp / DATA.weather.slotMs);
    const chapterKey = `ch${item.index}`;
    let run = 0;
    while (run < 64 && weatherHash(`${chapterKey}|${slot - run}`) < DATA.weather.chance) run += 1;
    if (run % 2 === 0) return null;

    const choices = Object.entries(chapterClimate(item) || ownClimate)
      .filter(([key]) => !(phase === "night" && DATA.weather.types[key]?.daylight));
    if (!choices.length) return null;
    const total = choices.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = weatherHash(`${slot}|${chapterKey}`) * total;
    let selected = choices[0][0];
    for (const [key, weight] of choices) {
      roll -= weight;
      if (roll <= 0) {
        selected = key;
        break;
      }
    }
    const supported = (key) => ownClimate[key] && !(phase === "night" && DATA.weather.types[key]?.daylight);
    if (supported(selected)) return selected;
    return (DATA.weather.translate[selected] || []).find(supported) || null;
  }

  function currentWeatherForRoute(save, item, route, timestamp, phase) {
    if (Object.hasOwn(route, "weather")) return route.weather;
    if (!routeClimate(route, item.region) || route.indoor) return null;
    const slot = Math.floor(timestamp / DATA.weather.slotMs);
    if (item.weather) return Array.isArray(item.weather) ? item.weather[slot % item.weather.length] : item.weather;
    const roamer = Object.entries(save.roam?.at || {}).find(([, value]) => (
      Number(value?.ch) === item.index && Number(value?.until) > timestamp
    ));
    if (roamer && DATA.roamingWeather[roamer[0]]) return DATA.roamingWeather[roamer[0]];
    return generatedWeatherForRoute(item, route, timestamp, phase);
  }

  function habitatWeights(habitat, phase, weather) {
    const weights = {};
    for (const table of [habitat?.base, habitat?.[phase], habitat?.[weather]]) {
      if (!table || typeof table !== "object") continue;
      for (const [id, weight] of Object.entries(table)) {
        if (Number(weight) > 0) weights[id] = Number(weight);
        else delete weights[id];
      }
    }
    return weights;
  }

  function routeWeights(route, phase, weather) {
    const habitat = habitatForRoute(route);
    const weights = habitatWeights(habitat, phase, weather);
    if (!habitat) {
      for (const id of route.species || []) weights[id] = Math.max(weights[id] || 0, 1);
      for (const area of route.areas || []) {
        for (const entry of DATA.encounters[area] || []) {
          const [id, , , weight, method] = entry;
          if (method === "gift") continue;
          weights[id] = Math.max(weights[id] || 0, Number(weight) || 1);
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

  function plansForSpecies(save, speciesId, timestamp = Number(save.lastTick) || Date.now()) {
    const plans = [];
    for (const item of availableChapters(save)) {
      for (const route of item.routes) {
        const phase = daytimePhaseAt(timestamp, Boolean(item.day && !(save.adv.unlocked > item.index)));
        const weather = currentWeatherForRoute(save, item, route, timestamp, phase);
        const weight = routeWeights(route, phase, weather)[speciesId] || 0;
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
          phase,
          weather,
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

  function nextConditionalPlan(save, hours = 48) {
    const now = Number(save.lastTick) || Date.now();
    const start = Math.floor(now / DATA.weather.slotMs) * DATA.weather.slotMs;
    const ids = settings.manualTargets.length
      ? settings.manualTargets.filter((id) => !isCaught(save, id))
      : Object.keys(DATA.species).map(Number).filter((id) => !isCaught(save, id));
    for (let offset = 1; offset <= hours; offset += 1) {
      const at = start + offset * DATA.weather.slotMs;
      const options = ids.flatMap((id) => plansForSpecies(save, id, at));
      if (options.length) {
        const plan = options.sort((a, b) => b.score - a.score || a.prefixCost - b.prefixCost)[0];
        return { ...plan, availableAt: at };
      }
    }
    return null;
  }

  function activeRoamersFromState(roamAt, priorityIds, now = Date.now()) {
    const priority = new Map(priorityIds.map((id, index) => [id, index]));
    return Object.entries(roamAt || {})
      .map(([id, state]) => ({
        id: Number(id),
        chapter: state?.ch ?? state?.chapter,
        until: state?.until ?? state?.at ?? 0,
      }))
      .filter((item) => priority.has(item.id))
      .filter((item) => Number.isInteger(item.chapter) && Number(item.until) > now)
      .sort((a, b) => priority.get(a.id) - priority.get(b.id));
  }

  function activeRoamers(save) {
    return activeRoamersFromState(save.roam?.at, roamingPriorityIds());
  }

  function roamingCaughtStatus(save, id) {
    const roamCaught = Array.isArray(save.roam?.caught) && save.roam.caught.includes(id);
    const dexCaught = isCaught(save, id);
    return { caught: roamCaught || dexCaught, roamCaught, dexCaught };
  }

  function roamingTargetTransition(realtime, tries, previousTries, confirmCaught) {
    if (!realtime) return { type: "disappeared", caught: Boolean(confirmCaught()) };
    if (confirmCaught()) return { type: "conflict" };
    if (tries > previousTries) return { type: "failed", attempts: tries - previousTries };
    return { type: "tracking" };
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
      const plan = recommendTeam(save, targetEnemyIdsForChapter(frontier), { excludedSignatures: failures });
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
        const plan = recommendTeam(save, targetEnemyIdsForChapter(frontier), { excludedSignatures: failed });
        notifyUser("阵容需要调整", `同一章节连续失败，重新配置${chapter(frontier)?.name || "当前章节"}阵容。`);
        await exclusive("失败后重新配队", () => applyRecommendedTeam(plan, "连续失败后调整"));
      }
    }
    runtime.lastDeaths[frontier] = deaths;
  }

  async function collectTick(save, { trackRoamers, collectMissing }) {
    const roamers = trackRoamers ? activeRoamers(save) : [];
    if (runtime.chapterReset) {
      const resettingRoamerId = runtime.targetPlan?.roaming ? runtime.targetPlan.speciesId : null;
      const resettingRoamer = resettingRoamerId ? roamers.find((item) => item.id === resettingRoamerId) : null;
      if (resettingRoamerId && !resettingRoamer) {
        runtime.chapterReset = null;
        log(`${species(resettingRoamerId)?.n || resettingRoamerId}已离开实时列表，取消未完成的章节重置`);
      } else {
        if (resettingRoamerId && roamingCaughtStatus(save, resettingRoamerId).caught) {
          diagnostic("神兽状态冲突", new Error(`${species(resettingRoamerId)?.n || resettingRoamerId}仍在实时列表，但 roam.caught 或图鉴已显示捕获`), {
            expected: "实时神兽条目与捕获状态一致",
            suggestion: "请刷新游戏确认神兽列表和图鉴；状态一致后再手动继续。",
          });
          return;
        }
        await exclusive("继续章节重置", continueChapterReset);
        return;
      }
    }

    const currentRoamerId = runtime.targetPlan?.roaming ? runtime.targetPlan.speciesId : null;
    const currentRoamer = currentRoamerId ? roamers.find((item) => item.id === currentRoamerId) : null;

    if (currentRoamerId) {
      const tries = Number(save.legTries?.[currentRoamerId] || 0);
      const previous = Number(runtime.lastRoamTries[currentRoamerId] ?? tries);
      const transition = roamingTargetTransition(
        currentRoamer,
        tries,
        previous,
        () => roamingCaughtStatus(save, currentRoamerId).caught,
      );

      if (transition.type === "conflict") {
        diagnostic("神兽状态冲突", new Error(`${species(currentRoamerId)?.n || currentRoamerId}仍在实时列表，但 roam.caught 或图鉴已显示捕获`), {
          expected: "实时神兽条目与捕获状态一致",
          suggestion: "请刷新游戏确认神兽列表和图鉴；状态一致后再手动继续。",
        });
        return;
      }

      if (transition.type === "failed") {
        runtime.attempts += transition.attempts;
        runtime.lastRoamTries[currentRoamerId] = tries;
        await exclusive("神兽捕获失败后重置", () => resetChapter(runtime.targetPlan));
        return;
      }

      if (transition.type === "tracking") {
        runtime.lastRoamTries[currentRoamerId] = tries;
        return;
      }

      const name = species(currentRoamerId)?.n || String(currentRoamerId);
      if (transition.caught) {
        notifyUser("神兽捕获成功", `${name}已从实时列表移除，并已确认捕获。`);
        log(`${name}已捕获，结束当前神兽目标并重新规划`);
      } else {
        notifyUser("神兽已离开", `${name}已从实时列表移除，未发现捕获记录。`);
        log(`${name}停留到期或已离开，结束当前神兽目标并重新规划`);
      }
      delete runtime.lastRoamTries[currentRoamerId];
      runtime.target = null;
      runtime.targetPlan = null;
      runtime.teamPlan = null;
      runtime.attempts = 0;
    }

    if (trackRoamers && roamers.length) {
      const roamer = roamers[0];
      const targetKey = `roam:${roamer.id}`;
      const tries = Number(save.legTries?.[roamer.id] || 0);
      const transition = roamingTargetTransition(
        roamer,
        tries,
        tries,
        () => roamingCaughtStatus(save, roamer.id).caught,
      );
      if (transition.type === "conflict") {
        diagnostic("神兽状态冲突", new Error(`${species(roamer.id)?.n || roamer.id}仍在实时列表，但 roam.caught 或图鉴已显示捕获`), {
          expected: "实时神兽条目与捕获状态一致",
          suggestion: "请刷新游戏确认神兽列表和图鉴；状态一致后再手动继续。",
        });
        return;
      }
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
      runtime.lastRoamTries[roamer.id] = tries;
      const plan = recommendRoamingTeam(save, roamer.id);
      await exclusive("配置神兽阵容", async () => {
        await applyRecommendedTeam(plan, species(roamer.id)?.n || String(roamer.id));
        if (readSave().adv.chapter !== roamer.chapter) await switchChapter(roamer.chapter);
      });
      return;
    }

    if (!collectMissing) {
      if (runtime.target !== "roam:waiting") {
        runtime.target = "roam:waiting";
        runtime.targetPlan = null;
        runtime.teamPlan = null;
        runtime.teamStatus = "等待徘徊神兽出现";
        runtime.attempts = 0;
        log("当前没有徘徊神兽，保持等待；不会执行普通图鉴收集");
      }
      return;
    }

    if (runtime.targetPlan && !runtime.targetPlan.roaming && !isCaught(save, runtime.targetPlan.speciesId)) {
      const stillAvailable = plansForSpecies(save, runtime.targetPlan.speciesId).some((plan) => (
        plan.chapter === runtime.targetPlan.chapter && plan.zone === runtime.targetPlan.zone
      ));
      if (!stillAvailable) {
        log(`${species(runtime.targetPlan.speciesId)?.n || runtime.targetPlan.speciesId}当前昼夜或天气条件已变化，重新规划目标`);
        runtime.target = null;
        runtime.targetPlan = null;
        runtime.teamPlan = null;
        runtime.chapterReset = null;
      }
    }

    if (!runtime.targetPlan || isCaught(save, runtime.targetPlan.speciesId)) {
      const next = chooseMissingPlan(save);
      if (!next) {
        const waiting = nextConditionalPlan(save);
        if (waiting) {
          const waitingKey = `dex:waiting:${waiting.speciesId}:${waiting.availableAt}`;
          if (runtime.target !== waitingKey) {
            const condition = [waiting.phase, waiting.weather].filter(Boolean).join(" / ");
            log(`等待${species(waiting.speciesId)?.n || waiting.speciesId}条件：${waiting.chapterName} · ${new Date(waiting.availableAt).toLocaleString()}${condition ? ` · ${condition}` : ""}`);
          }
          runtime.target = waitingKey;
          runtime.targetPlan = null;
          runtime.teamPlan = null;
          runtime.teamStatus = `等待条件：${waiting.chapterName} · ${new Date(waiting.availableAt).toLocaleString()}`;
          return;
        }
        runtime.paused = true;
        notifyUser("自动捕获目标已完成", "当前范围只剩进化、孵蛋、交换、特殊事件或条件尚未满足的目标。 ");
        log("没有可自动刷取的缺失目标，已进入等待状态");
        return;
      }
      runtime.targetPlan = next;
      runtime.target = `dex:${next.speciesId}`;
      runtime.userTeamOverride = false;
      runtime.attempts = 0;
      const plan = recommendTeam(save, [next.speciesId], { levelWeight: COLLECTION_LEVEL_WEIGHT });
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
    const gameNow = Number(save.lastTick) || Date.now();
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
      const active = activeBuffAt(save, family, gameNow);
      if (active) continue;
      options.sort((a, b) => Number(b.key === "golden-razz-berry") - Number(a.key === "golden-razz-berry"));
      const choice = options.find(({ key, config }) => Number(save.items?.[key] || 0) > Number(config.reserve || 0));
      if (!choice) continue;
      const button = document.querySelector(`#bag-panel .bag-cell[data-k="${choice.key}"]`);
      if (!button) {
        log(`${language() === "en" ? "Enabled" : "已启用"}${language() === "en" ? ` ${berryLabel(choice.info)}, but its page button is unavailable` : `${berryLabel(choice.info)}，但页面没有对应按钮`}`, "error");
        continue;
      }
      const countBefore = Number(save.items?.[choice.key] || 0);
      await pacedClick(button, berryLabel(choice.info));
      await waitFor(() => {
        const current = readSave();
        const buff = activeBuffAt(current, family);
        return Number(current.items?.[choice.key] || 0) < countBefore && buff?.key === choice.key;
      }, { timeout: 5_000, label: language() === "en" ? `${berryLabel(choice.info)} activation` : `${berryLabel(choice.info)}生效` });
      log(language() === "en" ? `Auto-used: ${berryLabel(choice.info)}` : `自动使用：${berryLabel(choice.info)}`);
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
    if (runtime.busy) {
      renderStatus();
      return;
    }
    try {
      const save = readSave();
      if (!runtime.paused && !runtime.error) await manageBerries(save);
      if (runtime.mode === "idle" || runtime.paused) {
        renderStatus();
        return;
      }
      observeBattle(save);
      detectManualTeamChange(save);
      if (runtime.mode === "push") await pushTick(save);
      else if (runtime.mode === "collect") await collectTick(save, { trackRoamers: false, collectMissing: true });
      else if (runtime.mode === "roaming") await collectTick(save, { trackRoamers: true, collectMissing: false });
      else if (runtime.mode === "combined") await collectTick(save, { trackRoamers: true, collectMissing: true });
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
    runtime.chapterReset = null;
    runtime.userTeamOverride = false;
    runtime.error = null;
    runtime.attempts = 0;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ mode, running: true, at: Date.now() }));
    const labels = {
      push: "推图模式",
      collect: "普通图鉴收集",
      roaming: "徘徊神兽追踪",
      combined: "普通图鉴与神兽协同收集",
    };
    log(`${labels[mode] || mode}已启动`);
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
    runtime.chapterReset = null;
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

  function roamingPriorityIds() {
    return [
      ...settings.roamingPriority.filter((id) => ROAMING_LEGENDARIES.includes(id)),
      ...ROAMING_LEGENDARIES.filter((id) => !settings.roamingPriority.includes(id)),
    ];
  }

  function roamingPriorityHtml() {
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    const now = Date.now();
    return roamingPriorityIds().map((id, index, ids) => {
      const meta = species(id);
      const state = save?.roam?.at?.[id] || {};
      const roamingChapter = state.ch ?? state.chapter;
      const until = state.until ?? state.at ?? 0;
      let status = t("notAppeared");
      if (save && isCaught(save, id)) status = t("caught");
      else if (Number.isInteger(roamingChapter) && until > now) {
        status = `${t("appearing")} · ${chapter(roamingChapter)?.name || `#${roamingChapter}`} · ${Math.ceil((until - now) / 60_000)} ${t("minutes")}`;
      }
      return `<div class="pca-priority-item"><b>${index + 1}. #${String(id).padStart(3, "0")} ${escapeHtml(meta?.n || id)}</b><span>${escapeHtml(status)}</span><button class="pca-btn" type="button" data-act="roam-up" data-roamer="${id}" ${index === 0 ? "disabled" : ""} aria-label="${t("moveUp")} ${escapeHtml(meta?.n || id)}">↑</button><button class="pca-btn" type="button" data-act="roam-down" data-roamer="${id}" ${index === ids.length - 1 ? "disabled" : ""} aria-label="${t("moveDown")} ${escapeHtml(meta?.n || id)}">↓</button></div>`;
    }).join("");
  }

  function renderRoamingPriority() {
    const root = document.querySelector("#pca-roaming-priority");
    if (root) root.innerHTML = roamingPriorityHtml();
  }

  function moveRoamingPriority(id, offset) {
    const ids = roamingPriorityIds();
    const from = ids.indexOf(id);
    const to = from + offset;
    if (from < 0 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    settings.roamingPriority = ids;
    saveSettings();
    renderRoamingPriority();
    log(`徘徊神兽优先级：${ids.map((item) => species(item)?.n || item).join(" → ")}`);
  }

  function resolveManualTarget(token) {
    if (/^\d+$/.test(token)) return Number(token);
    const entry = Object.entries(DATA.species).find(([, meta]) => meta.n === token);
    return entry ? Number(entry[0]) : null;
  }

  function manualTargetPreviewHtml(value) {
    const tokens = String(value || "").split(/[，,\s]+/).filter(Boolean);
    if (!tokens.length) return t("targetPrompt");
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    return tokens.map((token) => {
      const id = resolveManualTarget(token);
      const meta = species(id);
      if (!meta) return `<span class="pca-target invalid">${escapeHtml(token)}: ${t("unknownPokemon")}</span>`;
      const labels = [`#${String(id).padStart(3, "0")} ${meta.n}`];
      let state = t("available");
      let className = "valid";
      if (ROAMING_LEGENDARIES.includes(id)) {
        state = t("managedRoamer");
        className = "warn";
      } else if (save && isCaught(save, id)) {
        state = t("caughtSkip");
        className = "warn";
      } else if (save && !plansForSpecies(save, id).length) {
        state = t("noWildPlace");
        className = "warn";
      } else if (meta.g || meta.m) {
        state = t("legendaryWild");
      }
      return `<span class="pca-target ${className}">${escapeHtml(labels[0])}<small>${escapeHtml(state)}</small></span>`;
    }).join("");
  }

  function renderManualTargetPreview(value = document.querySelector("#pca-manual-targets")?.value) {
    const root = document.querySelector("#pca-manual-target-preview");
    if (root) root.innerHTML = manualTargetPreviewHtml(value);
  }

  function renderPanel() {
    document.getElementById(PANEL_ID)?.remove();
    document.getElementById(`${PANEL_ID}-style`)?.remove();
    const style = document.createElement("style");
    style.id = `${PANEL_ID}-style`;
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
      .pca-lang{max-width:92px;font-size:11px;padding:3px}
      .pca-priority-item{display:grid;grid-template-columns:1fr auto 30px 30px;gap:5px;align-items:center;margin:5px 0}.pca-priority-item span{color:#8999bd;font-size:11px;text-align:right}.pca-priority-item .pca-btn{padding:3px 0}
      .pca-targets{display:grid;gap:4px;margin-top:6px}.pca-target{display:flex;justify-content:space-between;gap:8px;border:1px solid #3b4667;border-radius:6px;padding:4px 6px;background:#171c2d}.pca-target small{color:#8fa0c6;text-align:right}.pca-target.valid{border-color:#35684c}.pca-target.warn{border-color:#766129}.pca-target.invalid{border-color:#7b3941;color:#ff9b94}
      .pca-task-grid{display:grid;grid-template-columns:1fr;gap:7px}.pca-task-btn{width:100%;min-height:36px}.pca-controls .pca-btn{flex:1}
    `;
    document.head.append(style);

    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.className = settings.collapsed ? "collapsed" : "";
    panel.innerHTML = `
      <div class="pca-head"><b>${t("assistant")}</b><select class="pca-select pca-lang" data-select-setting="language" aria-label="Language"><option value="auto" ${settings.language === "auto" ? "selected" : ""}>${t("auto")}</option><option value="zh" ${settings.language === "zh" ? "selected" : ""}>中文</option><option value="en" ${settings.language === "en" ? "selected" : ""}>English</option></select><span class="pca-ver">v${VERSION}</span><button class="pca-btn" data-act="collapse">${settings.collapsed ? t("expand") : t("collapse")}</button></div>
      <div class="pca-body">
        <div class="pca-tabs" role="tablist" aria-label="${t("assistant")}">
          ${[["push",t("pushTab")],["collect",t("collectTab")],["team",t("teamTab")],["berries",t("berriesTab")],["diagnostics",t("diagnosticsTab")]].map(([key,label]) => `<button class="pca-tab ${settings.activeTab === key ? "active" : ""}" type="button" role="tab" aria-selected="${settings.activeTab === key}" data-tab="${key}">${label}</button>`).join("")}
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "push" ? "active" : ""}" role="tabpanel" data-tabpanel="push">
          <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="push">${t("startPush")}</button><button class="pca-btn pca-grow" data-act="pause">${t("pauseResume")}</button><button class="pca-btn danger" data-act="stop">${t("stop")}</button></div>
          <div class="pca-note">${t("pushNote")}</div>
          ${statusCardHtml()}
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "collect" ? "active" : ""}" role="tabpanel" data-tabpanel="collect">
          <div class="pca-card"><h4>${t("selectCollection")}</h4>
            <div class="pca-task-grid"><button class="pca-btn primary pca-task-btn" data-act="collect">${t("dexCollection")}</button><button class="pca-btn primary pca-task-btn" data-act="roaming">${t("roamOnly")}</button><button class="pca-btn primary pca-task-btn" data-act="combined">${t("combined")}</button></div>
            <div class="pca-row pca-controls"><button class="pca-btn" data-act="pause">${t("pauseResume")}</button><button class="pca-btn danger" data-act="stop">${t("stop")}</button></div>
            <div class="pca-note">${t("collectionNote")}</div>
          </div>
          ${statusCardHtml()}
          <div class="pca-card"><h4>${t("ordinaryTargets")}</h4>
            <div class="pca-row"><span>${t("region")}</span><select class="pca-select pca-grow" data-select-setting="regionScope"><option value="current" ${settings.regionScope === "current" ? "selected" : ""}>${t("currentRegion")}</option><option value="all" ${settings.regionScope === "all" ? "selected" : ""}>${t("allRegions")}</option><option value="custom" ${settings.regionScope === "custom" ? "selected" : ""}>${t("customRegions")}</option></select></div>
            <div class="pca-row pca-note">${[["kanto",t("kanto")],["johto",t("johto")],["hoenn",t("hoenn")],["sinnoh",t("sinnoh")],["unova",t("unova")]].map(([key,label])=>`<label><input type="checkbox" data-region="${key}" ${settings.customRegions.includes(key)?"checked":""}>${label}</label>`).join(" ")}</div>
            <div class="pca-row"><input class="pca-select pca-grow" id="pca-manual-targets" value="${settings.manualTargets.join(",")}" placeholder="${t("manualPlaceholder")}"><button class="pca-btn" data-act="targets">${t("apply")}</button></div>
            <div id="pca-manual-target-preview" class="pca-targets pca-note">${manualTargetPreviewHtml(settings.manualTargets.join(","))}</div>
            <div class="pca-note">${t("targetNote")}</div>
          </div>
          <div class="pca-card"><h4>${t("roamers")}</h4>
            <div class="pca-note">${t("roamerNote")}</div>
            <div id="pca-roaming-priority">${roamingPriorityHtml()}</div>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "team" ? "active" : ""}" role="tabpanel" data-tabpanel="team">
          <div class="pca-card"><h4>${t("teamCopy")}</h4>
          <label class="pca-row"><input type="checkbox" data-setting="lockTeam5" ${settings.lockTeam5 ? "checked" : ""}>${t("lockTeam")}</label>
          <div class="pca-row"><select class="pca-select pca-grow" id="pca-copy-from">${[0,1,2,3,4].map((i)=>`<option value="${i}">${t("team")} ${i+1}</option>`).join("")}</select><span>→</span><select class="pca-select pca-grow" id="pca-copy-to">${[0,1,2,3,4].map((i)=>`<option value="${i}" ${i===4?"selected":""}>${t("team")} ${i+1}</option>`).join("")}</select><button class="pca-btn" data-act="copy">${t("copy")}</button></div>
          <button class="pca-btn" data-act="reteam">${t("regenerate")}</button>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "berries" ? "active" : ""}" role="tabpanel" data-tabpanel="berries">
          <div class="pca-card"><h4>${t("berryTitle")}</h4><div class="pca-berries">
          ${Object.entries(BERRIES).map(([key, info]) => `<label class="pca-berry"><input type="checkbox" data-berry="${key}" ${settings.berries[key]?.enabled ? "checked" : ""}>${berryLabel(info)}</label><input type="number" min="0" title="${t("reserve")}" data-reserve="${key}" value="${settings.berries[key]?.reserve || 0}">`).join("")}
          </div><div class="pca-note">${t("berryNote")}</div></div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "diagnostics" ? "active" : ""}" role="tabpanel" data-tabpanel="diagnostics">
          <div class="pca-card"><h4>${t("notifications")}</h4><label class="pca-row"><input type="checkbox" data-setting="soundNotifications" ${settings.soundNotifications ? "checked" : ""}>${t("sound")}</label><label class="pca-row"><input type="checkbox" data-setting="desktopNotifications" ${settings.desktopNotifications ? "checked" : ""}>${t("desktop")}</label></div>
          <div class="pca-card"><h4>${t("diagnostic")}</h4><div id="pca-error" class="pca-note">${t("noError")}</div><div class="pca-row"><button class="pca-btn" data-act="copydiag">${t("copyDiagnostic")}</button></div></div>
          <div class="pca-card"><h4>${t("logs")}</h4><div id="pca-log" class="pca-log"></div></div>
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
        event.target.textContent = settings.collapsed ? t("expand") : t("collapse");
        requestAnimationFrame(() => keepPanelInViewport(panel));
      } else if (action === "push") startMode("push");
      else if (action === "collect") startMode("collect");
      else if (action === "roaming") startMode("roaming");
      else if (action === "combined") startMode("combined");
      else if (action === "pause") pauseMode();
      else if (action === "stop") stopMode();
      else if (action === "copy") copyTeam();
      else if (action === "reteam") regenerateTeam();
      else if (action === "targets") applyManualTargets();
      else if (action === "roam-up") moveRoamingPriority(Number(event.target.closest("[data-roamer]")?.dataset.roamer), -1);
      else if (action === "roam-down") moveRoamingPriority(Number(event.target.closest("[data-roamer]")?.dataset.roamer), 1);
      else if (action === "copydiag") navigator.clipboard.writeText(JSON.stringify(runtime.error || { status: t("noError"), build: gameBuild() }, null, 2));
    });

    panel.addEventListener("input", (event) => {
      if (event.target.id === "pca-manual-targets") renderManualTargetPreview(event.target.value);
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
      if (selectSetting === "language") {
        settings.language = event.target.value;
        saveSettings();
        renderPanel();
        return;
      }
      if (selectSetting === "regionScope") {
        settings.regionScope = event.target.value;
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
    if (!runtime.panelResizeBound) {
      window.addEventListener("resize", () => {
        const currentPanel = document.getElementById(PANEL_ID);
        if (currentPanel) keepPanelInViewport(currentPanel);
      });
      runtime.panelResizeBound = true;
    }
    renderStatus();
    renderLog();
  }

  function statusCardHtml() {
    return `<div class="pca-card"><h4>${t("statusTitle")}</h4><div class="pca-kv">
      <span>${t("task")}</span><b data-status="mode">${t("idle")}</b><span>${t("target")}</span><b data-status="target">—</b><span>${t("place")}</span><b data-status="place">—</b><span>${t("attempts")}</span><b data-status="attempts">0</b><span>${t("buffs")}</span><b data-status="buffs">—</b><span>${t("fifthTeam")}</span><b data-status="team" class="pca-team">${t("notGenerated")}</b>
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
      if (event.button !== 0 || event.target.closest("button,select,input")) return;
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
    const levelWeight = runtime.target?.startsWith("push:") ? DEFAULT_LEVEL_WEIGHT : COLLECTION_LEVEL_WEIGHT;
    const plan = runtime.targetPlan.roaming
      ? recommendRoamingTeam(save, runtime.targetPlan.speciesId)
      : recommendTeam(save, enemyIds, { levelWeight });
    await exclusive("手动重新生成阵容", () => applyRecommendedTeam(plan, "用户要求重新生成"));
  }

  function applyManualTargets() {
    const input = document.querySelector("#pca-manual-targets");
    const tokens = String(input?.value || "").split(/[，,\s]+/).filter(Boolean);
    const save = readSave();
    const ids = tokens
      .map(resolveManualTarget)
      .filter((id) => species(id))
      .filter((id) => !ROAMING_LEGENDARIES.includes(id))
      .filter((id) => !isCaught(save, id))
      .filter((id) => plansForSpecies(save, id).length);
    settings.manualTargets = [...new Set(ids)];
    if (input) input.value = settings.manualTargets.join(",");
    saveSettings();
    runtime.target = null;
    runtime.targetPlan = null;
    renderManualTargetPreview();
    log(settings.manualTargets.length ? `手动优先目标：${settings.manualTargets.map((id) => species(id).n).join("、")}` : "已恢复自动缺失图鉴排序");
  }

  function renderStatus() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    const modeLabel = {
      push: t("pushTab"),
      collect: t("dexCollection"),
      roaming: t("roamOnly"),
      combined: t("combined"),
      idle: t("idle"),
    }[runtime.mode] || t("idle");
    const modeText = `${modeLabel}${runtime.paused ? ` (${t("paused")})` : runtime.busy ? ` (${t("working")})` : ""}`;
    panel.querySelectorAll('[data-status="mode"]').forEach((node) => {
      node.textContent = modeText;
      node.className = runtime.error ? "pca-status err" : runtime.paused ? "pca-status pause" : runtime.mode !== "idle" ? "pca-status run" : "";
    });
    const targetName = runtime.target === "roam:waiting"
      ? t("waitingRoamers")
      : runtime.targetPlan?.speciesId ? species(runtime.targetPlan.speciesId)?.n : runtime.targetPlan?.chapterName;
    panel.querySelectorAll('[data-status="target"]').forEach((node) => { node.textContent = targetName || "—"; });
    panel.querySelectorAll('[data-status="place"]').forEach((node) => { node.textContent = `${chapter(save?.adv?.chapter)?.name || "—"}${runtime.targetPlan?.zone ? ` / ${runtime.targetPlan.zone}` : ""}`; });
    let attemptText = String(runtime.attempts);
    if (runtime.targetPlan?.roaming && runtime.attempts > 0) {
      const captureKey = save?.buffs?.capture?.key;
      const multiplier = captureKey === "golden-razz-berry" ? 1.5 : captureKey === "razz-berry" ? 1.25 : 1;
      const probability = 1 - (1 - 0.04 * multiplier) ** runtime.attempts;
      attemptText += ` · ${t("cumulative")} ${(probability * 100).toFixed(1)}%`;
    }
    panel.querySelectorAll('[data-status="attempts"]').forEach((node) => { node.textContent = attemptText; });
    const activeBuffs = Object.values(save?.buffs || {}).filter((buff) => buff?.until > Date.now()).map((buff) => {
      const left = Math.max(0, buff.until - Date.now());
      return `${berryLabel(BERRIES[buff.key]) || buff.key} ${Math.ceil(left / 60_000)} ${t("minutes")}`;
    });
    panel.querySelectorAll('[data-status="buffs"]').forEach((node) => { node.textContent = activeBuffs.join(language() === "en" ? ", " : "、") || "—"; });
    panel.querySelectorAll('[data-status="team"]').forEach((node) => { node.textContent = runtime.teamStatus === "未生成" ? t("notGenerated") : runtime.teamStatus; });
    panel.querySelector("#pca-error").textContent = runtime.error ? `${runtime.error.phase}: ${runtime.error.observed}\n${t("suggestion")}: ${runtime.error.suggestion}` : `${t("noError")} · ${t("game")} ${gameBuild()} · ${t("data")} ${DATA.appBuild}`;
    renderRoamingPriority();
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
      if (!session?.running || !["push", "collect", "roaming", "combined"].includes(session.mode)) return;
      const labels = { push: "推图", collect: "普通图鉴收集", roaming: "神兽追踪", combined: "协同收集" };
      log(`检测到上次未结束的${labels[session.mode]}任务，请手动点击对应入口恢复`);
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
      startRoaming: () => startMode("roaming"),
      startCombined: () => startMode("combined"),
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
