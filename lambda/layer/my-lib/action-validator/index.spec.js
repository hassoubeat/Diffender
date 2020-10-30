const actionValidator = require("./index");

describe('Pageのバリデーション処理 正常系のテスト群', () => {

  test('アクションタイプのバリデーションテスト GOTO', async () => {
    expect(() => {
      actionValidator.actionTypeValid({
        value: "GOTO"
      });
    }).not.toThrow();
  });

  test('アクションタイプのバリデーションテスト WAIT', async () => {
    expect(() => {
      actionValidator.actionTypeValid({
        value: "WAIT"
      });
    }).not.toThrow();
  });

  test('アクションタイプ名のバリデーションテスト', async () => {
    expect(() => {
      actionValidator.actionTypeNameValid({
        value: "ページ遷移"
      });
    }).not.toThrow();
  });

  test('アクション名のバリデーションテスト', async () => {
    expect(() => {
      actionValidator.actionNameValid({
        value: "テスト"
      });
    }).not.toThrow();
  });

  test('URLのバリデーションテスト', async () => {
    expect(() => {
      actionValidator.gotoUrlValid({
        value: "https://localhost:3000"
      });
    }).not.toThrow();
  });

  test('ミリ秒のバリデーション', async () => {
    expect(() => {
      actionValidator.waitMillisecondValid({
        value: 1000
      });
    }).not.toThrow();
  });

  test('アクション全体のバリデーションテスト GOTO', async () => {
    expect(() => {
      const action = {
        type: "GOTO",
        typeName: "ページ遷移",
        name: "GoogleTOPページに移動",
        url: "https://localhost:3000",
        basicAuth: {
          user: "user",
          password: "password"
        }
      }
      actionValidator.actionValid({
        action: action,
      });
    }).not.toThrow();
  });

  test('アクション全体のバリデーションテスト WAIT', async () => {
    expect(() => {
      const action = {
        type: "WAIT",
        typeName: "待機",
        name: "読み込み待機",
        millisecond: 1000
      }
      actionValidator.actionValid({
        action: action,
        appendKey: "actions[1]"
      });
    }).not.toThrow();
  });

  test('アクション全体のバリデーションテスト CLICK', async () => {
    expect(() => {
      const action = {
        type: "CLICK",
        typeName: "クリック",
        name: "ログイン",
        selector: "input[type='submit']"
      }
      actionValidator.actionValid({
        action: action,
        appendKey: "actions[1]"
      });
    }).not.toThrow();
  });

  test('アクション全体のバリデーションテスト FUCUS', async () => {
    expect(() => {
      const action = {
        type: "FOCUS",
        typeName: "フォーカス",
        name: "フォーカス",
        selector: "input[type='submit']"
      }
      actionValidator.actionValid({
        action: action,
        appendKey: "actions[1]"
      });
    }).not.toThrow();
  });

  test('アクション全体のバリデーションテスト INPUT', async () => {
    expect(() => {
      const action = {
        type: "INPUT",
        typeName: "入力",
        name: "ユーザ情報入力",
        selector: "#userId",
        value: "user"
      }
      actionValidator.actionValid({
        action: action,
        appendKey: "actions[1]"
      });
    }).not.toThrow();
  });

  test('アクション全体のバリデーションテスト SCROLL', async () => {
    expect(() => {
      const action = {
        type: "SCROLL",
        typeName: "スクロール",
        name: "画面下にスクロール",
        distance: {
          xPixel: 0,
          yPixel: 300
        }
      }
      actionValidator.actionValid({
        action: action,
        appendKey: "actions[1]"
      });
    }).not.toThrow();
  });

});

describe('Pageのバリデーション処理 異常系のテスト群', () => {
  test('アクションタイプのバリデーションテスト 空', async () => {
    expect(() => {
      actionValidator.actionTypeValid({
        value: ""
      });
    }).toThrow();
  });

  test('アクションタイプのバリデーションテスト 数値', async () => {
    expect(() => {
      actionValidator.actionTypeValid({
        value: 1000
      });
    }).toThrow();
  });

  test('アクションタイプ名のバリデーションテスト 空', async () => {
    expect(() => {
      actionValidator.actionTypeNameValid({
        value: ""
      });
    }).toThrow();
  });

  test('アクションタイプ名のバリデーションテスト 数値', async () => {
    expect(() => {
      actionValidator.actionTypeNameValid({
        value: 1000
      });
    }).toThrow();
  });

  test('アクション名のバリデーションテスト 文字超過(31)', async () => {
    expect(() => {
      actionValidator.actionNameValid({
        value: "1234512345123451234512345123451"
      });
    }).toThrow();
  });

  test('URLのバリデーションテスト 空', async () => {
    expect(() => {
      actionValidator.gotoUrlValid({
        value: ""
      });
    }).toThrow();
  });

  test('URLのバリデーションテスト 非URL形式', async () => {
    expect(() => {
      actionValidator.gotoUrlValid({
        value: "localhost:3000"
      });
    }).toThrow();
  });

  test('ミリ秒のバリデーションテスト 空', async () => {
    expect(() => {
      actionValidator.waitMillisecondValid({
        value: ""
      });
    }).toThrow();
  });

  test('ミリ秒のバリデーションテスト 文字', async () => {
    expect(() => {
      actionValidator.waitMillisecondValid({
        value: "1000"
      });
    }).toThrow();
  });
});