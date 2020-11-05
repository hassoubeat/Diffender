import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

// スクリーンショットの撮影
export async function requestScreenshot(projectId, inputResult) {

  toast.infoToast(
    { message: `リクエストを送信しました` }
  );

  try {
    const result = await api.ScreenshotQueingProject({
      projectId: projectId,
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