const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBDao = require('dynamodb-dao');

const TABLE_NAME = process.env.DIFFENDER_DYNAMODB_TABLE_NAME;

// レスポンス変数の定義
var response = {
  'statusCode': 200,
  'headers': {
    "Access-Control-Allow-Headers" : "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET"
  }
}

exports.lambda_handler = async (event, context) => {

  // TODO eventからパラメータの展開
  // TODO ユーザ検証(受け取ったパラメータをCognitoに問い合わせ)

  try {
    // Projectの一覧取得
    await getProjectList(dynamoDBClient, TABLE_NAME, "blank");

  } catch (error) {
    console.error(error);

    response.statusCode = 500;
    response.body = JSON.stringify({
      message: error.message
    });

  } finally {
    return response;
  }
}

// プロジェクト一覧の取得
async function getProjectList(dynamoDBClient, tableName, userId) {
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
exports.getProjectList = getProjectList;