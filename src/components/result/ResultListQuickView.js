import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ResultListCount from './ResultListCount';

import { 
  selectResults
} from 'app/domainSlice';

import _ from 'lodash';
import {
  sort,
  filterResultList
} from 'lib/result/model';
import {
  getLSItem,
  setLSItem
} from 'lib/util/localStorage'
import styles from 'styles/QuickView.module.scss';

export default function ResultListQuickView(props = null) {
  // props setup
  const projectId = props.projectId;
  const selectedResultId = props.selectedResultId;
  const isDisplayListCount = props.isDisplayListCount === undefined ? true : props.isDisplayListCount;
  const isSearchScreenshotResultFilter = props.isSearchScreenshotResultFilter  === undefined ? true : props.isSearchScreenshotResultFilter;
  const isSearchDiffResultFilter = props.isSearchDiffResultFilter  === undefined ? true : props.isSearchDiffResultFilter;
  const toResultInfoLink = props.toResultInfoLink || "/results";

  const filterObj = {
    searchWord: "",
    isSearchScreenshotResultFilter: isSearchScreenshotResultFilter,
    isSearchDiffResultFilter: isSearchDiffResultFilter
  }

  // hook setup
  const history = useHistory();

  // redux-state setup
  const resultList = sort(
    _.cloneDeep(useSelector(selectResults({projectId: projectId})
  )));

  // state setup
  const [isDisplayMenu, setIsDisplayMenu] = useState(
    getLSItem('isDisplayResultQuickMenu', true) 
  );

  // メニュー表示切り替え
  const handleDisplayMenuToggle = () => {
    setLSItem('isDisplayResultQuickMenu', !isDisplayMenu);
    setIsDisplayMenu(!isDisplayMenu);
  }

  // 一覧の表示コンポーネント
  const ResultList = () => {
    // 一件もデータが存在しない時
    if (resultList.length === 0 ) {
      return (
        <div className={styles.noData}> No Data </div>
      )
    }
    return filterResultList(resultList, filterObj).map( (result) => (
      <div 
        key={result.id}
        id={result.id} 
        className={`
          ${styles.menuItem} 
          ${(result.id === selectedResultId) && styles.selected}
        `}
        onClick={() => { 
          history.push(`${toResultInfoLink}/${result.id}`)}
        }
      >
        <div className={styles.main}>
          <span className={`${styles.title} ${result.resultType}`}>
            {result.name}
          </span>
        </div>
      </div>
    ))
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
            <div>
              <i className="fas fa-angle-double-left" /> close
            </div>
          </div>
          <div 
            className={styles.gotoListMenuItem}
            onClick={ () => { 
              history.push(toResultInfoLink)}
            }
          >
            <div className={styles.main}>
              <i className="fas fa-list"/> テスト結果一覧
            </div>
            { isDisplayListCount &&
              <ResultListCount />
            }
          </div>
          <ResultList />
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