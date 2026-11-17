import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const BOOT_URL = "https://pokecatch-online.pages.dev/boot.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function extractPublishedBuilds(source) {
  const appBuild = source.match(/\/bundle\/app\.([^."']+)\.js/)?.[1];
  const langBuild = source.match(/\/bundle\/lang-zh-Hans\.([^."']+)\.js/)?.[1];
  if (!appBuild || !langBuild) throw new Error("boot.js 中缺少 app 或 zh-Hans 资源版本");
  return { appBuild, langBuild };
}

export function extractExpectedBuilds(buildCommand) {
  const appBuild = buildCommand.match(/pokecatch-app\.([^.\s/]+)\.js/)?.[1];
  const langBuild = buildCommand.match(/pokecatch-lang-zh-Hans\.([^.\s/]+)\.js/)?.[1];
  if (!appBuild || !langBuild) throw new Error("package.json 构建命令中缺少兼容资源版本");
  return { appBuild, langBuild };
}

async function readState(statePath) {
  try {
    return JSON.parse(await fs.promises.readFile(statePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

async function writeState(statePath, state) {
  await fs.promises.mkdir(path.dirname(statePath), { recursive: true, mode: 0o700 });
  await fs.promises.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
}

async function main() {
  const packageJson = JSON.parse(await fs.promises.readFile(path.join(root, "package.json"), "utf8"));
  const expected = extractExpectedBuilds(packageJson.scripts?.build || "");
  const response = await fetch(BOOT_URL, { headers: { "cache-control": "no-cache" } });
  if (!response.ok) throw new Error(`读取游戏 boot.js 失败：HTTP ${response.status}`);
  const published = extractPublishedBuilds(await response.text());
  const signature = `${published.appBuild}:${published.langBuild}`;
  const expectedSignature = `${expected.appBuild}:${expected.langBuild}`;
  const statePath = process.env.POKECATCH_VERSION_STATE
    || path.join(os.homedir(), ".openmausbot", "state", "pokecatch-version-monitor.json");

  if (signature === expectedSignature) {
    const state = await readState(statePath);
    if (state.lastNotified) await writeState(statePath, {});
    console.log(`PokeCatch 版本未变化：${signature}`);
    return;
  }

  const state = await readState(statePath);
  if (state.lastNotified === signature) {
    console.log(`PokeCatch 版本变化已通知：${signature}`);
    return;
  }

  const webhook = process.env.POKECATCH_UPDATE_WEBHOOK;
  if (!webhook) throw new Error("缺少 POKECATCH_UPDATE_WEBHOOK");
  const notify = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      kind: "pokecatch-game-version-changed",
      appBuild: published.appBuild,
      langBuild: published.langBuild,
      expectedAppBuild: expected.appBuild,
      expectedLangBuild: expected.langBuild,
      detectedAt: new Date().toISOString(),
    }),
  });
  if (!notify.ok) throw new Error(`唤醒兼容更新失败：HTTP ${notify.status}`);
  await writeState(statePath, { lastNotified: signature, notifiedAt: new Date().toISOString() });
  console.log(`已通知 PokeCatch 兼容更新：${expectedSignature} -> ${signature}`);
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
