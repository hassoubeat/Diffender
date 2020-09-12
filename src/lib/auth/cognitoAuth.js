// AWS Cognitoを利用した認証処理
import Amplify, { Auth } from 'aws-amplify';

// Amplifyの設定
Amplify.configure({
  Auth: {
    // リージョン
    region: process.env.REACT_APP_AWS_REGION,
    // ユーザプールのID
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    // アプリクライアントID
    userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
  }
});

// サインアップ
export async function signUp (email, password, attributes, successCallback, errorCallback) {
  let result = "";
  try {
    result = await Auth.signUp({
      username: email, 
      password: password,
      attributes: attributes
    });
    if(successCallback) successCallback(result);
    return result;
  } catch (error) {
    console.error(error);

    if(errorCallback) {
      errorCallback(error);
    } else {
      throw error;
    }
  }
};

// 認証コードの検証
export async function confirmSignUp (email, verifyCode, successCallback, errorCallback) {
  let result = "";
  try {
    result = await Auth.confirmSignUp(
      email,
      verifyCode
    );
    if(successCallback) successCallback(result);
    return result;
  } catch (error) {
    console.error(error);
    if(errorCallback) errorCallback(error);
  }
};

// 認証コードの再送信
export async function resendSignUp (email, successCallback, errorCallback) {
  let result = "";
  try {
    result = await Auth.resendSignUp(email);
    if(successCallback) successCallback(result);
    return result;
  } catch (error) {
    console.error(error);
    if(errorCallback) errorCallback(error);
  }
};

// サインイン
export async function signIn (email, password, successCallback, errorCallback) {
  let result = "";
  try {
    result = await Auth.signIn({
      username: email, 
      password: password
    });
    if(successCallback) successCallback(result);
    return result;
  } catch (error) {
    console.error(error);
    if(errorCallback) errorCallback(error);
  }
};

// IdProvider(Facebook, Google...etc)を利用したサインイン
export async function federationSignIn (federationProvider, successCallback, errorCallback) {
  let result = "";
  try {
    result = await Auth.federatedSignIn({ provider: federationProvider })
    if(successCallback) successCallback(result);
    return result;
  } catch (error) {
    console.error(error);
    if(errorCallback) errorCallback(error);
  }
};

// サインアウト
export async function signOut (successCallback, errorCallback) {
  let result = "";
  try {
    result = await Auth.signOut();
    if(successCallback) successCallback(result);
  } catch (error) {
    console.error(error);
    if(errorCallback) errorCallback(error);
  }
};

// 現在のユーザ取得
export async function getCurrentUser() {
  return await Auth.currentAuthenticatedUser();
};

// Password変更
export async function changePassword (user, oldPassword, newPassword, successCallback, errorCallback) {
  let result = "";
  try {
    result = await Auth.changePassword(user, oldPassword, newPassword)
    if(successCallback) successCallback(result);
    return result;
  } catch (error) {
    console.error(error);
    if(errorCallback) errorCallback(error);
  }
};