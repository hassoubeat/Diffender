const DIFFENDER_S3_BUCKET_NAME = process.env.DIFFENDER_S3_BUCKET_NAME;

const puppeteerWrapper = require("puppeteer-wrapper");
const lambdaCommon = require('lambda-common');
const resultItemDao = require('result-item-dao');
const s3Dao = require('s3-dao');

// メイン処理
exports.lambda_handler = async (event, context) => {
  let project = {};
  let page = {};
  let resultItem = {};
  try {
    const queueData = lambdaCommon.getSQSRecord(event);
    project = queueData.project;
    page = queueData.page;
    resultItem = queueData.resultItem;
    const resultId = resultItem.resultItemTieResultId;
    const resultItemId = resultItem.id;

    const puppeteerPage = await puppeteerWrapper.initPuppeteer(page);

    // 共通アクション(前)
    if (page.isEnableBeforeCommonAction) {
      for( const beforeAction of project.beforeCommonActions ) {
        await puppeteerWrapper.browserAction(puppeteerPage, beforeAction);
      }
    }

    // アクション
    for( const action of page.actions ) {
      await puppeteerWrapper.browserAction(puppeteerPage, action);
    }

    // 共通アクション(後)
    if (page.isEnableAfterCommonAction) {
      for( const afterAction of project.afterCommonActions ) {
        await puppeteerWrapper.browserAction(puppeteerPage, afterAction);
      }
    }

    // スクリーンショット取得
    const screenshot = await puppeteerWrapper.screenshots(puppeteerPage, page.screenshotOptions);

    const s3ObjectKey = `result/${resultId}/${resultItemId}.png`

    // S3にスクリーンショット保存
    const s3PutParams = {
      Key: s3ObjectKey,
      Body: screenshot,
      ContentType: 'image/png'
    }
    await s3Dao.putObject(s3PutParams);

    // 成功した内容でResultItemのstatusを更新
    await resultItemDao.updateResultItem({
      ...resultItem,
      status: {
        type: "SUCCESS",
        message: "Screenshots have been completed.",
        screenshotUrl: `https://${DIFFENDER_S3_BUCKET_NAME}.s3.amazonaws.com/${s3ObjectKey}`,
        screenshotS3Key: s3ObjectKey
      }
    });
    
  } catch (error) {
    console.error(error);

    // エラー時にはResultItemのstatusを更新
    await resultItemDao.updateResultItem({
      ...resultItem,
      status: {
        type: "ERROR",
        message: "Screenshots shooting failed.",
        errorDetailMessage: error.message
      }
    });

  } finally {
    await puppeteerWrapper.closePuppeteer();
  }
  return "finish.";
};