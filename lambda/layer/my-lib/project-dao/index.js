const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBDao = require('dynamodb-dao');

const TABLE_NAME = process.env.DIFFENDER_DYNAMODB_TABLE_NAME;
// アトミックカウンターのレコードキー
const PROJECT_COUNTER_ID = 'ProjectIdCounter';

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

// プロジェクトの更新
async function updateProject(updateObj) {
  return await dynamoDBDao.update(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        id : updateObj.id
      },
      UpdateExpression: `
        Set 
        #name = :name, 
        description = :description, 
      `,
      ExpressionAttributeNames: {
        // nameが予約語と被っているため、プレースホルダーで対応
        '#name': 'name'  
      },
      ExpressionAttributeValues: {
        ":name": updateObj.name,
        ":description": updateObj.description,
      }
    }
  )
}
module.exports.updateProject = updateProject;

// プロジェクトの削除
async function deleteProject(projectId) {
  await dynamoDBDao.delete(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        'id': projectId
      }
    }
  );
  return;
}
module.exports.deleteProject = deleteProject;

// 新しいプロジェクトIDの発行
async function generateProjectId() {
  return `Project-${await dynamoDBDao.incrementeAtomicCounter(dynamoDBClient, TABLE_NAME, PROJECT_COUNTER_ID)}`;
}
module.exports.generateProjectId = generateProjectId;