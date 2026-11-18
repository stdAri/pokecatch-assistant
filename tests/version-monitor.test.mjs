import assert from "node:assert/strict";
import test from "node:test";

import { createUpdateMessage, extractExpectedBuilds, extractPublishedBuilds } from "../scripts/check-game-version.mjs";

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

test("version monitor sends a bounded Bot API compatibility brief", () => {
  const message = createUpdateMessage({
    published: { appBuild: "new-app", langBuild: "new-lang" },
    expected: { appBuild: "old-app", langBuild: "old-lang" },
    projectRoot: "D:\\Project\\pokecatch-assistant",
  });
  assert.match(message, /D:\\Project\\pokecatch-assistant/);
  assert.match(message, /app=new-app，zh-Hans=new-lang/);
  assert.match(message, /app=old-app，zh-Hans=old-lang/);
  assert.match(message, /git fetch/);
  assert.doesNotMatch(message, /HANDOFF\.md/);
  assert.match(message, /REQUIREMENTS\.md、README\.md、CHANGELOG\.md/);
  assert.match(message, /资源哈希变化不等于插件不兼容/);
  assert.match(message, /语义差异/);
  assert.match(message, /只有确认.*实际不兼容时/);
  assert.match(message, /npm test/);
  assert.ok(message.length < 4_000);
});
