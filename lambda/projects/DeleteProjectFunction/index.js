const jwt_decode = require('jwt-decode');
const projectDao = require('project-dao');
const lambdaCommon = require('lambda-common');

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