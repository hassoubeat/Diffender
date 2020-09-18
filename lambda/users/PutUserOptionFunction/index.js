const jwt_decode = require('jwt-decode');
const userOptionDao = require('user-option-dao');

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
    const putUserOption = getPutObject(event);
    checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: putUserOption.id
    });    

    // ユーザオプションの更新
    await userOptionDao.updateUserOption(putUserOption);
    const userOption = await userOptionDao.getUserOption(user.sub);
    response.body = JSON.stringify({
      ...userOption
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
function getPutObject(event) {
  try {
    return JSON.parse(event.body);
  } catch (error)  {
    error.statusCode = 400;
    error.message = "Put object error.";
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