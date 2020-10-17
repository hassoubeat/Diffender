const jwt_decode = require('jwt-decode');
const lambdaCommon = require('lambda-common');
const resultDao = require('result-dao');

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
    let queryProjectId = null;
    try {
      queryProjectId = lambdaCommon.getQueryStringParamter(event, "projectId");
    } catch (error) {
      queryProjectId = null;
    }

    let resultList = [];
    if (queryProjectId) {
      resultList = await resultDao.getResultListByProjectId(user.sub, queryProjectId, false);
    } else {
      resultList = await resultDao.getResultListByUserId(user.sub, false);
    }
    response.body = JSON.stringify(
      resultList
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