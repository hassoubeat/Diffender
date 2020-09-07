import React, { useState, useEffect } from 'react';
import * as toast from 'lib/util/toast';
import styles from './ResultForm.module.scss';

export default function ResultForm(props = null) {
  // props展開
  const isUpdate = !!props.resultId;
  const resultId = props.resultId;
  const successPostCallback = props.successPostCallback;
  const successDeleteCallback = props.successDeleteCallback;

  // 入力フォーム用のState定義
  const [resultType, setResultType] = useState("");
  const [resultName, setResultName] = useState("");

  useEffect( () => {
    if (!isUpdate) return;
    const asyncSetResult = async () => {
      const result = await getResult(props.resultId);;
      setResultType(result.ResultType);
      setResultName(result.ResultName);
    }
    asyncSetResult();
  }, [props, isUpdate]);

  return (
    <React.Fragment>
      <div className={styles.resultForm}>
        <div className={styles.inputArea}>
          {/* リザルト種別 */}
          {(isUpdate) && 
            <div className={styles.inputItem}>
              <label className={styles.inputLabel}>
                リザルト種別
              </label>
              <div>
                {resultType}  
              </div>
            </div>
          }
          {/* リザルト名の入力フォーム */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              リザルト名の説明
            </label>
            <div>
              <input className={styles.inputText} type="text" placeholder=" 例： 20200701_定期テスト" value={resultName} 
                onChange={(e) => {setResultName(e.target.value)}} 
              />
            </div>
          </div>
          <div className={styles.actionArea}>
            <span className={styles.postButton} onClick={async () => { await postResult(
              {
                resultName: resultName
              },
              successPostCallback
            )}}>
              {(isUpdate) ? '更新' : '登録'}
            </span>
            {/* 更新時のみ削除ボタンを表示 */}
            {(isUpdate) && <span className={styles.deleteButton} onClick={
              async () => { 
                await deleteResult(resultId, successDeleteCallback)
              }
            }>削除</span>}
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  // // リザルト種別が「スクリーンショット」であるか判定する
  // function isResultTypeSS(resultType) {
  //   return (resultType === process.env.REACT_APP_RESULT_TYPE_SS);
  // }

  // // リザルト種別が「DIFF」であるか判定する
  // function isResultTypeDIFF(resultType) {
  //   return (resultType === process.env.REACT_APP_RESULT_TYPE_DIFF);
  // }

  // TODO バリデーション関数
  // 全項目のバリデーションを実施して、結果を返却する
  // function validate(validateObj, callback) {
  //   let errorMessages = ({});
  //   errorMessages.name = validate(validateObj.name, ["requre", "min"]);
    

  //   const errorLength = Object.keys(errorMessages).length;

  //   return {
  //     isSuccess: (errorLength === 0),
  //     errorMessages: errorMessages,
  //     errorLength: Object.keys(errorMessages).length
  //   }
  // }

  async function getResult(resultId) {
    // TODO APIの呼び出し
    console.log(resultId);
    return {
      Id: "Result-1",
      ResultName: "リザルト1",
      ResultType: "SCREENSHOT"
    }
  }

  async function postResult(postObj, successCallback) {
    console.log(postObj);
    toast.infoToast(
      { message: "リクエストを送信しました" }
    );
    // TODO APIの呼び出し
    // TODO 新規登録と更新で呼び出すAPIを変更
    toast.infoToast(
      { message: "リクエストが完了しました" }
    );
    if (successCallback) successCallback();
  }

  async function deleteResult(resultId, successCallback) {
    console.log(resultId);
    if (!window.confirm('リザルトを削除しますか？')) return;

    toast.infoToast(
      { message: "削除リクエストを送信しました" }
    );
    // TODO APIの呼び出し
    toast.infoToast(
      { message: "削除が完了しました" }
    );
    if (successCallback) successCallback();
  }
}
