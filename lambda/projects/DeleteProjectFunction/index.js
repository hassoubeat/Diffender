const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

const jwt_decode = require('jwt-decode');
const projectDao = require('project-dao');
const pageDao = require('page-dao');
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
    const projectId = lambdaCommon.getPathParameter(event, "projectId");
    
    const project = await projectDao.getProject(projectId);

    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: project.projectTieUserId
    })

    // 紐付いているページの削除
    // 紐付いているページが多いと完了まで時間がかかるため、非同期で別のLambdaを利用して処理を実行
    const params = {
      FunctionName: ASYNC_QUEING_LAMBDA_NAME,
      InvocationType:"Event",
      Payload: JSON.stringify({
        project: project
      })
    }
    await lambda.invoke(params).promise();

    await projectDao.deleteProject(projectId);

    response.body = JSON.stringify(project);
  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  }
  return response;
}

// 実行に時間がかかる関連データの削除処理(紐付いているページ)
// 別のLambdaとして登録して非同期でメイン処理からコールする
exports.async_delete_handler= async (event, context) => {
  const project = event.project;

  try {
    const pageList = await pageDao.getPageList(project.id);

    for(const page of pageList) {
      // ページの削除
      await pageDao.deletePage(page.id);
    }

  } catch (error) {
    console.error(error);
  }
}