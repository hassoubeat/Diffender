import * as api from "./api";

// 環境変数設定
// 正常系は実際のデータベースに値の変更を加えるため、デフォルトスキップ
describe.skip('API呼び出し処理 正常系のテスト群', () => {

  test('プロジェクト登録', async () => {
    const data = {
      body: {
        "project": {
          "name": "プロジェクト1",
          "description": "テストプロジェクトです",
          "projectTieUserId": "48baa275-3880-48a2-98a1-b5089aa98386"
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
          "description": "テストプロジェクトです",
          "projectTieUserId": "48baa275-3880-48a2-98a1-b5089aa98386"
        }
      }
    }

    await expect(api.postProject(data)).rejects.toThrow();
  });
});