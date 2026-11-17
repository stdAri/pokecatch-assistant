# PokeCatch 全图鉴与推图助手

面向 `https://pokecatch-online.netlify.app/` 的 Tampermonkey 用户脚本。

[![CI](https://github.com/stdAri/pokecatch-assistant/actions/workflows/ci.yml/badge.svg)](https://github.com/stdAri/pokecatch-assistant/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-0.8.1-blue)](CHANGELOG.md)

> 当前为实验性 Beta。它是玩家制作的非官方工具，与 Poke'Catch 作者、Nintendo、Game Freak、Creatures 或 The Pokémon Company 无关。

当前版本实现：

- 从当前地区剧情前沿持续推图；
- 根据章节 Boss、已观察到的敌人、属性克制、种族能力、招式和长期培养价值生成第五队；
- 等级不足时持续练级；等级因素排除后，连续失败会轮换阵容；
- 推图、普通缺失图鉴、仅追踪雷公/炎帝/水君、普通与神兽协同四个入口互相独立；推图不追踪神兽，三个收集入口同一时间只运行一个；
- 收集页可按当前地区、所有已解锁地区或自定义地区严格筛选目标，并显示最多5个自动待抓目标；跨地区自动目标固定按关都、城都、丰缘、神奥、合众顺序处理，地区内按出现效率、前置节点及当地队伍等级适配度排序；默认开启“为全收集自动推图”，仅在范围内没有立即可抓目标、但仍有目标受剧情锁定时推进一个解锁阶段，随后立即重新扫描，也可关闭；
- 普通野外目标与徘徊神兽分区设置，神兽优先级可直接上移、下移；
- 神兽候选由游戏 `roam.at` 实时列表驱动；失败后立即切章重置，目标消失后只确认一次捕获结果并重新规划，状态冲突时安全暂停；
- 收集任务配队会提高当前等级权重，以应对 100 级徘徊神兽；推图仍优先长期培养价值；
- 雷公、炎帝、水君的自动队伍会强优先选择 `Lv.90+` 宝可梦；不足六只时才按神兽专用评分选取低等级候补；
- 培养页可按个体建立候选池；启用后自动配队只从已选个体中选择，并可按“当前形态种族值总和 × 异色加成 × 地下强化加成”设置最低综合能力值；候选不足六只时不会从池外补人；
- 手动优先图鉴编号会即时显示对应宝可梦名称和可用状态；
- 手动目标支持游戏显示的特殊形态编号，例如未知图腾 `201-H` 和阿尔宙斯 `493-A`；
- 可识别并在条件满足后自动进入传说宝可梦特殊捕获地点，例如洛奇亚的漩涡列岛、凤王的铃铛塔；条件未满足时显示具体地点和缺少的前置条件；
- 刷完目标子区域本轮的全部有效野生节点后切章重置；
- 第五队锁定、人工接管和任意队伍复制；队伍应用通过游戏原有拖拽交互完成；
- 城都、丰缘、神奥、合众等独立队伍地区只使用当前一侧可用成员；不足六只时按实际人数配队，队伍复制会先打开游戏队伍页完成原生预设初始化；
- 跨地区捕获会先切换到目标章节所属地区，再选择目标章节，并读取当地存档、使用当地成员配队；普通、特殊捕获和徘徊神兽均遵循这一顺序；
- 可按关都、城都、丰缘、神奥、合众多选范围，逐图鉴编号批量开启、关闭或取消当前可访问、可重复获取的非传说宝可梦“保留重复”；已符合目标状态的编号会跳过，游戏实际按进化家族共享设置；
- 所有战斗增益果子按游戏原名显示效果，支持独立开关及最低保留量；包括使徘徊宝可梦停留30分钟的雾莲果；
- 已启用的果子会按游戏时钟检测失效并自动续吃，即使当前没有运行推图或收集任务；
- 助手界面支持简体中文和 English，可跟随游戏语言或在标题栏手动切换；
- 推图、收集、培养、阵容、果子、诊断六个功能标签页；状态栏嵌入游戏顶部，助手配置层可切换为浮动窗口，支持拖动、调整大小并记忆位置、尺寸和当前标签页；
- 可折叠状态面板、日志、声音和桌面通知；
- 自动点击、切章、换队、拖放和使用果子采用随机节流，避免短时间连续操作；
- 游戏版本与关键 DOM 结构不匹配时安全暂停。

脚本只读取游戏自己的 `gachamon-save-v1` 状态，并通过游戏页面中的正常按钮操作。它不会写入游戏存档、替换随机数、伪造捕获结果或调用云端存档接口。随机节流用于降低连续操作频率，不代表绕过或规避游戏平台规则。

官方游戏社区：[Poke'Catch Discord](https://discord.gg/PZfZw2n3Vr)。在社区发布或推广自动化工具前，请先向管理员确认对应频道和规则。

## 安装

日常游玩和实机测试请使用 GitHub 稳定版。它完整保存在 Tampermonkey 中，刷新页面或重启浏览器都不依赖本地开发服务，并会从 GitHub 检查更新。

1. 在 Edge 安装 Tampermonkey。
2. 点击 [一键安装 PokeCatch 助手](https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js)。
3. 在 Tampermonkey 安装页面确认脚本名称与权限后保存。
4. 刷新 Poke'Catch，游戏顶部状态栏会出现“PokéCatch 助手”。

如果 GitHub Raw 的 `main` 分支缓存异常，可使用当前已推送版本的固定安装地址：[安装 PokeCatch 助手 v0.8.1](https://raw.githubusercontent.com/stdAri/pokecatch-assistant/0dc1d82f3824d8ff0e806711a3d0f84e8779bdd9/dist/pokecatch-assistant.user.js)。该地址绑定到真实不可变的 v0.8.1 提交，不会受 `main` 分支缓存影响；后续自动更新仍由脚本内的 `@updateURL` 获取最新稳定版。远端 CI、正式存档实机验证、标签和 Release 状态以项目发布记录为准。

如果浏览器没有自动打开 Tampermonkey 安装页，也可以打开 Tampermonkey 的“添加新脚本”，将 [`dist/pokecatch-assistant.user.js`](dist/pokecatch-assistant.user.js) 的完整内容粘贴并保存。

首次使用建议先保持所有果子开关关闭，确认推图或收集路线符合预期后再逐项开启。

## 开发与验证

构建数据来自当前游戏前端包，不依赖运行时 LLM：

```bash
npm run build
npm test
npm run check
```

游戏前端版本变化后，需要重新下载最新的 `app.<hash>.js` 和 `lang-zh-Hans.<hash>.js`，再把新路径传给 `scripts/build.mjs`。版本不一致时，已安装脚本会停止自动操作并给出诊断。

### Edge + Tampermonkey 本地开发

项目使用 `vite-plugin-monkey` 提供用户脚本开发模式：

```bash
npm install
npm run dev
```

首次运行时，Edge 会打开名称以 `Dev:` 开头的用户脚本安装页。开发版使用独立命名空间，仅在开发服务运行时有效；修改 `src/template.user.js` 并保存，游戏页会自动加载最新代码。日常游玩时关闭开发版，只启用 GitHub 稳定版，避免两个脚本同时控制游戏。正式安装包仍由 `npm run build` 生成到 `dist/pokecatch-assistant.user.js`。

自动测试还覆盖实时神兽候选、首次失败重置、目标消失后的单次确认、多只神兽优先级和捕获状态冲突安全暂停。真实游戏中的切章、队伍拖拽和长时间运行仍应先用非关键存档小范围验证。

## 隐私与问题反馈

助手不上传存档或令牌。反馈问题时只需提供面板生成的诊断内容，参见 [SECURITY.md](SECURITY.md) 和 [CONTRIBUTING.md](CONTRIBUTING.md)。

- [报告 Bug](https://github.com/stdAri/pokecatch-assistant/issues/new?template=bug_report.yml)
- [提出功能建议](https://github.com/stdAri/pokecatch-assistant/issues/new?template=feature_request.yml)
- [询问使用问题](https://github.com/stdAri/pokecatch-assistant/issues/new?template=question.yml)

## 许可证

项目代码采用 [MIT License](LICENSE)，允许使用、复制、修改和再发布。生成文件包含从当前游戏前端整理出的兼容数据；MIT License 不应被理解为对 Pokémon 相关名称、素材或第三方游戏数据主张权利或进行再许可。

## English

PokeCatch Assistant is an experimental, unofficial Tampermonkey userscript for [Poke'Catch](https://pokecatch-online.netlify.app/). It automates story progression, team-5 planning, missing-Pokédex collection, roaming-legendary tracking, and optional berry usage through the game's normal page controls.

The script reads the local `gachamon-save-v1` state but does not write to it, alter randomness, forge capture results, access authentication tokens, or call cloud-save APIs. It pauses when the supported game build or critical page structure no longer matches.

Install the GitHub stable build with Tampermonkey: [open the userscript](https://raw.githubusercontent.com/stdAri/pokecatch-assistant/main/dist/pokecatch-assistant.user.js), review its permissions, and confirm installation. The stable build works after a page refresh without a local development server and supports Simplified Chinese and English. Keep the separate `Dev:` userscript disabled unless the local Vite server is running. This project is not affiliated with the Poke'Catch authors, Nintendo, Game Freak, Creatures, or The Pokémon Company.

Project code is available under the [MIT License](LICENSE). This license does not claim ownership of or relicense Pokémon-related names, assets, or third-party game data.
