import React, { useState, useEffect } from 'react';
import izitoast from "izitoast";
import { confirmSignUp, resendSignUp } from 'lib/auth/cognitoAuth';
import styles from './ConfirmCode.module.scss';

export default function Code(props = null) {
  // propsの展開
  const queryString = props.queryString;
  const successCallback = props.successCallback;
  const errorCallback = props.errorCallback;

  // Stateの定義
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");


  useEffect( () => {
    // クエリパラメータにuserIdがセットされていた場合はセットする
    if (queryString.userId) setUserId(queryString.userId);
  }, [queryString]);

  return (
    <React.Fragment>
      <div className={styles.code}>
        <h4>Code</h4>
        メールに届いた認証コードを入力してください。
        <div className={styles.inputItem}>
          <div className={styles.inputLabel}>
            ユーザID(メールアドレス)
          </div>
          <input className={styles.inputText} type="text" onChange={ (e) => setUserId(e.target.value) } value={userId} /> 
        </div>
        <div className={styles.inputItem}>
          <div className={styles.inputLabel}>
            認証コード
          </div>
          <input className={styles.inputText} type="text" onChange={ (e) => setCode(e.target.value) } value={code} /> 
        </div>
        <button className={styles.inputButton} onClick={ async () => { 
          await confirmSignUp(userId, code, successCallback, errorCallback)
        }}>認証コード検証</button>
        <button className={styles.inputButton} onClick={ async () => { 
          resendSignUp(
            userId,
            () => {
              izitoast.success({
                message: '認証コードを再発行しました',
              });
            },
            () => {
              izitoast.error({
                message: '認証コードの再発行に失敗しました',
              });
            }
            )
        }}>認証コード再発行</button>
      </div>
    </React.Fragment>
  )
}

