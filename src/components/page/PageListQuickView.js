import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { 
  selectPagesByProjectId,
  selectProject
} from 'app/domainSlice';

import _ from 'lodash';
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
           <i className="fas fa-angle-double-left" /> close
          </div>
          <div 
            className={styles.gotoListMenuItem}
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