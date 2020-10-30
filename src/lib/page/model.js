import * as bucketSort from 'lib/util/bucketSort';
import _ from 'lodash';
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

// ページの登録
export async function postPage(projectId, page) {
  toast.infoToast(
    { message: `ページの登録リクエストを送信しました` }
  );

  try {
    const result = await api.postPage({
      projectId: projectId,
      request: {
        body: page
      }
    })

    toast.successToast(
      { message: `ページの登録が完了しました` }
    );

    return result;

  } catch (error) {
    api.utilErrorProcess(error, "ページの登録に失敗しました");
  }
}

// ページの変更
export async function putPage(projectId, page) {
  toast.infoToast(
    { message: `ページの変更リクエストを送信しました` }
  );

  try {
    const result = await api.putPage({
      projectId: projectId, 
      pageId: page.id, 
      request : {
        body: page
      }
    })

    toast.successToast(
      { message: `ページの変更が完了しました` }
    );

    return result;

  } catch (error) {
    api.utilErrorProcess(error, "ページの変更に失敗しました");
  }
}

// ページの削除
export async function deletePage (projectId, pageId) {
  toast.infoToast(
    { message: `ページの削除リクエストを送信しました` }
  );

  try {
    const result = await api.deletePage({
      projectId: projectId,
      pageId: pageId
    });

    toast.successToast(
      { message: `ページの削除が完了しました` }
    );

    return result;
  } catch (error) {
    api.utilErrorProcess(error, "ページの削除に失敗しました");
  }
}

// ページのコピー
export async function copyPage (projectId, page) {
  toast.infoToast(
    { message: `ページ「${page.name}」のコピーを開始しました` }
  );
  try {
    const result = await api.postPage({
      projectId: projectId,
      request: {
        body: page
      }
    })

    toast.successToast(
      { message: `ページ「${page.name}」のコピーが完了しました` }
    );

    return result;
  } catch (error) {
    api.utilErrorProcess(error, `ページ「${page.name}」のコピーに失敗しました`);
  }
}

// 入力ページの手動キャスト
export function inputPageManualCast (inputPage) {
  if (_.get(inputPage, "browserSettings.viewport.width")) _.set(inputPage, "browserSettings.viewport.width", Number(_.get(inputPage, "browserSettings.viewport.width")));
  if (_.get(inputPage, "browserSettings.viewport.height")) _.set(inputPage, "browserSettings.viewport.height", Number(_.get(inputPage, "browserSettings.viewport.height")));

  inputPage.actions.forEach((action) => {
    // TODO 数値型のキャスト変換
    // ReactHookFormで数値の自動キャストに対応していないため、手動キャスト
    // 自動キャストを追加するかの議論は https://github.com/react-hook-form/react-hook-form/issues/615
    // 自動キャストが実装された場合は対応して本処理を除外
    if (action.millisecond) action.millisecond = Number(action.millisecond);
    if (_.get(action, "distance.xPixel")) _.set(action, "distance.xPixel", Number(_.get(action, "distance.xPixel")));
    if (_.get(action, "distance.yPixel")) _.set(action, "distance.yPixel", Number(_.get(action, "distance.yPixel")));
  });

  return inputPage;
}
