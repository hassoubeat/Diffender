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
        history.push("/projects?isIntialDisplayRegisterModal=true");
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
          差分を検出するために登録したサイトとページからスクリーンショットを撮影しましょう！(※)<br/>
          撮影したスクリーンショットは<span className="linkButton" onClick={(e) => {
            e.stopPropagation();
            history.push("/results");
          }}>テスト結果</span>に登録されます！
          <p></p>
          <div className={styles.note}>
            ※ 差分を検出するためにスクリーンショットは<b>2回撮影</b>してください。<br/>
            　1回目. 正常動作しているサイトのスクリーンショット<br/>
            　2回目. 1回目からサイトに変更を加えた後のスクリーンショット
          </div>
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
          Step3. DIff(差分)を検出する
        </div>
        <div className={styles.message}>
          撮影したスクリーンショットから差分を検出しましょう！<br/>
          差分を検出した画像は<span className="linkButton" onClick={(e) => {
            e.stopPropagation();
            history.push("/results");
          }}>テスト結果</span>に登録されます！
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