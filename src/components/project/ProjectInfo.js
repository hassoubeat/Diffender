import React from 'react';
import { useHistory } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import ResultList from 'components/result/ResultList';
import styles from './ProjectInfo.module.scss';

export default function ProjectInfo(props = null) {
  // props setup
  const projectId = props.projectId;

  // hook setup
  const history = useHistory();

  return (
    <React.Fragment>
      <div className={`${styles.projectInfo} scroll`}>
        <div className="sectionTitle">
          <div className="main">サイト</div>
          <div className="linkButton" onClick={() => {history.push(`/projects/${projectId}/pages`)} }>
            <i className="fas fa-angle-double-right"/> ページ一覧
          </div>
        </div>
        {/* <div className={styles.actionArea}>
          
        </div> */}
        <ProjectForm 
          projectId={projectId} 
          successDeleteCallback={ async  () => {
            history.push('/projects');
          }} 
        />
        <div className={styles.relateResultArea}>
          <div className={styles.title}>関連するギャラリー</div>
          <ResultList 
            projectId={projectId} 
            isDisplayListCount={false}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
