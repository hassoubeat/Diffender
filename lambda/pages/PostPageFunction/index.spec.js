const fs = require("fs");

// 環境変数の設定
process.env.DIFFENDER_DYNAMODB_TABLE_NAME　= "dummy";

const projectDao = require('project-dao');
const pageDao = require('page-dao');
const postPageFunction = require("./index");

// jestのマニュアルモック利用
jest.mock('project-dao');
jest.mock('page-dao');

describe('ページ登録処理 正常系テスト', () => {

  test('Lambdaハンドラのテスト', async () => {

    projectDao.getProject = () => {
      return {
        id: 'Project-1', 
        name: "プロジェクト1",
        description: 'example.com1のテスト', 
        projectTieUserId: '8c32116d-5c8c-48c0-8264-1df53434b503'
      };
    }

    pageDao.getPage = () => {
      return {
        id:'Page-1' , 
        name: 'ページ1', 
        description: 'example.com1のテスト', 
        browserSettings: {
          deviceType : null,
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

    // 投入データの生成
    const event = {
      headers: {
        Authorization: "eyJraWQiOiJEQU5keFd6WXhWazZmamhKYThHVlwvM3lOZVwvUlJuXC9MaGZUOWJUenNWTmdFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4YzMyMTE2ZC01YzhjLTQ4YzAtODI2NC0xZGY1MzQzNGI1MDMiLCJhdWQiOiJvazJjZ28ydXJxdmpia2EwcTNudWg1N2JnIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiZGIzMWI4MzAtMDkyMi00YjkzLWJmZjAtMTI1NTViNGRlMGZiIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MDAxNTU3NzAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1ub3J0aGVhc3QtMV9XVFdHVjVJT2siLCJuaWNrbmFtZSI6Imhhc3NvdWJlYXQiLCJjb2duaXRvOnVzZXJuYW1lIjoiOGMzMjExNmQtNWM4Yy00OGMwLTgyNjQtMWRmNTM0MzRiNTAzIiwiZXhwIjoxNjAwMjM5Njk0LCJpYXQiOjE2MDAyMzYwOTQsImVtYWlsIjoiaGFzc291YmVhdC53b3JrQGdtYWlsLmNvbSJ9.AIt1zvRhjThea_wMReS0NyO1Zcm228FmiJGyzHyikQj0pkMiM2vRJ01WMkNOdj3_MI-FEQG1wL8qI_DEkiS_yr1g1CECcRmGe9yQjt0EdHrcApju3MJEp1S4TVEC3vkx1_FhUCJYNad34r9Hp-b388d4rZde8E_7643v1R05wTblfjHneVtjF1KnDCEq8azlUfGX5s1OWrsZCq7UJygnIxbNyALav_GGRxgLb9Pu5_bsNmDKwePDWLvDjBY6MQjV4Oa_WfQqFdJZJvYApqp9_7E9nXCLWvywvPP_jEzPLhIGCjyzlWNzbj-FDO3UvwTt_kpopWtgHEhNOGjadl-hsA"
      },
      pathParameters: {
        projectId: "Project-1"
      },
      body: JSON.stringify({})
    };

    // 処理呼び出し
    const response = await postPageFunction.lambda_handler(event);
    expect(response).toEqual(
      {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, POST'
        },
        body: "{\"id\":\"Page-1\",\"name\":\"ページ1\",\"description\":\"example.com1のテスト\",\"browserSettings\":{\"deviceType\":null,\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1\",\"viewport\":{\"width\":667,\"height\":375}},\"screenshotOptions\":{\"fullPage\":true},\"actions\":[{\"name\":\"アクション1\",\"processType\":\"GOTO\",\"url\":\"https://www.google.com\"},{\"name\":\"アクション2\",\"processType\":\"WAIT\",\"millisecond\":1000}],\"pageTieProjectId\":\"Project-1\",\"pageTieUserId\":\"8c32116d-5c8c-48c0-8264-1df53434b503\"}"
      }
    );
  });
});

describe('ページ登録処理 異常系テスト', () => {

  test('Lambdaハンドラのテスト 401 自分が管理しているリソース以外へのアクセスエラー', async () => {

    // マニュアルモックの上書き
    projectDao.getProject = () => {
      return {
        id: 'Project-1', 
        name: "プロジェクト1",
        description: 'example.com1のテスト', 
        projectTieUserId: '111111-11111-11111111'
      };
    }

    // 投入データの生成
    const event = {
      headers: {
        Authorization: "eyJraWQiOiJEQU5keFd6WXhWazZmamhKYThHVlwvM3lOZVwvUlJuXC9MaGZUOWJUenNWTmdFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4YzMyMTE2ZC01YzhjLTQ4YzAtODI2NC0xZGY1MzQzNGI1MDMiLCJhdWQiOiJvazJjZ28ydXJxdmpia2EwcTNudWg1N2JnIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiZGIzMWI4MzAtMDkyMi00YjkzLWJmZjAtMTI1NTViNGRlMGZiIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MDAxNTU3NzAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1ub3J0aGVhc3QtMV9XVFdHVjVJT2siLCJuaWNrbmFtZSI6Imhhc3NvdWJlYXQiLCJjb2duaXRvOnVzZXJuYW1lIjoiOGMzMjExNmQtNWM4Yy00OGMwLTgyNjQtMWRmNTM0MzRiNTAzIiwiZXhwIjoxNjAwMjM5Njk0LCJpYXQiOjE2MDAyMzYwOTQsImVtYWlsIjoiaGFzc291YmVhdC53b3JrQGdtYWlsLmNvbSJ9.AIt1zvRhjThea_wMReS0NyO1Zcm228FmiJGyzHyikQj0pkMiM2vRJ01WMkNOdj3_MI-FEQG1wL8qI_DEkiS_yr1g1CECcRmGe9yQjt0EdHrcApju3MJEp1S4TVEC3vkx1_FhUCJYNad34r9Hp-b388d4rZde8E_7643v1R05wTblfjHneVtjF1KnDCEq8azlUfGX5s1OWrsZCq7UJygnIxbNyALav_GGRxgLb9Pu5_bsNmDKwePDWLvDjBY6MQjV4Oa_WfQqFdJZJvYApqp9_7E9nXCLWvywvPP_jEzPLhIGCjyzlWNzbj-FDO3UvwTt_kpopWtgHEhNOGjadl-hsA"
      },
      pathParameters: {
        projectId: "Project-1"
      },
      body: JSON.stringify({})
    };

    // 処理呼び出し
    const response = await postPageFunction.lambda_handler(event);
    expect(response).toEqual(
      {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, POST'
        },
        body: `{"message":"Unauthorized resource."}`
      }
    );
  });
});