import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

const root = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(root, "src/template.user.js");
const distPath = path.join(root, "dist/pokecatch-assistant.user.js");
const metadataPattern = /^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/;

function readGeneratedGameData() {
  const source = fs.readFileSync(distPath, "utf8");
  const marker = "const DATA = ";
  const start = source.indexOf(marker);
  const tail = source.slice(start + marker.length);
  const endOffset = tail.search(/;\r?\n  const SAVE_KEY/);
  const end = endOffset < 0 ? -1 : start + marker.length + endOffset;
  if (start < 0 || end < 0) throw new Error("dist 中缺少游戏数据；请先运行 npm run build");
  return source.slice(start + marker.length, end);
}

function injectGeneratedGameData() {
  const gameData = readGeneratedGameData();
  return {
    name: "pokecatch-generated-game-data",
    enforce: "pre",
    transform(source, id) {
      if (path.resolve(id.split("?", 1)[0]) !== templatePath) return null;
      if (!source.includes("/*__GAME_DATA__*/")) throw new Error("template game data placeholder missing");
      return {
        code: source.replace(metadataPattern, "").replace("/*__GAME_DATA__*/", gameData),
        map: null,
      };
    },
  };
}

export default defineConfig({
  optimizeDeps: {
    noDiscovery: true,
  },
  plugins: [
    injectGeneratedGameData(),
    monkey({
      entry: "src/template.user.js",
      userscript: {
        name: "Dev: PokeCatch Assistant / 全图鉴与推图助手",
        namespace: "local.pokecatch.assistant.dev",
        version: "0.17.3",
        description: "Bilingual story, Pokédex, roaming, team and berry automation / 中英双语推图、图鉴、神兽、队伍和果子自动化。",
        match: [
          "https://pokecatch-online.netlify.app/*",
          "https://pokecatch-online.pages.dev/*",
        ],
        "run-at": "document-idle",
        grant: ["GM_notification"],
      },
      server: {
        open: true,
        prefix: false,
      },
      build: {
        fileName: "pokecatch-assistant.user.js",
      },
    }),
  ],
});
