import React from 'react';
import styles from './_ScreenshotOptionsForm.module.scss';

export default function ScreenshotOptionsForm(props = null) {
  // パラメータ取得
  const {screenshotOptions, setScreenshotOptions} = props.payload;

  return (
    <React.Fragment>
      <div className={styles.screenshotOptionsForm}>
          <input className={styles.checkBox} type="checkBox" checked={!!screenshotOptions.fullPage} onChange={
            (e) => { 
              screenshotOptions.fullPage = e.target.checked;
              setScreenshotOptions(Object.assign({}, screenshotOptions));
            }
          } />全画面撮影
      </div>
    </React.Fragment>
  );
}
