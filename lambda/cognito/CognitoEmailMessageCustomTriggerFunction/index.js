const _ = require('lodash');

const CM_SIGNUP = "CustomMessage_SignUp";
const CM_RESEND_CODE = "CustomMessage_ResendCode";
const CM_FORGOT_PASSWORD = "CustomMessage_ForgotPassword";

exports.lambda_handler = async (event, context) => {
  try {
    console.log(event);
    mainProcess(event);
  } catch (error) {
    console.error(error);
  }
  return event;
}

function mainProcess(event) {
  switch(event.triggerSource) {
    case CM_SIGNUP: {
      event = customMessageSignUp(event);
      break;
    }
    case CM_RESEND_CODE: {
      event = customMessageResendCode(event);
      break;
    }
    case CM_FORGOT_PASSWORD: {
      event = customMessageForgotPassword(event);
      break;
    }
    default: {
      console.error("unmatch trigger");
      console.log(event);
    }
  }
  return event;
}

// サインアップ後に確認コードを送信する際のメッセージをカスタマイズする処理
function customMessageSignUp(event) {
  const nickname = _.get(event, "request.userAttributes.nickname", "");
  const authCode = _.get(event, "request.codeParameter", "{####}");

  const customMessage = `
    ${nickname} 様<br/>
    <br/>
    Diffenderへようこそ！<br/>
    もう少しでサインアップ作業が完了します！<br/>
    <br/>
    以下の確認コードを24時間以内に入力してください。<br/>
    <br/>
    認証コード：${authCode}<br/>
  `;

  _.set(event, "response.emailSubject", "【Diffender】確認コード送信のお知らせ");
  _.set(event, "response.emailMessage", customMessage);

  return event; 
}

// 既存ユーザーに確認コードを再送する際のメッセージをカスタマイズする処理
function customMessageResendCode(event) {
  const nickname = _.get(event, "request.userAttributes.nickname", "");
  const authCode = _.get(event, "request.codeParameter", "{####}");

  const customMessage = `
    ${nickname} 様<br/>
    <br/>
    サインアップ認証用の確認コードを再送信しました。<br/>
    <br/>
    以下の確認コードを24時間以内に入力してください。<br/>
    <br/>
    認証コード：${authCode}<br/>
  `;

  _.set(event, "response.emailSubject", "【Diffender】確認コード再送信のお知らせ");
  _.set(event, "response.emailMessage", customMessage);

  return event; 
}

// 既存ユーザーがパスワードを忘れた際の確認コード発行メッセージをカスタマイズする処理
function customMessageForgotPassword(event) {
  const nickname = _.get(event, "request.userAttributes.nickname", "");
  const authCode = _.get(event, "request.codeParameter", "{####}");

  const customMessage = `
    ${nickname} 様<br/>
    <br/>
    パスワード再設定用の確認コードを送信しました。<br/>
    <br/>
    以下の確認コードを24時間以内に入力してください。<br/>
    <br/>
    認証コード：${authCode}<br/>
  `;

  _.set(event, "response.emailSubject", "【Diffender】確認コード送信のお知らせ");
  _.set(event, "response.emailMessage", customMessage);

  return event; 
}