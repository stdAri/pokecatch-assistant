// Run the independently packaged variant regressions in the normal npm test / CI job.
import '../variants/pocket/assistant.test.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
test('pocket published artifact matches its template and pinned data', () => {
  const base = new URL('../variants/pocket/', import.meta.url);
  const template = fs.readFileSync(new URL('template.user.js', base), 'utf8');
  const data = JSON.parse(fs.readFileSync(new URL('game-data.json', base), 'utf8'));
  const artifact = fs.readFileSync(new URL('pokecatch-assistant.user.js', base), 'utf8');
  assert.equal(template.split('/*__GAME_DATA__*/').length, 2);
  assert.equal(template.replace('/*__GAME_DATA__*/', JSON.stringify(data)), artifact);
});
