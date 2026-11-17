import assert from "node:assert/strict";
import test from "node:test";

import { extractExpectedBuilds, extractPublishedBuilds } from "../scripts/check-game-version.mjs";

test("version monitor extracts published game resource hashes", () => {
  const source = 'js:"https://pokecatch-online.pages.dev/bundle/app.9637252c96.js",LANG_FILES={"zh-Hans":["https://pokecatch-online.pages.dev/bundle/lang-zh-Hans.0911ae03c7.js"]}';
  assert.deepEqual(extractPublishedBuilds(source), {
    appBuild: "9637252c96",
    langBuild: "0911ae03c7",
  });
});

test("version monitor extracts the repository compatibility baseline", () => {
  const command = "node scripts/build.mjs /private/tmp/pokecatch-app.9637252c96.js /private/tmp/pokecatch-lang-zh-Hans.0911ae03c7.js";
  assert.deepEqual(extractExpectedBuilds(command), {
    appBuild: "9637252c96",
    langBuild: "0911ae03c7",
  });
});

test("version monitor rejects incomplete version sources", () => {
  assert.throws(() => extractPublishedBuilds("const boot = true"), /缺少 app 或 zh-Hans/);
  assert.throws(() => extractExpectedBuilds("node scripts/build.mjs"), /缺少兼容资源版本/);
});
