import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

// スクリーンショットの取得
export async function requestScreenshot(projectId, inputResult) {

  toast.infoToast(
    { message: `スクリーンショット取得リクエストを送信しました` }
  );

  try {
    const result = await api.ScreenshotQueingProject({
      projectId: projectId,
      request: {
        body: inputResult
      }
    })

    toast.successToast(
      { message: `スクリーンショット取得リクエストが完了しました` }
    );

    return result;
  } catch (error) {
    api.utilErrorProcess(error, "スクリーンショット取得リクエストに失敗しました");
  }
}