import React from 'react';
import { useSelector } from 'react-redux';

import { 
  selectIsLoadedResultItemsByResultId,
  selectResultItem,
} from 'app/domainSlice';

import ScreenshotView from 'components/screenshot/ScreenshotView';
import DiffScreenshotView from 'components/diff/DiffScreenshotView';
import Loading from 'components/common/Loading';

import { 
  getDiffMisMatchPercentageClass
} from 'lib/resultItem/model'

import _ from 'lodash';

import { 
  RESULT_TYPE_SS, 
  RESULT_TYPE_DIFF, 
  RESULT_ITEM_STATUS_TYPE_SUCCESS
} from 'lib/util/const'

import styles from './ResultItemInfo.module.scss';

export default function ResultItemInfo(props = null) {
  // props setup
  const resultId = props.resultId;
  const resultItemId = props.resultItemId;

  // redux-state setup
  const isLoadedResultItem = useSelector( selectIsLoadedResultItemsByResultId(resultId) );
  const resultItem = useSelector( selectResultItem(resultId, resultItemId) ) || {};

  if (!isLoadedResultItem) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <div className={`${styles.resultItemInfo} scroll`}>
        <div className="sectionTitle">{resultItem.name}</div>
        <div className={styles.infomation}>
          <div className={styles.item}>
            <span className={styles.label}>ステータス: </span>
            <span className={`${styles.content} ${styles.status} ${_.get(resultItem, 'status.type')}`}>
              {_.get(resultItem, 'status.type')}
            </span>
          </div>
          { (_.get(resultItem, 'status.type') !== RESULT_ITEM_STATUS_TYPE_SUCCESS ) && 
            <div className={styles.item}>
              <span className={styles.label}>メッセージ: </span>
              <span className={styles.content}>{_.get(resultItem, 'status.message')}</span>
            </div>
          }
          { (_.get(resultItem, 'status.errorDetailMessage')) && 
            <div className={styles.item}>
              <span className={styles.label}>エラー詳細メッセージ: </span>
              <span className={styles.content}>{_.get(resultItem, 'status.errorDetailMessage')}</span>
            </div>
          }
          { (_.get(resultItem, 'status.misMatchPercentage') >= 0) && 
            <div className={styles.item}>
              <span className={styles.label}>Diff％: </span>
              <span className={`${styles.content} ${styles.diffPer} ${getDiffMisMatchPercentageClass(_.get(resultItem, 'status.misMatchPercentage'))}`}>
                {_.get(resultItem, 'status.misMatchPercentage')}%
              </span>
            </div>
            
          }
        </div>
        
        { (resultItem.resultItemType === RESULT_TYPE_SS) &&
          <ScreenshotView screenshotURL={_.get(resultItem, 'status.screenshotUrl')} />
        }
        { (resultItem.resultItemType === RESULT_TYPE_DIFF) &&
          <DiffScreenshotView
            originScreenshotUrl={_.get(resultItem, 'status.originScreenshotUrl')} 
            targetScreenshotUrl={_.get(resultItem, 'status.targetScreenshotUrl')} 
            screenshotUrl={_.get(resultItem, 'status.screenshotUrl')} 
          />
        }
        
      </div>
    </React.Fragment>
  );
}
