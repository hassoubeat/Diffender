import React, { useState  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';

import { 
  setProjectsSortMap,
  selectCurrentUserOption
} from 'app/userSlice';

import { 
  selectProjects,
  deleteProject
} from 'app/domainSlice';

import _ from 'lodash';
import {
  filterProjectList,
  updateProjectListSortMap,
  sortProjectList
} from 'lib/project/model';

import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';
import * as arrayWrapper from 'lib/util/arrayWrapper';
import styles from './ProjectList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ProjectList() {

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const userOption = _.cloneDeep(useSelector(selectCurrentUserOption));
  const projectsSortMap = userOption.projectsSortMap || {};
  const projectList = sortProjectList(
    _.cloneDeep(useSelector(selectProjects)),
    projectsSortMap
  );

  // state setup
  const [searchWord, setSearchWord] = useState("");
  const [isDisplayProjectFormModal, setDisplayProjectFormModal] = useState(false);

  // プロジェクト一覧の順序入れ替え
  const handleSort = async (e) => {
    const updateProjectsSortMap = updateProjectListSortMap(
      arrayWrapper.moveAt(projectList, e.oldIndex, e.newIndex)
    );
    dispatch(setProjectsSortMap(updateProjectsSortMap));
    userOption.projectsSortMap = updateProjectsSortMap;
    await api.putUserOption({
      body: userOption
    });
  }

  // 削除ボタン押下時の処理
  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`プロジェクト「${projectName}」を削除しますか？`)) return;
    toast.infoToast(
      { message: `プロジェクト「${projectName}」の削除リクエストを送信しました` }
    );
    try {
      await api.deleteProject({
        projectId: projectId
      });
      toast.successToast(
        { message: `プロジェクト「${projectName}」の削除が完了しました` }
      );
      dispatch(deleteProject(projectId));
    } catch (error) {
      toast.errorToast(
        { message: `プロジェクト「${projectName}」の削除に失敗しました` }
      );
    }
  }

  return (
    <React.Fragment>
      <div className={styles.projectList}>
        <div className="sectionTitle">プロジェクト一覧</div>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        <ReactSortable list={projectList} setList={() => {}} handle=".draggable"
          onEnd={ async (event) => {await handleSort(event)} }
        >
          {
            // プロジェクト一覧をフィルタリングしながら表示
            filterProjectList(projectList, searchWord).map( (project) => (
              <div 
                key={project.id} id={project.id} className={styles.projectItem} onClick={() => {history.push(`/projects/${project.id}`)}}>
                <div className={styles.main}>
                  <span className={styles.title}>
                    {project.name}
                  </span>
                </div>
                <div className={styles.description}>
                  {project.description}
                </div>
                <div className={styles.actions}>
                  <i className={`fa fa-trash-alt ${styles.item} ${styles.delete}`} onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteProject(project.id, project.name)
                  }}/>
                  <i className="fa fa-arrows-alt draggable"></i>
                </div>
              </div>
            ))
          }
        </ReactSortable>
      </div>
      <Modal 
        isOpen={isDisplayProjectFormModal}
        onRequestClose={() => {setDisplayProjectFormModal(false)}}
        className="modalContent"
        overlayClassName="modalOverray"
      >
        <div className="modalTitle">プロジェクトを作成する</div>
        <small className="modalSupportMessage">
          プロジェクトとは「テスト」を実行する単位です。<br />
          サイト別、テストの目的別にプロジェクトを作成することをおすすめします。
        </small>
        <ProjectForm 
          successPostCallback={ async () => {
            // プロジェクト登録成功時にモーダルを閉じてプロジェクト一覧を更新する
            setDisplayProjectFormModal(false);
          }} 
        />
        <div className="closeModalButton" onClick={() => {setDisplayProjectFormModal(false)}}>✕</div>
      </Modal>
      <div className="fixLowerRightButton" onClick={() => {
        setDisplayProjectFormModal(true);
        }}>+</div>
    </React.Fragment>
  );
}