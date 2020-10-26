// データ取得
module.exports.get = async (dynamoDB, getObj) => {
  return await dynamoDB.get(getObj).promise();
}

// データ検索
module.exports.query = async (dynamoDB, queryObj) => {
  if (queryObj.FilterExpression) {
    queryObj.FilterExpression += " AND (attribute_not_exists(ttlDtUnix) OR ttlDtUnix > :nowUnixTime)";
  } else {
    queryObj.FilterExpression = "(attribute_not_exists(ttlDtUnix) OR ttlDtUnix > :nowUnixTime)"
  }
  queryObj.ExpressionAttributeValues[":nowUnixTime"] = lib.getNowUnixTime();

  return await dynamoDB.query(queryObj).promise();
}

// データ登録
module.exports.put = async (dynamoDB, putObj) => {
  const date = lib.getNowTime();
  // 現在時刻を登録する
  putObj.Item.createDt = date.toLocaleString({timeZone: 'Asia/Tokyo'});
  putObj.Item.updateDt = date.toLocaleString({timeZone: 'Asia/Tokyo'});
  putObj.Item.createDtUnix = date.getTime();
  putObj.Item.updateDtUnix = date.getTime();
  return await dynamoDB.put(putObj).promise();
}

// データ更新
module.exports.update = async (dynamoDB, updateObj) => {
  const date = lib.getNowTime();
  // 現在時刻で更新する
  updateObj.UpdateExpression += "updateDt=:updateDt, updateDtUnix=:updateDtUnix";
  updateObj.ExpressionAttributeValues[":updateDt"] = date.toLocaleString({timeZone: 'Asia/Tokyo'});
  updateObj.ExpressionAttributeValues[":updateDtUnix"] = date.getTime();

  return await dynamoDB.update(updateObj).promise();
}

// データ削除
module.exports.delete = async (dynamoDB, deleteObj) => {
  return await dynamoDB.delete(deleteObj).promise();
}

// アトミックカウンター更新処理
module.exports.incrementeAtomicCounter = async (dynamoDB, tableName, id) => {
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

// 現在のTTL時刻を取得する
function getNowUnixTime () {
  const date = getNowTime();
  return Math.floor( date.getTime() / 1000 );
}
module.exports.getNowUnixTime = getNowUnixTime;

// TTL時刻セットを取得する
function getTTLDateSet () {
  const date = getNowTime();
  // 5日後をTTLに設定する
  date.setDate(date.getDate() + 5);
  
  return {
    // Unix時刻をデフォルトのミリ秒から秒に変換する
    // ※ DynamoDBのTTLのUnix時刻は秒しか扱えないため
    ttlDtUnix: Math.floor( date.getTime() / 1000 ),
    ttlDt: date.toLocaleString({timeZone: 'Asia/Tokyo'})
  }
}
module.exports.getTTLDateSet = getTTLDateSet;

// ユニットテストでモックする必要のあるモジュール内関数をラッピングしている
// 詳細はこちら https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4
const lib = {
  getNowTime,
  getNowUnixTime,
  getTTLDateSet
};
module.exports.lib = lib;