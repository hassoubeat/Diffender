import React, { useState } from 'react';
import { signIn } from 'lib/auth/cognitoAuth';
import * as api from 'lib/api/api';
import UtilInput from 'components/util/input/Input';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { 
  setIsUserInitializeComplete
} from 'app/userSlice';
import * as toast from 'lib/util/toast';
import { PROJECT_NAME } from 'lib/util/const'
import styles from './SignIn.module.scss';

export default function SignIn(props = null) {
  const dispatch = useDispatch();
  const history = useHistory();

  // Stateの定義
  const [user, setUser] = useState({
    userId: "",
    password: ""
  });

  // サインインボタン押下時のイベント
  const handleSignIn = async () => {
    try {
      await signIn(
        user.userId,
        user.password
      );

      // ユーザオプションが存在しなかったら新規作成
      try {
        await api.getUserOption();
      } catch (error) {
        if (error.response.status === 404) await api.postUserOption();
      }
      
      // ReduxStateのユーザ情報の初期化を再実施
      dispatch(setIsUserInitializeComplete(false));

      toast.successToast({
        message: 'サインインしました',
      });
      history.push(`/`);
    } catch(error) {
      let message = "サインインに失敗しました"
      if(error.code === "UserNotFoundException") message = "ユーザが存在しません"
      if(error.code === "NotAuthorizedException") message = "ユーザIDもしくはパスワードが誤っています"
      if(error.code === "InvalidParameterException") message = "ユーザIDもしくはパスワードが誤っています"
      toast.errorToast({
        message: message
      });
    }
  }

  return (
    <React.Fragment>
      <div className={styles.signIn}>
        <div className={styles.formArea}>
          <div className={styles.title}>
            {PROJECT_NAME}
          </div>
          <UtilInput 
            label="ユーザID(メールアドレス)" 
            placeholder="user@example.com" 
            type="text" 
            name="userId" 
            value={ user.userId } 
            onChangeFunc={(e) => {
              user.userId = e.target.value
              setUser(Object.assign({}, user));
            } } 
          />
          <UtilInput 
            label="パスワード" 
            type="password" 
            name="password" 
            value={ user.password } 
            onChangeFunc={(e) => {
              user.password = e.target.value
              setUser(Object.assign({}, user));
            } } 
          />
          <button className={styles.inputButton} onClick={ async () => { 
            handleSignIn()
          }}>サインイン</button>
          <div className={styles.actions}>
            <div className={styles.action}>
              <Link to={'/signUp'}>
                新しいアカウントを作成
              </Link>
            </div>
            <div className={styles.action}>
              <Link to={'/forgotPassword'}>
                パスワードを忘れた場合
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

