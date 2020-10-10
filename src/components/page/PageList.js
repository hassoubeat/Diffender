import React, { useState, useEffect, useCallback } from 'react';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import PageForm from './pageForm/PageForm';
import Loading from 'components/common/Loading';

import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';
import * as bucketSort from 'lib/util/bucketSort';

import styles from './PageList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function PageList(props = null) {
  // propsの展開
  const projectId = props.projectId;

  const [searchWord, setSearchWord] = useState("");
  const [pageList, setPageList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisplayPageFormModal, setIsDisplayPageFormModal] = useState(false);

  // ページ一覧の取得・ソート
  const updatePageList = useCallback( async () => {
    const pagesSortMap = await getPagesSortMap(projectId);
    const pageList = await getPageList(projectId);
    const sortedObj = bucketSort.sort(pageList, pagesSortMap, "id");
    const sortedPageList = sortedObj.noSortedList.concat(sortedObj.sortedList);
    setPageList(sortedPageList);
    setIsLoading(false);
  }, [projectId]);

  // ページ一覧の順序入れ替えイベント
  const handleSort = async () => {
    const pagesSortMap = bucketSort.generateSortMap(pageList, "id");
    await updatePagesSortMap(projectId, pagesSortMap);
  }

  useEffect( () => {
    updatePageList();
  }, [updatePageList]);

  const history = useHistory();

  if (isLoading) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <div className={styles.pageList}>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        <ReactSortable list={pageList} setList={setPageList} handle=".draggable"
          onEnd={ async (event) => {await handleSort(event)} }
        >
          {filterPageList(pageList, searchWord).map( (page) => (
            <div key={page.id} id={page.id} className={styles.pageItem}
                  onClick={() => {history.push(`/projects/${projectId}/pages/${page.id}`)}} >
              <div className={styles.main}>
                <span className={styles.title}>
                  {page.name}
                </span>
              </div>
              <div className={styles.description}>
                {page.description}
              </div>
              <div className={styles.actions}>
                <i className="fa fa-arrows-alt draggable"></i>
              </div>
            </div>
          ))}
        </ReactSortable>
      </div>
      <Modal 
        isOpen={isDisplayPageFormModal}
        onRequestClose={() => {setIsDisplayPageFormModal(false)}}
        className="modalContent"
        overlayClassName="modalOverray"
      >
        <div className="modalTitle">ページを作成する</div>
        <small className="modalSupportMessage">
          ページとはスクリーンショットを撮影する単位です。<br/>
          スクリーンショットを撮影を行いたいページ毎に作成してください。
        </small>
        <p></p>
        <PageForm
          projectId={projectId} 
          postSuccessCallback={ () => {
            setIsDisplayPageFormModal(false)
            updatePageList()
          }}
          deleteSuccessCallback={ () => {
            setIsDisplayPageFormModal(false)
            updatePageList()
          }}
        />
        <div className="closeModalButton" onClick={() => {setIsDisplayPageFormModal(false)}}>✕</div>
      </Modal>
      <div className="fixLowerRightButton" onClick={() => {
        setIsDisplayPageFormModal(true);
        }}>+</div>
    </React.Fragment>
  );

  function filterPageList(pageList, searchWord) {
    return pageList.filter((page) => {
      // プロジェクト名に検索ワードが含まれる要素のみフィルタリング
      return page.name.match(searchWord);
    });
  }

  // プロジェクトソートマップの取得
  async function getPagesSortMap(projectId) {
    const project = await api.getProject({
      projectId: projectId
    });
    return project.pagesSortMap || {};
  }

  // プロジェクトソートマップの更新
  async function updatePagesSortMap(projectId, updatePagesSortMap) {
    const project = await api.getProject({
      projectId: projectId
    });
    project.pagesSortMap = updatePagesSortMap;
    await api.putProject({
      projectId: projectId,
      request: {
        body: project
      }
    });
  }

  // ページ一覧の取得
  async function getPageList(projectId) {
    let pageList = [];
    try {
      pageList = await api.getPageList({
        projectId: projectId
      });
    } catch (error) {
      toast.errorToast(
        { message: "プロジェクト一覧の取得に失敗しました" }
      );
    }
    return　pageList;
  }
}
