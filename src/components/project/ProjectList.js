import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';
import Loading from 'components/common/Loading';

import {  setLoadedPorjectList, selectLoadedPorjectList　} from 'app/appSlice';

import * as projectModel from 'lib/project/model';
import styles from './ProjectList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ProjectList() {

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const loadedPorjectList = useSelector(selectLoadedPorjectList);

  // state setup
  const [isLoading, setIsLoading] = useState(!loadedPorjectList);
  const [searchWord, setSearchWord] = useState("");
  const [projectList, setProjectList] = useState(loadedPorjectList || []);
  const [isDisplayProjectFormModal, setDisplayProjectFormModal] = useState(false);

  // プロジェクト一覧の取得、及びStateの更新
  const updateProjectList = useCallback( async () => {
    const projectList = await projectModel.getProjectList();
    setProjectList(projectList);
    dispatch(setLoadedPorjectList(projectList));
    setIsLoading(false);
  }, [dispatch]);

  // プロジェクト一覧の順序入れ替えイベント
  const handleSort = async () => {
    projectModel.updateProjectListSortMap(projectList);
    dispatch(setLoadedPorjectList(projectList));
  }

  useEffect( () => {
    const asyncUpdateProjectList = async () => {
      // 既にProjectListが一度読み込まれていれば読み込みしない
      if (loadedPorjectList) return;
      await updateProjectList();
    };
    asyncUpdateProjectList();
  }, [updateProjectList, loadedPorjectList]);

  if (isLoading) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <div className={styles.projectList}>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        <ReactSortable list={projectList} setList={setProjectList} handle=".draggable"
          onEnd={ async (event) => {await handleSort(event)} }
        >
          {
            // プロジェクト一覧をフィルタリングしながら表示
            projectModel.filterProjectList(projectList, searchWord).map( (project) => (
              <div key={project.id} id={project.id} className={styles.projectItem} onClick={() => {history.push(`/projects/${project.id}`)}}>
                <div className={styles.main}>
                  <span className={styles.title}>
                    {project.name}
                  </span>
                </div>
                <div className={styles.description}>
                  {project.description}
                </div>
                <div className={styles.actions}>
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
        <ProjectForm successPostCallback={ () => {
            // プロジェクト登録成功時にモーダルを閉じてプロジェクト一覧を更新する
            setDisplayProjectFormModal(false)
            updateProjectList()
        }} />
        <div className="closeModalButton" onClick={() => {setDisplayProjectFormModal(false)}}>✕</div>
      </Modal>
      <div className="fixLowerRightButton" onClick={() => {
        setDisplayProjectFormModal(true);
        }}>+</div>
    </React.Fragment>
  );
}