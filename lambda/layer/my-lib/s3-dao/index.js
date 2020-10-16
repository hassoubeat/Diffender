const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const DIFFENDER_S3_BUCKET_NAME = process.env.DIFFENDER_S3_BUCKET_NAME;

// S3にオブジェクトを登録する
module.exports.putObject = async (request) => {
  const object = {
    ...request,
    Bucket: request.Bucket || DIFFENDER_S3_BUCKET_NAME
  }
  await S3.putObject(object).promise();
}