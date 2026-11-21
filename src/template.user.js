// ==UserScript==
// @name         PokeCatch Assistant / 全图鉴与推图助手
// @namespace    local.pokecatch.assistant
// @version      0.17.0
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
  const VERSION = "0.17.0";
  const PROJECT_URL = "https://github.com/stdAri/pokecatch-assistant";
  const ISSUES_URL = `${PROJECT_URL}/issues/new`;
  const COMPATIBLE_APP_BUILDS = new Set([DATA.appBuild, "7acad22262", "021c85dbba", "6e45170313"]);
  const ROAMING_GROUPS = DATA.roamingGroups;
  const ROAMING_LEGENDARIES = ROAMING_GROUPS.flatMap(({ ids }) => ids);
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
      selectCollection: "选择收集任务", dexCollection: "普通图鉴收集", roamOnly: "神兽收集", combined: "普通 + 神兽协同",
      collectionNote: "三个入口互相独立：神兽收集只处理神兽。协同模式优先追踪已出现的徘徊神兽，再按手填顺序或固定地点收集。",
      ordinaryTargets: "普通野外目标", region: "地区", currentRegion: "当前地区", allRegions: "所有已解锁地区", customRegions: "自定义地区",
      autoPushCollection: "为全收集自动推图",
      autoPushCollectionNote: "当前没有可抓目标、但仍有目标被剧情锁定时，推进到下一次解锁后立即重新扫描；不会连续快速推图。",
      manualPlaceholder: "手动优先编号，如 214,201-H,493-A", apply: "应用",
      targetNote: "只会加入尚未捕获、且在所选范围内存在获取地点的目标；剧情未解锁时可由全收集推图逐步解锁，按填写顺序优先。",
      collectionQueue: "当前待抓队列", queueEmpty: "当前没有可立即捕获的自动目标", waitingCondition: "等待条件", moneyFarm: "刷钱等待天气",
      storyLocked: "剧情尚未解锁",
      roamers: "徘徊神兽", fixedLegendaryHeading: "固定地点与其他传说／幻兽", roamerNote: "收集遵循上方地区范围。实时徘徊目标优先，未出现时挑战满足条件的固定地点。",
      teamCopy: "阵容与队伍复制", lockTeam: "锁定第五队，不自动覆盖", team: "队伍", copy: "复制", regenerate: "重新生成当前目标阵容",
      autoBuddyTitle: "自动伙伴练级", autoBuddy: "自动选择并轮换伙伴宝可梦",
      autoBuddyScope: "伙伴候选范围", autoBuddyScopeAll: "队伍内外全部", autoBuddyScopeTeam: "仅队伍内", autoBuddyScopeBox: "仅队伍外（电脑中）",
      autoBuddyNote: "从所选范围中选择综合能力最高、且未达到该地区徽章等级上限的宝可梦；达到上限或100级后自动选择下一只。战斗和事件进行中不会切换。",
      buddyNone: "当前没有伙伴", buddyComplete: "所选范围内的宝可梦均已达到等级上限",
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
      projectLinks: "项目与反馈", author: "作者", githubProject: "查看 GitHub", reportIssue: "反馈问题", issueNote: "遇到问题时，建议先复制上方诊断信息，再到 GitHub 提交 Issue。",
      debugMode: "战斗调试模式", debugModeNote: "默认关闭。开启后按一次完整章节挑战记录配队决策、节点、敌我状态、伤害与结果；只存于浏览器 IndexedDB，不写入游戏存档。", debugLimit: "最多保留", debugRuns: "最近挑战", debugExport: "导出 JSON", debugClear: "清空记录", debugEmpty: "暂无调试记录", debugEnabled: "调试记录已开启", debugDisabled: "调试记录已关闭",
      statusTitle: "当前任务状态", task: "任务", target: "目标", place: "位置", attempts: "尝试", buffs: "增益", fifthTeam: "第五队", idle: "空闲", notGenerated: "未生成",
      notAppeared: "未出现", caught: "已捕获", appearing: "出现中", minutes: "分", moveUp: "上移", moveDown: "下移",
      targetPrompt: "输入编号或名称后，这里会显示对应的宝可梦。", unknownPokemon: "无对应宝可梦", available: "可加入",
      specialLocation: "特殊地点", specialRegionLocked: "地区尚未解锁", specialOutsideScope: "不在所选地区范围", specialConditionLocked: "特殊条件尚未满足",
      managedRoamer: "徘徊神兽，由下方优先级管理", caughtSkip: "已捕获，不会加入", noWildPlace: "当前范围没有可用野外地点", legendaryWild: "神兽/幻兽 · 可作为野外目标",
      kanto: "关都", johto: "城都", hoenn: "丰缘", sinnoh: "神奥", unova: "合众",
      waitingRoamers: "等待神兽出现或固定地点解锁", paused: "暂停", working: "操作中", cumulative: "累计", suggestion: "建议", game: "游戏", data: "数据",
    },
    en: {
      assistant: "PokéCatch Assistant", auto: "Follow game", expand: "Open assistant", collapse: "Close", floatWindow: "Float window", dockWindow: "Dock to top", progress: "Progress",
      pushTab: "Story", collectTab: "Collect", trainingTab: "Training", teamTab: "Team", berriesTab: "Berries", diagnosticsTab: "Diagnostics",
      startPush: "Start story", pauseResume: "Pause / Resume", stop: "Stop",
      pushNote: "Continue from the current region's story frontier; roaming legendaries are not tracked in Story mode.",
      prioritizeDailyRaid: "Prioritize the daily raid",
      prioritizeDailyRaidNote: "Before any automatic task, optimize the raid's two-Pokemon team with the game's own control, choose the first available option for each ally slot, and complete the daily Shiny raid. Team 5 is never changed.",
      dailyRaid: "Daily raid", raidTeamMissing: "Configure two Pokemon on the Raids page first", raidAlliesMissing: "Choose two allies on the Raids page first",
      selectCollection: "Choose a collection task", dexCollection: "Pokédex collection", roamOnly: "Legendary collection", combined: "Pokédex + legendaries",
      collectionNote: "Legendary collection focuses on Legendary Pokémon. Combined prioritizes active roamers, then manual targets and fixed locations.",
      ordinaryTargets: "Ordinary wild targets", region: "Region", currentRegion: "Current region", allRegions: "All unlocked regions", customRegions: "Custom regions",
      autoPushCollection: "Advance story for Pokédex completion",
      autoPushCollectionNote: "When no target is catchable but story-locked targets remain, advance only to the next unlock and rescan immediately.",
      manualPlaceholder: "Priority numbers, e.g. 214,201-H,493-A", apply: "Apply",
      targetNote: "Only uncaught targets with a location in scope are added. Story-locked locations can be unlocked by collection story advancement.",
      collectionQueue: "Current catch queue", queueEmpty: "No automatic target is immediately available", waitingCondition: "Waiting for conditions", moneyFarm: "Farming money while waiting for weather",
      storyLocked: "Story not yet unlocked",
      roamers: "Roaming legendaries", fixedLegendaryHeading: "Fixed locations and other Legendary or Mythical Pokémon", roamerNote: "Uses the selected regions. Active roamers take priority, then available fixed encounters.",
      teamCopy: "Team recommendation and copy", lockTeam: "Lock Team 5; never overwrite it", team: "Team", copy: "Copy", regenerate: "Regenerate team for current target",
      autoBuddyTitle: "Automatic Buddy training", autoBuddy: "Automatically choose and rotate the Buddy",
      autoBuddyScope: "Buddy candidate range", autoBuddyScopeAll: "Team and PC", autoBuddyScopeTeam: "Team only", autoBuddyScopeBox: "PC only (outside team)",
      autoBuddyNote: "Chooses the highest combined-stat Pokemon in the selected range that is below its regional badge level cap, then rotates at the cap or level 100. It never switches during battles or events.",
      buddyNone: "No Buddy selected", buddyComplete: "Every Pokemon in the selected range is at its level cap",
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
      projectLinks: "Project & feedback", author: "Author", githubProject: "View GitHub", reportIssue: "Report an issue", issueNote: "When reporting a problem, copy the diagnostics above first and include them in the GitHub issue.",
      debugMode: "Battle debug mode", debugModeNote: "Off by default. Records team decisions, nodes, combat state, damage and outcomes for one complete chapter attempt. Data stays in browser IndexedDB and never enters the game save.", debugLimit: "Keep at most", debugRuns: "Recent attempts", debugExport: "Export JSON", debugClear: "Clear records", debugEmpty: "No debug records yet", debugEnabled: "Debug recording enabled", debugDisabled: "Debug recording disabled",
      statusTitle: "Current task", task: "Mode", target: "Target", place: "Location", attempts: "Attempts", buffs: "Buffs", fifthTeam: "Team 5", idle: "Idle", notGenerated: "Not generated",
      notAppeared: "Not active", caught: "Caught", appearing: "Active", minutes: "min", moveUp: "Move up", moveDown: "Move down",
      targetPrompt: "Enter a Pokédex number or name to preview the target.", unknownPokemon: "No matching Pokémon", available: "Available",
      specialLocation: "Special location", specialRegionLocked: "Region not unlocked", specialOutsideScope: "Outside selected regions", specialConditionLocked: "Special condition not met",
      managedRoamer: "Roaming legendary; managed by the priority list below", caughtSkip: "Already caught; will not be added", noWildPlace: "No available wild location in the current scope", legendaryWild: "Legendary/Mythical · available as a wild target",
      kanto: "Kanto", johto: "Johto", hoenn: "Hoenn", sinnoh: "Sinnoh", unova: "Unova",
      waitingRoamers: "Waiting for active roamers or open Legendary locations", paused: "Paused", working: "Working", cumulative: "Cumulative", suggestion: "Suggestion", game: "Game", data: "Data",
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
    autoBuddy: false,
    buddyScope: "all",
    prioritizeDailyRaid: true,
    candidatePool: { enabled: false, minPower: 500, uids: [] },
    desktopNotifications: false,
    soundNotifications: true,
    debugBattle: false,
    debugLimit: 20,
    regionScope: "current",
    customRegions: ["kanto", "johto"],
    autoPushForCollection: true,
    duplicateKeepRegions: ["kanto", "johto", "hoenn", "sinnoh", "unova"],
    manualTargets: [],
    roamingPriority: [...ROAMING_LEGENDARIES],
    berries: Object.fromEntries(Object.keys(BERRIES).map((key) => [key, { enabled: false, reserve: 0 }])),
  };

  const runtime = {
    manualFixedTeam: null,
    fixedAutoEditor: null,
    independentRun: null,
    independentBlocks: new Map(),
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
    lastBuddyCheckAt: 0,
    buddyStatus: "",
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
    specialEntryBlocks: new Map(),
    specialFight: null,
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
    debugRun: null,
    debugRecent: [],
    debugObserver: null,
    debugFlushTimer: null,
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
      if (!["all", "team", "box"].includes(loaded.buddyScope)) loaded.buddyScope = "all";
      if (![20, 50, 100].includes(Number(loaded.debugLimit))) loaded.debugLimit = 20;
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
    const verified = COMPATIBLE_APP_BUILDS.has(build);
    return {
      ok: missing.length === 0,
      verified,
      build,
      expected: [...COMPATIBLE_APP_BUILDS].join(", "),
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

  async function pacedClick(element, label, pacing, allowed = () => true) {
    if (!element) throw new Error(`找不到${label}`);
    let clicked = false;
    await pacedAction(() => {
      if (!allowed()) return;
      element.click();
      clicked = true;
    }, pacing);
    return clicked;
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

  const DEBUG_DB_NAME = "pokecatch-assistant-debug";
  const DEBUG_STORE = "chapter-runs";
  let debugDbPromise = null;

  function debugDb() {
    if (!debugDbPromise) {
      debugDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DEBUG_DB_NAME, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(DEBUG_STORE)) {
            const store = db.createObjectStore(DEBUG_STORE, { keyPath: "id" });
            store.createIndex("startedAt", "startedAt");
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("IndexedDB unavailable"));
      });
    }
    return debugDbPromise;
  }

  function debugRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB request failed"));
    });
  }

  async function readDebugRuns() {
    const db = await debugDb();
    const tx = db.transaction(DEBUG_STORE, "readonly");
    const rows = await debugRequest(tx.objectStore(DEBUG_STORE).getAll());
    return rows.sort((a, b) => b.startedAt - a.startedAt);
  }

  async function trimDebugRuns() {
    const rows = await readDebugRuns();
    const stale = rows.slice(Number(settings.debugLimit) || 20);
    if (!stale.length) return;
    const db = await debugDb();
    const tx = db.transaction(DEBUG_STORE, "readwrite");
    for (const row of stale) tx.objectStore(DEBUG_STORE).delete(row.id);
  }

  async function persistDebugRun(run = runtime.debugRun) {
    if (!run) return;
    const db = await debugDb();
    const tx = db.transaction(DEBUG_STORE, "readwrite");
    tx.objectStore(DEBUG_STORE).put(structuredClone(run));
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("IndexedDB write failed"));
      tx.onabort = () => reject(tx.error || new Error("IndexedDB write aborted"));
    });
    await trimDebugRuns();
    await refreshDebugRecent();
  }

  function scheduleDebugFlush() {
    clearTimeout(runtime.debugFlushTimer);
    runtime.debugFlushTimer = setTimeout(() => {
      runtime.debugFlushTimer = null;
      persistDebugRun().catch((error) => log(`调试记录保存失败：${error.message}`, "error"));
    }, 400);
  }

  function debugTeamSnapshot(save) {
    return (save.teamSets?.list?.[4] || save.team || []).map((uid) => {
      const mon = save.mons.find((candidate) => candidate.uid === uid);
      return mon && { uid: String(mon.uid), id: Number(mon.id), level: Number(mon.level), shiny: !!mon.shiny, rank: Number(mon.rank || 0) };
    }).filter(Boolean);
  }

  function debugBattleSnapshot(save) {
    const battle = save.adv?.battle;
    const brief = (entry) => entry && ({
      id: Number(entry.id ?? entry.species ?? entry),
      level: Number(entry.level ?? entry.lv ?? 0) || null,
      hp: Number(entry.hp ?? entry.curHp ?? entry.currentHp ?? 0) || null,
      maxHp: Number(entry.maxHp ?? entry.max ?? 0) || null,
      status: entry.status || null,
    });
    return {
      at: Date.now(),
      chapter: Number(save.adv.chapter),
      node: Number(save.adv.node || 0),
      deaths: Number(save.adv.deaths || 0),
      kind: battle?.kind || battle?.type || null,
      enemies: [...(battle?.enemies || []), ...(battle?.foes || [])].map(brief).filter(Boolean),
      allies: (battle?.allies || battle?.team || []).map(brief).filter(Boolean),
      log: document.querySelector("#battle-log")?.textContent?.trim().slice(0, 300) || "",
    };
  }

  function appendDebugEvent(type, data = {}) {
    if (!settings.debugBattle || !runtime.debugRun) return;
    runtime.debugRun.events.push({ at: Date.now(), type, ...data });
    if (runtime.debugRun.events.length > 5_000) runtime.debugRun.events.splice(0, runtime.debugRun.events.length - 5_000);
    scheduleDebugFlush();
  }

  function startDebugRun(save, reason = "start") {
    const item = chapter(save.adv.chapter);
    runtime.debugRun = {
      id: `${Date.now()}-${save.adv.chapter}-${Math.random().toString(36).slice(2, 8)}`,
      startedAt: Date.now(),
      endedAt: null,
      chapter: Number(save.adv.chapter),
      chapterName: item?.name || String(save.adv.chapter),
      gameBuild: gameBuild(),
      dataBuild: DATA.appBuild,
      reason,
      result: "running",
      startNode: Number(save.adv.node || 0),
      lastNode: Number(save.adv.node || 0),
      startDeaths: Number(save.adv.deaths || 0),
      lastDeaths: Number(save.adv.deaths || 0),
      badgesAtStart: [...(save.adv.badges || [])],
      team: debugTeamSnapshot(save),
      decisions: [],
      events: [{ at: Date.now(), type: "challenge-start", reason, state: debugBattleSnapshot(save) }],
    };
    scheduleDebugFlush();
  }

  async function finishDebugRun(result, extra = {}) {
    const run = runtime.debugRun;
    if (!run) return;
    clearTimeout(runtime.debugFlushTimer);
    runtime.debugFlushTimer = null;
    run.endedAt = Date.now();
    run.result = result;
    run.events.push({ at: Date.now(), type: "challenge-end", result, ...extra });
    runtime.debugRun = null;
    await persistDebugRun(run);
  }

  async function captureDebugState(save) {
    if (!settings.debugBattle) {
      if (runtime.debugRun) await finishDebugRun("debug-disabled");
      return;
    }
    if (!runtime.debugRun) startDebugRun(save);
    const run = runtime.debugRun;
    if (Number(save.adv.chapter) !== run.chapter) {
      await finishDebugRun("chapter-changed", { nextChapter: Number(save.adv.chapter) });
      startDebugRun(save, "chapter-changed");
      return;
    }
    const node = Number(save.adv.node || 0);
    const deaths = Number(save.adv.deaths || 0);
    const badge = chapter(run.chapter)?.boss?.badge;
    if (badge && !run.badgesAtStart.includes(badge) && save.adv.badges?.includes(badge)) {
      await finishDebugRun("badge-earned", { badge, state: debugBattleSnapshot(save) });
      return;
    }
    if (node < run.lastNode || deaths > run.lastDeaths) {
      await finishDebugRun(deaths > run.lastDeaths ? "team-defeated" : "chapter-restarted", { state: debugBattleSnapshot(save) });
      startDebugRun(save, "retry");
      return;
    }
    const snapshot = debugBattleSnapshot(save);
    const signature = JSON.stringify([snapshot.node, snapshot.kind, snapshot.enemies, snapshot.allies, snapshot.log]);
    if (signature !== run.lastSnapshot) {
      run.events.push({ at: Date.now(), type: "state", state: snapshot });
      run.lastSnapshot = signature;
      scheduleDebugFlush();
    }
    run.lastNode = node;
    run.lastDeaths = deaths;
  }

  function recordDebugDecision(plan, save, context) {
    if (!settings.debugBattle || !runtime.debugRun || !plan) return;
    runtime.debugRun.decisions.push({
      at: Date.now(),
      context,
      team: plan.details,
      signature: plan.signature,
      simulation: plan.simulation ? {
        clear: plan.simulation.clear,
        reachedLeader: plan.simulation.reachedLeader,
        completed: plan.simulation.completed,
        total: plan.simulation.total,
        remainingHp: plan.simulation.remainingHp,
        failedAt: plan.simulation.failedAt,
      } : null,
      chapter: Number(save?.adv?.chapter),
    });
    scheduleDebugFlush();
  }

  async function refreshDebugRecent() {
    try {
      runtime.debugRecent = (await readDebugRuns()).slice(0, 5).map((run) => ({ id: run.id, chapterName: run.chapterName, startedAt: run.startedAt, result: run.result }));
    } catch {
      runtime.debugRecent = [];
    }
    const root = document.querySelector("#pca-debug-runs");
    if (root) root.innerHTML = runtime.debugRecent.length
      ? runtime.debugRecent.map((run) => `<div>${new Date(run.startedAt).toLocaleString()} · ${escapeHtml(run.chapterName)} · ${escapeHtml(run.result)}</div>`).join("")
      : t("debugEmpty");
  }

  async function exportDebugRuns() {
    const rows = await readDebugRuns();
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), version: VERSION, runs: rows }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), { href: url, download: `pokecatch-debug-${new Date().toISOString().replace(/[:.]/g, "-")}.json` });
    link.dispatchEvent(new MouseEvent("click"));
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  async function clearDebugRuns() {
    const db = await debugDb();
    const tx = db.transaction(DEBUG_STORE, "readwrite");
    tx.objectStore(DEBUG_STORE).clear();
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("IndexedDB clear failed"));
      tx.onabort = () => reject(tx.error || new Error("IndexedDB clear aborted"));
    });
    runtime.debugRecent = [];
    await refreshDebugRecent();
  }

  function observeDebugBattle() {
    runtime.debugObserver?.disconnect();
    const arena = document.querySelector("#arena");
    if (!arena) return;
    runtime.debugObserver = new MutationObserver((mutations) => {
      if (!settings.debugBattle || !runtime.debugRun) return;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes || []) {
          if (node.nodeType !== 1) continue;
          const damageNodes = node.matches?.(".dmg") ? [node] : [...(node.querySelectorAll?.(".dmg") || [])];
          for (const damage of damageNodes) appendDebugEvent("damage", { text: damage.textContent?.trim().slice(0, 40) || "", className: damage.className });
        }
        if (mutation.target?.closest?.("#battle-log")) appendDebugEvent("battle-log", { text: document.querySelector("#battle-log")?.textContent?.trim().slice(0, 300) || "" });
      }
    });
    runtime.debugObserver.observe(arena, { subtree: true, childList: true, characterData: true });
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

  function buddyLevelCap(save, mon) {
    const maxLevel = DATA.battle?.maxLevel ?? 100;
    const region = save?.link ? pokemonHomeRegion(mon) : "kanto";
    const nextGym = DATA.chapters.find((item) => (
      item.region === region
      && item.index >= Number(save?.adv?.unlocked || 0)
      && item.gym
      && !(item.champion && item.boss?.badge && save?.adv?.badges?.includes(item.boss.badge))
    ));
    return Math.min(maxLevel, Number(nextGym?.levelCap || DATA.battle?.leagueDoneCap || maxLevel));
  }

  function buddyTrainingCandidates(save, scope = settings.buddyScope) {
    const teamUids = new Set((save?.team || []).map(String));
    return availableTeamCandidates(save)
      .filter((mon) => scope === "all" || (scope === "team") === teamUids.has(String(mon.uid)))
      .map((mon) => ({ mon, cap: buddyLevelCap(save, mon), power: combinedStatValue(mon) }))
      .filter(({ mon, cap }) => mon.level < cap && mon.level < (DATA.battle?.maxLevel ?? 100))
      .sort((a, b) => (
        b.power - a.power
        || Number(String(b.mon.uid) === String(save?.buddy?.uid)) - Number(String(a.mon.uid) === String(save?.buddy?.uid))
        || b.mon.level - a.mon.level
        || String(a.mon.uid).localeCompare(String(b.mon.uid))
      ));
  }

  function bestBuddyCandidate(save, scope = settings.buddyScope) {
    return buddyTrainingCandidates(save, scope)[0] || null;
  }

  function buddyStatusText(save) {
    const current = (save?.mons || []).find((mon) => String(mon.uid) === String(save?.buddy?.uid));
    if (!current) return t("buddyNone");
    const cap = buddyLevelCap(save, current);
    return `${species(current.id)?.n || current.id} · Lv.${current.level}/${cap} · ${language() === "en" ? "combined" : "综合能力"} ${combinedStatValue(current)}`;
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

  function learnedMoves(meta, level, damagingOnly = true) {
    return (meta?.l || [])
      .filter(([learnLevel, key]) => learnLevel <= level && DATA.moves[key] && (!damagingOnly || DATA.moves[key][1] > 0))
      .map(([, key]) => ({ key, type: DATA.moves[key][0], power: DATA.moves[key][1], accuracy: DATA.moves[key][2], category: DATA.moves[key][3] }));
  }

  function battleStats(mon, speciesId = mon.id, level = mon.level) {
    const meta = species(speciesId);
    if (!meta) return null;
    const normalizedLevel = Math.max(1, Number(level) || 1);
    const multiplier = combinedStatMultiplier(mon);
    const stat = (index) => Math.floor((Math.floor(2 * meta.s[index] * normalizedLevel / 100) + 5) * multiplier);
    const baseHp = Math.floor((Math.floor(2 * meta.s[0] * normalizedLevel / 100) + normalizedLevel + 10) * multiplier);
    const hpScale = Math.min(DATA.battle?.hpLevelMax ?? 2.5, 1 + (DATA.battle?.hpLevelScale ?? 1.5) * normalizedLevel / 100);
    return {
      hp: Math.floor(baseHp * hpScale * (DATA.battle?.hpBoost ?? 1.1)),
      atk: stat(1),
      def: stat(2),
      spa: stat(3),
      spd: stat(4),
      spe: stat(5),
    };
  }

  function effectiveAccuracy(accuracy) {
    const chance = Math.max(0, Math.min(1, Number(accuracy || 100) / 100));
    return chance >= 1 ? 1 : 1 / (2 - chance);
  }

  function deterministicDamage(attacker, defender, move, options) {
    const enemy = Boolean(options?.enemy);
    const attackMeta = species(attacker.id);
    const defenderMeta = species(defender.id);
    const attackStats = battleStats(attacker);
    const defenderStats = battleStats(defender);
    if (!attackMeta || !defenderMeta || !attackStats || !defenderStats || move.power <= 0) return 0;
    const physical = DATA.moves[move.key]?.[3] === "phys";
    const attackPenalty = physical && attacker.status === "burn" || !physical && attacker.status === "poison" ? 0.75 : 1;
    const defensePenalty = physical && defender.status === "sleep" || !physical && defender.status === "freeze" ? 0.75 : 1;
    const attack = (physical ? attackStats.atk : attackStats.spa) * attackPenalty;
    const defense = Math.max(1, (physical ? defenderStats.def : defenderStats.spd) * defensePenalty);
    const stab = attackMeta.t.includes(move.type) ? 1.5 : 1;
    const effectiveness = typeEffect(move.type, defenderMeta.t);
    if (effectiveness === 0) return 0;
    const base = (2 * attacker.level / 5 + 2) * move.power * attack / defense / 50 + 2;
    const levelGap = (DATA.battle?.levelGap ?? 1.06) ** (attacker.level - defender.level);
    const roll = DATA.battle?.damageRoll ?? 0.85;
    const enemyMultiplier = Number(options?.damageMultiplier)
      || (enemy ? (DATA.battle?.gymDamage ?? 1.3) : 1);
    return Math.max(1, Math.floor(base * stab * effectiveness * levelGap * roll * enemyMultiplier))
      * effectiveAccuracy(move.accuracy);
  }

  function bestDamageMove(attacker, defender, options) {
    return learnedMoves(species(attacker.id), attacker.level)
      .map((move) => ({ move, damage: deterministicDamage(attacker, defender, move, options) }))
      .sort((a, b) => b.damage - a.damage || b.move.accuracy - a.move.accuracy || b.move.power - a.move.power)[0]
      || { move: null, damage: 1 };
  }

  function evolutionAvailable(save, option, targetLevel) {
    if (option.level != null) return targetLevel >= option.level;
    if (option.item) return Number(save?.items?.[option.item] || 0) > 0;
    return false;
  }

  function projectedSpeciesId(save, mon, targetLevel) {
    let id = Number(mon.id);
    const visited = new Set([id]);
    for (let depth = 0; depth < 4; depth += 1) {
      const options = (DATA.evolutions?.[id] || [])
        .filter((option) => evolutionAvailable(save, option, targetLevel))
        .filter((option) => species(option.to) && !visited.has(Number(option.to)))
        .sort((a, b) => baseStatTotal(b.to) - baseStatTotal(a.to));
      if (!options.length) break;
      id = Number(options[0].to);
      visited.add(id);
    }
    return id;
  }

  function enemyProfiles(enemyTargets, fallbackLevel = 1) {
    return enemyTargets.map((target) => {
      const id = Number(typeof target === "object" ? target.id : target);
      const meta = species(id);
      if (!meta) return null;
      return {
        id,
        level: Math.max(1, Number(typeof target === "object" ? target.level : fallbackLevel) || fallbackLevel),
        meta,
      };
    }).filter(Boolean);
  }

  function duelEstimate(mon, enemy) {
    const foe = { id: enemy.id, level: enemy.level, shiny: false, rank: 0 };
    const allyStats = battleStats(mon);
    const enemyStats = battleStats(foe);
    const outgoing = bestDamageMove(mon, foe).damage;
    const incoming = bestDamageMove(foe, mon, { enemy: true }).damage;
    const turnsToWin = Math.ceil(enemyStats.hp / Math.max(1, outgoing));
    const turnsToLose = Math.ceil(allyStats.hp / Math.max(1, incoming));
    const movesFirst = allyStats.spe >= enemyStats.spe;
    const clears = turnsToWin < turnsToLose || (turnsToWin === turnsToLose && movesFirst);
    const tempo = turnsToLose - turnsToWin + (movesFirst ? 0.25 : 0);
    return { clears, tempo, turnsToWin, turnsToLose, outgoing, incoming };
  }

  function battleProfile(mon, enemies) {
    const duels = enemies.map((enemy) => duelEstimate(mon, enemy));
    if (!duels.length) return { score: 0, clears: 0, worstTempo: 0, duels: [] };
    const clears = duels.filter((duel) => duel.clears).length;
    const averageTempo = duels.reduce((sum, duel) => sum + duel.tempo, 0) / duels.length;
    const worstTempo = Math.min(...duels.map((duel) => duel.tempo));
    return { score: clears * 70 + averageTempo * 18 + worstTempo * 8, clears, worstTempo, duels };
  }

  function scaledBossTeam(chapterIndex) {
    const item = chapter(chapterIndex);
    const raw = item?.boss?.team || [];
    if (!raw.length) return [];
    const rawAce = Math.max(...raw.map(([, level]) => Number(level) || 1));
    const ace = Number(item.boss.ace ?? item.ace) + Number(item.boss.aceOffset || 0);
    return raw.map(([id, level]) => ({
      id: Number(id),
      level: ace > 0 ? Math.round(Number(level) * ace / rawAce) : Number(level),
    }));
  }

  function chapterGymTrainerCount(chapterIndex) {
    const item = chapter(chapterIndex);
    if (!item?.boss?.badge || item.boss.champion || item.league) return 0;
    const ordinal = DATA.chapters.filter((candidate) => (
      candidate.region === item.region && candidate.index <= chapterIndex && candidate.boss?.badge
    )).length;
    const counts = DATA.battle?.gymTrainers?.counts || [1, 2, 2, 3];
    return counts[Math.min(Math.max(ordinal, 1), counts.length) - 1] || 0;
  }

  function routeThreats(save, item, route) {
    const at = Number(save?.lastTick) || Date.now();
    const phase = currentDaytimePhase(save, item.index);
    const weather = currentWeatherForRoute(save, item, route, at, phase);
    const weights = routeWeights(route, phase, weather);
    const level = Math.max(1, Number(route.levelBand?.[1] || item.ace || 1));
    const explicit = (route.species || []).map((id) => Number(id)).filter((id) => species(id));
    const ids = explicit.length ? explicit.map((id) => projectEnemySpeciesId(id, level)) : Object.entries(weights)
      .filter(([id, weight]) => species(Number(id)) && Number(weight) > 0)
      .sort((a, b) => Number(b[1]) - Number(a[1]) || Number(a[0]) - Number(b[0]))
      .slice(0, 6)
      .map(([id]) => Number(id));
    const pool = ids.map((id) => ({ id, level }));
    if (pool.length) return pool;
    return scaledBossTeam(item.index).slice(0, 3).map((foe) => ({ ...foe, level: Math.min(foe.level, level) }));
  }

  function projectEnemySpeciesId(speciesId, level) {
    let id = Number(speciesId);
    const visited = new Set([id]);
    for (let depth = 0; depth < 4; depth += 1) {
      const options = (DATA.evolutions?.[id] || []).filter((option) => (
        option.level != null ? level >= option.level : level >= (DATA.battle?.trainerItemEvolutionLevel ?? 40)
      )).filter((option) => species(option.to) && !visited.has(Number(option.to)));
      if (!options.length) break;
      id = Number(options.sort((a, b) => baseStatTotal(b.to) - baseStatTotal(a.to))[0].to);
      visited.add(id);
    }
    return id;
  }

  function scaledFixedTrainerTeam(item, step) {
    const raw = step.team || [];
    if (!raw.length) return [];
    if (!step.scale || !item.ace) return raw.map(([id, level]) => ({ id: Number(id), level: Number(level) }));
    const rawAce = Math.max(...raw.map(([, level]) => Number(level) || 1));
    const precedingRoute = [...(item.steps || [])].slice(0, step.stepIndex).reverse().find((candidate) => candidate.kind === "route");
    const routeLevel = Number(precedingRoute?.levelBand?.[1] || item.ace);
    const target = step.below == null ? routeLevel : Math.min(routeLevel, Number(item.ace) - Number(step.below));
    return raw.map(([id, level]) => ({ id: Number(id), level: Math.round(Number(level) * target / rawAce) }));
  }

  function savedChapterBattleSequence(save, chapterIndex) {
    if (Number(save?.adv?.chapter) !== Number(chapterIndex) || !Array.isArray(save?.adv?.nodes)) return [];
    const item = chapter(chapterIndex);
    const sequence = [];
    for (const [nodeIndex, node] of save.adv.nodes.entries()) {
      if (node?.type === "heal") {
        sequence.push({ kind: "heal", stepIndex: nodeIndex, name: node.name || "Heal" });
        continue;
      }
      if (node?.type === "wild" || node?.type === "static") {
        if (species(Number(node.id))) sequence.push({
          kind: node.type,
          stepIndex: nodeIndex,
          name: node.name,
          enemies: [{ id: Number(node.id), level: Math.max(1, Number(node.level) || Number(item?.ace) || 1) }],
          boss: node.type === "static" && !!(node.raid || node.zone),
          damageMultiplier: DATA.battle?.enemyDamage?.[node.type] ?? (node.type === "wild" ? 0.85 : 1),
        });
        continue;
      }
      if (node?.type === "trainer") {
        const explicit = (node.team || []).map((entry) => Array.isArray(entry) ? { id: Number(entry[0]), level: Number(entry[1]) } : null).filter((entry) => species(entry?.id));
        const pool = (node.pool || []).map((entry) => typeof entry === "object" ? entry : { id: entry, level: item?.ace }).filter((entry) => species(Number(entry?.id)));
        const size = Math.max(1, Number(node.size) || explicit.length || Math.min(3, pool.length) || 1);
        const enemies = explicit.length ? explicit : Array.from({ length: size }, (_, index) => {
          const source = pool[index % Math.max(1, pool.length)];
          const level = Math.max(1, Number(source?.level) || Number(item?.ace) || 1);
          return { id: projectEnemySpeciesId(Number(source?.id), level), level };
        }).filter((entry) => species(entry.id));
        if (enemies.length) sequence.push({
          kind: node.gymTrainer ? "gym-trainer" : "trainer",
          stepIndex: nodeIndex,
          name: node.name || node.trainer,
          enemies,
          slots: node.double || enemies.length === 2 ? 2 : 1,
          damageMultiplier: node.gymTrainer ? DATA.battle?.gymTrainers?.damage ?? 0.8 : DATA.battle?.enemyDamage?.trainer ?? 0.9,
        });
        continue;
      }
      if (node?.type === "gym") {
        const enemies = scaledBossTeam(chapterIndex);
        if (enemies.length) sequence.push({
          kind: "leader",
          stepIndex: nodeIndex,
          name: node.gym?.leader || item?.boss?.name || node.name,
          enemies,
          slots: node.gym?.double || item?.boss?.double ? 2 : 1,
          damageMultiplier: (DATA.battle?.gymDamage ?? 1.3) * Number(node.gym?.power || item?.boss?.power || 1),
          hpMultiplier: (DATA.battle?.gymHpMult ?? 1.3) * Number(node.gym?.power || item?.boss?.power || 1) * Math.max(1, 6 / enemies.length) ** (DATA.battle?.gymTeamExp ?? 0.7),
        });
      }
    }
    return sequence;
  }

  function chapterBattleSequence(save, chapterIndex) {
    const item = chapter(chapterIndex);
    if (!item) return [];
    const saved = savedChapterBattleSequence(save, chapterIndex);
    if (saved.length) return saved;
    const sequence = [];
    for (const step of item.steps || []) {
      if (step.kind === "heal") {
        sequence.push({ kind: "heal", stepIndex: step.stepIndex, name: step.name || "Heal" });
        continue;
      }
      if (step.kind === "route") {
        const threats = routeThreats(save, item, step);
        const wildCount = Number(step.wild || 0);
        const trainerCount = Number(step.trainers || 0);
        const total = wildCount + trainerCount;
        let wildIndex = 0;
        let trainerIndex = 0;
        for (let index = 0; index < total; index += 1) {
          const trainersDue = Math.floor((index + 1) * trainerCount / Math.max(1, total));
          const kind = trainerIndex < trainersDue ? "trainer" : "wild";
          const threatIndex = kind === "trainer" ? trainerIndex + 1 : wildIndex;
          if (threats.length) sequence.push({
            kind,
            stepIndex: step.stepIndex,
            name: step.name,
            enemies: Array.from({ length: kind === "trainer" ? 1 + trainerIndex % 3 : 1 }, (_, offset) => threats[(threatIndex + offset) % threats.length]),
            slots: kind === "trainer" && trainerIndex % 2 === 0 && 1 + trainerIndex % 3 >= 2 ? 2 : 1,
            damageMultiplier: DATA.battle?.enemyDamage?.[kind] ?? (kind === "trainer" ? 0.9 : 0.85),
          });
          if (kind === "trainer") trainerIndex += 1;
          else wildIndex += 1;
        }
        continue;
      }
      if (step.kind === "trainer") {
        const enemies = scaledFixedTrainerTeam(item, step);
        if (enemies.length) sequence.push({ kind: "trainer", stepIndex: step.stepIndex, name: step.name, enemies, slots: step.double ? 2 : 1, damageMultiplier: DATA.battle?.enemyDamage?.trainer ?? 0.9 });
        continue;
      }
      if (step.kind === "static" && step.id) {
        sequence.push({ kind: "static", stepIndex: step.stepIndex, name: step.name, enemies: [{ id: Number(step.id), level: Number(step.level || item.ace || 1) }], boss: true, damageMultiplier: DATA.battle?.enemyDamage?.static ?? 1, hpMultiplier: 1 + (DATA.battle?.enemyHpPerAlly ?? 0.7) * 5 });
        continue;
      }
      if (step.kind === "gym") {
        const leader = scaledBossTeam(chapterIndex);
        const below = DATA.battle?.gymTrainers?.below || [4, 2, 2];
        const count = chapterGymTrainerCount(chapterIndex);
        for (let index = 0; index < count; index += 1) {
          const source = leader[index % Math.max(1, leader.length)];
          if (source) sequence.push({ kind: "gym-trainer", stepIndex: step.stepIndex, name: step.name, enemies: [{ id: source.id, level: Math.max(1, Number(item.ace) - below[Math.min(index, below.length - 1)]) }], damageMultiplier: DATA.battle?.gymTrainers?.damage ?? 0.8 });
        }
        if (leader.length) {
          const power = Number(step.power || item.boss?.power || 1);
          sequence.push({
            kind: "leader",
            stepIndex: step.stepIndex,
            name: item.boss?.name || step.name,
            enemies: leader,
            slots: step.double || item.boss?.double ? 2 : 1,
            damageMultiplier: (DATA.battle?.gymDamage ?? 1.3) * power,
            hpMultiplier: (DATA.battle?.gymHpMult ?? 1.3) * power * Math.max(1, 6 / leader.length) ** (DATA.battle?.gymTeamExp ?? 0.7),
          });
        }
      }
    }
    return sequence;
  }

  function freshBattleUnit(mon, hpMultiplier = 1) {
    const stats = battleStats(mon);
    const maxHp = Math.max(1, Math.floor((stats?.hp || 1) * hpMultiplier));
    return { ...mon, maxHp, hp: maxHp, status: null, statusLeft: 0, confused: 0, proc: {}, active: false };
  }

  function battleMatchup(ally, enemy, damageMultiplier) {
    const outgoing = Math.max(1, bestDamageMove(ally, enemy).damage);
    const incoming = Math.max(1, bestDamageMove(enemy, ally, { damageMultiplier }).damage);
    const allyFirst = (battleStats(ally)?.spe || 0) >= (battleStats(enemy)?.spe || 0);
    return { outgoing, incoming, allyFirst };
  }

  function pickBattleAllies(allies, enemies, slots, damageMultiplier) {
    const livingEnemies = enemies.filter((enemy) => enemy.hp > 0);
    const ranked = allies.filter((ally) => ally.hp > 0).map((ally, index) => {
      const value = livingEnemies.reduce((sum, enemy) => {
        const matchup = battleMatchup(ally, enemy, damageMultiplier);
        return sum + matchup.outgoing / matchup.incoming + (matchup.allyFirst ? 0.01 : 0);
      }, 0) / Math.max(1, livingEnemies.length);
      return { ally, index, value };
    }).sort((a, b) => b.value - a.value || a.index - b.index);
    const selected = new Set(ranked.slice(0, slots).map((entry) => entry.ally));
    for (const ally of allies) {
      if (ally.active && !selected.has(ally)) ally.confused = 0;
      ally.active = selected.has(ally);
    }
    return ranked.slice(0, slots).map((entry) => entry.ally);
  }

  function statusEffectOf(move) {
    const row = DATA.statusMoves?.[move?.key];
    if (!row) return null;
    const guaranteed = new Set(["spore", "sacred-fire", "nuzzle", "zap-cannon", "inferno", "dynamic-punch"]);
    const cap = guaranteed.has(move.key) ? 100 : move.power > 0 ? 30 : 70;
    return { status: row[0] === "tri" ? "paralysis" : row[0], chance: Math.min(Number(row[1]) || 0, cap, Number(move.accuracy) || 100) / 100 };
  }

  function canInflictStatus(unit, status) {
    if (status === "confusion") return !unit.confused;
    if (unit.status) return false;
    const types = species(unit.id)?.t || [];
    return !(status === "burn" && types.includes("fire")
      || status === "poison" && (types.includes("poison") || types.includes("steel"))
      || status === "freeze" && types.includes("ice"));
  }

  function applyBattleStatus(unit, status) {
    if (!canInflictStatus(unit, status)) return false;
    if (status === "confusion") unit.confused = 5;
    else {
      unit.status = status;
      unit.statusLeft = status === "sleep" ? (unit.boss ? DATA.battle?.bossStatus?.lockMax || 2 : 3)
        : status === "freeze" ? (unit.boss ? DATA.battle?.bossStatus?.lockMax || 2 : Math.round(1 / (DATA.battle?.thawChance || 0.2)))
          : status === "paralysis" ? (DATA.battle?.statusFx?.paralysisTurns || 3)
            : (unit.boss ? DATA.battle?.bossStatus?.dotTurns || 4 : DATA.battle?.statusFx?.dotTurns || 5);
    }
    return true;
  }

  function procBattleStatus(attacker, defender, effect, key) {
    if (!effect || !canInflictStatus(defender, effect.status)) return false;
    const meterKey = `${key}:${effect.status}:${defender.uid || defender.id}`;
    attacker.proc[meterKey] = (attacker.proc[meterKey] || 0) + effect.chance;
    if (attacker.proc[meterKey] < 1) return false;
    attacker.proc[meterKey] -= 1;
    return applyBattleStatus(defender, effect.status);
  }

  function statusMoveAgainst(attacker, defender) {
    let selected = null;
    for (const move of learnedMoves(species(attacker.id), attacker.level, false)) {
      const effect = move.power <= 0 && statusEffectOf(move);
      if (effect && canInflictStatus(defender, effect.status) && typeEffect(move.type, species(defender.id)?.t) !== 0) selected = { move, effect };
    }
    return selected;
  }

  function battleSpeed(unit) {
    return (battleStats(unit)?.spe || 1) * (unit.status === "paralysis" ? 0.25 : 1);
  }

  function beforeBattleAction(unit) {
    if (unit.status === "sleep") {
      if (unit.statusLeft > 0) {
        unit.statusLeft -= 1;
        return { skip: true };
      }
      unit.status = null;
    } else if (unit.status === "freeze") {
      if (unit.statusLeft > 0) {
        unit.statusLeft -= 1;
        return { skip: true };
      }
      unit.status = null;
    } else if (unit.status === "paralysis") {
      unit.statusLeft -= 1;
      const paralysisChance = unit.boss ? DATA.battle?.bossStatus?.paralysisBlock || 0.2 : DATA.battle?.fullParalysisChance || 0.25;
      unit.paraCycle = ((unit.paraCycle || 0) + 1) % Math.max(1, Math.round(1 / paralysisChance));
      if (unit.paraCycle === 1) return { skip: true };
      if (unit.statusLeft <= 0) unit.status = null;
    }
    if (unit.confused > 0) {
      unit.confused -= 1;
      unit.confusionCycle = ((unit.confusionCycle || 0) + 1) % Math.max(1, Math.round(1 / (DATA.battle?.confusionSelfHitChance || 1 / 3)));
      if (unit.confusionCycle === 1) {
        const stats = battleStats(unit);
        const damage = Math.max(1, Math.floor((2 * unit.level / 5 + 2) * 40 * stats.atk / Math.max(1, stats.def) / 50 + 2));
        unit.hp = Math.max(0, unit.hp - damage);
        return { skip: true, selfDamage: damage };
      }
    }
    return { skip: false };
  }

  function afterBattleAction(unit) {
    if (unit.status !== "burn" && unit.status !== "poison") return 0;
    const damage = Math.max(1, Math.floor(unit.maxHp / (unit.boss ? DATA.battle?.bossStatus?.hurt || 60 : 8)));
    unit.hp = Math.max(0, unit.hp - damage);
    unit.statusLeft -= 1;
    if (unit.statusLeft <= 0 && unit.hp > 0) unit.status = null;
    return damage;
  }

  function chooseBattleTarget(attacker, targets, allySide) {
    if (!allySide) return targets[0] || null;
    return targets.map((target, index) => {
      const move = bestDamageMove(attacker, target);
      return { target, index, value: move.damage / Math.max(1, target.hp) };
    }).sort((a, b) => b.value - a.value || a.index - b.index)[0]?.target || null;
  }

  function performBattleAction(attacker, defender, allySide, damageMultiplier) {
    const statusMove = statusMoveAgainst(attacker, defender);
    if (statusMove) {
      attacker.statusChoice = (attacker.statusChoice || 0) + (DATA.battle?.statusMoveChance || 0.3);
      if (attacker.statusChoice >= 1) {
        attacker.statusChoice -= 1;
        procBattleStatus(attacker, defender, statusMove.effect, `status:${statusMove.move.key}`);
        return 0;
      }
    }
    const selected = bestDamageMove(attacker, defender, allySide ? null : { damageMultiplier });
    const damage = Math.max(1, Math.floor(selected.damage));
    defender.hp = Math.max(0, defender.hp - damage);
    if (defender.hp > 0) {
      if (defender.status === "freeze" && selected.move?.type === "fire") defender.status = null;
      procBattleStatus(attacker, defender, statusEffectOf(selected.move), `damage:${selected.move?.key}`);
    }
    return damage;
  }

  function simulateDeterministicBattle(allies, encounter) {
    const detail = { kind: encounter.kind, name: encounter.name, enemies: [], allyKos: [] };
    for (const ally of allies) Object.assign(ally, { confused: 0, active: false });
    const enemies = (encounter.enemies || []).map((enemySpec, index) => ({
      ...freshBattleUnit({ uid: `enemy-${index}`, id: enemySpec.id, level: enemySpec.level, shiny: false, rank: 0 }, encounter.hpMultiplier || 1),
      boss: !!encounter.boss,
    }));
    const slots = Math.max(1, Math.min(Number(encounter.slots) || 1, enemies.length, allies.length));
    let rounds = 0;
    while (enemies.some((enemy) => enemy.hp > 0) && allies.some((ally) => ally.hp > 0) && rounds < 200) {
      rounds += 1;
      const activeEnemies = enemies.filter((enemy) => enemy.hp > 0).slice(0, slots);
      const activeAllies = pickBattleAllies(allies, activeEnemies, slots, encounter.damageMultiplier || 1);
      const queue = [
        ...activeAllies.map((unit) => ({ unit, allySide: true })),
        ...activeEnemies.map((unit) => ({ unit, allySide: false })),
      ].sort((a, b) => battleSpeed(b.unit) - battleSpeed(a.unit) || Number(!b.allySide) - Number(!a.allySide));
      for (const action of queue) {
        if (action.unit.hp <= 0) continue;
        const targets = (action.allySide ? activeEnemies : activeAllies).filter((unit) => unit.hp > 0);
        const target = chooseBattleTarget(action.unit, targets, action.allySide);
        if (!target) continue;
        const before = beforeBattleAction(action.unit);
        if (!before.skip) performBattleAction(action.unit, target, action.allySide, encounter.damageMultiplier || 1);
        afterBattleAction(action.unit);
        if (action.allySide && action.unit.hp <= 0 && !detail.allyKos.includes(action.unit.uid)) detail.allyKos.push(action.unit.uid);
        if (!action.allySide && target.hp <= 0 && !detail.allyKos.includes(target.uid)) detail.allyKos.push(target.uid);
      }
    }
    detail.enemies = enemies.map((enemy) => ({ id: enemy.id, level: enemy.level, maxHp: enemy.maxHp, turns: rounds, remainingHp: Math.max(0, enemy.hp), status: enemy.status }));
    return { win: !enemies.some((enemy) => enemy.hp > 0), detail };
  }

  function simulateChapterTeam(save, team, chapterIndex) {
    const allies = team.map((mon) => freshBattleUnit({ ...mon }));
    const sequence = chapterBattleSequence(save, chapterIndex);
    const details = [];
    let completed = 0;
    let reachedLeader = false;
    for (const encounter of sequence) {
      if (encounter.kind === "heal") {
        for (const ally of allies) Object.assign(ally, { hp: ally.maxHp, status: null, statusLeft: 0, confused: 0 });
        details.push({ kind: "heal", name: encounter.name });
        continue;
      }
      if (encounter.kind === "leader") reachedLeader = true;
      const result = simulateDeterministicBattle(allies, encounter);
      details.push(result.detail);
      if (!result.win) {
        const totalHp = allies.reduce((sum, ally) => sum + Math.max(0, ally.hp), 0);
        const totalMax = allies.reduce((sum, ally) => sum + ally.maxHp, 0) || 1;
        return { clear: false, reachedLeader, completed, total: sequence.filter((item) => item.kind !== "heal").length, remainingHp: totalHp / totalMax, failedAt: encounter.kind, details };
      }
      completed += 1;
    }
    const totalHp = allies.reduce((sum, ally) => sum + Math.max(0, ally.hp), 0);
    const totalMax = allies.reduce((sum, ally) => sum + ally.maxHp, 0) || 1;
    return { clear: true, reachedLeader, completed, total: completed, remainingHp: totalHp / totalMax, failedAt: null, details };
  }

  function chapterSimulationScore(result) {
    const progress = result.total ? result.completed / result.total : 0;
    return (result.clear ? 1_000_000_000 : 0) + (result.reachedLeader ? 10_000_000 : 0) + progress * 1_000_000 + result.remainingHp * 10_000;
  }

  function removeClearlyDominatedCandidates(save, candidates, enemies, targetLevel) {
    if (candidates.length <= 6 || !enemies.length) return candidates;
    const profiles = new Map(candidates.map((mon) => [mon.uid, battleProfile(mon, enemies)]));
    return candidates.filter((candidate) => !candidates.some((other) => {
      if (other.uid === candidate.uid || teamIdentity(other) === teamIdentity(candidate)) return false;
      const candidateMeta = species(candidate.id);
      const otherMeta = species(other.id);
      if (!candidateMeta || !otherMeta || !otherMeta.t.includes(candidateMeta.t[0])) return false;
      const candidatePower = combinedStatValue(candidate);
      const otherPower = combinedStatValue(other);
      if (otherPower < candidatePower * 1.25) return false;
      const candidateFuture = baseStatTotal(projectedSpeciesId(save, candidate, targetLevel));
      const otherFuture = baseStatTotal(projectedSpeciesId(save, other, targetLevel));
      if (otherFuture < candidateFuture) return false;
      const candidateDuels = profiles.get(candidate.uid).duels;
      const otherDuels = profiles.get(other.uid).duels;
      return otherDuels.every((duel, index) => (
        duel.outgoing >= candidateDuels[index].outgoing
        && duel.incoming <= candidateDuels[index].incoming * 1.1
        && Number(duel.clears) >= Number(candidateDuels[index].clears)
      ));
    }));
  }

  function roamingLevelPriorityScore(level, preferredLevel = null) {
    if (!preferredLevel) return 0;
    const normalized = Number(level) || 0;
    return normalized >= preferredLevel
      ? 1_000 + (normalized - preferredLevel) * 4
      : -(preferredLevel - normalized) * 20;
  }

  function scoreCandidate(mon, enemies, continuitySet, selected, levelWeight = DEFAULT_LEVEL_WEIGHT, preferredLevel = null, save = null, targetLevel = null) {
    const meta = species(mon.id);
    if (!meta) return { score: -Infinity, reason: "缺少资料" };
    const stats = meta.s;
    const power = combinedStatValue(mon);
    const statMultiplier = combinedStatMultiplier(mon);
    const enemyList = enemies.length ? enemies : enemyProfiles([{ id: 1, level: mon.level }]);
    const normalizedTargetLevel = Math.max(mon.level, Number(targetLevel) || mon.level);
    const projectedId = projectedSpeciesId(save, mon, normalizedTargetLevel);
    const projectedPower = baseStatTotal(projectedId) * statMultiplier;
    const battle = battleProfile(mon, enemyList);
    const moves = learnedMoves(meta, mon.level);

    const offense = enemyList.reduce((sum, enemy) => {
      const best = moves.reduce((max, move) => {
        const stab = meta.t.includes(move.type) ? 1.5 : 1;
        return Math.max(max, move.power * effectiveAccuracy(move.accuracy) * stab * typeEffect(move.type, enemy.meta.t));
      }, 20);
      return sum + best;
    }, 0) / enemyList.length;

    const defense = enemyList.reduce((sum, enemy) => {
      const danger = Math.max(...enemy.meta.t.map((type) => typeEffect(type, meta.t)), 1);
      return sum + 1 / danger;
    }, 0) / enemyList.length;

    const samePrimary = selected.filter((item) => species(item.id)?.t?.[0] === meta.t[0]).length;
    const continuity = continuitySet.has(mon.uid) ? 6 : 0;
    const levelContribution = Math.min(100, mon.level) * levelWeight;
    const preferredLevelScore = roamingLevelPriorityScore(mon.level, preferredLevel);
    const score = power * 0.28 + projectedPower * 0.12 + offense * 0.45 + defense * 18
      + stats[5] * statMultiplier * 0.05 + battle.score
      + levelContribution + preferredLevelScore + continuity - samePrimary * 10;
    return {
      score,
      reason: `${language() === "en" ? "Combined stats" : "综合能力"}${power}（${combinedStatNote(mon)}） · ${language() === "en" ? "projected" : "培养目标"}${species(projectedId)?.n || projectedId}/${projectedPower.toFixed(0)} · ${language() === "en" ? "deterministic clears" : "确定性对位"}${battle.clears}/${enemyList.length} · Lv.${mon.level}`,
    };
  }

  function optimizeChapterTeam(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures) {
    if (chapterIndex == null || initial.length < 2 || !chapter(chapterIndex)?.steps?.length) return { team: initial, simulation: null };
    const continuity = new Set(save.teamSets?.list?.[4] || save.team || []);
    const ranked = candidates.map((mon) => ({
      mon,
      score: scoreCandidate(mon, scoreOptions.enemies, continuity, [], scoreOptions.levelWeight, scoreOptions.preferredLevel, save, scoreOptions.targetLevel).score,
    })).sort((a, b) => b.score - a.score);
    const identitySeen = new Set();
    const pool = [...initial, ...ranked.map((entry) => entry.mon)].filter((mon) => {
      const key = `${teamIdentity(mon)}|${mon.uid}`;
      if (identitySeen.has(key)) return false;
      identitySeen.add(key);
      return true;
    }).slice(0, 12);
    const evaluations = new Map();
    const evaluate = (team) => {
      const signature = team.map((mon) => mon.uid).sort().join("|");
      if (excludedSignatures.has(signature)) return { score: -Infinity, result: null };
      if (evaluations.has(signature)) return evaluations.get(signature);
      const result = simulateChapterTeam(save, team, chapterIndex);
      const evaluated = { score: chapterSimulationScore(result), result };
      evaluations.set(signature, evaluated);
      return evaluated;
    };
    let bestTeam = initial.slice();
    let best = evaluate(bestTeam);
    for (let slot = 0; slot < bestTeam.length; slot += 1) {
      for (const candidate of pool) {
        if (bestTeam.some((mon, index) => index !== slot && teamIdentity(mon) === teamIdentity(candidate))) continue;
        const trial = bestTeam.slice();
        trial[slot] = candidate;
        const evaluated = evaluate(trial);
        if (evaluated.score > best.score + 1e-9) {
          bestTeam = trial;
          best = evaluated;
        }
      }
    }
    return { team: bestTeam, simulation: best.result };
  }

  async function optimizeChapterTeamCooperatively(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures) {
    if (chapterIndex == null || initial.length < 2 || !chapter(chapterIndex)?.steps?.length) return { team: initial, simulation: null };
    const continuity = new Set(save.teamSets?.list?.[4] || save.team || []);
    const ranked = candidates.map((mon) => ({
      mon,
      score: scoreCandidate(mon, scoreOptions.enemies, continuity, [], scoreOptions.levelWeight, scoreOptions.preferredLevel, save, scoreOptions.targetLevel).score,
    })).sort((a, b) => b.score - a.score);
    const seen = new Set();
    const pool = [...initial, ...ranked.map((entry) => entry.mon)].filter((mon) => {
      const key = `${teamIdentity(mon)}|${mon.uid}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
    const cache = new Map();
    const evaluate = (team) => {
      const signature = team.map((mon) => mon.uid).sort().join("|");
      if (excludedSignatures.has(signature)) return { score: -Infinity, result: null };
      if (!cache.has(signature)) {
        const result = simulateChapterTeam(save, team, chapterIndex);
        cache.set(signature, { score: chapterSimulationScore(result), result });
      }
      return cache.get(signature);
    };
    let bestTeam = initial.slice();
    let best = evaluate(bestTeam);
    let evaluations = 1;
    for (let slot = 0; slot < bestTeam.length; slot += 1) {
      for (const candidate of pool) {
        if (bestTeam.some((mon, index) => index !== slot && teamIdentity(mon) === teamIdentity(candidate))) continue;
        const trial = bestTeam.slice();
        trial[slot] = candidate;
        const evaluated = evaluate(trial);
        if (evaluated.score > best.score + 1e-9) {
          bestTeam = trial;
          best = evaluated;
        }
        evaluations += 1;
        if (evaluations % 4 === 0) await sleep(0);
      }
    }
    return { team: bestTeam, simulation: best.result };
  }

  function chapterOptimizationWorker(event) {
    const { allies: allyRows, sequence, initialUids, excludedSignatures } = event.data;
    const allyByUid = new Map(allyRows.map((ally) => [ally.uid, ally]));
    const excluded = new Set(excludedSignatures);
    const simulate = (uids) => {
      const allies = uids.map((uid) => ({ ...allyByUid.get(uid), hp: allyByUid.get(uid).maxHp }));
      let completed = 0;
      let reachedLeader = false;
      const details = [];
      const total = sequence.filter((entry) => entry.kind !== "heal").length;
      for (const encounter of sequence) {
        if (encounter.kind === "heal") {
          for (const ally of allies) ally.hp = ally.maxHp;
          details.push({ kind: "heal", name: encounter.name });
          continue;
        }
        if (encounter.kind === "leader") reachedLeader = true;
        const detail = { kind: encounter.kind, name: encounter.name, enemies: [], allyKos: [] };
        for (const enemy of encounter.enemies) {
          let enemyHp = enemy.maxHp;
          let turns = 0;
          while (enemyHp > 0 && allies.some((ally) => ally.hp > 0)) {
            const matchup = allies.filter((ally) => ally.hp > 0).map((ally) => {
              const values = ally.matchups[enemy.key];
              return { ally, ...values, value: values.outgoing / values.incoming + ally.hp / ally.maxHp * 0.25 + (values.allyFirst ? 0.2 : 0) };
            }).sort((a, b) => b.value - a.value || String(a.ally.uid).localeCompare(String(b.ally.uid)))[0];
            if (!matchup) break;
            const { ally, outgoing, incoming, allyFirst } = matchup;
            const turnsToWin = Math.ceil(enemyHp / outgoing);
            const enemyHitsBeforeWin = allyFirst ? Math.max(0, turnsToWin - 1) : turnsToWin;
            const hitsToAllyKo = Math.ceil(ally.hp / incoming);
            if (enemyHitsBeforeWin < hitsToAllyKo) {
              ally.hp -= enemyHitsBeforeWin * incoming;
              enemyHp = 0;
              turns += turnsToWin;
            } else {
              const allyAttacks = allyFirst ? hitsToAllyKo : Math.max(0, hitsToAllyKo - 1);
              enemyHp -= allyAttacks * outgoing;
              ally.hp = 0;
              turns += hitsToAllyKo;
              detail.allyKos.push(ally.uid);
            }
          }
          detail.enemies.push({ id: enemy.id, level: enemy.level, maxHp: enemy.maxHp, turns, remainingHp: Math.max(0, enemyHp) });
          if (enemyHp > 0) {
            details.push(detail);
            const remainingHp = allies.reduce((sum, ally) => sum + Math.max(0, ally.hp), 0) / (allies.reduce((sum, ally) => sum + ally.maxHp, 0) || 1);
            return { clear: false, reachedLeader, completed, total, remainingHp, failedAt: encounter.kind, details };
          }
        }
        details.push(detail);
        completed += 1;
      }
      const remainingHp = allies.reduce((sum, ally) => sum + Math.max(0, ally.hp), 0) / (allies.reduce((sum, ally) => sum + ally.maxHp, 0) || 1);
      return { clear: true, reachedLeader, completed, total: completed, remainingHp, failedAt: null, details };
    };
    const score = (result) => (result.clear ? 1_000_000_000 : 0) + (result.reachedLeader ? 10_000_000 : 0)
      + (result.total ? result.completed / result.total : 0) * 1_000_000 + result.remainingHp * 10_000;
    const cache = new Map();
    const evaluate = (uids) => {
      const signature = [...uids].sort().join("|");
      if (excluded.has(signature)) return { score: -Infinity, result: null };
      if (!cache.has(signature)) {
        const result = simulate(uids);
        cache.set(signature, { score: score(result), result });
      }
      return cache.get(signature);
    };
    let bestUids = [...initialUids];
    let best = evaluate(bestUids);
    for (let slot = 0; slot < bestUids.length; slot += 1) {
      for (const candidate of allyRows) {
        if (bestUids.some((uid, index) => index !== slot && allyByUid.get(uid).identity === candidate.identity)) continue;
        const trial = [...bestUids];
        trial[slot] = candidate.uid;
        const evaluated = evaluate(trial);
        if (evaluated.score > best.score + 1e-9) {
          bestUids = trial;
          best = evaluated;
        }
      }
    }
    self.postMessage({ uids: bestUids, simulation: best.result });
  }

  async function optimizeChapterTeamAsync(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures) {
    if (chapterIndex == null || initial.length < 2 || !chapter(chapterIndex)?.steps?.length) return { team: initial, simulation: null };
    const continuity = new Set(save.teamSets?.list?.[4] || save.team || []);
    const ranked = candidates.map((mon) => ({
      mon,
      score: scoreCandidate(mon, scoreOptions.enemies, continuity, [], scoreOptions.levelWeight, scoreOptions.preferredLevel, save, scoreOptions.targetLevel).score,
    })).sort((a, b) => b.score - a.score);
    const seen = new Set();
    const pool = [...initial, ...ranked.map((entry) => entry.mon)].filter((mon) => {
      const key = `${teamIdentity(mon)}|${mon.uid}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
    const sequence = chapterBattleSequence(save, chapterIndex);
    const enemyRows = new Map();
    const compactSequence = sequence.map((encounter) => ({
      kind: encounter.kind,
      name: encounter.name,
      enemies: (encounter.enemies || []).map((enemySpec) => {
        const key = `${enemySpec.id}|${enemySpec.level}|${encounter.damageMultiplier || 1}|${encounter.hpMultiplier || 1}`;
        if (!enemyRows.has(key)) {
          const enemy = freshBattleUnit({ id: enemySpec.id, level: enemySpec.level, shiny: false, rank: 0 }, encounter.hpMultiplier || 1);
          enemyRows.set(key, { key, id: enemy.id, level: enemy.level, maxHp: enemy.maxHp, damageMultiplier: encounter.damageMultiplier || 1, unit: enemy });
        }
        const { unit, damageMultiplier, ...row } = enemyRows.get(key);
        return row;
      }),
    }));
    const allies = pool.map((mon) => {
      const unit = freshBattleUnit({ ...mon });
      const matchups = Object.fromEntries([...enemyRows.values()].map((enemy) => [enemy.key, battleMatchup(unit, enemy.unit, enemy.damageMultiplier)]));
      return { uid: String(mon.uid), identity: teamIdentity(mon), maxHp: unit.maxHp, matchups };
    });
    if (typeof Worker !== "function") return optimizeChapterTeam(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures);
    const blobUrl = URL.createObjectURL(new Blob([`self.onmessage = ${chapterOptimizationWorker.toString()};`], { type: "text/javascript" }));
    try {
      const result = await new Promise((resolve, reject) => {
        const worker = new Worker(blobUrl);
        const timeout = setTimeout(() => { worker.terminate(); reject(new Error("battle worker timeout")); }, 5_000);
        worker.onmessage = (message) => { clearTimeout(timeout); worker.terminate(); resolve(message.data); };
        worker.onerror = (error) => { clearTimeout(timeout); worker.terminate(); reject(error); };
        worker.postMessage({ allies, sequence: compactSequence, initialUids: initial.map((mon) => String(mon.uid)), excludedSignatures: [...excludedSignatures] });
      });
      const byUid = new Map(pool.map((mon) => [String(mon.uid), mon]));
      const team = result.uids.map((uid) => byUid.get(uid)).filter(Boolean);
      const strictSimulation = simulateChapterTeam(save, team, chapterIndex);
      if (strictSimulation.clear) return { team, simulation: strictSimulation };
      return optimizeChapterTeamCooperatively(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures);
    } catch (error) {
      log(`后台战斗模拟不可用，改用限量计算：${error.message}`);
      return optimizeChapterTeamCooperatively(save, candidates, initial, chapterIndex, scoreOptions, excludedSignatures);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }

  function recommendTeam(save, enemyIds, options) {
    const {
      excludedSignatures = new Set(),
      levelWeight = DEFAULT_LEVEL_WEIGHT,
      preferredLevel = null,
      targetLevel = null,
      chapterIndex = null,
      candidateOverride = null,
    } = options || {};
    const fallbackLevel = Math.max(1, Number(targetLevel) || 1);
    const enemies = enemyProfiles(enemyIds, fallbackLevel);
    const currentFive = new Set(save.teamSets?.list?.[4] || save.team || []);
    const rawCandidates = candidateOverride ?? teamCandidatesForRecommendation(save);
    const candidates = removeClearlyDominatedCandidates(save, rawCandidates, enemies, fallbackLevel);
    const preferredUids = new Set(preferredTeamCandidates(save).map((mon) => String(mon.uid)));
    const availableIdentities = new Set(candidates.map(teamIdentity));
    const selected = [];
    const details = [];
    while (selected.length < 6 && selected.length < availableIdentities.size) {
      const selectedIdentities = new Set(selected.map(teamIdentity));
      const ranked = candidates
        .filter((mon) => !selectedIdentities.has(teamIdentity(mon)))
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected, levelWeight, preferredLevel, save, fallbackLevel) }))
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
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected, levelWeight, preferredLevel, save, fallbackLevel) }))
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
    return {
      mons: selected,
      details,
      enemyIds,
      signature: selected.map((mon) => mon.uid).sort().join("|"),
      simulation: null,
      optimization: chapterIndex == null ? null : {
        chapterIndex,
        candidates,
        enemies,
        levelWeight,
        preferredLevel,
        targetLevel: fallbackLevel,
        excludedSignatures: [...excludedSignatures],
      },
    };
  }

  function recommendRoamingTeam(save, enemyId) {
    const plan = recommendTeam(save, [enemyId], {
      levelWeight: COLLECTION_LEVEL_WEIGHT,
      preferredLevel: ROAMING_PREFERRED_LEVEL,
      targetLevel: 100,
      candidateOverride: settings.candidatePool.enabled ? preferredTeamCandidates(save) : null,
    });
    return plan;
  }

  function targetEnemyIdsForChapter(chapterIndex) {
    const ids = chapter(chapterIndex)?.boss?.team?.map(([id]) => id) || [];
    const observed = runtime.observedEnemies.get(chapterIndex) || new Set();
    return [...new Set([...ids, ...observed])];
  }

  function targetEnemiesForChapter(chapterIndex) {
    const item = chapter(chapterIndex);
    const levels = new Map(scaledBossTeam(chapterIndex).map(({ id, level }) => [id, level]));
    const observed = runtime.observedEnemies.get(chapterIndex) || new Set();
    const observedLevel = runtime.lastOpponent.get(chapterIndex)?.maxLevel || item?.ace || 1;
    for (const id of observed) levels.set(id, Math.max(levels.get(id) || 0, observedLevel));
    return [...levels].map(([id, level]) => ({ id, level }));
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

  function dailyRaidEntryState(root) {
    for (const [type, selector] of [
      ["login", "[data-p]"],
      ["list", ".rc-card"],
      ["draw", "[data-raid-draw]"],
      ["page", '[data-raid-page="chroma"]'],
      ["empty", ".pg-empty"],
    ]) {
      const element = root.querySelector(selector);
      if (element) return { type, element };
    }
    return null;
  }

  function deferDailyRaidCheck(message) {
    runtime.dailyRaidRetryAt = Date.now() + 5 * 60_000;
    runtime.dailyRaidActiveRegion = null;
    log(message);
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
      let entry;
      try {
        entry = await waitFor(
          () => dailyRaidEntryState(root),
          { timeout: 15_000, label: language() === "en" ? "daily raid entry" : "每日团体战入口" },
        );
      } catch {
        deferDailyRaidCheck(language() === "en"
          ? "Daily raid entry is still unavailable; retrying in five minutes"
          : "每日团体战入口暂时不可用，继续当前任务并在5分钟后重试");
        return;
      }

      if (entry.type === "login") {
        finishDailyRaidCheck(date, language() === "en" ? "Daily raid skipped: sign in to the game first" : "今日团体战已跳过：请先登录游戏账号");
        return;
      }
      if (entry.type === "empty") {
        finishDailyRaidCheck(date, language() === "en" ? "Daily raid is not available yet" : "今日没有可用团体战或尚未解锁");
        return;
      }
      if (entry.type === "draw") {
        await pacedClick(entry.element, language() === "en" ? "daily raid draw" : "抽取每日团体战");
        await waitFor(
          () => root.querySelector("[data-raid-page=\"chroma\"], .rc-card, [data-p]"),
          { timeout: 20_000, label: language() === "en" ? "daily raid draw" : "每日团体战抽取" },
        );
      }

      const raidPage = entry.type === "page" ? entry.element : root.querySelector('[data-raid-page="chroma"]');
      if (raidPage) {
        await pacedClick(raidPage, language() === "en" ? "daily raid" : "每日团体战入口");
      }
      try {
        await waitFor(
          () => root.querySelector(".rc-card, [data-p]"),
          { timeout: 15_000, label: language() === "en" ? "daily raid list" : "每日团体战列表" },
        );
      } catch {
        deferDailyRaidCheck(language() === "en"
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

  function leagueChapters(chapterIndex) {
    const target = chapter(chapterIndex);
    return target?.league ? DATA.chapters.filter((item) => item.league && item.region === target.region) : [];
  }

  function actualStoryChapter(save, requestedChapter) {
    const group = leagueChapters(requestedChapter);
    if (!group.length) return requestedChapter;
    const current = group.find((item) => item.index === save.adv.chapter);
    // 联盟内部跟随真实进度；外部进入只能从第一位开始，不能跳冠军。
    return current && !save.adv.zone && !save.adv.event && !save.adv.league && !save.adv.tower
      ? current.index : group[0].index;
  }

  function normalTransitChapter(save, plan) {
    const region = chapter(plan.chapter)?.region || currentRegion(save);
    return DATA.chapters.filter((item) => item.region === region && !item.league
      && item.index <= save.adv.unlocked && item.index !== plan.chapter)
      .sort((a,b) => Math.abs(a.index-plan.chapter)-Math.abs(b.index-plan.chapter) || a.index-b.index)[0] || null;
  }

  async function switchChapter(chapterIndex, { settle = true, restart = false, allowRestart = null } = {}) {
    const targetChapter = chapter(chapterIndex);
    const targetRegion = targetChapter?.region;
    if (!targetRegion) throw new Error(`找不到章节${chapterIndex}的数据`);
    const group = leagueChapters(chapterIndex);
    const initial = readSave();
    if (group.some((item) => item.index === initial.adv.chapter)
      && !initial.adv.zone && !initial.adv.event && !initial.adv.league && !initial.adv.tower) {
      runtime.expectedChapter = null;
      return initial.adv.chapter;
    }
    const mapChapter = group.length ? "L" : chapterIndex;
    runtime.expectedChapter = group.length ? group[0].index : chapterIndex;
    try {
      await openChapterMap();
      const visibleRow = document.querySelector(`.mp-row[data-ch="${mapChapter}"]`);
      if (group.length || !visibleRow) {
        const regionButton = await waitFor(() => document.querySelector(`.rg.open[data-rg="${targetRegion}"]`),
          {label:`${t(targetRegion)}地区标签`});
        await pacedClick(regionButton,`${t(targetRegion)}地区标签`);
      }
      const row = await waitFor(() => document.querySelector(`.mp-row[data-ch="${mapChapter}"]`),
        {label:group.length?`${t(targetRegion)}宝可梦联盟列表项`:`章节${chapterIndex}列表项`});
      await pacedClick(row,"选择章节");
      // 选中联盟条目后才渲染普通／精英页签，地图会记住上次选择。
      const normalLeague = group.length && document.querySelector('[data-lg-view="league"]:not(.on)');
      if (normalLeague) await pacedClick(normalLeague, "普通宝可梦联盟");
      if (restart) {
        const button = document.querySelector(`#map-root .mp-restart[data-restart="${chapterIndex}"]`);
        if (!button || button.disabled || (allowRestart && !allowRestart(readSave()))) return null;
        await pacedClick(button, "重新开始章节");
      } else {
        const go = await waitFor(() => document.querySelector(`.mp-go[data-go="${mapChapter}"]`),
          {label:group.length?"宝可梦联盟进入按钮":`章节${chapterIndex}进入按钮`});
        if (go.disabled) throw new Error(group.length?"宝可梦联盟尚未解锁":"目标章节尚未解锁");
        await pacedClick(go,"进入章节");
      }
      await waitFor(() => {
        const save = readSave();
        return !save.adv.zone && !save.adv.event && !save.adv.league && !save.adv.tower && (group.length
          ? group.some((item) => item.index === save.adv.chapter) : save.adv.chapter === chapterIndex);
      },{timeout:10_000,label:group.length?"进入普通宝可梦联盟":`进入章节${chapterIndex}`});
      if (settle) await jitter(500,900);
      const actual = readSave().adv.chapter;
      log(`已进入：${chapter(actual)?.name || `章节${actual}`}`);
      return actual;
    } finally {
      runtime.expectedChapter = null;
    }
  }

  async function openChapterMap() {
    if (!document.querySelector("#screen-map.active")) {
      await openScreen("adventure");
      await pacedClick(document.querySelector("#side-chapter"), "打开地图");
    }
    await waitFor(() => document.querySelector("#screen-map.active #map-root"), { label: "冒险地图" });
  }

  // 特殊地点的进入按钮在详情里，必须先用地图条目打开详情。
  async function enterSpecialZone(plan, prepareTeam) {
    const special = DATA.specialZones.find((item) => item.id === plan.speciesId);
    if (!special) throw new Error(`找不到 ${plan.speciesId} 的原生地点`);
    const alreadyInside = (save) => Number(save.adv.zone?.id) === special.id
      && !save.adv.zone.elite && !save.adv.zone.riddle;
    if (alreadyInside(readSave())) return { entered: true };

    await openChapterMap();
    const regionTab = await waitFor(
      () => document.querySelector(`#map-root .rg.open[data-rg="${special.region}"]`),
      { label: `${t(special.region)}地图标签` },
    );
    await pacedClick(regionTab, `${t(special.region)}地图标签`);

    const row = document.querySelector(`#map-root .mp-row[data-ch="Z${special.id}"]`);
    if (!row) return { entered: false, reason: language() === "en" ? "The game has not opened this location" : "游戏地图尚未开放此地点" };
    if (row.classList.contains("lz-seal")) {
      return { entered: false, reason: language() === "en" ? "Solve the inscription in the game" : "请先在游戏中解开碑文" };
    }
    await pacedClick(row, `${plan.zone}地图条目`);

    const zoneTab = document.querySelector('#map-root [data-lz-view="zone"]:not(.on)');
    if (zoneTab) await pacedClick(zoneTab, `${plan.zone}区域页`);
    const selector = `#map-root .mp-go[data-zone="${special.id}"]:not([data-tier])`;
    const button = document.querySelector(selector);
    if (!button || button.disabled) {
      return { entered: false, reason: button?.textContent?.trim()
        || (language() === "en" ? "Normal encounter unavailable" : "本轮普通捕获入口未开放") };
    }
    if (prepareTeam) await prepareTeam();
    if (prepareTeam && (runtime.mode === "idle" || runtime.paused)) return { entered: false, cancelled: true };
    const ready = document.querySelector(selector);
    if (!ready || ready.disabled) return { entered: false, reason: ready?.textContent?.trim() || "专属地点暂未开放" };
    const clicked = await pacedClick(ready, `${plan.zone}入口`, undefined, () =>
      !runtime.manualFixedTeam && runtime.mode !== "idle" && !runtime.paused && !nativeFixedEditor());
    if (!clicked) return { entered: false, cancelled: true };
    try {
      await waitFor(() => alreadyInside(readSave()), { timeout: 10_000, label: `进入${plan.zone}` });
    } catch (error) {
      if (error.message !== `等待进入${plan.zone}超时`) throw error;
      return { entered: false, reason: language() === "en" ? "The game declined entry" : "游戏未接受进入请求，请查看地图详情" };
    }
    log(`已进入特殊地点：${plan.zone}`);
    return { entered: true };
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
      const transit = normalTransitChapter(save, plan);
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
      runtime.targetPlan = plan.prerequisiteFor ? { ...alternative, prerequisiteFor: plan.prerequisiteFor } : alternative;
      await switchChapter(alternative.chapter);
      const targetSave = readSave();
      if (currentRegion(targetSave) !== previousRegion) {
        const team = recommendTeam(targetSave, [alternative.speciesId], {
          levelWeight: COLLECTION_LEVEL_WEIGHT,
          targetLevel: chapter(alternative.chapter)?.ace,
          chapterIndex: alternative.chapter,
        });
        await applyRecommendedTeam(team, species(alternative.speciesId)?.n || String(alternative.speciesId));
      }
      return;
    }
    const transit = normalTransitChapter(save, plan);
    if (!transit) throw new Error("找不到可用中转章节");
    runtime.chapterReset = {
      phase: "transit",
      transitChapter: transit.index,
      targetChapter: plan.chapter,
    };
    await continueChapterReset();
  }

  async function applyRecommendedTeam(plan, reason) {
    if (plan.optimization) {
      const requested = plan.optimization;
      const snapshot = readSave();
      const snapshotChapter = Number(snapshot.adv.chapter);
      const candidateUids = new Set(snapshot.mons.map((mon) => String(mon.uid)));
      const optimized = await optimizeChapterTeamAsync(
        snapshot,
        requested.candidates,
        plan.mons,
        requested.chapterIndex,
        requested,
        new Set(requested.excludedSignatures),
      );
      const fresh = readSave();
      const stillValid = Number(fresh.adv.chapter) === snapshotChapter
        && optimized.team.every((mon) => candidateUids.has(String(mon.uid)) && fresh.mons.some((candidate) => String(candidate.uid) === String(mon.uid)));
      if (stillValid) {
        const continuity = new Set(fresh.teamSets?.list?.[4] || fresh.team || []);
        plan.mons = optimized.team;
        plan.simulation = optimized.simulation;
        plan.signature = optimized.team.map((mon) => mon.uid).sort().join("|");
        plan.details = optimized.team.map((mon, index) => {
          const scored = scoreCandidate(mon, requested.enemies, continuity, optimized.team.slice(0, index), requested.levelWeight, requested.preferredLevel, fresh, requested.targetLevel);
          return { uid: mon.uid, id: mon.id, name: species(mon.id)?.n || mon.id, score: scored.score, reason: scored.reason };
        });
      } else {
        log("后台配队期间章节或候选发生变化，已放弃过期模拟结果");
      }
      delete plan.optimization;
    }
    runtime.teamPlan = plan;
    runtime.teamStatus = `推荐完成：${reason}`;
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    if (save) recordDebugDecision(plan, save, reason);
    if (plan.simulation) {
      const result = plan.simulation.clear
        ? `整章确定性模拟通过，剩余生命 ${(plan.simulation.remainingHp * 100).toFixed(0)}%`
        : `整章确定性模拟在${plan.simulation.failedAt || "未知节点"}失败，完成 ${plan.simulation.completed}/${plan.simulation.total}`;
      log(result, plan.simulation.clear ? "info" : "error");
    }
    renderStatus();
    if (settings.lockTeam5 || runtime.userTeamOverride) {
      log(`第五队已锁定，仅生成推荐：${plan.details.map((item) => item.name).join("、")}`);
      return;
    }
    if (plan.simulation && !plan.simulation.clear) {
      runtime.teamStatus = `未应用：没有通过整章校验的阵容（${plan.simulation.completed}/${plan.simulation.total}）`;
      log(runtime.teamStatus, "error");
      renderStatus();
      return;
    }
    await configurePreset(4, plan.mons.map((mon) => mon.uid));
    runtime.lastTeamSignature = fifthTeamSignature(readSave());
    runtime.teamStatus = `已应用：${plan.details.map((item) => item.name).join("、")}`;
    log(runtime.teamStatus);
  }

  let syntheticPointerId = 10_000;

  async function dragPokemon(source, destination, label, allowed = () => true) {
    if (!source || !destination) throw new Error(`找不到${label}的拖放位置`);
    const targetGap = Math.round(700 + Math.random() * 1_000);
    const elapsed = Date.now() - runtime.lastAutomatedActionAt;
    await sleep(runtime.lastAutomatedActionAt ? Math.max(0, targetGap - elapsed) : targetGap);
    if (!allowed()) return;
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

  async function revealPokemonCard(mon) {
    await openScreen("team");
    const quickPacing = { beforeMin: 180, beforeMax: 420, afterMin: 120, afterMax: 300 };
    const evoFilter = document.querySelector("#pc-evo.on");
    if (evoFilter) await pacedClick(evoFilter, language() === "en" ? "Evolution filter" : "进化筛选", quickPacing);
    const shinyFilter = document.querySelector("#pc-shiny.on");
    if (shinyFilter) await pacedClick(shinyFilter, language() === "en" ? "Shiny filter" : "异色筛选", quickPacing);
    for (const filter of [...document.querySelectorAll("#pc-active button")]) {
      await pacedClick(filter, language() === "en" ? "PC filter" : "电脑筛选按钮", quickPacing);
    }
    const search = document.querySelector("#pc-search");
    let card = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(String(mon.uid))}"]`);
    if (!card && search) {
      search.value = species(mon.id)?.n || "";
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await jitter(180, 420);
      card = await waitFor(
        () => document.querySelector(`#pc-grid .pc-cell[data-uid="${CSS.escape(String(mon.uid))}"]`),
        { label: language() === "en" ? "Buddy candidate in the PC" : "电脑中的伙伴候选" },
      );
    }
    if (!card) throw new Error(`找不到伙伴候选：${species(mon.id)?.n || mon.id}`);
    return { card, search, quickPacing };
  }

  async function setBuddyThroughGame(mon) {
    const { card, search, quickPacing } = await revealPokemonCard(mon);
    await pacedClick(card, `${species(mon.id)?.n || mon.id}${language() === "en" ? " details" : "详情"}`, quickPacing);
    const detail = await waitFor(() => document.querySelector(".dexcard.v2"), { label: language() === "en" ? "Pokemon details" : "宝可梦详情" });
    try {
      const toggle = detail.querySelector(".dc-buddy");
      if (!toggle) throw new Error("宝可梦详情中缺少伙伴按钮");
      if (toggle.getAttribute("aria-pressed") !== "true") {
        await pacedClick(toggle, language() === "en" ? "Set Buddy" : "设置伙伴", quickPacing);
        await waitFor(
          () => String(readSave().buddy?.uid) === String(mon.uid),
          { label: language() === "en" ? "Buddy update" : "伙伴更新" },
        );
      }
    } finally {
      const close = detail.querySelector(".dc-x");
      if (close) await pacedClick(close, language() === "en" ? "close details" : "关闭详情", quickPacing);
      if (search?.value) {
        search.value = "";
        search.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }

  async function manageBuddy(save) {
    if (!settings.autoBuddy || save?.adv?.battle || save?.adv?.event) return false;
    if (Date.now() - runtime.lastBuddyCheckAt < 5_000) return false;
    runtime.lastBuddyCheckAt = Date.now();
    const candidate = bestBuddyCandidate(save);
    if (!candidate) {
      runtime.buddyStatus = t("buddyComplete");
      return false;
    }
    runtime.buddyStatus = buddyStatusText(save);
    if (String(save.buddy?.uid) === String(candidate.mon.uid)) return false;
    const changed = await exclusive(t("autoBuddyTitle"), () => setBuddyThroughGame(candidate.mon));
    if (!changed) return false;
    const current = readSave();
    runtime.buddyStatus = buddyStatusText(current);
    log(language() === "en"
      ? `Automatic Buddy: ${species(candidate.mon.id)?.n || candidate.mon.id} · Lv.${candidate.mon.level}/${candidate.cap} · combined ${candidate.power}`
      : `自动伙伴：${species(candidate.mon.id)?.n || candidate.mon.id} · Lv.${candidate.mon.level}/${candidate.cap} · 综合能力${candidate.power}`);
    return true;
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
      for (const encounter of item.staticEncounters || []) {
        if (Number(encounter.id) !== Number(speciesId)) continue;
        if (encounter.once && save.adv?.gifts?.[encounter.once]) continue;
        if ((encounter.caught || []).some((id) => !isCaught(save, id))) continue;
        const generated = save.adv.chapter === item.index && !save.adv.zone && !save.adv.event
          && (save.adv.nodes || []).some((node, index) => node.type === "static"
            && Number(node.id) === Number(speciesId) && index >= (save.adv.node ?? 0));
        if (!generated && encounter.needs && Number(save.items?.[encounter.needs] || 0) < Number(encounter.needN || 1)) continue;
        if (!generated && encounter.after && !save.adv.gifts?.[encounter.after]) continue;
        const phase = daytimePhaseAt(timestamp, Boolean(item.day && !(save.adv.unlocked > item.index)));
        if (!generated && encounter.night && phase !== "night") continue;
        if (!generated && encounter.day && phase === "night") continue;
        const weather = currentWeatherForRoute(save, item, encounter, timestamp, phase);
        if (!generated && encounter.skies?.length && !encounter.skies.includes(weather)) continue;
        const prefixCost = encounter.stepIndex + 1;
        const chance = Number(encounter.chance || 1);
        plans.push({
          speciesId: Number(speciesId),
          chapter: item.index,
          chapterName: item.name,
          zone: encounter.name,
          sourceZone: encounter.sourceName,
          static: true,
          staticOnce: encounter.once,
          prefixCost,
          weight: chance,
          score: chance / prefixCost,
          phase,
          weather,
          weatherLimited: Boolean(encounter.night || encounter.day || encounter.skies?.length),
          level: encounter.level || item.ace,
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

  function ownsSpecialPrerequisite(save, id) {
    // 与游戏的 owns 一致：盒子、寄放屋以及地下通道远征中的实际个体。
    return (save.mons || []).some((mon) => Number(mon.id) === id)
      || (save.pension?.mons || []).some(({ mon }) => Number(mon?.id) === id)
      || (save.under?.slots || []).some((slot) => (slot.mons || []).some((mon) => Number(mon?.id) === id));
  }

  function isSpecialComplete(save, id) {
    const special = DATA.specialZones.find((item) => item.id === id);
    return special?.forms ? special.forms.every((form) => isCaught(save, form)) : isCaught(save, id);
  }

  function specialConditionStatus(save, condition, special) {
    if (!condition) return { met: true, reason: "" };
    if (condition.kind === "owns") {
      const missing = (condition.ids || []).filter((id) => !ownsSpecialPrerequisite(save, id));
      return missing.length
        ? { met: false, reason: `${language() === "en" ? "Needs" : "需要拥有"} ${missing.map((id) => species(id)?.n || id).join("、")}` }
        : { met: true, reason: "" };
    }
    if (condition.kind === "all") {
      const unmet = (condition.list || []).map((item) => specialConditionStatus(save, item, special))
        .filter((result) => !result.met);
      return { met: unmet.length === 0, reason: unmet.map(({ reason }) => reason).filter(Boolean).join("；") };
    }
    if (condition.kind === "item") {
      const met = specialItemHeld(save, condition.item);
      if (met) return { met: true, reason: "" };
      if (condition.item === "auroraticket") {
        const floor = Math.max(Number(save.tower?.top || 0), Number(save.tower?.best?.floor || 0));
        const bp = Number(save.tower?.bp || 0);
        return { met: false, reason: language() === "en"
          ? `AuroraTicket: Battle Tower shop · floor ${floor}/40 · ${bp}/1000 BP`
          : `诞生之岛船票：对战塔商店兑换 · 楼层 ${floor}/40 · 对战点 ${bp}/1000` };
      }
      if (ROAD_ITEM_NAMES[condition.item] && save.adv.gifts?.[condition.item]) {
        const title = roadItemName(condition.item);
        return { met: false, reason: language() === "en"
          ? `${title} was already found and is now missing from inventory`
          : `${title}已拾取过，但当前库存中没有` };
      }
      return { met: false, reason: condition.text || `${language() === "en" ? "Needs item" : "需要道具"} ${condition.item}` };
    }
    if (condition.kind === "door") {
      const met = Boolean(save.zoneDoors?.[condition.key]);
      const blocked = runtime.independentBlocks.get(`door:${condition.key}`);
      const reason = [inscriptionStatus(save, condition.key), blocked?.until > Date.now() ? blocked.reason : ""].filter(Boolean).join("；");
      return { met, reason: met ? "" : reason };
    }
    if (condition.kind === "league") {
      const badge = DATA.chapters.find((item) => item.region === condition.region && item.boss?.champion)?.boss?.badge;
      const met = Boolean(badge && save.adv.badges?.includes(badge));
      return { met, reason: met ? "" : (condition.text || t("specialConditionLocked")) };
    }
    if (["dex", "type", "types", "count"].includes(condition.kind)) {
      const ids = roadDexConditionIds(condition, special);
      if (!ids.length) return { met: false, reason: t("specialConditionLocked") };
      const have = ids.filter((id) => isCaught(save, id)).length;
      const required = condition.kind === "count" ? condition.need : ids.length;
      const typeNames = { electric: "电", ice: "冰", fire: "火", ground: "地面", water: "水", steel: "钢", rock: "岩石", grass: "草", bug: "虫" };
      const types = condition.types || (condition.type ? [condition.type] : []);
      const label = types.length ? (language() === "en" ? `Pokédex: ${types.join(" / ")}`
        : `图鉴：${types.map((type) => typeNames[type] || type).join("／")}属性`)
        : (language() === "en" ? "Regional Pokédex" : "地区图鉴");
      return { met: have >= required, reason: have < required ? `${label} ${have}/${required}` : "" };
    }
    if (condition.kind === "tally") {
      const value = Number(save.stats?.byReg?.[special.region]?.[condition.field] || 0);
      return { met: value >= condition.need, reason: `${(condition.text || "").replace("{n}", condition.need)} · ${value}/${condition.need}` };
    }
    if (condition.kind === "elite") {
      const tier = Number(save.elite?.[condition.zone]?.t || 0);
      const blocked = runtime.independentBlocks.get(`elite:${condition.zone}:${tier + 1}`);
      const reason = [elitePrerequisiteStatus(save, condition), blocked?.until > Date.now() ? blocked.reason : ""].filter(Boolean).join("；");
      return { met: tier >= condition.tier, reason: tier >= condition.tier ? "" : reason };
    }
    return { met: false, reason: condition.text || t("specialConditionLocked") };
  }

  function specialTargetStatus(save, speciesId) {
    const special = (DATA.specialZones || []).find((item) => item.id === Number(speciesId));
    if (!special) return null;
    const regionChapters = DATA.chapters.filter((item) => item.region === special.region && item.index <= save.adv.unlocked);
    const blockers = [];
    if (!regionChapters.length) blockers.push(t("specialRegionLocked"));
    if (!regionInCollectionScope(save, special.region)) blockers.push(t("specialOutsideScope"));
    if (special.badge && !save.adv.badges?.includes(special.badge)) {
      blockers.push(language() === "en" ? `Needs badge: ${special.badgeName || special.badge}`
        : `需要徽章：${special.badgeName || special.badge}`);
    }
    if (!insideNormalSpecial(save, special.id)) {
      const condition = specialConditionStatus(save, special.condition, special);
      if (!condition.met) blockers.push(condition.reason || t("specialConditionLocked"));
      blockers.push(specialTimingStatus(save, special), specialEntryIssue(special.id));
    }
    const unmet = [...new Set(blockers.filter(Boolean))];
    if (unmet.length) return { special, open: false, reason: unmet.join("；"), chapter: null };

    const normalChapters = regionChapters.filter((item) => !item.league);
    const chapterPlan = normalChapters.find((item) => item.index === special.anchor)
      || normalChapters.find((item) => item.routes.some((route) => route.areas.some((area) => special.areas.includes(area))))
      || normalChapters.at(-1);
    return { special, open: true, reason: "", chapter: chapterPlan?.index ?? null };
  }

  function specialPlansForSpecies(save, speciesId) {
    const status = specialTargetStatus(save, speciesId);
    if (!status?.open || status.chapter == null || isSpecialComplete(save, Number(speciesId))) return [];
    return [{
      speciesId: Number(speciesId),
      chapter: status.chapter,
      chapterName: chapter(status.chapter)?.name,
      zone: status.special.zone,
      sourceZone: status.special.sourceZone,
      region: status.special.region,
      special: true,
      score: 0.5,
      prefixCost: 1,
      level: status.special.level,
    }];
  }

  const moonCalendar = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
  });

  function specialMoonAt(timestamp) {
    // 游戏以巴黎时间 08:00 为月相分界，循环为 8 天。
    const parts = Object.fromEntries(moonCalendar.formatToParts(timestamp - 28_800_000)
      .map(({ type, value }) => [type, Number(value)]));
    const day = Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000;
    const phase = (day % 8 + 8) % 8;
    if (phase < 2) return "full";
    if (phase === 4 || phase === 5) return "new";
    return phase < 4 ? "wane" : "wax";
  }

  function specialTimingStatus(save, special) {
    const now = Number(save.lastTick) || Date.now();
    const night = currentDaytimePhase(save) === "night";
    if (special.moon && (!night || specialMoonAt(now) !== special.moon)) {
      const full = special.moon === "full";
      return language() === "en" ? (full ? "Wait for a full-moon night" : "Wait for a new-moon night")
        : (full ? "等待满月夜" : "等待新月夜");
    }
    if (special.when && (special.when === "night") !== night) {
      return language() === "en" ? `Wait for ${special.when}` : (special.when === "night" ? "等待夜间" : "等待白天（含早晨）");
    }
    return "";
  }

  function specialEntryIssue(id) {
    const blocked = runtime.specialEntryBlocks.get(id);
    if (!blocked) return "";
    if (blocked.until > Date.now()) return blocked.reason;
    runtime.specialEntryBlocks.delete(id);
    return "";
  }

  function insideNormalSpecial(save, id) {
    return Number(save.adv.zone?.id) === id && !save.adv.zone.elite && !save.adv.zone.riddle;
  }

  function specialChoiceIds() {
    return [...new Set([...settings.manualTargets, ...DATA.specialZones.map((item) => item.id)])];
  }

  function clearCollectionTarget() {
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.teamPlan = null;
    runtime.specialFight = null;
    runtime.attempts = 0;
  }

  const SPECIAL_ROTATE_AFTER = 3;
  const SPECIAL_MAX_LINEUPS = 4;
  // The native team editor also enforces these mutually exclusive legendary pairs.
  const SPECIAL_TEAM_APART = new Map([[643, [646, 64602]], [644, [646, 64601]]]);

  function fixedTeamUids(save, zoneId) {
    const zone = DATA.specialZones.find((item) => item.id === zoneId);
    const valid = new Set((save.mons || []).filter((mon) => !save.link
      || (pokemonHomeRegion(mon) === save.link.to) === (zone?.region === save.link.to)).map(({ uid }) => String(uid)));
    return (save.eventTeams?.[`zone:${zoneId}`] || []).map(String).filter((uid) => valid.has(uid));
  }

  function fixedTeamCandidates(save, region) {
    const pool = normalizeCandidatePool(settings.candidatePool);
    const picked = new Set(pool.uids);
    const regionSide = region === save.link?.to;
    return (save.mons || []).filter((mon) => mon?.uid && mon.level > 0 && species(mon.id)
      && (!save.link || (pokemonHomeRegion(mon) === save.link.to) === regionSide)
      && (!pool.enabled || (picked.has(String(mon.uid)) && combinedStatValue(mon) + 1e-9 >= pool.minPower)));
  }

  function recommendFixedTeam(save, plan, foe, excluded, popular = []) {
    const enemies = enemyProfiles([{ id: foe, level: plan.level || 100 }]);
    const ranked = fixedTeamCandidates(save, plan.region).map((mon) => ({
      mon, ...scoreCandidate(mon, enemies, new Set(), [], COLLECTION_LEVEL_WEIGHT, ROAMING_PREFERRED_LEVEL, save, plan.level || 100),
    })).sort((a, b) => b.score - a.score);
    const rank = new Map(popular.map((id, index) => [id, index]));
    const preferred = [...ranked].sort((a, b) => (rank.get(a.mon.id) ?? Infinity) - (rank.get(b.mon.id) ?? Infinity) || b.score - a.score);
    const draft = (list, skip = null) => {
      const lineup = [];
      for (const entry of list) {
        if (lineup.length === 6) break;
        if (entry !== skip && lineup.every(({ mon }) => fixedTeamCompatible(mon, entry.mon, plan.eliteTier))) lineup.push(entry);
      }
      return lineup;
    };
    const best = draft(preferred);
    if (!best.length) return null;
    const matchup = draft(ranked);
    const signature = (lineup) => JSON.stringify(lineup.map(({ mon }) => String(mon.uid)));
    const alternatives = best.map((entry) => draft(preferred, entry)).filter((lineup) => lineup.length === best.length);
    const reordered = best.slice(1).map((lead, index) => [lead, ...best.slice(0, index + 1), ...best.slice(index + 2)]);
    const next = [best, matchup, ...alternatives, ...reordered].find((lineup) => !excluded.has(signature(lineup)));
    if (!next) return null;
    return {
      mons: next.map(({ mon }) => mon),
      details: next.map(({ mon, score, reason }) => ({ uid: mon.uid, id: mon.id, name: species(mon.id).n, score, reason })),
      signature: signature(next),
      usesPopularity: next !== matchup && next.some(({ mon }) => rank.has(mon.id)),
    };
  }

  async function findFixedTeamCard(mon, search, grid) {
    const selector = `#evt-pick.open #evt-pc [data-uid="${CSS.escape(String(mon.uid))}"]`;
    const get = () => document.querySelector(selector);
    async function query(value) {
      search.value = value;
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await sleep(100);
    }
    await query(species(mon.id).n.replace(/\s*\(.+\)$/, ""));
    let card = get();
    if (!card) {
      // 搜索文本受游戏语言影响，备用路径始终按个体 UID 识别原生虚拟电脑列表。
      await query("");
      const stride = Math.max(100, Math.floor(grid.clientHeight * 0.8));
      for (let top = 0; ; top += stride) {
        grid.scrollTop = top;
        await sleep(90);
        card = get();
        if (card || grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 2 || grid.scrollTop < top) break;
      }
    }
    if (card) {
      card.scrollIntoView({ block: "nearest", behavior: "instant" });
      await sleep(90);
    }
    return get();
  }

  async function configureFixedTeam(plan, team, { allowed, mayEdit }) {
    const id = plan.speciesId;
    const desired = team.mons.map(({ uid }) => String(uid));
    const savedUids = () => fixedTeamUids(readSave(), id);
    if (!allowed() || nativeFixedEditor()) return false;
    if (JSON.stringify(savedUids()) === team.signature) return true;
    const editor = fixedEditorButton(plan);
    if (!editor) return false;
    const editing = { taken: false };
    runtime.fixedAutoEditor = editing;
    const opened = await pacedClick(editor, `${plan.zone}专属队伍`, undefined,
      () => allowed() && !nativeFixedEditor() && fixedEditorButton(plan) === editor);
    const dialog = opened && nativeFixedEditor();
    if (!dialog) {
      runtime.fixedAutoEditor = null;
      return false;
    }
    const grid = dialog.querySelector("#evt-pc");
    const search = dialog.querySelector("#evt-search");
    const slotOf = (uid) => dialog.querySelector(`#evt-team [data-uid="${CSS.escape(uid)}"]`);
    const cancelled = () => editing.taken || !mayEdit() || !dialog.classList.contains("open");
    try {
      if (!grid || !search || !dialog.querySelector("[data-evt-close]")) throw new Error("专属队伍界面结构缺失");
      for (const uid of savedUids().filter((member) => !desired.includes(member))) {
        if (cancelled()) return;
        await dragPokemon(slotOf(uid), grid, "移除旧专属队员", () => !cancelled());
        if (cancelled()) return false;
        await waitFor(() => !savedUids().includes(uid), { label: "旧专属队员移除" });
      }
      for (const mon of team.mons) {
        if (cancelled()) return;
        const uid = String(mon.uid);
        if (savedUids().includes(uid)) continue;
        const card = await findFixedTeamCard(mon, search, grid);
        if (cancelled()) return false;
        if (!card) throw new Error(`游戏专属队伍中找不到 ${species(mon.id)?.n || mon.id}`);
        await dragPokemon(card, dialog.querySelector("#evt-team .slot.empty"), "添加专属队员", () => !cancelled());
        if (cancelled()) return false;
        await waitFor(() => savedUids().includes(uid), { label: "专属队员加入" });
      }
      for (const [index, uid] of desired.entries()) {
        if (cancelled()) return;
        if (savedUids()[index] === uid) continue;
        await dragPokemon(slotOf(uid), dialog.querySelector(`#evt-team .slot[data-slot="${index}"]`), "调整专属队员出场顺序", () => !cancelled());
        if (cancelled()) return false;
        await waitFor(() => savedUids()[index] === uid, { label: "专属队伍顺序" });
      }
      if (cancelled()) return false;
      if (JSON.stringify(savedUids()) !== team.signature) throw new Error("游戏保存的专属队伍与推荐阵容不一致");
      return true;
    } finally {
      // 原生编辑器每次拖动会重绘标题和关闭按钮，必须在此时重新取元素。
      runtime.fixedAutoEditor = null;
      if (!editing.taken && dialog.classList.contains("open")) {
        const close = dialog.querySelector("[data-evt-close]");
        if (close) {
          await pacedClick(close, "关闭专属队伍编辑器");
          await waitFor(() => !document.querySelector("#evt-pick.open"), { label: "专属队伍编辑器关闭" });
        }
      }
    }
  }

  function fixedTeamCompatible(a, b, elite) {
    const legendary = (mon) => species(mon.id)?.g || species(mon.id)?.m;
    return teamIdentity(a) !== teamIdentity(b)
      && !SPECIAL_TEAM_APART.get(Number(a.id))?.includes(Number(b.id))
      && !SPECIAL_TEAM_APART.get(Number(b.id))?.includes(Number(a.id))
      && !(elite && legendary(a) && legendary(b));
  }

  function fixedSelectedUids(save, plan) {
    const legal = new Map((save.mons || []).filter((mon) => !save.link
      || (pokemonHomeRegion(mon) === save.link.to) === (plan.region === save.link.to)).map((mon) => [String(mon.uid), mon]));
    const dedicated = fixedTeamUids(save, plan.speciesId);
    const uids = dedicated.length ? dedicated : (save.team || []).map(String).filter((uid) => legal.has(uid));
    if (!plan.eliteTier) return uids;
    const result = [];
    for (const uid of uids) {
      const mon = legal.get(uid);
      if (mon && result.every((other) => fixedTeamCompatible(mon, legal.get(other), true))) result.push(uid);
    }
    return result;
  }

  function fixedTeamSignature(save, plan) {
    return JSON.stringify(fixedSelectedUids(save, plan));
  }

  function fixedTeamFighting(save, signature) {
    const uids = (save.road || []).map(String);
    return !uids.length || JSON.stringify(uids) === signature;
  }

  function fixedEditorButton(plan) {
    const tier = plan.eliteTier ? `[data-lz-tier="${plan.eliteTier}"]` : ":not([data-lz-tier])";
    return document.querySelector(`#map-root [data-lz-team="${plan.speciesId}"]${tier}`);
  }

  async function openFixedTeamLocation(plan, allowed) {
    if (!allowed()) return null;
    await openChapterMap();
    const region = document.querySelector(`#map-root .rg.open[data-rg="${plan.region}"]`);
    if (!region || !allowed()) return null;
    await pacedClick(region, `${t(plan.region)}地图标签`, undefined, allowed);
    const row = document.querySelector(`#map-root .mp-row[data-ch="Z${plan.speciesId}"]`);
    if (!row || !allowed()) return null;
    await pacedClick(row, `${plan.zone}地图条目`, undefined, allowed);
    const tab = document.querySelector('#map-root [data-lz-view="zone"]:not(.on)');
    if (tab && allowed()) await pacedClick(tab, `${plan.zone}区域页`, undefined, allowed);
    return allowed() ? fixedEditorButton(plan) : null;
  }

  function fixedManualPlan(save) {
    const active = save?.adv?.zone;
    const zone = !active?.riddle && DATA.specialZones.find((item) => item.id === Number(active?.id));
    if (zone) return { speciesId: zone.id, region: zone.region, zone: zone.zone, eliteTier: active.elite || null };
    const planned = runtime.targetPlan;
    return planned?.special || planned?.eliteTier ? planned : null;
  }

  function nativeFixedEditor() {
    return document.querySelector("#evt-pick.open");
  }

  async function requestManualFixedTeam() {
    if (runtime.manualFixedTeam || nativeFixedEditor()) return;
    const save = readSave();
    const plan = fixedManualPlan(save);
    if (!plan) return;
    const request = { plan, opened: false, returnToBattle: Number(save.adv.zone?.id) === plan.speciesId };
    runtime.manualFixedTeam = request;
    const allowed = () => runtime.manualFixedTeam === request;
    renderStatus();
    try {
      await waitFor(() => !runtime.busy || !allowed(), { timeout: 15_000, label: "脚本释放配队操作" });
      if (!allowed()) return;
      const editor = await openFixedTeamLocation(plan, allowed);
      if (!editor || !allowed()) throw new Error("游戏地图当前未显示该地点的专属队伍");
      const panel = document.getElementById(PANEL_ID);
      const toggle = panel?.querySelector(".pca-native-bar");
      if (toggle && !settings.collapsed) await pacedClick(toggle, "折叠助手", undefined, allowed);
      await pacedClick(editor, "打开手动专属队伍", undefined, () => allowed() && !nativeFixedEditor());
      if (allowed()) request.opened = true;
    } catch (error) {
      if (allowed()) {
        runtime.manualFixedTeam = null;
        runtime.teamStatus = `打开手动阵容失败：${error.message}`;
        log(runtime.teamStatus, "error");
        renderStatus();
      }
    }
  }

  async function finishManualFixedTeam() {
    const request = runtime.manualFixedTeam;
    if (!request?.opened || request.finishing || nativeFixedEditor()) return;
    request.finishing = true;
    const save = readSave();
    const { plan } = request;
    try {
      if (request.returnToBattle && Number(save.adv.zone?.id) === plan.speciesId
        && document.querySelector("#screen-map.active")) await openScreen("adventure");
    } finally {
      if (runtime.manualFixedTeam === request) runtime.manualFixedTeam = null;
    }
  }

  function readFixedPopularity() {
    const ids = Array.from(document.querySelectorAll("#map-root .lzb-pop .lzb-pk .sprbox img[data-id]"),
      (image) => Number(image.dataset.id));
    return [...new Set(ids.filter((id) => species(id)))];
  }

  async function automaticFixedTeam(plan, foe, excluded, previousSignature, isActive) {
    const mode = runtime.mode;
    const mayEdit = () => !runtime.manualFixedTeam && !runtime.paused && mode !== "idle"
      && runtime.mode === mode && isActive(readSave());
    const allowed = () => mayEdit() && fixedTeamSignature(readSave(), plan) === previousSignature;
    if (excluded.size >= SPECIAL_MAX_LINEUPS || !fixedTeamCandidates(readSave(), plan.region).length) return { exhausted: true };
    const editor = await openFixedTeamLocation(plan, () => allowed() && !nativeFixedEditor());
    if (!editor || !allowed() || nativeFixedEditor()) return { interrupted: true };
    // 榜单由地图异步绘制。短暂等候，空榜时使用常规对位评分。
    let popular = readFixedPopularity();
    for (let attempt = 0; !popular.length && allowed() && attempt < 8; attempt++) {
      await sleep(250);
      popular = readFixedPopularity();
    }
    if (!allowed() || nativeFixedEditor()) return { interrupted: true };
    const team = recommendFixedTeam(readSave(), plan, foe, excluded, popular);
    if (!team) return { exhausted: true };
    return await configureFixedTeam(plan, team, { allowed, mayEdit }) ? { team } : { interrupted: true };
  }

  function showFixedTeam(save, plan, source, team = null) {
    if (team) runtime.teamPlan = team;
    const names = fixedSelectedUids(save, plan).map((uid) => {
      const mon = save.mons.find((item) => String(item.uid) === uid);
      return species(mon?.id)?.n || uid;
    });
    runtime.teamStatus = `${source} · ${names.join("、") || "请手动选择出阵成员"}`;
  }

  function fixedFightState(plan, foe, save, tried = new Set()) {
    const signature = fixedTeamSignature(save, plan);
    if (signature !== "[]") tried.add(signature);
    return {
      id: plan.speciesId, foe, signature, tried, exhausted: false, losses: 0,
      tries: Number(save.legTries?.[foe] || 0), bossBattle: null,
      node: save.adv.node, counted: false,
    };
  }

  function fixedBattleStamp(save, state) {
    const battle = save.adv.battle;
    if (battle?.kind !== "static" || Number(battle.zone) !== state.id) return null;
    const foe = battle.enemies?.find((mon) => Number(mon.id) === state.foe);
    return foe ? String(foe.uid ?? save.stats?.battles ?? "boss") : null;
  }

  function observeFixedFight(save, plan = runtime.targetPlan) {
    if (!plan?.special || !insideNormalSpecial(save, plan.speciesId) || nativeFixedEditor() || runtime.manualFixedTeam) return null;
    const id = plan.speciesId;
    const foe = Number(save.adv.zone.foe ?? id);
    const signature = fixedTeamSignature(save, plan);
    let state = runtime.specialFight;
    if (state?.id !== id || state.foe !== foe || state.signature !== signature) {
      const origin = state?.id === id && state.signature !== signature ? "手动阵容" : "当前出阵阵容";
      state = runtime.specialFight = fixedFightState(plan, foe, save);
      runtime.teamPlan = null;
      showFixedTeam(save, plan, origin);
    }
    const tries = Number(save.legTries?.[foe] || 0);
    const stamp = fixedBattleStamp(save, state);
    const bossIndex = (save.adv.nodes || []).findIndex((node) => node.type === "static" && Number(node.id) === foe);
    if (!fixedTeamFighting(save, signature)) {
      // 手动配置已保存但游戏仍在打上一阵容的这一轮。其结果不计入新阵容。
      Object.assign(state, { tries, bossBattle: null, node: save.adv.node, counted: true });
      return state;
    }
    const passedBoss = bossIndex >= 0 && save.adv.node > bossIndex && state.node <= bossIndex;
    const resolved = state.bossBattle && stamp !== state.bossBattle
      && (stamp || (bossIndex >= 0 && save.adv.node !== bossIndex));
    if (tries > state.tries) {
      runtime.attempts += tries - state.tries;
      state.losses = 0;
      state.counted = true;
    } else if (passedBoss || resolved) {
      noteFixedLoss(state);
    }
    if ((stamp && stamp !== state.bossBattle) || (bossIndex >= 0 && save.adv.node <= bossIndex && state.node > bossIndex)) {
      state.counted = false;
    }
    Object.assign(state, { tries, bossBattle: stamp, node: save.adv.node });
    return state;
  }

  function noteFixedLoss(state) {
    if (!state.counted) {
      state.losses += 1;
      state.counted = true;
    }
  }

  function observeFixedFightLog() {
    const battleLog = document.querySelector("#battle-log");
    if (!battleLog) return;
    const observer = new MutationObserver(() => {
      const plan = runtime.targetPlan;
      if (!plan?.special || runtime.busy || runtime.mode === "idle" || runtime.paused
        || !document.querySelector("#screen-adventure.active")) return;
      const save = readSave();
      const state = observeFixedFight(save, plan);
      if (!state || !fixedTeamFighting(save, state.signature)) return;
      const bossIndex = (save.adv.nodes || []).findIndex((node) => node.type === "static" && Number(node.id) === state.foe);
      if (bossIndex < 0 || save.adv.node <= bossIndex) return;
      const timeline = document.querySelector("#timeline");
      const final = [...(timeline?.querySelectorAll(".tl-node") || [])].at(-1);
      const fled = /^(?:野生的.+逃走了[！!]|Wild .+ fled!|.+ sauvage s['’]enfuit\s*!)[\s]*$/iu;
      if (String(timeline?.dataset.key).split("|")[1] === `Z${state.id}`
        && final?.classList.contains("current") && fled.test(battleLog.textContent.trim())) noteFixedLoss(state);
    });
    observer.observe(battleLog, { childList: true, subtree: true, characterData: true });
  }

  async function specialCollectionTick(save, plan) {
    if (runtime.manualFixedTeam || nativeFixedEditor()) return;
    const id = plan.speciesId;
    if (runtime.target !== `special:${id}`) {
      runtime.target = `special:${id}`;
      runtime.targetPlan = plan;
      runtime.waitingPlan = null;
      runtime.userTeamOverride = false;
      runtime.attempts = 0;
      if (runtime.specialFight?.id !== id) runtime.specialFight = null;
    }
    const state = observeFixedFight(save, plan);
    if (save.adv.battle || save.adv.pending || (state && (state.exhausted || state.losses < SPECIAL_ROTATE_AFTER))) return;
    await exclusive(state ? "固定神兽三连败换队" : "进入神兽地点", async () => {
      const fresh = readSave();
      if (runtime.manualFixedTeam || runtime.paused || runtime.mode === "idle" || nativeFixedEditor()
        || fresh.adv.battle || fresh.adv.pending) return;
      if (state) {
        if (observeFixedFight(fresh, plan) !== state || state.losses < SPECIAL_ROTATE_AFTER) return;
        const isActive = (current) => runtime.specialFight === state && insideNormalSpecial(current, id)
          && Number(current.adv.zone.foe ?? id) === state.foe;
        const result = await automaticFixedTeam(plan, state.foe, state.tried, state.signature, isActive);
        if (result.team) {
          const latest = readSave();
          const next = runtime.specialFight = fixedFightState(plan, state.foe, latest, state.tried);
          next.counted = !fixedTeamFighting(latest, next.signature);
          showFixedTeam(latest, plan, result.team.usesPopularity ? "已按最常选用换队" : "已按对位换队", result.team);
          log(runtime.teamStatus);
        } else if (result.exhausted) {
          state.exhausted = true;
          showFixedTeam(readSave(), plan, "无新的合格阵容，可手动换队");
        }
        if (!runtime.manualFixedTeam && !nativeFixedEditor() && !runtime.paused && runtime.mode !== "idle"
          && document.querySelector("#screen-map.active")) await openScreen("adventure");
        return;
      }

      // 初次进入沿用游戏中你已经设置的专属队伍，留空时由原生游戏使用冒险队伍。
      const result = await enterSpecialZone(plan);
      if (result.cancelled) return;
      if (result.entered) {
        observeFixedFight(readSave(), plan);
        return;
      }
      runtime.specialEntryBlocks.set(id, { reason: result.reason, until: Date.now() + 60_000 });
      clearCollectionTarget();
      runtime.collectionQueueSignature = "";
      runtime.teamStatus = `${plan.zone} · ${result.reason}`;
      log(runtime.teamStatus);
      if (!runtime.manualFixedTeam && !nativeFixedEditor()) await openScreen("adventure");
    });
  }

  const ROAD_ITEM_NAMES = {
    "adamant-orb": ["金刚宝珠", "Adamant Orb"], "lustrous-orb": ["白玉宝珠", "Lustrous Orb"],
    "griseous-orb": ["白金宝珠", "Griseous Orb"], gracidea: ["葛拉西蒂亚花", "Gracidea"],
    "light-stone": ["光明石", "Light Stone"], "dark-stone": ["黑暗石", "Dark Stone"],
    "burn-drive": ["火焰卡带", "Burn Drive"], "chill-drive": ["冰冻卡带", "Chill Drive"],
    "shock-drive": ["闪电卡带", "Shock Drive"], "douse-drive": ["水流卡带", "Douse Drive"],
    "reveal-glass": ["现形镜", "Reveal Glass"],
  };
  const ROAD_ITEM_SOURCES = DATA.roadItemSources;
  const ELITE_ITEM_SOURCES = DATA.eliteItemSources;

  function roadItemName(key) {
    return ROAD_ITEM_NAMES[key]?.[language() === "en" ? 1 : 0] || key;
  }

  function conditionLeaves(condition) {
    if (!condition) return [];
    return condition.kind === "all" ? (condition.list || []).flatMap(conditionLeaves) : [condition];
  }

  function specialItemHeld(save, key) {
    return Number(save.items?.[key] || 0) + Number(save.link?.stash?.items?.[key] || 0) > 0;
  }

  function orbFarmNeeds(save) {
    const needed = new Set();
    for (const zone of DATA.specialZones) {
      if (!regionInCollectionScope(save, zone.region) || isSpecialComplete(save, zone.id)) continue;
      for (const condition of conditionLeaves(zone.condition)) {
        const key = condition.item;
        if (condition.kind === "item" && ROAD_ITEM_NAMES[key] && !specialItemHeld(save, key)
          && !save.adv.gifts?.[key]) needed.add(key);
      }
    }
    return [...needed].map((key) => ({ key }));
  }

  function inOrbChapter(save, index) {
    const adv = save.adv;
    return adv.chapter === index && !adv.zone && !adv.event && !adv.league && !adv.tower;
  }

  function orbItemNodes(save, plan) {
    if (!inOrbChapter(save, plan.chapter)) return [];
    // 游戏在道具节点结算时才读取 loot；有 find 的糖果或固定奖励不会走该判定。
    const progress = Number(save.adv.node) || 0;
    return (save.adv.nodes || []).flatMap((node, index) => (
      index >= progress && (node.ch == null || node.ch === plan.chapter)
      && (plan.trainerGoal ? node.type === "trainer" : node.type === "item" && !node.find
        && plan.orbs.some(({ key }) => node.loot?.[key])) ? [index] : []
    ));
  }

  function orbFarmPlan(save) {
    const missing = new Set(orbFarmNeeds(save).map(({ key }) => key));
    if (!missing.size) return null;
    const grouped = new Map();
    for (const source of ROAD_ITEM_SOURCES) {
      if (!missing.has(source.key) || source.chapter > save.adv.unlocked) continue;
      const current = chapter(source.chapter);
      if (!current || !regionInCollectionScope(save, current.region)
        || (source.badge && !save.adv.badges?.includes(source.badge))
        || !source.owns.every((id) => ownsSpecialPrerequisite(save, id))) continue;
      const plan = grouped.get(source.chapter) || { orbFarm: true, chapter: source.chapter,
        chapterName: current.name, region: current.region, orbs: [], routeCost: 0 };
      if (plan.orbs.some(({ key }) => key === source.key)) continue;
      plan.orbs.push({ key: source.key });
      plan.routeCost = Math.max(plan.routeCost, source.step);
      grouped.set(source.chapter, plan);
    }
    const plans = [...grouped.values()];
    // 利用本轮节点，然后选覆盖道具多、所需路段短的章节。
    plans.sort((a, b) => Number(orbItemNodes(save, b).length > 0) - Number(orbItemNodes(save, a).length > 0)
      || b.orbs.length - a.orbs.length || a.routeCost - b.routeCost);
    return plans[0] || null;
  }

  function orbFarmLabel(plan) {
    if (plan.trainerGoal) return language() === "en" ? "Trainer victories" : "刷地区训练家胜场";
    const onlyOrbs = plan.orbs.every(({ key }) => key.endsWith("-orb"));
    const action = language() === "en" ? (onlyOrbs ? "Farming orbs" : "Farming prerequisite items")
      : (onlyOrbs ? "刷取宝珠" : "刷取神兽前置道具");
    return `${action} · ${plan.orbs.map(({ key }) => roadItemName(key)).join("、")}`;
  }

  function canContinueOrbFarm(save, plan) {
    return !runtime.paused && ["roaming", "combined"].includes(runtime.mode)
      && !save.adv.battle && !save.adv.pending
      && regionInCollectionScope(save, plan.region)
      && (plan.trainerGoal ? Number(save.stats?.byReg?.[plan.region]?.trainers || 0) < plan.trainerGoal
        : orbFarmPlan(save)?.orbs.some(({ key }) => plan.orbs.some((orb) => orb.key === key)));
  }

  async function orbFarmTick(save, plan) {
    if (!canContinueOrbFarm(save, plan)) return;
    const key = plan.trainerGoal ? `trainers:${plan.chapter}` : `orb:${plan.chapter}`;
    const changingRoute = runtime.target !== key;
    runtime.targetPlan = plan;
    runtime.waitingPlan = null;
    if (changingRoute) {
      runtime.target = key;
      runtime.teamPlan = null;
      runtime.userTeamOverride = false;
      runtime.attempts = 0;
      log(`${orbFarmLabel(plan)} · ${plan.chapterName}`);
    }

    if (!inOrbChapter(save, plan.chapter)) {
      await exclusive("前往神兽前置路线", () => switchChapter(plan.chapter));
      return;
    }
    if (!runtime.teamPlan && !settings.lockTeam5) {
      await exclusive("配置神兽前置路线队伍", async () => {
        const current = readSave();
        if (!canContinueOrbFarm(current, plan) || !inOrbChapter(current, plan.chapter)) return;
        const pool = settings.candidatePool.enabled ? preferredTeamCandidates(current) : null;
        const team = recommendTeam(current, targetEnemiesForChapter(plan.chapter), {
          candidateOverride: pool,
          targetLevel: chapter(plan.chapter)?.ace,
          levelWeight: COLLECTION_LEVEL_WEIGHT,
          preferredLevel: ROAMING_PREFERRED_LEVEL,
        });
        if (!team.mons.length) {
          diagnostic("神兽前置路线", new Error("当前没有符合候选条件的出战队员"), {
            suggestion: "请检查该地区候选池和最低有效 BST，或锁定第五队并手动安排出战后重启。",
          });
          return;
        }
        await applyRecommendedTeam(team, plan.chapterName);
        if (canContinueOrbFarm(readSave(), plan)) await openScreen("adventure");
      });
      return;
    }

    if (orbItemNodes(save, plan).length) return;
    await exclusive("重开神兽前置路线", async () => {
      const latest = readSave();
      if (!canContinueOrbFarm(latest, plan) || !inOrbChapter(latest, plan.chapter) || orbItemNodes(latest, plan).length) return;
      const mayRestart = (fresh) => canContinueOrbFarm(fresh, plan) && inOrbChapter(fresh, plan.chapter) && !orbItemNodes(fresh, plan).length;
      const restarted = await switchChapter(plan.chapter, { restart: true, settle: false, allowRestart: mayRestart });
      if (restarted !== null) {
        runtime.attempts += 1;
        return;
      }
      const waiting = readSave();
      if (!mayRestart(waiting)) return;
      // 进度为0时游戏不会出现「重新开始」。用最近的普通章节中转，触发原生生成。
      const transit = normalTransitChapter(waiting, plan);
      if (!transit) throw new Error("没有可用的普通中转章节");
      await switchChapter(transit.index, { settle: false });
      const fresh = readSave();
      if (!canContinueOrbFarm(fresh, plan)) return;
      await switchChapter(plan.chapter, { settle: false });
      runtime.attempts += 1;
    });
  }

  function roadDexConditionIds(condition, special) {
    const { kind } = condition;
    if (!["dex", "type", "types", "count"].includes(kind)) return [];
    const range = kind === "types" ? condition.dex : special.dex;
    if (!range) return [];
    return Object.keys(DATA.species).map(Number).filter((id) => {
      const meta = species(id);
      if (id < range[0] || id > range[1] || meta?.m) return false;
      if (kind === "count") return !meta.g;
      if (kind === "type") return !meta.g && meta.t?.includes(condition.type);
      if (kind === "types") return id !== special.id && !(meta.g && id >= special.dex[0])
        && meta.t?.some((type) => condition.types.includes(type));
      return true;
    });
  }

  function roadPrerequisiteZones(save) {
    return specialChoiceIds().flatMap((id) => {
      const zone = DATA.specialZones.find((item) => item.id === id);
      return zone && !isSpecialComplete(save, id) && regionInCollectionScope(save, zone.region)
        && DATA.chapters.some((item) => item.region === zone.region && item.index <= save.adv.unlocked)
        && (!zone.badge || save.adv.badges?.includes(zone.badge)) ? [zone] : [];
    });
  }

  function roadDexPrerequisitePlan(save, zones) {
    if (save.adv.capture?.on === false) return null;
    const wanted = new Map();
    for (const zone of zones) {
      for (const condition of conditionLeaves(zone.condition)) {
        if (!["owns", "dex", "type", "types", "count"].includes(condition.kind)
          || specialConditionStatus(save, condition, zone).met) continue;
        const ids = condition.kind === "owns" ? condition.ids.filter((id) => !ownsSpecialPrerequisite(save, id))
          : roadDexConditionIds(condition, zone);
        for (const id of ids) if (!wanted.has(id) && !isCaught(save, id)) wanted.set(id, zone.id);
      }
    }
    if (!wanted.size) return null;
    const current = runtime.targetPlan;
    if (current?.prerequisiteFor && wanted.has(current.speciesId)) {
      const stillAvailable = plansForSpecies(save, current.speciesId).find((item) => item.chapter === current.chapter && item.zone === current.zone);
      if (stillAvailable) return { ...stillAvailable, prerequisiteFor: wanted.get(current.speciesId) };
    }
    const next = refreshCollectionQueue(save).find((plan) => !plan.special && wanted.has(plan.speciesId));
    return next ? { ...next, prerequisiteFor: wanted.get(next.speciesId) } : null;
  }

  function trainerPrerequisitePlan(save, zones) {
    for (const zone of zones) {
      const condition = conditionLeaves(zone.condition).find((item) => item.kind === "tally" && item.field === "trainers"
        && !specialConditionStatus(save, item, zone).met);
      if (!condition) continue;
      const left = condition.need - Number(save.stats?.byReg?.[zone.region]?.trainers || 0);
      const routes = DATA.chapters.filter((item) => item.region === zone.region && !item.league && item.index <= save.adv.unlocked)
        .map((item) => {
          let cost = 0, trainers = 0;
          for (const step of item.steps || []) {
            if (step.kind === "gym" || trainers >= left) break;
            if (step.kind === "route") {
              trainers += step.trainers || 0;
              cost += (step.trainers || 0) * 3 + (step.wild || 0);
            } else if (step.kind === "trainer") { trainers += 1; cost += 3; }
            else cost += 0.25;
          }
          return { orbFarm: true, chapter: item.index, chapterName: item.name, region: zone.region,
            trainerGoal: condition.need, score: trainers / Math.max(1, cost), targetId: zone.id };
        }).filter((item) => item.score > 0);
      routes.sort((a, b) => Number(orbItemNodes(save, b).length > 0) - Number(orbItemNodes(save, a).length > 0)
        || b.score - a.score || a.chapter - b.chapter);
      if (routes[0]) return routes[0];
    }
    return null;
  }

  function legendaryStoryPrerequisitePlan(save) {
    if (!settings.autoPushForCollection) return null;
    for (const id of specialChoiceIds()) {
      const zone = DATA.specialZones.find((item) => item.id === id);
      if (!zone || isSpecialComplete(save, id) || !regionInCollectionScope(save, zone.region)) continue;
      if (!specialNeedsStoryUnlock(save, zone)) continue;
      if (!settings.lockTeam5 && settings.candidatePool.enabled && currentRegion(save) === zone.region
        && !preferredTeamCandidates(save).length) continue;
      const frontier = DATA.chapters.findLast((chapter) => chapter.region === zone.region && chapter.index <= save.adv.unlocked);
      if (!frontier) continue;
      return { unlockForCollection: true, legendaryStory: true, region: zone.region, chapter: frontier.index,
        chapterName: frontier.name, targetId: id, unlockedAtStart: save.adv.unlocked };
    }
    return null;
  }

  // 碑文答案和队伍限制来自游戏原生的 LegendZones 表。
  const INSCRIPTION_RULES = {
    regirock: { type: "fighting" },
    regice: { wait: true },
    registeel: { type: "flying" },
    regigigas: { team: [377, 378, 379] },
    keldeo: { team: [638, 639, 640] },
    landorus: { team: [641, 642] },
  };
  const ELITE_UNLOCK_BADGE = "Forêt";

  function legendaryName(id) {
    return species(id)?.n || String(id);
  }

  function inscriptionCandidates(save, rule) {
    const ready = availableTeamCandidates(save);
    const current = ready.filter((mon) => save.team?.includes(mon.uid));
    const pick = (list) => rule.team ? rule.team.map((id) => list.find((mon) => mon.id === id)).filter(Boolean)
      : list.filter((mon) => species(mon.id)?.t.includes(rule.type)).slice(0, 1);
    const needed = rule.team?.length || 1;
    const selected = pick(current);
    if (selected.length === needed) return { answer: selected[0] };
    if (settings.lockTeam5 || runtime.userTeamOverride) return { reason: language() === "en"
      ? "Add the required Pokémon to the active team" : "将碑文要求的宝可梦加入当前出战队伍" };
    const choices = settings.candidatePool.enabled ? preferredTeamCandidates(save) : ready;
    const required = pick(choices);
    if (required.length < needed) return { reason: language() === "en"
      ? "Required Pokémon unavailable in the eligible candidate pool" : "当前可出战候选池缺少碑文要求的成员" };
    const lineup = [...required];
    for (const mon of [...current, ...choices]) {
      if (lineup.length === 6) break;
      if (choices.includes(mon) && !lineup.some((member) => teamIdentity(member) === teamIdentity(mon))) lineup.push(mon);
    }
    return { answer: required[0], lineup };
  }

  function inscriptionStatus(save, key) {
    const rule = INSCRIPTION_RULES[key];
    if (!rule) return t("specialConditionLocked");
    const en = language() === "en";
    if (rule.wait) return en ? "Inscription: wait at the wall" : "碑文：原地等待两分钟";
    const missing = (rule.team || []).filter((id) => !ownsSpecialPrerequisite(save, id));
    const task = rule.team ? (en ? "Inscription team: " : "碑文出战队伍：") + rule.team.map(legendaryName).join("、")
      : rule.type === "fighting" ? (en ? "Inscription: show a Fighting Pokémon" : "碑文：展示格斗属性宝可梦")
        : (en ? "Inscription: show a Flying Pokémon" : "碑文：展示飞行属性宝可梦");
    if (missing.length) return task + (en ? " (missing " : "（缺少") + missing.map(legendaryName).join("、") + (en ? ")" : "）");
    const option = currentRegion(save) === DATA.specialZones.find((zone) => zone.condition?.key === key)?.region
      ? inscriptionCandidates(save, rule) : {};
    return option.reason ? task + "；" + option.reason : task;
  }

  function elitePrerequisiteStatus(save, rule) {
    const mon = legendaryName(rule.zone);
    const en = language() === "en";
    const remaining = [en ? `Defeat ${mon} at Elite ${rule.tier}` : `击败${mon}精英第 ${rule.tier} 阶`];
    if (!ownsSpecialPrerequisite(save, rule.zone)) remaining.push(en ? `Own ${mon}` : `需要拥有${mon}`);
    if (!save.adv.badges?.includes(ELITE_UNLOCK_BADGE)) remaining.push(en
      ? "Unlock the Underground with the Forest Badge" : "取得森林徽章以开放地下通道");
    const base = DATA.specialZones.find((zone) => zone.id === rule.zone);
    if (base) remaining.push(specialTimingStatus(save, base));
    return remaining.filter(Boolean).join("；");
  }

  function independentConditionPlan(save, zones) {
    const en = language() === "en";
    for (const zone of zones) {
      for (const condition of conditionLeaves(zone.condition)) {
        const rule = INSCRIPTION_RULES[condition.key];
        const eliteReward = condition.kind === "item" && !specialItemHeld(save, condition.item)
          ? ELITE_ITEM_SOURCES.find((source) => source.key === condition.item) : null;
        const eliteRule = condition.kind === "elite" ? condition : eliteReward;
        const sealed = condition.kind === "door" && rule && !save.zoneDoors?.[condition.key]
          && (rule.team || []).every((id) => ownsSpecialPrerequisite(save, id));
        const elite = eliteRule && save.adv.badges?.includes(ELITE_UNLOCK_BADGE)
          && ownsSpecialPrerequisite(save, eliteRule.zone)
          && Number(save.elite?.[eliteRule.zone]?.t || 0) < eliteRule.tier;
        if (!sealed && !elite) continue;
        // Several forms also need their base species. It has its own place in the capture queue.
        if (elite && conditionLeaves(zone.condition).some((leaf) => leaf.kind === "owns"
          && !leaf.ids.every((id) => ownsSpecialPrerequisite(save, id)))) continue;
        const base = elite ? DATA.specialZones.find((item) => item.id === eliteRule.zone) : zone;
        if (!base || specialTimingStatus(save, base) || !regionInCollectionScope(save, base.region)) continue;
        const key = elite ? `elite:${base.id}:${Number(save.elite?.[base.id]?.t || 0) + 1}` : `door:${condition.key}`;
        const chapter = DATA.chapters.find((item) => item.region === base.region && !item.league
          && item.index === base.anchor && item.index <= save.adv.unlocked)
          || DATA.chapters.findLast((item) => item.region === base.region && !item.league && item.index <= save.adv.unlocked);
        if (!chapter || runtime.independentBlocks.get(key)?.until > Date.now()) continue;
        if (sealed && !rule.wait && currentRegion(save) === base.region && inscriptionCandidates(save, rule).reason) continue;
        const tier = elite ? Number(save.elite?.[base.id]?.t || 0) + 1 : null;
        return { independent: key, condition: eliteReward ? { ...condition, ...eliteReward } : condition,
          rule, region: base.region, speciesId: base.id, forId: zone.id,
          zone: base.zone, chapter: chapter.index, level: 100, eliteTier: tier,
          label: elite ? `${en ? "Elite" : "精英"} ${tier} · ${legendaryName(base.id)}`
            : `${en ? "Inscription" : "解碑文"} · ${legendaryName(base.id)}` };
      }
    }
    return null;
  }

  function independentRunning() {
    return !runtime.paused && !runtime.error && ["roaming", "combined"].includes(runtime.mode);
  }

  function independentInside(save, plan) {
    return Number(save.adv.zone?.id) === plan.speciesId && (plan.eliteTier
      ? Number(save.adv.zone.elite) === plan.eliteTier : save.adv.zone.riddle === plan.condition.key);
  }

  function independentComplete(save, plan) {
    return plan.eliteTier ? Number(save.elite?.[plan.speciesId]?.t || 0) >= plan.eliteTier
      : Boolean(save.zoneDoors?.[plan.condition.key]);
  }

  function independentDefer(plan, reason) {
    runtime.independentBlocks.set(plan.independent, { until: Date.now() + 180_000, reason });
    log(`${plan.label} · ${reason}`);
    runtime.independentRun = null;
    if (runtime.targetPlan?.independent === plan.independent) clearCollectionTarget();
  }

  async function enterIndependentZone(plan, prepare, activate) {
    await openChapterMap();
    const regionTab = document.querySelector(`#map-root .rg.open[data-rg="${plan.region}"]`);
    if (!regionTab || !independentRunning() || runtime.manualFixedTeam || nativeFixedEditor()) return false;
    await pacedClick(regionTab, plan.label);
    const row = document.querySelector(`#map-root .mp-row[data-ch="Z${plan.speciesId}"]`);
    if (!row || (!plan.eliteTier && !row.classList.contains("lz-seal"))) return false;
    await pacedClick(row, plan.label);
    const zoneTab = document.querySelector('#map-root [data-lz-view="zone"]:not(.on)');
    if (zoneTab) await pacedClick(zoneTab, plan.label);
    const selector = `#map-root .mp-go[data-zone="${plan.speciesId}"]`
      + (plan.eliteTier ? `[data-tier="${plan.eliteTier}"]` : ":not([data-tier])");
    const ready = () => {
      const button = document.querySelector(selector);
      return button && !button.disabled ? button : null;
    };
    if (!ready() || !independentRunning()) return false;
    if (prepare) await prepare();
    const fresh = readSave();
    const button = ready();
    if (!button || !independentRunning() || runtime.manualFixedTeam || nativeFixedEditor() || fresh.adv.battle || fresh.adv.pending || independentComplete(fresh, plan)) return false;
    activate();
    await pacedClick(button, plan.label);
    try {
      await waitFor(() => independentInside(readSave(), plan) || independentComplete(readSave(), plan),
        { timeout: 6000, label: plan.label });
      return true;
    } catch (error) {
      if (error.message !== `等待${plan.label}超时`) throw error;
      return false;
    }
  }

  async function executeIndependentCondition(save, plan) {
    runtime.target = plan.independent;
    runtime.targetPlan = plan;
    runtime.attempts = 0;
    if (currentRegion(save) !== plan.region) {
      await exclusive("前往独立条件地区", () => switchChapter(plan.chapter));
      return;
    }
    const answer = plan.eliteTier || plan.rule.wait ? null : inscriptionCandidates(save, plan.rule);
    if (answer?.reason) {
      independentDefer(plan, answer.reason);
      return;
    }
    await exclusive(plan.label, async () => {
      if (answer?.lineup) {
        await applyRecommendedTeam({ mons: answer.lineup, details: answer.lineup.map((mon) => ({ name: legendaryName(mon.id) })) }, plan.label);
        const current = inscriptionCandidates(readSave(), plan.rule);
        if (!independentRunning()) return;
        if (!current.answer || current.lineup) {
          independentDefer(plan, "原生队伍里缺少碑文所需的成员");
          return;
        }
      }
      const activate = () => {
        runtime.independentRun = { plan, handled: false };
      };
      const entered = await enterIndependentZone(plan, null, activate);
      if (!entered) {
        if (runtime.manualFixedTeam || nativeFixedEditor()) return;
        independentDefer(plan, plan.eliteTier ? "游戏精英入口暂未开放，请查看地下通道解锁状态和时间条件" : "游戏碑文入口暂未开放");
        if (independentRunning() && !readSave().adv.battle && !readSave().adv.pending) await openScreen("adventure");
        return;
      }
      if (plan.eliteTier) adoptEliteSelection(readSave(), runtime.independentRun);
    });
  }

  function resumeIndependentCondition(save) {
    const active = save.adv.zone;
    if (!active?.riddle && !active?.elite) return null;
    const zones = roadPrerequisiteZones(save).filter((zone) => conditionLeaves(zone.condition).some((rule) =>
      (rule.kind === "door" && rule.key === active.riddle && zone.id === Number(active.id))
      || (rule.kind === "elite" && rule.zone === Number(active.id) && rule.tier >= Number(active.elite))));
    const plan = independentConditionPlan(save, zones);
    if (!plan || !independentInside(save, plan)) return null;
    if (plan.rule && !plan.rule.wait) {
      const answer = inscriptionCandidates(save, plan.rule);
      if (!answer.answer || answer.lineup) return null;
    }
    runtime.target = plan.independent;
    runtime.targetPlan = plan;
    runtime.independentRun = { plan, handled: false };
    if (plan.eliteTier) adoptEliteSelection(save, runtime.independentRun);
    return runtime.independentRun;
  }

  function adoptEliteSelection(save, run, tried = new Set()) {
    const signature = fixedTeamSignature(save, run.plan);
    if (signature !== "[]") tried.add(signature);
    Object.assign(run, { signature, tried, exhausted: false, tries: Number(save.adv.zone?.tries || 1) });
    runtime.attempts = 0;
    runtime.teamPlan = null;
    showFixedTeam(save, run.plan, "当前精英出阵阵容");
  }

  async function continueIndependentCondition(save) {
    if (!independentRunning()) return false;
    if (runtime.manualFixedTeam || nativeFixedEditor()) return true;
    const run = runtime.independentRun || resumeIndependentCondition(save);
    if (!run) return false;
    const { plan } = run;
    if (independentComplete(save, plan)) {
      log(`${plan.label} · 已满足`);
      runtime.independentRun = null;
      clearCollectionTarget();
      return false;
    }
    if (!independentInside(save, plan)) {
      independentDefer(plan, "已离开原生地点，稍后重新检查条件");
      return false;
    }
    if (save.adv.battle && !plan.eliteTier) return true;
    if (!plan.eliteTier) {
      const pending = save.adv.pending;
      if (pending?.type !== "riddle" || pending.waitAt) return true;
      const control = document.querySelector(`#arena .rd-acts [data-rd="${run.handled ? "pass" : plan.rule.wait ? "wait" : "show"}"]`);
      if (!control || control.disabled) return true;
      await exclusive(plan.label, async () => {
        if (!independentRunning()) return;
        if (run.handled) {
          await pacedClick(control, "退出本次碑文尝试");
          return;
        }
        const current = readSave();
        const nativeTeam = availableTeamCandidates(current).filter((mon) => current.team?.includes(mon.uid));
        const answer = nativeTeam.find((mon) => plan.rule.team ? plan.rule.team.includes(mon.id) : species(mon.id)?.t.includes(plan.rule.type));
        if (!plan.rule.wait && (!answer || plan.rule.team?.some((id) => !nativeTeam.some((mon) => mon.id === id)))) return;
        await pacedClick(control, plan.label);
        if (plan.rule.wait) return;
        const card = await waitFor(() => document.querySelector(`.rd-dlg .rd-mon[data-uid="${CSS.escape(String(answer.uid))}"]`),
          { label: "碑文队员选择" });
        if (!independentRunning()) return;
        await pacedClick(card, legendaryName(answer.id));
        run.handled = true;
      });
      return true;
    }
    if (run.signature !== fixedTeamSignature(save, plan)) adoptEliteSelection(save, run);
    const tries = Number(save.adv.zone.tries || 1);
    if (!fixedTeamFighting(save, run.signature)) run.tries = tries;
    const losses = Math.max(0, tries - run.tries);
    runtime.attempts = losses;
    if (save.adv.battle || save.adv.pending || run.exhausted || losses < SPECIAL_ROTATE_AFTER) return true;
    await exclusive("精英三连败换队", async () => {
      const isActive = (current) => runtime.independentRun === run && independentInside(current, plan) && !independentComplete(current, plan);
      const fresh = readSave();
      if (fresh.adv.battle || fresh.adv.pending || !isActive(fresh)) return;
      const result = await automaticFixedTeam(plan, Number(fresh.adv.zone.foe ?? plan.speciesId), run.tried, run.signature, isActive);
      if (result.team) {
        const latest = readSave();
        adoptEliteSelection(latest, run, run.tried);
        showFixedTeam(latest, plan, result.team.usesPopularity ? "精英已按最常选用换队" : "精英已按对位换队", result.team);
      } else if (result.exhausted) {
        run.exhausted = true;
        showFixedTeam(readSave(), plan, "无新的合格精英阵容，可手动换队");
      }
      if (!runtime.manualFixedTeam && !nativeFixedEditor() && independentRunning()
        && document.querySelector("#screen-map.active")) await openScreen("adventure");
    });
    return true;
  }

  async function legendaryCollectionTick(save, collectMissing) {
    const old = runtime.targetPlan;
    if (old?.special && isSpecialComplete(save, old.speciesId)) {
      notifyUser("神兽捕获成功", `${species(old.speciesId)?.n || old.speciesId}已登记图鉴`);
      clearCollectionTarget();
    }

    // 让已进入的普通捕获挑战自然跑完，除非前面的徘徊调度接管。
    const activeId = Number(save.adv.zone?.id);
    if (insideNormalSpecial(save, activeId)) {
      const activePlan = specialPlansForSpecies(save, activeId)[0];
      if (activePlan) {
        await specialCollectionTick(save, activePlan);
        return true;
      }
      if (old?.special && old.speciesId === activeId) return true;
    }

    // 协同模式尊重手填普通目标，例如 479-A；徘徊目标仍按原有实时优先级处理。
    for (const id of settings.manualTargets) {
      if (isCaught(save, id) || ROAMING_LEGENDARIES.includes(id)) continue;
      const plan = specialPlansForSpecies(save, id)[0];
      if (plan) {
        await specialCollectionTick(save, plan);
        return true;
      }
      if (collectMissing && plansForSpecies(save, id).length) {
        if (runtime.targetPlan?.orbFarm || runtime.targetPlan?.prerequisiteFor) clearCollectionTarget();
        return false;
      }
    }

    // 宝珠任务和由它解锁的捕获优先于普通自动神兽目标。
    const unlockedOrbTarget = [483, 484, 487, 48701].map((id) => specialPlansForSpecies(save, id)[0]).find(Boolean);
    if (unlockedOrbTarget) {
      await specialCollectionTick(save, unlockedOrbTarget);
      return true;
    }
    const farm = orbFarmPlan(save);
    if (farm) {
      await orbFarmTick(save, farm);
      return true;
    }
    const plan = specialChoiceIds().map((id) => specialPlansForSpecies(save, id)[0]).find(Boolean);
    if (plan) {
      await specialCollectionTick(save, plan);
      return true;
    }
    const zones = roadPrerequisiteZones(save);
    const independent = independentConditionPlan(save, zones);
    if (independent) {
      await executeIndependentCondition(save, independent);
      return true;
    }
    const dex = roadDexPrerequisitePlan(save, zones);
    if (dex) {
      await collectTick(save, { trackRoamers: false, collectMissing: true, prerequisitePlan: dex });
      return true;
    }
    const trainers = trainerPrerequisitePlan(save, zones);
    if (trainers) {
      await orbFarmTick(save, trainers);
      return true;
    }
    if (!collectMissing) {
      const story = legendaryStoryPrerequisitePlan(save);
      if (story) {
        await collectionUnlockTick(save, story);
        return true;
      }
    }
    if (runtime.targetPlan?.special || runtime.targetPlan?.orbFarm || runtime.targetPlan?.prerequisiteFor) clearCollectionTarget();
    return false;
  }

  function legendaryManualStatus(save, id) {
    if (id === 489) return language() === "en" ? "Day Care: hatch a Phione egg" : "寄放屋：玛纳霏或霏欧纳配合百变怪产蛋后孵化";
    if (id === 490) return language() === "en" ? "After the Sinnoh League: sea-route egg drop, then hatch" : "神奥冠军后：220／223／226号水路掉蛋后孵化";
    if (id === 493) return language() === "en" ? "World Boss: Hall of Origin, when the game opens it" : "世界首领：初始之间，开放后从游戏活动页挑战";
    if (species(id)?.u === 493) return language() === "en" ? "Arceus with the matching Underground plate" : "阿尔宙斯使用对应的地下通道石板变换形态";
    return t("waitingCondition");
  }

  function fixedLegendaryListHtml(save) {
    if (!save) return "";
    const visible = DATA.specialZones.filter((item) => regionInCollectionScope(save, item.region));
    const ids = visible.map(({ id }) => id);
    if (regionInCollectionScope(save, "sinnoh")) {
      ids.push(489, 490, 493, ...Object.keys(DATA.species).map(Number).filter((id) => species(id)?.u === 493));
    }
    return ids.map((id) => {
      const status = specialTargetStatus(save, id);
      const reason = isSpecialComplete(save, id) ? t("caught")
        : status ? `${status.special.zone} · ${status.open ? t("available") : status.reason}`
          : legendaryManualStatus(save, id);
      const label = `#${speciesDisplayNumber(id)} ${species(id)?.n || id}`;
      return `<div class="pca-target"><b>${escapeHtml(label)}</b><small>${escapeHtml(reason)}</small></div>`;
    }).join("");
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
      if ((item.staticEncounters || []).some((encounter) => Number(encounter.id) === Number(speciesId))) return true;
    }
    return false;
  }

  function storyLockedChapterForSpecies(save, speciesId) {
    return chaptersInCollectionScope(save, { includeStoryLocked: true })
      .filter((item) => item.index > save.adv.unlocked)
      .find((item) => item.routes.some((route) => routeCanContainSpecies(route, speciesId))
        || (item.staticEncounters || []).some((encounter) => Number(encounter.id) === Number(speciesId))) || null;
  }

  function specialNeedsStoryUnlock(save, special) {
    if (special.badge && !save.adv.badges?.includes(special.badge)) return true;
    if (conditionLeaves(special.condition).some((condition) => condition.kind === "league" && !specialConditionStatus(save, condition, special).met)) return true;
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
      const targetId = targetIds.find((id) => locked.some((item) => (
        item.routes.some((route) => routeCanContainSpecies(route, id))
        || (item.staticEncounters || []).some((encounter) => Number(encounter.id) === Number(id))
      )));
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
      if (isSpecialComplete(save, Number(id))) continue;
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
    const activeSpecialBlocks = [...runtime.specialEntryBlocks.keys()].filter((id) => specialEntryIssue(id)).join(",");
    const liveStatics = save.adv.nodes?.filter((node, index) => node.type === "static" && index >= (save.adv.node ?? 0));
    const ownedLegendaries = Object.keys(DATA.species).filter((id) => {
      const mon = species(id);
      return (mon.g || mon.m) && ownsSpecialPrerequisite(save, Number(id));
    });
    const nativeCounters = [save.adv.zone?.id, save.adv.zone?.foe, specialMoonAt(now),
      liveStatics?.map((node) => node.id).join(","), activeSpecialBlocks, ownedLegendaries.join(","),
      JSON.stringify(save.link?.stash?.items || {})];
    const teamLevels = REGION_ORDER
      .map((region) => `${region}:${collectionTeamLevelForRegion(save, region).toFixed(2)}`)
      .join(",");
    return [Math.floor(now / DATA.weather.slotMs), daytimePhaseAt(now), caught, settings.regionScope,
      settings.customRegions.join(","), settings.manualTargets.join(","), roamWeather, unlocks, teamLevels, nativeCounters.join(":")].join(";");
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

  function savedStaticPlanStatus(save, plan) {
    const nodes = Array.isArray(save?.adv?.nodes) ? save.adv.nodes : [];
    const target = nodes.findIndex((node) => node?.type === "static" && Number(node?.id) === Number(plan.speciesId));
    return {
      nodes,
      target,
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
    const frontier = actualStoryChapter(save, frontierData.index);
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
      const plan = recommendTeam(save, targetEnemiesForChapter(frontier), {
        excludedSignatures: failures,
        targetLevel: chapter(frontier)?.ace,
        chapterIndex: frontier,
      });
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
        const plan = recommendTeam(save, targetEnemiesForChapter(frontier), {
          excludedSignatures: failed,
          targetLevel: chapter(frontier)?.ace,
          chapterIndex: frontier,
        });
        notifyUser("阵容需要调整", `同一章节连续失败，重新配置${chapter(frontier)?.name || "当前章节"}阵容。`);
        await exclusive("失败后重新配队", () => applyRecommendedTeam(plan, "连续失败后调整"));
      }
    }
    runtime.lastDeaths[frontier] = deaths;
  }

  async function collectionUnlockTick(save, plan) {
    const actual = actualStoryChapter(save, plan.frontier ?? plan.chapter);
    // 保留原剧情前沿用于判定何时重新扫描，配队则按当前联盟成员。
    const frontier = plan.frontier ?? plan.chapter;
    plan = { ...plan, frontier, chapter: actual, chapterName: chapter(actual)?.name || plan.chapterName };
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
      const team = recommendTeam(fresh, targetEnemiesForChapter(plan.chapter), {
        candidateOverride: plan.legendaryStory && settings.candidatePool.enabled ? preferredTeamCandidates(fresh) : null,
        targetLevel: chapter(plan.chapter)?.ace,
        chapterIndex: plan.chapter,
      });
      if (plan.legendaryStory && !team.mons.length && settings.lockTeam5) return;
      await exclusive("配置全收集推图阵容", () => applyRecommendedTeam(team, `${plan.chapterName} · 解锁更多图鉴`));
      log(`为全收集推进${plan.chapterName}；下一次章节解锁后立即重新扫描`);
    }
  }

  async function collectTick(save, { trackRoamers, collectMissing, prerequisitePlan = null }) {
    if (prerequisitePlan) {
      const old = runtime.targetPlan;
      if (!old?.prerequisiteFor || old.speciesId !== prerequisitePlan.speciesId || old.chapter !== prerequisitePlan.chapter
        || old.zone !== prerequisitePlan.zone) clearCollectionTarget();
    }
    const roamers = trackRoamers ? activeRoamers(save).filter((item) => regionInCollectionScope(save, chapter(item.chapter)?.region)) : [];
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
        if (currentRoamer.chapter !== runtime.targetPlan.chapter || save.adv.chapter !== currentRoamer.chapter || save.adv.zone) {
          runtime.targetPlan = { ...runtime.targetPlan, chapter: currentRoamer.chapter, chapterName: chapter(currentRoamer.chapter)?.name, until: currentRoamer.until };
          await exclusive("跟随徘徊神兽", () => switchChapter(currentRoamer.chapter));
        }
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
        const current = readSave().adv;
        if (current.chapter !== roamer.chapter || current.zone || current.event) await switchChapter(roamer.chapter);
        const plan = recommendRoamingTeam(readSave(), roamer.id);
        await applyRecommendedTeam(plan, species(roamer.id)?.n || String(roamer.id));
      });
      return;
    }

    if (trackRoamers && await legendaryCollectionTick(save, collectMissing)) return;

    if (!collectMissing) {
      if (runtime.target !== "roam:waiting") {
        runtime.target = "roam:waiting";
        runtime.targetPlan = null;
        runtime.teamPlan = null;
        runtime.teamStatus = t("waitingRoamers");
        runtime.attempts = 0;
        log(t("waitingRoamers"));
      }
      return;
    }

    if (runtime.targetPlan?.unlockForCollection) {
      const immediate = refreshCollectionQueue(save)[0] || null;
      const unlockedMore = save.adv.unlocked > runtime.targetPlan.unlockedAtStart;
      const finalBadge = chapter(runtime.targetPlan.frontier ?? runtime.targetPlan.chapter)?.boss?.badge;
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

    const preferred = prerequisitePlan || refreshCollectionQueue(save)[0] || null;
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

    if (runtime.targetPlan?.speciesId && !runtime.targetPlan.roaming && !isSpecialComplete(save, runtime.targetPlan.speciesId)) {
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

    if (!runtime.targetPlan || (runtime.targetPlan.speciesId && isSpecialComplete(save, runtime.targetPlan.speciesId))) {
      const next = prerequisitePlan || chooseMissingPlan(save);
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
        if (trackRoamers) {
          clearCollectionTarget();
          runtime.target = "roam:waiting";
          runtime.teamStatus = t("waitingRoamers");
          return;
        }
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
      if (next.special) { await specialCollectionTick(save, next); return; }
      await exclusive("规划缺失图鉴", async () => {
        const current = readSave().adv;
        if (current.chapter !== next.chapter || current.zone || current.event) await switchChapter(next.chapter);
        const targetSave = readSave();
        const plan = recommendTeam(targetSave, [next.speciesId], {
          candidateOverride: next.prerequisiteFor && settings.candidatePool.enabled ? preferredTeamCandidates(targetSave) : null,
          levelWeight: COLLECTION_LEVEL_WEIGHT,
          targetLevel: chapter(next.chapter)?.ace,
          chapterIndex: next.chapter,
        });
        await applyRecommendedTeam(plan, species(next.speciesId)?.n || String(next.speciesId));
      });
      return;
    }

    if (runtime.targetPlan.special) { await specialCollectionTick(save, runtime.targetPlan); return; }

    if (save.adv.chapter !== runtime.targetPlan.chapter || save.adv.zone) {
      const previousRegion = currentRegion(save);
      await exclusive("返回目标章节", async () => {
        await switchChapter(runtime.targetPlan.chapter);
        const targetSave = readSave();
        if (currentRegion(targetSave) !== previousRegion) {
          const plan = recommendTeam(targetSave, [runtime.targetPlan.speciesId], {
            levelWeight: COLLECTION_LEVEL_WEIGHT,
            targetLevel: chapter(runtime.targetPlan.chapter)?.ace,
            chapterIndex: runtime.targetPlan.chapter,
          });
          await applyRecommendedTeam(plan, species(runtime.targetPlan.speciesId)?.n || String(runtime.targetPlan.speciesId));
        }
      });
      return;
    }

    if (runtime.targetPlan.static) {
      const event = savedStaticPlanStatus(save, runtime.targetPlan);
      if (event.target < 0) {
        await exclusive("静态事件本轮未生成", () => resetChapter(runtime.targetPlan));
        return;
      }
      if (event.current > event.target) {
        runtime.attempts += 1;
        await exclusive("静态事件捕获未成功", () => resetChapter(runtime.targetPlan));
      }
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

  function fifthTeamSignature(save) {
    const team = Number(save.teamSets?.on) === 4 ? save.team : save.teamSets?.list?.[4];
    return (team || []).join("|");
  }

  function detectManualTeamChange(save) {
    if (runtime.targetPlan?.special) return;
    if (Date.now() - runtime.lastTeamCheckAt < 1_500 || !runtime.teamPlan || runtime.busy) return;
    runtime.lastTeamCheckAt = Date.now();
    const signature = fifthTeamSignature(save);
    if (runtime.lastTeamSignature && signature && signature !== runtime.lastTeamSignature) {
      runtime.userTeamOverride = true;
      runtime.teamStatus = "用户阵容（本目标不再覆盖）";
      runtime.lastTeamSignature = signature;
      log("检测到用户修改第五队，本目标改用用户阵容");
    }
  }

  async function tick() {
    if (runtime.busy) {
      try { await captureDebugState(readSave()); } catch (error) { log(`调试状态采集失败：${error.message}`, "error"); }
      renderStatus();
      return;
    }
    try {
      if (runtime.manualFixedTeam || nativeFixedEditor()) {
        await finishManualFixedTeam();
        renderStatus();
        return;
      }
      const save = readSave();
      await captureDebugState(save);
      if (save.adv?.event?.raid) {
        runtime.dailyRaidActiveRegion = save.adv.event.reg || null;
        renderStatus();
        return;
      }
      if (!settings.prioritizeDailyRaid) runtime.dailyRaidActiveRegion = null;
      const fixedZone = save.adv.zone && DATA.specialZones.some((zone) => zone.id === Number(save.adv.zone.id));
      if (fixedZone && document.querySelector("#screen-map.active")) {
        renderStatus();
        return;
      }
      const independentZone = fixedZone || runtime.independentRun;
      if (!runtime.paused && !runtime.error && runtime.mode !== "idle" && !independentZone && await prioritizeDailyRaid(save)) {
        renderStatus();
        return;
      }
      if (!runtime.paused && !runtime.error && !independentZone && await manageBuddy(save)) {
        renderStatus();
        return;
      }
      if (!runtime.paused && !runtime.error) await manageBerries(save);
      if (runtime.mode === "idle" || runtime.paused) {
        renderStatus();
        return;
      }
      const current = readSave();
      const active = !current.adv.zone?.elite && !current.adv.zone?.riddle ? Number(current.adv.zone?.id) : 0;
      if (active && (["roaming", "combined"].includes(runtime.mode) || runtime.targetPlan?.special)) {
        observeFixedFight(current, specialPlansForSpecies(current, active)[0]);
      }
      observeBattle(current);
      detectManualTeamChange(current);
      if (await continueIndependentCondition(current)) {
        renderStatus();
        return;
      }
      if (current.adv.battle || current.adv.pending || current.adv.zone?.riddle || current.adv.zone?.elite || current.adv.league || current.adv.tower) {
        renderStatus();
        return;
      }
      if (runtime.mode === "push") await pushTick(current);
      else if (runtime.mode === "collect") await collectTick(current, { trackRoamers: false, collectMissing: true });
      else if (runtime.mode === "roaming") await collectTick(current, { trackRoamers: true, collectMissing: false });
      else if (runtime.mode === "combined") await collectTick(current, { trackRoamers: true, collectMissing: true });
      renderStatus();
    } catch (error) {
      diagnostic("主循环", error);
    }
  }

  function startMode(mode) {
    const compatibility = validateCompatibility();
    if (!compatibility.ok) {
      diagnostic("兼容性检查", new Error(`缺少页面节点：${compatibility.missing.join(", ")}`));
      return;
    }
    if (!compatibility.verified) {
      log(`游戏版本${compatibility.build}尚未验证；关键页面结构正常，继续运行并保留结构安全检查`);
    }
    runtime.mode = mode;
    runtime.specialFight = null;
    runtime.independentBlocks.clear();
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
      roaming: "神兽收集",
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
    runtime.specialFight = null;
    runtime.manualFixedTeam = null;
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
      const group = ROAMING_GROUPS.find(({ ids }) => ids.includes(id));
      let status = t("notAppeared");
      if (save && roamingCaughtStatus(save, id).caught) status = t("caught");
      else if (save && !group.regions.some((region) => regionInCollectionScope(save, region))) status = t("specialOutsideScope");
      else if (save && !save.adv.badges?.includes(group.unlock)) {
        status = language() === "en" ? `Defeat the ${t(group.regions[0])} League` : `先通过${t(group.regions[0])}联盟`;
      }
      else if (Number.isInteger(roamingChapter) && until > now) {
        status = `${t("appearing")} · ${chapter(roamingChapter)?.name || `#${roamingChapter}`} · ${Math.ceil((until - now) / 60_000)} ${t("minutes")}`;
      }
      return `<div class="pca-priority-item"><b>${index + 1}. #${String(id).padStart(3, "0")} ${escapeHtml(meta?.n || id)}</b><span>${escapeHtml(status)}</span><button class="pca-btn" type="button" data-act="roam-up" data-roamer="${id}" ${index === 0 ? "disabled" : ""} aria-label="${t("moveUp")} ${escapeHtml(meta?.n || id)}">↑</button><button class="pca-btn" type="button" data-act="roam-down" data-roamer="${id}" ${index === ids.length - 1 ? "disabled" : ""} aria-label="${t("moveDown")} ${escapeHtml(meta?.n || id)}">↓</button></div>`;
    }).join("");
  }

  function renderRoamingPriority() {
    const root = document.querySelector("#pca-roaming-priority");
    if (root) root.innerHTML = roamingPriorityHtml();
    const fixed = document.querySelector("#pca-fixed-legendaries");
    if (fixed) {
      try { fixed.innerHTML = fixedLegendaryListHtml(readSave()); } catch { /* 游戏未就绪 */ }
    }
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
      .pca-head{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#20253a;border-bottom:1px solid #343b56;user-select:none}.pca-head b{flex:1}.pca-head button{cursor:pointer}.pca-ver{color:#8ea0ca;font-size:11px}.pca-project-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid #536080;border-radius:8px;color:#dbe5ff;background:#2b3350;text-decoration:none}.pca-project-icon:hover{background:#3a466c}.pca-project-icon svg{width:17px;height:17px;fill:currentColor}.pca-link-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}
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
      <div class="pca-head"><b>${t("assistant")}</b><select class="pca-select pca-lang" data-select-setting="language" aria-label="Language"><option value="auto" ${settings.language === "auto" ? "selected" : ""}>${t("auto")}</option><option value="zh" ${settings.language === "zh" ? "selected" : ""}>中文</option><option value="en" ${settings.language === "en" ? "selected" : ""}>English</option></select><span class="pca-ver">v${VERSION}</span><a class="pca-project-icon" href="${PROJECT_URL}" target="_blank" rel="noopener noreferrer" title="${t("author")}: stdAri · GitHub" aria-label="${t("author")}: stdAri · GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.29-5.27-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.97 10.97 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.39-5.29 5.68.42.36.79 1.06.79 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg></a><button class="pca-btn" data-act="float">${settings.floating ? t("dockWindow") : t("floatWindow")}</button><button class="pca-btn" data-act="collapse">${t("collapse")}</button></div>
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
            <details class="pca-box" open><summary>${t("fixedLegendaryHeading")}</summary><div id="pca-fixed-legendaries"></div></details>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "training" ? "active" : ""}" role="tabpanel" data-tabpanel="training">
          <div class="pca-card"><h4>${t("autoBuddyTitle")}</h4>
            <label class="pca-row"><input type="checkbox" data-setting="autoBuddy" ${settings.autoBuddy ? "checked" : ""}>${t("autoBuddy")}</label>
            <div class="pca-row"><label for="pca-buddy-scope">${t("autoBuddyScope")}</label><select id="pca-buddy-scope" class="pca-select pca-grow" data-select-setting="buddyScope"><option value="all" ${settings.buddyScope === "all" ? "selected" : ""}>${t("autoBuddyScopeAll")}</option><option value="team" ${settings.buddyScope === "team" ? "selected" : ""}>${t("autoBuddyScopeTeam")}</option><option value="box" ${settings.buddyScope === "box" ? "selected" : ""}>${t("autoBuddyScopeBox")}</option></select></div>
            <div id="pca-buddy-status" class="pca-note">${t("buddyNone")}</div>
            <div class="pca-note">${t("autoBuddyNote")}</div>
          </div>
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
          <div class="pca-card"><h4>${t("debugMode")}</h4>
            <label class="pca-row"><input type="checkbox" data-setting="debugBattle" ${settings.debugBattle ? "checked" : ""}>${t("debugMode")}</label>
            <div class="pca-note">${t("debugModeNote")}</div>
            <div class="pca-row"><label for="pca-debug-limit">${t("debugLimit")}</label><select id="pca-debug-limit" class="pca-select pca-grow" data-select-setting="debugLimit">${[20, 50, 100].map((value) => `<option value="${value}" ${Number(settings.debugLimit) === value ? "selected" : ""}>${value}</option>`).join("")}</select></div>
            <h4>${t("debugRuns")}</h4><div id="pca-debug-runs" class="pca-note">${t("debugEmpty")}</div>
            <div class="pca-row"><button class="pca-btn" data-act="debug-export">${t("debugExport")}</button><button class="pca-btn danger" data-act="debug-clear">${t("debugClear")}</button></div>
          </div>
          <div class="pca-card"><h4>${t("diagnostic")}</h4><div id="pca-error" class="pca-note">${t("noError")}</div><div class="pca-row"><button class="pca-btn" data-act="copydiag">${t("copyDiagnostic")}</button></div></div>
          <div class="pca-card"><h4>${t("projectLinks")}</h4><div class="pca-note">${t("author")}: <b>stdAri</b></div><div class="pca-row"><a class="pca-btn pca-link-btn" href="${PROJECT_URL}" target="_blank" rel="noopener noreferrer">${t("githubProject")}</a><a class="pca-btn primary pca-link-btn" href="${ISSUES_URL}" target="_blank" rel="noopener noreferrer">${t("reportIssue")}</a></div><div class="pca-note">${t("issueNote")}</div></div>
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
      else if (action === "fixed-manual") requestManualFixedTeam();
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
      else if (action === "debug-export") exportDebugRuns().catch((error) => log(`调试记录导出失败：${error.message}`, "error"));
      else if (action === "debug-clear") clearDebugRuns().catch((error) => log(`调试记录清空失败：${error.message}`, "error"));
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
        if (setting === "autoBuddy") {
          runtime.lastBuddyCheckAt = 0;
          runtime.buddyStatus = "";
          if (settings.autoBuddy) queueMicrotask(() => tick());
        }
        if (setting === "autoPushForCollection") {
          runtime.collectionQueueSignature = "";
          if (!settings.autoPushForCollection && runtime.targetPlan?.unlockForCollection) {
            runtime.target = null;
            runtime.targetPlan = null;
            runtime.teamPlan = null;
          }
        }
        if (setting === "debugBattle") {
          log(settings.debugBattle ? t("debugEnabled") : t("debugDisabled"));
          if (settings.debugBattle) {
            try { startDebugRun(readSave(), "debug-enabled"); } catch { /* game save may not be ready yet */ }
            observeDebugBattle();
          } else if (runtime.debugRun) {
            finishDebugRun("debug-disabled").catch((error) => log(`调试记录保存失败：${error.message}`, "error"));
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
      if (selectSetting === "buddyScope") {
        settings.buddyScope = ["all", "team", "box"].includes(event.target.value) ? event.target.value : "all";
        runtime.lastBuddyCheckAt = 0;
        runtime.buddyStatus = "";
        saveSettings();
        if (settings.autoBuddy) queueMicrotask(() => tick());
      }
      if (selectSetting === "debugLimit") {
        settings.debugLimit = [20, 50, 100].includes(Number(event.target.value)) ? Number(event.target.value) : 20;
        saveSettings();
        trimDebugRuns().then(refreshDebugRecent).catch((error) => log(`调试记录整理失败：${error.message}`, "error"));
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
    refreshDebugRecent();
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
    return `<div class="pca-summary" aria-label="${t("statusTitle")}"><div class="pca-summary-main"><span>${t("task")}<b data-status="mode">${t("idle")}</b></span><span>${t("target")}<b data-status="target">—</b></span><span>${t("progress")}<b data-status="attempts">0</b></span></div><div class="pca-summary-extra"><span>${t("place")}<b data-status="place">—</b></span><span>${t("buffs")}<b data-status="buffs">—</b></span><span><span data-status="team-label">${t("fifthTeam")}</span><b data-status="team" class="pca-team">${t("notGenerated")}</b></span><button type="button" class="pca-btn" data-act="fixed-manual" hidden>${language() === "en" ? "Edit zone team" : "手动换队"}</button></div></div>`;
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
      if (!settings.floating || event.button !== 0 || event.target.closest("a,button,select,input")) return;
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
    if (fixedManualPlan(readSave())) return requestManualFixedTeam();
    if (!runtime.targetPlan) return alert("当前没有目标");
    runtime.userTeamOverride = false;
    const save = readSave();
    const storyTarget = runtime.target?.startsWith("push:") || runtime.target?.startsWith("unlock:");
    const enemyIds = storyTarget
      ? targetEnemiesForChapter(save.adv.chapter)
      : [runtime.targetPlan.speciesId].filter(Boolean);
    const levelWeight = storyTarget ? DEFAULT_LEVEL_WEIGHT : COLLECTION_LEVEL_WEIGHT;
    const targetLevel = storyTarget ? chapter(save.adv.chapter)?.ace : chapter(runtime.targetPlan.chapter)?.ace;
    const plan = runtime.targetPlan.roaming
      ? recommendRoamingTeam(save, runtime.targetPlan.speciesId)
      : recommendTeam(save, enemyIds, { levelWeight, targetLevel, chapterIndex: storyTarget ? save.adv.chapter : null });
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
      .filter((id) => specialTargetStatus(save, id) || potentialWildTarget(save, id, { includeStoryLocked: true }));
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
        : runtime.targetPlan?.independent ? runtime.targetPlan.label
        : runtime.targetPlan?.orbFarm ? orbFarmLabel(runtime.targetPlan)
        : runtime.targetPlan?.prerequisiteFor ? `${language() === "en" ? "Prerequisite" : "图鉴前置"} · ${species(runtime.targetPlan.speciesId)?.n || runtime.targetPlan.speciesId}`
        : runtime.targetPlan?.moneyFarm ? t("moneyFarm")
        : runtime.targetPlan?.speciesId ? species(runtime.targetPlan.speciesId)?.n : runtime.targetPlan?.chapterName;
    panel.querySelectorAll('[data-status="target"]').forEach((node) => { node.textContent = targetName || "—"; });
    panel.querySelectorAll('[data-status="place"]').forEach((node) => {
      node.textContent = runtime.dailyRaidActiveRegion || raidEvent
        ? `${t("dailyRaid")} · ${t(runtime.dailyRaidActiveRegion || raidEvent?.reg)}`
        : `${chapter(save?.adv?.chapter)?.name || "—"}${runtime.targetPlan?.zone ? ` / ${runtime.targetPlan.zone}` : ""}`;
    });
    let attemptText = runtime.targetPlan?.orbFarm
      ? (language() === "en" ? `Restarts: ${runtime.attempts}` : `重开 ${runtime.attempts} 轮`)
      : String(runtime.attempts);
    if (runtime.targetPlan?.roaming && runtime.attempts > 0) {
      const captureKey = save?.buffs?.capture?.key;
      const multiplier = captureKey === "golden-razz-berry" ? 1.5 : captureKey === "razz-berry" ? 1.25 : 1;
      const probability = 1 - (1 - 0.04 * multiplier) ** runtime.attempts;
      attemptText += ` · ${t("cumulative")} ${(probability * 100).toFixed(1)}%`;
    }
    if (runtime.specialFight && Number(save?.adv?.zone?.id) === runtime.specialFight.id) {
      attemptText += language() === "en" ? ` · Losses ${runtime.specialFight.losses}/3` : ` · 连败 ${runtime.specialFight.losses}/3`;
    }
    panel.querySelectorAll('[data-status="attempts"]').forEach((node) => { node.textContent = attemptText; });
    const activeBuffs = Object.values(save?.buffs || {}).filter((buff) => buff?.until > Date.now()).map((buff) => {
      const left = Math.max(0, buff.until - Date.now());
      return `${berryLabel(BERRIES[buff.key]) || buff.key} ${Math.ceil(left / 60_000)} ${t("minutes")}`;
    });
    panel.querySelectorAll('[data-status="buffs"]').forEach((node) => { node.textContent = activeBuffs.join(language() === "en" ? ", " : "、") || "—"; });
    const manual = panel.querySelector('[data-act="fixed-manual"]');
    if (manual) {
      manual.hidden = !fixedManualPlan(save);
      manual.disabled = Boolean(runtime.manualFixedTeam);
    }
    panel.querySelectorAll('[data-status="team-label"]').forEach((node) => {
      node.textContent = fixedManualPlan(save) ? (language() === "en" ? "Zone team" : "专属队伍") : t("fifthTeam");
    });
    panel.querySelectorAll('[data-status="team"]').forEach((node) => { node.textContent = runtime.teamStatus === "未生成" ? t("notGenerated") : runtime.teamStatus; });
    const buddyStatus = panel.querySelector("#pca-buddy-status");
    if (buddyStatus) buddyStatus.textContent = runtime.buddyStatus || buddyStatusText(save);
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
      const labels = { push: "推图", collect: "普通图鉴收集", roaming: "神兽收集", combined: "协同收集" };
      log(`检测到上次未结束的${labels[session.mode]}任务，请手动点击对应入口恢复`);
      notifyUser("发现未结束任务", "为安全起见没有自动恢复，请在面板中确认启动。 ");
    } catch { /* ignore */ }
  }

  function init() {
    renderPanel();
    offerResume();
    observeDebugBattle();
    observeFixedFightLog();
    refreshDebugRecent();
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
    document.addEventListener("pointerdown", (event) => {
      if (event.isTrusted && runtime.fixedAutoEditor && event.target.closest?.("#evt-pick.open")) {
        runtime.fixedAutoEditor.taken = true;
      }
    }, true);
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
      previewTeam: (chapterIndex = readSave().adv.chapter) => recommendTeam(
        readSave(),
        targetEnemiesForChapter(chapterIndex),
        { targetLevel: chapter(chapterIndex)?.ace, chapterIndex },
      ).details,
      previewChapterSimulation: (chapterIndex = readSave().adv.chapter) => {
        const save = readSave();
        const team = (save.teamSets?.list?.[4] || save.team || []).map((uid) => save.mons.find((mon) => mon.uid === uid)).filter(Boolean);
        return simulateChapterTeam(save, team, chapterIndex);
      },
      previewMissing: () => chooseMissingPlan(readSave()),
    };
    log(`助手已加载，游戏数据版本 ${DATA.appBuild}`);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
