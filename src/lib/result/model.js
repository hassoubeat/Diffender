import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

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