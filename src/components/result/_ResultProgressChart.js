import React, { useState, useEffect } from 'react';
import RoundChart from 'components/util/chart/RoundChart';
import styles from './_ResultProgressChart.module.scss';

export default function ReusltList(props = null) {
  // propsの展開
  const resultId = props.resultId;
  
  // Stateの設定
  const [isLoading, setIsLoading] = useState(true);
  const [progressState, setProgressState] = useState([]);

  useEffect( () => {
    // プロジェクト一覧を取得して、Stateを更新
    const updateProgressState = async () => {
      setProgressState(await getProgressState(resultId));
      setIsLoading(false);
    };
    updateProgressState();
  }, [resultId]);

  if(isLoading) return <span>Loading...</span>

  return (
    <React.Fragment>
      <div className={styles.resultProgressChart}>
        <div className={styles.title}>進行状況</div>
        <div className={styles.content}>
          <RoundChart
            width={200}
            height={200}
            data={progressState}
            colors={["#5AAB16", "#E34D36", "#65B2F5"]}
          />
          <ul className={styles.detail}>
            { 
              progressState.map( (state) => (　
                <li className={state.type} key={state.type}>
                  <span className={styles.type}>{state.name}</span> ... {state.value}
                </li>
              )) 
            }
          </ul>
        </div>
      </div>
    </React.Fragment>
  );

  async function getProgressState(resultId) {
    // TODO いずれlibにAPIを実装してそちらからデータを取得
    return [
      {
        type: "SUCCESS",
        name: "正常終了",
        value: 15
      },
      {
        type: "ERROR",
        name: "エラー",
        value: 10
      },
      {
        type: "WAIT",
        name: "実行待ち",
        value: 75
      }
    ]
  }
}
