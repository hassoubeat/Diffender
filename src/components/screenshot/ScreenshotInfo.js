import React from 'react';
import { Link } from 'react-router-dom';

import ScreenshotRequestForm from './ScreenshotRequestForm';
import styles from './ScreenshotInfo.module.scss';

export default function ScreenshotInfo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.screenshotInfo}>
        <div className="sectionTitle">スクリーンショットの取得</div>
        <div className={styles.infoMessage}>
          <Link to={"/projects"}>サイト</Link>に登録されているページのスクリーンショットを取得します。<br/>
          スクリーンショットの取得結果は<Link to={"/results"}>ギャラリー</Link>に登録されます。<br/>
          ※ ページ数が多い場合、全ページの取得完了まで時間がかかります
        </div>
        <ScreenshotRequestForm />
      </div>
    </React.Fragment>
  );
}
