const jwt_decode = require('jwt-decode');
const lambdaCommon = require('lambda-common');
const projectDao = require('project-dao');
const pageDao = require('page-dao');

exports.lambda_handler = async (event, context) => {
  // レスポンス変数の定義
  let response = {
    'statusCode': 200,
    'headers': {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, GET"
    }
  }

  try {
    const user = jwt_decode(event.headers.Authorization);
    const projectId = lambdaCommon.getPathParameter(event, "projectId");

    const project = await projectDao.getProject(projectId);
    
    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: project.projectTieUserId
    });

    const pageList = await pageDao.getPageList(projectId, false);
    response.body = JSON.stringify(
      pageList
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