import assert from "node:assert/strict";
import test from "node:test";

import { extractExpectedBuilds, extractPublishedBuilds } from "../scripts/check-game-version.mjs";

test("version monitor extracts published game resource hashes", () => {
  const source = 'js:"https://pokecatch-online.pages.dev/bundle/app.17255d8d2e.js",LANG_FILES={"zh-Hans":["https://pokecatch-online.pages.dev/bundle/lang-zh-Hans.2e9ef5e5f5.js"]}';
  assert.deepEqual(extractPublishedBuilds(source), {
    appBuild: "17255d8d2e",
    langBuild: "2e9ef5e5f5",
  });
});

test("version monitor extracts the repository compatibility baseline", () => {
  const command = "node scripts/build.mjs /private/tmp/pokecatch-app.17255d8d2e.js /private/tmp/pokecatch-lang-zh-Hans.2e9ef5e5f5.js";
  assert.deepEqual(extractExpectedBuilds(command), {
    appBuild: "17255d8d2e",
    langBuild: "2e9ef5e5f5",
  });
});

test("version monitor rejects incomplete version sources", () => {
  assert.throws(() => extractPublishedBuilds("const boot = true"), /缺少 app 或 zh-Hans/);
  assert.throws(() => extractExpectedBuilds("node scripts/build.mjs"), /缺少兼容资源版本/);
});
