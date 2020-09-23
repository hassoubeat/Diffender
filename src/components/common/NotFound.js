import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

export default function NotFound() {

  return (
    <div className={styles.notFound}>
      <div className={styles.title}>NotFound(404)</div>
      <div className={styles.description}>
        URLに対応するページは存在しません。
      </div>
      <div className={styles.actions}>
        <Link to="/">
          TOPに戻る
        </Link>
      </div>
    </div>
  );
}
