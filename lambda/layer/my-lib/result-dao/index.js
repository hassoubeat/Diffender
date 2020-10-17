const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBDao = require('dynamodb-dao');

const TABLE_NAME = process.env.DIFFENDER_DYNAMODB_TABLE_NAME;
// アトミックカウンターのレコードキー
const RESULT_COUNTER_ID = 'ResultIdCounter';

// ユーザIDに紐づくリザルト一覧の取得
async function getResultListByUserId(userId, isSortASC = true) {
  const result =  await dynamoDBDao.query(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      IndexName: "ResultsByUserIdSearchIndex",
      KeyConditionExpression: "resultTieUserId=:resultTieUserId",
      ExpressionAttributeValues: {
        ":resultTieUserId": userId
      },
      ScanIndexForward: isSortASC
    }
  );
  return result.Items;
}
module.exports.getResultListByUserId = getResultListByUserId;

// プロジェクトに紐づくリザルト一覧の取得
async function getResultListByProjectId(userId, projectId, isSortASC = true) {
  const result =  await dynamoDBDao.query(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      IndexName: "ResultsByProjectIdSearchIndex",
      KeyConditionExpression: "resultTieProjectId=:resultTieProjectId",
      FilterExpression: "resultTieUserId=:resultTieUserId",
      ExpressionAttributeValues: {
        ":resultTieUserId": userId,
        ":resultTieProjectId": projectId
      },
      ScanIndexForward: isSortASC
    }
  );
  return result.Items;
}
module.exports.getResultListByProjectId = getResultListByProjectId;

// リザルトの取得
async function getResult(resultId) {
  let result = {};
  result = await dynamoDBDao.get(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        'id': resultId
      }
    }
  );

  // リザルトが存在しない場合は404エラーをthrow
  if(result.Item !== undefined) {
    return result.Item;
  } else {
    const error = new Error("NotFound result.");
    error.statusCode = 404;
    throw error;
  }
}
module.exports.getResult = getResult;

// リザルトの登録
async function postResult(postObject) {
  return await dynamoDBDao.put(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Item: {
        id: postObject.id,
        name: postObject.name,
        description: postObject.description,
        resultType: postObject.resultType,
        resultTieProjectId: postObject.resultTieProjectId,
        resultTieUserId: postObject.resultTieUserId,
      }
    }
  )
}
module.exports.postResult = postResult;

// リザルトの更新
async function updateResult(updateObject) {
  return await dynamoDBDao.update(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        id : updateObject.id
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
        ":name": updateObject.name, 
        ":description": updateObject.description
      }
    }
  )
}
module.exports.updateResult = updateResult;

// リザルトの削除
async function deleteResult(resultId) {
  await dynamoDBDao.delete(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        'id': resultId
      }
    }
  );
  return;
}
module.exports.deleteResult = deleteResult;

// 新しいリザルトIDの発行
async function generateResultId() {
  return `Result-${await dynamoDBDao.incrementeAtomicCounter(dynamoDBClient, TABLE_NAME, RESULT_COUNTER_ID)}`;
}
module.exports.generateResultId = generateResultId;