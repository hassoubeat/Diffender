const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBDao = require('dynamodb-dao');

const TABLE_NAME = process.env.DIFFENDER_DYNAMODB_TABLE_NAME;

// プロジェクト一覧の取得
async function getProjectList(userId, isSortASC = true) {
  const result =  await dynamoDBDao.query(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      IndexName: "ProjectsByUserIdSearchIndex",
      KeyConditionExpression: "projectTieUserId=:projectTieUserId",
      ExpressionAttributeValues: {
        ":projectTieUserId": userId
      },
      ScanIndexForward: isSortASC
    }
  );
  return result.Items;
}
module.exports.getProjectList = getProjectList;

// プロジェクトの取得
async function getProject(projectId) {
  let result = {};
  result = await dynamoDBDao.get(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        'id': projectId
      }
    }
  );

  // プロジェクトが存在しない場合は404エラーをthrow
  if(result.Item !== undefined) {
    return result.Item;
  } else {
    const error = new Error("NotFound project.");
    error.statusCode = 404;
    throw error;
  }
}
module.exports.getProject = getProject;

// プロジェクトの登録
async function postProject(postObject) {
  return await dynamoDBDao.put(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Item: postObject
    }
  )
}
module.exports.postProject = postProject;

// 新しいプロジェクトIDの発行
async function generateProjectId() {
  return `Project-${await dynamoDBDao.getProjectId(dynamoDBClient, TABLE_NAME)}`;
}
module.exports.generateProjectId = generateProjectId;