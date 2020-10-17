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

// クエリパラメータの取得
module.exports.getQueryStringParamter = (event, key) => {
  try {
    const queryParam = event.queryStringParameters[key];
    if (queryParam === undefined) throw new Error();
    return queryParam;
  } catch (error) {
    console.error(error);

    error.statusCode = 400;
    error.message = `NotFound QueryStringParameter: ${key}`;
    throw error;
  }
}

// リクエストボディの取得
module.exports.getRequetBody = (event) => {
  try {
    return JSON.parse(event.body);
  } catch (error)  {
    error.statusCode = 400;
    error.message = "Request body is empty or Not JSON format.";
    throw error;
  }
}

// SQSのレコード取得
module.exports.getSQSRecord = (event, index=0) => {
  try {
    return JSON.parse(event.Records[index].body);
  } catch (error)  {
    error.statusCode = 500;
    error.message = "Queue data is empty or Not JSON format.";
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

