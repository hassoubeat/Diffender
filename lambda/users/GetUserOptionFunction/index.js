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
    const user = getUser(event);
    const userOption = await getUserOption(dynamoDBClient, dynamoDBDao, TABLE_NAME, user.sub);
    emptyCheckUserOption(userOption);

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

// idTokenからユーザ情報取得
function getUser(event){
  try {
    return jwt_decode(event.headers.Authorization);
  } catch(error) {
    error.statusCode = 400;
    error.message = "Incorrect user info.";
    throw error;
  }
}

// ユーザオプションの取得
async function getUserOption(dynamoDBClient, dynamoDBDao, tableName, userId) {
  try {
     const result = await dynamoDBDao.get(
      dynamoDBClient,
      {
        TableName: tableName,
        Key: {
          'id': userId
        }
      }
    );
    return result.Item;
  } catch (error) {
    error.statusCode = 500;
    error.message = "Faild get userOption.";
    throw error;
  }
}

// ユーザオプションの空チェック
function emptyCheckUserOption(userOption) {
  
  if(userOption === undefined) {
    const error = new Error("NotFound userOption.");
    error.statusCode = 404;
    throw error;
  }
}