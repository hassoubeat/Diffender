const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBDao = require('dynamodb-dao');
const projectValidator = require('project-validator');

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

  let project = {};
  
  // 入力値チェック
  try {
    const payload = JSON.parse(event.body);
    project = payload.project;
    projectValidator.projectValid(project);
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
    const putObj = {
      id: await getProjectId(dynamoDBClient, dynamoDBDao, TABLE_NAME),
      name: project.name,
      description: project.description,
      projectTieUserId: project.projectTieUserId,
    }
    // Projectの登録
    await postProject(dynamoDBClient, dynamoDBDao, TABLE_NAME, putObj);
  } catch (error) {
    console.error(error);

    response.statusCode = 500;
    response.body = JSON.stringify({
      message: `Server error: ${error.message}`
    });
  }
  return response;
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