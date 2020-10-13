import * as bucketSort from 'lib/util/bucketSort';
import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

// ページ一覧をサーチしてフィルタリングする
export function searchPageList(pageList, searchWord) {
  return pageList.filter((page) => {
    // ページ名に検索ワードが含まれる要素のみフィルタリング
    return page.name.match(searchWord);
  });
}

// ページソートマップの更新
export async function updatePageListSortMap({projectId, pageList}) {
  const project = await api.getProject({
    projectId: projectId
  });
  project.pagesSortMap = bucketSort.generateSortMap(pageList, "id");;
  await api.putProject({
    projectId: projectId,
    request: {
      body: project
    }
  });
}

// ページ一覧をソート
export async function sortPageList({projectId, pageList}) {
  const project = await api.getProject({
    projectId: projectId
  });
  const pagesSortMap = project.pagesSortMap || {};
  const sortedObj = bucketSort.sort(pageList, pagesSortMap, "id");
  return sortedObj.noSortedList.concat(sortedObj.sortedList);
}

// ページ一覧の取得
export async function getPageList(projectId) {
  let pageList = [];
  try {
    pageList = await api.getPageList({
      projectId: projectId
    });
  } catch (error) {
    toast.errorToast(
      { message: "ページ一覧の取得に失敗しました" }
    );
  }
  return　sortPageList({
    projectId: projectId,
    pageList: pageList
  });
}
