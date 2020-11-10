import React from 'react';
import { Link } from 'react-router-dom';

import DiffRequestForm from './DiffRequestForm';
import styles from './DiffScreenshotInfo.module.scss';

export default function ScreenshotInfo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.diffScreenshotInfo}>
        <div className="sectionTitle">Diffの検出</div>
        <div className={styles.infoMessage}>
          スクリーンショットを比較してDiff(差分)を検出します。<br/>
          差分の検出結果は<Link to={"/results"}>テスト結果</Link>に登録されます。<br/>
        </div>
        <div className={styles.note}>
          ※ 同じページから撮影されたスクリーンショットの比較を実行します。
        </div>
        <DiffRequestForm />
      </div>
    </React.Fragment>
  );
}
