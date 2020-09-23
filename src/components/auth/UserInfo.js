import React from 'react';
import UpdateUserAttributes from './UpdateUserAttributes';
import ChangePassword from './ChangePassword';
import styles from './UserInfo.module.scss';

export default function UserInfo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.userInfo}>
        <div className={styles.title}>ユーザ情報の編集</div>
        <section id="updateUserAttributes" className={styles.section}>
          <div className={styles.sectionTitle}>ユーザ属性変更</div>
          <UpdateUserAttributes/>
        </section>
        <section id="changePassword" className={styles.section}>
          <div className={styles.sectionTitle}>パスワード変更</div>
          <ChangePassword/>
        </section>
      </div>
    </React.Fragment>
  );
}
