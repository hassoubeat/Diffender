import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { selectIsDisplaySidebar, setWindow } from 'app/appSlice';
import Sidebar from 'modules/sidebar/Sidebar';
import Main from 'modules/main/Main';
import NotFound404 from 'modules/notFound/NotFound';
import './App.scss';

function App() {
  const dispatch = useDispatch();
  const isDisplaySidebar = useSelector(selectIsDisplaySidebar);

  useEffect( () => {
    // 画面サイズStateの更新処理
    const updateStateWindow = () => {
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
  }, [dispatch]);

  return (
    <div className={`App ${(isDisplaySidebar ? '' : 'AppSidebarHidden')}`}>
      <BrowserRouter>
        <Switch>  
          <Route exact path="/404" component={NotFound404} />
          <Route>
            <Sidebar />
            <Main />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
