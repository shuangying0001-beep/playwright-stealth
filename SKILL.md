---
name: "Playwright 反检测环境配置（去 webdriver 痕迹）"
description: "给 Playwright 注入随机 UA/时区/语言、去自动化标志、模拟 Canvas/WebRTC，绕开反爬。适合爬虫、自动化测试。"
market_desc: 用 Playwright 做网页自动化时，默认会带一串「我是机器人」的特征（navigator.webdriver、固定 UA、空插件…）。这个 skill 一行配置就能给浏览器套上随机且自洽的真实环境：随机 UA/分辨率/语言/时区、隐藏自动化标志、补齐插件与 Canvas/Audio 等指纹，让会话更像真人。
version: 1.0.0
---

# playwright-stealth —— Playwright 自动化浏览器环境配置

> 让 Playwright 自动化会话的运行环境更贴近真实用户，减少机器特征暴露。
> 抽取自 caijiqi-kaifa/electron/collector/stealth.ts。需 Playwright 运行时（浏览器端注入部分依赖 `page` 对象）。
> 内置一份精简 UA / 分辨率样本；生产环境建议搭配 `browser-fingerprint-pool`（88+ UA / 87 分辨率）使用。

## 合规说明

本 skill 仅用于**让自动化浏览器更接近真实用户的运行环境**，属于通用的浏览器环境配置能力，请遵守目标站点的服务条款与相关法律法规，仅用于合规的自动化与测试场景。

## 适用场景

- 用 Playwright 做网页自动化 / 采集 / 回归测试时，希望环境更真实、更稳定
- 需要随机化 UA、视口、语言、时区，并保持这些特征之间自洽（如分辨率与视口一致）
- 需要补齐 Canvas / WebGL / AudioContext / Plugins / Permissions 等浏览器特征，避免空特征暴露

## 用法

```js
import { getRandomBrowserConfig, STEALTH_ARGS, IGNORE_DEFAULT_ARGS,
         injectStealthScripts, createStealthContext }
  from './scripts/stealth.mjs';
import { chromium } from 'playwright';

const browser = await chromium.launch({ args: STEALTH_ARGS, ignoreDefaultArgs: IGNORE_DEFAULT_ARGS });

// 方式一：直接拿一份随机且自洽的配置
const cfg = getRandomBrowserConfig('US');
// => { userAgent, viewport:{width,height}, locale, languages, timezoneId }

// 方式二：建一个带注入的上下文（推荐）
const { context, config } = await createStealthContext(browser, 'DE');
const page = await context.newPage();
await page.goto('https://example.com');
```

## 核心 API

- `getRandomBrowserConfig(site)`：按站点返回随机 UA / 视口 / 语言 / 时区的自洽配置（站点支持 US/UK/DE/FR/IT/ES/JP/CA/AU/IN/MX，缺省 US）
- `STEALTH_ARGS`：Chromium 启动参数（去除自动化相关标志、关闭后台节流等）
- `IGNORE_DEFAULT_ARGS`：需忽略的默认参数（`--enable-automation` 等）
- `injectStealthScripts(page)`：向页面注入环境模拟脚本（隐藏 webdriver、模拟插件/Chrome/Canvas/Audio/WebRTC/Permissions/分辨率一致性）。**需在浏览器中运行**
- `createStealthContext(browser, site, proxy?)`：创建一个已注入环境模拟的浏览器上下文

## 注意

- `injectStealthScripts` / `createStealthContext` 必须在 Playwright 浏览器运行时中执行，纯 Node 无法单测这部分；可用 `getRandomBrowserConfig` / `STEALTH_ARGS` 验证纯逻辑。
- 内置 UA / 分辨率仅为精简样本。要更大样本，把 `browser-fingerprint-pool` 的数据替换进 `RANDOM_UAS` / `RANDOM_RESOLUTIONS` 即可。
