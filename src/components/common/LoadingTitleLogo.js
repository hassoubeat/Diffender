import React from 'react';
import styles from './LoadingTitleLogo.module.scss';

export default function LoadingTitleLogo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.loading}>
        <img className={styles.loadingImage} src={"/img/loadingTitleLogo.gif"} alt="loading" />
      </div>
    </React.Fragment>
  );
}