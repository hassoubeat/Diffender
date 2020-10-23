const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const DIFFENDER_SCREENSHOT_PROCESS_SQS = process.env.DIFFENDER_SCREENSHOT_PROCESS_SQS;
const DIFFENDER_DIFF_SCREENSHOT_PROCESS_SQS = process.env.DIFFENDER_DIFF_SCREENSHOT_PROCESS_SQS;

// スクリーンショット取得SQSにキューを登録する
async function sendScreenshotProcessSQS(sendObject) {
  return await sqs.sendMessage({
    MessageBody: JSON.stringify(sendObject),
    QueueUrl: DIFFENDER_SCREENSHOT_PROCESS_SQS,
  }).promise();
}
module.exports.sendScreenshotProcessSQS = sendScreenshotProcessSQS;

// スクリーンショット差分取得SQSにキューを登録する
async function sendDiffScreenshotProcessSQS(sendObject) {
  return await sqs.sendMessage({
    MessageBody: JSON.stringify(sendObject),
    QueueUrl: DIFFENDER_DIFF_SCREENSHOT_PROCESS_SQS,
  }).promise();
}
module.exports.sendDiffScreenshotProcessSQS = sendDiffScreenshotProcessSQS;