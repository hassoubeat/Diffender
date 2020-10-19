// 環境変数の設定
process.env.DIFFENDER_DYNAMODB_TABLE_NAME　= "dummy";

const resultDao = require('result-dao');
const putResultFunction = require("./index");

// jestのマニュアルモック利用
jest.mock('result-dao');

describe('リザルト変更処理 正常系テスト', () => {

  test('Lambdaハンドラのテスト', async () => {

    // マニュアルモックの上書き
    resultDao.getResult = () => {
      return { 
        id:'Result-1',
        name: 'プロジェクト1',
        description: 'example.com1のテスト',
        resultTieUserId: '8c32116d-5c8c-48c0-8264-1df53434b503'
      }
    }

    // 投入データの生成
    const updateData = {
      id:'Result-1' , 
      name: 'プロジェクト1', 
      description: 'example.com1のテスト',
      resultTieUserId: '8c32116d-5c8c-48c0-8264-1df53434b503'
    };
    const event = {
      headers: {
        Authorization: "eyJraWQiOiJEQU5keFd6WXhWazZmamhKYThHVlwvM3lOZVwvUlJuXC9MaGZUOWJUenNWTmdFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4YzMyMTE2ZC01YzhjLTQ4YzAtODI2NC0xZGY1MzQzNGI1MDMiLCJhdWQiOiJvazJjZ28ydXJxdmpia2EwcTNudWg1N2JnIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiZGIzMWI4MzAtMDkyMi00YjkzLWJmZjAtMTI1NTViNGRlMGZiIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MDAxNTU3NzAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1ub3J0aGVhc3QtMV9XVFdHVjVJT2siLCJuaWNrbmFtZSI6Imhhc3NvdWJlYXQiLCJjb2duaXRvOnVzZXJuYW1lIjoiOGMzMjExNmQtNWM4Yy00OGMwLTgyNjQtMWRmNTM0MzRiNTAzIiwiZXhwIjoxNjAwMjM5Njk0LCJpYXQiOjE2MDAyMzYwOTQsImVtYWlsIjoiaGFzc291YmVhdC53b3JrQGdtYWlsLmNvbSJ9.AIt1zvRhjThea_wMReS0NyO1Zcm228FmiJGyzHyikQj0pkMiM2vRJ01WMkNOdj3_MI-FEQG1wL8qI_DEkiS_yr1g1CECcRmGe9yQjt0EdHrcApju3MJEp1S4TVEC3vkx1_FhUCJYNad34r9Hp-b388d4rZde8E_7643v1R05wTblfjHneVtjF1KnDCEq8azlUfGX5s1OWrsZCq7UJygnIxbNyALav_GGRxgLb9Pu5_bsNmDKwePDWLvDjBY6MQjV4Oa_WfQqFdJZJvYApqp9_7E9nXCLWvywvPP_jEzPLhIGCjyzlWNzbj-FDO3UvwTt_kpopWtgHEhNOGjadl-hsA"
      },
      pathParameters: {
        resultId: "Result-1"
      },
      body: JSON.stringify(updateData)
    };

    // 処理呼び出し
    const response = await putResultFunction.lambda_handler(event);
    expect(response).toEqual(
      {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, PUT'
        },
        body: "{\"id\":\"Result-1\",\"name\":\"プロジェクト1\",\"description\":\"example.com1のテスト\",\"resultTieUserId\":\"8c32116d-5c8c-48c0-8264-1df53434b503\"}"
      }
    );
  });
});