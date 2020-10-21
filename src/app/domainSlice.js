import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import * as api from 'lib/api/api';

export const domainSlice = createSlice({
  name: 'domain',
  initialState: {
    // 初回ロード状態の管理
    initialLoadState: {
    },
    // プロジェクト一覧
    projects: {},
    // ページ一覧
    pages: {},
    // リザルト一覧
    results: {},
    // リザルトアイテム一覧
    resultItems: {}
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
    setProject: (state, action) => {
      const project = action.payload;
      state.projects[project.id] = project;
    },
    // 状態：プロジェクト一覧 削除
    deleteProject: (state, action) => {
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
    // 状態：リザルト一覧 セット
    setResults: (state, action) => {
      const resultList = action.payload;
      const resultListObject = resultList.reduce((returnObject, result) => {
        returnObject[result.id] = result;
        return returnObject;
      }, {});
      state.results = {
        ...resultListObject,
        ...state.results
      };
    },
    // 状態 リザルト一覧にページセット
    setResult: (state, action) => {
      const result = action.payload;
      state.results[result.id] = result;
    },
    // 状態 リザルト一覧から指定要素の削除
    deleteResult: (state, action) => {
      const resultId = action.payload;
      delete state.results[resultId];
    },
    // 状態：リザルトアイテム一覧 セット
    setResultItems: (state, action) => {
      const resultItemList = action.payload;
      const resultItemListObject = resultItemList.reduce((returnObject, resultItem) => {
        returnObject[resultItem.id] = resultItem;
        return returnObject;
      }, {});
      state.resultItems = {
        ...resultItemListObject,
        ...state.resultItems
      };
    },
  },
});

// ActionCreaterのエクスポート
export const { 
  setInitialLoadState,
  setProjects,
  setProject,
  deleteProject,
  setPages,
  setPage,
  deletePage,
  setResults,
  setResult,
  deleteResult,
  setResultItems
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

// リザルト一覧のState取得セレクタ
export const selectResults = ({projectId}) => {
  if (projectId) {
    return (state) => {
      return Object.values(state.domain.results).filter((result) => {
        return (result.resultTieProjectId === projectId)
      });
    };
  } else {
    return (state) => {
      return Object.values(state.domain.results);
    }
  }
};

// 指定したリザルトをプロジェクト一覧から取得するセレクタ
export const selectResult = (resultId) => {
  return (state) => {
    return _.get(state.domain.results, resultId);
  };
}

// 指定したプロジェクトに紐づくリザルト一覧を取得するセレクタ
export const selectResultsByProjectId = (projectId) => {
  return (state) => {
    return Object.values(state.domain.results).filter((result) => {
      return (result.resultTieProjectId === projectId)
    });
  };
}

// 指定したプロジェクトに紐づくリザルト一覧のロード状況取得するセレクタ
export const selectIsLoadedResultItemsByResultId = (resultId) => {
  return (state) => {
    return _.get(state.domain.initialLoadState, `resultItemListMap.${resultId}`, false);
  };
}

// 指定したプロジェクトに紐づくリザルト一覧を取得するセレクタ
export const selectResultItemsByResultId = (resultId) => {
  return (state) => {
    return Object.values(state.domain.resultItems).filter((resultItem) => {
      return (resultItem.resultItemTieResultId === resultId)
    });
  };
}

// リザルトアイテム一覧の取得とStateにセット
export const fetchResultItemsByResultId = (resultId) => async (dispatch) => {
  dispatch(
    setResultItems(await api.getResultItemList({
      resultId: resultId
    }))
  );
  dispatch(
    setInitialLoadState({
      key: `resultItemListMap.${resultId}`,
      value: true
    })
  );
}

// Reducerのエクスポート
export default domainSlice.reducer;