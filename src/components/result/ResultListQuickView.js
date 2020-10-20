import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { 
  selectResults
} from 'app/domainSlice';

import _ from 'lodash';
import {
  sort
} from 'lib/result/model';
import {
  getLSItem,
  setLSItem,
  toBoolean
} from 'lib/util/localStorage'
import styles from 'styles/QuickView.module.scss';

export default function ResultListQuickView(props = null) {
  // props setup
  const selectedResultId = props.selectedResultId;

  // hook setup
  const history = useHistory();

  // redux-state setup
  const resultList = sort(
    _.cloneDeep(useSelector(selectResults({})
  )));

  // state setup
  const [isDisplayMenu, setIsDisplayMenu] = useState(
    toBoolean(getLSItem('isDisplayResultQuickMenu', false)) 
  );

  // メニュー表示切り替え
  const handleDisplayMenuToggle = () => {
    setLSItem('isDisplayResultQuickMenu', !isDisplayMenu);
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
              history.push(`/results`)}
            }
          >
           <i className="fas fa-list"/> リザルト一覧
          </div>
          {resultList.map( (result) => (
              <div 
                key={result.id}
                id={result.id} 
                className={`
                  ${styles.menuItem} 
                  ${(result.id === selectedResultId) && styles.selected}
                `}
                onClick={() => { 
                  history.push(`/results/${result.id}`)}
                }
              >
                <div className={styles.main}>
                  <span className={styles.title}>
                    {result.name}
                  </span>
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
            Results
          </div>
        </div>
      }
    </React.Fragment>
  );
}