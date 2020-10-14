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
    pages: {}
  },
  reducers: {
    // 状態：初回ロード状態の更新
    setInitialLoadState: (state, action) => {
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
    setPages: (state, action) => {
      const pageList = action.payload;
      const pageListObject = pageList.reduce((result, page) => {
        result[page.id] = page;
        return result;
      }, {});
      state.pages = {
        ...pageListObject,
        ...state.pages
      };
    },
    // 状態 ページ一覧にページセット
    setPage: (state, action) => {
      const page = action.payload;
      state.pages[page.id] = page;
    },
    // 状態 ページ一覧から指定要素の削除
    deletePage: (state, action) => {
      const pageId = action.payload;
      delete state.pages[pageId];
    },
  },
});

// ActionCreaterのエクスポート
export const { 
  setInitialLoadState,
  setProjects,
  addProjects,
  deleteProjects,
  setPages,
  setPage,
  deletePage
 } = domainSlice.actions;


 // ロード状態のState取得セレクタ
export const selectInitialLoadState = (key) => {
  return (state) => {
    return (key) ? _.get(state.domain.initialLoadState, key, false) : state.domain.initialLoadState; 
  };
};

// プロジェクト一覧のState取得セレクタ
export const selectProjects = (state) => {
  return Object.values(state.domain.projects);
};
export const selectPages = (state) => state.domain.pages;

// 指定したプロジェクトをプロジェクト一覧から取得するセレクタ
export const selectProject = (projectId) => {
  return (state) => {
    return _.get(state.domain.projects, projectId);
  };
}

// 指定したプロジェクトに紐づくページ一覧を取得するセレクタ
export const selectPagesByProjectId = (projectId) => {
  return (state) => {
    return Object.values(state.domain.pages).filter((page) => {
      return (page.pageTieProjectId === projectId)
    });
  };
}

// 指定したページをページ一覧を取得するセレクタ
export const selectPage = (pageId) => {
  return (state) => {
    return _.get(state.domain.pages, pageId);
  };
}

// Reducerのエクスポート
export default domainSlice.reducer;