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
      "Access-Control-Allow-Methods": "OPTIONS, PUT"
    }
  }

  let user = {};
  let userOption = {};
  
  // 入力値チェック
  try {
    user = jwt_decode(event.headers.Authorization);

    const payload = JSON.parse(event.body);
    userOption = payload.userOption;
  } catch (error) {
    console.error(error);

    response.statusCode = 400;
    response.body = JSON.stringify({
      message: `Input value error: ${error.message}`
    });
    return response;
  }

  // リソースオーナーチェック
  if (userOption.id !== user.sub) {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: `Unauthorized resource`
    });
    return response;
  }
  
  // 更新処理
  try {
    // ユーザオプションの更新
    await updateUserOption(dynamoDBClient, dynamoDBDao, TABLE_NAME, userOption);
  } catch (error) {
    console.error(error);

    response.statusCode = 500;
    response.body = JSON.stringify({
      message: `Server error: ${error.message}`
    });
  }
  return response;
}

// ユーザオプションの更新
async function updateUserOption(dynamoDBClient, dynamoDBDao, tableName, updateObj) {
  return await dynamoDBDao.update(
    dynamoDBClient,
    {
      TableName: tableName,
      Key: {
        id : updateObj.id
      },
      UpdateExpression: `
        Set 
        projectsSortMap=:projectsSortMap,
      `,
      ExpressionAttributeValues: {
        ":projectsSortMap": updateObj.projectsSortMap,
      }
    }
  )
}