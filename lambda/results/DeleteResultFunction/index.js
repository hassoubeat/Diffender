const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

const _ = require('lodash');
const jwt_decode = require('jwt-decode');
const resultDao = require('result-dao');
const resultItemDao = require('result-item-dao');
const s3Dao = require('s3-dao');
const lambdaCommon = require('lambda-common');

const ASYNC_QUEING_LAMBDA_NAME = process.env.ASYNC_QUEING_LAMBDA_NAME;

exports.lambda_handler = async (event, context) => {
  // レスポンス変数の定義
  let response = {
    'statusCode': 200,
    'headers': {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, DELETE"
    }
  }
  
  try {
    const user = jwt_decode(event.headers.Authorization);
    const resultId = lambdaCommon.getPathParameter(event, "resultId");
    
    const result = await resultDao.getResult(resultId);

    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: result.resultTieUserId
    })

    // 紐付いているデータの削除
    // 紐付いているリザルトアイテムが多いと完了まで時間がかかるため、非同期で別のLambdaを利用して処理を実行
    const params = {
      FunctionName: ASYNC_QUEING_LAMBDA_NAME,
      InvocationType:"Event",
      Payload: JSON.stringify({
        result: result
      })
    }
    await lambda.invoke(params).promise();

    await resultDao.deleteResult(resultId);

    response.body = JSON.stringify(result);
  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  }
  return response;
}

// 実行に時間がかかる関連データの削除処理(紐付いているResultItem, スクリーンショット)
// 別のLambdaとして登録して非同期でメイン処理からコールする
exports.async_delete_handler= async (event, context) => {
  const result = event.result;

  try {
    const resultItemList = await resultItemDao.getResultItemListByResultId(result.id);

    for(const resultItem of resultItemList) {

      // TODO S3のスクリーンショットを削除するとDIffの比較元、比較先としてもアクセスが不可能になるため削除はしない
      //      S3のTTLで削除させる方針で暫定対応とするが、別途要検討
      //
      // const s3ObjectKey = _.get(resultItem, "status.screenshotS3Key");
      // if (s3ObjectKey) {
      //   // S3のオブジェクトを削除
      //   await s3Dao.deleteObject({
      //     Key: s3ObjectKey
      //   });
      // }

      // リザルトアイテムの削除
      await resultItemDao.deleteResultItem(resultItem.id);
    }

  } catch (error) {
    console.error(error);
  }
}