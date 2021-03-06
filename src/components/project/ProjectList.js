import React, { useState  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';
import ProjectListCount from './ProjectListCount';

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
  sortProjectList,
  deleteProject as DeleteProject
} from 'lib/project/model';

import * as api from 'lib/api/api';
import * as arrayWrapper from 'lib/util/arrayWrapper';
import styles from './ProjectList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ProjectList(props = null) {
  // prop setup
  const isIntialDisplayRegisterModal = props.isIntialDisplayRegisterModal || false;

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
  const [isDisplayProjectFormModal, setDisplayProjectFormModal] = useState(isIntialDisplayRegisterModal);

  // サイト一覧の順序入れ替え
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
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm(`サイトを削除しますか？`)) return;
    const project = await DeleteProject(projectId)
    if (project) dispatch( deleteProject(project.id) );
  }

  return (
    <React.Fragment>
      <div className={`${styles.projectList} scroll`}>
        <div className="sectionTitle">
          <div className="main">サイト一覧</div>
          <ProjectListCount/>
        </div>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        <ReactSortable list={projectList} setList={() => {}} handle=".draggable"
          onEnd={ async (event) => {await handleSort(event)} }
        >
          {
            // サイト一覧をフィルタリングしながら表示
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
                    handleDeleteProject(project.id)
                  }}/>
                  <i className="fa fa-arrows-alt draggable"></i>
                </div>
              </div>
            ))
          }
        </ReactSortable>
        { (projectList.length === 0) &&
          <React.Fragment>
            サイトは存在しません。<br/>
            画面下部のボタンから登録を行ってください。
          </React.Fragment>
        }
      </div>
      <Modal 
        isOpen={isDisplayProjectFormModal}
        onRequestClose={() => {setDisplayProjectFormModal(false)}}
        className="modalContent"
        overlayClassName="modalOverray"
      >
        <div className="modalTitle">サイトを登録する</div>
        <small className="modalSupportMessage">
          テストを行うサイトの情報を入力してください。
        </small>
        <ProjectForm 
          successPostCallback={ async (registedProject, isRowRegisterPage) => {
            // 連続してページを登録するかしないか
            if (isRowRegisterPage) {
              // サイト登録成功時にプロジェクト登録後、ページ一覧画面に遷移してページ登録モーダルを展開
              history.push(`/projects/${registedProject.id}/pages?isIntialDisplayRegisterModal=${isRowRegisterPage}`);
            } else {
              // サイト登録成功時にモーダルを閉じる
              setDisplayProjectFormModal(false);
            }
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