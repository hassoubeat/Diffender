import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { 
  setInitialLoadState, 
  setPages, 
  selectInitialLoadState,
  selectPagesByProjectId,
  selectProject
} from 'app/domainSlice';

import _ from 'lodash';
import {
  sortPageList,
  getPageList
} from 'lib/page/model';
import {
  getLSItem,
  setLSItem,
  toBoolean
} from 'lib/util/localStorage'
import styles from './PageListQuickView.module.scss';

export default function ProjectListQuickView(props = null) {
  // props setup
  const projectId = props.projectId;
  const selectedPageId = props.selectedPageId;

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const isLoadedPageList = useSelector(selectInitialLoadState(`pageListMap.${projectId}`));  
  const project = _.cloneDeep(useSelector( selectProject(projectId) ));
  const pagesSortMap = project.pagesSortMap || {};
  const pageList = sortPageList(
    _.cloneDeep(useSelector(selectPagesByProjectId(projectId))),
    pagesSortMap
  );

  // state setup
  const [isDisplayMenu, setIsDisplayMenu] = useState(
    toBoolean(getLSItem('isDisplayPageQuickMenu', false)) 
  );

  // メニュー表示切り替え
  const handleDisplayMenuToggle = () => {
    setLSItem('isDisplayPageQuickMenu', !isDisplayMenu);
    setIsDisplayMenu(!isDisplayMenu);
  }

  // ページ一覧の取得
  const updatePageList = useCallback( async () => {
  dispatch(setPages(
    await getPageList(projectId)
  ));
  dispatch(setInitialLoadState({
    key: `pageListMap.${projectId}`,
    value: true
  }));
  }, [projectId, dispatch]);

  useEffect( () => {
    const asyncUpdatePageList = async () => {
      // 既にページ一覧が一度読み込まれていれば読み込みしない
      if (isLoadedPageList) return;
      await updatePageList();
    };
    asyncUpdatePageList();
  }, [updatePageList, isLoadedPageList]);

  return (
    <React.Fragment>
      {isDisplayMenu && 
        <div className={`${styles.pageListQuickView}`}>
          <div 
            className={styles.closeMenuItem}
            onClick={ () => { 
              handleDisplayMenuToggle()
            }}
          >
           <i className="fas fa-angle-double-left" /> close
          </div>
          <div 
            className={styles.pageListMenuItem}
            onClick={ () => { 
              history.push(`/projects/${projectId}/pages`)
            }}
          >
           <i className="fas fa-list"/> ページ一覧
          </div>
          {pageList.map( (page) => (
              <div 
                key={page.id}
                id={page.id} 
                className={`
                  ${styles.pageItem} 
                  ${(page.id === selectedPageId) && styles.selected}
                `}
                onClick={() => { 
                  history.push(`/projects/${projectId}/pages/${page.id}`)}
                }
              >
                <div className={styles.main}>
                  <span className={styles.title}>
                    {page.name}
                  </span>
                </div>
              </div>
            ))
          }
        </div>
      }
      {!isDisplayMenu && 
        <div className={`${styles.closePageListQuickView}`} onClick={() => {
          handleDisplayMenuToggle();
        }}>
          <i className="fas fa-angle-double-right" />
          <div className={styles.label}>
            Pages
          </div>
        </div>
      }
    </React.Fragment>
  );
}