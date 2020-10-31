import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { 
  selectProjects,
  selectResults
} from 'app/domainSlice';

import styles from './UsageMenu.module.scss';

export default function UsageMenu(props = null) {
  // hook setup
  const history = useHistory();

  // redux state setup
  const projectList = useSelector(selectProjects);
  const resultList = useSelector(selectResults({}));

  const isActiveStepTwo = (projectList.length > 0);
  const isActiveStepThree = (resultList.length > 1);

  const StepOne = () => {
    return (
      <div className={`${styles.usage}`} onClick={() => {
        history.push("/projects");
      }}>
        <div className={styles.title}>
          Step1. サイトとページを登録する
        </div>
        <div className={styles.message}>
          まずはDiff(差分)を取得したいサイトとページを登録しましょう！
        </div>
      </div>
    )
  }

  const StepTwo = () => {
    return (
      <div className={`${styles.usage} ${ (!isActiveStepTwo) && styles.disable }`} onClick={() => {
        history.push("/screenshot-request");
      }}>
        <div className={styles.title}>
          Step2. スクリーンショットを撮影する
        </div>
        <div className={styles.message}>
          差分を検出するために登録したサイトとページからスクリーンショットを撮影しましょう！<br/>
          撮影したスクリーンショットは<span className="linkButton" onClick={(e) => {
            e.stopPropagation();
            history.push("/results");
          }}>ギャラリー</span>に登録されます！
        </div>
      </div>
    )
  }

  const StepThree = () => {
    return (
      <div className={`${styles.usage} ${ (!isActiveStepThree) && styles.disable }`} onClick={() => {
        history.push("/diff-screenshot-request");
      }}>
        <div className={styles.title}>
          Step3. DIff(差分)を検知する
        </div>
        <div className={styles.message}>
          撮影したギャラリーを2つ選択してスクリーンショットの差分を検出しましょう！<br/>
          差分を抽出した画像は<span className="linkButton" onClick={(e) => {
            e.stopPropagation();
            history.push("/results");
          }}>ギャラリー</span>に登録されます！
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className={styles.usageMenu}>
        <StepOne/>
        <StepTwo/>
        <StepThree/>
      </div>
    </React.Fragment>
  );
}