const jwt_decode = require('jwt-decode');
const resultDao = require('result-dao');
const resultItemDao = require('result-item-dao');
const sqsDao = require('sqs-dao');
const resultValidator = require('result-validator');
const lambdaCommon = require('lambda-common');
const _ = require('lodash');

const RESULT_REGISTER_LIMITS = process.env.DIFFENDER_RESULT_REGISTER_LIMITS;

exports.lambda_handler = async (event, context) => {
  // レスポンス変数の定義
  let response = {
    'statusCode': 200,
    'headers': {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST"
    }
  }

  try {
    const user = jwt_decode(event.headers.Authorization);
    const postResult = lambdaCommon.getRequetBody(event);

    // Resultのバリデーション
    resultValidator.resultValid(postResult);

    const originResult = await resultDao.getResult(postResult.originResultId);
    const targetResult = await resultDao.getResult(postResult.targetResultId);

    // 発行元が同じプロジェクトであるかチェック
    if (originResult.resultTieProjectId !== targetResult.resultTieProjectId) {
      const error = new Error('Results are not from the same project.');
      error.statusCode = 400;
      throw error;
    }
    
    // オーナーチェック
    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: originResult.resultTieUserId
    });
    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: targetResult.resultTieUserId
    });

    // 登録上限チェック
    lambdaCommon.checkRegisterLimit(
      await resultDao.getResultListByUserId(user.sub, false, true), 
      RESULT_REGISTER_LIMITS
    );

    // リザルトの登録
    postResult.id = await resultDao.generateResultId();
    postResult.resultType = "DIFF";
    postResult.resultTieUserId = user.sub;
    postResult.resultTieProjectId = originResult.resultTieProjectId;
    await resultDao.postResult(postResult);
    
    // リザルトアイテムの登録
    const originResultItemList = await resultItemDao.getResultItemListByResultId(originResult.id);
    const targetResultItemList = await resultItemDao.getResultItemListByResultId(targetResult.id);
    for(const originResultItem of originResultItemList) {
      // 比較対象配列の中に同じPageIdを持つデータ(比較対象)が存在するかをチェック
      const targetResultItem = targetResultItemList.find(
        (targetResultItem) => {
          return originResultItem.resultItemTiePageId === targetResultItem.resultItemTiePageId
        }
      );
      
      if (!targetResultItem) {
        // 比較対象が存在しない場合、対象不在エラーでDBに登録してcontinue
        await resultItemDao.postResultItem({
          id: await resultItemDao.generateResultItemId(),
          name: originResultItem.name,
          status: {
            type: "ERROR",
            message: "比較対象のリザルトアイテムが存在しませんでした",
            errorDetailMessage: "There is no comparison target to take the difference."
          },
          resultItemTieResultId: postResult.id,
          resultItemTiePageId: originResultItem.resultItemTiePageId,
          resultItemTieUserId: user.sub
        });
        continue;
      }

      const resultItem = {
        id: await resultItemDao.generateResultItemId(),
        name: originResultItem.name,
        status: {
          type: "WAIT",
          message: "DIffの取得処理 待機中...",
          originScreenshotUrl: _.get(originResultItem, 'status.screenshotUrl', ""),
          originScreenshotS3Key: _.get(originResultItem, 'status.screenshotS3Key', ""),
          targetScreenshotUrl: _.get(targetResultItem, 'status.screenshotUrl', ""),
          targetScreenshotS3Key: _.get(targetResultItem, 'status.screenshotS3Key', ""),
          originResultItemId: originResultItem.id,
          targetResultItemId: targetResultItem.id
        },
        resultItemType: postResult.resultType,
        resultItemTieResultId: postResult.id,
        resultItemTiePageId: originResultItem.resultItemTiePageId,
        resultItemTieUserId: user.sub
      }

      // ResultItemの登録
      await resultItemDao.postResultItem(resultItem);

      // SQSにスクリーンショット取得処理をキューイング
      await sqsDao.sendDiffScreenshotProcessSQS(resultItem);
    }

    response.body = JSON.stringify(
      await resultDao.getResult(postResult.id)
    );
  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  }
  return response;
}