import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PageListCount from './PageListCount';
import Loading from 'components/common/Loading';

import { 
  selectIsLoadedPagesByProjectId,
  selectPagesByProjectId,
  selectProject
} from 'app/domainSlice';

import {
  sortPageList,
} from 'lib/page/model';
import {
  getLSItem,
  setLSItem,
  toBoolean
} from 'lib/util/localStorage'
import styles from 'styles/QuickView.module.scss';

export default function ProjectListQuickView(props = null) {
  // props setup
  const projectId = props.projectId;
  const selectedPageId = props.selectedPageId;

  // hook setup
  const history = useHistory();

  // redux-state setup 
  const isLoadedPageList = useSelector( selectIsLoadedPagesByProjectId(projectId) );  
  const project = useSelector( selectProject(projectId) );
  const pageList = sortPageList(
    useSelector(selectPagesByProjectId(projectId)),
    project.pagesSortMap || {}
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

  // 一覧の表示コンポーネント
  const PageList = () => {
    return pageList.map( (page) => (
      <div 
        key={page.id}
        id={page.id} 
        className={`
          ${styles.menuItem} 
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

  return (
    <React.Fragment>
      {isDisplayMenu && 
        <div className={`${styles.quickView}`}>
          <div 
            className={styles.closeMenuItem}
            onClick={ () => { 
              handleDisplayMenuToggle()
            }}
          >
            <div>
              <i className="fas fa-angle-double-left" /> close
            </div>
          </div>
          <div 
            className={styles.gotoListMenuItem}
            onClick={ () => { 
              history.push(`/projects/${projectId}/pages`)
            }}
          >
            <div className={styles.main}>
              <i className="fas fa-list"/> ページ一覧
            </div>
            <PageListCount projectId={projectId} />
          </div>
          { (isLoadedPageList) ?
            <PageList/> : <Loading/>
          }
        </div>
      }
      {!isDisplayMenu && 
        <div className={`${styles.closeQuickView}`} onClick={() => {
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