/* 日本語フォントが入っている.fontsを読み込ませるためにHOMEを設定する */
process.env['HOME'] = '/opt/nodejs/';

const chromium = require('chrome-aws-lambda');
const puppeteer = chromium.puppeteer;

let browser = null;

// Puppeteerオブジェクトの初期化・取得
async function initPuppeteer(page) {
  browser = await puppeteer.launch({
    args: chromium.args.concat(['--lang=ja']),
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  let puppeteerPage = await browser.newPage();
  await puppeteerPage.setExtraHTTPHeaders({
    'Accept-Language': 'ja-JP'
  });

  // ブラウザ情報の設定適用
  if (page.browserSettings.deviceType === "custom") {
    if (page.browserSettings.userAgent) await puppeteerPage.setUserAgent(page.browserSettings.userAgent);
    if (page.browserSettings.viewport) await puppeteerPage.setViewport(page.browserSettings.viewport);
  } else {
    const device = puppeteer.devices[page.browserSettings.deviceType]; 
    await puppeteerPage.emulate(device);
  }

  return puppeteerPage;
}
module.exports.initPuppeteer = initPuppeteer;

// ブラウザ操作
async function browserAction(puppeteerPage, action) {

  // アクション種別
  const GOTO = 'GOTO'; // ページ移動
  const WAIT = 'WAIT'; // 待機
  
  console.log('switch ' + action.type);

  switch (action.type) {
    case GOTO: {
      if (action.basicAuth) {
        await puppeteerPage.authenticate(action.basicAuth);
      }
      await puppeteerPage.goto(action.url);
      break;
    }
    case WAIT: {
      await puppeteerPage.waitFor(action.millisecond);
      break;
    }
    default:
      e.log(action);
  }
}
module.exports.browserAction = browserAction;

// スクリーンショット撮影
async function screenshots(puppeteerPage, screenshotOptions) {
  return await puppeteerPage.screenshot({
    ...screenshotOptions,
    type: 'jpeg'
  });
}
module.exports.screenshots = screenshots;

// Puppeteerオブジェクトのクローズ
async function closePuppeteer() {
  await browser.close();
}
module.exports.closePuppeteer = closePuppeteer;