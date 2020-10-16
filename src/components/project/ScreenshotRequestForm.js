import React from 'react';
import { useForm } from "react-hook-form";
import UtilInput from 'components/util/input/Input';
import styles from './ScreenshotRequestForm.module.scss';

import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

export default function ScreenshotRequest(props = null) {
  // props setup
  const projectId = props.projectId;
  const requestSuccessCallback = props.requestSuccessCallback;

  // ReactHookForm setup
  const {register, errors, handleSubmit} = useForm({
    mode: 'onChange',
    defaultValues: {
      name: "",
      description: ""
    }
  });

  // submit hander
  const onSubmit = async (data) => {
    toast.infoToast(
      { message: `スクリーンショット取得リクエストを送信しました` }
    );
    try {
      await api.ScreenshotQueingProject({
        projectId: projectId,
        request: {
          body: data
        }
      });
      toast.successToast(
        { message: `スクリーンショット取得リクエストが完了しました` }
      );
      if (requestSuccessCallback) requestSuccessCallback();
    } catch (error) {
      console.log(error.response);
      toast.errorToast(
        { message: `スクリーンショット取得リクエストに失敗しました` }
      );
    }

  }

  // submit error hander
  const onSubmitError = (error) => {
    console.table(error);
    console.log(error)
    toast.errorToast(
      { message: "入力エラーが存在します" }
    )
  }

  return (
    <React.Fragment>
      <div className={styles.screenshotRequestForm}>
        <div className={styles.inputArea}>
          <UtilInput
            label="リザルト名" 
            placeholder="20200701の定期チェック_example.com" 
            type="text" 
            name="name" 
            errorMessages={ (errors.name) && [errors.name.message] } 
            inputRef={ register({
              maxLength : {
                value: 30,
                message: '最大30文字で入力してください'
              }
            })}
          />
          <UtilInput
            label="リザルトの説明" 
            placeholder="2020年7月分の差分チェック用" 
            type="text" 
            name="description" 
            errorMessages={ (errors.description) && [errors.description.message] } 
            inputRef={ register({
              maxLength : {
                value: 50,
                message: '最大50文字で入力してください'
              }
            })}
          />
          <div className={styles.actionArea}>
            <span 
              className={styles.postButton} 
              onClick={
                handleSubmit(onSubmit, onSubmitError)
              } 
            >取得</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
