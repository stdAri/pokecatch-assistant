import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../dist/pokecatch-assistant.user.js', import.meta.url), 'utf8');
const template = fs.readFileSync(new URL('../src/template.user.js', import.meta.url), 'utf8');

function loadAssistant() {
  const actions = [];
  const save = {
    lastTick: new Date(2026, 10, 18, 12).getTime(),
    adv: { chapter: 65, unlocked: 65, badges: ['Maître Sinnoh'], nodes: [], node: 0, gifts: {} },
    mons: [], dex: { 479: { caught: 1 } }, team: [], items: {}, roam: { at: {} },
  };
  const localSettings = { language: 'zh', regionScope: 'custom', customRegions: ['sinnoh'], manualTargets: [] };
  const map = { open: false, region: 'johto', row: null, view: 'teams', locked: false, sealed: false, closed: false };
  const button = (id, click = () => {}, props = {}) => ({ id, click, ...props });
  const document = {
    querySelector(selector) {
      if (selector === '#side-chapter') return button('map', () => { map.open = true; });
      if (!map.open) return null;
      if (selector === '#screen-map.active' || selector === '#screen-map.active #map-root') return {};
      if (selector === '#map-root .rg.open[data-rg="sinnoh"]') {
        return button('sinnoh', () => { map.region = 'sinnoh'; map.row = null; });
      }
      if (selector === '#map-root .mp-row[data-ch="Z480"]' && map.region === 'sinnoh' && !map.locked) {
        return button('Z480', () => { map.row = 'Z480'; }, { classList: { contains: (name) => name === 'lz-seal' && map.sealed } });
      }
      if (selector === '#map-root [data-lz-view="zone"]:not(.on)' && map.view === 'teams') {
        return button('zone', () => { map.view = 'zone'; });
      }
      if (selector === '#map-root .mp-go[data-zone="480"]:not([data-tier])' && map.row === 'Z480' && map.view === 'zone') {
        return button('enter:480', () => { save.adv.zone = { id: 480, foe: 480 }; }, { disabled: map.closed, textContent: '等待开放' });
      }
      return null;
    },
  };
  const context = {
    window: {}, document, structuredClone, console: { log() {}, error() {} },
    localStorage: { getItem(key) { return JSON.stringify(key === 'gachamon-save-v1' ? save : localSettings); } },
    fixture: { actions, map, weather: 'sun' },
  };
  const marker = '  if (document.readyState === "loading")';
  assert.ok(source.includes(marker));
  const probe = `
  globalThis.p = { DATA, settings, runtime, enterSpecialZone, specialTargetStatus, specialPlansForSpecies,
    activeRoamers, normalTransitChapter, actualStoryChapter, plansForSpecies, collectTick, specialMoonAt };
  openScreen = async () => { fixture.map.open = false; };
  pacedClick = async (element) => { fixture.actions.push(element.id); element.click(); };
  waitFor = async (get, { label }) => { const value = get(); if (!value) throw Error('等待' + label + '超时'); return value; };
  log = () => {};
  exclusive = async (_, action) => { await action(); return true; };
  applyRecommendedTeam = async () => {};
  recommendRoamingTeam = () => ({ mons: [] });
  currentWeatherForRoute = () => fixture.weather;
  return;
  `;
  vm.runInNewContext(source.replace(marker, probe + marker), context, { timeout: 3000 });
  return { p: context.p, save, actions, map, fixture: context.fixture };
}

const uxie = { speciesId: 480, zone: '睿智洞窟' };

test('generated data preserves native roaming groups and Sinnoh location gates', () => {
  const { p } = loadAssistant();
  const zones = p.DATA.specialZones;
  const find = (id) => zones.find((zone) => zone.id === id);
  assert.deepEqual(Array.from(p.DATA.roamingGroups.flatMap(({ ids }) => ids)), [243, 244, 245, 380, 381, 481, 641, 642]);
  assert.equal(zones.filter(({ region }) => region === 'sinnoh').length, 12);
  assert.equal(find(480).anchor, 55);
  assert.equal(find(483).when, 'day');
  assert.equal(find(484).when, 'night');
  assert.equal(find(488).moon, 'full');
  assert.equal(find(491).moon, 'new');
  assert.deepEqual(Array.from(find(386).forms), [386, 38601, 38602, 38603]);
  const normalized = source.replace(/(  const DATA = )[\s\S]*?(;\r?\n  const SAVE_KEY)/, '$1/*__GAME_DATA__*/$2');
  assert.equal(normalized.replaceAll('\r\n', '\n'), template.replaceAll('\r\n', '\n'));
});

test('the fixed encounter opens its map region, row and zone tab before clicking Fight', async () => {
  const { p, save, actions } = loadAssistant();
  assert.equal((await p.enterSpecialZone(uxie)).entered, true);
  assert.equal(save.adv.zone.id, 480);
  assert.deepEqual(actions, ['map', 'sinnoh', 'Z480', 'zone', 'enter:480']);
});

test('missing, sealed and disabled fixed entries return a reason without clicking Fight', async () => {
  for (const key of ['locked', 'sealed', 'closed']) {
    const { p, actions, map } = loadAssistant();
    map[key] = true;
    const result = await p.enterSpecialZone(uxie);
    assert.equal(result.entered, false);
    assert.ok(result.reason);
    assert.ok(!actions.includes('enter:480'));
  }
});

test('legendary-only collection selects an available fixed target and continues waiting if the game closes it', async () => {
  const { p, save, actions, map } = loadAssistant();
  const ordinarySinnoh = Object.entries(p.DATA.species).filter(([id, mon]) => id >= 387 && id <= 493 && !mon.g && !mon.m);
  for (const [id] of ordinarySinnoh.slice(0, 75)) save.dex[id] = { caught: 1 };
  map.closed = true;
  const mode = { trackRoamers: true, collectMissing: false };
  await p.collectTick(save, mode);
  assert.match(p.specialTargetStatus(save, 480).reason, /等待开放/);
  assert.equal(p.runtime.paused, false);
  await p.collectTick(save, mode);
  assert.equal(actions.filter((id) => id === 'Z480').length, 1);
  assert.equal(p.runtime.target, 'roam:waiting');
});

test('the Sinnoh roaming scout reads Mesprit and follows saved priority', () => {
  const { p, save } = loadAssistant();
  save.roam.at = { 481: { ch: 54, until: Date.now() + 60_000 }, 380: { ch: 45, until: Date.now() - 1 } };
  assert.deepEqual(Array.from(p.activeRoamers(save), (mon) => mon.id), [481]);
});

test('league navigation follows the active stage and Rotom uses a normal transit chapter', () => {
  const { p, save } = loadAssistant();
  assert.equal(p.normalTransitChapter(save, { chapter: 65 }).index, 59);
  assert.equal(p.actualStoryChapter(save, 64), 60);
  save.adv.chapter = 62;
  assert.equal(p.actualStoryChapter(save, 64), 62);
});

test('a generated Rotom remains available until its node is passed, even after weather changes', () => {
  const { p, save, fixture } = loadAssistant();
  fixture.weather = 'rain';
  assert.equal(p.plansForSpecies(save, 47901).length, 0);
  save.adv.nodes = [{ type: 'static', id: 47901 }];
  assert.equal(p.plansForSpecies(save, 47901)[0]?.static, true);
  save.adv.node = 1;
  assert.equal(p.plansForSpecies(save, 47901).length, 0);
});
