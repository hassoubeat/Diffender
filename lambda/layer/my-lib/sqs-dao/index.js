const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const DIFFENDER_SCREENSHOT_PROCESS_SQS = process.env.DIFFENDER_SCREENSHOT_PROCESS_SQS;

// スクリーン取得SQSにキューを登録する
async function sendScreenshotProcessSQS(sendObject) {
  return await sqs.sendMessage({
    MessageBody: JSON.stringify(sendObject),
    QueueUrl: DIFFENDER_SCREENSHOT_PROCESS_SQS,
  }).promise();
}
module.exports.sendScreenshotProcessSQS = sendScreenshotProcessSQS;