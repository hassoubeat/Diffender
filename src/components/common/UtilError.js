import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from './UtilError.module.scss';

export default function UtilError(props = null) {
  // props setup
  const errorTitle = props.errorTitle || "Error";
  const errorMessage = props.errorMessage || "エラーが発生しました";

  // hook setup
  const history = useHistory();

  return (
    <div className={styles.notFound}>
      <div className={styles.title}>{errorTitle}</div>
      <div className={styles.description}>
        {errorMessage}
      </div>
      <div className={styles.actions}>
        <Link to="/" onClick={() => {
          history.push('/')
          history.go(0)
        }}>
          TOPに戻る
        </Link>
      </div>
    </div>
  );
}
