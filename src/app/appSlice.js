import { createSlice } from '@reduxjs/toolkit';

// 初期State設定
const appStates = lsGetAppStates();
if(appStates.isDisplaySidebar === undefined) appStates.isDisplaySidebar = true;

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    // WindowDOMに関する状態
    window: {
      width: 0,
      height: 0
    },
    // サイドバーの表示有無
    isDisplaySidebar: appStates.isDisplaySidebar,
    // パンくずリスト
    breadcrumbs: []
  },
  reducers: {
    // 状態：WindowDOMに関する状態
    setWindow: (state, action) => {
      state.window = action.payload;
    },
    // 状態：サイドバーの表示有無の値セット
    setDisplaySidebar: (state, action) => {
      // localStorageの更新
      appStates.isDisplaySidebar = action.payload;
      lsSetAppStates(appStates)
      // ReduxStateの更新
      state.isDisplaySidebar = action.payload;
    },
    // 状態：パンくずリストの値セット
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    }
  },
});

// ActionCreaterのエクスポート
export const { 
  setWindow,
  setDisplaySidebar,
  setBreadcrumbs
 } = appSlice.actions;

// ステートをuseSelectorフックから呼び出し可能に
export const selectWindow = (state) => state.app.window;
export const selectIsDisplaySidebar = (state) => state.app.isDisplaySidebar;
export const selectBreadcrumbs = (state) => state.app.breadcrumbs;

// Reducerのエクスポート
export default appSlice.reducer;

// localStorageからアプリのStateを取得する
function lsGetAppStates() {
  let appStates = JSON.parse(localStorage.getItem("AppStates"));
  if (!appStates) appStates = {};
  return appStates;
}

// localStorageにアプリのStateを保存する
function lsSetAppStates(value) {
  localStorage.setItem("AppStates", JSON.stringify(value));
}