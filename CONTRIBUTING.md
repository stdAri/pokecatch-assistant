# Contributing

欢迎提交问题和改进建议。报告问题时请附上：

- [Bug 报告](https://github.com/stdAri/pokecatch-assistant/issues/new?template=bug_report.yml)
- [功能建议](https://github.com/stdAri/pokecatch-assistant/issues/new?template=feature_request.yml)
- [使用疑问](https://github.com/stdAri/pokecatch-assistant/issues/new?template=question.yml)

- Poke'Catch 页面加载的 `app.<hash>.js` 版本；
- 助手版本；
- 当前模式、章节和目标；
- 面板“复制诊断”产生的内容；
- 可复现步骤。

不要提交登录令牌、完整存档、云端账号信息或其他隐私数据。

提交代码前请运行：

```bash
npm test
npm run check
```

游戏前端更新后，使用 `scripts/build.mjs` 从最新前端包重新生成 `dist/pokecatch-assistant.user.js`，并同步更新测试中的版本哈希。

