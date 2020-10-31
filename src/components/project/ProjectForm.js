import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, FormProvider } from "react-hook-form";
import UtilInput from 'components/util/input/Input';
import Accordion from 'components/util/accordion/Accordion';
import ActionForm from 'components/action/ActionForm';

import {  
  setProject,
  selectProject
} from 'app/domainSlice';

import {
  postProject,
  putProject
} from 'lib/project/model'

import * as toast from 'lib/util/toast';
import styles from './ProjectForm.module.scss';

export default function ProjectForm(props = null) {
  // props setup
  const isUpdate = !!props.projectId;
  const projectId = props.projectId;
  const successPostCallback = props.successPostCallback;

  // hook setup
  const dispatch = useDispatch();

  // redux-state setup
  const project = useSelector(selectProject(projectId, isUpdate));

  // state setup
  const [isRowRegisterPage, setIsRowRegisterPage] = useState(true);

  // ReactHookForm setup
  const reactHookFormMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: "",
      description: "",
      beforeCommonActions: [],
      afterCommonActions: []
    }
  });
  const {register, errors, reset, handleSubmit} = reactHookFormMethods;

  useEffect( () => {
    if (isUpdate) reset(project);
  }, [isUpdate, project, reset]);

  const onSubmit = async (inputProject) => {
    // TODO 数値型のキャスト変換
    // ReactHookFormで数値の自動キャストに対応していないため、手動キャスト
    // 自動キャストを追加するかの議論は https://github.com/react-hook-form/react-hook-form/issues/615
    // 自動キャストが実装された場合は対応して本処理を除外
    inputProject.beforeCommonActions = inputProject.beforeCommonActions || [];
    inputProject.beforeCommonActions.forEach((action) => {
      if (action.millisecond) action.millisecond = Number(action.millisecond);
    });
    inputProject.afterCommonActions = inputProject.afterCommonActions || [];
    inputProject.afterCommonActions.forEach((action) => {
      if (action.millisecond) action.millisecond = Number(action.millisecond);
    });
    
    let registedProject = null;
    if (isUpdate) {
      registedProject = await putProject({
        ...project,
        ...inputProject
      })
    } else {
      registedProject = await postProject(inputProject)
    }
    if (registedProject) dispatch(setProject(registedProject));
    if (registedProject && successPostCallback) successPostCallback(registedProject, isRowRegisterPage);
  }

  const onSubmitError = (error) => {
    console.table(error);
    console.log(error)
    toast.errorToast(
      { message: "入力エラーが存在します" }
    )
  }

  return (
    <React.Fragment>
      <form>
      <FormProvider {...reactHookFormMethods} >
      <div className={styles.projectForm}>
        <div className={styles.inputArea}>
          <UtilInput
            label="サイト名" 
            placeholder="example.com" 
            type="text" 
            name="name" 
            errorMessages={ (errors.name) && [errors.name.message] } 
            inputRef={ register({
              required: "サイト名は必須です",
              maxLength : {
                value: 30,
                message: '最大30文字で入力してください'
              }
            })}
          />
          <UtilInput
            label="サイトの説明" 
            placeholder="example.comのテスト" 
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
          <Accordion className={styles.commonActionList} text="共通アクション(前処理)" >
            <div className={styles.detail}>
              <div className={styles.message}>
                全ページで共通実行するアクションです。<br/>
                <b>共通して実行するログインなどのアクション</b>は本機能に記載することをおすすめします。<br/>
              </div>
              <ActionForm actionsName="beforeCommonActions" />
            </div>
          </Accordion>
          <Accordion className={styles.commonActionList} text="共通アクション(後処理)" >
            <div className={styles.detail}>
              <div className={styles.message}>
                全ページで共通実行するアクションです。<br/>
                <b>共通して実行するログアウトなどのアクション</b>は本機能に記載することをおすすめします。<br/>
              </div>
              <ActionForm actionsName="afterCommonActions" />
            </div>
          </Accordion>
          { (!isUpdate) &&
            <React.Fragment>
              <input 
                checked={isRowRegisterPage}
                className={styles.checkBox} 
                type="checkBox" 
                onChange={() => {
                  setIsRowRegisterPage(!isRowRegisterPage);
                }}
              />サイト登録後に続けてページを登録
            </React.Fragment>
          }
          <div className={styles.actionArea}>
            <span className={styles.postButton} onClick={ 
              handleSubmit(onSubmit, onSubmitError)
            }>
              {(isUpdate) ? '更新' : '登録'}
            </span>
          </div>
        </div>
      </div>
      </FormProvider>
      </form>
    </React.Fragment>
  );
}
