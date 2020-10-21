const jwt_decode = require('jwt-decode');
const lambdaCommon = require('lambda-common');
const resultDao = require('result-dao');
const resultItemDao = require('result-item-dao');

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
    const resultId = lambdaCommon.getPathParameter(event, "resultId");

    const result = await resultDao.getResult(resultId);
    
    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: result.resultTieUserId
    });

    const resultItemList = await resultItemDao.getResultItemListByResultId(resultId, false);
    response.body = JSON.stringify(
      resultItemList
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