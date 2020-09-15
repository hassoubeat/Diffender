const projectValidator = require("./index");

describe('Projectのバリデーション処理 正常系のテスト群', () => {

  test('プロジェクト名のバリデーションテスト', async () => {
    expect(() => {
      projectValidator.projectNameValid("プロジェクト1");
    }).not.toThrow();
  });

  test('プロジェクト説明文のバリデーション', async () => {
    expect(() => {
      projectValidator.projectDescriptionValid("プロジェクト1の説明文");
    }).not.toThrow();
  });

  test('プロジェクトに紐づくユーザIDのバリデーション', async () => {
    expect(() => {
      projectValidator.projectTieUserIdValid("8c32116d-5c8c-48c0-8264-1df53434b503");
    }).not.toThrow();
  });

  test('プロジェクトオブジェクト全てのバリデーション', async () => {
    const project = {
      name: "プロジェクト1",
      description: "プロジェクト1",
      projectTieUserId: "8c32116d-5c8c-48c0-8264-1df53434b503",
    }
    expect(() => {
      projectValidator.projectValid(project);
    }).not.toThrow();
  });
});

describe('Projectのバリデーション処理 異常系のテスト群', () => {
  test('プロジェクト名のバリデーションテスト 最大文字数エラー(31文字)', async () => {
    expect(() => {
      projectValidator.projectNameValid("1234512345123451234512345123451");
    }).toThrow();
  });

  test('プロジェクト説明文のバリデーション 最大文字数エラー(51文字)', async () => {
    expect(() => {
      projectValidator.projectDescriptionValid("123451234512345123451234512345123451234512345123451");
    }).toThrow();
  });

  test('プロジェクトに紐づくユーザIDのバリデーション 空文字エラー', async () => {
    expect(() => {
      projectValidator.projectTieUserIdValid("");
    }).toThrow();
  });

  test('プロジェクトに紐づくユーザIDのバリデーション nullエラー', async () => {
    expect(() => {
      projectValidator.projectTieUserIdValid(null);
    }).toThrow();
  });
});