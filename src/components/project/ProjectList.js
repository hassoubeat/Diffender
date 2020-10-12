import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';
import Loading from 'components/common/Loading';

import {  setLoadedPorjectList, selectLoadedPorjectList　} from 'app/appSlice';

import * as bucketSort from 'lib/util/bucketSort';
import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';
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
    const projectsSortMap = await getProjectsSortMap();
    const projectList = await getProjectList();
    const sortedObj = bucketSort.sort(projectList, projectsSortMap, "id");
    const sortedProjectList = sortedObj.noSortedList.concat(sortedObj.sortedList);
    setProjectList(sortedProjectList);
    dispatch(setLoadedPorjectList(sortedProjectList));
    setIsLoading(false);
  }, [dispatch]);

  // プロジェクト一覧の順序入れ替えイベント
  const handleSort = async () => {
    const projectsSortMap = bucketSort.generateSortMap(projectList, "id");
    await updateProjectsSortMap(projectsSortMap);
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
            filterProjectList(projectList, searchWord).map( (project) => (
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

  function filterProjectList(projectList, searchWord) {
    return projectList.filter((project) => {
      // プロジェクト名に検索ワードが含まれる要素のみフィルタリング
      return project.name.match(searchWord);
    });
  }

  // プロジェクトソートマップの取得
  async function getProjectsSortMap() {
    const userOption = await api.getUserOption();
    return userOption.projectsSortMap || {};
  }

  // プロジェクトソートマップの更新
  async function updateProjectsSortMap(updateProjectsSortMap) {
    const userOption = await api.getUserOption();
    userOption.projectsSortMap = updateProjectsSortMap;
    const request = {
      body: { ...userOption }
    }
    await api.putUserOption(request);
  }

  // プロジェクト一覧の取得
  async function getProjectList() {
    let projectList = [];
    try {
      projectList = await api.getProjectList({});
    } catch (error) {
      toast.errorToast(
        { message: "プロジェクト一覧の取得に失敗しました" }
      );
    }
    return　projectList;
  }
}