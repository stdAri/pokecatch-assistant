// ==UserScript==
// @name         PokeCatch Assistant / 全图鉴与推图助手
// @namespace    local.pokecatch.assistant
// @version      0.9.6
// @description  Bilingual story, Pokédex, roaming, team and berry automation / 中英双语推图、图鉴、神兽、队伍和果子自动化。
// @updateURL    https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js
// @downloadURL  https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js
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
  const VERSION = "0.9.6";
  const ROAMING_LEGENDARIES = [243, 244, 245];
  const REGION_ORDER = ["kanto", "johto", "hoenn", "sinnoh", "unova"];
  const COLLECTION_QUEUE_LIMIT = 5;
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
    "rowap-berry": { family: "roam", zh: "雾莲果（徘徊宝可梦停留 30 分钟）", en: "Rowap Berry (roamers stay for 30 min)" },
  };

  const PENSION_BERRIES = {
    "berry-oran": { zh: "橙橙果", en: "Oran Berry", effectZh: "培育屋产蛋进度 +5 分钟", effectEn: "Day Care egg progress +5 min" },
    "berry-pecha": { zh: "桃桃果", en: "Pecha Berry", effectZh: "培育屋产蛋进度 +15 分钟", effectEn: "Day Care egg progress +15 min" },
    "berry-sitrus": { zh: "文柚果", en: "Sitrus Berry", effectZh: "培育屋产蛋进度 +30 分钟", effectEn: "Day Care egg progress +30 min" },
    "belue-berry": { zh: "靛莓果", en: "Belue Berry", effectZh: "百变怪下一颗蛋的异色率 ×2", effectEn: "Ditto's next egg Shiny rate ×2" },
  };

  const TEXT = {
    zh: {
      assistant: "PokéCatch 助手", auto: "跟随游戏", expand: "打开助手", collapse: "关闭", floatWindow: "浮动窗口", dockWindow: "回到顶部", progress: "进度",
      pushTab: "推图", collectTab: "收集", trainingTab: "培养", teamTab: "阵容", berriesTab: "果子", diagnosticsTab: "诊断",
      startPush: "开始推图", pauseResume: "暂停/继续", stop: "停止",
      pushNote: "从当前地区的剧情前沿持续推进；推图期间不会追踪神兽。",
      prioritizeDailyRaid: "每天优先完成团体战",
      prioritizeDailyRaidNote: "启动任一自动任务后，每天先完成可用的异色团体战；己方2人队使用游戏原生“优化”，两个盟友槽依次选择列表第一项，不会改动第五队。",
      dailyRaid: "每日团体战", raidTeamMissing: "请先在团体战页面配置2只宝可梦", raidAlliesMissing: "请先在团体战页面选择2名盟友",
      selectCollection: "选择收集任务", dexCollection: "普通图鉴收集", roamOnly: "仅追踪神兽", combined: "普通 + 神兽协同",
      collectionNote: "三个入口互相独立：普通收集不会追踪神兽；仅追踪神兽不会刷普通目标；需要时才选择协同。",
      ordinaryTargets: "普通野外目标", region: "地区", currentRegion: "当前地区", allRegions: "所有已解锁地区", customRegions: "自定义地区",
      autoPushCollection: "为全收集自动推图",
      autoPushCollectionNote: "当前没有可抓目标、但仍有目标被剧情锁定时，推进到下一次解锁后立即重新扫描；不会连续快速推图。",
      manualPlaceholder: "手动优先编号，如 214,201-H,493-A", apply: "应用",
      targetNote: "只会加入尚未捕获、且在所选范围内存在获取地点的目标；剧情未解锁时可由全收集推图逐步解锁，按填写顺序优先。",
      collectionQueue: "当前待抓队列", queueEmpty: "当前没有可立即捕获的自动目标", waitingCondition: "等待条件", moneyFarm: "刷钱等待天气",
      storyLocked: "剧情尚未解锁",
      roamers: "徘徊神兽", roamerNote: "当前固定追踪雷公、炎帝、水君。出现位置从游戏存档实时读取，不受上方地区筛选限制；出现时会暂停普通目标。",
      teamCopy: "阵容与队伍复制", lockTeam: "锁定第五队，不自动覆盖", team: "队伍", copy: "复制", regenerate: "重新生成当前目标阵容",
      trainingTitle: "培养候选池", trainingEnable: "启用候选池，自动配队优先使用已勾选的个体",
      trainingPower: "最低综合能力值", trainingPowerHelp: "综合能力值 = 当前形态六项种族值总和 × 异色加成 × 地下强化加成。它只用于筛选培养对象，不代表胜率；填 0 表示不设门槛。",
      trainingEligible: "只显示当前地区可出战成员", trainingSearch: "搜索名称或图鉴编号",
      trainingSelectVisible: "全选当前结果", trainingSelectTeam: "选入当前队伍", trainingClear: "清空选择", trainingRefresh: "刷新列表",
      trainingSave: "保存候选池", trainingReset: "撤销未保存", trainingNoSave: "进入游戏并创建存档后即可配置培养候选池。",
      trainingDisabled: "候选池未启用，自动配队仍使用全部当前可出战成员。",
      duplicateKeepTitle: "重复宝可梦保留", enableDuplicateKeeps: "全部开启", disableDuplicateKeeps: "全部关闭", cancelDuplicateKeeps: "取消批量操作",
      duplicateKeepRegions: "处理地区",
      duplicateKeepNote: "逐编号检查当前可访问、可重复获取的非传说宝可梦；已符合目标状态的编号会跳过。游戏实际按进化家族共享开关，异色与普通个体也共用设置。重复宝可梦会少一次约3级的家族经验。",
      duplicateKeepIdle: "尚未执行", duplicateKeepConfirmOn: "逐编号检查并为选中地区的宝可梦开启“保留重复”？", duplicateKeepConfirmOff: "逐编号检查并关闭选中地区宝可梦的“保留重复”？",
      berryTitle: "战斗增益果子（全部默认关闭）", reserve: "最低保留数量", berryNote: "右侧数字为最低保留量；普通与金色捕获果同时开启时优先金色。",
      stock: "库存", pensionBerryTitle: "培育屋专用果子", pensionBerryButton: "前往培育屋使用", pensionBerryNote: "这些果子只显示效果和库存，需要在培育屋满足条件时手动使用；助手不会自动消耗。",
      notifications: "通知", sound: "页面提示音", desktop: "桌面通知", diagnostic: "诊断", noError: "无异常", copyDiagnostic: "复制诊断", logs: "日志",
      statusTitle: "当前任务状态", task: "任务", target: "目标", place: "位置", attempts: "尝试", buffs: "增益", fifthTeam: "第五队", idle: "空闲", notGenerated: "未生成",
      notAppeared: "未出现", caught: "已捕获", appearing: "出现中", minutes: "分", moveUp: "上移", moveDown: "下移",
      targetPrompt: "输入编号或名称后，这里会显示对应的宝可梦。", unknownPokemon: "无对应宝可梦", available: "可加入",
      specialLocation: "特殊地点", specialRegionLocked: "地区尚未解锁", specialOutsideScope: "不在所选地区范围", specialConditionLocked: "特殊条件尚未满足",
      managedRoamer: "徘徊神兽，由下方优先级管理", caughtSkip: "已捕获，不会加入", noWildPlace: "当前范围没有可用野外地点", legendaryWild: "神兽/幻兽 · 可作为野外目标",
      kanto: "关都", johto: "城都", hoenn: "丰缘", sinnoh: "神奥", unova: "合众",
      waitingRoamers: "等待雷公、炎帝或水君出现", paused: "暂停", working: "操作中", cumulative: "累计", suggestion: "建议", game: "游戏", data: "数据",
    },
    en: {
      assistant: "PokéCatch Assistant", auto: "Follow game", expand: "Open assistant", collapse: "Close", floatWindow: "Float window", dockWindow: "Dock to top", progress: "Progress",
      pushTab: "Story", collectTab: "Collect", trainingTab: "Training", teamTab: "Team", berriesTab: "Berries", diagnosticsTab: "Diagnostics",
      startPush: "Start story", pauseResume: "Pause / Resume", stop: "Stop",
      pushNote: "Continue from the current region's story frontier; roaming legendaries are not tracked in Story mode.",
      prioritizeDailyRaid: "Prioritize the daily raid",
      prioritizeDailyRaidNote: "Before any automatic task, optimize the raid's two-Pokemon team with the game's own control, choose the first available option for each ally slot, and complete the daily Shiny raid. Team 5 is never changed.",
      dailyRaid: "Daily raid", raidTeamMissing: "Configure two Pokemon on the Raids page first", raidAlliesMissing: "Choose two allies on the Raids page first",
      selectCollection: "Choose a collection task", dexCollection: "Pokédex collection", roamOnly: "Roamers only", combined: "Pokédex + roamers",
      collectionNote: "These modes are independent: Pokédex collection ignores roamers, Roamers only ignores ordinary targets, and Combined coordinates both.",
      ordinaryTargets: "Ordinary wild targets", region: "Region", currentRegion: "Current region", allRegions: "All unlocked regions", customRegions: "Custom regions",
      autoPushCollection: "Advance story for Pokédex completion",
      autoPushCollectionNote: "When no target is catchable but story-locked targets remain, advance only to the next unlock and rescan immediately.",
      manualPlaceholder: "Priority numbers, e.g. 214,201-H,493-A", apply: "Apply",
      targetNote: "Only uncaught targets with a location in scope are added. Story-locked locations can be unlocked by collection story advancement.",
      collectionQueue: "Current catch queue", queueEmpty: "No automatic target is immediately available", waitingCondition: "Waiting for conditions", moneyFarm: "Farming money while waiting for weather",
      storyLocked: "Story not yet unlocked",
      roamers: "Roaming legendaries", roamerNote: "Tracks Raikou, Entei and Suicune. Live locations come from the game save, ignore the region filter above, and pause ordinary targets while active.",
      teamCopy: "Team recommendation and copy", lockTeam: "Lock Team 5; never overwrite it", team: "Team", copy: "Copy", regenerate: "Regenerate team for current target",
      trainingTitle: "Training candidate pool", trainingEnable: "Enable the pool; automatic teams prefer checked individuals",
      trainingPower: "Minimum combined stat value", trainingPowerHelp: "Combined stat value = the current form's six base stats × Shiny bonus × Underground rank bonus. It filters training candidates; it is not a win rate. Use 0 for no threshold.",
      trainingEligible: "Only show members usable in the current region", trainingSearch: "Search name or Pokédex number",
      trainingSelectVisible: "Select visible", trainingSelectTeam: "Add current team", trainingClear: "Clear", trainingRefresh: "Refresh",
      trainingSave: "Save candidate pool", trainingReset: "Discard draft", trainingNoSave: "Enter the game and create a save before configuring training candidates.",
      trainingDisabled: "The candidate pool is off; automatic teams use every currently available member.",
      duplicateKeepTitle: "Keep duplicates", enableDuplicateKeeps: "Enable all", disableDuplicateKeeps: "Disable all", cancelDuplicateKeeps: "Cancel bulk action",
      duplicateKeepRegions: "Regions to process",
      duplicateKeepNote: "Checks each accessible, repeatable non-Legendary Pokédex number and skips entries already in the requested state. The game shares this setting across an evolution family and between Shiny and regular Pokemon. One duplicate worth about three family levels is retained.",
      duplicateKeepIdle: "Not run", duplicateKeepConfirmOn: "Check every accessible Pokédex number in the selected regions and enable Keep duplicates?", duplicateKeepConfirmOff: "Check every accessible Pokédex number in the selected regions and disable Keep duplicates?",
      berryTitle: "Battle berries (all off by default)", reserve: "Minimum reserve", berryNote: "The number on the right is the reserve. Golden Razz is preferred when both catch berries are enabled.",
      stock: "Stock", pensionBerryTitle: "Day Care berries", pensionBerryButton: "Open Day Care", pensionBerryNote: "These berries show their effects and stock here, but must be used manually in the Day Care. The assistant never auto-consumes them.",
      notifications: "Notifications", sound: "Page sound", desktop: "Desktop notifications", diagnostic: "Diagnostics", noError: "No errors", copyDiagnostic: "Copy diagnostics", logs: "Logs",
      statusTitle: "Current task", task: "Mode", target: "Target", place: "Location", attempts: "Attempts", buffs: "Buffs", fifthTeam: "Team 5", idle: "Idle", notGenerated: "Not generated",
      notAppeared: "Not active", caught: "Caught", appearing: "Active", minutes: "min", moveUp: "Move up", moveDown: "Move down",
      targetPrompt: "Enter a Pokédex number or name to preview the target.", unknownPokemon: "No matching Pokémon", available: "Available",
      specialLocation: "Special location", specialRegionLocked: "Region not unlocked", specialOutsideScope: "Outside selected regions", specialConditionLocked: "Special condition not met",
      managedRoamer: "Roaming legendary; managed by the priority list below", caughtSkip: "Already caught; will not be added", noWildPlace: "No available wild location in the current scope", legendaryWild: "Legendary/Mythical · available as a wild target",
      kanto: "Kanto", johto: "Johto", hoenn: "Hoenn", sinnoh: "Sinnoh", unova: "Unova",
      waitingRoamers: "Waiting for Raikou, Entei or Suicune", paused: "Paused", working: "Working", cumulative: "Cumulative", suggestion: "Suggestion", game: "Game", data: "Data",
    },
  };

  const DEFAULT_SETTINGS = {
    collapsed: true,
    floating: false,
    floatPosition: null,
    floatSize: null,
    language: "auto",
    activeTab: "push",
    lockTeam5: false,
    prioritizeDailyRaid: true,
    candidatePool: { enabled: false, minPower: 500, uids: [] },
    desktopNotifications: false,
    soundNotifications: true,
    regionScope: "current",
    customRegions: ["kanto", "johto"],
    autoPushForCollection: true,
    duplicateKeepRegions: ["kanto", "johto", "hoenn", "sinnoh", "unova"],
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
    floatResizeBound: false,
    floatSizeObserver: null,
    duplicateKeep: null,
    collectionQueue: [],
    collectionQueueSignature: "",
    waitingPlan: null,
    dailyRaidDate: null,
    dailyRaidCompletedDate: null,
    dailyRaidActiveRegion: null,
    dailyRaidRetryAt: 0,
  };

  let settings = loadSettings();
  let candidatePoolDraft = null;

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

  function pensionBerryLabel(info) {
    return info?.[language()] || info?.zh || "";
  }

  function pensionBerryEffect(info) {
    return language() === "en" ? info?.effectEn : info?.effectZh;
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
      const loaded = mergeDeep(DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"));
      loaded.candidatePool = normalizeCandidatePool(loaded.candidatePool);
      return loaded;
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
    const validTeamSets = save?.teamSets == null || Array.isArray(save.teamSets.list);
    if (!save?.adv || !Array.isArray(save.mons) || !save.dex || !Array.isArray(save.team) || !validTeamSets) {
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

  function speciesDisplayNumber(id) {
    return species(id)?.d || String(id).padStart(3, "0");
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

  function baseStatTotal(id) {
    return (species(id)?.s || []).reduce((sum, value) => sum + Number(value || 0), 0);
  }

  function undergroundRank(mon) {
    return Math.min(DATA.rankMax, Math.max(0, Math.floor(Number(mon?.rank) || 0)));
  }

  function combinedStatMultiplier(mon) {
    return (mon?.shiny ? 1 + DATA.shinyStatBonus : 1) * DATA.rankStatMultiplier ** undergroundRank(mon);
  }

  function combinedStatValue(mon) {
    return Number((baseStatTotal(mon.id) * combinedStatMultiplier(mon)).toFixed(8));
  }

  function combinedStatNote(mon) {
    const parts = [language() === "en" ? `base stats ${baseStatTotal(mon.id)}` : `六项种族值 ${baseStatTotal(mon.id)}`];
    if (mon.shiny) parts.push(language() === "en" ? `Shiny +${Math.round(DATA.shinyStatBonus * 100)}%` : `异色 +${Math.round(DATA.shinyStatBonus * 100)}%`);
    if (undergroundRank(mon)) parts.push(language() === "en" ? `Underground rank ${undergroundRank(mon)}` : `地下强化 ${undergroundRank(mon)} 档`);
    return parts.join(" · ");
  }

  function normalizeCandidatePool(value) {
    if (!value || typeof value !== "object") value = {};
    const numeric = Number(value.minPower ?? value.minBst ?? 500);
    return {
      enabled: value.enabled === true,
      minPower: Number.isFinite(numeric) ? Math.max(0, Math.min(2_000, Math.trunc(numeric))) : 500,
      uids: [...new Set((Array.isArray(value.uids) ? value.uids : []).map(String).filter(Boolean))],
    };
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
    const power = combinedStatValue(mon);
    const statMultiplier = combinedStatMultiplier(mon);
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
    const score = power * 0.21 + offense * 0.82 + defense * 34 + stats[5] * statMultiplier * 0.08
      + levelContribution + preferredLevelScore + continuity - samePrimary * 16;
    return {
      score,
      reason: `${language() === "en" ? "Combined stats" : "综合能力"}${power}（${combinedStatNote(mon)}） · ${language() === "en" ? "offense" : "克制"}${offense.toFixed(0)} · ${language() === "en" ? "defense" : "防守"}${defense.toFixed(2)} · Lv.${mon.level}`,
    };
  }

  function recommendTeam(save, enemyIds, {
    excludedSignatures = new Set(),
    levelWeight = DEFAULT_LEVEL_WEIGHT,
    preferredLevel = null,
  } = {}) {
    const enemies = enemyProfiles(enemyIds);
    const currentFive = new Set(save.teamSets?.list?.[4] || save.team || []);
    const candidates = teamCandidatesForRecommendation(save);
    const preferredUids = new Set(preferredTeamCandidates(save).map((mon) => String(mon.uid)));
    const availableIdentities = new Set(candidates.map(teamIdentity));
    const selected = [];
    const details = [];
    while (selected.length < 6 && selected.length < availableIdentities.size) {
      const selectedIdentities = new Set(selected.map(teamIdentity));
      const ranked = candidates
        .filter((mon) => !selectedIdentities.has(teamIdentity(mon)))
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected, levelWeight, preferredLevel) }))
        .sort((a, b) => Number(preferredUids.has(String(b.mon.uid))) - Number(preferredUids.has(String(a.mon.uid))) || b.score - a.score);
      const choice = ranked[0];
      if (!choice) break;
      selected.push(choice.mon);
      details.push({ uid: choice.mon.uid, id: choice.mon.id, name: species(choice.mon.id)?.n || choice.mon.id, score: choice.score, reason: choice.reason });
    }

    const signature = selected.map((mon) => mon.uid).sort().join("|");
    if (excludedSignatures.has(signature) && availableIdentities.size > 6) {
      const last = selected.pop();
      details.pop();
      const selectedIdentities = new Set(selected.map(teamIdentity));
      const replacement = candidates
        .filter((mon) => !selectedIdentities.has(teamIdentity(mon)) && teamIdentity(mon) !== teamIdentity(last))
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected, levelWeight, preferredLevel) }))
        .sort((a, b) => Number(preferredUids.has(String(b.mon.uid))) - Number(preferredUids.has(String(a.mon.uid))) || b.score - a.score)[0];
      if (replacement) {
        selected.push(replacement.mon);
        details.push({
          uid: replacement.mon.uid,
          id: replacement.mon.id,
          name: species(replacement.mon.id)?.n || replacement.mon.id,
          score: replacement.score,
          reason: replacement.reason,
        });
      }
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

  function raidDateKey(timestamp = Date.now()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(timestamp);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function raidSetupStatus(save, region) {
    const knownUids = new Set((save.mons || []).map((mon) => mon.uid));
    const team = (save.eventTeams?.[`raid:${region}`] || []).filter((uid) => knownUids.has(uid));
    const allies = (save.raids?.pick?.[region] || []).filter(Boolean);
    return {
      team,
      allies,
      ready: team.length >= 2 && allies.length >= 2,
    };
  }

  async function optimizeDailyRaidTeam(root, region) {
    const edit = await waitFor(
      () => root.querySelector(`[data-raid-edit="${region}"]`),
      { label: language() === "en" ? "raid team editor" : "团体战队伍编辑器" },
    );
    await pacedClick(edit, language() === "en" ? "raid team editor" : "团体战队伍编辑器");
    const optimize = await waitFor(
      () => document.querySelector("#evt-pick.open #evt-opt"),
      { label: language() === "en" ? "raid team optimize button" : "团体战队伍优化按钮" },
    );
    await pacedClick(optimize, language() === "en" ? "optimize raid team" : "优化团体战队伍");
    await waitFor(
      () => raidSetupStatus(readSave(), region).team.length >= 2,
      { label: language() === "en" ? "optimized raid team" : "优化后的团体战队伍" },
    );
    const close = await waitFor(
      () => document.querySelector("#evt-pick.open [data-evt-close]"),
      { label: language() === "en" ? "raid team close button" : "团体战队伍关闭按钮" },
    );
    await pacedClick(close, language() === "en" ? "close raid team editor" : "关闭团体战队伍编辑器");
    await waitFor(
      () => !document.querySelector("#evt-pick.open"),
      { label: language() === "en" ? "raid team editor close" : "团体战队伍编辑器关闭" },
    );
  }

  async function selectFirstDailyRaidAllies(root, region) {
    for (let slot = 0; slot < 2; slot += 1) {
      const slotButton = await waitFor(
        () => root.querySelector(`[data-raid-slot="${region}|${slot}"]`),
        { label: language() === "en" ? `raid ally slot ${slot + 1}` : `团体战盟友槽${slot + 1}` },
      );
      await pacedClick(slotButton, language() === "en" ? `raid ally slot ${slot + 1}` : `团体战盟友槽${slot + 1}`);
      const first = await waitFor(
        () => document.querySelector("#modal-root.open .raid-dlg [data-pick]"),
        { label: language() === "en" ? "first available raid ally" : "第一个可用团体战盟友" },
      );
      await pacedClick(first, language() === "en" ? "first available raid ally" : "第一个可用团体战盟友");
      await waitFor(
        () => Boolean(readSave().raids?.pick?.[region]?.[slot]),
        { label: language() === "en" ? `raid ally ${slot + 1} selection` : `团体战盟友${slot + 1}选择` },
      );
    }
  }

  function finishDailyRaidCheck(date, message) {
    runtime.dailyRaidCompletedDate = date;
    runtime.dailyRaidActiveRegion = null;
    if (message) log(message);
  }

  async function prioritizeDailyRaid(save) {
    if (!settings.prioritizeDailyRaid) return false;
    const date = raidDateKey(Number(save.lastTick) || Date.now());
    if (runtime.dailyRaidDate !== date) {
      runtime.dailyRaidDate = date;
      runtime.dailyRaidCompletedDate = null;
      runtime.dailyRaidActiveRegion = null;
    }

    const activeRaid = save.adv?.event?.raid ? save.adv.event : null;
    if (activeRaid) {
      runtime.dailyRaidActiveRegion = activeRaid.reg || null;
      return true;
    }
    runtime.dailyRaidActiveRegion = null;
    if (runtime.dailyRaidCompletedDate === date) return false;
    if (runtime.dailyRaidRetryAt > Date.now()) return false;

    return exclusive(language() === "en" ? "Check daily raid" : "检查每日团体战", async () => {
      await openScreen("raid");
      const root = await waitFor(() => document.querySelector("#raid-root"), { label: t("dailyRaid") });
      const entry = await waitFor(
        () => root.querySelector("[data-raid-draw], [data-raid-page=\"chroma\"], [data-p], .pg-empty"),
        { timeout: 15_000, label: language() === "en" ? "daily raid entry" : "每日团体战入口" },
      );

      if (entry.matches("[data-p]")) {
        finishDailyRaidCheck(date, language() === "en" ? "Daily raid skipped: sign in to the game first" : "今日团体战已跳过：请先登录游戏账号");
        return;
      }
      if (entry.matches(".pg-empty")) {
        finishDailyRaidCheck(date, language() === "en" ? "Daily raid is not available yet" : "今日没有可用团体战或尚未解锁");
        return;
      }
      if (entry.matches("[data-raid-draw]")) {
        await pacedClick(entry, language() === "en" ? "daily raid draw" : "抽取每日团体战");
        await waitFor(
          () => root.querySelector("[data-raid-page=\"chroma\"], .rc-card, [data-p]"),
          { timeout: 20_000, label: language() === "en" ? "daily raid draw" : "每日团体战抽取" },
        );
      }

      const raidPage = root.querySelector('[data-raid-page="chroma"]');
      if (raidPage) {
        await pacedClick(raidPage, language() === "en" ? "daily raid" : "每日团体战入口");
      }
      try {
        await waitFor(
          () => root.querySelector(".rc-card, [data-p]"),
          { timeout: 15_000, label: language() === "en" ? "daily raid list" : "每日团体战列表" },
        );
      } catch {
        runtime.dailyRaidRetryAt = Date.now() + 5 * 60_000;
        runtime.dailyRaidActiveRegion = null;
        log(language() === "en"
          ? "Daily raid data is still unavailable; retrying in five minutes"
          : "团体战数据暂时不可用，5分钟后重试");
        return;
      }

      if (root.querySelector("[data-p]")) {
        finishDailyRaidCheck(date, language() === "en" ? "Daily raid skipped: sign in to the game first" : "今日团体战已跳过：请先登录游戏账号");
        return;
      }
      const available = [...root.querySelectorAll("[data-raid-go]")].find((button) => !button.disabled);
      if (!available) {
        finishDailyRaidCheck(date, language() === "en" ? "Today's available raids are complete" : "今日可用团体战已完成");
        return;
      }

      const region = available.dataset.raidGo;
      runtime.dailyRaidActiveRegion = region;
      await optimizeDailyRaidTeam(root, region);
      await selectFirstDailyRaidAllies(root, region);
      const setup = raidSetupStatus(readSave(), region);
      if (setup.team.length < 2) {
        diagnostic(t("dailyRaid"), new Error(`${t("raidTeamMissing")}（${t(region)}）`), {
          suggestion: language() === "en"
            ? "The Raids page is open. Configure its two-Pokemon team, then restart the automatic task."
            : "已停在团体战页面；配置该地区的2人团体战队伍后，重新启动自动任务。",
        });
        return;
      }
      if (setup.allies.length < 2) {
        diagnostic(t("dailyRaid"), new Error(`${t("raidAlliesMissing")}（${t(region)}）`), {
          suggestion: language() === "en"
            ? "The Raids page is open. Choose two allies there, then restart the automatic task."
            : "已停在团体战页面；选择2名盟友后，重新启动自动任务。",
        });
        return;
      }

      const go = await waitFor(
        () => [...root.querySelectorAll(`[data-raid-go="${region}"]`)].find((button) => !button.disabled),
        { label: language() === "en" ? "daily raid start button" : "每日团体战开始按钮" },
      );
      await pacedClick(go, language() === "en" ? "start daily raid" : "开始每日团体战");
      const outcome = await waitFor(
        () => readSave().adv?.event?.raid
          || document.querySelector("#modal-root.open .modal-actions .btn.primary")
          || document.querySelector("#evt-pick.open, #modal-root.open .raid-dlg"),
        { timeout: 10_000, label: language() === "en" ? "daily raid start" : "每日团体战启动" },
      );
      if (outcome instanceof Element && outcome.matches("#modal-root.open .modal-actions .btn.primary")) {
        await pacedClick(outcome, language() === "en" ? "confirm daily raid" : "确认开始团体战");
      } else if (outcome instanceof Element) {
        throw new Error(language() === "en" ? "The raid setup is no longer valid; configure it again on the Raids page" : "团体战配置已失效，请在团体战页面重新配置");
      }
      const event = await waitFor(
        () => readSave().adv?.event?.raid && readSave().adv.event,
        { timeout: 10_000, label: language() === "en" ? "enter daily raid" : "进入每日团体战" },
      );
      runtime.dailyRaidActiveRegion = event.reg || region;
      log(language() === "en" ? `Daily raid started: ${t(region)}` : `已优先开始每日团体战：${t(region)}`);
    });
  }

  async function switchChapter(chapterIndex, { settle = true } = {}) {
    runtime.expectedChapter = chapterIndex;
    const targetRegion = chapter(chapterIndex)?.region;
    if (!targetRegion) throw new Error(`找不到章节${chapterIndex}的数据`);
    await openScreen("adventure");
    let visibleRow = document.querySelector(`.mp-row[data-ch="${chapterIndex}"]`);
    if (!visibleRow) {
      await pacedClick(document.querySelector("#side-chapter"), "章节列表按钮");
      visibleRow = document.querySelector(`.mp-row[data-ch="${chapterIndex}"]`);
      if (!visibleRow) {
        const regionButton = await waitFor(
          () => document.querySelector(`.rg.open[data-rg="${targetRegion}"]`),
          { label: `${t(targetRegion)}地区标签` },
        );
        await pacedClick(regionButton, `${t(targetRegion)}地区标签`);
      }
    }
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

  async function enterSpecialZone(plan) {
    await openScreen("adventure");
    await pacedClick(document.querySelector("#side-chapter"), language() === "en" ? "open map" : "打开地图");
    const button = await waitFor(
      () => document.querySelector(`.mp-go[data-zone="${plan.speciesId}"]`),
      { label: `${plan.zone}入口` },
    );
    if (button.disabled) throw new Error(`${plan.zone}尚未解锁`);
    await pacedClick(button, `${plan.zone}入口`);
    await waitFor(
      () => Number(readSave().adv.zone?.id) === Number(plan.speciesId),
      { timeout: 10_000, label: `进入${plan.zone}` },
    );
    log(`已进入特殊地点：${plan.zone}`);
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
      const alternative = alternatives[0];
      const previousRegion = currentRegion(save);
      runtime.targetPlan = alternative;
      await switchChapter(alternative.chapter);
      const targetSave = readSave();
      if (currentRegion(targetSave) !== previousRegion) {
        const team = recommendTeam(targetSave, [alternative.speciesId], { levelWeight: COLLECTION_LEVEL_WEIGHT });
        await applyRecommendedTeam(team, species(alternative.speciesId)?.n || String(alternative.speciesId));
      }
      return;
    }
    const region = chapter(plan.chapter)?.region || currentRegion(save);
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

  function pokemonHomeRegion(mon) {
    if (mon?.reg === "kanto2") return "johto";
    return ["kanto", "johto", "hoenn", "sinnoh", "unova"].includes(mon?.reg) ? mon.reg : "kanto";
  }

  function isMonAvailableInCurrentRegion(save, mon) {
    if (!save?.link) return true;
    const side = pokemonHomeRegion(mon) === save.link.to ? "to" : "from";
    return side === save.link.side;
  }

  function availableTeamCandidates(save) {
    return (save?.mons || []).filter((mon) => mon?.uid && mon.level > 0 && isMonAvailableInCurrentRegion(save, mon));
  }

  function teamIdentity(mon) {
    const singleFormBase = species(mon?.id)?.u;
    return singleFormBase == null ? "species:" + mon?.id : "single:" + singleFormBase;
  }

  function preferredTeamCandidates(save, config = settings.candidatePool) {
    const pool = normalizeCandidatePool(config);
    if (!pool.enabled) return [];
    const selected = new Set(pool.uids);
    return availableTeamCandidates(save).filter((mon) => selected.has(String(mon.uid)) && combinedStatValue(mon) + 1e-9 >= pool.minPower);
  }

  function teamCandidatesForRecommendation(save) {
    return availableTeamCandidates(save);
  }

  function requiredTeamSize(save) {
    return Math.min(6, new Set(teamCandidatesForRecommendation(save).map(teamIdentity)).size);
  }

  function duplicateKeepCandidates(save, regions = settings.duplicateKeepRegions) {
    const representatives = new Map();
    for (const mon of save.mons || []) {
      const meta = species(mon.id);
      if (!meta || meta.g || meta.m) continue;
      if (!regions.includes(pokemonHomeRegion(mon))) continue;
      if (representatives.has(mon.id)) continue;
      representatives.set(mon.id, mon);
    }
    return [...representatives.entries()].map(([id, mon]) => ({ id, mon }));
  }

  function renderDuplicateKeepProgress() {
    const root = document.querySelector("#pca-duplicate-keep-status");
    if (!root) return;
    const progress = runtime.duplicateKeep;
    if (!progress) {
      root.textContent = t("duplicateKeepIdle");
      return;
    }
    root.textContent = language() === "en"
      ? `${progress.done}/${progress.total} · changed ${progress.changed} · skipped ${progress.skipped}${progress.cancelled ? " · cancelled" : ""}`
      : `${progress.done}/${progress.total} · 已更改${progress.changed} · 跳过${progress.skipped}${progress.cancelled ? " · 已取消" : ""}`;
  }

  async function setDuplicateKeepForMon(mon, enabled) {
    await openScreen("team");
    const quickPacing = { beforeMin: 250, beforeMax: 600, afterMin: 150, afterMax: 350 };
    const search = document.querySelector("#pc-search");
    let card = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(mon.uid)}"]`);
    if (!card && search) {
      search.value = species(mon.id)?.n || "";
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await jitter(180, 420);
      card = document.querySelector(`#pc-grid .pc-cell[data-uid="${CSS.escape(mon.uid)}"]`);
    }
    if (!card) return false;
    await pacedClick(card, `${species(mon.id)?.n || mon.id}详情`, quickPacing);
    const detail = await waitFor(() => document.querySelector(".dexcard.v2"), { label: "宝可梦详情" });
    try {
      const toggle = detail.querySelector(".keep-row");
      if (!toggle) return false;
      const current = toggle.getAttribute("aria-checked") === "true";
      if (current === enabled) return "unchanged";
      await pacedClick(toggle, t("duplicateKeepTitle"), quickPacing);
      await waitFor(
        () => detail.querySelector(".keep-row")?.getAttribute("aria-checked") === String(enabled),
        { label: t("duplicateKeepTitle") },
      );
      return "changed";
    } finally {
      const close = detail.querySelector(".dc-x");
      if (close) await pacedClick(close, language() === "en" ? "close details" : "关闭详情", quickPacing);
    }
  }

  async function bulkSetDuplicateKeeps(enabled) {
    if (runtime.duplicateKeep?.active) return;
    if (!confirm(enabled ? t("duplicateKeepConfirmOn") : t("duplicateKeepConfirmOff"))) return;
    await exclusive(t("duplicateKeepTitle"), async () => {
      const candidates = duplicateKeepCandidates(readSave(), settings.duplicateKeepRegions);
      runtime.duplicateKeep = { active: true, enabled, total: candidates.length, done: 0, changed: 0, skipped: 0, cancelled: false };
      renderDuplicateKeepProgress();
      try {
        for (const { mon } of candidates) {
          if (runtime.duplicateKeep.cancelled) break;
          try {
            const result = await setDuplicateKeepForMon(mon, enabled);
            if (result === "changed") runtime.duplicateKeep.changed += 1;
            else runtime.duplicateKeep.skipped += 1;
          } catch (error) {
            runtime.duplicateKeep.skipped += 1;
            log(`${species(mon.id)?.n || mon.id}：${error.message}`);
          }
          runtime.duplicateKeep.done += 1;
          renderDuplicateKeepProgress();
        }
      } finally {
        const search = document.querySelector("#pc-search");
        if (search?.value) {
          search.value = "";
          search.dispatchEvent(new Event("input", { bubbles: true }));
        }
        runtime.duplicateKeep.active = false;
        renderDuplicateKeepProgress();
      }
      log(language() === "en"
        ? `Keep duplicates bulk action: ${runtime.duplicateKeep.changed} changed, ${runtime.duplicateKeep.skipped} skipped`
        : `批量保留重复：已更改${runtime.duplicateKeep.changed}，跳过${runtime.duplicateKeep.skipped}`);
    });
  }

  function habitatForRoute(route) {
    if (route.habitat && DATA.habitats[route.habitat]) return DATA.habitats[route.habitat];
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
    const regions = new Set(collectionScopeRegions(save));
    return DATA.chapters.filter((item) => item.index <= save.adv.unlocked && regions.has(item.region));
  }

  function unlockedRegions(save) {
    return [...new Set(DATA.chapters
      .filter((item) => item.index <= save.adv.unlocked)
      .map((item) => item.region))];
  }

  function collectionScopeRegions(save) {
    const unlocked = unlockedRegions(save);
    if (settings.regionScope === "current") return [currentRegion(save)];
    if (settings.regionScope === "custom") return unlocked.filter((region) => settings.customRegions.includes(region));
    return unlocked;
  }

  function routeCanContainSpecies(route, speciesId) {
    const habitat = habitatForRoute(route);
    if (!habitat) return (route.species || []).includes(Number(speciesId));
    return Object.values(habitat).some((table) => Number(table?.[speciesId] || 0) > 0);
  }

  function chaptersInCollectionScope(save, options) {
    const includeStoryLocked = Boolean(options?.includeStoryLocked);
    const regions = new Set(collectionScopeRegions(save));
    return DATA.chapters.filter((item) => (
      regions.has(item.region) && (includeStoryLocked || item.index <= save.adv.unlocked)
    ));
  }

  function plansForSpecies(save, speciesId, timestamp = Number(save.lastTick) || Date.now()) {
    const plans = [];
    for (const item of availableChapters(save)) {
      for (const route of item.routes) {
        const phase = daytimePhaseAt(timestamp, Boolean(item.day && !(save.adv.unlocked > item.index)));
        const weather = currentWeatherForRoute(save, item, route, timestamp, phase);
        const weight = routeWeights(route, phase, weather)[speciesId] || 0;
        if (weight <= 0) continue;
        const dryWeight = routeWeights(route, phase, null)[speciesId] || 0;
        const weatherLimited = Boolean(weather && dryWeight <= 0);
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
          weatherLimited,
        });
      }
    }
    return plans.sort((a, b) => b.score - a.score || a.prefixCost - b.prefixCost);
  }

  function regionInCollectionScope(save, region) {
    if (settings.regionScope === "current") return currentRegion(save) === region;
    if (settings.regionScope === "custom") return settings.customRegions.includes(region);
    return true;
  }

  function specialConditionStatus(save, condition, special) {
    if (!condition) return { met: true, reason: "" };
    if (condition.kind === "owns") {
      const missing = (condition.ids || []).filter((id) => !isCaught(save, id));
      return missing.length
        ? { met: false, reason: `${language() === "en" ? "Needs" : "需要拥有"} ${missing.map((id) => species(id)?.n || id).join("、")}` }
        : { met: true, reason: "" };
    }
    if (condition.kind === "all") {
      const failed = (condition.list || [])
        .map((item) => specialConditionStatus(save, item, special))
        .find((item) => !item.met);
      return failed || { met: true, reason: "" };
    }
    if (condition.kind === "item") {
      const met = Number(save.items?.[condition.item] || 0) > 0;
      return { met, reason: met ? "" : (condition.text || `${language() === "en" ? "Needs item" : "需要道具"} ${condition.item}`) };
    }
    if (condition.kind === "door") {
      const met = Boolean(save.zoneDoors?.[condition.key]);
      return { met, reason: met ? "" : (condition.text || t("specialConditionLocked")) };
    }
    if (condition.kind === "league") {
      const badge = DATA.chapters.find((item) => item.region === condition.region && item.boss?.champion)?.boss?.badge;
      const met = Boolean(badge && save.adv.badges?.includes(badge));
      return { met, reason: met ? "" : (condition.text || t("specialConditionLocked")) };
    }
    if (condition.kind === "dex" && special.dex) {
      const missing = Object.keys(DATA.species).map(Number).filter((id) => (
        id >= special.dex[0] && id <= special.dex[1] && !species(id)?.m && !isCaught(save, id)
      ));
      return { met: missing.length === 0, reason: missing.length ? (condition.text || t("specialConditionLocked")) : "" };
    }
    if (condition.kind === "type" && special.dex) {
      const missing = Object.keys(DATA.species).map(Number).filter((id) => (
        id >= special.dex[0] && id <= special.dex[1] && species(id)?.t?.includes(condition.type) && !isCaught(save, id)
      ));
      return { met: missing.length === 0, reason: missing.length ? (condition.text || t("specialConditionLocked")) : "" };
    }
    if (condition.kind === "types" && condition.dex) {
      const missing = Object.keys(DATA.species).map(Number).filter((id) => (
        id >= condition.dex[0] && id <= condition.dex[1]
        && id !== special.id && !species(id)?.m
        && !(species(id)?.g && id >= special.dex[0])
        && species(id)?.t?.some((type) => condition.types.includes(type))
        && !isCaught(save, id)
      ));
      return { met: missing.length === 0, reason: missing.length ? (condition.text || t("specialConditionLocked")) : "" };
    }
    if (condition.kind === "count" && special.dex) {
      const caught = Object.keys(DATA.species).map(Number).filter((id) => (
        id >= special.dex[0] && id <= special.dex[1] && !species(id)?.g && !species(id)?.m && isCaught(save, id)
      )).length;
      return { met: caught >= condition.need, reason: caught >= condition.need ? "" : (condition.text || `${caught}/${condition.need}`) };
    }
    if (condition.kind === "tally") {
      const value = Number(save.stats?.byReg?.[special.region]?.[condition.field] || 0);
      return { met: value >= condition.need, reason: value >= condition.need ? "" : (condition.text || `${value}/${condition.need}`) };
    }
    if (condition.kind === "elite") {
      const tier = Number(save.elite?.[condition.zone]?.t || 0);
      return { met: tier >= condition.tier, reason: tier >= condition.tier ? "" : (condition.text || t("specialConditionLocked")) };
    }
    return { met: false, reason: condition.text || t("specialConditionLocked") };
  }

  function specialTargetStatus(save, speciesId) {
    const special = (DATA.specialZones || []).find((item) => item.id === Number(speciesId));
    if (!special) return null;
    const regionChapters = DATA.chapters.filter((item) => item.region === special.region && item.index <= save.adv.unlocked);
    if (!regionChapters.length) return { special, open: false, reason: t("specialRegionLocked"), chapter: null };
    if (!regionInCollectionScope(save, special.region)) return { special, open: false, reason: t("specialOutsideScope"), chapter: null };
    if (special.badge && !save.adv.badges?.includes(special.badge)) {
      return { special, open: false, reason: language() === "en"
        ? `Needs badge: ${special.badgeName || special.badge}`
        : `需要徽章：${special.badgeName || special.badge}`, chapter: null };
    }
    const condition = specialConditionStatus(save, special.condition, special);
    if (!condition.met) return { special, open: false, reason: condition.reason, chapter: null };
    const areaChapter = regionChapters.find((item) => item.routes.some((route) => route.areas.some((area) => special.areas.includes(area))));
    const chapterPlan = areaChapter || regionChapters.at(-1);
    return { special, open: true, reason: "", chapter: chapterPlan?.index ?? null };
  }

  function specialPlansForSpecies(save, speciesId) {
    const status = specialTargetStatus(save, speciesId);
    if (!status?.open || status.chapter == null || isCaught(save, speciesId)) return [];
    return [{
      speciesId: Number(speciesId),
      chapter: status.chapter,
      chapterName: chapter(status.chapter)?.name,
      zone: status.special.zone,
      sourceZone: status.special.sourceZone,
      special: true,
      score: 0.5,
      prefixCost: 1,
      level: status.special.level,
    }];
  }

  function collectionPlansForSpecies(save, speciesId, timestamp = Number(save.lastTick) || Date.now()) {
    return [...plansForSpecies(save, speciesId, timestamp), ...specialPlansForSpecies(save, speciesId)]
      .sort((a, b) => compareCollectionPlans(save, a, b));
  }

  function potentialWildTarget(save, speciesId, options) {
    const includeStoryLocked = Boolean(options?.includeStoryLocked);
    for (const item of chaptersInCollectionScope(save, { includeStoryLocked })) {
      for (const route of item.routes) {
        if (routeCanContainSpecies(route, speciesId)) return true;
      }
    }
    return false;
  }

  function storyLockedChapterForSpecies(save, speciesId) {
    return chaptersInCollectionScope(save, { includeStoryLocked: true })
      .filter((item) => item.index > save.adv.unlocked)
      .find((item) => item.routes.some((route) => routeCanContainSpecies(route, speciesId))) || null;
  }

  function conditionContainsKind(condition, kind) {
    if (!condition) return false;
    if (condition.kind === kind) return true;
    return condition.kind === "all" && (condition.list || []).some((item) => conditionContainsKind(item, kind));
  }

  function specialNeedsStoryUnlock(save, special) {
    if (special.badge && !save.adv.badges?.includes(special.badge)) return true;
    if (conditionContainsKind(special.condition, "league")) return true;
    return DATA.chapters.some((item) => (
      item.region === special.region && item.index > save.adv.unlocked
      && item.routes.some((route) => route.areas.some((area) => special.areas.includes(area)))
    ));
  }

  function collectionStoryUnlockPlan(save) {
    if (!settings.autoPushForCollection) return null;
    const scope = new Set(collectionScopeRegions(save));
    const manual = settings.manualTargets.filter((id) => !isCaught(save, id));
    const automatic = Object.keys(DATA.species).map(Number).filter((id) => !isCaught(save, id));
    const targetIds = [...manual, ...automatic.filter((id) => !manual.includes(id))];

    for (const region of scope) {
      const all = DATA.chapters.filter((item) => item.region === region);
      const unlocked = all.filter((item) => item.index <= save.adv.unlocked);
      const frontier = unlocked.at(-1);
      const final = all.at(-1);
      if (!frontier || !final) continue;
      const finalBadge = final.boss?.badge;
      if (frontier.index === final.index && finalBadge && save.adv.badges?.includes(finalBadge)) continue;

      const locked = all.filter((item) => item.index > save.adv.unlocked);
      const targetId = targetIds.find((id) => locked.some((item) => item.routes.some((route) => routeCanContainSpecies(route, id))));
      const lockedSpecial = (DATA.specialZones || []).find((item) => (
        item.region === region && !isCaught(save, item.id)
        && !specialTargetStatus(save, item.id)?.open && specialNeedsStoryUnlock(save, item)
      ));
      if (!targetId && !lockedSpecial) continue;
      return {
        unlockForCollection: true,
        region,
        chapter: frontier.index,
        chapterName: frontier.name,
        targetId: targetId || lockedSpecial?.id || null,
        unlockedAtStart: save.adv.unlocked,
      };
    }
    return null;
  }

  function weatherFlexibility(save, plan) {
    const item = chapter(plan.chapter);
    const route = item?.routes.find((candidate) => candidate.name === plan.zone && candidate.sourceName === plan.sourceZone)
      || item?.routes.find((candidate) => candidate.name === plan.zone || candidate.sourceName === plan.sourceZone);
    const habitat = route && habitatForRoute(route);
    if (!habitat) return Number.POSITIVE_INFINITY;
    return Object.keys(DATA.weather.types).filter((weather) => Number(habitat[weather]?.[plan.speciesId] || 0) > 0).length || Number.POSITIVE_INFINITY;
  }

  function collectionRegionRank(save, plan) {
    const region = chapter(plan.chapter)?.region;
    const rank = collectionScopeRegions(save).indexOf(region);
    return rank >= 0 ? rank : REGION_ORDER.length;
  }

  function collectionTeamLevelForRegion(save, region) {
    const levels = (save?.mons || [])
      .filter((mon) => mon?.uid && Number(mon.level) > 0 && pokemonHomeRegion(mon) === region)
      .map((mon) => Number(mon.level))
      .sort((a, b) => b - a)
      .slice(0, 6);
    return levels.length ? levels.reduce((sum, level) => sum + level, 0) / levels.length : 0;
  }

  function collectionLevelFactor(save, plan) {
    const region = chapter(plan.chapter)?.region;
    const teamLevel = collectionTeamLevelForRegion(save, region);
    const mapLevel = Math.max(1, Number(plan.level || chapter(plan.chapter)?.ace || 1));
    if (teamLevel >= mapLevel) return 1;
    return Math.max(0.15, teamLevel / mapLevel);
  }

  function collectionPlanEfficiency(save, plan) {
    return Number(plan.score || 0) * collectionLevelFactor(save, plan);
  }

  function compareCollectionPlans(save, left, right) {
    return collectionRegionRank(save, left) - collectionRegionRank(save, right)
      || collectionPlanEfficiency(save, right) - collectionPlanEfficiency(save, left)
      || Number(left.prefixCost || 0) - Number(right.prefixCost || 0);
  }

  function planPriority(save, plan) {
    const manualIndex = settings.manualTargets.indexOf(plan.speciesId);
    const regionRank = collectionRegionRank(save, plan);
    const efficiency = collectionPlanEfficiency(save, plan);
    if (manualIndex >= 0) return [0, manualIndex, regionRank, -efficiency];
    if (plan.weatherLimited) return [1, regionRank, weatherFlexibility(save, plan), plan.weight || 0, -efficiency];
    return [2, regionRank, 0, -efficiency];
  }

  function comparePriority(left, right) {
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
      const difference = (left[index] || 0) - (right[index] || 0);
      if (difference) return difference;
    }
    return 0;
  }

  function buildCollectionQueue(save) {
    const bestBySpecies = new Map();
    for (const [id] of Object.entries(DATA.species)) {
      if (isCaught(save, id)) continue;
      const option = collectionPlansForSpecies(save, Number(id))[0];
      if (option) bestBySpecies.set(Number(id), option);
    }
    return [...bestBySpecies.values()].sort((a, b) => comparePriority(planPriority(save, a), planPriority(save, b)));
  }

  function collectionQueueSignature(save) {
    const now = Number(save.lastTick) || Date.now();
    const caught = Object.values(save.dex || {}).reduce((total, item) => total + (Number(item?.caught || 0) > 0 ? 1 : 0), 0);
    const roamWeather = Object.entries(save.roam?.at || {})
      .map(([id, item]) => `${id}:${item?.ch}:${item?.until}:${Number(item?.until) > now ? 1 : 0}`)
      .sort().join("|");
    const unlocks = [
      save.adv.chapter,
      save.adv.unlocked,
      [...(save.adv.badges || [])].sort().join(","),
      Object.keys(save.zoneDoors || {}).filter((key) => save.zoneDoors[key]).sort().join(","),
      Object.entries(save.items || {}).filter(([, count]) => Number(count) > 0).map(([key]) => key).sort().join(","),
      JSON.stringify(save.stats?.byReg || {}),
      JSON.stringify(save.elite || {}),
    ].join("|");
    const teamLevels = REGION_ORDER
      .map((region) => `${region}:${collectionTeamLevelForRegion(save, region).toFixed(2)}`)
      .join(",");
    return [Math.floor(now / DATA.weather.slotMs), daytimePhaseAt(now), caught, settings.regionScope,
      settings.customRegions.join(","), settings.manualTargets.join(","), roamWeather, unlocks, teamLevels].join(";");
  }

  function refreshCollectionQueue(save, force = false) {
    const signature = collectionQueueSignature(save);
    if (force || signature !== runtime.collectionQueueSignature) {
      runtime.collectionQueue = buildCollectionQueue(save);
      runtime.collectionQueueSignature = signature;
    }
    return runtime.collectionQueue;
  }

  function chooseMissingPlan(save) {
    return refreshCollectionQueue(save)[0] || null;
  }

  function nextConditionalPlan(save, hours = 168, targetIds = null) {
    const now = Number(save.lastTick) || Date.now();
    const start = Math.floor(now / DATA.weather.slotMs) * DATA.weather.slotMs;
    const automaticIds = Object.keys(DATA.species).map(Number);
    const ids = (targetIds || [...settings.manualTargets, ...automaticIds.filter((id) => !settings.manualTargets.includes(id))])
      .filter((id) => !isCaught(save, id));
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

  function moneyFarmPlan(save) {
    const candidates = availableChapters(save)
      .map((item) => ({ item, route: [...item.routes].reverse().find((route) => route.wild > 0) }))
      .filter(({ route }) => route)
      .sort((a, b) => (b.item.ace || 0) - (a.item.ace || 0) || b.item.index - a.item.index);
    const selected = candidates[0];
    if (!selected) return null;
    return {
      moneyFarm: true,
      chapter: selected.item.index,
      chapterName: selected.item.name,
      zone: selected.route.name,
      sourceZone: selected.route.sourceName,
      score: selected.item.ace || 0,
    };
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

  function savedTimelinePlanStatus(save, plan) {
    const nodes = Array.isArray(save?.adv?.nodes) ? save.adv.nodes : [];
    const matchesZone = (node) => node?.name === plan.sourceZone || node?.name === plan.zone;
    const relevant = nodes.map((node, index) => ({ node, index })).filter(({ node }) => matchesZone(node));
    const wild = relevant.filter(({ node }) => node?.type === "wild");
    return {
      nodes,
      relevant,
      wild,
      lastWild: wild.at(-1)?.index ?? -1,
      current: Number.isInteger(save?.adv?.node) ? save.adv.node : -1,
    };
  }

  function timelinePlanStatus(save, plan) {
    const saved = savedTimelinePlanStatus(save, plan);
    if (saved.lastWild >= 0) return saved;

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
      const fullTeamSize = requiredTeamSize(save);
      if (fullTeamSize > 0 && teamMons.length === fullTeamSize && ourMin >= enemyMax && series.count >= 3) {
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

  async function collectionUnlockTick(save, plan) {
    if (save.adv.chapter !== plan.chapter) {
      await exclusive("切换全收集解锁前沿", () => switchChapter(plan.chapter));
      return;
    }
    const targetKey = `unlock:${plan.region}:${plan.chapter}`;
    if (runtime.target !== targetKey || !runtime.teamPlan) {
      runtime.target = targetKey;
      runtime.targetPlan = plan;
      runtime.userTeamOverride = false;
      const fresh = readSave();
      const team = recommendTeam(fresh, targetEnemyIdsForChapter(plan.chapter));
      await exclusive("配置全收集推图阵容", () => applyRecommendedTeam(team, `${plan.chapterName} · 解锁更多图鉴`));
      log(`为全收集推进${plan.chapterName}；下一次章节解锁后立即重新扫描`);
    }
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
      await exclusive("配置神兽阵容", async () => {
        if (readSave().adv.chapter !== roamer.chapter) await switchChapter(roamer.chapter);
        const plan = recommendRoamingTeam(readSave(), roamer.id);
        await applyRecommendedTeam(plan, species(roamer.id)?.n || String(roamer.id));
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

    if (runtime.targetPlan?.unlockForCollection) {
      const immediate = refreshCollectionQueue(save)[0] || null;
      const unlockedMore = save.adv.unlocked > runtime.targetPlan.unlockedAtStart;
      const finalBadge = chapter(runtime.targetPlan.chapter)?.boss?.badge;
      const finishedFinale = finalBadge && save.adv.badges?.includes(finalBadge);
      if (immediate || unlockedMore || finishedFinale) {
        log(immediate
          ? "出现可立即捕获的目标，暂停全收集推图并重新规划"
          : "全收集推图已产生新解锁，立即重新扫描缺失图鉴");
        runtime.target = null;
        runtime.targetPlan = null;
        runtime.teamPlan = null;
        runtime.collectionQueueSignature = "";
      } else {
        await collectionUnlockTick(save, runtime.targetPlan);
        return;
      }
    }

    const preferred = refreshCollectionQueue(save)[0] || null;
    if (runtime.targetPlan && !runtime.targetPlan.roaming && preferred && preferred.speciesId !== runtime.targetPlan.speciesId) {
      const shouldPreempt = runtime.targetPlan.moneyFarm
        || comparePriority(planPriority(save, preferred), planPriority(save, runtime.targetPlan)) < 0;
      if (shouldPreempt) {
        const oldName = runtime.targetPlan.moneyFarm ? t("moneyFarm") : species(runtime.targetPlan.speciesId)?.n;
        log(`${species(preferred.speciesId)?.n || preferred.speciesId}优先级已生效，暂停${oldName || "当前目标"}并重新规划`);
        runtime.target = null;
        runtime.targetPlan = null;
        runtime.teamPlan = null;
        runtime.chapterReset = null;
      }
    }

    if (runtime.targetPlan?.speciesId && !runtime.targetPlan.roaming && !isCaught(save, runtime.targetPlan.speciesId)) {
      const stillAvailable = collectionPlansForSpecies(save, runtime.targetPlan.speciesId).some((plan) => (
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

    if (!runtime.targetPlan || (runtime.targetPlan.speciesId && isCaught(save, runtime.targetPlan.speciesId))) {
      const next = chooseMissingPlan(save);
      if (!next) {
        const unlock = collectionStoryUnlockPlan(save);
        if (unlock) {
          runtime.waitingPlan = null;
          runtime.target = null;
          runtime.targetPlan = unlock;
          runtime.teamPlan = null;
          runtime.attempts = 0;
          await collectionUnlockTick(save, unlock);
          return;
        }
        const waiting = nextConditionalPlan(save);
        if (waiting) {
          runtime.waitingPlan = waiting;
          const farm = moneyFarmPlan(save);
          const waitingKey = farm ? `farm:${farm.chapter}` : `dex:waiting:${waiting.speciesId}:${waiting.availableAt}`;
          if (runtime.target !== waitingKey) {
            const condition = [waiting.phase, waiting.weather].filter(Boolean).join(" / ");
            log(`等待${species(waiting.speciesId)?.n || waiting.speciesId}条件：${waiting.chapterName} · ${new Date(waiting.availableAt).toLocaleString()}${condition ? ` · ${condition}` : ""}`);
            if (farm) log(`等待期间前往${farm.chapterName}刷钱；天气目标出现时立即让位`);
          }
          runtime.target = waitingKey;
          runtime.targetPlan = farm;
          runtime.teamPlan = null;
          runtime.teamStatus = farm
            ? `${t("moneyFarm")}：${farm.chapterName}`
            : `${t("waitingCondition")}：${waiting.chapterName} · ${new Date(waiting.availableAt).toLocaleString()}`;
          return;
        }
        runtime.waitingPlan = null;
        runtime.paused = true;
        notifyUser("自动捕获目标已完成", "当前范围只剩进化、孵蛋、交换、特殊事件或条件尚未满足的目标。 ");
        log("没有可自动刷取的缺失目标，已进入等待状态");
        return;
      }
      runtime.waitingPlan = null;
      runtime.targetPlan = next;
      runtime.target = `dex:${next.speciesId}`;
      runtime.userTeamOverride = false;
      runtime.attempts = 0;
      await exclusive("规划缺失图鉴", async () => {
        if (readSave().adv.chapter !== next.chapter) await switchChapter(next.chapter);
        const targetSave = readSave();
        const plan = next.special
          ? recommendRoamingTeam(targetSave, next.speciesId)
          : recommendTeam(targetSave, [next.speciesId], { levelWeight: COLLECTION_LEVEL_WEIGHT });
        await applyRecommendedTeam(plan, species(next.speciesId)?.n || String(next.speciesId));
      });
      return;
    }

    if (save.adv.chapter !== runtime.targetPlan.chapter) {
      const previousRegion = currentRegion(save);
      await exclusive("返回目标章节", async () => {
        await switchChapter(runtime.targetPlan.chapter);
        const targetSave = readSave();
        if (currentRegion(targetSave) !== previousRegion) {
          const plan = runtime.targetPlan.special
            ? recommendRoamingTeam(targetSave, runtime.targetPlan.speciesId)
            : recommendTeam(targetSave, [runtime.targetPlan.speciesId], { levelWeight: COLLECTION_LEVEL_WEIGHT });
          await applyRecommendedTeam(plan, species(runtime.targetPlan.speciesId)?.n || String(runtime.targetPlan.speciesId));
        }
      });
      return;
    }

    if (runtime.targetPlan.special) {
      if (Number(save.adv.zone?.id) === Number(runtime.targetPlan.speciesId)) return;
      await exclusive("进入特殊捕获地点", () => enterSpecialZone(runtime.targetPlan));
      return;
    }

    const timeline = timelinePlanStatus(save, runtime.targetPlan);
    if (timeline.lastWild < 0) {
      await exclusive("本轮没有有效野生节点", () => resetChapter(runtime.targetPlan));
      return;
    }
    if (timeline.current > timeline.lastWild || (timeline.current < 0 && save.adv.node > timeline.lastWild)) {
      runtime.attempts += timeline.wild.length;
      await exclusive("有效节点已刷完", () => resetChapter(runtime.targetPlan));
    }
  }

  function berryUseCandidates(save, now = Number(save.lastTick) || Date.now()) {
    const choices = [];
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
      const activeOnCurrentSide = active?.until > now && !(active.side === "from" && save.link?.side === "to");
      if (activeOnCurrentSide) continue;
      options.sort((a, b) => Number(b.key === "golden-razz-berry") - Number(a.key === "golden-razz-berry"));
      const choice = options.find(({ key, config }) => Number(save.items?.[key] || 0) > Number(config.reserve || 0));
      if (choice) choices.push({ ...choice, family });
    }
    return choices;
  }

  async function manageBerries(save) {
    if (Date.now() - runtime.lastBerryCheckAt < 5_000) return;
    runtime.lastBerryCheckAt = Date.now();
    for (const choice of berryUseCandidates(save)) {
      const button = document.querySelector(`#bag-panel .bag-cell[data-k="${choice.key}"]`);
      if (!button) {
        log(`${language() === "en" ? "Enabled" : "已启用"}${language() === "en" ? ` ${berryLabel(choice.info)}, but its page button is unavailable` : `${berryLabel(choice.info)}，但页面没有对应按钮`}`, "error");
        continue;
      }
      if (button.disabled || button.getAttribute("aria-disabled") === "true") continue;
      const countBefore = Number(save.items?.[choice.key] || 0);
      await pacedClick(button, berryLabel(choice.info));
      await waitFor(() => {
        const current = readSave();
        const buff = activeBuffAt(current, choice.family);
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
      if (save.adv?.event?.raid) {
        runtime.dailyRaidActiveRegion = save.adv.event.reg || null;
        renderStatus();
        return;
      }
      if (!settings.prioritizeDailyRaid) runtime.dailyRaidActiveRegion = null;
      if (!runtime.paused && !runtime.error && runtime.mode !== "idle" && await prioritizeDailyRaid(save)) {
        renderStatus();
        return;
      }
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
    runtime.collectionQueue = [];
    runtime.collectionQueueSignature = "";
    runtime.waitingPlan = null;
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
    runtime.collectionQueue = [];
    runtime.collectionQueueSignature = "";
    runtime.waitingPlan = null;
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
    await openScreen("team");
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
    const raw = String(token || "").trim().replace(/^#/, "").replace(/^NO\.?/i, "");
    if (/^\d+$/.test(raw)) return Number(raw);
    const normalized = raw.toUpperCase().replace(/[\s_-]+/g, "");
    const entry = Object.entries(DATA.species).find(([, meta]) => (
      String(meta.d || "").toUpperCase().replace(/[\s_-]+/g, "") === normalized
      || String(meta.n || "").toUpperCase().replace(/[\s_-]+/g, "") === normalized
    ));
    return entry ? Number(entry[0]) : null;
  }

  function manualTargetsInputValue() {
    return settings.manualTargets.map(speciesDisplayNumber).join(",");
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
      const labels = [`#${speciesDisplayNumber(id)} ${meta.n}`];
      let state = t("available");
      let className = "valid";
      if (ROAMING_LEGENDARIES.includes(id)) {
        state = t("managedRoamer");
        className = "warn";
      } else if (save && isCaught(save, id)) {
        state = t("caughtSkip");
        className = "warn";
      } else if (save) {
        const special = specialTargetStatus(save, id);
        if (special) {
          state = `${t("specialLocation")}：${special.special.zone} · ${special.open ? t("available") : special.reason}`;
          className = special.open ? "valid" : "warn";
        } else if (!plansForSpecies(save, id).length) {
          if (potentialWildTarget(save, id)) {
            const waiting = nextConditionalPlan(save, 168, [id]);
            state = waiting
              ? `${t("waitingCondition")}：${waiting.chapterName} · ${new Date(waiting.availableAt).toLocaleString()}`
              : t("waitingCondition");
          } else if (potentialWildTarget(save, id, { includeStoryLocked: true })) {
            const locked = storyLockedChapterForSpecies(save, id);
            state = `${t("storyLocked")}：${locked?.name || "—"}`;
          } else {
            state = t("noWildPlace");
          }
          className = "warn";
        } else if (meta.g || meta.m) {
          state = t("legendaryWild");
        }
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

  function getCandidatePoolDraft() {
    if (!candidatePoolDraft) {
      const saved = normalizeCandidatePool(settings.candidatePool);
      candidatePoolDraft = { ...saved, uids: [...saved.uids], query: "", onlyEligible: true };
    }
    return candidatePoolDraft;
  }

  function candidatePoolRows(save, draft = getCandidatePoolDraft()) {
    const query = String(draft.query || "").normalize("NFKC").toLocaleLowerCase();
    const selected = new Set(draft.uids.map(String));
    return (save.mons || [])
      .filter((mon) => mon?.uid && species(mon.id) && mon.level > 0)
      .map((mon) => ({
        mon,
        uid: String(mon.uid),
        name: species(mon.id).n,
        number: speciesDisplayNumber(mon.id),
        power: combinedStatValue(mon),
        note: combinedStatNote(mon),
        eligible: isMonAvailableInCurrentRegion(save, mon),
        checked: selected.has(String(mon.uid)),
      }))
      .filter((row) => row.power + 1e-9 >= draft.minPower
        && (!draft.onlyEligible || row.eligible)
        && (!query || `${row.name} ${row.number} ${row.mon.id}`.normalize("NFKC").toLocaleLowerCase().includes(query)))
      .sort((a, b) => b.power - a.power || b.mon.level - a.mon.level || a.mon.id - b.mon.id);
  }

  function renderCandidatePool() {
    const list = document.querySelector("#pca-training-list");
    const summary = document.querySelector("#pca-training-summary");
    const active = document.querySelector("#pca-training-active");
    if (!list || !summary || !active) return;
    let save;
    try {
      save = readSave();
    } catch {
      list.innerHTML = `<div class="pca-note">${escapeHtml(t("trainingNoSave"))}</div>`;
      summary.textContent = "";
      active.textContent = t("trainingDisabled");
      return;
    }
    const draft = getCandidatePoolDraft();
    const rows = candidatePoolRows(save, draft);
    list.innerHTML = rows.length ? rows.map((row) => `<label class="pca-training-mon${row.eligible ? "" : " unavailable"}"><input type="checkbox" data-candidate-uid="${escapeHtml(row.uid)}" ${row.checked ? "checked" : ""}><span><b>${row.mon.shiny ? "★ " : ""}${escapeHtml(row.name)}</b><small>#${escapeHtml(row.number)} · Lv.${row.mon.level} · ${language() === "en" ? "combined" : "综合能力"} ${row.power}<br>${escapeHtml(row.note)}${row.eligible ? "" : `<br>${language() === "en" ? "Unavailable in current region" : "当前地区不可出战"}`}</small></span></label>`).join("") : `<div class="pca-note">${language() === "en" ? "No members match these filters." : "没有符合当前筛选条件的宝可梦。"}</div>`;
    const selected = draft.uids.length;
    const preferred = preferredTeamCandidates(save, { ...draft, enabled: true });
    const eligible = preferred.length;
    const distinct = new Set(preferred.map(teamIdentity)).size;
    summary.textContent = language() === "en"
      ? `${rows.length} shown · ${selected} selected · ${eligible} currently eligible (${distinct} distinct)${draft.enabled && distinct < 6 ? " · remaining slots are filled from other usable Pokemon" : ""}`
      : `显示${rows.length}只 · 已选${selected}只 · 当前合格${eligible}只（${distinct}种）${draft.enabled && distinct < 6 ? " · 其余位置从其他可出战宝可梦补足" : ""}`;
    const saved = normalizeCandidatePool(settings.candidatePool);
    active.textContent = saved.enabled
      ? (language() === "en" ? `Active: prefer ${saved.uids.length} checked individuals with combined stat value ≥ ${saved.minPower}.` : `当前生效：优先使用已保存的${saved.uids.length}只个体，综合能力值 ≥ ${saved.minPower}。`)
      : t("trainingDisabled");
  }

  function candidatePoolSelectionAction(action) {
    const save = readSave();
    const draft = getCandidatePoolDraft();
    if (action === "training-reset") {
      const saved = normalizeCandidatePool(settings.candidatePool);
      candidatePoolDraft = { ...saved, uids: [...saved.uids], query: "", onlyEligible: true };
    } else if (action === "training-clear") draft.uids = [];
    else if (action === "training-visible") draft.uids = [...new Set([...draft.uids, ...candidatePoolRows(save, draft).map((row) => row.uid)])];
    else if (action === "training-team") draft.uids = [...new Set([...draft.uids, ...(save.team || []).map(String)])];
    renderCandidatePool();
  }

  function saveCandidatePool() {
    if (runtime.busy) {
      log(language() === "en" ? "Wait for the current team operation before saving the candidate pool." : "正在配队，请等待当前操作结束后再保存候选池");
      return false;
    }
    settings.candidatePool = normalizeCandidatePool(getCandidatePoolDraft());
    candidatePoolDraft = { ...settings.candidatePool, uids: [...settings.candidatePool.uids], query: "", onlyEligible: true };
    saveSettings();
    runtime.teamPlan = null;
    runtime.userTeamOverride = false;
    runtime.failureTeams.clear();
    runtime.deathSeries.clear();
    log(settings.candidatePool.enabled
      ? (language() === "en" ? `Saved ${settings.candidatePool.uids.length} training candidates.` : `已保存培养候选池：${settings.candidatePool.uids.length}只个体`)
      : (language() === "en" ? "Candidate pool disabled." : "已关闭培养候选池限制"));
    renderCandidatePool();
    return true;
  }

  function renderPanel() {
    document.getElementById(PANEL_ID)?.remove();
    document.getElementById(`${PANEL_ID}-style`)?.remove();
    const style = document.createElement("style");
    style.id = `${PANEL_ID}-style`;
    style.textContent = `
      .topbar .tb-sep.pca-host{display:flex;align-items:center;justify-content:center;min-width:0}
      #${PANEL_ID}{width:min(100%,620px);min-width:0;color:#eef2ff;font:13px/1.45 system-ui,-apple-system,"PingFang SC",sans-serif}
      #${PANEL_ID} *{box-sizing:border-box}#${PANEL_ID} button,#${PANEL_ID} select,#${PANEL_ID} input{font:inherit}
      .pca-native-bar{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(0,1fr) auto auto;align-items:center;gap:8px;width:100%;height:44px;padding:0 10px;border:2px solid var(--line,#343b56);border-radius:var(--r-md,12px);background:var(--panel-2,#20253a);color:var(--text,#eef2ff);cursor:pointer;transition:border-color .15s,background .15s}.pca-native-bar:hover{border-color:var(--line-hover,#536080);background:var(--panel-3,#2b3350)}.pca-native-brand{font-weight:700;white-space:nowrap}.pca-native-item{min-width:0;color:var(--muted,#8fa0c6);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pca-native-item b{color:var(--text,#eef2ff);margin-left:4px}.pca-native-open{color:var(--muted,#8fa0c6);font-size:12px;white-space:nowrap}
      .pca-modal{display:none;position:fixed;inset:0;z-index:2147483646;align-items:flex-start;justify-content:center;padding:var(--pca-dock-top,12px) 24px 12px}.pca-modal-shade{position:absolute;inset:0;border:0;background:#050711b8;cursor:default}.pca-dialog{position:relative;width:min(620px,calc(100vw - 32px));max-height:min(calc(100vh - var(--pca-dock-top,12px) - 12px),760px);display:flex;flex-direction:column;background:#151827;border:1px solid #46506c;border-radius:14px;box-shadow:0 20px 60px #000b;overflow:hidden}#${PANEL_ID}:not(.collapsed) .pca-modal{display:flex}
      #${PANEL_ID}.floating .pca-modal{pointer-events:none;padding:0}#${PANEL_ID}.floating .pca-modal-shade{display:none}#${PANEL_ID}.floating .pca-dialog{position:fixed;pointer-events:auto;resize:both;min-width:min(360px,calc(100vw - 24px));min-height:min(240px,calc(100vh - 24px));max-width:calc(100vw - 24px);max-height:calc(100vh - 24px)}#${PANEL_ID}.floating .pca-head{cursor:move;touch-action:none}
      .pca-head{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#20253a;border-bottom:1px solid #343b56;user-select:none}.pca-head b{flex:1}.pca-head button{cursor:pointer}.pca-ver{color:#8ea0ca;font-size:11px}
      .pca-body{overflow:auto;min-height:0}.pca-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 12px;padding:8px 12px;background:#181d2d;border-bottom:1px solid #343b56}.pca-summary span{color:#8fa0c6;min-width:0}.pca-summary b{color:#eef2ff;margin-left:5px}.pca-summary-main{display:contents}.pca-summary-extra{display:contents}
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
      .pca-queue-title{margin-top:10px!important}
      .pca-task-grid{display:grid;grid-template-columns:1fr;gap:7px}.pca-task-btn{width:100%;min-height:36px}.pca-controls .pca-btn{flex:1}
      .pca-region-list{flex-wrap:wrap}
      #${PANEL_ID}.training-open .pca-dialog{width:min(780px,calc(100vw - 32px))}.pca-training-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:5px;max-height:38vh;overflow:auto;margin:8px 0}.pca-training-mon{display:flex;align-items:flex-start;gap:6px;padding:7px;background:#111827;border:1px solid #3a4560;border-radius:8px;cursor:pointer}.pca-training-mon:has(input:checked){border-color:#75a2ff;background:#243556}.pca-training-mon.unavailable{opacity:.65}.pca-training-mon small{display:block;color:#a4b3d1;font-size:11px;margin-top:3px}.pca-training-min{width:82px}
      @media(max-width:900px){.pca-native-brand{display:none}.pca-native-bar{grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto auto}}
      @media(max-width:640px){.topbar .tb-sep.pca-host{flex:0 1 auto}.pca-native-bar{grid-template-columns:minmax(0,1fr) auto;max-width:210px}.pca-native-target,.pca-native-progress{display:none}.pca-native-open{font-size:0}.pca-native-open:after{content:"⚙";font-size:16px}.pca-modal{padding:var(--pca-dock-top,10px) 10px 10px}.pca-dialog,#${PANEL_ID}.training-open .pca-dialog{width:calc(100vw - 20px);max-height:calc(100vh - var(--pca-dock-top,10px) - 10px)}}
    `;
    document.head.append(style);

    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.className = `${settings.collapsed ? "collapsed" : ""}${settings.floating ? " floating" : ""}${settings.activeTab === "training" ? " training-open" : ""}`;
    panel.innerHTML = `
      <button type="button" class="pca-native-bar" data-act="collapse" aria-expanded="${!settings.collapsed}" aria-label="${t("expand")}"><span class="pca-native-brand">PokéCatch</span><span class="pca-native-item">${t("task")}<b data-status="mode">${t("idle")}</b></span><span class="pca-native-item pca-native-target">${t("target")}<b data-status="target">—</b></span><span class="pca-native-item pca-native-progress">${t("progress")}<b data-status="attempts">0</b></span><span class="pca-native-open">${t("expand")}</span></button>
      <div class="pca-modal"><button type="button" class="pca-modal-shade" data-act="collapse" aria-label="${t("collapse")}"></button><section class="pca-dialog" role="dialog" aria-modal="${!settings.floating}" aria-label="${t("assistant")}">
      <div class="pca-head"><b>${t("assistant")}</b><select class="pca-select pca-lang" data-select-setting="language" aria-label="Language"><option value="auto" ${settings.language === "auto" ? "selected" : ""}>${t("auto")}</option><option value="zh" ${settings.language === "zh" ? "selected" : ""}>中文</option><option value="en" ${settings.language === "en" ? "selected" : ""}>English</option></select><span class="pca-ver">v${VERSION}</span><button class="pca-btn" data-act="float">${settings.floating ? t("dockWindow") : t("floatWindow")}</button><button class="pca-btn" data-act="collapse">${t("collapse")}</button></div>
      ${statusSummaryHtml()}<div class="pca-body">
        <div class="pca-tabs" role="tablist" aria-label="${t("assistant")}">
          ${[["push",t("pushTab")],["collect",t("collectTab")],["training",t("trainingTab")],["team",t("teamTab")],["berries",t("berriesTab")],["diagnostics",t("diagnosticsTab")]].map(([key,label]) => `<button class="pca-tab ${settings.activeTab === key ? "active" : ""}" type="button" role="tab" aria-selected="${settings.activeTab === key}" data-tab="${key}">${label}</button>`).join("")}
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "push" ? "active" : ""}" role="tabpanel" data-tabpanel="push">
          <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="push">${t("startPush")}</button><button class="pca-btn pca-grow" data-act="pause">${t("pauseResume")}</button><button class="pca-btn danger" data-act="stop">${t("stop")}</button></div>
          <div class="pca-note">${t("pushNote")}</div>
          <div class="pca-card"><label class="pca-row"><input type="checkbox" data-setting="prioritizeDailyRaid" ${settings.prioritizeDailyRaid ? "checked" : ""}>${t("prioritizeDailyRaid")}</label>
            <div class="pca-note">${t("prioritizeDailyRaidNote")}</div></div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "collect" ? "active" : ""}" role="tabpanel" data-tabpanel="collect">
          <div class="pca-card"><h4>${t("selectCollection")}</h4>
            <div class="pca-task-grid"><button class="pca-btn primary pca-task-btn" data-act="collect">${t("dexCollection")}</button><button class="pca-btn primary pca-task-btn" data-act="roaming">${t("roamOnly")}</button><button class="pca-btn primary pca-task-btn" data-act="combined">${t("combined")}</button></div>
            <div class="pca-row pca-controls"><button class="pca-btn" data-act="pause">${t("pauseResume")}</button><button class="pca-btn danger" data-act="stop">${t("stop")}</button></div>
            <div class="pca-note">${t("collectionNote")}</div>
          </div>
          <div class="pca-card"><h4>${t("ordinaryTargets")}</h4>
            <div class="pca-row"><span>${t("region")}</span><select class="pca-select pca-grow" data-select-setting="regionScope"><option value="current" ${settings.regionScope === "current" ? "selected" : ""}>${t("currentRegion")}</option><option value="all" ${settings.regionScope === "all" ? "selected" : ""}>${t("allRegions")}</option><option value="custom" ${settings.regionScope === "custom" ? "selected" : ""}>${t("customRegions")}</option></select></div>
            <div class="pca-row pca-note">${[["kanto",t("kanto")],["johto",t("johto")],["hoenn",t("hoenn")],["sinnoh",t("sinnoh")],["unova",t("unova")]].map(([key,label])=>`<label><input type="checkbox" data-region="${key}" ${settings.customRegions.includes(key)?"checked":""}>${label}</label>`).join(" ")}</div>
            <div id="pca-scope-summary" class="pca-note"></div>
            <label class="pca-row"><input type="checkbox" data-setting="autoPushForCollection" ${settings.autoPushForCollection ? "checked" : ""}>${t("autoPushCollection")}</label>
            <div class="pca-note">${t("autoPushCollectionNote")}</div>
            <div class="pca-row"><input class="pca-select pca-grow" id="pca-manual-targets" value="${manualTargetsInputValue()}" placeholder="${t("manualPlaceholder")}"><button class="pca-btn" data-act="targets">${t("apply")}</button></div>
            <div id="pca-manual-target-preview" class="pca-targets pca-note">${manualTargetPreviewHtml(manualTargetsInputValue())}</div>
            <div class="pca-note">${t("targetNote")}</div>
            <h4 class="pca-queue-title">${t("collectionQueue")}</h4>
            <div id="pca-collection-queue" class="pca-targets"><div class="pca-note">${t("queueEmpty")}</div></div>
          </div>
          <div class="pca-card"><h4>${t("roamers")}</h4>
            <div class="pca-note">${t("roamerNote")}</div>
            <div id="pca-roaming-priority">${roamingPriorityHtml()}</div>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "training" ? "active" : ""}" role="tabpanel" data-tabpanel="training">
          <div class="pca-card"><h4>${t("trainingTitle")}</h4>
            <label class="pca-row"><input id="pca-training-enable" type="checkbox" ${getCandidatePoolDraft().enabled ? "checked" : ""}>${t("trainingEnable")}</label>
            <div class="pca-row"><label for="pca-training-min">${t("trainingPower")}</label><input id="pca-training-min" class="pca-select pca-training-min" type="number" min="0" max="2000" step="1" value="${getCandidatePoolDraft().minPower}"></div>
            <div class="pca-note">${t("trainingPowerHelp")}</div>
            <input id="pca-training-search" class="pca-select" style="width:100%;margin-top:7px" placeholder="${t("trainingSearch")}" value="${escapeHtml(getCandidatePoolDraft().query)}">
            <label class="pca-row"><input id="pca-training-eligible" type="checkbox" ${getCandidatePoolDraft().onlyEligible ? "checked" : ""}>${t("trainingEligible")}</label>
            <div class="pca-row pca-region-list"><button class="pca-btn" data-act="training-visible">${t("trainingSelectVisible")}</button><button class="pca-btn" data-act="training-team">${t("trainingSelectTeam")}</button><button class="pca-btn" data-act="training-clear">${t("trainingClear")}</button><button class="pca-btn" data-act="training-refresh">${t("trainingRefresh")}</button></div>
            <div id="pca-training-list" class="pca-training-list"></div><div id="pca-training-summary" class="pca-note"></div>
            <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="training-save">${t("trainingSave")}</button><button class="pca-btn" data-act="training-reset">${t("trainingReset")}</button></div>
          </div><div id="pca-training-active" class="pca-note"></div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "team" ? "active" : ""}" role="tabpanel" data-tabpanel="team">
          <div class="pca-card"><h4>${t("teamCopy")}</h4>
          <label class="pca-row"><input type="checkbox" data-setting="lockTeam5" ${settings.lockTeam5 ? "checked" : ""}>${t("lockTeam")}</label>
          <div class="pca-row"><select class="pca-select pca-grow" id="pca-copy-from">${[0,1,2,3,4].map((i)=>`<option value="${i}">${t("team")} ${i+1}</option>`).join("")}</select><span>→</span><select class="pca-select pca-grow" id="pca-copy-to">${[0,1,2,3,4].map((i)=>`<option value="${i}" ${i===4?"selected":""}>${t("team")} ${i+1}</option>`).join("")}</select><button class="pca-btn" data-act="copy">${t("copy")}</button></div>
          <button class="pca-btn" data-act="reteam">${t("regenerate")}</button>
          </div>
          <div class="pca-card"><h4>${t("duplicateKeepTitle")}</h4>
          <div class="pca-note">${t("duplicateKeepRegions")}</div>
          <div class="pca-row pca-note pca-region-list">${[["kanto",t("kanto")],["johto",t("johto")],["hoenn",t("hoenn")],["sinnoh",t("sinnoh")],["unova",t("unova")]].map(([key,label])=>`<label><input type="checkbox" data-duplicate-region="${key}" ${settings.duplicateKeepRegions.includes(key)?"checked":""}>${label}</label>`).join(" ")}</div>
          <div class="pca-row pca-controls"><button class="pca-btn" data-act="dup-on">${t("enableDuplicateKeeps")}</button><button class="pca-btn" data-act="dup-off">${t("disableDuplicateKeeps")}</button><button class="pca-btn danger" data-act="dup-cancel">${t("cancelDuplicateKeeps")}</button></div>
          <div id="pca-duplicate-keep-status" class="pca-note">${t("duplicateKeepIdle")}</div><div class="pca-note">${t("duplicateKeepNote")}</div>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "berries" ? "active" : ""}" role="tabpanel" data-tabpanel="berries">
          <div class="pca-card"><h4>${t("berryTitle")}</h4><div class="pca-berries">
          ${Object.entries(BERRIES).map(([key, info]) => `<label class="pca-berry"><input type="checkbox" data-berry="${key}" ${settings.berries[key]?.enabled ? "checked" : ""}><span>${berryLabel(info)}<small class="pca-note" style="display:block">${t("stock")} <b data-berry-stock="${key}">—</b></small></span></label><input type="number" min="0" title="${t("reserve")}" data-reserve="${key}" value="${settings.berries[key]?.reserve || 0}">`).join("")}
          </div><div class="pca-note">${t("berryNote")}</div></div>
          <div class="pca-card"><h4>${t("pensionBerryTitle")}</h4>${Object.entries(PENSION_BERRIES).map(([key, info]) => `<div class="pca-row"><span class="pca-grow">${escapeHtml(pensionBerryLabel(info))}<small class="pca-note" style="display:block">${escapeHtml(pensionBerryEffect(info))}</small></span><span>${t("stock")} <b data-berry-stock="${key}">—</b></span></div>`).join("")}<button class="pca-btn" data-act="pension-berries">${t("pensionBerryButton")}</button><div class="pca-note">${t("pensionBerryNote")}</div></div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "diagnostics" ? "active" : ""}" role="tabpanel" data-tabpanel="diagnostics">
          <div class="pca-card"><h4>${t("notifications")}</h4><label class="pca-row"><input type="checkbox" data-setting="soundNotifications" ${settings.soundNotifications ? "checked" : ""}>${t("sound")}</label><label class="pca-row"><input type="checkbox" data-setting="desktopNotifications" ${settings.desktopNotifications ? "checked" : ""}>${t("desktop")}</label></div>
          <div class="pca-card"><h4>${t("diagnostic")}</h4><div id="pca-error" class="pca-note">${t("noError")}</div><div class="pca-row"><button class="pca-btn" data-act="copydiag">${t("copyDiagnostic")}</button></div></div>
          <div class="pca-card"><h4>${t("logs")}</h4><div id="pca-log" class="pca-log"></div></div>
        </div>
      </div></section></div>`;
    const host = document.querySelector(".topbar .tb-sep");
    if (!host) {
      setTimeout(renderPanel, 250);
      return;
    }
    host.classList.add("pca-host");
    host.append(panel);
    applyDockPosition(panel);
    applyFloatPosition(panel);
    enableFloatDragging(panel);
    observeFloatSize(panel);

    panel.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-tab]")?.dataset.tab;
      if (tab) {
        selectPanelTab(panel, tab);
        if (tab === "training") renderCandidatePool();
        return;
      }
      const action = event.target.closest("[data-act]")?.dataset.act;
      if (!action) return;
      if (action === "collapse") {
        settings.collapsed = !settings.collapsed;
        saveSettings();
        panel.classList.toggle("collapsed", settings.collapsed);
        panel.querySelector(".pca-native-bar")?.setAttribute("aria-expanded", String(!settings.collapsed));
        if (!settings.collapsed) requestAnimationFrame(() => settings.floating ? applyFloatPosition(panel) : applyDockPosition(panel));
      } else if (action === "float") {
        const dialog = panel.querySelector(".pca-dialog");
        if (!settings.floating && dialog) {
          const rect = dialog.getBoundingClientRect();
          settings.floatPosition = { left: Math.round(rect.left), top: Math.round(rect.top) };
          settings.floatSize = { width: Math.round(rect.width), height: Math.round(rect.height) };
        }
        settings.floating = !settings.floating;
        saveSettings();
        panel.classList.toggle("floating", settings.floating);
        dialog?.setAttribute("aria-modal", String(!settings.floating));
        event.target.textContent = settings.floating ? t("dockWindow") : t("floatWindow");
        if (!settings.floating) applyDockPosition(panel);
        applyFloatPosition(panel);
      } else if (action === "push") startMode("push");
      else if (action === "collect") startMode("collect");
      else if (action === "roaming") startMode("roaming");
      else if (action === "combined") startMode("combined");
      else if (action === "pause") pauseMode();
      else if (action === "stop") stopMode();
      else if (action === "copy") copyTeam();
      else if (action === "reteam") regenerateTeam();
      else if (action === "pension-berries") exclusive(language() === "en" ? "Open Day Care" : "打开培育屋", () => openScreen("pension"));
      else if (action === "training-save") saveCandidatePool();
      else if (["training-reset", "training-clear", "training-visible", "training-team"].includes(action)) candidatePoolSelectionAction(action);
      else if (action === "training-refresh") renderCandidatePool();
      else if (action === "dup-on") bulkSetDuplicateKeeps(true);
      else if (action === "dup-off") bulkSetDuplicateKeeps(false);
      else if (action === "dup-cancel" && runtime.duplicateKeep?.active) runtime.duplicateKeep.cancelled = true;
      else if (action === "targets") applyManualTargets();
      else if (action === "roam-up") moveRoamingPriority(Number(event.target.closest("[data-roamer]")?.dataset.roamer), -1);
      else if (action === "roam-down") moveRoamingPriority(Number(event.target.closest("[data-roamer]")?.dataset.roamer), 1);
      else if (action === "copydiag") navigator.clipboard.writeText(JSON.stringify(runtime.error || { status: t("noError"), build: gameBuild() }, null, 2));
    });

    panel.addEventListener("input", (event) => {
      if (event.target.id === "pca-manual-targets") renderManualTargetPreview(event.target.value);
      if (event.target.id === "pca-training-search") {
        getCandidatePoolDraft().query = event.target.value;
        renderCandidatePool();
      }
      if (event.target.id === "pca-training-min") {
        getCandidatePoolDraft().minPower = Math.max(0, Math.min(2_000, Math.trunc(Number(event.target.value) || 0)));
        renderCandidatePool();
      }
    });

    panel.addEventListener("change", (event) => {
      if (event.target.id === "pca-training-enable") {
        getCandidatePoolDraft().enabled = event.target.checked;
        renderCandidatePool();
      }
      if (event.target.id === "pca-training-eligible") {
        getCandidatePoolDraft().onlyEligible = event.target.checked;
        renderCandidatePool();
      }
      const candidateUid = event.target.dataset.candidateUid;
      if (candidateUid) {
        const draft = getCandidatePoolDraft();
        draft.uids = event.target.checked
          ? [...new Set([...draft.uids, candidateUid])]
          : draft.uids.filter((uid) => uid !== candidateUid);
        renderCandidatePool();
      }
      const setting = event.target.dataset.setting;
      if (setting) {
        settings[setting] = event.target.checked;
        if (setting === "autoPushForCollection") {
          runtime.collectionQueueSignature = "";
          if (!settings.autoPushForCollection && runtime.targetPlan?.unlockForCollection) {
            runtime.target = null;
            runtime.targetPlan = null;
            runtime.teamPlan = null;
          }
        }
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
        runtime.collectionQueueSignature = "";
        saveSettings();
      }
      const region = event.target.dataset.region;
      if (region) {
        settings.customRegions = event.target.checked
          ? [...new Set([...settings.customRegions, region])]
          : settings.customRegions.filter((item) => item !== region);
        runtime.collectionQueueSignature = "";
        saveSettings();
      }
      const duplicateRegion = event.target.dataset.duplicateRegion;
      if (duplicateRegion) {
        settings.duplicateKeepRegions = event.target.checked
          ? [...new Set([...settings.duplicateKeepRegions, duplicateRegion])]
          : settings.duplicateKeepRegions.filter((item) => item !== duplicateRegion);
        saveSettings();
      }
    });
    renderStatus();
    renderLog();
    if (settings.activeTab === "training") renderCandidatePool();
    if (!runtime.floatResizeBound) {
      window.addEventListener("resize", () => {
        const current = document.getElementById(PANEL_ID);
        if (!current) return;
        if (current.classList.contains("floating")) applyFloatPosition(current);
        else applyDockPosition(current);
      });
      runtime.floatResizeBound = true;
    }
  }

  function statusSummaryHtml() {
    return `<div class="pca-summary" aria-label="${t("statusTitle")}"><div class="pca-summary-main"><span>${t("task")}<b data-status="mode">${t("idle")}</b></span><span>${t("target")}<b data-status="target">—</b></span><span>${t("progress")}<b data-status="attempts">0</b></span></div><div class="pca-summary-extra"><span>${t("place")}<b data-status="place">—</b></span><span>${t("buffs")}<b data-status="buffs">—</b></span><span>${t("fifthTeam")}<b data-status="team" class="pca-team">${t("notGenerated")}</b></span></div></div>`;
  }

  function selectPanelTab(panel, tab) {
    const allowed = new Set(["push", "collect", "training", "team", "berries", "diagnostics"]);
    if (!allowed.has(tab)) return;
    settings.activeTab = tab;
    saveSettings();
    panel.classList.toggle("training-open", tab === "training");
    panel.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    panel.querySelectorAll("[data-tabpanel]").forEach((tabpanel) => tabpanel.classList.toggle("active", tabpanel.dataset.tabpanel === tab));
    if (settings.floating) requestAnimationFrame(() => applyFloatPosition(panel));
  }

  function applyDockPosition(panel) {
    if (settings.floating) return;
    const topbar = document.querySelector(".topbar");
    const nativeBar = panel.querySelector(".pca-native-bar");
    const anchorBottom = Math.max(
      topbar?.getBoundingClientRect().bottom || 0,
      nativeBar?.getBoundingClientRect().bottom || 0,
    );
    const top = Math.max(8, Math.min(Math.round(anchorBottom + 8), window.innerHeight - 120));
    panel.style.setProperty("--pca-dock-top", `${top}px`);
  }

  function applyFloatPosition(panel) {
    const dialog = panel.querySelector(".pca-dialog");
    if (!dialog) return;
    if (!settings.floating) {
      dialog.style.left = "";
      dialog.style.top = "";
      dialog.style.width = "";
      dialog.style.height = "";
      return;
    }
    const initialRect = dialog.getBoundingClientRect();
    const minWidth = Math.min(360, window.innerWidth - 24);
    const minHeight = Math.min(240, window.innerHeight - 24);
    const width = Math.max(minWidth, Math.min(Number(settings.floatSize?.width) || initialRect.width || (settings.activeTab === "training" ? 780 : 620), window.innerWidth - 24));
    const height = Math.max(minHeight, Math.min(Number(settings.floatSize?.height) || initialRect.height || 760, window.innerHeight - 24));
    dialog.style.width = `${Math.round(width)}px`;
    dialog.style.height = `${Math.round(height)}px`;
    const requested = settings.floatPosition || { left: window.innerWidth - width - 14, top: 14 };
    const left = Math.max(0, Math.min(Number(requested.left) || 0, window.innerWidth - width));
    const top = Math.max(0, Math.min(Number(requested.top) || 0, window.innerHeight - height));
    dialog.style.left = `${Math.round(left)}px`;
    dialog.style.top = `${Math.round(top)}px`;
    settings.floatPosition = { left: Math.round(left), top: Math.round(top) };
    settings.floatSize = { width: Math.round(width), height: Math.round(height) };
    saveSettings();
  }

  function observeFloatSize(panel) {
    runtime.floatSizeObserver?.disconnect();
    const dialog = panel.querySelector(".pca-dialog");
    if (!dialog || typeof ResizeObserver !== "function") return;
    runtime.floatSizeObserver = new ResizeObserver(() => {
      if (!settings.floating || settings.collapsed) return;
      const rect = dialog.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width <= 0 || height <= 0) return;
      settings.floatSize = { width, height };
      settings.floatPosition = {
        left: Math.round(Math.max(0, Math.min(rect.left, window.innerWidth - width))),
        top: Math.round(Math.max(0, Math.min(rect.top, window.innerHeight - height))),
      };
      dialog.style.left = `${settings.floatPosition.left}px`;
      dialog.style.top = `${settings.floatPosition.top}px`;
      saveSettings();
    });
    runtime.floatSizeObserver.observe(dialog);
  }

  function enableFloatDragging(panel) {
    const handle = panel.querySelector(".pca-head");
    const dialog = panel.querySelector(".pca-dialog");
    if (!handle || !dialog) return;
    let drag = null;
    handle.addEventListener("pointerdown", (event) => {
      if (!settings.floating || event.button !== 0 || event.target.closest("button,select,input")) return;
      const rect = dialog.getBoundingClientRect();
      drag = { pointerId: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const left = Math.max(0, Math.min(event.clientX - drag.dx, window.innerWidth - dialog.offsetWidth));
      const top = Math.max(0, Math.min(event.clientY - drag.dy, window.innerHeight - dialog.offsetHeight));
      dialog.style.left = `${Math.round(left)}px`;
      dialog.style.top = `${Math.round(top)}px`;
    });
    const finish = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag = null;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      const rect = dialog.getBoundingClientRect();
      settings.floatPosition = { left: Math.round(rect.left), top: Math.round(rect.top) };
      saveSettings();
    };
    handle.addEventListener("pointerup", finish);
    handle.addEventListener("pointercancel", finish);
  }

  async function regenerateTeam() {
    if (!runtime.targetPlan) return alert("当前没有目标");
    runtime.userTeamOverride = false;
    const save = readSave();
    const storyTarget = runtime.target?.startsWith("push:") || runtime.target?.startsWith("unlock:");
    const enemyIds = storyTarget
      ? targetEnemyIdsForChapter(save.adv.chapter)
      : [runtime.targetPlan.speciesId].filter(Boolean);
    const levelWeight = storyTarget ? DEFAULT_LEVEL_WEIGHT : COLLECTION_LEVEL_WEIGHT;
    const plan = runtime.targetPlan.roaming || runtime.targetPlan.special
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
      .filter((id) => collectionPlansForSpecies(save, id).length || potentialWildTarget(save, id, { includeStoryLocked: true }));
    settings.manualTargets = [...new Set(ids)];
    if (input) input.value = manualTargetsInputValue();
    saveSettings();
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.collectionQueueSignature = "";
    renderManualTargetPreview();
    log(settings.manualTargets.length ? `手动优先目标：${settings.manualTargets.map((id) => species(id).n).join("、")}` : "已恢复自动缺失图鉴排序");
  }

  function renderCollectionQueue() {
    const root = document.querySelector("#pca-collection-queue");
    if (!root) return;
    const automatic = runtime.collectionQueue
      .filter((plan) => !settings.manualTargets.includes(plan.speciesId))
      .slice(0, COLLECTION_QUEUE_LIMIT);
    if (!automatic.length) {
      const waiting = runtime.waitingPlan;
      root.innerHTML = waiting
        ? `<div class="pca-target warn"><span>${escapeHtml(t("waitingCondition"))}</span><small>${escapeHtml(`${species(waiting.speciesId)?.n || waiting.speciesId} · ${new Date(waiting.availableAt).toLocaleString()}`)}</small></div>`
        : `<div class="pca-note">${escapeHtml(t("queueEmpty"))}</div>`;
      return;
    }
    root.innerHTML = automatic.map((plan, index) => {
      const condition = [plan.phase, plan.weather].filter(Boolean).join(" / ");
      const region = chapter(plan.chapter)?.region;
      const state = `${region ? `${t(region)} · ` : ""}${plan.chapterName} · ${plan.zone}${condition ? ` · ${condition}` : ""}`;
      const active = runtime.targetPlan?.speciesId === plan.speciesId ? " valid" : "";
      return `<div class="pca-target${active}"><span>${index + 1}. #${escapeHtml(speciesDisplayNumber(plan.speciesId))} ${escapeHtml(species(plan.speciesId)?.n || plan.speciesId)}</span><small>${escapeHtml(state)}</small></div>`;
    }).join("");
  }

  function renderCollectionScope(save) {
    const root = document.querySelector("#pca-scope-summary");
    if (!root || !save) return;
    const regions = collectionScopeRegions(save).map((region) => t(region));
    root.textContent = `${t("region")}：${regions.join(language() === "en" ? ", " : "、") || (language() === "en" ? "None selected" : "未选择地区")}`;
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
    const raidEvent = save?.adv?.event?.raid ? save.adv.event : null;
    const targetName = runtime.dailyRaidActiveRegion || raidEvent
      ? `${t("dailyRaid")}${raidEvent?.id ? ` · ${species(raidEvent.id)?.n || raidEvent.id}` : ""}`
      : runtime.target === "roam:waiting"
        ? t("waitingRoamers")
        : runtime.targetPlan?.moneyFarm ? t("moneyFarm")
        : runtime.targetPlan?.speciesId ? species(runtime.targetPlan.speciesId)?.n : runtime.targetPlan?.chapterName;
    panel.querySelectorAll('[data-status="target"]').forEach((node) => { node.textContent = targetName || "—"; });
    panel.querySelectorAll('[data-status="place"]').forEach((node) => {
      node.textContent = runtime.dailyRaidActiveRegion || raidEvent
        ? `${t("dailyRaid")} · ${t(runtime.dailyRaidActiveRegion || raidEvent?.reg)}`
        : `${chapter(save?.adv?.chapter)?.name || "—"}${runtime.targetPlan?.zone ? ` / ${runtime.targetPlan.zone}` : ""}`;
    });
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
    panel.querySelectorAll("[data-berry-stock]").forEach((node) => { node.textContent = String(save?.items?.[node.dataset.berryStock] || 0); });
    panel.querySelector("#pca-error").textContent = runtime.error ? `${runtime.error.phase}: ${runtime.error.observed}\n${t("suggestion")}: ${runtime.error.suggestion}` : `${t("noError")} · ${t("game")} ${gameBuild()} · ${t("data")} ${DATA.appBuild}`;
    renderRoamingPriority();
    renderCollectionScope(save);
    renderCollectionQueue();
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
    const timeline = document.querySelector("#timeline");
    if (timeline) {
      let queued = false;
      runtime.timelineObserver = new MutationObserver(() => {
        if (queued || runtime.busy || runtime.paused || !["collect", "combined"].includes(runtime.mode)) return;
        queued = true;
        queueMicrotask(() => {
          queued = false;
          tick();
        });
      });
      runtime.timelineObserver.observe(timeline, { subtree: true, attributes: true, attributeFilter: ["class"] });
    }
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
