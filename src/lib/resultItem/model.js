// リザルト一覧をソート
export function sort(resultList) {
  // 登録日時の昇順でソート
  resultList.sort( (a, b) =>  {
    if( a.createDtUnix < b.createDtUnix ) return -1;
    if( a.createDtUnix > b.createDtUnix ) return 1;
    return 0;
  });
  return resultList;
}

// リザルトアイテム一覧のフィルター
export function filterResultItemList(resultItemList, filterObj) {
  return resultItemList.filter((resultItem) => { 
    return (
      // プロジェクト名に検索ワードが含まれる要素のみフィルタリング
      !!resultItem.name.match(filterObj.searchWord) &&
      (
        // Itemの進行状況が「正常終了」のフィルタリング
        (filterObj.isDisplayResultProgressSuccess && resultItem.status.type === "SUCCESS") ||
        // Itemの進行状況が「エラー」のフィルタリング
        (filterObj.isDisplayResultProgressError && resultItem.status.type === "ERROR") ||
        // Itemの進行状況が「実行待ち」のフィルタリング
        (filterObj.isDisplayResultProgressWait && resultItem.status.type === "WAIT")
      )
    );
  });
}