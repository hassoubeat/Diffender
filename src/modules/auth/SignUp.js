import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signUp } from 'lib/auth/cognitoAuth';
import UtilInput from 'modules/util/input/Input';
import * as userValid from 'lib/validation/userValidation';
import * as toast from 'lib/util/toast';
import styles from './SignUp.module.scss';

export default function SignUp(props = null) {
  const history = useHistory();

  // Stateの定義
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

  // 入力フォームの値変更時のイベント
  const handleChange = (event) => {
    const inputType = event.target.name;
    const value = event.target.value;
    
    // エラーメッセージを初期化
    errors[inputType] = [];
    setErrors(Object.assign({}, errors));

    // 入力値のセット
    user[inputType] = value;
    setUser(Object.assign({}, user));

    // バリデーション
    try {
      userValid.valid(inputType, user);
    } catch (error) {
      errors[inputType].push(error.message);
      setErrors(Object.assign({}, errors));
    }
  }

  // サインアップ処理の実施有無
  const isSignUp = () => {
    // エラーが存在する場合にTrue
    let isErrors = false;
    Object.values(errors).forEach( errorMessages => {
      if (errorMessages.length > 0) isErrors = true;
    });

    return !isErrors;
  }

  // サインアップボタン押下時のイベント
  const handleSignUp = async () => {

    try {
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
    }
  }

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
            name="userId" 
            value={ user.userId } 
            onChangeFunc={(e) => {handleChange(e)} } 
            errorMessages={ errors.userId }
          />
          <UtilInput 
            label="パスワード" 
            type="password" 
            name="password" 
            value={ user.password } 
            onChangeFunc={(e) => {handleChange(e)} } 
            errorMessages={ errors.password }
          />
          <UtilInput 
            label="パスワード(確認)" 
            type="password" 
            name="confirmPassword" 
            value={ user.confirmPassword } 
            onChangeFunc={(e) => {handleChange(e)} } 
            errorMessages={ errors.confirmPassword }
          />
          <UtilInput 
            label="ユーザ名" 
            type="text" 
            name="nickname" 
            value={ user.nickname } 
            onChangeFunc={(e) => {handleChange(e)} } 
            errorMessages={ errors.nickname }
          />
          <button className={styles.inputButton} disabled={!isSignUp()} onClick={ async () => { handleSignUp() }
          }>サインアップ</button>
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