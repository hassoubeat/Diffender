import React from 'react';
import { useSelector } from 'react-redux';

import { selectResultItemsByResultId } from 'app/domainSlice';

import styles from 'styles/ListCount.module.scss';

export default function ResultListCount(props = null) {
  // props setup
  const resultId = props.resultId;

  // redux-state setup
  const resultItemList = useSelector( selectResultItemsByResultId(resultId));

  return (
    <React.Fragment>
      <span className={styles.listCount}>
        {resultItemList.length}
      </span>
    </React.Fragment>
  );
}