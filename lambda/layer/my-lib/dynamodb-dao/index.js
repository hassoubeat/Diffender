// アトミックカウンターのレコードキー
const PROJECT_COUNTER_ID = 'ProjectIdCounter';

// データ検索
module.exports.query = async (dynamoDB, queryObj) => {
  return await dynamoDB.query(queryObj).promise();
}
  
// Project用の現在のアトミックカウンターからインクリメントした値を取得
module.exports.getProjectId = async (dynamoDB, tableName) => {
  return await incrementeAtomicCounter(dynamoDB, tableName, PROJECT_COUNTER_ID);
}

// アトミックカウンター更新処理
async function incrementeAtomicCounter(dynamoDB, tableName, id) {
  const result = await dynamoDB.update({
    TableName: tableName,
    Key: {
       id: id
    },
    UpdateExpression: 'ADD idCounter :Increment',
    ExpressionAttributeValues: {
       ':Increment': 1
    },
    ReturnValues: 'UPDATED_NEW'
 }).promise();
  return result.Attributes.idCounter;
}

// 現在時刻の取得
function getNowTime() {
  return date = new Date();
}

// ユニットテストでモックする必要のあるモジュール内関数をラッピングしている
// 詳細はこちら https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4
const lib = {
  getNowTime
};
module.exports.lib = lib;