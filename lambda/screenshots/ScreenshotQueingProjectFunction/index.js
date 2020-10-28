const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

const jwt_decode = require('jwt-decode');
const userOptionDao = require('user-option-dao');
const projectDao = require('project-dao');
const pageDao = require('page-dao');
const resultDao = require('result-dao');
const resultItemDao = require('result-item-dao');
const sqsDao = require('sqs-dao');
const resultValidator = require('result-validator');
const lambdaCommon = require('lambda-common');

const DEFAULT_RESULT_REGISTER_LIMIT = process.env.DIFFENDER_DEFAULT_RESULT_REGISTER_LIMIT;
const ASYNC_QUEING_LAMBDA_NAME = process.env.ASYNC_QUEING_LAMBDA_NAME;

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
    const userOption = await userOptionDao.getUserOption(user.sub);
    lambdaCommon.checkRegisterLimit(
      await resultDao.getResultListByUserId(user.sub, false, true), 
      userOption.resultRegisterLimit || DEFAULT_RESULT_REGISTER_LIMIT
    );

    // Resultのバリデーション
    resultValidator.resultValid(postResult);

    // リザルトの登録
    postResult.id = await resultDao.generateResultId();
    postResult.resultType = "SCREENSHOT";
    postResult.resultTieUserId = user.sub;
    postResult.resultTieProjectId = projectId;
    await resultDao.postResult(postResult);

    const result = await resultDao.getResult(postResult.id);

    // 処理に時間がかかる大量のリザルトアイテムの登録とキューイングは別の非同期Lambdaで処理を行う
    const params = {
      FunctionName: ASYNC_QUEING_LAMBDA_NAME,
      InvocationType:"Event",
      Payload: JSON.stringify({
        result: result,
        project: project,
        user: user
      })
    }
    await lambda.invoke(params).promise();

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

// 実行に時間がかかるResultItemの登録処理
// 別のLambdaとして登録して非同期でメイン処理からコールする
exports.async_queing_handler= async (event, context) => {
  const user = event.user;
  const project = event.project;
  const result = event.result;

  try {
    const pageList = await pageDao.getPageList(project.id);

    for(const page of pageList) {
      const resultItem = {
        id: await resultItemDao.generateResultItemId(),
        name: page.name,
        status: {
          type: "WAIT",
          message: "スクリーンショット取得処理 待機中..."
        },
        resultItemType: result.resultType,
        resultItemTieResultId: result.id,
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

  } catch (error) {
    console.error(error);
  }
}