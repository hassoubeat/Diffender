import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

// リザルト一覧をソート
export function sort(resultList) {
  // 降順でソート
  resultList.sort( (a, b) =>  {
    if( a.createDtUnix > b.createDtUnix ) return -1;
    if( a.createDtUnix < b.createDtUnix ) return 1;
    return 0;
  });
  return resultList;
}

// リザルト一覧のフィルタリング
export function filterResultList(resultList, filterObj) {
  return resultList.filter((result) => { 
    return (
      // プロジェクト名に検索ワードが含まれる要素のみフィルタリング
      !!result.name.match(filterObj.searchWord) &&
      (
        // スクリーンショットリザルトのフィルタリング
        (filterObj.isSearchScreenshotResultFilter && result.resultType === "SCREENSHOT") ||
        // Diffリザルトのフィルタリング
        (filterObj.isSearchDiffResultFilter && result.resultType === "DIFF")
      )
    );
  });
}

// リザルト一覧の取得
export async function getResultList({queryStringsObject}) {
  try {
    return await api.getResultList({
      queryStringsObject: queryStringsObject
    });
  } catch (error) {
    toast.errorToast(
      { message: "プロジェクト一覧の取得に失敗しました" }
    );
  }
}

// リザルトの更新
export async function putResult(result) {
  toast.infoToast(
    { message: `リザルトの更新リクエストを送信しました` }
  );

  try {
    const resResult = await api.putResult({
      resultId: result.id,
      request: {
        body: result
      }
    });

    toast.successToast(
      { message: `リザルトの更新が完了しました` }
    );

    return resResult;

  } catch (error) {
    api.utilErrorProcess(error, "リザルトの更新に失敗しました");
  }
}

// リザルトの削除
export async function deleteResult(resultId) {
  toast.infoToast(
    { message: `リザルトの削除リクエストを送信しました` }
  );

  try {
    const result = await api.deleteResult({
      resultId: resultId
    });

    toast.successToast(
      { message: `リザルトの削除が完了しました` }
    );

    return result;

  } catch (error) {
    api.utilErrorProcess(error, "リザルトの削除が失敗しました");
  }
}