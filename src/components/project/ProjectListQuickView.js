import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { 
  selectCurrentUserOption
} from 'app/userSlice';

import { 
  selectProjects
} from 'app/domainSlice';

import _ from 'lodash';
import {
  sortProjectList
} from 'lib/project/model';
import {
  getLSItem,
  setLSItem,
  toBoolean
} from 'lib/util/localStorage'
import styles from 'styles/QuickView.module.scss';

export default function ProjectListQuickView(props = null) {
  // props setup
  const selectedProjectId = props.selectedProjectId;

  // hook setup
  const history = useHistory();

  // redux-state setup
  const userOption = _.cloneDeep(useSelector(selectCurrentUserOption));
  const projectsSortMap = userOption.projectsSortMap || {};
  const projectList = sortProjectList(
    _.cloneDeep(useSelector(selectProjects)),
    projectsSortMap
  );

  // state setup
  const [isDisplayMenu, setIsDisplayMenu] = useState(
    toBoolean(getLSItem('isDisplayProjectQuickMenu', false)) 
  );

  // メニュー表示切り替え
  const handleDisplayMenuToggle = () => {
    setLSItem('isDisplayProjectQuickMenu', !isDisplayMenu);
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
              history.push(`/projects`)}
            }
          >
           <i className="fas fa-list"/> プロジェクト一覧
          </div>
          {projectList.map( (project) => (
              <div 
                key={project.id}
                id={project.id} 
                className={`
                  ${styles.menuItem} 
                  ${(project.id === selectedProjectId) && styles.selected}
                `}
                onClick={() => { 
                  history.push(`/projects/${project.id}`)}
                }
              >
                <div className={styles.main}>
                  <span className={styles.title}>
                    {project.name}
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
            Projects
          </div>
        </div>
      }
    </React.Fragment>
  );
}