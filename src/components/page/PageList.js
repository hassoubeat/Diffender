import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import PageForm from './pageForm/PageForm';
import Loading from 'components/common/Loading';

import { 
  setInitialLoadState, 
  setPages, 
  selectInitialLoadState,
  selectPagesByProjectId
} from 'app/domainSlice';

import _ from 'lodash';
import * as pageModel from 'lib/page/model';
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
  const isLoadedPageList = useSelector(selectInitialLoadState(`pageListMap.${projectId}`));  
  const pageList = _.cloneDeep(useSelector(selectPagesByProjectId(projectId)));

  // state seteup
  const [searchWord, setSearchWord] = useState("");
  const [isDisplayPageFormModal, setIsDisplayPageFormModal] = useState(false);

  // ページ一覧の取得
  const updatePageList = useCallback( async () => {
    const pageList = await pageModel.getPageList(projectId);
    dispatch(setPages(pageList));
    dispatch(setInitialLoadState({
      key: `pageListMap.${projectId}`,
      value: true
    }));
  }, [projectId, dispatch]);

  // ページ一覧の順序入れ替えイベント
  const handleSort = async (e) => {
    const sortedPageList = arrayWrapper.moveAt(pageList, e.oldIndex, e.newIndex);
    dispatch(setPages(sortedPageList));
    await pageModel.updatePageListSortMap({
      projectId: projectId,
      pageList: sortedPageList
    });
  }

  // ページのコピーイベント
  const handleCopyPage = async (pageId) => {
    const copyPage = await api.getPage({
      projectId: projectId,
      pageId: pageId
    });
    if (!window.confirm(`ページ「${copyPage.name}」をコピーしますか？`)) return;
    try {
      copyPage.name = `${copyPage.name}_copy`;
      await api.postPage({
        projectId: projectId,
        request: {
          body: copyPage
        }
      })
      toast.successToast(
        { message: "ページのコピーが完了しました" }
      );
      await updatePageList();
    } catch (error) {
      toast.errorToast(
        { message: "ページのコピーに失敗しました" }
      );
    }
  }

  useEffect( () => {
    const asyncUpdatePageList = async () => {
      // 既にページ一覧が一度読み込まれていれば読み込みしない
      if (isLoadedPageList) return;
      await updatePageList();
    };
    asyncUpdatePageList();
  }, [updatePageList, isLoadedPageList]);

  if (!isLoadedPageList) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <div className={styles.pageList}>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
        <ReactSortable list={pageList} setList={() => {}} handle=".draggable"
          onEnd={ async (event) => {await handleSort(event)} }
        >
          {pageModel.searchPageList(pageList, searchWord).map( (page) => (
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
                <i className="far fa-copy" onClick={(e) => {
                  e.stopPropagation()
                  handleCopyPage(page.id)
                }}></i>
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
}
