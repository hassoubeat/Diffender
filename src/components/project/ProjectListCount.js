import React from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentUserOption } from 'app/userSlice';
import { selectProjects } from 'app/domainSlice';

import styles from 'styles/ListCount.module.scss';

export default function ProjectListCount(props = null) {
  // redux-state setup
  const userOption = useSelector(selectCurrentUserOption);
  const projectList = useSelector(selectProjects);

  return (
    <React.Fragment>
      <span className={styles.listCount}>
        {projectList.length}/{userOption.projectRegisterLimit}
      </span>
    </React.Fragment>
  );
}