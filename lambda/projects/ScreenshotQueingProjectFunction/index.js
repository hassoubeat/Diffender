const jwt_decode = require('jwt-decode');
const projectDao = require('project-dao');
const pageDao = require('page-dao');
const resultDao = require('result-dao');
const resultItemDao = require('result-item-dao');
const sqsDao = require('sqs-dao');
const resultValidator = require('result-validator');
const lambdaCommon = require('lambda-common');

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
    const projectId = lambdaCommon.getPathParameter(event, "projectId");
    const postResult = lambdaCommon.getRequetBody(event);

    // オーナーチェック
    const project = await projectDao.getProject(projectId);
    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: project.projectTieUserId
    });

    // 登録上限チェック
    lambdaCommon.checkRegisterLimit(
      await resultDao.getResultListByUserId(user.sub, false, true), 
      RESULT_REGISTER_LIMITS
    );

    // Resultのバリデーション
    resultValidator.resultValid(postResult);

    // リザルトの登録
    postResult.id = await resultDao.generateResultId();
    postResult.resultType = "SCREENSHOT";
    postResult.resultTieUserId = user.sub;
    postResult.resultTieProjectId = projectId;
    await resultDao.postResult(postResult);
    
    // リザルトアイテムの登録
    const pageList = await pageDao.getPageList(projectId);
    for(const page of pageList) {
      const resultItem = {
        id: await resultItemDao.generateResultItemId(),
        name: page.name,
        status: {
          type: "WAIT",
          message: "スクリーンショット取得処理 待機中..."
        },
        resultItemType: postResult.resultType,
        resultItemTieResultId: postResult.id,
        resultItemTiePageId: page.id,
        resultItemTieUserId: user.sub
      }

      // ResultItemの登録
      await resultItemDao.postResultItem(resultItem);

      // SQSにスクリーンショット取得処理をキューイング
      await sqsDao.sendScreenshotProcessSQS({
        project: project,
        page: page,
        resultItem: resultItem
      });
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