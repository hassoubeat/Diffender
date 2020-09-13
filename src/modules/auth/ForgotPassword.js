import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { forgotPassword } from 'lib/auth/cognitoAuth';
import UtilInput from 'modules/util/input/Input';
import * as userValid from 'lib/validation/userValidation';
import * as toast from 'lib/util/toast';
import styles from './ForgotPassword.module.scss';

export default function ForgotPassword(props = null) {
  const history = useHistory();

  // Stateの定義
  const [user, setUser] = useState({
    userId: "",
  });
  const [errors, setErrors] = useState({
    userId: [],
  });

  // 入力フォームの値変更時のイベント
  const handleChange = (event) => {
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

  // パスワードリマインド処理の実施有無
  const isforgotPassword = () => {
    // エラーが存在する場合にTrue
    let isErrors = false;
    Object.values(errors).forEach( errorMessages => {
      if (errorMessages.length > 0) isErrors = true;
    });

    return !isErrors;
  }

  // パスワードリマインドボタン押下時のイベント
  const handleforgotPassword = async () => {
    try {
      await forgotPassword(
        user.userId,
      );
      toast.successToast({
        message: '入力したメールアドレス宛にパスワード再設定用のコードを送信しました',
      });
      history.push(`/resetPassword?userId=${user.userId}`);
    } catch(error) {
      let message = "パスワードリマインドに失敗しました";
      if(error.code === "UserNotFoundException") message = "ユーザが存在しません<br/>サインアップを行ってください";
      toast.errorToast({
        message: message
      });
    }
  }

  return (
    <React.Fragment>
      <div className={styles.forgotPassword}>
        <div className={styles.formArea}>
          <div className={styles.title}>
            パスワードリマインド
          </div>
          <UtilInput 
            label="ユーザID(メールアドレス)" 
            placeholder="user@example.com" 
            type="text" 
            name="userId" 
            value={ user.userId } 
            onChangeFunc={(e) => {handleChange(e)} } 
            errorMessages={ errors.userId }
          />
          <button className={styles.inputButton}　disabled={!isforgotPassword()} onClick={ async () => { handleforgotPassword() }
          }>確認コード送信</button>
          <div className={styles.subMenu}>
            <div className={styles.item}>
              <Link to={'/signIn'}>
                サインイン画面に戻る
              </Link>
            </div>
            <div className={styles.item}>
              <Link to={'/resetPassword'}>
                パスワード再設定
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}