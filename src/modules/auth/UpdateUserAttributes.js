import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCurrentUser, 
  setCurrentUser
} from 'app/userSlice';
import {
  handleChangeUserParams,
  isErrorsCheck
} from './AuthEvent';
import { 
  getCurrentUser, 
  updateUserAttributes 
} from 'lib/auth/cognitoAuth';
import UtilInput from 'modules/util/input/Input';
import * as toast from 'lib/util/toast';
import styles from './UpdateUserAttributes.module.scss';

export default function UpdateUserAttributes(props = null) {
  const dispatch = useDispatch();

  // Redux-Stateの取得
  const loginUser = useSelector(selectCurrentUser);

  // Stateの定義
  const [user, setUser] = useState({
    nickname: loginUser.nickname || ""
  });
  const [errors, setErrors] = useState({
    nickname: []
  });

  // パスワード変更ボタン押下時のイベント
  const handleUpdateUserAttributes = async () => {
    try {
      let currentUser = await getCurrentUser();
      await updateUserAttributes(
        currentUser,
        user
      );
      toast.successToast({
        message: 'ユーザ属性の変更が完了しました',
      });

      // 現在のユーザ(Redux-State)の更新
      currentUser = await getCurrentUser();
      dispatch(setCurrentUser({...currentUser.getSignInUserSession().getIdToken().payload}));
    } catch(error) {
      let message = "ユーザ属性の変更に失敗しました"
      
      toast.errorToast({
        message: message
      });
    }
  }

  return (
    <React.Fragment>
      <div className={styles.resetPassword}>
        <div className={styles.formArea}>
          <UtilInput 
            label="ユーザ名" 
            type="text" 
            name="nickname" 
            value={ user.nickname } 
            onChangeFunc={(e) => { 
              handleChangeUserParams(e, user, setUser, errors, setErrors) 
            } } 
            errorMessages={ errors.nickname }
          />
          <div className={styles.actions}>
            <button className={styles.inputButton} disabled={!isErrorsCheck(errors)} onClick={ async() => { handleUpdateUserAttributes() }
            }>ユーザ属性の変更</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

