import React, { useState } from 'react';
import { signIn } from 'lib/auth/cognitoAuth'
import styles from './SignIn.module.scss';

export default function SignIn(props = null) {
  // propsの展開
  const successCallback = props.successCallback;
  const errorCallback = props.errorCallback;

  // Stateの定義
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <React.Fragment>
      <div className={styles.signIn}>
        <h4>SignIn</h4>
        <div className={styles.inputItem}>
          <div className={styles.inputLabel}>
            ユーザID(メールアドレス)
          </div>
          <input className={styles.inputText} type="text" onChange={ (e) => setUserId(e.target.value) } value={userId} /> 
        </div>
        <div className={styles.inputItem}>
          <div className={styles.inputLabel}>
            パスワード
          </div>
          <input className={styles.inputText} type="password" onChange={ (e) => setPassword(e.target.value) } value={password} />
        </div>
        <button className={styles.inputButton} onClick={ async () => { 
          signIn(userId, password, successCallback, errorCallback)
        }}>サインイン</button>
      </div>
    </React.Fragment>
  );
}