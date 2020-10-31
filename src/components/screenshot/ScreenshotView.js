import React, { useState, useEffect } from 'react';
import Loading from 'components/common/Loading';
import styles from './ScreenshotView.module.scss';

export default function ScreenshotView(props = null) {
  // props setup
  const screenshotURL = props.screenshotURL;

  // state setup
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadError, setIsLoadError] = useState(false);
  const [screenshotZoom, setScreenshotZoom] = useState(false);

  // 画像の読み込みが終わった時に
  const img = new Image();
  img.src = screenshotURL;
  img.onload = () => {
    setIsLoaded(true);
  }
  img.onerror = () => {
    setIsLoadError(true);
  }

  // 画像が変わる度にローディング状況をリセットする
  useEffect( () => {
    setIsLoaded(false);
    setIsLoadError(false);
  }, [screenshotURL]);
  

  if (!screenshotURL) {
    return (
      <div className={styles.notfound}>
        スクリーンショットがありません
      </div>
    )
  }

  if (isLoadError) {
    return (
      <div className={styles.notfound}>
        画像の読み込みに失敗しました
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className={styles.screenshotView}>
        { (isLoaded) ?
          <img 
            className={`${styles.screenshot} ${(screenshotZoom) ? styles.zoom : ""}`}
            src={screenshotURL} 
            alt="screenshot"
            onClick={() => {
              setScreenshotZoom(!screenshotZoom)
            }}
          /> :
          <div className={styles.notfound}>
            <Loading/>
          </div>
        }
      </div>
    </React.Fragment>
  );
}
