import React, { useState } from 'react';
import ScreenshotView from 'components/screenshot/ScreenshotView';

import {
  getLSItem,
  setLSItem
} from 'lib/util/localStorage'

import styles from './DiffScreenshotView.module.scss';

export default function DiffScreenshotView(props = null) {
  // props setup
  const originScreenshotUrl = props.originScreenshotUrl;
  const targetScreenshotUrl = props.targetScreenshotUrl;
  const screenshotURL = props.screenshotUrl;

  // state setup
  const [isDisplayOrigin, setIsDisplayOrigin] = useState(
    getLSItem('isDiffViewDisplayOrigin', true)
  );
  const [isDisplayTarget, setIsDisplayTarget] = useState(
    getLSItem('isDiffViewDisplayTarget', true)
  );
  const [isDisplayDiff, setIsDisplayDiff] = useState(
    getLSItem('isDiffViewDisplayDiff', true)
  );

  return (
    <React.Fragment>
      <div className={styles.diffScreenshotView}>
        <div className={styles.header}>
          <div 
            className={`${styles.item} ${isDisplayOrigin ? styles.display : styles.hidden}`}
            onClick={ () => {
              setIsDisplayOrigin(!isDisplayOrigin);
              setLSItem('isDiffViewDisplayOrigin', !isDisplayOrigin);
            }}
          >
            比較元
          </div>
          <div 
            className={`${styles.item} ${isDisplayTarget ? styles.display : styles.hidden}`}
            onClick={ () => {
              setIsDisplayTarget(!isDisplayTarget);
              setLSItem('isDiffViewDisplayTarget', !isDisplayTarget);
            }}
          >
            比較対象
          </div>
          <div 
            className={`${styles.item} ${isDisplayDiff ? styles.display : styles.hidden}`}
            onClick={ () => {
              setIsDisplayDiff(!isDisplayDiff);
              setLSItem('isDiffViewDisplayDiff', !isDisplayDiff);
            }}
          >
            Diff
          </div>
        </div>
        <div className={styles.contents}>
          <div className={`${styles.item} ${isDisplayOrigin ? styles.display : styles.hidden}`} >
            <ScreenshotView screenshotURL={originScreenshotUrl} />
          </div>
          <div className={`${styles.item} ${isDisplayTarget ? styles.display : styles.hidden}`}>
            <ScreenshotView screenshotURL={targetScreenshotUrl} />
          </div>
          <div className={`${styles.item} ${isDisplayDiff ? styles.display : styles.hidden}`}>
          <ScreenshotView screenshotURL={screenshotURL} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
