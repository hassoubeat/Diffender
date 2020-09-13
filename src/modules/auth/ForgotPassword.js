import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { forgotPassword } from 'lib/auth/cognitoAuth';
import UtilInput from 'modules/util/input/Input';
import {
  handleChangeUserParams,
  isErrorsCheck
} from './AuthEvent';
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
            onChangeFunc={(e) => { 
              handleChangeUserParams(e, user, setUser, errors, setErrors) 
            } } 
            errorMessages={ errors.userId }
          />
          <button className={styles.inputButton}　disabled={!isErrorsCheck(errors)} onClick={ async () => { handleforgotPassword() }
          }>確認コード送信</button>
          <div className={styles.subMenu}>
            <div className={styles.item}>
              <Link to={'/signIn'}>
                サインイン画面に戻る
              </Link>
            </div>
            <div className={styles.item}>
              <Link to={'/resetPassword'}>
                パスワードを再設定する
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}