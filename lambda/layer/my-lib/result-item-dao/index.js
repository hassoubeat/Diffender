const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBDao = require('dynamodb-dao');

const TABLE_NAME = process.env.DIFFENDER_DYNAMODB_TABLE_NAME;
// アトミックカウンターのレコードキー
const RESULT_COUNTER_ID = 'ResultItemIdCounter';

// リザルトに紐づくリザルトアイテム一覧の取得
async function getResultItemListByResultId(resultId, isSortASC = true) {
  const result =  await dynamoDBDao.query(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      IndexName: "ResultItemsByResultIdSearchIndex",
      KeyConditionExpression: "resultItemTieResultId=:resultItemTieResultId",
      ExpressionAttributeValues: {
        ":resultItemTieResultId": resultId
      },
      ScanIndexForward: isSortASC
    }
  );
  return result.Items;
}
module.exports.getResultItemListByResultId = getResultItemListByResultId;

// リザルトアイテムの取得
async function getResultItem(resultItemId) {
  let resultItem = {};
  resultItem = await dynamoDBDao.get(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        'id': resultItemId
      }
    }
  );

  // リザルトが存在しない場合は404エラーをthrow
  if(resultItem.Item !== undefined) {
    return resultItem.Item;
  } else {
    const error = new Error("NotFound resultItem.");
    error.statusCode = 404;
    throw error;
  }
}
module.exports.getResultItem = getResultItem;

// リザルトアイテムの登録
async function postResultItem(postObject) {

  // TTL時刻を取得する
  const {ttlDtUnix, ttlDt} = dynamoDBDao.getTTLDateSet();

  return await dynamoDBDao.put(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Item: {
        id: postObject.id,
        name: postObject.name,
        status: postObject.status,
        resultItemType: postObject.resultItemType,
        resultItemTieResultId: postObject.resultItemTieResultId,
        resultItemTieUserId: postObject.resultItemTieUserId,
        resultItemTiePageId: postObject.resultItemTiePageId,
        ttlDtUnix: ttlDtUnix,
        ttlDt: ttlDt,
      }
    }
  )
}
module.exports.postResultItem = postResultItem;

// リザルトアイテムの更新
async function updateResultItem(updateObject) {
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
        #status = :status, 
      `,
      ExpressionAttributeNames: {
        // 予約語と被っているため、プレースホルダーで対応
        '#name': 'name',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ":name": updateObject.name, 
        ":status": updateObject.status
      }
    }
  )
}
module.exports.updateResultItem = updateResultItem;

// リザルトアイテムの削除
async function deleteResultItem(resultItemId) {
  await dynamoDBDao.delete(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        'id': resultItemId
      }
    }
  );
  return;
}
module.exports.deleteResultItem = deleteResultItem;

// 新しいリザルトアイテムIDの発行
async function generateResultItemId() {
  return `ResultItem-${await dynamoDBDao.incrementeAtomicCounter(dynamoDBClient, TABLE_NAME, RESULT_COUNTER_ID)}`;
}
module.exports.generateResultItemId = generateResultItemId;