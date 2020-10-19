import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { selectIsDisplaySidebar, setWindow } from 'app/appSlice';

import { 
  selectIsUserInitializeComplete, 
  setIsUserInitializeComplete, 
  setIsLogin, 
  setCurrentUser,
  setCurrentUserOption
} from 'app/userSlice';

import { 
  setProjects,
  setResults
} from 'app/domainSlice';

import { getCurrentUser } from 'lib/auth/cognitoAuth'
import queryString from 'query-string';

import './App.scss';
import AuthCheck from 'components/auth/AuthCheck';
import UnAuthCheck from 'components/auth/UnAuthCheck';
import DivideForm from 'components/auth/DivideForm';
import SignUp from 'components/auth/SignUp';
import ConfirmCode from 'components/auth/ConfirmCode';
import SignIn from 'components/auth/SignIn';
import ForgotPassword from 'components/auth/ForgotPassword';
import ResetPassword from 'components/auth/ResetPassword';
import Sidebar from 'components/common/Sidebar';
import NotFound404 from 'components/common/NotFound';
import Main from 'components/Main';
import Loading from 'components/common/Loading';

import * as api from 'lib/api/api';


function App() {
  const dispatch = useDispatch();

  // Redux-Stateの取得
  const isUserInitializeComplete = useSelector(selectIsUserInitializeComplete);
  const isDisplaySidebar = useSelector(selectIsDisplaySidebar);

  useEffect( () => {
    // 画面サイズStateの更新処理
    const updateStateWindow = () => {
      // 画面サイズ設定
      dispatch(setWindow(
        {
          width: window.innerWidth, 
          height: window.innerHeight, 
        }
      ));
    }
    // 画面サイズ変更時にState変更処理をセット
    window.addEventListener('resize', updateStateWindow);
    // 初回画面表示時にStateにセット
    updateStateWindow();

    if (isUserInitializeComplete) return;

    // ログインユーザ設定
    const getLoginUser = async () => {
      let currentUser = null;
      try {
        currentUser = await getCurrentUser();
      } catch (error) {
        console.log(error);
      }
      if (currentUser) {
        // ログイン時は初期表示に必要なデータをReduxにセット
        dispatch(setCurrentUser({...currentUser.getSignInUserSession().getIdToken().payload}));
        dispatch(setCurrentUserOption( await api.getUserOption() ));
        dispatch(setProjects( await api.getProjectList({}) ));
        dispatch(setResults( await api.getResultList({}) ));
        dispatch(setIsLogin(true));
      }
      // ログイン状態の初期化完了
      dispatch(setIsUserInitializeComplete(true));
    };
    getLoginUser();
  }, [dispatch, isUserInitializeComplete]);

  // ログイン状態の初期化中はレンダリングを行わない
  if (!isUserInitializeComplete) return (
    <Loading/>
  );

  return (
    <div className={`App ${(isDisplaySidebar ? '' : 'AppSidebarHidden')}`}>
      <BrowserRouter>
        <Switch>  
          <Route exact path="/404" component={NotFound404} />
          <Route exact path="/signUp" render={ () => (
            <UnAuthCheck>
              <DivideForm>
                <SignUp/>
              </DivideForm>
            </UnAuthCheck>
          )} />
          <Route exact path="/code" render={ ({location}) => (
            <UnAuthCheck>
              <DivideForm>
                <ConfirmCode
                  queryString={queryString.parse(location.search)}
                />
              </DivideForm>
            </UnAuthCheck>
          )} />
          <Route exact path="/forgotPassword" render={ () => (
            <UnAuthCheck>
              <DivideForm position="left" >
                <ForgotPassword/>
              </DivideForm>
            </UnAuthCheck>
          )} />
          <Route exact path="/resetPassword" render={ ({location}) => (
            <UnAuthCheck>
              <DivideForm position="left" >
                <ResetPassword
                  queryString={queryString.parse(location.search)}
                />
              </DivideForm>
            </UnAuthCheck>
          )} />
          <Route exact path="/signIn" render={ () => (
            <UnAuthCheck>
              <SignIn/>
            </UnAuthCheck>
          )} />
          <Route>
            <AuthCheck>
              <Sidebar />
              <Main />
            </AuthCheck>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
