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
export function updatePageListSortMap(pageList) {
  return bucketSort.generateSortMap(pageList, "id");
}

// ページ一覧をソート
export function sortPageList(pageList, pagesSortMap={}) {
  // 降順でソート
  pageList.sort( (a, b) =>  {
    if( a.createDtUnix > b.createDtUnix ) return -1;
    if( a.createDtUnix < b.createDtUnix ) return 1;
    return 0;
  });
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
  return　pageList;
}
