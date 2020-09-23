import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import PageForm from './pageForm/PageForm';
import styles from './PageList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function PageList(props = null) {
  // propsの展開
  const projectId = props.projectId;

  const [searchWord, setSearchWord] = useState("");
  const [pageList, setPageList] = useState([]);
  const [isDisplayPageFormModal, setIsDisplayPageFormModal] = useState(false);

  useEffect( () => {
    // Page一覧を取得して、Stateを更新
    const asyncUpdatePageList = async () => {
      setPageList(await getPageList());
    };
    asyncUpdatePageList();
  }, []);

  return (
    <React.Fragment>
      <div className={styles.pageList}>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        {filterPageList(pageList, searchWord).map( (page) => (
          <Link key={page.Id} to={`/projects/${projectId}/pages/${page.Id}`}>
            <div className={styles.pageItem}>
              {page.PageName}
              <div className={styles.description}>
                {page.PageDescription}
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
          postSuccessCallback={ () => {setIsDisplayPageFormModal(false)} }
          deleteSuccessCallback={ () => {setIsDisplayPageFormModal(false)} }
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
      return page.PageName.match(searchWord);
    });
  }

  async function getPageList() {
    // TODO いずれlibにAPIを実装してそちらからデータを取得
    return [
      {
        Id: "Page-1",
        PageName: "ページ1",
        PageDescription: "example.comのTOPページ"
      },
      {
        Id: "Page-2",
        PageName: "ページ2",
        PageDescription: "example.comのInfoページ"
      }
    ];
  }
}
