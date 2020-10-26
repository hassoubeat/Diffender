import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import PageForm from './pageForm/PageForm';
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
  sortPageList
} from 'lib/page/model';
import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';
import * as arrayWrapper from 'lib/util/arrayWrapper';

import styles from './PageList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function PageList(props = null) {
  // props setup
  const projectId = props.projectId;

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const isLoadedPageList = useSelector(selectIsLoadedPagesByProjectId(projectId) );  
  const project = _.cloneDeep(useSelector( selectProject(projectId) ));
  const pagesSortMap = project.pagesSortMap || {};
  const pageList = sortPageList(
    _.cloneDeep(useSelector(selectPagesByProjectId(projectId))),
    pagesSortMap
  );

  // state seteup
  const [searchWord, setSearchWord] = useState("");
  const [isDisplayPageFormModal, setIsDisplayPageFormModal] = useState(false);

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
    toast.infoToast(
      { message: `ページ「${pageName}」の削除リクエストを送信しました` }
    );
    try {
      await api.deletePage({
        projectId: projectId,
        pageId: pageId
      });
      toast.successToast(
        { message: `ページ「${pageName}」の削除が完了しました` }
      );
      dispatch(deletePage(pageId));
    } catch (error) {
      toast.errorToast(
        { message: `ページ「${pageName}」の削除に失敗しました` }
      );
    }
  }

  // ページのコピーイベント
  const handleCopyPage = async (page) => {
    if (!window.confirm(`ページ「${page.name}」をコピーしますか？`)) return;
    toast.infoToast(
      { message: `ページ「${page.name}」のコピーを開始しました` }
    );
    try {
      dispatch(setPage(
        await api.postPage({
          projectId: projectId,
          request: {
            body: page
          }
        })
      ));
      toast.successToast(
        { message: `ページ「${page.name}」のコピーが完了しました` }
      );
    } catch (error) {
      toast.errorToast(
        { message: `ページ「${page.name}」のコピーに失敗しました` }
      );
    }
  }

  if (!isLoadedPageList) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <div className={styles.pageList}>
        <div className="sectionTitle">ページ一覧</div>
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
          ページとはスクリーンショットを撮影する単位です。<br/>
          スクリーンショットを撮影を行いたいページ毎に作成してください。
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
