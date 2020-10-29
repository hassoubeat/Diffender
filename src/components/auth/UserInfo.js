import React from 'react';
import UpdateUserAttributes from './UpdateUserAttributes';
import ChangePassword from './ChangePassword';
import styles from './UserInfo.module.scss';

export default function UserInfo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.userInfo}>
        <div className="sectionTitle">ユーザ情報変更</div>
        <UpdateUserAttributes/>
        <div className="sectionTitle">パスワード変更</div>
        <ChangePassword/>
      </div>
    </React.Fragment>
  );
}
