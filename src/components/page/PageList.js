import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import PageForm from './pageForm/PageForm';
import Loading from 'components/common/Loading';

import * as api from 'lib/api/api';

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
    const pageList = await api.getPageList({
      projectId:projectId
    });
    setPageList(pageList);
    setIsLoading(false);
  }, [projectId]);

  useEffect( () => {
    updatePageList();
  }, [updatePageList]);

  if (isLoading) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <div className={styles.pageList}>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        {filterPageList(pageList, searchWord).map( (page) => (
          <Link key={page.id} to={`/projects/${projectId}/pages/${page.id}`}>
            <div className={styles.pageItem}>
              {page.name}
              <div className={styles.description}>
                {page.description}
              </div>
            </div>
            
          </Link>
        ))}
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
}
