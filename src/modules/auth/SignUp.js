import React, { useState } from 'react';
import { signUp } from 'lib/auth/cognitoAuth';
import styles from './SignUp.module.scss';

export default function SignUp(props = null) {
  // propsの展開
  const successCallback = props.successCallback;
  const errorCallback = props.errorCallback;

  // Stateの定義
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  return (
    <React.Fragment>
      <div className={styles.signUp}>
        <h4>SignUp</h4>
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
        <div className={styles.inputItem}>
          <div className={styles.inputLabel}>
            ユーザ名
          </div>
          <input className={styles.inputText} type="text" onChange={ (e) => setNickname(e.target.value) } value={nickname} />
        </div>
        <button className={styles.inputButton} onClick={ async () => { 
          signUp(userId, password, { nickname:nickname } , successCallback, errorCallback)
        }}>サインアップ</button>
      </div>
    </React.Fragment>
  );
}