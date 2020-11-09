import React from 'react';
import { useHistory } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import styles from './ProjectInfo.module.scss';

export default function ProjectInfo(props = null) {
  // props setup
  const projectId = props.projectId;

  // hook setup
  const history = useHistory();

  return (
    <div className={`${styles.projectInfo} scroll`}>
      <ProjectForm 
        projectId={projectId} 
        successDeleteCallback={ async  () => {
          history.push('/projects');
        }} 
      />
    </div>
  );
}
