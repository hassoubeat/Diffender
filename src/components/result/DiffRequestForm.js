import React, { useState } from 'react';
import * as toast from 'lib/util/toast';
import styles from './DiffRequestForm.module.scss';

export default function DiffRequestForm(props = null) {
  // props展開
  const resultList = props.resultList;
  const successDiffRequestCallback = props.successDiffRequestCallback;

  // 入力フォーム用のState定義
  const [originResultId, setOriginResultId] = useState("");
  const [targetResultId, setTargetResultId] = useState("");
  const [resultName, setResultName] = useState("");

  return (
    <React.Fragment>
      <div className={styles.diffRequestForm}>
        <div className={styles.inputArea}>
          {/* 比較元リザルトの入力セレクタ */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              比較元リザルト
            </label>
            <div>
              <select className={styles.inputSelect} type="select"
                onChange={(e) => { setOriginResultId(e.target.value) }} >
                <option value=""> --リザルトを選択してください-- </option>
                { resultList.map( (result) => (　<option key={result.id} value={result.id}>{result.name}</option>　)) }
              </select>
            </div>
          </div>
          {/* 比較先リザルトの入力セレクタ */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              比較先リザルト
            </label>
            <div>
              <select className={styles.inputSelect} type="select" 
                onChange={(e) => { setTargetResultId(e.target.value) }}>
                <option value=""> --リザルトを選択してください-- </option>
                { resultList.map( (result) => (　<option key={result.id} value={result.id}>{result.name}</option>　)) }
              </select>
            </div>
          </div>
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
            <span className={styles.postButton} onClick={async () => { await diffRequest(
              {
                originResultId: originResultId,
                targetResultId: targetResultId,
                resultName: resultName
              },
              successDiffRequestCallback
            )}}>
              取得
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  async function diffRequest(diffObj, successCallback) {
    console.log(diffObj);

    // TODO バリデーション処理
    toast.infoToast(
      { message: "リクエストを送信しました" }
    );
    // TODO APIの呼び出し
    toast.infoToast(
      { message: "リクエストが完了しました" }
    );
    if (successCallback) successCallback();
  }
}
