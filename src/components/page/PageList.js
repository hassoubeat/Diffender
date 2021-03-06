import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import PageForm from './pageForm/PageForm';
import PageListCount from './PageListCount';
import Loading from 'components/common/Loading';

import {  
  setProject,
  setPage, 
  deletePage,
  selectIsLoadedPagesByProjectId,
  selectPagesByProjectId,
  selectProject
} from 'app/domainSlice';

import _ from 'lodash';
import {
  searchPageList,
  updatePageListSortMap,
  sortPageList,
  copyPage,
  deletePage as DeletePage
} from 'lib/page/model';
import * as api from 'lib/api/api';
import * as arrayWrapper from 'lib/util/arrayWrapper';

import styles from './PageList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function PageList(props = null) {
  // props setup
  const projectId = props.projectId;
  const isIntialDisplayRegisterModal = props.isIntialDisplayRegisterModal || false;

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const isLoadedPageList = useSelector(selectIsLoadedPagesByProjectId(projectId) );  
  const project = _.cloneDeep(useSelector( selectProject(projectId) ));
  const pageList = sortPageList(
    useSelector(selectPagesByProjectId(projectId)),
    project.pagesSortMap || {}
  );

  // state setup
  const [searchWord, setSearchWord] = useState("");
  const [isDisplayPageFormModal, setIsDisplayPageFormModal] = useState(isIntialDisplayRegisterModal);

  // ページ一覧の順序入れ替えイベント
  const handleSort = async (e) => {
    const updatePagesSortMap = updatePageListSortMap(
      arrayWrapper.moveAt(pageList, e.oldIndex, e.newIndex)
    );
    project.pagesSortMap = updatePagesSortMap;
    dispatch(setProject(project));
    await api.putProject({
      projectId: projectId,
      request: {
        body: project
      }
    });
  }

  // 削除ボタン押下時の処理
  const handleDeletePage = async (pageId, pageName) => {
    if (!window.confirm(`ページ「${pageName}」を削除しますか？`)) return;
    const result = await DeletePage(projectId, pageId);
    if (result) dispatch( deletePage(result.id) );
  }

  // ページのコピーイベント
  const handleCopyPage = async (page) => {
    if (!window.confirm(`ページ「${page.name}」をコピーしますか？`)) return;
    const result = await copyPage(projectId, page);
    if (result) dispatch( setPage(result) );
  }

  if (!isLoadedPageList) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <div className={`${styles.pageList} scroll`}>
        <div className="sectionTitle">
          <div className="main">ページ一覧</div>
          <PageListCount projectId={projectId} />
        </div>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        <ReactSortable list={pageList} setList={() => {}} handle=".draggable"
          onEnd={ async (event) => {await handleSort(event)} }
        >
          {searchPageList(pageList, searchWord).map( (page) => (
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
                <i className={`far fa-copy ${styles.item}`} onClick={(e) => {
                  e.stopPropagation()
                  handleCopyPage(page)
                }}></i>
                <i className={`fa fa-trash-alt ${styles.item} ${styles.delete}`} onClick={(e) => {
                  e.stopPropagation()
                  handleDeletePage(page.id, page.name)
                }}/>
                <i className="fa fa-arrows-alt draggable"></i>
              </div>
            </div>
          ))}
        </ReactSortable>
        { (pageList.length === 0) &&
          <React.Fragment>
            ページは存在しません。<br/>
            画面下部のボタンから登録を行ってください。
          </React.Fragment>
        }
      </div>
      <Modal 
        isOpen={isDisplayPageFormModal}
        onRequestClose={() => {setIsDisplayPageFormModal(false)}}
        className="modalContent"
        overlayClassName="modalOverray"
      >
        <div className="modalTitle">ページを作成する</div>
        <small className="modalSupportMessage">
          1ページで1枚のスクリーンショットを撮影します。<br/>
          テストを行いたいWebページ毎にページを登録してください。
        </small>
        <p></p>
        <PageForm
          projectId={projectId} 
          postSuccessCallback={ () => {
            setIsDisplayPageFormModal(false)
          }}
          deleteSuccessCallback={ () => {
            setIsDisplayPageFormModal(false)
          }}
        />
        <div className="closeModalButton" onClick={() => {setIsDisplayPageFormModal(false)}}>✕</div>
      </Modal>
      <div className="fixLowerRightButton" onClick={() => {
        setIsDisplayPageFormModal(true);
        }}>+</div>
    </React.Fragment>
  );
}
