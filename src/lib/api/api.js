import Amplify, { API } from 'aws-amplify';
import { getCurrentUser } from 'lib/auth/cognitoAuth';
const querystring = require('querystring');

const DIFFENDER_API_NAME = process.env.REACT_APP_AWS_APP_API_NAME;
const DIFFENDER_API_ENDPOINT = process.env.REACT_APP_AWS_APP_API_ENDPOINT;
const DIFFENDER_API_STAGE = process.env.REACT_APP_AWS_APP_API_STAGE;


Amplify.configure({
  API: {
    endpoints: [
      {
        // API名
        name: DIFFENDER_API_NAME,
        // API Gatewayのエンドポイント
        endpoint: `${DIFFENDER_API_ENDPOINT}/${DIFFENDER_API_STAGE}`
      },
    ]
  }
});

// プロジェクトの取得
export async function getProject({projectId, request}) {
  request = await requestSetup(request);
  return await API.get(DIFFENDER_API_NAME, `/projects/${projectId}`, request);
}

// プロジェクト一覧の取得
export async function getProjectList({request}) {
  request = await requestSetup(request);
  return await API.get(DIFFENDER_API_NAME, '/projects', request);
}

// プロジェクトの登録
export async function postProject({request}) {
  request = await requestSetup(request);
  return await API.post(DIFFENDER_API_NAME, '/projects', request)
}

// プロジェクトの更新
export async function putProject({projectId, request}) {
  request = await requestSetup(request);
  return await API.put(DIFFENDER_API_NAME, `/projects/${projectId}`, request)
}

// プロジェクトの削除
export async function deleteProject({projectId, request}) {
  request = await requestSetup(request);
  return await API.del(DIFFENDER_API_NAME, `/projects/${projectId}`, request)
}

// スクリーンショットの取得リクエスト(プロジェクト)
export async function ScreenshotQueingProject({projectId, request}) {
  request = await requestSetup(request);
  return await API.post(DIFFENDER_API_NAME, `/projects/${projectId}/screenshot`, request)
}

// ページ一覧の取得
export async function getPageList({projectId, request}) {
  request = await requestSetup(request);
  return await API.get(DIFFENDER_API_NAME, `/projects/${projectId}/pages`, request);
}

// ページの取得
export async function getPage({projectId, pageId, request}) {
  request = await requestSetup(request);
  return await API.get(DIFFENDER_API_NAME, `/projects/${projectId}/pages/${pageId}`, request);
}

// ページの登録
export async function postPage({projectId, request}) {
  request = await requestSetup(request);
  return await API.post(DIFFENDER_API_NAME, `/projects/${projectId}/pages`, request);
}

// ページの更新
export async function putPage({projectId, pageId, request}) {
  request = await requestSetup(request);
  return await API.put(DIFFENDER_API_NAME, `/projects/${projectId}/pages/${pageId}`, request)
}

// ページの削除
export async function deletePage({projectId, pageId, request}) {
  request = await requestSetup(request);
  return await API.del(DIFFENDER_API_NAME, `/projects/${projectId}/pages/${pageId}`, request)
}

// ページのSS取得テスト
export async function testPage({projectId, request}) {
  request = await requestSetup(request);
  return await API.post(DIFFENDER_API_NAME, `/projects/${projectId}/pages/test`, request)
}

// リザルト一覧の取得
export async function getResultList({queryStringsObject, request}) {
  request = await requestSetup(request);
  return await API.get(DIFFENDER_API_NAME, `/results?${querystring.stringify(queryStringsObject)}`, request);
}

// ユーザオプションの取得
export async function getUserOption(request) {  
  request = await requestSetup(request);
  return await API.get(DIFFENDER_API_NAME, `/userOption`, request);
}

// ユーザオプションの登録
export async function postUserOption(request) {
  request = await requestSetup(request);
  return await API.post(DIFFENDER_API_NAME, `/userOption`, request)
}

// ユーザオプションの変更
export async function putUserOption(request) {
  request = await requestSetup(request);
  return await API.put(DIFFENDER_API_NAME, `/userOption`, request)
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