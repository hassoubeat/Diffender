import React, { useState, useEffect, useCallback } from 'react';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from 'modules/projectForm/ProjectForm';
import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';
import styles from './ProjectList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ProjectList() {
  const [searchWord, setSearchWord] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [isDisplayProjectFormModal, setDisplayProjectFormModal] = useState(false);

  // プロジェクト一覧の取得、及びStateの更新
  const updateProjectList = useCallback( async () => {
    setProjectList(await getProjectList());
  }, []);

  // プロジェクト一覧のソートイベント
  const handleSort = async (sortObj) => {
    console.log(sortObj);
  }

  useEffect( () => {
    const asyncUpdateProjectList = async () => {
      await updateProjectList();
    };
    asyncUpdateProjectList();
  }, [updateProjectList]);

  const history = useHistory();

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

  async function getProjectList() {
    let projectList = [];
    try {
      projectList = await api.getProjectList();
    } catch (error) {
      toast.errorToast(
        { message: "プロジェクト一覧の取得に失敗しました" }
      );
    }
    return　projectList;
  }
}