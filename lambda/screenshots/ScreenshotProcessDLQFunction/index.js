const lambdaCommon = require('lambda-common');
const resultItemDao = require('result-item-dao');

exports.lambda_handler = async (event, context) => {
  const queueData = lambdaCommon.getSQSRecord(event);
  const resultItem = queueData.resultItem;

  await resultItemDao.updateResultItem({
    ...resultItem,
    status: {
      type: "ERROR",
      message: "スクリーンショットの撮影に失敗しました",
      errorDetailMessage: "Lambda run time exceeded."
    }
  });
  return "finish.";
};