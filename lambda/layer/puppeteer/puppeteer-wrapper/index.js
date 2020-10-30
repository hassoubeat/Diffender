/* 日本語フォントが入っている.fontsを読み込ませるためにHOMEを設定する */
process.env['HOME'] = '/opt/nodejs/';

const chromium = require('chrome-aws-lambda');
const puppeteer = chromium.puppeteer;

module.exports.ACTION_TYPE_GOTO = "GOTO";
module.exports.ACTION_TYPE_WAIT = "WAIT";
module.exports.ACTION_TYPE_CLICK = "CLICK";
module.exports.ACTION_TYPE_FOCUS = "FOCUS";
module.exports.ACTION_TYPE_INPUT = "INPUT";
module.exports.ACTION_TYPE_SCROLL = "SCROLL";
module.exports.ACTION_TYPE_AUTO_SCROLL = "AUTO_SCROLL";

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
  
  console.log('switch ' + action.type);

  switch (action.type) {
    case module.exports.ACTION_TYPE_GOTO: {
      if (action.basicAuth) {
        await puppeteerPage.authenticate(action.basicAuth);
      }
      await puppeteerPage.goto(action.url);
      break;
    }
    case module.exports.ACTION_TYPE_WAIT: {
      await puppeteerPage.waitFor(action.millisecond);
      break;
    }
    case module.exports.ACTION_TYPE_CLICK: {
      await puppeteerPage.click(action.selector);
      break;
    }
    case module.exports.ACTION_TYPE_FOCUS: {
      await puppeteerPage.focus(action.selector);
      break;
    }
    case module.exports.ACTION_TYPE_INPUT: {
      await puppeteerPage.type(action.selector, action.value);
      break;
    }
    case module.exports.ACTION_TYPE_SCROLL: {
      await scroll(puppeteerPage, action.distance.xPixel, action.distance.yPixel);
      break;
    }
    default:
      console.log(action);
  }
}
module.exports.browserAction = browserAction;

// puppeteerのスクロール処理
async function scroll(puppeteerPage, xPixel=0, yPixel=0) {
  await puppeteerPage.evaluate( async (xPixel, yPixel) => {
    window.scrollBy(xPixel, yPixel);
  }, xPixel, yPixel);
}

// スクリーンショット撮影
async function screenshots(puppeteerPage, screenshotOptions) {
  return await puppeteerPage.screenshot({
    ...screenshotOptions,
    type: 'png'
  });
}
module.exports.screenshots = screenshots;

// Puppeteerオブジェクトのクローズ
async function closePuppeteer() {
  await browser.close();
}
module.exports.closePuppeteer = closePuppeteer;