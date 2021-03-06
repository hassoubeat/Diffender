import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

import { RESULT_TYPE_SS } from 'lib/util/const'

// 比較元リザルトのフィルタリング処理
export function originResultFilter (resultList, projectId) {

  return resultList.filter((originResult) => {
    // resultTypeがSCREENSHOTの時のみ
    const isResultTypeSS = (originResult.resultType === RESULT_TYPE_SS);
    // 同じプロジェクトから出力されたリザルトのみ
    const isSameProject = (originResult.resultTieProjectId === projectId);
    // 上記の条件すべてを満たすとき正(フィルターから除外しない)
    return (isResultTypeSS && isSameProject);
  });
}

// 比較先リザルトのフィルタリング処理
export function targetResultFilter (resultList, originResultId) {
  if (!originResultId) return [];

  // 比較元リザルトの取得
  const originResult = resultList.find( (result) => {
    return (result.id === originResultId);
  });

  return resultList.filter((targetResult) => {
    // resultTypeがSCREENSHOTの時のみ
    const isResultTypeSS = (targetResult.resultType === RESULT_TYPE_SS);
    // 同じプロジェクトから出力されたリザルトのみ
    const isSameProject = (originResult.resultTieProjectId === targetResult.resultTieProjectId);
    // 比較元リザルトではない
    const isNotOriginResultId = (originResult.id !== targetResult.id);

    // 上記の条件すべてを満たすとき正(フィルターから除外しない)
    return (isResultTypeSS && isSameProject && isNotOriginResultId);
  });
}

// スクリーンショットの差分リクエスト
export async function requestDiffScreenshot(inputResult) {

  toast.infoToast(
    { message: `リクエストを送信しました` }
  );

  try {
    const result = await api.DiffScreenshotQueingProject({
      request: {
        body: inputResult
      }
    })

    toast.successToast(
      { message: `テストを開始しました` }
    );

    return result;
  } catch (error) {
    api.utilErrorProcess(error, "リクエストに失敗しました");
  }
}