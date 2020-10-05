const pageValidator = require("./index");

describe('Pageのバリデーション処理 正常系のテスト群', () => {

  test('ページ名のバリデーションテスト', async () => {
    expect(() => {
      pageValidator.pageNameValid({
        value: "ページ1"
      });
    }).not.toThrow();
  });

  test('ページ説明のバリデーションテスト', async () => {
    expect(() => {
      pageValidator.pageDescriptionValid({
        value: "ページ説明1"
      });
    }).not.toThrow();
  });

  test('デバイスタイプオプションのバリデーションテスト', async () => {
    expect(() => {
      pageValidator.deviceTypeOptionValid({
        value: "iPhone 6"
      });
    }).not.toThrow();
  });

  test('フルページオプションのバリデーションテスト', async () => {
    expect(() => {
      pageValidator.fullPageOptionValid({
        value: true
      });
    }).not.toThrow();
  });

  test('事前共通アクションの実施有無のバリデーションテスト', async () => {
    expect(() => {
      pageValidator.isEnableBeforeCommonActionValid({
        value: true
      });
    }).not.toThrow();
  });

  test('事後共通アクションの実施有無のバリデーションテスト', async () => {
    expect(() => {
      pageValidator.isEnableAfterCommonActionValid({
        value: true
      });
    }).not.toThrow();
  });

  test('ページ全体のバリデーションテスト', async () => {
    expect(() => {
      const page = {
        name: "",
        description: "",
        browserSettings: {
          deviceType: "iPhone 6"
        },
        screenshotOptions: {
          fullPage: false
        },
        isEnableBeforeCommonAction: true,
        isEnableAfterCommonAction: true,
        actions: [
          {
            type: "GOTO",
            typeName: "ページ遷移",
            name: "テストページへの移動",
            url: "https://localhost:3000"
          },
          {
            type: "WAIT",
            typeName: "待機",
            name: "読み込み待機",
            millisecond: 1000
          }
        ]
      }
      pageValidator.pageValid(page);
    }).not.toThrow();
  });

});

describe('Pageのバリデーション処理 異常系のテスト群', () => {

  test('ページ名のバリデーションテスト 最大文字数エラー(31文字)', async () => {
    expect(() => {
      pageValidator.pageNameValid({
        value: "1234512345123451234512345123451"
      });
    }).toThrow();
  });

  test('ページ説明のバリデーションテスト 最大文字数エラー(51文字)', async () => {
    expect(() => {
      pageValidator.pageNameValid({
        value: "123451234512345123451234512345123451234512345123451"
      });
    }).toThrow();
  });

  test('デバイスタイプオプションのバリデーションテスト 空', async () => {
    expect(() => {
      pageValidator.deviceTypeOptionValid({
        value: ""
      });
    }).toThrow();
  });

  test('フルページオプションのバリデーションテスト 空', async () => {
    expect(() => {
      pageValidator.fullPageOptionValid({
        value: undefined
      });
    }).toThrow();
  });

  test('フルページオプションのバリデーションテスト 型誤り', async () => {
    expect(() => {
      pageValidator.fullPageOptionValid({
        value: "true"
      });
    }).toThrow();
  });

  test('事前共通アクションの実施有無のバリデーションテスト 空', async () => {
    expect(() => {
      pageValidator.isEnableBeforeCommonActionValid({
        value: undefined
      });
    }).toThrow();
  });

  test('事前共通アクションの実施有無のバリデーションテスト 型誤り', async () => {
    expect(() => {
      pageValidator.isEnableBeforeCommonActionValid({
        value: "true"
      });
    }).toThrow();
  });

  test('事後共通アクションの実施有無のバリデーションテスト 空', async () => {
    expect(() => {
      pageValidator.isEnableAfterCommonActionValid({
        value: undefined
      });
    }).toThrow();
  });

  test('事後共通アクションの実施有無のバリデーションテスト 型誤り', async () => {
    expect(() => {
      pageValidator.isEnableAfterCommonActionValid({
        value: "true"
      });
    }).toThrow();
  });
});