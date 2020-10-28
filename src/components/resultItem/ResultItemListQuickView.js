import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ResultItemListCount from './ResultItemListCount';
import Loading from 'components/common/Loading';

import { 
  setLoadStateResultItemList,
  selectIsLoadedResultItemsByResultId,
  selectResultItemsByResultId
} from 'app/domainSlice';

import {
  sort,
  getDiffMisMatchPercentageClass
} from 'lib/resultItem/model';

import {
  getLSItem,
  setLSItem,
  toBoolean
} from 'lib/util/localStorage'

import _ from 'lodash';

import styles from 'styles/QuickView.module.scss';

export default function ResultItemListQuickView(props = null) {
  // props setup
  const resultId = props.resultId;
  const selectedResultItemId = props.selectedResultItemId;

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const isLoadedResultItem = useSelector( selectIsLoadedResultItemsByResultId(resultId) );
  const resultItemList = sort(
    useSelector( selectResultItemsByResultId(resultId) )
  );

  // state setup
  const [isDisplayMenu, setIsDisplayMenu] = useState(
    toBoolean(getLSItem('isDisplayResultItemQuickMenu', false)) 
  );

  // メニュー表示切り替え
  const handleDisplayMenuToggle = () => {
    setLSItem('isDisplayResultItemQuickMenu', !isDisplayMenu);
    setIsDisplayMenu(!isDisplayMenu);
  }

  // 一覧の表示コンポーネント
  const ResultItemList = () => {
    // 一件もデータが存在しない時
    if (resultItemList.length === 0 ) {
      return (
        <div className={styles.noData}> No Data </div>
      )
    };
    return resultItemList.map( (resultItem) => (
      <div 
        key={resultItem.id}
        id={resultItem.id} 
        className={`
          ${styles.menuItem} 
          ${(resultItem.id === selectedResultItemId) && styles.selected}
        `}
        onClick={() => { 
          history.push(`/results/${resultId}/result-items/${resultItem.id}`)}
        }
      >
        <div className={styles.main}>
          <span className={`${styles.title} ${resultItem.status.type}`}>
            {resultItem.name}
          </span>
          {/* Diff%が存在するときのみ表示する */}
          { (_.get(resultItem, 'status.misMatchPercentage') >= 0) && 
            <div className={`${styles.sub} ${getDiffMisMatchPercentageClass(_.get(resultItem, 'status.misMatchPercentage'))}`}>
              {_.get(resultItem, 'status.misMatchPercentage')}%
            </div>
          }
        </div>
      </div>
    ))
  }

  // リザルトアイテム一覧の再読み込み
  const reload = () => {
    dispatch( setLoadStateResultItemList({
      resultId: resultId,
      isLoaded: false
    }));
  };

  return (
    <React.Fragment>
      {isDisplayMenu && 
        <div className={`${styles.quickView}`}>
          <div 
            className={styles.closeMenuItem}
            onClick={ () => { 
              handleDisplayMenuToggle()
            }}
          >
            <div>
              <i className="fas fa-angle-double-left" /> close
            </div>
          </div>
          <div 
            className={styles.gotoListMenuItem}
            onClick={ () => { 
              history.push(`/results/${resultId}/result-items`)}
            }
          >
            <div className={styles.main}>
              <i className="fas fa-list"/> アイテム一覧
            </div>
            <ResultItemListCount resultId={resultId} />
          </div>
          <div 
            className={styles.reloadListMenuItem}
            onClick={ () => { reload() }}
          >
            <div>
              <i className="fas fa-sync"></i> リロード
            </div>
          </div>
          { (isLoadedResultItem) ?
            <ResultItemList/> : <Loading/>
          }
        </div>
      }
      {!isDisplayMenu && 
        <div className={`${styles.closeQuickView}`} onClick={() => {
          handleDisplayMenuToggle();
        }}>
          <i className="fas fa-angle-double-right" />
          <div className={styles.label}>
            ResultItems
          </div>
        </div>
      }
    </React.Fragment>
  );
}