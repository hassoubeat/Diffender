import React from 'react';
import styles from './DivideForm.module.scss';

export default function DivideForm(props = null) {

  return (
    <React.Fragment>
      <div className={styles.divideForm}>
        <div className={`${styles.block} ${styles.appInfo}`}>
          <div className={styles.title}>
            {process.env.REACT_APP_PROJECT_NAME}
          </div>
          <div className={styles.description}>
            DiffenderはWebサイトのスクリーンショットを撮影し、
            撮影したスクリーンショット同士を比較して変更点を検知するE2Eテストツールです。
          </div>
          <div className={styles.detail}>
            <img className={styles.image} src="/img/bgSignInLandScape.png" alt="diff" />
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.spTitle}>
            {process.env.REACT_APP_PROJECT_NAME}
          </div>
          {props.children}
        </div>
      </div>
    </React.Fragment>
  );
}