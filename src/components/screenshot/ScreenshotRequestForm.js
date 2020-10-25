import React from 'react';
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

import _ from 'lodash';
import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

export default function ScreenshotRequest(props = null) {
  // props setup
  const initSelectProjectId = props.initSelectProjectId;

  // hook setup
  const dispatch = useDispatch();

  // redux-state setup
  const userOption = _.cloneDeep(useSelector(selectCurrentUserOption));
  const projectsSortMap = userOption.projectsSortMap || {};
  const projectList = sortProjectList(
    _.cloneDeep(useSelector(selectProjects)),
    projectsSortMap
  );

  // ReactHookForm setup
  const {register, errors, handleSubmit} = useForm({
    mode: 'onChange',
    defaultValues: {
      name: "",
      description: "",
      projectId: ""
    }
  });

  // submit hander
  const onSubmit = async (data) => {
    toast.infoToast(
      { message: `スクリーンショット取得リクエストを送信しました` }
    );
    try {
      dispatch(setResult(
        await api.ScreenshotQueingProject({
          projectId: data.projectId,
          request: {
            body: data
          }
        })
      ));
      toast.successToast(
        { message: `スクリーンショット取得リクエストが完了しました` }
      );
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
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              スクリーンショットを取得するプロジェクト
            </label>
            <div className={styles.inputSelect} >
              <select 
                type="select"
                name="projectId"
                defaultValue={initSelectProjectId}
                ref={ register({
                  required: "プロジェクトを選択してください",
                })}
              >
                <option value=""> --プロジェクトを選択してください-- </option>
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