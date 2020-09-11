import v8n from "v8n";

const USER_ID = "userId";
const PASSWORD = "password";
const CONFIRM_PASSWORD = "confirmPassword";
const NICKNAME = "nickname";

// userIdのバリデーション処理
export function userIdValid(userId, validErrorMessage) {
  try {
    v8n()
      .not.null()
      .not.empty()
      .string()
      .minLength(5)
      .pattern(/[^\s@]+@[^\s@]+\.[^\s@]+/)
      .check(userId);
  } catch (error) {
    // エラーメッセージのセット
    error.message = validErrorMessage || "正しいユーザID(メールアドレス)の形式ではありません";
    throw error;
  }
}

// パスワードのバリデーション処理
export function passwordValid(password, validErrorMessage) {
  try {
    v8n()
      .not.null()
      .not.empty()
      .minLength(8)
      .pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/)
      .check(password);
  } catch (error) {
    // エラーメッセージのセット
    error.message = validErrorMessage || "大文字、小文字、数字を含んだ8文字以上のパスワードを設定してください";
    throw error;
  }
}

// パスワード(確認)のバリデーション処理
export function confirmPasswordValid(password, confirmPassword, validErrorMessage) {
  try {
    v8n()
      .equal(password)	
      .check(confirmPassword);
  } catch (error) {
    // エラーメッセージのセット
    error.message = validErrorMessage || "確認用パスワードが誤っています";
    throw error;
  }
}

// ユーザ名のバリデーション処理
export function nicknameValid(nickname, validErrorMessage) {
  try {
    v8n()
      .not.null()
      .not.empty()
      .maxLength(10)
      .check(nickname);
  } catch (error) {
    // エラーメッセージのセット
    error.message = validErrorMessage || "ユーザ名は10文字以内で入力してください";
    throw error;
  }
}

// バリデーションタイプを選択
export function valid(validationType, user) {
  switch(validationType) {
    case USER_ID:
      return userIdValid(user.userId);
    case PASSWORD:
      return passwordValid(user.password);
    case CONFIRM_PASSWORD:
      return confirmPasswordValid(user.password, user.confirmPassword);
    case NICKNAME:
      return nicknameValid(user.nickname);
    default:
      throw new Error("該当するバリデーションが存在しません");
  }
}