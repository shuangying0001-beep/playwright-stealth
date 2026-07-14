// playwright-stealth —— Playwright 自动化浏览器环境配置（Node ESM）
// 抽取自 caijiqi-kaifa/electron/collector/stealth.ts。
// 浏览器端注入(injectStealthScripts/createStealthContext)需 Playwright 运行时；
// 纯逻辑部分(getRandomBrowserConfig/STEALTH_ARGS)可在 Node 直接验证。
// 内置精简 UA / 分辨率样本；生产可替换为 browser-fingerprint-pool 的完整数据。

// ==================== 精简样本（生产建议替换为完整池） ====================
export const RANDOM_UAS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
];

export const RANDOM_RESOLUTIONS = [
  '1920x1080', '1920x1080', '1366x768', '1366x768', '1536x864',
  '2560x1440', '1440x900', '1600x900', '1280x720', '1280x800',
];

// ==================== 站点配置 ====================
const LOCALES = {
  US: { locale: 'en-US', languages: ['en-US', 'en'] },
  UK: { locale: 'en-GB', languages: ['en-GB', 'en'] },
  DE: { locale: 'de-DE', languages: ['de-DE', 'de', 'en'] },
  FR: { locale: 'fr-FR', languages: ['fr-FR', 'fr', 'en'] },
  IT: { locale: 'it-IT', languages: ['it-IT', 'it', 'en'] },
  ES: { locale: 'es-ES', languages: ['es-ES', 'es', 'en'] },
  JP: { locale: 'ja-JP', languages: ['ja-JP', 'ja', 'en'] },
  CA: { locale: 'en-CA', languages: ['en-CA', 'en'] },
  AU: { locale: 'en-AU', languages: ['en-AU', 'en'] },
  IN: { locale: 'en-IN', languages: ['en-IN', 'en', 'hi'] },
  MX: { locale: 'es-MX', languages: ['es-MX', 'es', 'en'] },
};

const TIMEZONES = {
  US: 'America/New_York', UK: 'Europe/London', DE: 'Europe/Berlin', FR: 'Europe/Paris',
  IT: 'Europe/Rome', ES: 'Europe/Madrid', JP: 'Asia/Tokyo', CA: 'America/Toronto',
  AU: 'Australia/Sydney', IN: 'Asia/Kolkata', MX: 'America/Mexico_City',
};

// ==================== 随机配置 ====================
export function getRandomBrowserConfig(site) {
  const userAgent = RANDOM_UAS[Math.floor(Math.random() * RANDOM_UAS.length)];
  const resStr = RANDOM_RESOLUTIONS[Math.floor(Math.random() * RANDOM_RESOLUTIONS.length)];
  const [width, height] = resStr.split('x').map(Number);
  const localeConfig = LOCALES[site] || LOCALES.US;
  const timezone = TIMEZONES[site] || TIMEZONES.US;
  return {
    userAgent,
    viewport: { width, height },
    locale: localeConfig.locale,
    languages: localeConfig.languages,
    timezoneId: timezone,
  };
}

// ==================== 启动参数 ====================
export const STEALTH_ARGS = [
  '--disable-blink-features=AutomationControlled',
  '--disable-infobars',
  '--disable-dev-shm-usage',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-extensions-except=',
  '--disable-default-apps',
  '--disable-component-extensions-with-background-pages',
  '--disable-client-side-phishing-detection',
  '--no-first-run',
  '--disable-hang-monitor',
  '--disable-prompt-on-repost',
  '--disable-sync',
  '--metrics-recording-only',
  '--safebrowsing-disable-auto-update',
  '--password-store=basic',
  '--use-mock-keychain',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-background-networking',
  '--dns-prefetch-disable',
  '--disable-features=NetworkPrediction',
  '--disable-popup-blocking',
  '--disable-notifications',
  '--disable-translate',
  '--ignore-certificate-errors',
];

export const IGNORE_DEFAULT_ARGS = [
  '--enable-automation',
  '--enable-blink-features=AutomationControlled',
];

// ==================== 页面注入（需浏览器运行时） ====================
export async function injectStealthScripts(page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
    try { delete navigator.__proto__.webdriver; } catch (e) {}

    const cdcProps = ['cdc_adoQpoasnfa76pfcZLmcfl_Array', 'cdc_adoQpoasnfa76pfcZLmcfl_Promise', 'cdc_adoQpoasnfa76pfcZLmcfl_Symbol'];
    cdcProps.forEach((p) => { try { delete window[p]; } catch (e) {} });

    Object.defineProperty(window, 'outerWidth', { get: () => window.innerWidth, configurable: true });
    Object.defineProperty(window, 'outerHeight', { get: () => window.innerHeight + 100, configurable: true });

    const originalToString = Function.prototype.toString;
    Function.prototype.toString = function () {
      if (this === Function.prototype.toString) return 'function toString() { [native code] }';
      return originalToString.call(this);
    };

    const plugins = {
      length: 5,
      0: { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
      1: { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
      2: { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' },
      3: { name: 'Chromium PDF Plugin', filename: 'internal-pdf-viewer', description: '' },
      4: { name: 'Chromium PDF Viewer', filename: 'internal-pdf-viewer', description: '' },
      item: (i) => plugins[i],
      namedItem: (name) => Object.values(plugins).find((p) => p && p.name === name),
      refresh: () => {},
    };
    Object.defineProperty(navigator, 'plugins', { get: () => plugins, configurable: true });

    const canvasNoise = () => (Math.random() - 0.5) * 0.02;
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      const context = originalGetContext.call(this, type, ...args);
      if (type === '2d' && context) {
        const ctx = context;
        const originalFillText = ctx.fillText;
        ctx.fillText = function (...textArgs) {
          if (textArgs[1]) textArgs[1] += canvasNoise();
          if (textArgs[2]) textArgs[2] += canvasNoise();
          return originalFillText.apply(this, textArgs);
        };
      }
      if ((type === 'webgl' || type === 'webgl2') && context) {
        const gl = context;
        const originalGetParameter = gl.getParameter;
        gl.getParameter = function (param) {
          if (param === 37445) return 'Intel Inc.';
          if (param === 37446) return 'Intel Iris OpenGL Engine';
          return originalGetParameter.call(this, param);
        };
      }
      return context;
    };

    const audioNoise = () => Math.random() * 0.0001;
    ['AudioContext', 'webkitAudioContext'].forEach((cls) => {
      if (window[cls]) {
        const OriginalAudio = window[cls];
        window[cls] = function (...args) {
          const context = new OriginalAudio(...args);
          const originalCreateOscillator = context.createOscillator;
          context.createOscillator = function () {
            const osc = originalCreateOscillator.call(this);
            const origFreq = osc.frequency.value;
            Object.defineProperty(osc.frequency, 'value', { get: () => origFreq + audioNoise(), configurable: true });
            return osc;
          };
          return context;
        };
        window[cls].prototype = OriginalAudio.prototype;
      }
    });

    Object.defineProperty(navigator, 'platform', { get: () => 'Win32', configurable: true });
    Object.defineProperty(navigator, 'vendor', { get: () => 'Google Inc.', configurable: true });

    const originalQuery = navigator.permissions.query;
    navigator.permissions.query = (parameters) =>
      (parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters));

    Object.defineProperty(window.screen, 'availWidth', { get: () => window.innerWidth, configurable: true });
    Object.defineProperty(window.screen, 'availHeight', { get: () => window.innerHeight, configurable: true });
  });
}

// ==================== 创建上下文 ====================
export async function createStealthContext(browser, site, proxy) {
  const config = getRandomBrowserConfig(site);
  const contextOptions = {
    viewport: config.viewport,
    userAgent: config.userAgent,
    locale: config.locale,
    timezoneId: config.timezoneId,
    permissions: ['geolocation'],
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    javaScriptEnabled: true,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  };
  if (proxy) contextOptions.proxy = proxy;

  const context = await browser.newContext(contextOptions);
  context.setDefaultTimeout(30000);
  context.setDefaultNavigationTimeout(60000);
  return { context, config };
}

// Node 直接运行：验证纯逻辑
if (process.argv.includes('--selftest')) {
  let pass = 0, fail = 0;
  const cfg = getRandomBrowserConfig('DE');
  const ok1 = cfg.userAgent.startsWith('Mozilla/5.0') && cfg.viewport.width > 0 && cfg.locale === 'de-DE' && cfg.timezoneId === 'Europe/Berlin';
  console.log(`[${ok1 ? 'PASS' : 'FAIL'}] getRandomBrowserConfig(DE): ${JSON.stringify(cfg)}`);
  ok1 ? pass++ : fail++;

  const ok2 = STEALTH_ARGS.includes('--disable-blink-features=AutomationControlled') && IGNORE_DEFAULT_ARGS.includes('--enable-automation');
  console.log(`[${ok2 ? 'PASS' : 'FAIL'}] STEALTH_ARGS/IGNORE_DEFAULT_ARGS present`);
  ok2 ? pass++ : fail++;

  const ok3 = getRandomBrowserConfig('XX').timezoneId === 'America/New_York'; // 缺省站点回退 US
  console.log(`[${ok3 ? 'PASS' : 'FAIL'}] fallback site -> US timezone`);
  ok3 ? pass++ : fail++;

  console.log(`\n结果: ${pass} passed, ${fail} failed`);
  console.log('(注: injectStealthScripts/createStealthContext 需 Playwright 浏览器运行时，未在此单测)');
  process.exit(fail ? 1 : 0);
}
