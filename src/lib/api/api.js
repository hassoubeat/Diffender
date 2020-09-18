import Amplify, { API } from 'aws-amplify';
import { getCurrentUser } from 'lib/auth/cognitoAuth';

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

// プロジェクト一覧の取得
export async function getProjectList(request) {
  let result = {};
  let projectList = [];

  request = await requestSetup(request);
  result = await API.get(DIFFENDER_API_NAME, '/projects', request);
  projectList = result.body.Items;
  
  return projectList;
}

// プロジェクトの登録
export async function postProject(request) {
  let result = {};

  request = await requestSetup(request);
  result = await API.post(DIFFENDER_API_NAME, '/projects', request)

  return result;
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