import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";

import { 
  selectCurrentUser, 
  setCurrentUser
} from 'app/userSlice';

import { updateUserAttributes } from 'lib/auth/model';
import * as toast from 'lib/util/toast';
import UtilInput from 'components/util/input/Input';
import styles from './UpdateUserAttributes.module.scss';

export default function UpdateUserAttributes(props = null) {
  const dispatch = useDispatch();

  // Redux-Stateの取得
  const loginUser = useSelector(selectCurrentUser);

  // ReactHookForm setup
  const {register, errors, reset, handleSubmit} = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname: ""
    }
  });

  useEffect( () => {
    reset(loginUser);
  }, [reset, loginUser]);

  // パスワード変更ボタン押下時のイベント
  const onSubmit = async (inputUserAttributes) => {
    const updateUser = await updateUserAttributes(inputUserAttributes);
    dispatch(setCurrentUser(updateUser.getSignInUserSession().getIdToken().payload));
  }

  // 入力エラー時
  const onSubmitError = (error) => {
    console.table(error);
    console.log(error)
    toast.errorToast(
      { message: "入力エラーが存在します" }
    )
  }

  return (
    <React.Fragment>
      <div className={styles.updateUserAttributes}>
        <div className={styles.formArea}>
          <UtilInput 
            label="ユーザ名" 
            type="text" 
            name="nickname" 
            errorMessages={ (errors.nickname) && [errors.nickname.message] } 
            inputRef={ register({
              required: "ユーザ名は必須です",
              maxLength : {
                value: 10,
                message: '最大10文字で入力してください'
              }
            })}
          />
          <div className={styles.actionArea}>
            <span className={styles.submit} onClick={ handleSubmit(onSubmit, onSubmitError) }>
              変更
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

