import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { 
  selectIsLoadedResultItemsByResultId,
  selectResultItem,
  fetchResultItemsByResultId
} from 'app/domainSlice';

import ScreenshotView from 'components/util/screenshot/ScreenshotView';

import _ from 'lodash';
import styles from './ResultItemInfo.module.scss';

export default function ResultItemInfo(props = null) {
  // props setup
  const resultId = props.resultId;
  const resultItemId = props.resultItemId;

  // hook setup
  const dispatch = useDispatch();

  // redux-state setup
  const isLoadedResultItem = useSelector( selectIsLoadedResultItemsByResultId(resultId) );
  const resultItem = useSelector( selectResultItem(resultItemId) ) || {};

  useEffect( () => {
    // 一度読み込みが完了している場合は再読み込みを実行しない
    if (!isLoadedResultItem) dispatch( fetchResultItemsByResultId(resultId) );
  }, [dispatch, resultId, isLoadedResultItem])

  return (
    <React.Fragment>
      <div className={styles.resultItemInfo}>
        <div className={styles.sctionTitle}>{resultItem.name}</div>
        <ScreenshotView screenshotURL={_.get(resultItem, 'status.screenshotKey')} />
      </div>
    </React.Fragment>
  );
}
