# Playwright 反检测环境配置 · playwright-stealth

> 让 Playwright 自动化会话的运行环境更贴近真实用户，减少机器特征暴露——随机 UA / 时区 / 语言、去自动化标志、模拟 Canvas / WebRTC。

给 Playwright 注入随机且自洽的真实浏览器环境，绕开常见的反爬 / 反自动化检测。抽取自成熟项目的 stealth 实现，需 Playwright 运行时，浏览器端注入部分依赖 `page` 对象。生产环境建议搭配 `browser-fingerprint-pool`（88+ UA / 87 分辨率）使用。

## 适用场景
- 网页爬虫防风控识别
- 自动化测试中的环境伪装
- 批量操作降低被识别为脚本的概率

## 合规说明
本技能仅用于「让自动化浏览器更接近真实用户的运行环境」，请遵守目标站点服务条款与相关法律法规，仅用于合规的自动化与测试场景。

## 作为 AI 技能使用
本仓库是一个 AI Agent Skill。将 `SKILL.md` 放入 Agent 的 skills 目录即可启用；`scripts/`、`references/`、`assets/` 为配套资源。

## 许可
MIT — 可自由用于商业与个人项目。

---
由教备神器自动发布。欢迎提 PR / Issue。