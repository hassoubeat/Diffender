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

// S3からオブジェクトを取得する
module.exports.getObject = async (request) => {
  const object = {
    ...request,
    Bucket: request.Bucket || DIFFENDER_S3_BUCKET_NAME
  }
  return await S3.getObject(object).promise();
}

// S3からオブジェクトを削除する
module.exports.deleteObject = async (request) => {
  const object = {
    Bucket: request.Bucket || DIFFENDER_S3_BUCKET_NAME,
    Key: request.Key,
  }
  return await S3.deleteObject(object).promise();
}