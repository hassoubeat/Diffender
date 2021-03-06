import React from 'react';
import { Link } from 'react-router-dom';

import ScreenshotRequestForm from './ScreenshotRequestForm';
import styles from './ScreenshotInfo.module.scss';

export default function ScreenshotInfo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.screenshotInfo}>
        <div className="sectionTitle">スクリーンショットの撮影</div>
        <div className={styles.infoMessage}>
          <Link to={"/projects"}>サイト</Link>に登録されているページのスクリーンショットを撮影します。<br/>
          スクリーンショットの撮影結果は<Link to={"/results"}>テスト結果</Link>に登録されます。<br/>
        </div>
        <div className={styles.note}>
        </div>
        <ScreenshotRequestForm />
      </div>
    </React.Fragment>
  );
}
