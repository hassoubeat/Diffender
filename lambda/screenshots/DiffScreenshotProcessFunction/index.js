const DIFFENDER_S3_BUCKET_NAME = process.env.DIFFENDER_S3_BUCKET_NAME;

const fs = require('fs');
const resemble = require('node-resemble-js');
const lambdaCommon = require('lambda-common');
const resultItemDao = require('result-item-dao');
const s3Dao = require('s3-dao');
const _ = require('lodash');

// メイン処理
exports.lambda_handler = async (event, context) => {
  let resultItem = {};
  try {
    resultItem = lambdaCommon.getSQSRecord(event);

    // 比較対象ファイルの取得
    const originImage = await s3Dao.getObject({
      Key: _.get(resultItem, 'status.originScreenshotS3Key', "")
    });
    const targetImage = await s3Dao.getObject({
      Key: _.get(resultItem, 'status.targetScreenshotS3Key', "")
    });

    if (!originImage || !targetImage) {
      // 比較対象ファイルが取得できなかった場合はエラー
      throw new Error("There were no screenshots to compare.");
    }

    // ファイルの比較、ストリームデータへの変換
    const diffData = await compareTo(originImage, targetImage);
    const diffScreenshot = await syncStream(diffData);

    // S3にスクリーンショット保存
    const s3ObjectKey = `result/${resultItem.resultItemTieResultId}/${resultItem.id}.png`
    const s3PutParams = {
      Key: s3ObjectKey,
      Body: diffScreenshot,
      ContentType: 'image/png'
    }
    await s3Dao.putObject(s3PutParams);

    // 成功した内容でResultItemのstatusを更新
    await resultItemDao.updateResultItem({
      ...resultItem,
      status: {
        ...resultItem.status,
        type: "SUCCESS",
        message: "スクリーンショットの差分取得が完了しました",
        screenshotUrl: `https://${DIFFENDER_S3_BUCKET_NAME}.s3.amazonaws.com/${s3ObjectKey}`,
        screenshotS3Key: s3ObjectKey,
        misMatchPercentage: diffData.misMatchPercentage
      }
    });
    
  } catch (error) {
    console.error(error);

    // エラー時にはResultItemのstatusを更新
    await resultItemDao.updateResultItem({
      ...resultItem,
      status: {
        ...resultItem.status,
        type: "ERROR",
        message: "スクリーンショットの差分取得に失敗しました",
        errorDetailMessage: error.message
      }
    });

  }
  return "finish.";
};

// 差分比較
const compareTo = (file1, file2) => {
  return new Promise( (resolve, reject) => {
    resemble(file1.Body).compareTo(file2.Body).ignoreColors().onComplete(diffData => {
      resolve(diffData);
    });
  });
}
exports.compareTo = compareTo;

// 同期ストリーム処理
const syncStream = (diffData) => {
  return new Promise( (resolve, reject) => {
    const writeStream = fs.createWriteStream('/tmp/diff.png')
      // stream書き込み終了時のイベント
      .on('close', async () => {
        const fileContent = fs.readFileSync('/tmp/diff.png');
        resolve(fileContent);
      }
    )
    diffData.getDiffImage().pack().pipe(writeStream);
  });
}
exports.syncStream = syncStream;