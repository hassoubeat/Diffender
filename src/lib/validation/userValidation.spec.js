const userValid = require("./userValidation");

describe('Userのバリデーション処理 正常系のテスト群', () => {

  test('ユーザIDのバリデーションテスト', async () => {
    userValid.userIdValid("test@example.com");
  });

  test('パスワードのバリデーションテスト', async () => {
    userValid.passwordValid("TestTest0");
  });

  test('パスワード(確認)のバリデーションテスト', async () => {
    userValid.confirmPasswordValid("TestTest0", "TestTest0");
  });

  test('ユーザ名のバリデーションテスト', async () => {
    userValid.nicknameValid("user");
  });

  test('認証コードのバリデーションテスト', async () => {
    userValid.confirmCodeValid("123456");
  });
});

describe('Userのバリデーション処理 異常系のテスト群', () => {
  test('ユーザIDのバリデーションテスト メールの形式じゃない場合', async () => {
    let errorMessage = "";
    try {
      userValid.userIdValid("test.example.com");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("正しいユーザID(メールアドレス)の形式ではありません");
  });

  test('ユーザIDのバリデーションテスト 空文字', async () => {
    let errorMessage = "";
    try {
      userValid.userIdValid("");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("正しいユーザID(メールアドレス)の形式ではありません");
  });

  test('ユーザIDのバリデーションテスト エラーメッセージカスタマイズ', async () => {
    let errorMessage = "";
    try {
      userValid.userIdValid("test.example.com", "エラーだよ");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("エラーだよ");
  });

  test('パスワードのバリデーションテスト 大文字が含まれていない場合', async () => {
    let errorMessage = "";
    try {
      userValid.passwordValid("testtest0");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("大文字、小文字、数字を含んだ8文字以上のパスワードを設定してください");
  });

  test('パスワードのバリデーションテスト 小文字が含まれていない場合', async () => {
    let errorMessage = "";
    try {
      userValid.passwordValid("TESTTEST0");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("大文字、小文字、数字を含んだ8文字以上のパスワードを設定してください");
  });

  test('パスワードのバリデーションテスト 数字が含まれていない場合', async () => {
    let errorMessage = "";
    try {
      userValid.passwordValid("TestTest");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("大文字、小文字、数字を含んだ8文字以上のパスワードを設定してください");
  });

  test('パスワードのバリデーションテスト 文字数が足りない場合', async () => {
    let errorMessage = "";
    try {
      userValid.passwordValid("Test0");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("大文字、小文字、数字を含んだ8文字以上のパスワードを設定してください");
  });

  test('パスワードのバリデーションテスト 空文字', async () => {
    let errorMessage = "";
    try {
      userValid.passwordValid("");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("大文字、小文字、数字を含んだ8文字以上のパスワードを設定してください");
  });

  test('パスワードのバリデーションテスト エラーメッセージカスタマイズ', async () => {
    let errorMessage = "";
    try {
      userValid.passwordValid("Test0", "エラーだよ");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("エラーだよ");
  });

  test('パスワード(確認)のバリデーションテスト パスワードと一致しない場合', async () => {
    let errorMessage = "";
    try {
      userValid.confirmPasswordValid("TestTest0", "TestTest1");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("確認用パスワードが誤っています");
  });

  test('パスワード(確認)のバリデーションテスト エラーメッセージカスタマイズ', async () => {
    let errorMessage = "";
    try {
      userValid.confirmPasswordValid("TestTest0", "TestTest1", "エラーだよ");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("エラーだよ");
  });

  test('ユーザ名のバリデーションテスト 文字数超過(11文字)', async () => {
    let errorMessage = "";
    try {
      userValid.nicknameValid("usernameuse");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("ユーザ名は10文字以内で入力してください");
  });

  test('ユーザ名のバリデーションテスト 空文字', async () => {
    let errorMessage = "";
    try {
      userValid.nicknameValid("");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("ユーザ名は10文字以内で入力してください");
  });

  test('ユーザ名のバリデーションテスト エラーメッセージカスタマイズ', async () => {
    let errorMessage = "";
    try {
      userValid.nicknameValid("", "エラーだよ");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("エラーだよ");
  });

  test('認証コードのバリデーションテスト 数値エラー', async () => {
    let errorMessage = "";
    try {
      userValid.confirmCodeValid("12345a");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("認証コードは数値6桁で入力してください");
  });

  test('認証コードのバリデーションテスト 文字数エラー(5文字)', async () => {
    let errorMessage = "";
    try {
      userValid.confirmCodeValid("12345");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("認証コードは数値6桁で入力してください");
  });

  test('認証コードのバリデーションテスト 文字数エラー(7文字)', async () => {
    let errorMessage = "";
    try {
      userValid.confirmCodeValid("1234567");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("認証コードは数値6桁で入力してください");
  });

  test('認証コードのバリデーションテスト エラーメッセージカスタマイズ', async () => {
    let errorMessage = "";
    try {
      userValid.confirmCodeValid("", "エラーだよ");
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toBe("エラーだよ");
  });
});
