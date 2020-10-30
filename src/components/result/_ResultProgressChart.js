import React from 'react';
import { useSelector } from 'react-redux';
import RoundChart from 'components/util/chart/RoundChart';
import Loading from 'components/common/Loading';

import { 
  selectIsLoadedResultItemsByResultId,
  selectResultItemsByResultId
} from 'app/domainSlice';


import _ from "lodash";

import { 
  RESULT_ITEM_STATUS_TYPE_SUCCESS, 
  RESULT_ITEM_STATUS_TYPE_ERROR, 
  RESULT_ITEM_STATUS_TYPE_WAIT
} from 'lib/util/const'

import styles from './_ResultProgressChart.module.scss';

export default function ReusltList(props = null) {
  // props setup
  const resultId = props.resultId;

  // redux-state setup
  const isLoadedResultItem = useSelector( selectIsLoadedResultItemsByResultId(resultId) );
  const resultItemList = useSelector( selectResultItemsByResultId(resultId));
  
  // state setup
  const progressState = generateProgressState(resultItemList)

  if (!isLoadedResultItem) return (
    <Loading/>
  );

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

  function generateProgressState(resultItemList) {
    let successItemTotal = 0;
    let errorItemTotal = 0;
    let waitItemTotal = 0;

    resultItemList.forEach( (resultItem) => {
      switch(_.get(resultItem, "status.type")) {
        case RESULT_ITEM_STATUS_TYPE_SUCCESS: {
          successItemTotal++;
          break;
        }
        case RESULT_ITEM_STATUS_TYPE_ERROR: {
          errorItemTotal++;
          break;
        }
        case RESULT_ITEM_STATUS_TYPE_WAIT: {
          waitItemTotal++;
          break;
        }
        default: {
          console.log(`unknown status [${resultItem.status.type}].`);
        }
      }
    });

    return [
      {
        type: RESULT_ITEM_STATUS_TYPE_SUCCESS,
        name: "正常終了",
        value: successItemTotal
      },
      {
        type: RESULT_ITEM_STATUS_TYPE_ERROR,
        name: "エラー",
        value: errorItemTotal
      },
      {
        type: RESULT_ITEM_STATUS_TYPE_WAIT,
        name: "実行待ち",
        value: waitItemTotal
      }
    ]
  }
}
