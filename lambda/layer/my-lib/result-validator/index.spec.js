const resultValidator = require("./index");

describe('Resultのバリデーション処理 正常系のテスト群', () => {

  test('リザルト名のバリデーションテスト', async () => {
    expect(() => {
      resultValidator.resultNameValid({
        value: "リザルト1"
      });
    }).not.toThrow();
  });

  test('リザルト説明のバリデーションテスト', async () => {
    expect(() => {
      resultValidator.resultDescriptionValid({
        value: "リザルト説明1"
      });
    }).not.toThrow();
  });

  test('リザルト全体のバリデーションテスト', async () => {
    expect(() => {
      const result = {
        name: "",
        description: "",
      }
      resultValidator.resultValid(result);
    }).not.toThrow();
  });

});

describe('Resultのバリデーション処理 異常系のテスト群', () => {

  test('リザルト名のバリデーションテスト 最大文字数エラー(31文字)', async () => {
    expect(() => {
      resultValidator.resultNameValid({
        value: "1234512345123451234512345123451"
      });
    }).toThrow();
  });

  test('リザルト説明のバリデーションテスト 最大文字数エラー(51文字)', async () => {
    expect(() => {
      resultValidator.resultDescriptionValid({
        value: "123451234512345123451234512345123451234512345123451"
      });
    }).toThrow();
  });
});