import React from 'react';
import ChangePassword from 'modules/auth/ChangePassword';
import styles from './UserInfo.module.scss';

export default function UserInfo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.userInfo}>
        <div className={styles.title}>ユーザ情報の編集</div>
        <section id="changePassword">
          <div className={styles.sectionTitle}>パスワード変更</div>
          <ChangePassword/>
        </section>
      </div>
    </React.Fragment>
  );
}
