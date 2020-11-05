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
          ２つの<Link to={"/results"}>テスト結果</Link>を指定して登録されているスクリーンショットを比較、差分を取得します。<br/>
          差分の取得結果は<Link to={"/results"}>テスト結果</Link>に登録されます。<br/>
        </div>
        <div className={styles.note}>
          ※ 同じページから撮影されたスクリーンショットの比較を実行します。
        </div>
        <DiffRequestForm />
      </div>
    </React.Fragment>
  );
}
