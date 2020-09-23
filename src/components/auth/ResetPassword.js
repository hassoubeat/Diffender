import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UtilInput from 'components/util/input/Input';
import { forgotPasswordSubmit } from 'lib/auth/cognitoAuth';
import {
  handleChangeUserParams,
  isErrorsCheck
} from './AuthEvent';
import * as toast from 'lib/util/toast';
import styles from './ResetPassword.module.scss';

export default function ResetPassword(props = null) {
  // propsの展開
  const queryString = props.queryString;

  // Stateの定義
  const [user, setUser] = useState({
    userId: queryString.userId || "",
    confirmCode: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    userId: [],
    confirmCode: [],
    password: []
  });

  const history = useHistory();

  // パスワードリセットボタン押下時のイベント
  const handleResetPassword = async () => {
    try {
      await forgotPasswordSubmit(
        user.userId,
        user.confirmCode,
        user.password
      );
      toast.successToast({
        message: 'パスワードの再設定が完了しました',
      });
      history.push(`/signIn`);
    } catch(error) {
      let message = "パスワードの再設定に失敗しました"
      if(error.code === "UserNotFoundException") message = "ユーザが存在しません<br/>サインアップを行ってください";
      if(error.code === "CodeMismatchException") message = "認証コードが誤っています";
      if(error.code === "ExpiredCodeException") message = "認証コードの有効期限が切れています<br/>再度発行してください";
      
      toast.errorToast({
        message: message
      });
    }
  }

  return (
    <React.Fragment>
      <div className={styles.resetPassword}>
        <div className={styles.formArea}>
          <div className={styles.title}>
            パスワード再設定
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
          <UtilInput 
            label="新しいパスワード" 
            type="password" 
            name="password" 
            value={ user.password } 
            onChangeFunc={(e) => { 
              handleChangeUserParams(e, user, setUser, errors, setErrors) 
            } } 
            errorMessages={ errors.password }
          />
          <UtilInput 
            label="認証コード" 
            placeholder="012345" 
            type="text" 
            name="confirmCode" 
            value={ user.confirmCode } 
            onChangeFunc={(e) => { 
              handleChangeUserParams(e, user, setUser, errors, setErrors) 
            } } 
            errorMessages={ errors.confirmCode }
          />
          <div className={styles.actions}>
            <button className={styles.inputButton} disabled={!isErrorsCheck(errors)} onClick={ async() => { handleResetPassword() }
            }>パスワードの再設定</button>
          </div>
          <div className={styles.subMenu}>
            <div className={styles.item}>
              <Link to={'/signIn'}>
                サインイン画面に戻る
              </Link>
            </div>
            <div className={styles.item}>
              <Link to={'/forgotPassword'}>
                認証コード発行画面に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

