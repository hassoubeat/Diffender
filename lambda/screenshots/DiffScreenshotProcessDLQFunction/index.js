const lambdaCommon = require('lambda-common');
const resultItemDao = require('result-item-dao');

exports.lambda_handler = async (event, context) => {
  const resultItem = lambdaCommon.getSQSRecord(event);

  await resultItemDao.updateResultItem({
    ...resultItem,
    status: {
      type: "ERROR",
      message: "スクリーンショットの差分取得に失敗しました",
      errorDetailMessage: "Lambda run time exceeded."
    }
  });
  return "finish.";
};