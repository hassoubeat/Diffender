import React, { useState } from 'react';
import {
  handleChangeUserParams,
  isErrorsCheck
} from './AuthEvent';
import { 
  getCurrentUser, 
  changePassword 
} from 'lib/auth/cognitoAuth';
import UtilInput from 'components/util/input/Input';
import * as toast from 'lib/util/toast';
import styles from './ChangePassword.module.scss';

export default function ChangePassword(props = null) {
  // Stateの定義
  const [user, setUser] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({
    oldPassword: [],
    newPassword: []
  });

  // パスワード変更ボタン押下時のイベント
  const handleChangePassword = async () => {
    try {
      const currentUser = await getCurrentUser();
      await changePassword(
        currentUser,
        user.oldPassword,
        user.newPassword
      );
      toast.successToast({
        message: 'パスワードの変更が完了しました',
      });
      // 入力値のクリア
      user.oldPassword = "";
      user.newPassword = "";
      setUser(Object.assign({}, user));
    } catch(error) {
      let message = "パスワードの変更に失敗しました"
      if(error.code === "NotAuthorizedException") message = "現在のパスワードが誤っています";
      
      toast.errorToast({
        message: message
      });
    }
  }

  return (
    <React.Fragment>
      <div className={styles.changePassword}>
        <div className={styles.formArea}>
          <UtilInput 
            label="現在のパスワード" 
            type="password" 
            name="oldPassword" 
            value={ user.oldPassword } 
            onChangeFunc={(e) => { 
              handleChangeUserParams(e, user, setUser, errors, setErrors) 
            } } 
            errorMessages={ errors.oldPassword }
          />
          <UtilInput 
            label="新しいパスワード" 
            type="password" 
            name="newPassword" 
            value={ user.newPassword } 
            onChangeFunc={(e) => { 
              handleChangeUserParams(e, user, setUser, errors, setErrors) 
            } } 
            errorMessages={ errors.newPassword }
          />
          <div className={styles.actions}>
            <button className={styles.inputButton} disabled={!isErrorsCheck(errors)} onClick={ async() => { handleChangePassword() }
            }>パスワードの変更</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

