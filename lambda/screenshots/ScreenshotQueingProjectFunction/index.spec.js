const fs = require("fs");

// 環境変数の設定
process.env.DIFFENDER_DYNAMODB_TABLE_NAME　= "dummy";

const projectDao = require('project-dao');
const pageDao = require('page-dao');
const resultDao = require('result-dao');
const resultItemDao = require('result-item-dao');
const sqsDao = require('sqs-dao');
const screenshotQueingProjectFunction = require("./index");

// jestのマニュアルモック利用
jest.mock('project-dao');
jest.mock('page-dao');
jest.mock('result-dao');
jest.mock('result-item-dao');
jest.mock('sqs-dao');

describe('プロジェクト スクリーンショットリクエスト 正常系テスト', () => {

  beforeAll( async () => {
    console.log("beforeAll");

    // モッキング
    projectDao.getProject = () => {
      return { 
        id:'Project-1', 
        name: 'プロジェクト1', 
        description: 'example.com1のテスト', 
        projectTieUserId: '8c32116d-5c8c-48c0-8264-1df53434b503' 
      }
    }

    pageDao.getPageList = () => {
      return [
        { 
          id:'Page-1' ,
          name: 'ページ1', 
          description: 'example.com1のテスト', 
          pageTieUserId: '8c32116d-5c8c-48c0-8264-1df53434b503', 
          pageTieProjectId: 'Project-1' 
        },
        { 
          id:'Page-2' ,
          name: 'ページ2', 
          description: 'example.com1のテスト', 
          projectTieUserId: '8c32116d-5c8c-48c0-8264-1df53434b503' ,
          pageTieProjectId: 'Project-1' 
        },
      ]
    }

    resultDao.generateResultId = () => {
      return "Result-1"
    }

    resultDao.getResult = () => {
      return { 
        id:'Result-1', 
        name: 'リザルトテスト', 
        description: '説明', 
        type: 'SCREENSHOT', 
        resultTieUserId: '8c32116d-5c8c-48c0-8264-1df53434b503',
        resultTieProjectId: 'Project-1' 
      }
    }

    resultItemDao.generateResultItemId = () => {
      return "ResultItem-1"
    }
  });

  test.only('Lambdaハンドラのテスト', async () => {
    const event = {
      headers: {
        Authorization: "eyJraWQiOiJEQU5keFd6WXhWazZmamhKYThHVlwvM3lOZVwvUlJuXC9MaGZUOWJUenNWTmdFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4YzMyMTE2ZC01YzhjLTQ4YzAtODI2NC0xZGY1MzQzNGI1MDMiLCJhdWQiOiJvazJjZ28ydXJxdmpia2EwcTNudWg1N2JnIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiZGIzMWI4MzAtMDkyMi00YjkzLWJmZjAtMTI1NTViNGRlMGZiIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MDAxNTU3NzAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1ub3J0aGVhc3QtMV9XVFdHVjVJT2siLCJuaWNrbmFtZSI6Imhhc3NvdWJlYXQiLCJjb2duaXRvOnVzZXJuYW1lIjoiOGMzMjExNmQtNWM4Yy00OGMwLTgyNjQtMWRmNTM0MzRiNTAzIiwiZXhwIjoxNjAwMjM5Njk0LCJpYXQiOjE2MDAyMzYwOTQsImVtYWlsIjoiaGFzc291YmVhdC53b3JrQGdtYWlsLmNvbSJ9.AIt1zvRhjThea_wMReS0NyO1Zcm228FmiJGyzHyikQj0pkMiM2vRJ01WMkNOdj3_MI-FEQG1wL8qI_DEkiS_yr1g1CECcRmGe9yQjt0EdHrcApju3MJEp1S4TVEC3vkx1_FhUCJYNad34r9Hp-b388d4rZde8E_7643v1R05wTblfjHneVtjF1KnDCEq8azlUfGX5s1OWrsZCq7UJygnIxbNyALav_GGRxgLb9Pu5_bsNmDKwePDWLvDjBY6MQjV4Oa_WfQqFdJZJvYApqp9_7E9nXCLWvywvPP_jEzPLhIGCjyzlWNzbj-FDO3UvwTt_kpopWtgHEhNOGjadl-hsA"
      },
      pathParameters: {
        projectId: "Project-1"
      },
      body: JSON.stringify({
        name: "リザルトテスト",
        description: "説明"
      }),
    };

    // 処理呼び出し
    const response = await screenshotQueingProjectFunction.lambda_handler(event);
    expect(response).toEqual(
      {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, POST'
        },
        body: "{\"id\":\"Result-1\",\"name\":\"リザルトテスト\",\"description\":\"説明\",\"type\":\"SCREENSHOT\",\"resultTieUserId\":\"8c32116d-5c8c-48c0-8264-1df53434b503\",\"resultTieProjectId\":\"Project-1\"}"
      }
    );
  });

});

describe('プロジェクト登録処理 異常系テスト', () => {
});