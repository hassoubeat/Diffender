const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBDao = require('dynamodb-dao');

const TABLE_NAME = process.env.DIFFENDER_DYNAMODB_TABLE_NAME;

// ユーザオプションの取得
async function getUserOption(userId) {
  let result = {};
  result = await dynamoDBDao.get(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        'id': userId
      }
    }
  );
  
  // プロジェクトが存在しない場合は404エラーをthrow
  if(result.Item !== undefined) {
    return result.Item;
  } else {
    const error = new Error("NotFound userOption.");
    error.statusCode = 404;
    throw error;
  }
}
module.exports.getUserOption = getUserOption;

// ユーザオプションの登録
async function postUserOption(postObj) {
  return await dynamoDBDao.put(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Item: postObj
    }
  )
}
module.exports.postUserOption = postUserOption;

// ユーザオプションの更新
async function updateUserOption(updateObj) {
  return await dynamoDBDao.update(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
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
module.exports.updateUserOption = updateUserOption;