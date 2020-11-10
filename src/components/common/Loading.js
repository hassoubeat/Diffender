import React from 'react';
import styles from './Loading.module.scss';

export default function Loading(props = null) {
  return (
    <React.Fragment>
      <div className={styles.loading}>
        <img className={styles.loadingImage} src={"/img/loading.gif"} alt="loading" />
      </div>
    </React.Fragment>
  );
}