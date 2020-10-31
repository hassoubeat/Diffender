import React from 'react';
import { Link } from 'react-router-dom';

import DiffRequestForm from './DiffRequestForm';
import styles from './DiffScreenshotInfo.module.scss';

export default function ScreenshotInfo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.diffScreenshotInfo}>
        <div className="sectionTitle">スクリーンショットのDiff(差分)取得</div>
        <div className={styles.infoMessage}>
          ２つの<Link to={"/results"}>ギャラリー</Link>を指定してスクリーンショットの差分を取得します。<br/>
          差分の取得結果は<Link to={"/results"}>ギャラリー</Link>に登録されます。<br/>
        </div>
        <div className={styles.note}>
          ※ 同じサイトのギャラリー同士の比較が可能です。<br/>
          ※ 同じページから出力されたスクリーンショットを比較を実行します。<br/>
          ※ 比較するスクリーンショット数が多い場合、全差分の取得完了まで時間がかかります。
        </div>
        <DiffRequestForm />
      </div>
    </React.Fragment>
  );
}
