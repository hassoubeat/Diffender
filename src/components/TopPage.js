import React from 'react';
import { Link } from 'react-router-dom';
import UsageMenu from 'components/common/UsageMenu';



import styles from './TopPage.module.scss';

export default function TopPage(props = null) {
  return (
    <React.Fragment>
      <div className={styles.topPage}>

        <h1 className={styles.h1}>Diffenderへようこそ！</h1>
        <div className={styles.message}>
          Diffenderは視覚的にWebサイトの表示崩れなどの予期しない変更を検知するE2Eテストサービスです。<br/>
          あなたのサイトの予期しないDiff(差分)を検知して品質を守るのに役立ててください。<br/>
        </div>
        <div className={styles.link}>
          <Link to={"/aaaaa"}>
            <i className="fas fa-angle-double-right"/> もっと詳しくDiffenderについて知る</Link>
        </div>

        <h1 className={styles.h1}>Diffenderの使い方</h1>
        <div className={styles.message}>
          Diffenderでサイトの差分を検知するには<b>3つのStep</b>が必要です。
        </div>
        <UsageMenu />
      </div>
    </React.Fragment>
  );
}