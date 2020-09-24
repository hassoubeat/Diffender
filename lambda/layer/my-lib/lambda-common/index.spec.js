const lambdaCommon = require("./index");

describe('lambda共通処理 正常系のテスト群', () => {

  test('パスパラメーターの取得処理のテスト', async () => {
    const event = {
      pathParameters: {
        projectId: "Project-1"
      }
    }
    const projectId = lambdaCommon.getPathParameter(event, "projectId");
    expect(projectId).toBe("Project-1");
  });

  test('リクエストボディ取得処理のテスト', async () => {
    const event = {}
    event.body = JSON.stringify({
      projectId: "Project-1"
    });

    const project = lambdaCommon.getRequetBody(event);
    expect(project).toEqual({
      projectId: "Project-1"
    });
  });

  test('リソースオーナーのチェック処理のテスト', async () => {
    expect(() => {
      lambdaCommon.checkResouceOwner({
        loginUserId: "12345", 
        resouceUserId: "12345"
      })
    }).not.toThrow();
  });
});

describe('lambda共通処理 異常系のテスト群', () => {
  test('パスパラメーターの取得処理のテスト パラメータなし', async () => {
    const event = {
      pathParameters: {
      }
    }

    let result = {};
    try {
      lambdaCommon.getPathParameter(event, "projectId");
    } catch (error) {
      result = error;
    }
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe("NotFound PathParameter: projectId");
  });

  test('リクエストボディ取得処理のテスト 取得失敗', async () => {
    const event = {}
    let result = {};

    try {
      lambdaCommon.getRequetBody(event);
    } catch (error) {
      result = error;
    }
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe("Request body is empty.");
  });

  test('リソースオーナーのチェック処理のテスト チェック失敗', async () => {
    let result = {};
    try {
      lambdaCommon.checkResouceOwner({
        loginUserId: "12345", 
        resouceUserId: "1234"
      })
    } catch (error) {
      result = error;
    }
    expect(result.statusCode).toBe(401);
    expect(result.message).toBe("Unauthorized resource.");
  });
});