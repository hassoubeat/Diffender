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
      "Access-Control-Allow-Methods": "OPTIONS, GET"
    }
  }
  
  try {
    const user = jwt_decode(event.headers.Authorization);
    const userOption = await getUserOption(dynamoDBClient, dynamoDBDao, TABLE_NAME, user.sub);

    response.body = JSON.stringify({
      ...userOption
    });
  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  }
  return response;
}

// ユーザオプションの取得
async function getUserOption(dynamoDBClient, dynamoDBDao, tableName, userId) {
  let result = {};
  try {
     result = await dynamoDBDao.get(
      dynamoDBClient,
      {
        TableName: tableName,
        Key: {
          'id': userId
        }
      }
    );
  } catch (error) {
    error.statusCode = 500;
    error.message = "Faild get userOption.";
    throw error;
  }
  
  // プロジェクトが存在しない場合は404エラーをthrow
  if(result.Item !== undefined) {
    return result.Item;
  } else {
    const error = new Error("NotFound userOption.");
    error.statusCode = 404;
    throw error;
  }
}