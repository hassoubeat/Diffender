import React from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentUserOption } from 'app/userSlice';
import { selectResults } from 'app/domainSlice';

import styles from 'styles/ListCount.module.scss';

export default function ResultListCount(props = null) {
  // props setup
  const projectId = props.projectId;

  // redux-state setup
  const userOption = useSelector(selectCurrentUserOption);
  const resultList = useSelector(selectResults({projectId: projectId}));

  return (
    <React.Fragment>
      <span className={styles.listCount}>
        {resultList.length}/{userOption.resultRegisterLimit}
      </span>
    </React.Fragment>
  );
}