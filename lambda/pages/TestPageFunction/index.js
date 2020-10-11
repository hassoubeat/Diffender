/* 日本語フォントが入っている.fontsを読み込ませるためにHOMEを設定する */
// process.env['HOME'] = '/opt/nodejs/';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DIFFENDER_S3_BUCKET_NAME = process.env.DIFFENDER_S3_BUCKET_NAME;

const jwt_decode = require('jwt-decode');
const puppeteerWrapper = require("puppeteer-wrapper");
const lambdaCommon = require('lambda-common');
const projectDao = require('project-dao');
const pageValidator = require('page-validator');

// メイン処理
exports.lambda_handler = async (event, context) => {
  // レスポンス変数の定義
  let response = {
    'statusCode': 200,
    'headers': {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST"
    }
  }

  try {
    const user = jwt_decode(event.headers.Authorization);
    const testPage = lambdaCommon.getRequetBody(event);
    const projectId = lambdaCommon.getPathParameter(event, "projectId");

    pageValidator.pageValid(testPage);

    const project = await projectDao.getProject(projectId);
    lambdaCommon.checkResouceOwner({
      loginUserId: user.sub, 
      resouceUserId: project.projectTieUserId
    })

    const puppeteerPage = await puppeteerWrapper.initPuppeteer(testPage);

    // 共通アクション(前)
    if (testPage.isEnableBeforeCommonAction) {
      for( const beforeAction of project.beforeCommonActions ) {
        await puppeteerWrapper.browserAction(puppeteerPage, beforeAction);
      }
    }

    // アクション
    for( const action of testPage.actions ) {
      await puppeteerWrapper.browserAction(puppeteerPage, action);
    }

    // 共通アクション(後)
    if (testPage.isEnableAfterCommonAction) {
      for( const afterAction of project.afterCommonActions ) {
        await puppeteerWrapper.browserAction(puppeteerPage, afterAction);
      }
    }

    // スクリーンショット取得
    const screenshot = await puppeteerWrapper.screenshots(puppeteerPage, testPage.screenshotOptions);
    
    const s3ObjectKey = `test/${getUnique()}.jpeg`

    // S3にスクリーンショット保存
    const s3PutParams = {
      Bucket: DIFFENDER_S3_BUCKET_NAME,
      Key: s3ObjectKey,
      Body: screenshot,
      ContentType: 'image/jpeg'
    }
    await S3.putObject(s3PutParams).promise();

    response.body = JSON.stringify({
      screenshotKey: `https://${DIFFENDER_S3_BUCKET_NAME}.s3.amazonaws.com/${s3ObjectKey}`
    });
    
  } catch (error) {
    console.error(error);

    response.statusCode = error.statusCode || 500;
    response.body = JSON.stringify({
      message: error.message
    });
  } 
  return response;
};

function getUnique(myStrong){
  var strong = 1000;
  if (myStrong) strong = myStrong;
  return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
 }