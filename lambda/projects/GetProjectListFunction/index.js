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

  let user = {};

  // 入力値チェック
  try {
    // idTokenからユーザ情報取得
    user = jwt_decode(event.headers.Authorization);
  } catch (error) {
    console.error(error);

    response.statusCode = 400;
    response.body = JSON.stringify({
      message: `Input value error: ${error.message}`
    });
    return response;
  }

  // 取得処理
  try {
    // ユーザに紐付いたProject一覧の取得
    const projectList = await getProjectList(dynamoDBClient, dynamoDBDao, TABLE_NAME, user.sub);
    response.body = JSON.stringify({
      body: projectList
    });
  } catch (error) {
    console.error(error);

    response.statusCode = 500;
    response.body = JSON.stringify({
      message: `Server error: ${error.message}`
    });
  }
  return response;
}

// プロジェクト一覧の取得
async function getProjectList(dynamoDBClient, dynamoDBDao, tableName, userId) {
  return await dynamoDBDao.query(
    dynamoDBClient,
    {
      TableName: tableName,
      IndexName: "ProjectsByUserIdSearchIndex",
      KeyConditionExpression: "projectTieUserId=:projectTieUserId",
      ExpressionAttributeValues: {
        ":projectTieUserId": userId
      }
    }
  );
}