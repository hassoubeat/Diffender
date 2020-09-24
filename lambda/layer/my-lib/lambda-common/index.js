// eventからパスパラメーターを取得する
module.exports.getPathParameter = (event, key) => {
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

// リクエストボディの取得
module.exports.getRequetBody = (event) => {
  try {
    return JSON.parse(event.body);
  } catch (error)  {
    error.statusCode = 400;
    error.message = "Request body is empty.";
    throw error;
  }
}

// リソースオーナーをチェックする
module.exports.checkResouceOwner = ({loginUserId, resouceUserId}) => {
  if (loginUserId !== resouceUserId) {
    const error = new Error("Unauthorized resource.");
    error.statusCode = 401;
    throw error;
  }
}