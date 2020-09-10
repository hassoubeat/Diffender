
import React from 'react'
import { useSelector } from 'react-redux';
import { selectIsLogin } from 'app/userSlice';
import { Redirect } from 'react-router-dom'

// 非ログインのチェックモジュール
export default function UnAuthCheck(props = null) {
  // propsの展開
  const children = props.children;
  const redirectPath = props.redirectPath || "/";

  // Redux-Stateの取得
  const isLogin = useSelector(selectIsLogin);

  if (isLogin) {
    // ログインしていたらTOPにリダイレクト
    return (<Redirect to={redirectPath}/>);
  } else {
    // ログインしていなければ配下の要素を表示
    return (children);
  }
}