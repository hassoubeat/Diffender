import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { 
  selectResultItemsByResultId,
  fetchResultItemsByResultId
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
           <i className="fas fa-angle-double-left" /> close
          </div>
          <div 
            className={styles.gotoListMenuItem}
            onClick={ () => { 
              history.push(`/results/${resultId}/result-items`)}
            }
          >
           <i className="fas fa-list"/> リザルトアイテム一覧
          </div>
          <div 
            className={styles.reloadListMenuItem}
            onClick={ () => { 
              dispatch( fetchResultItemsByResultId(resultId) )
            }}
          >
           <i className="fas fa-sync"></i> リロード
          </div>
          {resultItemList.map( (resultItem) => (
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