import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { selectIsDisplaySidebar, setWindow } from 'app/appSlice';
import { 
  selectIsInitialize, 
  setIsInitialize, 
  setIsLogin, 
  setCurrentUser
} from 'app/userSlice';
import { getCurrentUser } from 'lib/auth/cognitoAuth'
import queryString from 'query-string';

import './App.scss';
import AuthCheck from 'modules/auth/AuthCheck';
import UnAuthCheck from 'modules/auth/UnAuthCheck';
import DivideForm from 'modules/auth/DivideForm';
import SignUp from 'modules/auth/SignUp';
import ConfirmCode from 'modules/auth/ConfirmCode';
import SignIn from 'modules/auth/SignIn';
import ForgotPassword from 'modules/auth/ForgotPassword';
import ResetPassword from 'modules/auth/ResetPassword';
import Sidebar from 'modules/sidebar/Sidebar';
import Main from 'modules/main/Main';
import NotFound404 from 'modules/notFound/NotFound';


function App() {
  const dispatch = useDispatch();

  // Redux-Stateの取得
  const isIntialize = useSelector(selectIsInitialize);
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

    // ログインユーザ設定
    const getLoginUser = async () => {
      let currentUser = null;
      try {
        currentUser = await getCurrentUser();
      } catch (error) {
        console.log(error);
      }
      if (currentUser) {
        // IdToken内のユーザ情報をReduxStateに格納
        dispatch(setCurrentUser({...currentUser.getSignInUserSession().getIdToken().payload}));
        dispatch(setIsLogin(true));
      }
      // ログイン状態の初期化完了
      dispatch(setIsInitialize(false));
    };
    getLoginUser();
  }, [dispatch]);

  // ログイン状態の初期化中はレンダリングを行わない
  if (isIntialize) return <React.Fragment>Loading...</React.Fragment>;

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
