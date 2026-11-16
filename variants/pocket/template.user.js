// ==UserScript==
// @name         PokeCatch 全图鉴与推图助手（pocket修正版）
// @namespace    local.pokecatch.assistant
// @version      0.1.5-pocket.2
// @description  收集与推图自动轮换、形态图鉴、培养候选池、有效BST与果子自动化。单文件，无运行依赖。
// @match        https://pokecatch-online.netlify.app/*
// @match        https://pokecatch-online.pages.dev/*
// @run-at       document-idle
// @noframes
// @grant        GM_notification
// ==/UserScript==

(() => {
  "use strict";

  // 上游 stdAri/pokecatch-assistant，MIT；本地修复单独保存，不覆盖原件。
  if (typeof window !== "undefined" && window.__pokeCatchAssistant) return;

  const DATA = /*__GAME_DATA__*/;
  const SAVE_KEY = "gachamon-save-v1";
  const SETTINGS_KEY = "pca.settings.v1";
  const SESSION_KEY = "pca.session.v1";
  const PANEL_ID = "pca-panel";
  const VERSION = "0.1.5-pocket.2";

  const BERRIES = DATA.berries; // 从同版本游戏配置构建，避免手写漏项。

  const DEFAULT_SETTINGS = {
    collapsed: false,
    activeTab: "push",
    panelPosition: null,
    lockTeam5: false,
    candidatePool: { enabled: false, minBst: 500, uids: [] },
    desktopNotifications: false,
    soundNotifications: true,
    regionScope: "current",
    customRegions: ["kanto", "johto"],
    manualTargets: [],
    autoPushWhenWaiting: true,
    roamingPriority: [243, 244, 245],
    berries: Object.fromEntries(Object.keys(BERRIES).map((key) => [key, { enabled: false, reserve: 0 }])),
  };

  const runtime = {
    mode: "idle",
    intent: "idle",
    collectRegion: null,
    autoReason: "",
    pushFinished: false,
    paused: false,
    busy: false,
    target: null,
    targetPlan: null,
    expectedChapter: null,
    pushRegion: null,
    teamStatus: "未生成",
    teamPlan: null,
    reteamRequested: false,
    poolWaiting: false,
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
    collectWaiting: false,
    logs: [],
    error: null,
    timer: null,
  };

  let operationEpoch = 0;
  let settings = typeof module !== "undefined" && module.exports ? structuredClone(DEFAULT_SETTINGS) : loadSettings();
  let poolDraft = null;

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
      loaded.candidatePool = normalizePool(loaded.candidatePool);
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
    const epoch = operationEpoch;
    while (Date.now() - start < timeout) {
      if (epoch !== operationEpoch) throw new DOMException("等待已取消", "AbortError");
      const value = getter();
      if (value) return value;
      await sleep(interval);
    }
    if (epoch !== operationEpoch) throw new DOMException("等待已取消", "AbortError");
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
      if (error?.name !== "AbortError") diagnostic(label, error);
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

  function normalizeRegion(value) {
    const region = value === "kanto2" ? "johto" : value;
    return DATA.chapters.some((item) => item.region === region) ? region : "kanto";
  }

  function canBattleMon(save, mon, chapterIndex = save.adv.chapter) {
    if (!mon?.uid || !species(mon.id) || !(mon.level > 0)) return false;
    // 与游戏 Game.can()/Qt()/V() 使用相同的来源地区与 link 隔离规则。
    // 当前地区未通关时 link 存在；通关合并后 link 消失，不再按地区排除。
    if (!save.link) return true;
    const destination = normalizeRegion(save.link.to);
    const inDestination = normalizeRegion(mon.reg) === destination;
    const targetSide = chapterIndex === save.adv.chapter
      ? save.link.side === "to"
      : normalizeRegion(chapter(chapterIndex)?.region) === destination;
    return inDestination === targetSide;
  }

  function teamIdentity(mon) {
    // 游戏允许普通/异色同种各一只；single 形态家族则共享一个名额。
    return DATA.singleGroups?.[mon.id] ? `single:${DATA.singleGroups[mon.id]}` : `${mon.shiny ? "shiny" : "mon"}:${mon.id}`;
  }

  function baseStatTotal(id) {
    return (species(id)?.s || []).reduce((sum, value) => sum + Number(value || 0), 0);
  }

  function rankOf(mon) {
    return Math.min(DATA.rankMax, Math.max(0, Math.floor(Number(mon?.rank) || 0)));
  }

  function statMultiplier(mon) {
    // 与游戏statsOf一致：异色倍率与每档强化倍率相乘。
    return (mon?.shiny ? 1 + DATA.shinyStatBonus : 1) * DATA.rankStatMultiplier ** rankOf(mon);
  }

  function effectiveStatTotal(mon) {
    return Number((baseStatTotal(mon.id) * statMultiplier(mon)).toFixed(8));
  }

  function statNote(mon) {
    const parts = [`基础${baseStatTotal(mon.id)}`];
    if (mon.shiny) parts.push(`异色+${Math.round(DATA.shinyStatBonus * 100)}%`);
    if (rankOf(mon)) parts.push(`强化${rankOf(mon)}档×${DATA.rankStatMultiplier}^${rankOf(mon)}`);
    return parts.join(" · ");
  }

  function normalizePool(value = {}) {
    if (!value || typeof value !== "object") value = {};
    const numeric = Number(value.minBst ?? 500);
    return {
      enabled: value.enabled === true,
      minBst: Number.isFinite(numeric) ? Math.max(0, Math.min(2000, Math.trunc(numeric))) : 500,
      uids: [...new Set((Array.isArray(value.uids) ? value.uids : []).filter((uid) => ["string", "number"].includes(typeof uid)).map(String).filter(Boolean))],
    };
  }

  function teamCandidates(save, chapterIndex = save.adv.chapter, config = settings.candidatePool) {
    const pool = normalizePool(config);
    const selected = new Set(pool.uids);
    // 先限定用户勾选的具体个体与当前形态门槛，再执行游戏的地区规则。
    // 绝不在候选不足时退回全电脑；新捕获的同种也不会自动获得勾选资格。
    return save.mons.filter((mon) => (!pool.enabled || selected.has(String(mon.uid)) && effectiveStatTotal(mon) + 1e-9 >= pool.minBst) && canBattleMon(save, mon, chapterIndex));
  }

  function poolSummary(save, config = settings.candidatePool, chapterIndex = save.adv.chapter) {
    const pool = normalizePool(config);
    const owned = new Set(save.mons.map((mon) => String(mon.uid)));
    const available = teamCandidates(save, chapterIndex, pool);
    return { enabled: pool.enabled, minBst: pool.minBst, selected: pool.uids.length, missing: pool.uids.filter((uid) => !owned.has(uid)).length, eligible: available.length, unique: new Set(available.map(teamIdentity)).size };
  }

  function getPoolDraft() {
    if (!poolDraft) {
      const saved = normalizePool(settings.candidatePool);
      // 初次打开时准备“启用”的空草稿，只有用户点击保存才生效。
      poolDraft = { ...saved, enabled: saved.enabled || saved.uids.length === 0, uids: [...saved.uids], query: "", onlyEligible: true };
    }
    return poolDraft;
  }

  function poolRows(save, draft = getPoolDraft()) {
    const query = String(draft.query || "").normalize("NFKC").toLocaleLowerCase();
    const selected = new Set(draft.uids.map(String));
    const minimum = normalizePool(draft).minBst;
    return save.mons.filter((mon) => mon?.uid && species(mon.id) && mon.level > 0).map((mon) => ({ uid: String(mon.uid), id: mon.id, name: species(mon.id).n, dex: formatDexId(mon.id), level: mon.level, shiny: !!mon.shiny, rank: rankOf(mon), baseBst: baseStatTotal(mon.id), bst: effectiveStatTotal(mon), statNote: statNote(mon), reg: normalizeRegion(mon.reg), eligible: canBattleMon(save, mon), checked: selected.has(String(mon.uid)) }))
      .filter((row) => row.bst + 1e-9 >= minimum && (!draft.onlyEligible || row.eligible) && (!query || `${row.name} ${row.dex} ${row.id}`.normalize("NFKC").toLocaleLowerCase().includes(query)))
      .sort((a, b) => b.bst - a.bst || b.level - a.level || a.id - b.id || Number(b.shiny) - Number(a.shiny));
  }

  function formatDexId(id) {
    return species(id)?.dex || String(id);
  }

  function parseTargetInput(input) {
    const names = new Map(Object.entries(DATA.species).map(([id, meta]) => [meta.n.normalize("NFKC").toLocaleLowerCase(), Number(id)]));
    const ids = [];
    const invalid = [];
    const tokens = String(input || "").split(/[，,、;；]+/).flatMap((part) => {
      const trimmed = part.trim();
      return names.has(trimmed.normalize("NFKC").toLocaleLowerCase()) ? [trimmed] : trimmed.split(/\s+/);
    }).filter(Boolean);
    for (const raw of tokens) {
      const token = raw.normalize("NFKC").replace(/^#/, "").replace(/[‐‑‒–—−]/g, "-").toUpperCase();
      const match = token.match(/^(\d+)-([A-Z!?])$/);
      const alias = match ? `${String(Number(match[1])).padStart(3, "0")}-${match[2]}` : null;
      const id = alias ? DATA.dexAliases?.[alias] : /^\d+$/.test(token) ? Number(token) : names.get(raw.normalize("NFKC").toLocaleLowerCase());
      if (id != null && species(id)) {
        if (!ids.includes(id)) ids.push(id);
      } else invalid.push(raw);
    }
    return { ids, invalid };
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
    const bst = effectiveStatTotal(mon);
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
    const score = bst * 0.21 + offense * 0.82 + defense * 34 + stats[5] * statMultiplier(mon) * 0.08 + levelContribution + continuity - samePrimary * 16;
    return {
      score,
      reason: `有效BST ${bst}（${statNote(mon)}） · 克制${offense.toFixed(0)} · 防守${defense.toFixed(2)} · Lv.${mon.level}`,
    };
  }

  function recommendTeam(save, enemyIds, excludedSignatures = new Set(), chapterIndex = save.adv.chapter) {
    const enemies = enemyProfiles(enemyIds);
    const currentFive = new Set(save.teamSets?.list?.[4] || []);
    const candidates = teamCandidates(save, chapterIndex);
    const selected = [];
    const details = [];
    while (selected.length < 6 && selected.length < candidates.length) {
      const ranked = candidates
        .filter((mon) => !selected.some((item) => item.uid === mon.uid || teamIdentity(item) === teamIdentity(mon)))
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
        .filter((mon) => !selected.some((item) => item.uid === mon.uid || teamIdentity(item) === teamIdentity(mon)) && mon.uid !== last.uid)
        .map((mon) => ({ mon, ...scoreCandidate(mon, enemies, currentFive, selected) }))
        .sort((a, b) => b.score - a.score)[0];
      if (replacement) {
        selected.push(replacement.mon);
        details.pop();
        details.push({ uid: replacement.mon.uid, id: replacement.mon.id, name: species(replacement.mon.id).n, score: replacement.score, reason: replacement.reason });
      } else selected.push(last);
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
    const epoch = operationEpoch;
    const check = () => { if (epoch !== operationEpoch) throw new DOMException("切章已取消", "AbortError"); };
    runtime.expectedChapter = chapterIndex;
    await openScreen("adventure");
    check();
    // 联盟在地图上合并成一项 L；从外部进入只能从首位四天王开始。
    const key = chapter(chapterIndex)?.league ? "L" : String(chapterIndex);
    let visibleRow = document.querySelector(`.mp-row[data-ch="${key}"]`);
    if (!visibleRow) document.querySelector("#side-chapter")?.click();
    const row = await waitFor(
      () => document.querySelector(`.mp-row[data-ch="${key}"]`),
      { label: `章节${chapterIndex}列表项` },
    );
    check();
    row.click();
    const go = await waitFor(
      () => document.querySelector(`.mp-go[data-go="${key}"]:not([disabled])`),
      { label: `章节${chapterIndex}进入按钮` },
    );
    await jitter();
    check();
    go.click();
    await waitFor(() => {
      const actual = chapter(readSave().adv.chapter);
      return key === "L" ? actual?.league && actual.region === chapter(chapterIndex).region : actual?.index === chapterIndex;
    }, { timeout: 10_000, label: `进入章节${chapterIndex}` });
    await jitter(500, 900);
    check();
    runtime.expectedChapter = null;
    log(`已进入：${chapter(readSave().adv.chapter)?.name || `章节${chapterIndex}`}`);
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
    // 同章目标作为一组循环；不能为单只目标随意换图，漏掉同章后段。
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
    if (!plan.mons.length) {
      runtime.poolWaiting = true;
      runtime.paused = true;
      runtime.teamStatus = "候选池当前无合格成员，等待选择（未改队）";
      log("没有符合候选池、种族值与地区条件的成员，任务等待；未从池外补充");
      renderStatus();
      return;
    }
    runtime.poolWaiting = false;
    if (settings.candidatePool.enabled && plan.mons.length < 6) log(`候选池仅能配置${plan.mons.length}/6名不同名额的成员，按实际人数配队，不从池外补足`);
    if (settings.lockTeam5 || runtime.userTeamOverride) {
      log(`第五队已锁定，仅生成推荐：${plan.details.map((item) => item.name).join("、")}`);
      return;
    }
    await configurePreset(4, plan.mons.map((mon) => mon.uid));
    const appliedSave = readSave();
    runtime.lastTeamSignature = (appliedSave.teamSets?.list?.[4] || []).join("|");
    const pendingRoad = Array.isArray(appliedSave.road) && JSON.stringify(appliedSave.road) !== JSON.stringify(appliedSave.team);
    runtime.teamStatus = `${pendingRoad ? "已配队（下个中心生效）" : "已应用"}：${plan.details.map((item) => item.name).join("、")}`;
    log(runtime.teamStatus);
  }

  async function configurePreset(presetIndex, desiredUids) {
    const before = readSave();
    const previousPreset = before.teamSets.on;
    const desired = desiredUids.map((uid) => before.mons.find((mon) => mon.uid === uid));
    if (!desired.length || desired.length > 6 || new Set(desiredUids).size !== desiredUids.length) throw new Error("推荐阵容人数无效");
    if (desired.some((mon) => !canBattleMon(before, mon))) throw new Error("阵容含有当前地区不能出战的宝可梦，未更改队伍");
    if (new Set(desired.map(teamIdentity)).size !== desired.length) throw new Error("阵容含有游戏不允许同时出战的重复成员");
    const epoch = operationEpoch;
    const assertCurrent = () => {
      if (operationEpoch !== epoch) throw new DOMException("操作已取消", "AbortError");
      const save = readSave();
      if (save.adv.chapter !== before.adv.chapter || desired.some((mon) => !canBattleMon(save, mon))) throw new Error("配队过程中出战地区变化，已取消");
    };
    let search;
    try {
      await openScreen("team");
      assertCurrent();
      const preset = await waitFor(() => document.querySelector(`#team-sets [data-set="${presetIndex}"]`), { label: `队伍${presetIndex + 1}` });
      preset.click();
      await waitFor(() => readSave().teamSets?.on === presetIndex, { label: `切换到队伍${presetIndex + 1}` });
      await jitter();
      document.querySelector("#pc-evo.on")?.click();
      document.querySelector("#pc-shiny.on")?.click();
      for (const filter of [...document.querySelectorAll("#pc-active button")]) filter.click();
      search = document.querySelector("#pc-search");

      // 逐槽替换可处理满队，也避免“先删光、后添加”留下空队伍。
      for (const [slot, uid] of desiredUids.entries()) {
        assertCurrent();
        if (readSave().team[slot] === uid) continue;
        let source = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(uid)}"]`);
        if (!source) {
          const mon = readSave().mons.find((item) => item.uid === uid);
          if (search) {
            // 游戏电脑搜索支持内部数值编号；形态名称与翻译可能不同。
            search.value = String(mon.id);
            search.dispatchEvent(new Event("input", { bubbles: true }));
          }
          source = await waitFor(() => document.querySelector(`#pc-grid .pc-cell[data-uid="${CSS.escape(uid)}"]:not(.ug-out)`), { label: `电脑中的${species(mon.id).n}` });
        }
        assertCurrent();
        await dragMon(source, () => visibleTeamSlots().children[slot]);
        await waitFor(() => readSave().team[slot] === uid, { label: `${species(desired[slot].id).n}加入第${slot + 1}位` });
        assertCurrent();
        await jitter(100, 180);
      }
      while (readSave().team.length > desiredUids.length) {
        assertCurrent();
        const uid = readSave().team.at(-1);
        const source = document.querySelector(`#team-slots [data-team-uid="${CSS.escape(uid)}"]`);
        await dragMon(source, () => document.querySelector("#pc-grid"));
        await waitFor(() => !readSave().team.includes(uid), { label: "多余成员返回电脑" });
      }
      const final = readSave().team;
      if (JSON.stringify(final) !== JSON.stringify(desiredUids)) throw new Error("队伍成员或顺序未能完整应用");
    } catch (error) {
      // 配队失败或用户停止时，先恢复原活动预设；不直接写存档。
      if (Number.isInteger(previousPreset) && previousPreset !== presetIndex) {
        document.querySelector(`#team-sets [data-set="${previousPreset}"]`)?.click();
      }
      throw error;
    } finally {
      if (search) {
        search.value = "";
        search.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    await openScreen("adventure");
  }

  function visibleTeamSlots() {
    return document.querySelector("#team-mini.show") || document.querySelector("#team-slots");
  }

  async function dragMon(source, targetGetter) {
    const epoch = operationEpoch;
    if (!source) throw new Error("找不到待移动的队伍成员");
    if (typeof PointerEvent !== "function") throw new Error("当前浏览器不支持PointerEvent");
    source.scrollIntoView?.({ block: "center", behavior: "instant" });
    // 等待虚拟列表和浮动队伍栏完成位置更新，然后使用游戏自身的拖动事件。
    await sleep(100);
    if (epoch !== operationEpoch) throw new DOMException("操作已取消", "AbortError");
    const target = targetGetter();
    if (!target) throw new Error("找不到队伍拖动目标");
    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    if (!(from.width > 0 && from.height > 0 && to.width > 0 && to.height > 0)) throw new Error("队伍拖动区域尚未显示");
    const pointerId = 9001;
    const sx = from.left + from.width / 2;
    const sy = from.top + from.height / 2;
    const tx = to.left + to.width / 2;
    const ty = to.top + to.height / 2;
    const send = (element, type, x, y, buttons) => element.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId, pointerType: "mouse", isPrimary: true, button: 0, buttons, clientX: x, clientY: y }));
    send(source, "pointerdown", sx, sy, 1);
    try {
      // 超过游戏的6px拖动阈值，再进入目标区域，最后释放。
      send(document, "pointermove", sx + 8, sy + 8, 1);
      send(document, "pointermove", tx, ty, 1);
      send(document, "pointerup", tx, ty, 0);
    } catch (error) {
      send(document, "pointercancel", tx, ty, 0);
      throw error;
    }
  }

  function habitatForRoute(route) {
    if (route.habitat && DATA.habitats[route.habitat]) return DATA.habitats[route.habitat];
    const exact = `${route.sourceName}|${(route.areas || []).join("+") || "species"}`;
    if (DATA.habitats[exact]) return DATA.habitats[exact];
    const match = Object.entries(DATA.habitats).find(([key]) => key.startsWith(`${route.sourceName}|`));
    return match?.[1] || null;
  }

  function phaseAt(save, now) {
    if (chapter(save.adv.chapter)?.day && !(save.adv.unlocked > save.adv.chapter)) return "day";
    const hour = new Date(now).getHours();
    return hour < 8 || hour >= 20 ? "night" : hour < 10 ? "morning" : "day";
  }

  function planningNow() {
    // 游戏公开时钟键只用于校准读取，不改系统时间或游戏时钟。
    try { return Math.max(Date.now(), Number(localStorage.getItem("pokecatch.clock")) || 0); } catch { return Date.now(); }
  }

  function indoorStep(step) {
    if (typeof step.indoor === "boolean") return step.indoor;
    return step.kind === "heal" || /^(cave|gym|pokecenter)/.test(step.bg || "") || !!step.areas?.length && step.areas.every((area) => /cave|tunnel|tower|mansion|silph|power-plant|well|ruins-of-alph-interior|ice-path|whirl|mortar|falls|dragons-den|seafoam|mt-moon|victory-road|-b?\d+f\b|underground|dojo|rocket-hq|house|lab|department|game-corner|pokemon-center|mt-silver-(?!outside)/.test(area));
  }

  function hashUnit(value) {
    let hash = 2166136261;
    for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    hash ^= hash >>> 16; hash = Math.imul(hash, 2246822507);
    hash ^= hash >>> 13; hash = Math.imul(hash, 3266489909);
    return ((hash ^ hash >>> 16) >>> 0) / 4294967296;
  }

  // 复现公开天气配置的确定性计算，只读存档，不调用游戏私有函数或改时间。
  function weatherAt(save, step, chapterIndex, now) {
    if ("weather" in step) return step.weather;
    if (indoorStep(step)) return null;
    const config = DATA.weather;
    const slot = Math.floor(now / config.SLOT_MS);
    const fixed = chapter(chapterIndex).weather;
    if (fixed) return Array.isArray(fixed) ? fixed[slot % fixed.length] : fixed;
    const roaming = Object.entries(save.roam?.at || {}).find(([, state]) => state.ch === chapterIndex && state.until > now);
    if (roaming && DATA.roamingWeather?.[roaming[0]]) return DATA.roamingWeather[roaming[0]];
    const region = chapter(chapterIndex).region;
    const climateOf = (node) => {
      const raw = typeof node.climate === "string" ? config.CLIMATES[node.climate] : node.climate || config.CLIMATES[node.bg];
      if (!raw) return null;
      const climate = { ...raw };
      for (const key of config.REGION_OFF?.[region] || []) delete climate[key];
      for (const multipliers of [config.REGION_WEIGHTS?.[region]?.all, config.REGION_WEIGHTS?.[region]?.[node.bg]]) {
        for (const [key, value] of Object.entries(multipliers || {})) if (climate[key]) climate[key] *= value;
      }
      return climate;
    };
    const local = climateOf(step);
    if (!local) return null;
    const combined = {};
    for (const route of chapter(chapterIndex).steps.filter((node) => node.kind === "route" && !node.indoor)) {
      for (const [key, value] of Object.entries(climateOf(route) || {})) combined[key] = (combined[key] || 0) + value;
    }
    let consecutive = 0;
    const seed = `ch${chapterIndex}`;
    while (consecutive < 64 && hashUnit(`${seed}|${slot - consecutive}`) < config.CHANCE) consecutive += 1;
    if (consecutive % 2 === 0) return null;
    const night = phaseAt(save, now) === "night";
    const options = Object.entries(Object.keys(combined).length ? combined : local).filter(([key]) => !(night && config.TYPES[key]?.daylight));
    if (!options.length) return null;
    let roll = hashUnit(`${slot}|${seed}`) * options.reduce((sum, [, value]) => sum + value, 0);
    let weather = options[0][0];
    for (const [key, value] of options) if ((roll -= value) <= 0) { weather = key; break; }
    const valid = (key) => local[key] && !(night && config.TYPES[key]?.daylight);
    return valid(weather) ? weather : (config.TRANSLATE[weather] || []).find(valid) || null;
  }

  const spotSchedules = new Map();
  function dailySpotZone(spot, now) {
    // 每日地点按巴黎日期轮换，罕见涂蜜树遵循固定间隔和洗牌，不能把所有地点同时算入。
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now).map((item) => [item.type, item.value]));
    const day = Date.UTC(+parts.year, +parts.month - 1, +parts.day) / 864e5;
    const start = Math.floor(Date.parse(spot.from) / 864e5);
    if (!spot.rare || day < start) return spot.zones[(Math.imul(day, 2654435761) >>> 0) % spot.zones.length];
    const random = (value) => { value = Math.imul(value ^ value >>> 16, 2146121005); value = Math.imul(value ^ value >>> 15, 2221713035); return ((value ^ value >>> 16) >>> 0) / 4294967296; };
    let state = spotSchedules.get(spot);
    if (!state) {
      state = { days: [], common: spot.zones.filter((zone) => !spot.rare.some((group) => group.includes(zone))), round: [], seen: 0, at: spot.rare.map(() => 0), next: spot.rare.map((_, index) => start + 2 + index * 3) };
      spotSchedules.set(spot, state);
    }
    while (state.days.length <= day - start) {
      const today = start + state.days.length;
      const rare = state.next.indexOf(today);
      if (rare >= 0) {
        const count = state.at[rare]++;
        state.days.push(spot.rare[rare][count % spot.rare[rare].length]);
        let next = today + spot.gap[0] + Math.floor(random(rare * 7919 + count * 104729 + 1) * (spot.gap[1] - spot.gap[0] + 1));
        if (state.next.includes(next)) next += next - today < spot.gap[1] ? 1 : -1;
        state.next[rare] = next;
      } else {
        if (!state.round.length) {
          const round = Math.floor(state.seen / state.common.length);
          const zones = [...state.common];
          for (let i = zones.length - 1; i > 0; i -= 1) {
            const j = Math.floor(random(round * 31337 + i * 7 + 2) * (i + 1));
            [zones[i], zones[j]] = [zones[j], zones[i]];
          }
          if (zones[0] === state.days.at(-1)) [zones[0], zones[1]] = [zones[1], zones[0]];
          state.round = zones;
        }
        state.seen += 1;
        state.days.push(state.round.shift());
      }
    }
    return state.days[day - start];
  }

  function routeWeights(route, save, chapterIndex, context = {}) {
    const weights = {};
    const add = (id, value) => { weights[id] = Math.max(weights[id] || 0, Number(value) || 0); };
    const habitat = habitatForRoute(route);
    const now = context.now ?? planningNow();
    const phase = context.phase ?? phaseAt(save, now);
    const weather = context.weatherAt ? context.weatherAt(route, chapterIndex) : weatherAt(save, route, chapterIndex, now);
    if (route.night && phase !== "night" || route.day && phase === "night") return weights;
    if (habitat) {
      Object.assign(weights, habitat.base);
      const routeKey = route.habitat || `${route.sourceName}|${(route.areas || []).join("+") || "species"}`;
      const match = (zone) => zone === routeKey || routeKey.startsWith(`${zone}|`);
      const extras = [...DATA.dailySpots.filter((spot) => match(dailySpotZone(spot, now))), ...Object.entries(DATA.zoneExtras).filter(([zone]) => match(zone)).map(([, item]) => item)];
      const baseSum = Object.values(habitat.base || {}).reduce((sum, value) => sum + value, 0);
      for (const extra of extras) {
        const pool = extra.pool || { [extra.id]: 1 };
        const total = Object.values(pool).reduce((sum, value) => sum + value, 0);
        for (const [id, value] of Object.entries(pool)) {
          const actual = DATA.capeForms[id]?.[route.bg] ?? id;
          weights[actual] = Math.round(((weights[actual] || 0) + baseSum * extra.share / (1 - extra.share) * value / total) * 100) / 100;
        }
      }
      // 0 是排除条件，不能使用 max(base, day/night) 把它重新加回来。
      const conditions = indoorStep(route) ? [] : [phase, ...(phase === "morning" ? ["day"] : []), weather];
      const off = new Set();
      for (const condition of conditions) for (const [id, value] of Object.entries(habitat[condition] || {})) {
        if (value === 0) off.add(id);
        weights[id] = habitat.base?.[id] > 0 ? (weights[id] || 0) * value / habitat.base[id] : value;
      }
      for (const id of off) weights[id] = 0;
    }
    if (!habitat) {
      for (const id of route.species || []) add(id, 1);
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

  function collectOpportunities(save, context = {}) {
    const plans = [];
    const now = context.now ?? planningNow();
    const phase = context.phase ?? phaseAt(save, now);
    for (const item of availableChapters(save)) {
      let prefixCost = 0;
      for (const route of item.steps) {
        if (route.tide && (route.tide === "low") !== (Math.floor(now / DATA.tideMilliseconds) % 2 === 0)) continue;
        prefixCost += route.kind === "route" ? (route.wild || 0) + (route.trainers || 0) + (route.item ? 0.7 : 0) : 1;
        let weights = {};
        const staticNode = route.kind === "static";
        if (staticNode) {
          if (route.once && save.adv.gifts?.[route.once] || route.after && !save.adv.gifts?.[route.after] || route.needs && (save.items?.[route.needs] || 0) < (route.needN || 1) || route.caught?.some((id) => !save.dex?.[id])) continue;
          const spawned = save.adv.chapter === item.index && save.adv.nodes?.some((node) => node.type === "static" && node.id === route.id && node.name === route.sourceName);
          const weather = context.weatherAt ? context.weatherAt(route, item.index) : weatherAt(save, route, item.index, now);
          if (!spawned && (route.night && phase !== "night" || route.day && phase === "night" || route.skies && !route.skies.includes(weather))) continue;
          weights = { [route.id]: route.chance ?? 1 };
        } else if (route.kind === "route" && route.wild > 0) weights = routeWeights(route, save, item.index, context);
        const total = Object.values(weights).reduce((sum, value) => sum + Math.max(0, value), 0);
        for (const [speciesId, weight] of Object.entries(weights)) {
          if (weight <= 0 || !species(speciesId)) continue;
          const opportunity = staticNode ? weight : weight / total * route.wild;
          plans.push({
          speciesId: Number(speciesId), kind: staticNode ? "static" : "wild", stepIndex: route.stepIndex,
          chapter: item.index,
          chapterName: item.name,
          zone: route.name,
          sourceZone: route.sourceName,
          wild: staticNode ? 1 : route.wild,
          prefixCost,
          weight,
          score: opportunity / Math.max(1, prefixCost), opportunity,
        });
        }
      }
    }
    return plans.sort((a, b) => b.score - a.score || a.prefixCost - b.prefixCost);
  }

  function plansForSpecies(save, speciesId, context = {}) {
    return collectOpportunities(save, context).filter((plan) => plan.speciesId === Number(speciesId));
  }

  function groupChapterPlan(save, chapterIndex, opportunities, ids) {
    const wanted = new Set(ids.filter((id) => !isCaught(save, id)));
    const targets = opportunities.filter((plan) => plan.chapter === chapterIndex && wanted.has(plan.speciesId)).sort((a, b) => a.stepIndex - b.stepIndex);
    if (!targets.length) return null;
    const speciesIds = [...wanted].filter((id) => targets.some((plan) => plan.speciesId === id));
    const last = targets.reduce((a, b) => a.stepIndex > b.stepIndex ? a : b);
    return { ...last, speciesId: speciesIds[0], speciesIds, targets, grouped: true, zones: [...new Set(targets.map((plan) => plan.zone))], lastStepIndex: last.stepIndex };
  }

  function chooseMissingPlan(save, context = {}, manualTargets = settings.manualTargets) {
    const opportunities = collectOpportunities(save, context).filter((plan) => !isCaught(save, plan.speciesId));
    // 手填仍是优先顺序；优先目标所在章中其他缺失目标一起刷，避免重复跑前缀。
    const ids = manualTargets.length ? manualTargets.filter((id) => !isCaught(save, id)) : [...new Set(opportunities.map((plan) => plan.speciesId))];
    let anchor = manualTargets.map((id) => opportunities.find((plan) => plan.speciesId === id)).find(Boolean);
    if (!anchor && manualTargets.some((id) => !isCaught(save, id))) return null;
    if (!anchor) anchor = opportunities[0];
    if (!anchor) return null;
    return groupChapterPlan(save, anchor.chapter, opportunities, manualTargets.length && ids.length ? ids : [...new Set(opportunities.map((plan) => plan.speciesId))]);
  }

  function refreshCollectPlan(save, plan, context = {}) {
    // 捕获任何一只后重新计算末端，保留同章的其他目标；本轮已生成的事件仍可完成。
    const opportunities = collectOpportunities(save, context);
    const ids = settings.manualTargets.some((id) => !isCaught(save, id)) ? settings.manualTargets : plan.speciesIds || [plan.speciesId];
    return groupChapterPlan(save, plan.chapter, opportunities, ids);
  }

  function autoModeDecision(save, context = {}) {
    // 有手填名单时只检查名单；全部完成即推图，不再转刷其他图鉴。
    const remaining = settings.manualTargets.filter((id) => !isCaught(save, id));
    if (settings.manualTargets.length && !remaining.length) return { mode: "push", reason: "优先目标已全部捕获" };
    const roamers = activeRoamers(save).filter((item) => !settings.manualTargets.length || remaining.includes(item.id));
    if (roamers.length) return { mode: "collect", reason: "剩余目标正在游走" };
    const plan = chooseMissingPlan(save, context);
    return plan ? { mode: "collect", reason: `剩余目标可刷：${plan.speciesIds.map(formatDexId).join("、")}` }
      : { mode: "push", reason: "暂无满足天气、时间、前置及解锁条件的目标" };
  }

  function switchAutomaticMode(mode, reason) {
    // 只改助手任务状态。保持候选池、道具偏好、失败记录和已捕获结果。
    operationEpoch += 1;
    runtime.mode = mode;
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.teamPlan = null;
    runtime.reteamRequested = false;
    runtime.userTeamOverride = false;
    runtime.expectedChapter = null;
    runtime.attempts = 0;
    runtime.collectWaiting = false;
    runtime.pushFinished = false;
    runtime.pushRegion = mode === "push" ? runtime.collectRegion : null;
    runtime.autoReason = reason;
    // 会话保存收集意图；刷新后仍提示恢复收集任务，而不是丢失回切能力。
    localStorage.setItem(SESSION_KEY, JSON.stringify({ mode: "collect", phase: mode, running: true, at: Date.now() }));
    log(`自动切换到${mode === "push" ? "推图" : "收集"}：${reason}`);
  }

  function reconcileAutomaticMode(save, context = {}) {
    if (runtime.intent !== "collect" || runtime.paused || runtime.busy || runtime.mode === "idle") return false;
    // 正在战斗/等待结算时完成当前步骤，再切换，避免丢掉捕获与奖励。
    if (save.adv.battle || save.adv.pending) return false;
    const choice = settings.autoPushWhenWaiting ? autoModeDecision(save, context) : { mode: "collect", reason: "已关闭自动推图" };
    if (runtime.mode === choice.mode) return false;
    switchAutomaticMode(choice.mode, choice.reason);
    return true;
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

  function timelinePlanStatus(plan, save = readSave()) {
    if (plan.grouped && Array.isArray(save.adv.nodes)) {
      const nodes = save.adv.nodes;
      const relevant = nodes.map((node, index) => ({ node, index })).filter(({ node }) => plan.targets.some((target) =>
        node.name === target.sourceZone && (target.kind === "static" ? node.type === "static" && Number(node.id) === target.speciesId : node.type === "wild")));
      return { nodes, relevant, wild: relevant, lastWild: relevant.at(-1)?.index ?? -1, current: save.adv.node ?? 0 };
    }
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

  function pushFrontier(save, region = runtime.pushRegion || currentRegion(save)) {
    const latest = DATA.chapters.filter((item) => item.region === region && item.index <= save.adv.unlocked).at(-1);
    if (!latest?.league) return latest?.index ?? null;
    const current = chapter(save.adv.chapter);
    // 联盟必须连续挑战，战败回到首位；“已解锁第几位”不能作为跳关入口。
    return current?.league && current.region === region ? current.index : DATA.chapters.find((item) => item.region === region && item.league).index;
  }

  async function pushTick(save) {
    const region = runtime.pushRegion || currentRegion(save);
    const regionChapters = DATA.chapters.filter((item) => item.region === region && item.index <= save.adv.unlocked);
    const frontierData = regionChapters.at(-1);
    if (!frontierData) throw new Error(`当前地区${region}没有可挑战章节`);
    const frontier = pushFrontier(save, region);
    const finalRegionChapter = DATA.chapters.filter((item) => item.region === region).at(-1);
    const finalBadge = finalRegionChapter?.boss?.badge;
    if (frontier === finalRegionChapter?.index && finalBadge && save.adv.badges?.includes(finalBadge)) {
      if (runtime.intent === "collect" && settings.autoPushWhenWaiting) {
        if (!runtime.pushFinished) log(`本地区已完成：${finalRegionChapter.name}；继续检查剩余收集目标`);
        runtime.pushFinished = true;
        runtime.autoReason = "本地区推图已完成，等待剩余目标条件";
        return;
      }
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
    if (save.adv.pending) return;
    const roamers = activeRoamers(save).filter((item) => runtime.intent !== "collect" || !settings.autoPushWhenWaiting || !settings.manualTargets.length || settings.manualTargets.includes(item.id));
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
        await exclusive("配置神兽阵容", async () => {
          if (readSave().adv.chapter !== roamer.chapter) await switchChapter(roamer.chapter);
          const fresh = readSave();
          await applyRecommendedTeam(recommendTeam(fresh, [roamer.id]), species(roamer.id)?.n || String(roamer.id));
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

    const previous = runtime.targetPlan;
    const remaining = previous?.grouped ? refreshCollectPlan(save, previous) : null;
    if (remaining) runtime.targetPlan = remaining;
    if (!remaining) {
      const prioritiesDone = settings.manualTargets.length && settings.manualTargets.every((id) => isCaught(save, id));
      const next = runtime.intent === "collect" && settings.autoPushWhenWaiting && prioritiesDone ? null : chooseMissingPlan(save);
      if (!next) {
        if (!runtime.collectWaiting) log("当前优先目标无满足条件的路线，等待时间、天气、前置或章节解锁；不刷无关目标");
        runtime.collectWaiting = true;
        runtime.targetPlan = null;
        runtime.target = null;
        return;
      }
      runtime.collectWaiting = false;
      runtime.targetPlan = next;
      runtime.target = `dex:${next.chapter}`;
      runtime.userTeamOverride = false;
      runtime.attempts = 0;
      await exclusive("规划缺失图鉴", async () => {
        if (readSave().adv.chapter !== next.chapter) await switchChapter(next.chapter);
        const fresh = readSave();
        await applyRecommendedTeam(recommendTeam(fresh, next.speciesIds), `同章目标 ${next.speciesIds.map(formatDexId).join("、")}`);
      });
      return;
    }

    if (save.adv.chapter !== runtime.targetPlan.chapter) {
      await exclusive("返回目标章节", () => switchChapter(runtime.targetPlan.chapter));
      return;
    }

    // pending 是尚未结算的正常游戏选择，不能在此时切章丢掉奖励。
    if (save.adv.pending) return;
    const timeline = timelinePlanStatus(runtime.targetPlan, save);
    if (timeline.lastWild < 0) {
      await exclusive("本轮没有目标节点，重新进入", () => resetChapter(runtime.targetPlan));
      return;
    }
    if (timeline.current > timeline.lastWild || (timeline.current < 0 && save.adv.node > timeline.lastWild)) {
      runtime.attempts += timeline.wild.length;
      await exclusive("有效节点已刷完", () => resetChapter(runtime.targetPlan));
    }
  }

  function berryUseCandidates(save, now = Date.now()) {
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
      if (active?.until > now && !(active.side === "from" && save.link?.side === "to")) continue;
      options.sort((a, b) => b.info.rank - a.info.rank);
      const choice = options.find(({ key, config }) => Number(save.items?.[key] || 0) > Number(config.reserve || 0));
      if (!choice) continue;
      choices.push(choice);
    }
    return choices;
  }

  async function manageBerries(save) {
    if (Date.now() - runtime.lastBerryCheckAt < 5_000) return;
    runtime.lastBerryCheckAt = Date.now();
    for (const choice of berryUseCandidates(save)) {
      const button = document.querySelector(`#bag-panel .bag-cell[data-k="${choice.key}"]`);
      if (!button) {
        log(`已启用${choice.info.label}，但页面没有对应按钮`, "error");
        continue;
      }
      if (button.disabled || button.getAttribute("aria-disabled") === "true") continue;
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
      let epoch = operationEpoch;
      const save = readSave();
      observeBattle(save);
      detectManualTeamChange(save);
      reconcileAutomaticMode(save);
      epoch = operationEpoch;
      if (runtime.reteamRequested && runtime.targetPlan && save.adv.chapter === runtime.targetPlan.chapter) {
        runtime.reteamRequested = false;
        const ids = runtime.target?.startsWith("push:") ? targetEnemyIdsForChapter(save.adv.chapter) : runtime.targetPlan.speciesIds || [runtime.targetPlan.speciesId].filter(Boolean);
        await exclusive("应用新候选池", () => applyRecommendedTeam(recommendTeam(save, ids), "候选池已更新"));
        return;
      }
      await manageBerries(save);
      // 用户在道具界面等待期间点击停止/暂停时，不继续执行旧任务。
      if (runtime.mode === "idle" || runtime.paused || epoch !== operationEpoch) return;
      if (runtime.mode === "push") await pushTick(save);
      else if (runtime.mode === "collect") await collectTick(save);
      renderStatus();
    } catch (error) {
      diagnostic("主循环", error);
    }
  }

  function startMode(mode) {
    if (runtime.busy) {
      log("上一项界面操作仍在结束，请稍后再开始");
      return;
    }
    const compatibility = validateCompatibility();
    if (!compatibility.ok) {
      diagnostic("兼容性检查", new Error(
        compatibility.build !== compatibility.expected
          ? `游戏版本${compatibility.build}与助手数据${compatibility.expected}不同`
          : `缺少页面节点：${compatibility.missing.join(", ")}`,
      ));
      return;
    }
    if (settings.candidatePool.enabled && !normalizePool(settings.candidatePool).uids.length) {
      runtime.poolWaiting = true;
      log("候选池尚未勾选成员，请在“候选池”中选择并保存后再开始");
      renderStatus();
      return;
    }
    operationEpoch += 1;
    runtime.mode = mode;
    runtime.intent = mode;
    runtime.collectRegion = mode === "collect" ? currentRegion(readSave()) : null;
    runtime.autoReason = "";
    runtime.pushFinished = false;
    runtime.pushRegion = mode === "push" ? currentRegion(readSave()) : null;
    runtime.paused = false;
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.teamPlan = null;
    runtime.reteamRequested = false;
    runtime.poolWaiting = false;
    runtime.userTeamOverride = false;
    runtime.error = null;
    runtime.attempts = 0;
    runtime.collectWaiting = false;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ mode, running: true, at: Date.now() }));
    log(mode === "push" ? "推图模式已启动" : settings.autoPushWhenWaiting ? "收集与推图自动轮换已启动" : "全图鉴收集模式已启动");
    tick();
  }

  function pauseMode() {
    if (runtime.mode === "idle") return;
    runtime.paused = !runtime.paused;
    log(runtime.paused ? "任务已暂停" : "任务已继续");
    renderStatus();
  }

  function stopMode() {
    operationEpoch += 1;
    runtime.mode = "idle";
    runtime.intent = "idle";
    runtime.collectRegion = null;
    runtime.autoReason = "";
    runtime.pushFinished = false;
    runtime.paused = false;
    runtime.target = null;
    runtime.targetPlan = null;
    runtime.teamPlan = null;
    runtime.reteamRequested = false;
    runtime.poolWaiting = false;
    runtime.userTeamOverride = false;
    runtime.expectedChapter = null;
    runtime.pushRegion = null;
    runtime.collectWaiting = false;
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

  function renderPoolList(save = readSave()) {
    const list = document.querySelector("#pca-pool-list");
    if (!list) return;
    const regions = { kanto: "关都", johto: "城都", hoenn: "丰缘", sinnoh: "神奥", unova: "合众" };
    const rows = poolRows(save);
    list.innerHTML = rows.length ? rows.map((row) => `<label class="pca-pool-mon${row.eligible ? "" : " unavailable"}"><input type="checkbox" data-pool-uid="${escapeHtml(row.uid)}" ${row.checked ? "checked" : ""}><span><b>${row.shiny ? "★ " : ""}${escapeHtml(row.name)}</b><span class="pca-pool-meta">${escapeHtml(row.dex)} · Lv.${row.level} · 有效BST ${row.bst}<br>${escapeHtml(row.statNote)}<br>${regions[row.reg] || row.reg}${row.eligible ? " · 当前可出战" : " · 当前不可出战，可预选"}</span></span></label>`).join("") : '<div class="pca-note">没有符合列表筛选的已持有宝可梦。可降低门槛、修改搜索或取消“只看当前可出战”。</div>';
    const count = document.querySelector("#pca-pool-visible");
    if (count) count.textContent = `当前显示 ${rows.length} 只`;
    renderPoolSummary(save);
  }

  function renderPoolSummary(save = readSave()) {
    const summary = document.querySelector("#pca-pool-summary");
    if (!summary) return;
    const draft = getPoolDraft();
    const current = poolSummary(save, { ...draft, enabled: true });
    const saved = poolSummary(save);
    const canonical = (config) => { const value = normalizePool(config); return JSON.stringify({ ...value, uids: [...value.uids].sort() }); };
    const dirty = canonical(draft) !== canonical(settings.candidatePool);
    const missing = current.missing ? `；${current.missing}只当前不在电脑/队伍中` : "";
    summary.textContent = `草稿已选${current.selected}只；当前合格${current.eligible}只，可用名额${Math.min(6, current.unique)}/6${missing}。${dirty ? "有未保存修改。" : "已保存。"}${draft.enabled && current.unique < 6 ? "不足六只时按实际人数配队，不从池外补足。" : ""}`;
    const active = document.querySelector("#pca-pool-active");
    if (active) active.textContent = saved.enabled ? `生效规则：限定已保存的${saved.selected}只，含异色/强化的有效BST≥${saved.minBst}；当前可出战${saved.eligible}只。` : "生效规则：候选池未启用，自动配队仍使用全部可出战成员。";
    const saveButton = document.querySelector('[data-act="pool-save"]');
    if (saveButton) saveButton.disabled = runtime.busy;
  }

  function poolSelectionAction(action) {
    const save = readSave();
    const draft = getPoolDraft();
    if (action === "pool-reset") {
      const saved = normalizePool(settings.candidatePool);
      poolDraft = { ...saved, uids: [...saved.uids], query: "", onlyEligible: true };
      syncPoolControls();
    } else if (action === "pool-clear") draft.uids = [];
    else if (action === "pool-select-visible") draft.uids = [...new Set([...draft.uids, ...poolRows(save, draft).map((row) => row.uid)])];
    else if (action === "pool-current") {
      const minimum = normalizePool(draft).minBst;
      draft.uids = [...new Set([...draft.uids, ...save.team.map((uid) => save.mons.find((mon) => mon.uid === uid)).filter((mon) => mon && effectiveStatTotal(mon) + 1e-9 >= minimum).map((mon) => String(mon.uid))])];
    }
    renderPoolList(save);
  }

  function syncPoolControls() {
    const draft = getPoolDraft();
    const enabled = document.querySelector("#pca-pool-enable");
    const minimum = document.querySelector("#pca-pool-min");
    const query = document.querySelector("#pca-pool-search");
    const eligible = document.querySelector("#pca-pool-eligible");
    if (enabled) enabled.checked = draft.enabled;
    if (minimum) minimum.value = draft.minBst;
    if (query) query.value = draft.query;
    if (eligible) eligible.checked = draft.onlyEligible;
  }

  function saveCandidatePool() {
    if (runtime.busy) { log("正在配队，候选池草稿已保留，请等待操作结束再保存"); return false; }
    const saved = normalizePool(getPoolDraft());
    settings.candidatePool = saved;
    saveSettings();
    const save = readSave();
    const evaluation = poolSummary(save, saved, runtime.targetPlan?.chapter ?? save.adv.chapter);
    const wasWaiting = runtime.poolWaiting;
    runtime.poolWaiting = saved.enabled && evaluation.eligible === 0;
    runtime.reteamRequested = !!runtime.targetPlan;
    runtime.teamPlan = null;
    runtime.userTeamOverride = false;
    runtime.lastTeamSignature = "";
    runtime.failureTeams.clear();
    runtime.deathSeries.clear();
    if (runtime.mode !== "idle") {
      if (runtime.poolWaiting) runtime.paused = true;
      else if (wasWaiting) runtime.paused = false;
    }
    runtime.teamStatus = saved.enabled ? "候选池已保存，待按目标章节配队" : "候选池已关闭，待重新配队";
    log(saved.enabled ? `已保存候选池：${saved.uids.length}只，有效BST≥${saved.minBst}（含异色/强化）；仅在池内配队` : "已关闭候选池限制");
    if (runtime.poolWaiting) log("当前没有合格候选，自动任务等待；请检查勾选、种族值门槛和地区资格");
    if (settings.lockTeam5) log("第五队仍处于锁定状态，自动任务只生成推荐；可在“阵容”页取消锁定");
    renderPoolSummary(save);
    renderStatus();
    return true;
  }

  function renderPanel() {
    const style = document.createElement("style");
    style.id = "pca-style";
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
      #${PANEL_ID}.pool-open:not(.collapsed){width:min(560px,calc(100vw - 28px))}.pca-tabpanel[data-tabpanel=pool].active{display:flex;flex-direction:column;height:calc(82vh - 88px);min-height:0}.pca-pool-card{display:flex;flex-direction:column;flex:1;min-height:0;margin:0 0 5px}.pca-pool-card>*{flex-shrink:0}.pca-pool-card>.pca-pool-list{flex:1;flex-shrink:1;min-height:75px;max-height:none}.pca-pool-list{overflow:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));align-content:start;gap:5px;margin:8px 0}.pca-pool-mon{display:flex;align-items:flex-start;gap:6px;padding:7px;background:#111827;border:1px solid #3a4560;border-radius:8px;cursor:pointer;font-size:12px;overflow-wrap:anywhere}.pca-pool-mon:has(input:checked){border-color:#75a2ff;background:#243556}.pca-pool-mon.unavailable{opacity:.65}.pca-pool-meta{display:block;color:#a4b3d1;font-size:11px;margin-top:3px}.pca-wrap{flex-wrap:wrap}.pca-pool-min{width:78px}
    `;
    document.head.append(style);

    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.className = `${settings.collapsed ? "collapsed" : ""}${settings.activeTab === "pool" ? " pool-open" : ""}`;
    panel.innerHTML = `
      <div class="pca-head"><b>PokéCatch 助手</b><span class="pca-ver">v${VERSION}</span><button class="pca-btn" data-act="collapse">${settings.collapsed ? "展开" : "收起"}</button></div>
      <div class="pca-body">
        <div class="pca-tabs" role="tablist" aria-label="助手功能">
          ${[["push","推图"],["collect","全图鉴"],["pool","候选池"],["team","阵容"],["berries","果子"],["diagnostics","诊断"]].map(([key,label]) => `<button class="pca-tab ${settings.activeTab === key ? "active" : ""}" type="button" role="tab" aria-selected="${settings.activeTab === key}" data-tab="${key}">${label}</button>`).join("")}
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "push" ? "active" : ""}" role="tabpanel" data-tabpanel="push">
          <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="push">开始推图</button><button class="pca-btn pca-grow" data-act="pause">暂停/继续</button><button class="pca-btn danger" data-act="stop">停止</button></div>
          <div class="pca-note">从当前地区的剧情前沿持续推进；推图期间不会追踪神兽。</div>
          ${statusCardHtml()}
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "collect" ? "active" : ""}" role="tabpanel" data-tabpanel="collect">
          <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="collect">开始全图鉴收集</button><button class="pca-btn pca-grow" data-act="pause">暂停/继续</button><button class="pca-btn danger" data-act="stop">停止</button></div>
          <label class="pca-row"><input type="checkbox" data-setting="autoPushWhenWaiting" ${settings.autoPushWhenWaiting ? "checked" : ""}>优先目标完成或暂不可刷时自动推图，条件满足后返回收集</label>
          ${statusCardHtml()}
          <div class="pca-card"><h4>收集范围与优先级</h4>
            <div class="pca-row"><span>地区</span><select class="pca-select pca-grow" data-select-setting="regionScope"><option value="current" ${settings.regionScope === "current" ? "selected" : ""}>当前地区</option><option value="all" ${settings.regionScope === "all" ? "selected" : ""}>所有已解锁地区</option><option value="custom" ${settings.regionScope === "custom" ? "selected" : ""}>自定义地区</option></select></div>
            <div class="pca-row pca-note">${[["kanto","关都"],["johto","城都"],["hoenn","丰缘"],["sinnoh","神奥"],["unova","合众"]].map(([key,label])=>`<label><input type="checkbox" data-region="${key}" ${settings.customRegions.includes(key)?"checked":""}>${label}</label>`).join(" ")}</div>
            <div class="pca-row"><span>神兽</span><select class="pca-select pca-grow" data-select-setting="roamingOrder"><option value="243,244,245" ${settings.roamingPriority.join() === "243,244,245" ? "selected" : ""}>雷公 → 炎帝 → 水君</option><option value="245,243,244" ${settings.roamingPriority.join() === "245,243,244" ? "selected" : ""}>水君 → 雷公 → 炎帝</option><option value="244,245,243" ${settings.roamingPriority.join() === "244,245,243" ? "selected" : ""}>炎帝 → 水君 → 雷公</option></select></div>
            <div class="pca-row"><input class="pca-select pca-grow" id="pca-manual-targets" value="${settings.manualTargets.map(formatDexId).join(",")}" placeholder="编号/形态，如 479,479-A,201-?"><button class="pca-btn" data-act="targets">应用</button></div>
            <div class="pca-note">按填写顺序选章，同章目标合并刷，抓到后重算末端。自动轮换开启时，名单完成或剩余目标条件不满足就推图，条件恢复再收集；本轮未随机生成事件仍重进。关闭自动轮换后，名单完成继续其他缺失图鉴，无路线则等待。</div>
            <div id="pca-target-feedback" class="pca-note"></div>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "pool" ? "active" : ""}" role="tabpanel" data-tabpanel="pool">
          <div class="pca-card pca-pool-card"><h4>先勾选愿意培养的个体，再自动配队</h4>
            <label class="pca-row"><input id="pca-pool-enable" data-pool-config="enabled" type="checkbox">启用候选池，只从已勾选成员中挑选</label>
            <div class="pca-row"><label for="pca-pool-min">最低有效BST（含加成）</label><input id="pca-pool-min" data-pool-config="minBst" class="pca-select pca-pool-min" type="number" min="0" max="2000" step="1"></div>
            <div class="pca-note">当前形态基础BST × 异色${1 + DATA.shinyStatBonus} × 强化${DATA.rankStatMultiplier}^档数；0不设门槛。进化保留勾选。</div>
            <input id="pca-pool-search" class="pca-select" style="width:100%;margin-top:7px" placeholder="搜索名称 / 图鉴编号，如 479-A">
            <label class="pca-row"><input id="pca-pool-eligible" data-pool-config="onlyEligible" type="checkbox">列表只看当前可出战</label>
            <div class="pca-row pca-wrap"><button class="pca-btn" data-act="pool-select-visible">全选筛选结果</button><button class="pca-btn" data-act="pool-current">选入当前队伍</button><button class="pca-btn" data-act="pool-clear">清空选择</button><button class="pca-btn" data-act="pool-refresh">刷新列表</button></div>
            <div id="pca-pool-visible" class="pca-note"></div><div id="pca-pool-list" class="pca-pool-list"></div>
            <div id="pca-pool-summary" class="pca-note"></div>
            <div class="pca-row"><button class="pca-btn primary pca-grow" data-act="pool-save">保存候选池</button><button class="pca-btn" data-act="pool-reset">撤销未保存</button></div>
            <div class="pca-note">勾选和筛选先保留为草稿。运行中保存后会重新按当前目标章节配队；不足六只时不会补入池外成员。</div>
          </div><div id="pca-pool-active" class="pca-note"></div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "team" ? "active" : ""}" role="tabpanel" data-tabpanel="team">
          <div class="pca-card"><h4>阵容与队伍复制</h4>
          <label class="pca-row"><input type="checkbox" data-setting="lockTeam5" ${settings.lockTeam5 ? "checked" : ""}>锁定第五队，不自动覆盖</label>
          <div class="pca-row"><select class="pca-select pca-grow" id="pca-copy-from">${[0,1,2,3,4].map((i)=>`<option value="${i}">队伍${i+1}</option>`).join("")}</select><span>→</span><select class="pca-select pca-grow" id="pca-copy-to">${[0,1,2,3,4].map((i)=>`<option value="${i}" ${i===4?"selected":""}>队伍${i+1}</option>`).join("")}</select><button class="pca-btn" data-act="copy">复制</button></div>
          <button class="pca-btn" data-act="reteam">重新生成当前目标阵容</button>
          </div>
        </div>
        <div class="pca-tabpanel ${settings.activeTab === "berries" ? "active" : ""}" role="tabpanel" data-tabpanel="berries">
          <div class="pca-card"><h4>自动续用增益果子（新增选项默认关闭）</h4><div class="pca-berries">
          ${Object.entries(BERRIES).map(([key, info]) => `<label class="pca-berry"><input type="checkbox" data-berry="${key}" ${settings.berries[key]?.enabled ? "checked" : ""}><span>${escapeHtml(info.label)}<small class="pca-note" style="display:block">库存 <b data-berry-stock="${key}">—</b> · 每份增益${info.minutes} min</small></span></label><input type="number" min="0" title="最低保留数量" data-reserve="${key}" value="${settings.berries[key]?.reserve || 0}">`).join("")}
          </div><div class="pca-note">右侧为最低保留量，有效增益未结束时不重复消耗。同类优先较强果子。游走30 min指每处停留时长；增益本身持续${DATA.berryDurationMinutes} min。</div></div>
          <div class="pca-card"><h4>培育屋专用果子</h4>${Object.entries(DATA.otherBerries).map(([key, info]) => `<div class="pca-row" data-other-berry="${key}"><span class="pca-grow">${escapeHtml(info.name)}<small class="pca-note" style="display:block">${escapeHtml(info.effect)}</small></span><span>库存 <b data-berry-stock="${key}">—</b></span></div>`).join("")}<button class="pca-btn" data-act="pension-berries">前往培育屋使用</button><div class="pca-note">这些果子在培育屋满足产蛋条件时手动使用，不会当作战斗增益自动消耗。</div></div>
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
      else if (action === "pool-save") saveCandidatePool();
      else if (action.startsWith("pool-")) poolSelectionAction(action);
      else if (action === "pension-berries") exclusive("打开培育屋", () => openScreen("pension"));
      else if (action === "copydiag") navigator.clipboard.writeText(JSON.stringify(runtime.error || { status: "无异常", build: gameBuild() }, null, 2));
    });

    panel.addEventListener("change", (event) => {
      if (event.target.dataset.poolUid) {
        const draft = getPoolDraft();
        const uid = event.target.dataset.poolUid;
        draft.uids = event.target.checked ? [...new Set([...draft.uids, uid])] : draft.uids.filter((value) => value !== uid);
        renderPoolSummary();
        return;
      }
      const poolConfig = event.target.dataset.poolConfig;
      if (poolConfig) {
        getPoolDraft()[poolConfig] = poolConfig === "minBst" ? normalizePool({ minBst: event.target.value }).minBst : event.target.checked;
        renderPoolList();
        return;
      }
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
    panel.addEventListener("input", (event) => {
      if (event.target.id === "pca-pool-search") { getPoolDraft().query = event.target.value; renderPoolList(); }
    });
    window.addEventListener("resize", panelResizeHandler);
    syncPoolControls();
    renderPoolList();
    renderStatus();
    renderLog();
  }

  function statusCardHtml() {
    return `<div class="pca-card"><h4>当前任务状态</h4><div class="pca-kv">
      <span>任务</span><b data-status="mode">空闲</b><span>轮换</span><b data-status="auto">—</b><span>目标</span><b data-status="target">—</b><span>位置</span><b data-status="place">—</b><span>尝试</span><b data-status="attempts">0</b><span>增益</span><b data-status="buffs">—</b><span>候选池</span><b data-status="pool">未启用</b><span>第五队</span><b data-status="team" class="pca-team">未生成</b>
    </div></div>`;
  }

  function selectPanelTab(panel, tab) {
    const allowed = new Set(["push", "collect", "pool", "team", "berries", "diagnostics"]);
    if (!allowed.has(tab)) return;
    settings.activeTab = tab;
    saveSettings();
    panel.classList.toggle("pool-open", tab === "pool");
    panel.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    panel.querySelectorAll("[data-tabpanel]").forEach((tabpanel) => tabpanel.classList.toggle("active", tabpanel.dataset.tabpanel === tab));
    if (tab === "pool") renderPoolList();
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
      : runtime.targetPlan.speciesIds || [runtime.targetPlan.speciesId].filter(Boolean);
    const plan = recommendTeam(save, enemyIds);
    await exclusive("手动重新生成阵容", () => applyRecommendedTeam(plan, "用户要求重新生成"));
  }

  function applyManualTargets() {
    const input = document.querySelector("#pca-manual-targets");
    const { ids, invalid } = parseTargetInput(input?.value);
    if (invalid.length) log(`未识别编号/名称：${invalid.join("、")}`, "error");
    // 全部输入无效时保留旧目标，避免误切回自动收集所有缺失图鉴。
    if (invalid.length && !ids.length) return;
    settings.manualTargets = ids;
    if (input) input.value = settings.manualTargets.map(formatDexId).join(",");
    saveSettings();
    runtime.target = null;
    runtime.targetPlan = null;
    log(settings.manualTargets.length ? `已识别优先目标：${settings.manualTargets.map((id) => `${formatDexId(id)} ${species(id).n}`).join("、")}` : "已恢复自动缺失图鉴排序");
    renderStatus();
  }

  function renderStatus() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    // DOM标记跨用户脚本沙箱可读，便于核对真实安装来源与单实例状态。
    panel.dataset.pcaVersion = VERSION;
    panel.dataset.pcaSource = typeof GM_info !== "undefined" ? GM_info.scriptHandler || "userscript" : "manual";
    panel.dataset.pcaMode = runtime.mode;
    panel.dataset.pcaIntent = runtime.intent;
    let save = null;
    try { save = readSave(); } catch { /* ignore */ }
    if (runtime.teamStatus.startsWith("已配队（下个中心生效）") && save && JSON.stringify(save.road) === JSON.stringify(save.team)) {
      runtime.teamStatus = runtime.teamStatus.replace("已配队（下个中心生效）", "已应用");
    }
    const baseModeLabel = runtime.mode === "push" ? "推图" : runtime.mode === "collect" ? "全图鉴收集" : "空闲";
    const modeLabel = runtime.intent === "collect" && settings.autoPushWhenWaiting ? `自动轮换 · ${baseModeLabel}` : baseModeLabel;
    const modeText = `${modeLabel}${runtime.paused ? "（暂停）" : runtime.busy ? "（操作中）" : ""}`;
    panel.querySelectorAll('[data-status="auto"]').forEach((node) => { node.textContent = runtime.intent === "collect" && settings.autoPushWhenWaiting ? runtime.autoReason || "优先收集，条件不足时推图" : "未启用"; });
    panel.querySelectorAll('[data-status="mode"]').forEach((node) => {
      node.textContent = modeText;
      node.className = runtime.error ? "pca-status err" : runtime.paused ? "pca-status pause" : runtime.mode !== "idle" ? "pca-status run" : "";
    });
    const targetName = runtime.collectWaiting ? "等待目标条件满足" : runtime.targetPlan?.speciesIds ? runtime.targetPlan.speciesIds.map((id) => `${formatDexId(id)} ${species(id)?.n}`).join("、") : runtime.targetPlan?.speciesId ? species(runtime.targetPlan.speciesId)?.n : runtime.targetPlan?.chapterName;
    panel.querySelectorAll('[data-status="target"]').forEach((node) => { node.textContent = targetName || "—"; });
    panel.querySelectorAll('[data-status="place"]').forEach((node) => { node.textContent = `${chapter(save?.adv?.chapter)?.name || "—"}${runtime.targetPlan?.zones ? ` / ${runtime.targetPlan.zones.join(" → ")}` : runtime.targetPlan?.zone ? ` / ${runtime.targetPlan.zone}` : ""}`; });
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
    const savedPool = save ? poolSummary(save) : normalizePool(settings.candidatePool);
    panel.querySelectorAll('[data-status="pool"]').forEach((node) => { node.textContent = savedPool.enabled ? `限定${savedPool.selected ?? savedPool.uids?.length ?? 0}只 · BST≥${savedPool.minBst}` : "未启用"; });
    panel.querySelector("#pca-error").textContent = runtime.error ? `${runtime.error.phase}：${runtime.error.observed}\n建议：${runtime.error.suggestion}` : `无异常 · 游戏 ${gameBuild()} · 数据 ${DATA.appBuild}${runtime.autoReason ? ` · ${runtime.autoReason}` : ""}`;
    const feedback = panel.querySelector("#pca-target-feedback");
    if (feedback) feedback.textContent = settings.manualTargets.map((id) => {
      const state = save && isCaught(save, id) ? "已捕获" : save && plansForSpecies(save, id).length ? "有可刷路线（同章合并）" : "等待条件/解锁，或无自动路线";
      return `${formatDexId(id)} ${species(id)?.n || "未知"}：${state}`;
    }).join("；");
    if (save) {
      renderPoolSummary(save);
      panel.querySelectorAll("[data-berry-stock]").forEach((node) => { node.textContent = String(save.items?.[node.dataset.berryStock] || 0); });
    }
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

  function restoreInstallationDraft() {
    try {
      const raw = sessionStorage.getItem("pca.installMigration.v1");
      if (!raw) return;
      const migration = JSON.parse(raw);
      if (!migration?.draft || !migration.settings) throw new Error("安装迁移数据不完整");
      const draft = migration.draft;
      poolDraft = { ...normalizePool(draft), query: String(draft.query || ""), onlyEligible: draft.onlyEligible !== false };
      const current = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      sessionStorage.setItem("pca.installReceipt.v1", JSON.stringify({
        version: VERSION,
        source: typeof GM_info !== "undefined" ? GM_info.scriptHandler || "userscript" : "manual",
        settingsPreserved: Object.keys(migration.settings).every((key) => JSON.stringify(current[key]) === JSON.stringify(migration.settings[key])),
        draftPreserved: JSON.stringify(poolDraft) === JSON.stringify(draft),
        selected: poolDraft.uids.length, minBst: poolDraft.minBst,
        priorIntent: migration.intent, priorPaused: !!migration.paused,
      }));
      sessionStorage.removeItem("pca.installMigration.v1");
      renderPoolList();
      log("已接管安装前的候选池草稿；保存的培养与果子设置继续沿用");
    } catch (error) { log(`安装草稿迁移未完成：${error.message}`, "error"); }
  }

  function init() {
    // 沙箱的window未必与临时注入共享全局；DOM防重保证只启动一个面板和定时器。
    if (document.getElementById(PANEL_ID)) return;
    renderPanel();
    restoreInstallationDraft();
    offerResume();
    runtime.timer = setInterval(tick, 900);
    document.addEventListener("click", manualChapterHandler, true);
    window.__pokeCatchAssistant = {
      version: VERSION,
      startPush: () => startMode("push"),
      startCollect: () => startMode("collect"),
      pause: pauseMode,
      stop: stopMode,
      state: runtime,
      dataBuild: DATA.appBuild,
      destroy: destroy,
      parseTargets: parseTargetInput,
      targetIds: () => [...settings.manualTargets],
      previewTeam: (chapterIndex = readSave().adv.chapter) => recommendTeam(readSave(), targetEnemyIdsForChapter(chapterIndex), new Set(), chapterIndex).details,
      previewMissing: () => chooseMissingPlan(readSave()),
      previewAutomatic: () => autoModeDecision(readSave()),
      previewCollection: (text) => { const parsed = parseTargetInput(text); return { ...parsed, plan: chooseMissingPlan(readSave(), {}, parsed.ids), routes: parsed.ids.map((id) => ({ id, dex: formatDexId(id), caught: isCaught(readSave(), id), plans: plansForSpecies(readSave(), id) })) }; },
      candidatePoolStatus: () => poolSummary(readSave()),
      candidatePoolDraftSnapshot: () => structuredClone(getPoolDraft()),
      bstOf: (id, shiny = false, rank = 0) => effectiveStatTotal({ id, shiny, rank }),
    };
    log(`助手已加载，游戏数据版本 ${DATA.appBuild}`);
  }

  function panelResizeHandler() {
    const panel = document.getElementById(PANEL_ID);
    if (panel) keepPanelInViewport(panel);
  }

  function manualChapterHandler(event) {
    if (runtime.mode === "idle" || runtime.busy || !event.isTrusted) return;
    if (!event.target.closest?.(".mp-go[data-go]")) return;
    runtime.paused = true;
    log("检测到用户手动切换章节，自动任务已暂停");
    renderStatus();
  }

  function destroy() {
    stopMode();
    clearInterval(runtime.timer);
    window.removeEventListener("resize", panelResizeHandler);
    document.removeEventListener("click", manualChapterHandler, true);
    document.getElementById(PANEL_ID)?.remove();
    document.getElementById("pca-style")?.remove();
    delete window.__pokeCatchAssistant;
  }

  // 本地回归测试使用同一份发布代码；常量初始化后再导出，不启动页面。
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { DATA, BERRIES, runtime, settings, species, isCaught, normalizeRegion, canBattleMon, teamIdentity, normalizePool, baseStatTotal, rankOf, statMultiplier, effectiveStatTotal, statNote, berryUseCandidates, manageBerries, teamCandidates, poolSummary, getPoolDraft, poolRows, poolSelectionAction, saveCandidatePool, renderPanel, renderPoolList, applyRecommendedTeam, tick, recommendTeam, formatDexId, parseTargetInput, applyManualTargets, collectOpportunities, weatherAt, dailySpotZone, routeWeights, refreshCollectPlan, timelinePlanStatus, collectTick, autoModeDecision, reconcileAutomaticMode, init, restoreInstallationDraft, startMode, pauseMode, pushFrontier, pushTick, plansForSpecies, chooseMissingPlan, configurePreset, dragMon, stopMode };
    return;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
