import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import ResultForm from './ResultForm';
import ResultProgressChart from './_ResultProgressChart';
import ResultItemList from 'components/resultItem/ResultItemList';

import { selectResult } from 'app/domainSlice';

import styles from './ResultInfo.module.scss';

export default function ResultInfo(props = null) {
  // props setup
  const resultId = props.resultId;
  const history = useHistory();

  // redux-state setup
  const result = useSelector(selectResult(resultId));

  return (
    <React.Fragment>
      <div className={styles.resultInfo}>
      <div className="sectionTitle">基本情報</div>
        <ResultForm resultId={resultId}
          successDeleteCallback={
            () => {history.push('/results/')} 
          }
        />
        <div className="sectionTitle">関連情報</div>
        <div className={styles.relationInfomation}>
          <Link to={`/projects/${result.resultTieProjectId}`}>
            <i className="fas fa-angle-double-right"/> リザルトを発行したプロジェクト
          </Link>
        </div>
        <div className="sectionTitle">レポート</div>
        <div className={styles.chartArea}>
          <div className={styles.chart}>
            <ResultProgressChart resultId={resultId} />
          </div>
        </div>
        
        {/* TODO 混雑状況棒グラフ */}
        <ResultItemList resultId={resultId} />
      </div>
    </React.Fragment>
  );
}
