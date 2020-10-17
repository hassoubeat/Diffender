// 環境変数の設定
process.env.DIFFENDER_S3_BUCKET_NAME　= "dummy";

const pageDao = require('page-dao');
const resultItemDao = require('result-item-dao');
const s3Dao = require('s3-dao');
const screenshotProcessFunction = require("./index");

// jestのマニュアルモック利用
jest.mock('result-item-dao');
jest.mock('s3-dao');

describe('ページ取得処理 正常系テスト', () => {

  beforeAll( async () => {
    console.log("beforeAll");

    // マニュアルモックの上書き
    pageDao.getPage = () => {
      return {
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
            name: "アクション1",
            processType: "GOTO",
            url: "https://www.google.com"
          },
          {
            name: "アクション2",
            processType: "WAIT",
            millisecond: 1000
          }
        ],
        pageTieProjectId: "Project-1",
        pageTieUserId: '8c32116d-5c8c-48c0-8264-1df53434b503' 
      }
    }

    resultItemDao.getResultItem = () => {
      return {
        "id": "ResultItem-4",
        "name": "test1",
        "status": "WAIT",
        "resultItemTieResultId": "Result-5",
        "resultItemTiePageId": "Page-71",
        "resultItemTieUserId": "86dcb95f-efff-4e49-badd-74b5b9de1b85"
      }
    }
  });

  test('Lambdaハンドラのテスト 取得データ有', async () => {
    jest.setTimeout(30000);
    // 投入データの生成
    const event = {
      Records: [
        {
          body: JSON.stringify({
            "project": {
              "updateDtUnix": 1602838010816,
              "projectTieUserId": "86dcb95f-efff-4e49-badd-74b5b9de1b85",
              "createDtUnix": 1602754469505,
              "updateDt": "10/16/2020, 5:46:50 PM",
              "createDt": "10/15/2020, 6:34:29 PM",
              "pagesSortMap": {},
              "beforeCommonActions": [],
              "description": "テストプロジェクトです",
              "id": "Project-63",
              "name": "テストプロジェクト2",
              "afterCommonActions": []
            },
            "page": {
              "updateDt": "10/16/2020, 5:47:25 PM",
              "createDt": "10/16/2020, 5:47:25 PM",
              "isEnableBeforeCommonAction": true,
              "isEnableAfterCommonAction": true,
              "pageTieProjectId": "Project-63",
              "name": "test",
              "browserSettings": {
                "deviceType": "iPhone 6"
              },
              "updateDtUnix": 1602838045859,
              "createDtUnix": 1602838045859,
              "pageTieUserId": "86dcb95f-efff-4e49-badd-74b5b9de1b85",
              "screenshotOptions": {
                "fullPage": false
              },
              "description": "aaa",
              "id": "Page-119",
              "actions": [
                {
                  "name": "test",
                  "typeName": "ページ遷移",
                  "type": "GOTO",
                  "url": "http://yahoo.co.jp",
                  "basicAuth": {
                    "user": "",
                    "password": ""
                  }
                }
              ]
            },
            "resultItem": {
              "id": "ResultItem-27",
              "name": "test",
              "status": {
                "type": "WAIT",
                "message": "Waiting for screenshots."
              },
              "resultItemTieResultId": "Result-12",
              "resultItemTiePageId": "Page-119",
              "resultItemTieUserId": "86dcb95f-efff-4e49-badd-74b5b9de1b85"
            }
          })
        }
      ]
    };

    // 処理呼び出し
    const response = await screenshotProcessFunction.lambda_handler(event);
    expect(response).toEqual("finish.");
  });

});