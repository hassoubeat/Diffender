import React, { useState } from 'react';
import * as toast from 'lib/util/toast';
import styles from './ScreenshotRequestForm.module.scss';

export default function ScreenshotRequest(props = null) {
  // パラメータ取得
  const projectId = props.projectId;
  const requestSuccessCallback = props.requestSuccessCallback;
  // 入力フォーム用のState定義
  const [resultName, setResultName] = useState("");

  return (
    <React.Fragment>
      <div className={styles.screenshotRequestForm}>
        <div className={styles.inputArea}>
          {/* リザルト名の入力フォーム */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              リザルト名
            </label>
            <div>
              <input className={styles.inputText} type="text" placeholder=" 例：20200701の定期チェック_example.com" 
                onChange={(e) => {setResultName(e.target.value)}} 
              />
            </div>
          </div>
          <div className={styles.actionArea}>
            <span className={styles.postButton} onClick={
              async () => { await screenshotRequest({
                projectId: projectId,
                resultName: resultName
              }, requestSuccessCallback)}
            }>取得</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  async function screenshotRequest(postObj, successCallback) {
    console.log(postObj);
    toast.infoToast(
      { message: "スクリーンショットの取得リクエストを送信しました" }
    );
    // TODO APIの呼び出し
    toast.infoToast(
      { message: "スクリーンショットの取得リクエストの受付が完了しました" }
    );
    if(successCallback) successCallback();
  }
}
