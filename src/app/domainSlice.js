import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export const domainSlice = createSlice({
  name: 'domain',
  initialState: {
    // 初回ロード状態の管理
    initialLoadState: {
    },
    // プロジェクト一覧
    projects: {},
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
    setProjects: (state, action) => {
      const projectList = action.payload;
      const projectListObject = projectList.reduce((result, project) => {
        result[project.id] = project;
        return result;
      }, {});
      state.projects = projectListObject;
    },
    // 状態：プロジェクト一覧 追加・変更
    addProjects: (state, action) => {
      const project = action.payload;
      state.projects[project.id] = project;
    },
    // 状態：プロジェクト一覧 削除
    deleteProjects: (state, action) => {
      const projectId = action.payload;
      delete state.projects[projectId];
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
  setProjects,
  addProjects,
  deleteProjects,
  setLoadedPageList
 } = domainSlice.actions;

// ステートをuseSelectorフックから呼び出し可能に
export const selectInitialLoadState = (state) => state.domain.initialLoadState;
export const selectProjects = (state) => {
  return Object.values(state.domain.projects);
};
export const selectLoadedPageListMap = (state) => state.domain.loadedPageListMap;

// 特定のプロジェクトを取得
export const selectLoadedProject = (projectId) => {
  return (state) => {
    return _.get(state.domain.projects, projectId);
  };
} 

// Reducerのエクスポート
export default domainSlice.reducer;