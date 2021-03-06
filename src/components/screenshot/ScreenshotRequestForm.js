import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import UtilInput from 'components/util/input/Input';
import styles from './ScreenshotRequestForm.module.scss';

import { 
  selectCurrentUserOption
} from 'app/userSlice';

import {  
  setResult,
  selectProjects
} from 'app/domainSlice';

import { sortProjectList } from 'lib/project/model';
import { requestScreenshot } from 'lib/screenshot/model';

import _ from 'lodash';
import * as toast from 'lib/util/toast';

export default function ScreenshotRequest(props = null) {
  // props setup
  const initSelectProjectId = props.initSelectProjectId || "";
  const successPostCallback = props.successPostCallback;

  // hook setup
  const dispatch = useDispatch();

  // redux-state setup
  const userOption = _.cloneDeep(useSelector(selectCurrentUserOption));
  const projectsSortMap = userOption.projectsSortMap || {};
  const projectList = sortProjectList(
    _.cloneDeep(useSelector(selectProjects)),
    projectsSortMap
  );

  // state setup
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ReactHookForm setup
  const {register, errors, handleSubmit, reset} = useForm({
    mode: 'onChange',
    defaultValues: {
      name: "",
      description: "",
      projectId: initSelectProjectId
    }
  });

  // submit hander
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await requestScreenshot(data.projectId, data);
    if (result) dispatch( setResult(result) );
    reset();

    setIsSubmitting(false);

    if (successPostCallback) successPostCallback(result);
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
    <form onSubmit={ handleSubmit(onSubmit, onSubmitError)}>
      <input type="submit" className="hidden" />
      <div className={styles.screenshotRequestForm}>
        <div className={styles.inputArea}>
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              <span className={styles.main}>スクリーンショットを撮影するサイト</span>
            </label>
            <div className={styles.inputSelect} >
              <select 
                type="select"
                name="projectId"
                defaultValue={initSelectProjectId}
                ref={ register({
                  required: "サイトを選択してください",
                })}
              >
                <option value=""> Please Select </option>
                { projectList.map( (project) => (
                  <option 
                    key={project.id} 
                    value={project.id}
                  >{project.name}</option>　  
                ))}
              </select>
              { errors.projectId && 
                <div className={styles.error}>
                  {errors.projectId.message}
                </div>
              }
            </div>
          </div>
          <UtilInput
            label="テスト名" 
            placeholder="202008 example.com ブラウザテスト" 
            type="text" 
            name="name" 
            errorMessages={ (errors.name) && [errors.name.message] } 
            inputRef={ register({
              required: "テスト名は必須です",
              maxLength : {
                value: 100,
                message: '最大100文字で入力してください'
              }
            })}
          />
          <UtilInput
            label="テストの説明" 
            placeholder="example.comの2020年8月分のブラウザテスト" 
            type="text" 
            name="description" 
            errorMessages={ (errors.description) && [errors.description.message] } 
            inputRef={ register({
              maxLength : {
                value: 400,
                message: '最大400文字で入力してください'
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
    </form>
  );
}
