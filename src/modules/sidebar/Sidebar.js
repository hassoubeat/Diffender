import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { setDisplaySidebar, selectWindow, selectIsDisplaySidebar } from 'app/appSlice';
import { 
  selectCurrentUser, 
  setIsLogin, 
  setCurrentUser
} from 'app/userSlice';
import { isSpWindowSize } from 'lib/util/window';
import { signOut } from 'lib/auth/cognitoAuth'
import styles from './Sidebar.module.scss';

export default function Sidebar() {
  const dispatch = useDispatch();

  // Redux-Stateの取得
  const appWindow = useSelector(selectWindow);
  const isSp = isSpWindowSize(appWindow.width);
  const isDisplaySidebar = useSelector(selectIsDisplaySidebar);
  const loginUser = useSelector(selectCurrentUser);

  const history = useHistory();

  return (
    <React.Fragment>
      <aside className={`${styles.sideBar}`}>
        <section id='sidebar'>
          <ul className={`${styles.sideBarMenu}`}>
            <li className={`${styles.sideBarItem} ${styles.brand}`}>
              <Link to="/" onClick={() => {if(isSp) dispatch(setDisplaySidebar(false))}}>
                {process.env.REACT_APP_PROJECT_NAME}
              </Link>
            </li>
            <hr/>
            <li className={`${styles.sideBarItem} ${styles.user}`}>
              <Link to="/users" onClick={() => {if(isSp) dispatch(setDisplaySidebar(false))}}>
                <i className="fa fa-user"></i> {loginUser.name} <i className="fa fa-sign-out-alt" onClick={ async() => {
                  signOut();
                  dispatch(setCurrentUser({}));
                  dispatch(setIsLogin(false));
                  history.push("/signIn");
                }}></i>
              </Link>
            </li>
            <hr/>
            <li className={`${styles.sideBarItem}`}>
              <Link to="/projects" onClick={() => {if(isSp) dispatch(setDisplaySidebar(false))}}>
                プロジェクト
              </Link>
            </li>
            <li className={`${styles.sideBarItem}`} onClick={() => {if(isSp) dispatch(setDisplaySidebar(false))}}>
              <Link to="/results">
                リザルト
              </Link>
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
