import React, { useState } from 'react';
import { signIn } from 'lib/auth/cognitoAuth'
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { 
  setIsLogin, 
  setCurrentUser
} from 'app/userSlice';
import * as toast from 'lib/util/toast';
import styles from './SignIn.module.scss';

export default function SignIn(props = null) {
  const dispatch = useDispatch();
  const history = useHistory();

  // Stateの定義
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");


  // サインイン成功時の処理
  const signInSuccessCallback = (loginUser) => {
    // ReduxStateにログインしたユーザ情報をセット
    dispatch(setCurrentUser({...loginUser.attributes}));
    dispatch(setIsLogin(true));

    toast.successToast({
      message: 'サインインしました',
    });
    history.push(`/`);
  };

  // サインイン失敗時の処理
  const signInErrorCallback = (error) => {
    let message = "サインインに失敗しました"
    if(error.code === "UserNotFoundException") message = "ユーザが存在しません"
    if(error.code === "NotAuthorizedException") message = "ユーザIDもしくはパスワードが誤っています"
    if(error.code === "InvalidParameterException") message = "ユーザIDもしくはパスワードが誤っています"
    toast.errorToast({
      message: message
    });
  }

  return (
    <React.Fragment>
      <div className={styles.signIn}>
        <div className={styles.formArea}>
          <div className={styles.title}>
            {process.env.REACT_APP_PROJECT_NAME}
          </div>
          <div className={styles.inputItem}>
            <div className={styles.inputLabel}>
              ユーザID(メールアドレス)
            </div>
            <input className={styles.inputText} type="text" placeholder="user@example.com"
              onChange={ (e) => setUserId(e.target.value) } value={userId} /> 
          </div>
          <div className={styles.inputItem}>
            <div className={styles.inputLabel}>
              パスワード
            </div>
            <input className={styles.inputText} type="password" onChange={ (e) => setPassword(e.target.value) } value={password} />
          </div>
          <button className={styles.inputButton} onClick={ async () => { 
            signIn(userId, password, signInSuccessCallback, signInErrorCallback)
          }}>サインイン</button>
          <div className={styles.actions}>
            <div className={styles.action}>
              <Link to={'/signUp'}>
                新しいアカウントを作成
              </Link>
            </div>
            <div className={styles.action}>
              <Link to={'/passwordRemind'}>
                パスワードを忘れた場合
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

