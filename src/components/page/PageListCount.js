import React from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentUserOption } from 'app/userSlice';
import { selectPagesByProjectId } from 'app/domainSlice';

import styles from 'styles/ListCount.module.scss';

export default function PageListCount(props = null) {
  // props setup
  const projectId = props.projectId;

  // redux-state setup
  const userOption = useSelector(selectCurrentUserOption);
  const pageList = useSelector(selectPagesByProjectId(projectId));

  return (
    <React.Fragment>
      <span className={styles.listCount}>
        {pageList.length}/{userOption.pageRegisterLimit}
      </span>
    </React.Fragment>
  );
}