
import React from 'react'
import { useSelector } from 'react-redux';
import { selectIsLogin } from 'app/userSlice';
import { Redirect } from 'react-router-dom'

// ログインのチェックモジュール
export default function AuthCheck(props = null) {
  // propsの展開
  const children = props.children;
  const redirectPath = props.redirectPath || "/signIn";

  // Redux-Stateの取得
  const isLogin = useSelector(selectIsLogin);

  if (isLogin) {
    // ログインしていたら配下の要素を表示
    return (children);
  } else {
    // ログインしていなかったらサインインページにリダイレクト
    return (<Redirect to={redirectPath}/>);
  }
}