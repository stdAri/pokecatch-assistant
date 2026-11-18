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

export function createUpdateMessage({ published, expected, projectRoot = root }) {
  return [
    "PokeCatch 官方游戏资源版本检测发现变化，请处理兼容更新。",
    `项目目录：${projectRoot}`,
    `官方版本：app=${published.appBuild}，zh-Hans=${published.langBuild}`,
    `项目兼容基线：app=${expected.appBuild}，zh-Hans=${expected.langBuild}`,
    "开始前先读取 HANDOFF.md、REQUIREMENTS.md、package.json、当前 Git 状态和未提交差异。",
    "先执行 git fetch 并比较本地分支与 origin/main；工作区干净且可快进时先安全快进。存在未提交改动、分叉或冲突风险时不得覆盖或丢弃任何改动，无法无损协调时停止并如实报告。",
    "随后独立读取官方 boot.js 核验版本，不要只相信这条通知。确有更新时，把官方资源下载到项目外临时目录，备份 dist，完成构建提取器、构建配置、测试基线和生成成品的适配。",
    "实际运行 npm test、npm run check、构建和必要的本地开发验证。按 SemVer 与项目长期规则处理提交和推送，但不要创建标签或 Release。最后用中文报告同步、改动、测试、推送和遗留问题。",
  ].join("\n");
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

  const botApiUrl = process.env.POKECATCH_BOT_API_URL;
  const botApiKey = process.env.POKECATCH_BOT_API_KEY;
  if (!botApiUrl) throw new Error("缺少 POKECATCH_BOT_API_URL");
  if (!botApiKey) throw new Error("缺少 POKECATCH_BOT_API_KEY");
  const notify = await fetch(botApiUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${botApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      message: createUpdateMessage({ published, expected }),
      wait: 0,
    }),
  });
  if (!notify.ok) {
    const detail = await notify.text().catch(() => "");
    throw new Error(`Bot API 唤醒兼容更新失败：HTTP ${notify.status}${detail ? ` ${detail}` : ""}`);
  }
  const result = await notify.json().catch(() => ({}));
  await writeState(statePath, { lastNotified: signature, notifiedAt: new Date().toISOString() });
  console.log(`已通过 Bot API 通知 PokeCatch 兼容更新：${expectedSignature} -> ${signature}${result.thread ? `；thread=${result.thread}` : ""}`);
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
