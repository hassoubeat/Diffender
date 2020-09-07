import React, { useState, useEffect } from 'react';
import * as toast from 'lib/util/toast';
import styles from './ProjectForm.module.scss';

export default function ProjectForm(props = null) {
  // props展開
  const isUpdate = !!props.projectId;
  const successPostCallback = props.successPostCallback;
  const successDeleteCallback = props.successDeleteCallback;

  // 入力フォーム用のState定義
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  useEffect( () => {
    if (!isUpdate) return;
    const asyncSetProject = async () => {
      const project = await getProject(props.projectId);;
      setProjectName(project.ProjectName);
      setProjectDescription(project.ProjectDescription);
    }
    asyncSetProject();
  }, [props, isUpdate]);

  return (
    <React.Fragment>
      <div className={styles.projectForm}>
        <div className={styles.inputArea}>
          {/* プロジェクト名の入力フォーム */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              プロジェクト名
            </label>
            <div>
              <input className={styles.inputText} type="text" placeholder=" 例： example.com" value={projectName} 
                onChange={(e) => {setProjectName(e.target.value)}} 
              />
            </div>
          </div>
          {/* プロジェクトの説明の入力フォーム */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              プロジェクトの説明
            </label>
            <div>
              <input className={styles.inputText} type="text" placeholder=" 例： example.comのテスト" value={projectDescription} 
                onChange={(e) => {setProjectDescription(e.target.value)}} 
              />
            </div>
          </div>
          <div className={styles.actionArea}>
            <span className={styles.postButton} onClick={async () => { await postProject(
              {
                projectName: projectName,
                projectDescription: projectDescription
              },
              successPostCallback
            )}}>
              {(isUpdate) ? '更新' : '登録'}
            </span>
            {/* 更新時のみ削除ボタンを表示 */}
            {(isUpdate) && <span className={styles.deleteButton} onClick={
              async () => { 
                await deleteProject(props.projectId, successDeleteCallback)
              }
            }>削除</span>}
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  async function getProject(projectId) {
    // TODO APIの呼び出し
    console.log(projectId);
    return {
        Id: "Project-1",
        ProjectName: "プロジェクト1",
        ProjectDescription: "テスト用のプロジェクトです"
      }
  }

  async function postProject(postObj, successCallback) {
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

  async function deleteProject(projectId, successCallback) {
    console.log(projectId);
    if (!window.confirm('プロジェクトを削除しますか？')) return;

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
