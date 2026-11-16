/** Rebuild the pinned single-file variant without network or runtime dependencies. */
import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('./game-data.json', import.meta.url), 'utf8'));
const template = fs.readFileSync(new URL('./template.user.js', import.meta.url), 'utf8');
if (template.split('/*__GAME_DATA__*/').length !== 2) throw Error('Expected one data placeholder');
fs.writeFileSync(new URL('./pokecatch-assistant.user.js', import.meta.url), template.replace('/*__GAME_DATA__*/', JSON.stringify(data)));
console.log('Built pocket variant for game ' + data.appBuild);
