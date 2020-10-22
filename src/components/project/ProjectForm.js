import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, FormProvider } from "react-hook-form";
import UtilInput from 'components/util/input/Input';
import Accordion from 'components/util/accordion/Accordion';
import ActionForm from 'components/action/ActionForm';

import {  
  setProject,
  selectProject
} from 'app/domainSlice';

import * as api from 'lib/api/api';
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
  const project = useSelector(selectProject(projectId));

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
    const eventName = (isUpdate) ? "更新" : "登録";

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

    toast.infoToast(
      { message: `プロジェクトの${eventName}リクエストを送信しました` }
    );
    try {
      if (isUpdate) {
        dispatch(setProject(
          await api.putProject({
            projectId: projectId, 
            request : {
              body: {
                ...project,
                ...inputProject
              }
            }
          })
        ));
      } else {
        dispatch(setProject(
          await api.postProject({
            request: {
              body: inputProject
            }
          })
        ));
      }
      toast.successToast(
        { message: `プロジェクトの${eventName}が完了しました` }
      );
      if (successPostCallback) successPostCallback();
    } catch (error) {
      console.log(error.response);
      toast.errorToast(
        { message: `プロジェクトの${eventName}に失敗しました` }
      );
    }
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
            label="プロジェクト名" 
            placeholder="example.com" 
            type="text" 
            name="name" 
            errorMessages={ (errors.name) && [errors.name.message] } 
            inputRef={ register({
              required: "プロジェクト名は必須です",
              maxLength : {
                value: 30,
                message: '最大30文字で入力してください'
              }
            })}
          />
          <UtilInput
            label="プロジェクトの説明" 
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
                本処理は全ページのアクションの前に実行するアクションです。<br/>
                多くの画面で共通して実行するアクション(ログインなど)は本機能に記載することをおすすめします。<br/>
              </div>
              <ActionForm actionsName="beforeCommonActions" />
            </div>
          </Accordion>
          <Accordion className={styles.commonActionList} text="共通アクション(後処理)" >
            <div className={styles.detail}>
              <div className={styles.message}>
                本処理は全ページのアクションの後に実行するアクションです。<br/>
                多くの画面で共通して実行するアクション(ログアウトなど)は本機能に記載することをおすすめします。<br/>
              </div>
              <ActionForm actionsName="afterCommonActions" />
            </div>
          </Accordion>
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
