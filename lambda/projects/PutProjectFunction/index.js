const jwt_decode = require('jwt-decode');
const projectDao = require('project-dao');
const projectValidator = require('project-validator');

exports.lambda_handler = async (event, context) => {
  // レスポンス変数の定義
  let response = {
    'statusCode': 200,
    'headers': {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, PUT"
    }
  }

  try {
    const user = jwt_decode(event.headers.Authorization);
    const projectId = getPathParameter(event, "projectId");
    const updateProject = getRequetBody(event);
    updateProject.id = projectId;

    checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: updateProject.projectTieUserId
    });

    projectValidator.projectValid(updateProject);

    // ユーザオプションの更新
    await projectDao.updateProject(updateProject);
    const project = await projectDao.getProject(updateProject.id);

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

// 更新オブジェクトの取得
function getRequetBody(event) {
  try {
    return JSON.parse(event.body);
  } catch (error)  {
    error.statusCode = 400;
    error.message = "Request body is empty.";
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