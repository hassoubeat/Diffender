import React, { useState, useEffect } from 'react';
import UtilInput from 'components/util/input/Input';
import Loading from 'components/common/Loading';

import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';
import * as projectValid from 'lib/validation/projectValidation';
import styles from './ProjectForm.module.scss';

export default function ProjectForm(props = null) {
  // props展開
  const isUpdate = !!props.projectId;
  const projectId = props.projectId;
  const successPostCallback = props.successPostCallback;
  const successDeleteCallback = props.successDeleteCallback;

  // 入力フォーム用のState定義
  const [isLoading, setIsLoading] = useState(isUpdate);
  const [project, setProject] = useState({
    name: "",
    description: ""
  }); 
  const [errors, setErrors] = useState({
    name: [],
    description: []
  });

  useEffect( () => {
    if (!isUpdate) return;
    const asyncSetProject = async () => {
      let updateProject = {};
      try {
        updateProject = await api.getProject(projectId, { 
          body: {}
        });
      } catch (error) {
        toast.errorToast(
          { message: "プロジェクトの取得に失敗しました" }
        );
      }
      setProject(updateProject);
      setIsLoading(false);
    }
    asyncSetProject();
    
  }, [projectId, isUpdate]);

  // 入力変更時の処理
  const handleChange = (event) => {
    const inputType = event.target.name;
    const value = event.target.value;
    
    // エラーメッセージを初期化
    errors[inputType] = [];
    setErrors(Object.assign({}, errors));

    // 入力値のセット
    project[inputType] = value;
    setProject(Object.assign({}, project));  

    // バリデーション
    try {
      projectValid.valid(inputType, project);
    } catch (error) {
      errors[inputType].push(error.message);
      setErrors(Object.assign({}, errors));
    }
  }

  // 登録ボタン押下時の処理
  const handlePostProject = async () => {
    toast.infoToast(
      { message: "プロジェクトの登録リクエストを送信しました" }
    );
    try {
      await api.postProject({
        body: project
      });
      toast.successToast(
        { message: "プロジェクトの登録が完了しました" }
      );
      if (successPostCallback) successPostCallback();
    } catch (error) {
      toast.errorToast(
        { message: "プロジェクトの登録に失敗しました" }
      );
    }
  }

  // 更新ボタン押下時の処理
  const handlePutProject = async () => {
    toast.infoToast(
      { message: "プロジェクトの更新リクエストを送信しました" }
    );
    try {
      await api.putProject(projectId, {
        body: project
      });
      toast.successToast(
        { message: "プロジェクトの更新が完了しました" }
      );
      if (successPostCallback) successPostCallback();
    } catch (error) {
      toast.errorToast(
        { message: "プロジェクトの更新に失敗しました" }
      );
    }
  }

  // 削除ボタン押下時の処理
  const handleDeleteProject = async () => {
    toast.infoToast(
      { message: "プロジェクトの削除リクエストを送信しました" }
    );
    try {
      await api.deleteProject(projectId, {
        body: project
      });
      toast.successToast(
        { message: "プロジェクトの削除が完了しました" }
      );
      if (successDeleteCallback) successDeleteCallback();
    } catch (error) {
      toast.errorToast(
        { message: "プロジェクトの削除に失敗しました" }
      );
    }
  }

  if (isLoading) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <div className={styles.projectForm}>
        <div className={styles.inputArea}>
          <UtilInput 
            label="プロジェクト名" 
            placeholder="example.com" 
            type="text" 
            name="name" 
            value={ project.name } 
            onChangeFunc={(e) => { handleChange(e) } } 
            errorMessages={ errors.name }
          />
          <UtilInput 
            label="プロジェクトの説明" 
            placeholder="example.comのテスト" 
            type="text" 
            name="description" 
            value={ project.description } 
            onChangeFunc={(e) => { handleChange(e) } } 
            errorMessages={ errors.description }
          />
          <div className={styles.actionArea}>
            <span className={styles.postButton} onClick={async () => { 
              (isUpdate) ? handlePutProject() : handlePostProject();
            }}>
              {(isUpdate) ? '更新' : '登録'}
            </span>
            {/* 更新時のみ削除ボタンを表示 */}
            {(isUpdate) && <span className={styles.deleteButton} onClick={
              async () => { handleDeleteProject() }
            }>削除</span>}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
