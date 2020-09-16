import * as api from "./api";
import { signIn } from 'lib/auth/cognitoAuth';

// テスト用のユーザID、パスワード取得
const TEST_CONGNITO_USER_ID = process.env.REACT_APP_TEST_COGNITO_USER_ID;
const TEST_CONGNITO_USER_PASSWORD = process.env.REACT_APP_TEST_COGNITO_USER_PASSWORD;

// 環境変数設定
// 正常系は実際のデータベースに値の変更を加えるため、デフォルトスキップ
describe.skip('API呼び出し処理 正常系のテスト群', () => {

  beforeAll( async () => {
    // サインイン
    await signIn(
      TEST_CONGNITO_USER_ID,
      TEST_CONGNITO_USER_PASSWORD
    );
  });

  test('プロジェクト登録', async () => {
    const data = {
      body: {
        "project": {
          "name": "プロジェクト1",
          "description": "テストプロジェクトです"
        }
      }
    }
    await expect(api.postProject(data)).resolves.not.toThrow();
  });
});

describe('API呼び出し処理 異常系テスト群', () => {

  test('プロジェクト登録 プロジェクト名 最大文字数エラー(31文字)', async () => {
    const data = {
      body: {
        "project": {
          "name": "1234512345123451234512345123451",
          "description": "テストプロジェクトです"
        }
      }
    }

    await expect(api.postProject(data)).rejects.toThrow();
  });
});