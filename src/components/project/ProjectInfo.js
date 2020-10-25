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
      <div className={styles.projectInfo}>
        <div className="sectionTitle">プロジェクト</div>
        <div className={styles.actionArea}>
          <button className={`button ${styles.addPageButton}`} onClick={() => {history.push(`/projects/${projectId}/pages`)} }>
            ページ一覧
          </button>
        </div>
        <ProjectForm 
          projectId={projectId} 
          successDeleteCallback={ async  () => {
            history.push('/projects');
          }} 
        />
        <div className={styles.relateResultArea}>
          <div className={styles.title}>関連するリザルト</div>
          <ResultList projectId={projectId} isDisplayDiffRequestForm={true} />
        </div>
      </div>
    </React.Fragment>
  );
}
