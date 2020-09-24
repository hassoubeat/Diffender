const jwt_decode = require('jwt-decode');
const projectDao = require('project-dao');

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
    const projectId = getPathParameter(event, "projectId");
    
    const project = await projectDao.getProject(projectId);

    checkResouceOwner({
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

// eventからパスパラメーターを取得する
function getPathParameter(event, key) {
  try {
    const pathParam = event.pathParameters[key];
    if (pathParam === undefined) throw new Error();
    return pathParam;
  } catch (error) {
    console.error(error);

    error.statusCode = 400;
    error.message = `NotFound PathParameter: ${key}`;
    throw error;
  }
}

// リソースオーナーをチェックする
function checkResouceOwner({loginUserId, resouceUserId}) {
  if (loginUserId !== resouceUserId) {
    const error = new Error("Unauthorized resource.");
    error.statusCode = 401;
    throw error;
  }
}