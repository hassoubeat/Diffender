const jwt_decode = require('jwt-decode');
const resultDao = require('result-dao');
const resultValidator = require('result-validator');
const lambdaCommon = require('lambda-common');

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
    const resultId = lambdaCommon.getPathParameter(event, "resultId");
    const updateResult = lambdaCommon.getRequetBody(event);
    updateResult.id = resultId;

    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: updateResult.resultTieUserId
    });

    resultValidator.resultValid(updateResult);

    await resultDao.updateResult(updateResult);
    const result = await resultDao.getResult(updateResult.id);

    response.body = JSON.stringify(result);
  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  }
  return response;
}