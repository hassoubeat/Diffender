import React, { useState, useEffect } from 'react';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from 'modules/projectForm/ProjectForm';
import styles from './ProjectList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ProjectList() {
  const [searchWord, setSearchWord] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [isDisplayProjectFormModal, setDisplayProjectFormModal] = useState(false);

  useEffect( () => {
    // プロジェクト一覧を取得して、Stateを更新
    const asyncUpdateProjectList = async () => {
      setProjectList(await getProjectList());
    };
    asyncUpdateProjectList();
  }, []);

  const history = useHistory();

  return (
    <React.Fragment>
      <div className={styles.projectList}>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        <ReactSortable list={projectList} setList={setProjectList} handle=".draggable"
          onEnd={ async (event) => {await sortProjectList(event)} }
        >
          {
            // プロジェクト一覧をフィルタリングしながら表示
            filterProjectList(projectList, searchWord).map( (project) => (
              <div key={project.id} className={styles.projectItem} onClick={() => {history.push(`/projects/${project.id}`)}}>
                <div className={styles.main}>
                  <span className={styles.title}>
                    {project.projectName}
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
        <ProjectForm successPostCallback={ () => {setDisplayProjectFormModal(false)} } />
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
      return project.projectName.match(searchWord);
    });
  }

  async function sortProjectList(sortObj) {
    // TODO いずれlibにAPIを実装してそちらからアクセス
    console.log(sortObj);
  }

  async function getProjectList() {
    // TODO いずれlibにAPIを実装してそちらからデータを取得
    return [
      {
        id: "Project-1",
        projectName: "プロジェクト1",
        description: "example.comのテスト用プロジェクト",
        userId: "9ece2937-50c3-4fb5-80d6-e4514ea0810d"
      },
      {
        id: "Project-2",
        projectName: "プロジェクト2",
        description: "example2.comのテスト用プロジェクト",
        userId: "9ece2937-50c3-4fb5-80d6-e4514ea0810d"
      },
    ];
  }
}
