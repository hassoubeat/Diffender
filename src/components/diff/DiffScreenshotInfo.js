import React from 'react';
import { Link } from 'react-router-dom';

import DiffRequestForm from './DiffRequestForm';
import styles from './DiffScreenshotInfo.module.scss';

export default function ScreenshotInfo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.diffScreenshotInfo}>
        <div className="sectionTitle">スクリーンショットの差分取得</div>
        <div className={styles.infoMessage}>
          ２つの<Link to={"/results"}>リザルト</Link>を指定してスクリーンショットの差分(Diff)を取得します。<br/>
          差分の取得結果は<Link to={"/results"}>リザルト</Link>として登録されます。<br/>
          ※ 比較するスクリーンショット数が多い場合、完了まで時間がかかります<br/>
          ※ 同じプロジェクトから出力されたリザルト同士の比較が可能です。<br/>
          ※ 同じページから出力されたスクリーンショットを比較を実行します。
        </div>
        <DiffRequestForm />
      </div>
    </React.Fragment>
  );
}
