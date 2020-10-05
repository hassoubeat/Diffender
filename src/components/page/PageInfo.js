import React from 'react';
import { useHistory } from 'react-router-dom';
import PageForm from './pageForm/PageForm';
import styles from './PageInfo.module.scss';

export default function PageInfo(props = null) {
  // props展開
  const projectId = props.projectId;
  const pageId = props.pageId;

  const history = useHistory();

  return (
    <React.Fragment>
      <div className={styles.pageInfo}>
        <PageForm 
          projectId={projectId} 
          pageId={pageId} 
          deleteSuccessCallback={ () => {history.push(`/projects/${projectId}/pages`)} }
        />
      </div>  
    </React.Fragment>
  );
}
