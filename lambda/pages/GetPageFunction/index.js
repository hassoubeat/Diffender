const jwt_decode = require('jwt-decode');
const pageDao = require('page-dao');
const lambdaCommon = require('lambda-common');

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
    const pageId = lambdaCommon.getPathParameter(event, "pageId");
    
    const page = await pageDao.getPage(pageId);

    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: page.pageTieUserId
    })

    response.body = JSON.stringify(page);
  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  }
  return response;
}