import React from 'react';
import styles from './DivideForm.module.scss';
import { PROJECT_NAME } from 'lib/util/const'

export default function DivideForm(props = null) {
  // propsの展開
  const chidrenPosition = props.position || "right";

  return (
    <React.Fragment>
      <div className={styles.divideForm}>
        { (chidrenPosition === "left") && 
          <div className={styles.block}>
            <div className={styles.spTitle}>
              {PROJECT_NAME}
            </div>
            {props.children}
          </div>
        }
        <div className={`${styles.block} ${styles.appInfo}`}>
          <div className={styles.title}>
            {PROJECT_NAME}
          </div>
          <div className={styles.description}>
            DiffenderはWebサイトのスクリーンショットを撮影し、
            撮影したスクリーンショット同士を比較して変更点を検知するE2Eテストツールです。
          </div>
          <div className={styles.detail}>
            <img className={styles.image} src="/img/bgSignInLandScape.png" alt="diff" />
          </div>
        </div>
        { (chidrenPosition === "right") && 
          <div className={styles.block}>
            <div className={styles.spTitle}>
              {PROJECT_NAME}
            </div>
            {props.children}
          </div>
        }
      </div>
    </React.Fragment>
  );
}