const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBDao = require('dynamodb-dao');

const TABLE_NAME = process.env.DIFFENDER_DYNAMODB_TABLE_NAME;

exports.lambda_handler = async (event, context) => {
  // レスポンス変数の定義
  let response = {
    'statusCode': 200,
    'headers': {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST"
    }
  }

  let user = {};
  let userOption = {};
  
  // 入力値チェック
  try {
    user = jwt_decode(event.headers.Authorization);
    userOption.id = user.sub;
  } catch (error) {
    console.error(error);

    response.statusCode = 400;
    response.body = JSON.stringify({
      message: `Input value error: ${error.message}`
    });
    return response;
  }
  
  // 登録処理
  try {
    // 登録するオブジェクトの生成
    const postObj = {
      id: userOption.id,
      projectsSortMapping: {}
    }
    // userOptionの登録
    await postUserOption(dynamoDBClient, dynamoDBDao, TABLE_NAME, postObj);
  } catch (error) {
    console.error(error);

    response.statusCode = 500;
    response.body = JSON.stringify({
      message: `Server error: ${error.message}`
    });
  }
  return response;
}

// ユーザオプションの登録
async function postUserOption(dynamoDBClient, dynamoDBDao, tableName, postObj) {
  return await dynamoDBDao.put(
    dynamoDBClient,
    {
      TableName: tableName,
      Item: postObj
    }
  )
}
exports.postUserOption = postUserOption;