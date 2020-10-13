import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export const domainSlice = createSlice({
  name: 'domain',
  initialState: {
    // 初回ロード状態の管理
    initialLoadState: {
    },
    // プロジェクト一覧
    loadedProjectList: [],
    // ページ一覧
    loadedPageListMap: {}
  },
  reducers: {
    // 状態：初回ロード状態の更新
    updateInitialLoadState: (state, action) => {
      const {key, value} = action.payload;
      _.set(state.initialLoadState, key, value);
    },
    // 状態：プロジェクト一覧 セット
    setLoadedProjectList: (state, action) => {
      state.loadedProjectList = action.payload;
    },
    // 状態：ページ一覧 セット
    setLoadedPageList: (state, action) => {
      const {projectId, pageList} = action.payload;
      _.set(state.loadedPageListMap, projectId, pageList);
    }
  },
});

// ActionCreaterのエクスポート
export const { 
  updateInitialLoadState,
  setLoadedProjectList,
  setLoadedPageList
 } = domainSlice.actions;

// ステートをuseSelectorフックから呼び出し可能に
export const selectInitialLoadState = (state) => state.domain.initialLoadState;
export const selectLoadedProjectList = (state) => state.domain.loadedProjectList;
export const selectLoadedPageListMap = (state) => state.domain.loadedPageListMap;

// Reducerのエクスポート
export default domainSlice.reducer;