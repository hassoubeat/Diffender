const jwt_decode = require('jwt-decode');
const projectDao = require('project-dao');
const pageDao = require('page-dao');
// const pageValidator = require('page-validator');
const lambdaCommon = require('lambda-common');

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
    const postPage = lambdaCommon.getRequetBody(event);

    // 取得するページが紐づくプロジェクトのリソースオーナーチェック
    const project = await projectDao.getProject(projectId);
    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: project.projectTieUserId
    })

    postPage.id = await pageDao.generatePageId();
    postPage.pageTieUserId = user.sub;
    postPage.pageTieProjectId = projectId;
    
    // TODO ページバリデーションの実装
    // pageValidator.pageValid(postPage);

    await pageDao.postPage(postPage);

    const page = await pageDao.getPage(postPage.id);
    response.body = JSON.stringify(page);

  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  }
  return response;
}