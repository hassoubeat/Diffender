import Amplify, { API } from 'aws-amplify';
import { getCurrentUser } from 'lib/auth/cognitoAuth';
import _ from 'lodash';
import * as toast from 'lib/util/toast';

import { 
  AWS_APP_API_NAME, 
  AWS_APP_API_ENDPOINT, 
  AWS_APP_API_STAGE
} from 'lib/util/const'

const querystring = require('querystring');

Amplify.configure({
  API: {
    endpoints: [
      {
        // API名
        name: AWS_APP_API_NAME,
        // API Gatewayのエンドポイント
        endpoint: `${AWS_APP_API_ENDPOINT}/${AWS_APP_API_STAGE}`
      },
    ]
  }
});

// プロジェクトの取得
export async function getProject({projectId, request}) {
  request = await requestSetup(request);
  return await API.get(AWS_APP_API_NAME, `/projects/${projectId}`, request);
}

// プロジェクト一覧の取得
export async function getProjectList({request}) {
  request = await requestSetup(request);
  return await API.get(AWS_APP_API_NAME, '/projects', request);
}

// プロジェクトの登録
export async function postProject({request}) {
  request = await requestSetup(request);
  return await API.post(AWS_APP_API_NAME, '/projects', request)
}

// プロジェクトの更新
export async function putProject({projectId, request}) {
  request = await requestSetup(request);
  return await API.put(AWS_APP_API_NAME, `/projects/${projectId}`, request)
}

// プロジェクトの削除
export async function deleteProject({projectId, request}) {
  request = await requestSetup(request);
  return await API.del(AWS_APP_API_NAME, `/projects/${projectId}`, request)
}

// スクリーンショットの取得リクエスト(プロジェクト)
export async function ScreenshotQueingProject({projectId, request}) {
  request = await requestSetup(request);
  return await API.post(AWS_APP_API_NAME, `/projects/${projectId}/screenshot`, request)
}

// ページ一覧の取得
export async function getPageList({projectId, request}) {
  request = await requestSetup(request);
  return await API.get(AWS_APP_API_NAME, `/projects/${projectId}/pages`, request);
}

// ページの取得
export async function getPage({projectId, pageId, request}) {
  request = await requestSetup(request);
  return await API.get(AWS_APP_API_NAME, `/projects/${projectId}/pages/${pageId}`, request);
}

// ページの登録
export async function postPage({projectId, request}) {
  request = await requestSetup(request);
  return await API.post(AWS_APP_API_NAME, `/projects/${projectId}/pages`, request);
}

// ページの更新
export async function putPage({projectId, pageId, request}) {
  request = await requestSetup(request);
  return await API.put(AWS_APP_API_NAME, `/projects/${projectId}/pages/${pageId}`, request)
}

// ページの削除
export async function deletePage({projectId, pageId, request}) {
  request = await requestSetup(request);
  return await API.del(AWS_APP_API_NAME, `/projects/${projectId}/pages/${pageId}`, request)
}

// ページのSS取得テスト
export async function testPage({projectId, request}) {
  request = await requestSetup(request);
  return await API.post(AWS_APP_API_NAME, `/projects/${projectId}/pages/test`, request)
}

// リザルト一覧の取得
export async function getResultList({queryStringsObject, request}) {
  request = await requestSetup(request);
  return await API.get(AWS_APP_API_NAME, `/results?${querystring.stringify(queryStringsObject)}`, request);
}

// リザルトの取得
export async function getResult({resultId, request}) {
  // TODO 必要になった際に実装
  throw new Error("getResult() unimplemented.");
  // request = await requestSetup(request);
  // return await API.get(AWS_APP_API_NAME, `/results/${resultId}`, request);
}

// リザルトの登録
export async function postResult({request}) {
  // TODO 必要になった際に実装
  throw new Error("postResult() unimplemented.");
  // request = await requestSetup(request);
  // return await API.post(AWS_APP_API_NAME, `/results`, request);
}

// リザルトの更新
export async function putResult({resultId, request}) {
  request = await requestSetup(request);
  return await API.put(AWS_APP_API_NAME, `/results/${resultId}`, request);
}

// リザルトの削除
export async function deleteResult({resultId, request}) {
  request = await requestSetup(request);
  return await API.del(AWS_APP_API_NAME, `/results/${resultId}`, request)
}

// Diffの取得リクエスト(リザルト)
export async function DiffScreenshotQueingProject({request}) {
  request = await requestSetup(request);
  return await API.post(AWS_APP_API_NAME, `/results/diff-screenshot`, request)
}

// リザルトアイテム一覧の取得
export async function getResultItemList({resultId, request}) {
  request = await requestSetup(request);
  return await API.get(AWS_APP_API_NAME, `/results/${resultId}/result-items`, request);
}

// ユーザオプションの取得
export async function getUserOption(request) {  
  request = await requestSetup(request);
  return await API.get(AWS_APP_API_NAME, `/userOption`, request);
}

// ユーザオプションの登録
export async function postUserOption(request) {
  request = await requestSetup(request);
  return await API.post(AWS_APP_API_NAME, `/userOption`, request)
}

// ユーザオプションの変更
export async function putUserOption(request) {
  request = await requestSetup(request);
  return await API.put(AWS_APP_API_NAME, `/userOption`, request)
}

// リクエストの共通セットアップ
async function requestSetup(request) {
  const user = await getCurrentUser();
  const idToken = user.signInUserSession.idToken.jwtToken;

  const shareRequest = {
    headers: {
      // APIGateway Cognito認証用IdTokenのセット
      Authorization: idToken
    }
  }
  // 元々のリクエスト情報と結合
  return Object.assign(shareRequest, request); 
}

// APIエラー時の汎用処理
export function utilErrorProcess(error, errorMessage) {
  console.log(error.response);

  let message = errorMessage || "リクエストに失敗しました";

  const responseMesssage = _.get(error, 'response.data.message');
  if (responseMesssage) {
    message += `<br/>${responseMesssage}`
  }

  toast.errorToast(
    { message: message }
  );
}