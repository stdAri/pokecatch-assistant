<div align="center">

# 🎮 PokeCatch Assistant

**每天先打异色团体战，再自动推图、补全图鉴、追踪神兽并智能配队。**

面向 [Poke'Catch](https://pokecatch-online.netlify.app/) 的中英双语 Tampermonkey 助手

<p>
  <a href="https://github.com/stdAri/pokecatch-assistant/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/stdAri/pokecatch-assistant/actions/workflows/ci.yml/badge.svg"></a>
  <a href="CHANGELOG.md"><img alt="Version 0.14.0" src="https://img.shields.io/badge/version-0.14.0-blue"></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-2ea44f"></a>
  <img alt="Tampermonkey userscript" src="https://img.shields.io/badge/Tampermonkey-userscript-00485b?logo=tampermonkey">
  <img alt="Simplified Chinese and English" src="https://img.shields.io/badge/UI-简体中文%20%7C%20English-7c3aed">
  <img alt="Beta" src="https://img.shields.io/badge/status-Beta-orange">
</p>

<p>
  <a href="#中文">中文</a> ·
  <a href="#english">English</a> ·
  <a href="https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js"><strong>🚀 一键安装</strong></a> ·
  <a href="CHANGELOG.md">📋 更新日志</a>
</p>

</div>

> [!WARNING]
> 当前为实验性 Beta。它是玩家制作的非官方工具，与 Poke'Catch 作者、Nintendo、Game Freak、Creatures 或 The Pokémon Company 无关。

---

<a id="中文"></a>

## 🇨🇳 中文

### ⭐ 核心功能

| 功能 | 一眼看懂 | 关键行为 |
| --- | --- | --- |
| ✨ 每日异色团体战 | 每天优先完成可用团体战 | 调用游戏原生“优化”生成2人队，两个盟友槽依次选择列表第一项；完成后恢复原任务，不改第五队 |
| 🗺️ 自动推图 | 从当前地区剧情前沿持续推进 | 根据 Boss 与已观察敌人配队；等级不足时练级，排除等级因素后连续失败会更换组合 |
| 📚 全图鉴收集 | 自动寻找并捕获缺失目标 | 支持普通路线、特殊地点及洛托姆条件静态事件；显示最多5个待抓目标，必要时只推进到下一次解锁 |
| 🐾 神兽追踪 | 实时追踪雷公、炎帝、水君 | 支持仅神兽或普通+神兽协同；捕获失败立即重置路线，目标消失后确认结果并重新规划 |
| ⚔️ 智能配队 | 为推图、收集和神兽任务生成阵容 | 整队连续模拟道路、训练家、治疗点与道馆，并综合属性、招式、等级和培养价值；神兽队伍强优先选择 Lv.90+ |

### 🧰 辅助功能

| 模块 | 用途 |
| --- | --- |
| 🌱 培养候选池 | 自动配队优先使用勾选个体，并用“当前形态种族值 × 异色加成 × 地下强化”筛选培养对象；不足六种时从其他可出战成员补足 |
| 💞 自动伙伴练级 | 位于“培养”页，可选择队伍内外全部、仅队伍内或仅队伍外；从所选范围挑选综合能力最高且未达到徽章等级上限的宝可梦，到达上限或100级后自动轮换 |
| 🧭 跨地区规划 | 按关都→城都→丰缘→神奥→合众处理目标；先切地区和章节，再使用当地可出战成员配队 |
| 🏛️ 特殊捕获地点 | 识别漩涡列岛、铃铛塔等49个特殊目标地点，并显示缺少的徽章、宝可梦或前置条件 |
| 🔣 特殊形态编号 | 支持未知图腾 `201-H`、阿尔宙斯 `493-A` 等游戏可见编号 |
| 👥 队伍管理 | 支持第五队锁定、人工接管、重新生成及任意预设复制；所有换队均通过游戏原生拖拽 |
| ♻️ 重复宝可梦保留 | 按地区逐图鉴编号开启或关闭“保留重复”，遵循游戏的进化家族共享规则 |
| 🍓 果子管理 | 独立设置战斗果子开关和最低保留量，并按游戏时钟自动续用已启用的增益 |
| 🪟 双语界面 | 简体中文 / English，可跟随游戏语言；含六个标签页、顶部状态栏和可拖动缩放的浮动窗口 |
| 🩺 诊断与保护 | 记录任务、目标、位置和日志；未知游戏版本会警告，存档结构或关键页面不兼容时安全暂停 |
| 🧪 战斗调试 | 默认关闭；按一次完整章节挑战记录配队、节点、伤害、剩余状态与结果，可导出 JSON，数据仅存于插件 IndexedDB |

### 🎯 四种自动任务

| 模式 | 普通图鉴 | 徘徊神兽 | 自动推图 |
| --- | :---: | :---: | :---: |
| 推图 | — | — | 持续推进当前地区 |
| 普通图鉴收集 | ✓ | — | 仅在目标受剧情锁定时按需推进 |
| 仅追踪神兽 | — | ✓ | — |
| 普通 + 神兽协同 | ✓ | ✓，出现时优先 | 仅在目标受剧情锁定时按需推进 |

### 🚀 安装

日常游玩请使用 GitHub 稳定版。它完整保存在 Tampermonkey 中，刷新页面或重启浏览器都不依赖本地开发服务。

1. 在 Edge 安装 Tampermonkey。
2. 点击 [一键安装 PokeCatch 助手](https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js)。
3. 在 Tampermonkey 安装页面检查脚本名称与权限，然后保存。
4. 刷新 Poke'Catch；游戏顶部状态栏会出现“PokéCatch 助手”。

如果 GitHub Raw 的 `main` 分支缓存异常，可使用当前版本的固定安装地址：[安装 PokeCatch 助手 v0.14.0](https://raw.githubusercontent.com/stdAri/pokecatch-assistant/a91a3a27268abfa9fbcf60b7ae78056fc7148c6b/dist/pokecatch-assistant.user.js)。该地址绑定到真实不可变的 v0.14.0 实现提交，不受 `main` 分支缓存影响；后续自动更新仍由脚本内的 `@updateURL` 获取最新稳定版。

如果浏览器没有自动打开安装页，也可以在 Tampermonkey 中新建脚本，将 [`dist/pokecatch-assistant.user.js`](dist/pokecatch-assistant.user.js) 的完整内容粘贴并保存。

首次使用建议先保持所有果子开关关闭，用非关键存档确认推图、收集和团体战流程符合预期，再逐项启用。

### 🛡️ 安全边界

- 只读取游戏的 `gachamon-save-v1` 状态，不直接写入或删除游戏存档。
- 只通过游戏页面中的正常按钮、筛选和拖拽执行操作。
- 不替换随机数，不伪造捕获结果，不访问身份令牌，不调用云端存档接口。
- 自动操作采用随机节流；这用于降低连续操作频率，不代表绕过游戏平台规则。
- 未知游戏资源版本会显示警告并继续运行；关键 DOM 或存档结构不兼容时安全暂停并显示诊断。

### 🧑‍💻 开发与验证

构建数据来自当前游戏前端包，运行时不使用 LLM：

```bash
npm install
npm run build
npm test
npm run check
```

本地开发使用 `vite-plugin-monkey`：

```bash
npm run dev
```

开发版名称以 `Dev:` 开头，并使用独立命名空间。开发时关闭稳定版；日常游玩时关闭开发版，避免两个脚本同时控制游戏。正式安装包由 `npm run build` 生成到 `dist/pokecatch-assistant.user.js`。

自动测试覆盖数据构建、跨地区切章、图鉴队列、天气条件、实时神兽状态、团体战优先与配队、第五队拖拽、果子续用、界面状态及只读存档边界。

### 💬 反馈与社区

- [🐛 报告 Bug](https://github.com/stdAri/pokecatch-assistant/issues/new?template=bug_report.yml)
- [💡 提出功能建议](https://github.com/stdAri/pokecatch-assistant/issues/new?template=feature_request.yml)
- [❓ 询问使用问题](https://github.com/stdAri/pokecatch-assistant/issues/new?template=question.yml)
- [🎮 Poke'Catch Discord](https://discord.gg/PZfZw2n3Vr)

反馈问题时只需提供助手面板生成的诊断内容，不要上传存档或令牌。更多说明参见 [SECURITY.md](SECURITY.md) 和 [CONTRIBUTING.md](CONTRIBUTING.md)。在官方社区发布或推广自动化工具前，请先向管理员确认对应频道和规则。

### 📄 许可证

项目代码采用 [MIT License](LICENSE)。生成文件包含从当前游戏前端整理的兼容数据；MIT License 不代表项目对 Pokémon 相关名称、素材或第三方数据主张权利或进行再许可。

---

<a id="english"></a>

## 🇬🇧 English

### ⭐ Core features

| Feature | What it does | Key behavior |
| --- | --- | --- |
| ✨ Daily Shiny raids | Completes the available raid before other automation | Uses the game's native optimizer for the two-Pokémon raid team, chooses the first option for both ally slots, then resumes the previous task without changing Team 5 |
| 🗺️ Story progression | Continues from the current region's story frontier | Recommends a team for bosses and observed enemies, trains when underleveled, and changes combinations after repeated non-level-related defeats |
| 📚 Pokédex completion | Finds and catches missing targets | Supports the current region, all unlocked regions, or a custom scope; shows up to five queued targets and advances only to the next required unlock |
| 🐾 Roaming Legendaries | Tracks Raikou, Entei, and Suicune in real time | Runs alone or alongside ordinary collection, resets routes after failed captures, and replans when a target disappears |
| ⚔️ Deterministic team planning | Builds teams for story, collection, and roamers | Considers type matchups, base stats, learned moves, level, and long-term value; roamer teams strongly prefer Lv.90+ members |

### 🧰 Supporting features

| Module | Purpose |
| --- | --- |
| 🌱 Training pool | Prioritizes selected individuals using current-form stats, Shiny bonus, and Underground rank, then fills remaining slots from other usable species |
| 💞 Automatic Buddy training | Lives under Training and can use the team and PC, the team only, or the PC only; chooses the highest combined-stat eligible Pokémon and rotates at the badge cap or level 100 |
| 🧭 Cross-region planning | Processes Kanto → Johto → Hoenn → Sinnoh → Unova, switching region and chapter before building a team from locally available members |
| 🏛️ Special locations | Recognizes 49 special targets such as Lugia's Whirl Islands and Ho-Oh's Bell Tower, including unmet requirements |
| 🔣 Alternate-form numbers | Supports visible identifiers such as Unown `201-H` and Arceus `493-A` |
| 👥 Team tools | Locks or regenerates Team 5, supports manual takeover and preset copying, and uses the game's native drag interaction |
| ♻️ Duplicate retention | Enables or disables Keep duplicates by region while respecting the game's shared evolution-family setting |
| 🍓 Berry automation | Provides per-berry switches and reserves, and renews enabled battle buffs using the game clock |
| 🪟 Bilingual interface | Simplified Chinese / English, six tabs, a native top-bar summary, and an optional draggable, resizable floating window |
| 🩺 Diagnostics and safeguards | Warns on an unverified game build, and pauses safely when the save structure or critical page controls are incompatible |
| 🧪 Battle debugging | Off by default; records one complete chapter attempt with team decisions, nodes, damage, remaining state, and outcome in extension-only IndexedDB, with JSON export |

### 🎯 Automation modes

| Mode | Ordinary Pokédex | Roamers | Story advancement |
| --- | :---: | :---: | :---: |
| Story | — | — | Continues through the current region |
| Pokédex collection | ✓ | — | Only when a target is story-locked |
| Roamers only | — | ✓ | — |
| Pokédex + roamers | ✓ | ✓, takes priority while active | Only when a target is story-locked |

### 🚀 Installation

1. Install Tampermonkey in Edge.
2. Open the [PokeCatch Assistant userscript](https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js).
3. Review the script name and permissions, then confirm installation.
4. Refresh Poke'Catch; “PokeCatch Assistant” appears in the game's top bar.

For an immutable fallback when GitHub Raw caches the `main` branch, use [PokeCatch Assistant v0.14.0](https://raw.githubusercontent.com/stdAri/pokecatch-assistant/a91a3a27268abfa9fbcf60b7ae78056fc7148c6b/dist/pokecatch-assistant.user.js). Automatic updates still use the script's `@updateURL`.

### 🛡️ Safety

The userscript reads `gachamon-save-v1` but never writes or deletes it directly. It uses normal page controls, does not alter randomness, forge capture results, access authentication tokens, or call cloud-save APIs. An unverified game build produces a warning; incompatible save structures or critical controls still pause safely.

### 🧑‍💻 Development

```bash
npm install
npm run build
npm test
npm run check
```

Use `npm run dev` for the separate `Dev:` userscript. Keep the stable and development userscripts from running at the same time.

### 💬 Feedback and community

- [🐛 Report a bug](https://github.com/stdAri/pokecatch-assistant/issues/new?template=bug_report.yml)
- [💡 Request a feature](https://github.com/stdAri/pokecatch-assistant/issues/new?template=feature_request.yml)
- [❓ Ask a question](https://github.com/stdAri/pokecatch-assistant/issues/new?template=question.yml)
- [🎮 Poke'Catch Discord](https://discord.gg/PZfZw2n3Vr)

Do not include save data or tokens in reports. See [SECURITY.md](SECURITY.md) and [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### 📄 License

Project code is available under the [MIT License](LICENSE). This license does not claim ownership of or relicense Pokémon-related names, assets, or third-party game data.
