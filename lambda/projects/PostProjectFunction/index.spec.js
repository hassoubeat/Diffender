const fs = require("fs");

// 環境変数の設定
process.env.DIFFENDER_DYNAMODB_TABLE_NAME　= "dummy";

const postProjectFunction = require("./index");

// jestのマニュアルモック利用
jest.mock('dynamodb-dao');

describe('プロジェクト登録処理 正常系テスト', () => {

  test('Lambdaハンドラのテスト', async () => {

    // 投入データの生成
    const postData = JSON.parse(fs.readFileSync(`${__dirname}/postData.json`, 'utf8'));
    const event = {
      body: JSON.stringify(postData)
    };

    // 処理呼び出し
    const response = await postProjectFunction.lambda_handler(event);
    expect(response).toEqual(
      {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET'
        }
      }
    );
  });

});

describe('プロジェクト登録処理 異常系テスト', () => {

  test('Lambdaハンドラのテスト bodyなし', async () => {

    // 投入データの生成
    const event = {
      body: ""
    };

    // 処理呼び出し
    const response = await postProjectFunction.lambda_handler(event);
    expect(response).toEqual(
      {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET'
        },
        body: '{"message":"Input value error: Unexpected end of JSON input"}'
      }
    );
  });

  test('Lambdaハンドラのテスト バリデーションエラー プロジェクト名の最大文字長(31文字)', async () => {

    // 投入データの生成
    const postData = JSON.parse(fs.readFileSync(`${__dirname}/postData.json`, 'utf8'));
    postData.project.name = "1234512345123451234512345123451";
    const event = {
      body: JSON.stringify(postData)
    };

    // 処理呼び出し
    const response = await postProjectFunction.lambda_handler(event);
    expect(response).toEqual(
      {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET'
        },
        body: '{"message":"Input value error: プロジェクト名は最大30文字です"}'
      }
    );
  });

  test('Lambdaハンドラのテスト バリデーションエラー プロジェクト説明の最大文字長(51文字)', async () => {

    // 投入データの生成
    const postData = JSON.parse(fs.readFileSync(`${__dirname}/postData.json`, 'utf8'));
    postData.project.description = "123451234512345123451234512345123451234512345123451";
    const event = {
      body: JSON.stringify(postData)
    };

    // 処理呼び出し
    const response = await postProjectFunction.lambda_handler(event);
    expect(response).toEqual(
      {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET'
        },
        body: '{"message":"Input value error: プロジェクト説明は最大50文字です"}'
      }
    );
  });

  test('Lambdaハンドラのテスト バリデーションエラー ユーザID空文字', async () => {

    // 投入データの生成
    const postData = JSON.parse(fs.readFileSync(`${__dirname}/postData.json`, 'utf8'));
    postData.project.projectTieUserId = "";
    const event = {
      body: JSON.stringify(postData)
    };

    // 処理呼び出し
    const response = await postProjectFunction.lambda_handler(event);
    expect(response).toEqual(
      {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET'
        },
        body: '{"message":"Input value error: プロジェクトに紐づくユーザIDは必須です"}'
      }
    );
  });

});