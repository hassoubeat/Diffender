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
  const payload = JSON.parse(event.body);
  
  try {
    // 登録するオブジェクトの生成
    const putObj = {
      id: await getProjectId(dynamoDBClient, dynamoDBDao, TABLE_NAME),
      ...payload.project
    }
    // Projectの登録
    const result = await postProject(dynamoDBClient, dynamoDBDao, TABLE_NAME, putObj);
    console.log(result);
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

// プロジェクトIDの取得
async function getProjectId(dynamoDBClient, dynamoDBDao, tableName) {
  return `Project-${await dynamoDBDao.getProjectId(dynamoDBClient, tableName)}`;
}
exports.getProjectId = getProjectId;

// プロジェクトの登録
async function postProject(dynamoDBClient, dynamoDBDao, tableName, putObj) {
  return await dynamoDBDao.put(
    dynamoDBClient,
    {
      TableName: tableName,
      Item: putObj
    }
  )
}
exports.postProject = postProject;