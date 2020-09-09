import React from 'react';
import { useHistory } from 'react-router-dom';
import ResultForm from 'modules/resultForm/ResultForm';
import ResultProgressChart from './_ResultProgressChart';
import ResultItemList from 'modules/resultItemList/ResultItemList';
import styles from './ResultInfo.module.scss';

export default function ResultInfo(props = null) {
  // props展開
  const resultId = props.resultId;
  const history = useHistory();

  return (
    <React.Fragment>
      <div className={styles.resultInfo}>
        <ResultForm resultId={resultId}
          successDeleteCallback={
            () => {history.push('/results/')} 
          }
        />
        <div className={styles.sctionTitle}>レポート</div>
        {/* 進行状況円チャート */}
        <div className={styles.chartArea}>
          <div className={styles.chart}>
            <ResultProgressChart resultId={resultId} />
          </div>
        </div>
        
        {/* TODO 混雑状況棒グラフ */}
        {/* ResultItemリスト */}
        <ResultItemList resultId={resultId} />
      </div>
    </React.Fragment>
  );
}
