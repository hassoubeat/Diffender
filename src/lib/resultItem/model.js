import _ from 'lodash';

const RESULT_ITEM_STATUS_TYPE_ERROR = process.env.REACT_APP_RESULT_ITEM_STATUS_TYPE_ERROR;

// リザルトアイテム一覧をソート
export function sort(resultList) {
  // 登録日時の昇順でソート
  resultList.sort( (a, b) =>  {
    if( a.createDtUnix < b.createDtUnix ) return -1;
    if( a.createDtUnix > b.createDtUnix ) return 1;
    return 0;
  });
  // Diff%の降順でソート
  resultList.sort( (a, b) => {
    const aMisMatchPercentage = _.get(a, 'status.misMatchPercentage');
    const bMisMatchPercentage = _.get(b, 'status.misMatchPercentage');
    if( aMisMatchPercentage > bMisMatchPercentage ) return -1;
    if( aMisMatchPercentage < bMisMatchPercentage ) return 1;
    return 0;
  })
  // ERRORを優先的に上に来るようにソート
  resultList.sort( (a) => {
    const statusType = _.get(a, 'status.type');
    if(statusType >  RESULT_ITEM_STATUS_TYPE_ERROR) return 1;
    return -1;
  })
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

// Diff%の値に応じて値に応じたカラーセットを返却する
export function getDiffMisMatchPercentageClass(misMatchPercentage) {
  if (misMatchPercentage === 0) {
    return "NO_DIFF";
  } else if (misMatchPercentage < 20) {
    return "DIFF_20_LESS";
  } else if (misMatchPercentage < 40) {
    return "DIFF_40_LESS";
  } else if (misMatchPercentage < 60) {
    return "DIFF_60_LESS";
  } else if (misMatchPercentage < 80) {
    return "DIFF_80_LESS";
  } else {
    return "DIFF_100_LESS";
  }
}