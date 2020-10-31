import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setDisplaySidebar, selectWindow, selectIsDisplaySidebar } from 'app/appSlice';
import { 
  selectCurrentUser,
} from 'app/userSlice';
import { isSpWindowSize } from 'lib/util/window';
import { signOut } from 'lib/auth/cognitoAuth'
import * as toast from 'lib/util/toast';
import { PROJECT_NAME } from 'lib/util/const'
import styles from './Sidebar.module.scss';

export default function Sidebar() {
  const dispatch = useDispatch();
  const history = useHistory();

  // Redux-Stateの取得
  const appWindow = useSelector(selectWindow);
  const isSp = isSpWindowSize(appWindow.width);
  const isDisplaySidebar = useSelector(selectIsDisplaySidebar);
  const loginUser = useSelector(selectCurrentUser);

  // サインアウトボタン押下時の処理
  const handleSignOut = async () => {
    if(!window.confirm('サインアウトしますか？')) return;

    try {
      await signOut();
      dispatch({ type: "logout" });
      toast.successToast({
        message: 'サインアウトが完了しました',
      });
      history.push("/signIn");
    } catch (error) {
      console.error(error);
      let message = "サインアウトに失敗しました";
      toast.errorToast({
        message: message
      });
    }
  }

  return (
    <React.Fragment>
      <aside className={`${styles.sideBar}`}>
        <section id='sidebar'>
          <ul className={`${styles.sideBarMenu}`}>
            <li 
              className={`${styles.brandItem}`}
              onClick={() => {
                if(isSp) dispatch(setDisplaySidebar(false))
                history.push("/");
              }}
            >
              {PROJECT_NAME}
            </li>
            <hr/>
            <li className={`${styles.userItem}`}>
              <div><i className="fa fa-user"></i></div>
              <div className={styles.username}>
                {loginUser.nickname}
              </div>
              <div className={styles.icon}>
                <i className="fa fa-edit"
                  onClick={() => {
                    if(isSp) dispatch(setDisplaySidebar(false));
                    history.push("/user");
                  }}
                ></i>
              </div>
              <div className={styles.icon}>
                <i className="fa fa-sign-out-alt" onClick={ () => { handleSignOut() } }></i>
              </div>
            </li>
            <hr/>
            <li 
              className={`${styles.linkItem}`} 
              onClick={() => {
                if(isSp) dispatch(setDisplaySidebar(false))
                history.push("/projects");
              }}
            >
                サイト
            </li>
            <li 
              className={`${styles.linkItem}`} 
              onClick={() => {
                if(isSp) dispatch(setDisplaySidebar(false))
                history.push("/results");
              }}
            >
              ギャラリー
            </li>
            <li 
              className={`${styles.linkItem}`} 
              onClick={() => {
                if(isSp) dispatch(setDisplaySidebar(false))
                history.push("/screenshot-request");
              }}
            >
              スクリーンショットの取得
            </li>
            <li 
              className={`${styles.linkItem}`} 
              onClick={() => {
                if(isSp) dispatch(setDisplaySidebar(false))
                history.push("/diff-screenshot-request");
              }}
            >
              Diffの取得
            </li>
          </ul>
        </section>
      </aside>
      
      {/* サイドバー表示かつSPの時のみサイドバー用のオーバレイを表示する */}
      {(isDisplaySidebar && isSp) && 
        <div className={styles.sideBarOverlay} onClick={() => dispatch(setDisplaySidebar(false))}></div>
      }
      <div className={`${styles.sideBarToggle}`} onClick={() => dispatch(setDisplaySidebar(!isDisplaySidebar))}>
        <i className="fa fa-list"></i>
      </div>
    </React.Fragment>
  );
}
