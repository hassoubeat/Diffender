import React from 'react';
import { useForm } from "react-hook-form";

import { changePassword } from 'lib/auth/model';
import UtilInput from 'components/util/input/Input';
import * as toast from 'lib/util/toast';
import styles from './ChangePassword.module.scss';

export default function ChangePassword(props = null) {
  // ReactHookForm setup
  const {register, errors, reset, handleSubmit} = useForm({
    mode: 'onChange',
    defaultValues: {
      oldPassword: "",
      newPassword: ""
    }
  });

  // パスワード変更ボタン押下時のイベント
  const onSubmit = async (inputPassword) => {
    await changePassword(inputPassword);
    reset();
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
      <div className={styles.changePassword}>
        <div className={styles.formArea}>
          <UtilInput 
            label="現在のパスワード" 
            type="password" 
            name="oldPassword" 
            errorMessages={ (errors.oldPassword) && [errors.oldPassword.message] } 
            inputRef={ register({
              required: "必須です",
              pattern: {
                value: new RegExp("^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\\d)[a-zA-Z\\d]{8,100}$"),
                message: '大文字、小文字、数字を含んだ8文字以上のパスワードを設定してください'
              }
            })}
          />
          <UtilInput 
            label="新しいパスワード" 
            type="password" 
            name="newPassword" 
            errorMessages={ (errors.newPassword) && [errors.newPassword.message] } 
            inputRef={ register({
              required: "必須です",
              pattern: {
                value: new RegExp("^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\\d)[a-zA-Z\\d]{8,100}$"),
                message: '大文字、小文字、数字を含んだ8文字以上のパスワードを設定してください'
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

