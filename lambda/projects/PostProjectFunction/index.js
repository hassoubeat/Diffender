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
      "Access-Control-Allow-Methods": "OPTIONS, POST"
    }
  }

  try {
    const user = jwt_decode(event.headers.Authorization);
    const postProject = getRequetBody(event);

    postProject.projectTieUserId = user.sub;
    projectValidator.projectValid(postProject);

    const postObject = {
      id: await projectDao.generateProjectId(),
      name: postProject.name,
      description: postProject.description,
      projectTieUserId: postProject.projectTieUserId,
    }
    await projectDao.postProject(postObject);

    const project = await projectDao.getProject(postObject.id);

    response.body = JSON.stringify({
      ...project
    });
  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  }
  return response;
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