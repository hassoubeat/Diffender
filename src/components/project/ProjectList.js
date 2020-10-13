import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';
import Loading from 'components/common/Loading';

import { 
  updateInitialLoadState, 
  setLoadedProjectList, 
  selectInitialLoadState, 
  selectLoadedProjectList
} from 'app/domainSlice';

import _ from 'lodash';
import * as projectModel from 'lib/project/model';
import * as arrayWrapper from 'lib/util/arrayWrapper';
import styles from './ProjectList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ProjectList() {

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const initialLoadState = useSelector(selectInitialLoadState);
  const isLoadedProjectList = _.get(initialLoadState, 'projectList', false);
  const projectList = _.cloneDeep(useSelector(selectLoadedProjectList));

  // state setup
  const [searchWord, setSearchWord] = useState("");
  const [isDisplayProjectFormModal, setDisplayProjectFormModal] = useState(false);

  // プロジェクト一覧の取得、及びStateの更新
  const updateProjectList = useCallback( async () => {
    const updateProjectList = await projectModel.getProjectList();
    dispatch(setLoadedProjectList(updateProjectList));
    dispatch(updateInitialLoadState({
      key: 'projectList',
      value: true
    }));
  }, [dispatch]);

  // プロジェクト一覧の順序入れ替えイベント
  const handleSort = async (e) => {
    const sortedProjectList = arrayWrapper.moveAt(projectList, e.oldIndex, e.newIndex);
    dispatch(setLoadedProjectList(_.cloneDeep(sortedProjectList)));    
    await projectModel.updateProjectListSortMap(sortedProjectList);
  }

  useEffect( () => {
    const asyncUpdateProjectList = async () => {
      // 既にProjectListが一度読み込まれていれば読み込みしない
      if (isLoadedProjectList) return;
      await updateProjectList();
    };
    asyncUpdateProjectList();
  }, [updateProjectList, isLoadedProjectList]);

  if (!isLoadedProjectList) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <div className={styles.projectList}>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        <ReactSortable list={projectList} setList={() => {}} handle=".draggable"
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
        <ProjectForm 
          successPostCallback={ async () => {
            // プロジェクト登録成功時にモーダルを閉じてプロジェクト一覧を更新する
            setDisplayProjectFormModal(false);
            await updateProjectList();
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