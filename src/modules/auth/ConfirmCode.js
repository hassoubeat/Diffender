import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UtilInput from 'modules/util/input/Input';
import { confirmSignUp, resendSignUp } from 'lib/auth/cognitoAuth';
import * as userValid from 'lib/validation/userValidation';
import * as toast from 'lib/util/toast';
import styles from './ConfirmCode.module.scss';

export default function ConfirmCode(props = null) {
  // propsの展開
  const queryString = props.queryString;

  // Stateの定義
  const [user, setUser] = useState({
    userId: queryString.userId || "",
    confirmCode: ""
  });
  const [errors, setErrors] = useState({
    userId: [],
    confirmCode: []
  });

  const history = useHistory();

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
  const isVerifiyConfirmCode = () => {
    // エラーが存在する場合にTrue
    let isErrors = false;
    Object.values(errors).forEach( errorMessages => {
      if (errorMessages.length > 0) isErrors = true;
    });
    return !isErrors;
  }

  // 認証コード再発行ボタン押下時のイベント
  const handleVerifiyConfirmCode = async () => {
    try {
      await confirmSignUp(
        user.userId,
        user.confirmCode
      );
      toast.successToast({
        message: 'サインアップが完了しました',
      });
      history.push(`/signIn`);
    } catch(error) {
      let message = "認証コードの確認に失敗しました"
      if(error.code === "UserNotFoundException") message = "ユーザが存在しません<br/>サインアップを行ってください";
      if(error.code === "CodeMismatchException") message = "確認コードが誤っています";
      if(error.code === "NotAuthorizedException") message = "既に認証が完了しているユーザです";
      toast.errorToast({
        message: message
      });
    }
  }

  // 認証コード確認ボタン押下時のイベント
  const handleResendConfirmCode = async () => {
    try {
      await resendSignUp(
        user.userId
      );
      toast.successToast({
        message: '認証コードを再発行しました',
      });
    } catch(error) {
      let message = "認証コードの再発行に失敗しました<br/>(ユーザIDを入力してください)"
      if(error.code === "UserNotFoundException") message = "ユーザが存在しません<br/>サインアップを行ってください";
      if(error.code === "CodeMismatchException") message = "確認コードが誤っています";
      if(error.code === "InvalidParameterException") message = "既に認証が完了しているユーザです";
      toast.errorToast({
        message: message
      });
    }
  }

  return (
    <React.Fragment>
      <div className={styles.confirmCode}>
        <div className={styles.formArea}>
          <div className={styles.title}>
            認証コードの確認
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
            label="認証コード" 
            placeholder="012345" 
            type="text" 
            name="confirmCode" 
            value={ user.confirmCode } 
            onChangeFunc={(e) => {handleChange(e)} } 
            errorMessages={ errors.confirmCode }
          />
          <div className={styles.actions}>
            <button className={styles.inputButton} disabled={!isVerifiyConfirmCode()} onClick={ async() => { handleVerifiyConfirmCode() }
            }>認証コードの確認</button>
          </div>
          <div className={styles.subMenu}>
            <div className={`${styles.item} linkButton`} onClick={ async() => { handleResendConfirmCode() } }>
              認証コードの再発行
            </div>
            <div className={styles.item}>
              <Link to={'/signIn'}>
                サインイン画面に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

