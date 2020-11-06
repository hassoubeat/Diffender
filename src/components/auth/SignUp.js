import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signUp } from 'lib/auth/cognitoAuth';
import UtilInput from 'components/util/input/Input';
import Loading from 'components/common/Loading';

import {
  handleChangeUserParams,
  isErrorsCheck
} from './AuthEvent';
import * as toast from 'lib/util/toast';
import styles from './SignUp.module.scss';

// サインアップボタン押下時のイベント
export default function SignUp(props = null) {
  const history = useHistory();

  // state setup
  const [user, setUser] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    nickname: ""
  });
  const [errors, setErrors] = useState({
    userId: [],
    password: [],
    confirmPassword: [],
    nickname: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // サインアップボタン押下時のイベント
  const handleSignUp = async () => {
    try {
      setIsSubmitting(true);
      const result = await signUp(
        user.userId,
        user.password,
        { 
          nickname: user.nickname
        }
      );
      toast.successToast({
        message: '入力したメールアドレス宛に確認コードを送信しました',
      });
      history.push(`/code?userId=${result.user.username}`);
    } catch(error) {
      let message = "サインアップに失敗しました"
      if(error.code === "UsernameExistsException") message = "既にサインアップ済みのユーザです";
      if(error.code === "InvalidPasswordException") message = "パスワードのフォーマットが正しくありません";
      toast.errorToast({
        message: message
      });
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.signUp} onSubmit={ (e) => { 
      handleSignUp()   
      e.preventDefault()
    }}>
      <input type="submit" className="hidden" />
        <div className={styles.formArea}>
          <div className={styles.title}>
            アカウント作成
          </div>
          <UtilInput 
            label="ユーザID(メールアドレス)" 
            placeholder="user@example.com" 
            type="text" 
            name="userId" 
            value={ user.userId } 
            onChangeFunc={(e) => { 
              handleChangeUserParams(e, user, setUser, errors, setErrors) 
            } } 
            errorMessages={ errors.userId }
          />
          <UtilInput 
            label="パスワード" 
            type="password" 
            name="password" 
            value={ user.password } 
            onChangeFunc={(e) => { 
              handleChangeUserParams(e, user, setUser, errors, setErrors) 
            } } 
            errorMessages={ errors.password }
          />
          <UtilInput 
            label="パスワード(確認)" 
            type="password" 
            name="confirmPassword" 
            value={ user.confirmPassword } 
            onChangeFunc={(e) => { 
              handleChangeUserParams(e, user, setUser, errors, setErrors) 
            } } 
            errorMessages={ errors.confirmPassword }
          />
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
          { (isSubmitting) ?
            <Loading/> 
            :
            <button 
              className={styles.inputButton} 
              disabled={!isErrorsCheck(errors)} 
              onClick={ async () => { handleSignUp() }
            }>
              サインアップ
            </button>
          }
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
    </form>
  );
}