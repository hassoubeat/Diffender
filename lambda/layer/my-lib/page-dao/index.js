const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBDao = require('dynamodb-dao');

const TABLE_NAME = process.env.DIFFENDER_DYNAMODB_TABLE_NAME;
// アトミックカウンターのレコードキー
const PAGE_COUNTER_ID = 'PageIdCounter';

// ページ一覧の取得
async function getPageList(projectId, isSortASC = true) {
  const result =  await dynamoDBDao.query(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      IndexName: "PagesByProjectIdSearchIndex",
      KeyConditionExpression: "parentProjectId=:parentProjectId",
      ExpressionAttributeValues: {
        ":parentProjectId": projectId
      },
      ScanIndexForward: isSortASC
    }
  );
  return result.Items;
}
module.exports.getPageList = getPageList;

// ページの取得
async function getPage(pageId) {
  let result = {};
  result = await dynamoDBDao.get(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        'id': pageId
      }
    }
  );

  // ページが存在しない場合は404エラーをthrow
  if(result.Item !== undefined) {
    return result.Item;
  } else {
    const error = new Error("NotFound page.");
    error.statusCode = 404;
    throw error;
  }
}
module.exports.getPage = getPage;

// ページの登録
async function postPage(postObject) {
  return await dynamoDBDao.put(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Item: {
        id: postObject.id,
        name: postObject.name,
        description: postObject.description,
        browserSettings: postObject.browserSettings,
        screenshotOptions: postObject.screenshotOptions,
        actions: postObject.actions,
        pageTieUserId: postObject.pageTieUserId,
        pageTieProjectId: postObject.pageTieProjectId,
      }
    }
  )
}
module.exports.postPage = postPage;

// ページの更新
async function updatePage(updateObj) {
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
module.exports.updatePage = updatePage;

// ページの削除
async function deletePage(pageId) {
  await dynamoDBDao.delete(
    dynamoDBClient,
    {
      TableName: TABLE_NAME,
      Key: {
        'id': pageId
      }
    }
  );
  return;
}
module.exports.deletePage = deletePage;

// 新しいページIDの発行
async function generatePageId() {
  return `Page-${await dynamoDBDao.incrementeAtomicCounter(dynamoDBClient, TABLE_NAME, PAGE_COUNTER_ID)}`;
}
module.exports.generatePageId = generatePageId;