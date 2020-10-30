const puppeteerWrapper = require("./index");
const CONST = require("./index");

describe('puppeteerWrapper 正常系のテスト群', () => {

  test('Google TOPページ スクリーンショット取得', async () => {

    jest.setTimeout(30000);

    const page = {
      id:'Page-1' , 
      name: 'ページ1', 
      description: 'example.com1のテスト', 
      browserSettings: {
        deviceType : "custom",
        userAgent : "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
        viewport : {
          width : 667,
          height: 375,
        }
      },
      screenshotOptions: {
        fullPage: true
      },
      actions: [
        {
          type: CONST.ACTION_TYPE_GOTO,
          typeName: "ページ遷移",
          name: "アクション1",
          url: "https://yahoo.co.jp"
        },
        {
          type: CONST.ACTION_TYPE_WAIT,
          typeName: "待機",
          name: "アクション2",
          millisecond: 1000
        },
        {
          type: CONST.ACTION_TYPE_FOCUS,
          typeName: "フォーカス",
          name: "アクション3",
          selector: "input[name='p']",
        },
        {
          type: CONST.ACTION_TYPE_INPUT,
          typeName: "入力",
          name: "アクション4",
          selector: "input[name='p']",
          value: "テスト"
        },
        {
          type: CONST.ACTION_TYPE_WAIT,
          typeName: "待機",
          name: "アクション2",
          millisecond: 1000
        },
        {
          type: CONST.ACTION_TYPE_CLICK,
          typeName: "クリック",
          name: "アクション5",
          selector: "input[type='submit']"
        },
        {
          type: CONST.ACTION_TYPE_GOTO,
          typeName: "ページ遷移",
          name: "アクション1",
          url: "http://leggiero.sakura.ne.jp/xxxxbasic_auth_testxxxx/secret/kaiin_page_top.htm",
          basicAuth: {
            username: "kaiin",
            password: "naisho"
          }
        }
      ],
      pageTieProjectId: "Project-1",
      pageTieUserId: '8c32116d-5c8c-48c0-8264-1df53434b503' 
    }

    const puppeteerPage = await puppeteerWrapper.initPuppeteer(page);

    for( action of page.actions ) {
      console.log(action);
      await puppeteerWrapper.browserAction(puppeteerPage, action);
    }
    await puppeteerWrapper.screenshots(puppeteerPage, page.screenshotOptions);
  });

});