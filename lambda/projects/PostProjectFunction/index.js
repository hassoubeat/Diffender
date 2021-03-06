const jwt_decode = require('jwt-decode');
const userOptionDao = require('user-option-dao');
const projectDao = require('project-dao');
const projectValidator = require('project-validator');
const lambdaCommon = require('lambda-common');

const DEFAULT_PROJECT_REGISTER_LIMIT = process.env.DIFFENDER_DEFAULT_PROJECT_REGISTER_LIMIT;

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
    const postProject = lambdaCommon.getRequetBody(event);
    

    // 登録上限チェック
    const userOption = await userOptionDao.getUserOption(user.sub);
    lambdaCommon.checkRegisterLimit(
      await projectDao.getProjectList(user.sub, false, true), 
      userOption.projectRegisterLimit || DEFAULT_PROJECT_REGISTER_LIMIT
    );

    postProject.projectTieUserId = user.sub;
    postProject.id = await projectDao.generateProjectId();
    postProject.beforeCommonActions = postProject.beforeCommonActions || [];
    postProject.afterCommonActions = postProject.afterCommonActions || [];
    postProject.pagesSortMap = {};
    
    projectValidator.projectValid(postProject);

    await projectDao.postProject(postProject);

    const project = await projectDao.getProject(postProject.id);

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