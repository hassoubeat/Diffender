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

  try {
    const user = jwt_decode(event.headers.Authorization);
    const putUserOption = getPutObject(event);
    checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: putUserOption.id
    });    

    // ユーザオプションの更新
    await updateUserOption(dynamoDBClient, dynamoDBDao, TABLE_NAME, putUserOption);
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

// 更新オブジェクトの取得
function getPutObject(event) {
  try {
    return JSON.parse(event.body);
  } catch (error)  {
    error.statusCode = 400;
    error.message = "Put object error.";
    throw error;
  }
}

// リソースオーナーをチェックする
function checkResouceOwner({loginUserId, resouceUserId}) {
  if (loginUserId !== resouceUserId) {
    const error = new Error("Unauthorized resource.");
    error.statusCode = 401;
    throw error;
  }
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