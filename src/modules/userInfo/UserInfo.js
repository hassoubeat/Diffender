import React from 'react';
import ChangePassword from 'modules/auth/ChangePassword';
import styles from './UserInfo.module.scss';

export default function UserInfo(props = null) {
  return (
    <React.Fragment>
      <div className={styles.userInfo}>
        <ChangePassword/>
      </div>
    </React.Fragment>
  );
}
