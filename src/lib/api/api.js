import Amplify, { API } from 'aws-amplify';

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
// export async function getProjectList(data) {
//   let result = {};
//   try {
//     result = await API.get(DIFFENDER_API_NAME, '/projects', data)
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
//   return result;
// }

// プロジェクトの登録
export async function postProject(data) {
  let result = {};

  try {
    result = await API.post(DIFFENDER_API_NAME, '/projects', data)
  } catch (error) {
    console.error(error);
    throw error;
  }
  return result;
}