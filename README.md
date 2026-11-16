# PokeCatch 全图鉴与推图助手

面向 `https://pokecatch-online.netlify.app/` 的 Tampermonkey 用户脚本。

> 当前为实验性 Beta。它是玩家制作的非官方工具，与 Poke'Catch 作者、Nintendo、Game Freak、Creatures 或 The Pokémon Company 无关。

当前版本实现：

- 从当前地区剧情前沿持续推图；
- 根据章节 Boss、已观察到的敌人、属性克制、种族能力、招式和长期培养价值生成第五队；
- 等级不足时持续练级；等级因素排除后，连续失败会轮换阵容；
- 同时协调缺失图鉴刷图和雷公、炎帝、水君追踪；
- 刷完目标子区域本轮的全部有效野生节点后切章重置；
- 第五队锁定、人工接管和任意队伍复制；
- 所有战斗增益果子独立开关及最低保留量；
- 可折叠状态面板、日志、声音和桌面通知；
- 游戏版本与关键 DOM 结构不匹配时安全暂停。

脚本只读取游戏自己的 `gachamon-save-v1` 状态，并通过游戏页面中的正常按钮操作。它不会写入游戏存档、替换随机数、伪造捕获结果或调用云端存档接口。

官方游戏社区：[Poke'Catch Discord](https://discord.gg/PZfZw2n3Vr)。在社区发布或推广自动化工具前，请先向管理员确认对应频道和规则。

## 安装

1. 在 Edge 安装 Tampermonkey。
2. 打开 Tampermonkey 的“添加新脚本”。
3. 将 [`dist/pokecatch-assistant.user.js`](dist/pokecatch-assistant.user.js) 的完整内容粘贴并保存。
4. 刷新 PokeCatch，右下角会出现“PokéCatch 助手”。

首次使用建议先保持所有果子开关关闭，确认推图或收集路线符合预期后再逐项开启。

## 开发与验证

构建数据来自当前游戏前端包，不依赖运行时 LLM：

```bash
npm run build
npm test
npm run check
```

游戏前端版本变化后，需要重新下载最新的 `app.<hash>.js` 和 `lang-zh-Hans.<hash>.js`，再把新路径传给 `scripts/build.mjs`。版本不一致时，已安装脚本会停止自动操作并给出诊断。

## 隐私与问题反馈

助手不上传存档或令牌。反馈问题时只需提供面板生成的诊断内容，参见 [SECURITY.md](SECURITY.md) 和 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证状态

在公开发布前仍需由维护者确定代码许可证。生成文件包含从当前游戏前端整理出的兼容数据，不应被理解为对 Pokémon 相关素材、名称或游戏数据主张权利。
