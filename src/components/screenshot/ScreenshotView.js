import React, { useState } from 'react';
import styles from './ScreenshotView.module.scss';

export default function ScreenshotView(props = null) {
  // props setup
  const screenshotURL = props.screenshotURL;

  // state setup
  const [screenshotZoom, setScreenshotZoom] = useState(false);

  return (
    <React.Fragment>
      <div className={styles.screenshotView}>
        { screenshotURL ? 
          <img 
            className={`${styles.screenshot} ${(screenshotZoom) ? styles.zoom : ""}`}
            src={screenshotURL} 
            alt="screenshot"
            onClick={() => {
              setScreenshotZoom(!screenshotZoom)
            }}
          /> : 
          <div className={styles.notfound}>
            スクリーンショットがありません
          </div>
        }
      </div>
    </React.Fragment>
  );
}
