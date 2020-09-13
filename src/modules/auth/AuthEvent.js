import * as userValid from 'lib/validation/userValidation';

// User関連の値変更時の汎用イベント
export function handleChangeUserParams (event, user, setUser, errors, setErrors) {
  const inputType = event.target.name;
  const value = event.target.value;
  
  // エラーメッセージを初期化
  errors[inputType] = [];
  setErrors(Object.assign({}, errors));

  // 入力値のセット
  user[inputType] = value;
  setUser(Object.assign({}, user));

  // バリデーション
  try {
    userValid.valid(inputType, user);
  } catch (error) {
    errors[inputType].push(error.message);
    setErrors(Object.assign({}, errors));
  }
}

// エラーメッセージのチェック
export function isErrorsCheck (errors) {
  // エラーが存在する場合にTrue
  let isErrors = false;
  Object.values(errors).forEach( errorMessages => {
    if (errorMessages.length > 0) isErrors = true;
  });
  return !isErrors;
}