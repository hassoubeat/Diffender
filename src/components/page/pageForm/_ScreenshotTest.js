import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import Loading from 'components/common/Loading';
import ScreenshotView from 'components/screenshot/ScreenshotView';

import _ from 'lodash';
import * as toast from 'lib/util/toast';
import * as api from 'lib/api/api';

import { inputPageManualCast } from 'lib/page/model';

import styles from './_ScreenshotTest.module.scss';

export default function ScreenshotTest(props = null) {

  // props setup
  const projectId = props.projectId;

  // State setup
  const [isAPICalling, setIsAPICalling] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(null);

  // Hook setup
  const { handleSubmit } = useFormContext();

  // スクリーンショット取得テスト
  const onSubmit = async (page) => {
    toast.infoToast(
      { message: `スクリーンショット取得リクエストを送信しました` }
    );
    try {    
      page.actions = page.actions || [];
      page = inputPageManualCast(page);

      setIsAPICalling(true);

      const result = await api.testPage({
        projectId: projectId,
        request : {
          body: page
        }
      });
      setScreenshotUrl(result.screenshotUrl);

      setIsAPICalling(false);

      toast.successToast(
        { message: `スクリーンショットを取得しました` }
      );

    } catch (error) {
      console.log(error.response);

      setIsAPICalling(false);

      let toastMessage = "スクリーンショットの取得に失敗しました";
      switch (_.get(error, 'response.status')) {
        case 504: {
          toastMessage = "処理がタイムアウトしました(最大30秒)"
          break;
        }
        default: {}
      }
      toast.errorToast(
        { 
          message: toastMessage
        }
      );
    }
  }

  // submit失敗時(バリデーションエラー)が発生した時のイベント処理
  const onSubmitError = (error) => { 
    console.table(error);
    console.log(error)
    toast.errorToast(
      { message: "入力エラーが存在します" }
    )
  };

  return (
    <React.Fragment>
      <div className={styles.screenshotTest}>
        <button 
          type="button"
          className={`button ${styles.requestButton}`}
          disabled={isAPICalling}
          onClick={
            handleSubmit(onSubmit, onSubmitError)
          }
        >スクリーンショット取得(テスト)</button>
        {screenshotUrl &&
          <button 
            type="button"
            className={`button ${styles.requestButton}`}
            onClick={() => {
              setScreenshotUrl(null)
            }}
          >クリア</button>
        }
        {
          (isAPICalling || screenshotUrl) && 

          <div className={styles.screenshotResult}>
            {isAPICalling ?
              <Loading/> : 
              <ScreenshotView screenshotURL={screenshotUrl} />
            }
          </div>
        }
      </div>
    </React.Fragment>
  );
}
