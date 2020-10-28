const jwt_decode = require('jwt-decode');
const userOptionDao = require('user-option-dao');

const DEFAULT_PROJECT_REGISTER_LIMIT = process.env.DIFFENDER_DEFAULT_PROJECT_REGISTER_LIMIT;
const DEFAULT_PAGE_REGISTER_LIMIT = process.env.DIFFENDER_DEFAULT_PAGE_REGISTER_LIMIT;
const DEFAULT_RESULT_REGISTER_LIMIT = process.env.DIFFENDER_DEFAULT_RESULT_REGISTER_LIMIT;

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

    const postObj = {
      id: user.sub,
      projectsSortMap: {},
      projectRegisterLimit: DEFAULT_PROJECT_REGISTER_LIMIT,
      pageRegisterLimit: DEFAULT_PAGE_REGISTER_LIMIT,
      resultRegisterLimit: DEFAULT_RESULT_REGISTER_LIMIT
    }
    await userOptionDao.postUserOption(postObj);

    const userOption = await userOptionDao.getUserOption(user.sub);
    response.body = JSON.stringify(userOption);
  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  }
  return response;
}