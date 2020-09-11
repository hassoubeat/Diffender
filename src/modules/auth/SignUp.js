import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signUp } from 'lib/auth/cognitoAuth';
import UtilInput from 'modules/util/input/Input';
import styles from './SignUp.module.scss';

export default function SignUp(props = null) {
  // propsの展開
  const successCallback = props.successCallback;
  const errorCallback = props.errorCallback;

  // Stateの定義
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");

  return (
    <React.Fragment>
      <div className={styles.signUp}>
        <div className={styles.formArea}>
          <div className={styles.title}>
            アカウント作成
          </div>
          <UtilInput 
            label="ユーザID(メールアドレス)" 
            placeholder="user@example.com" 
            type="text" 
            value={userId} 
            onChangeFunc={(e) => {setUserId(e.target.value)} } 
            inputClass={styles.test} 
            errorMessages={["test"]}
          />
          <div className={styles.inputItem}>
            <div className={styles.inputLabel}>
              ユーザID(メールアドレス)
            </div>
            <input className={styles.inputText} type="text" placeholder="user@example.com" onChange={ (e) => setUserId(e.target.value) } value={userId}  /> 
          </div>
          <div className={styles.inputItem}>
            <div className={styles.inputLabel}>
              パスワード
            </div>
            <input className={styles.inputText} type="password" onChange={ (e) => setPassword(e.target.value) } value={password} />
          </div>
          <div className={styles.inputItem}>
            <div className={styles.inputLabel}>
              パスワード(再入力)
            </div>
            <input className={styles.inputText} type="password" onChange={ (e) => setConfirmPassword(e.target.value) } value={confirmPassword} />
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
          <div className={styles.actions}>
            <div className={styles.action}>
              <Link to={'/signIn'}>
                サインイン画面に戻る
              </Link>
            </div>
            <div className={styles.action}>
              <Link to={'/code'}>
                認証コードの入力
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}