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
          Diffender(ディフェンダー)はWebサイトの表示崩れなどの想定しない変更点を視覚的に検出するE2Eテストサービスです。<br/>
        </div>
        <div className={styles.link}>
          <Link to={"/aaaaa"}>
            <i className="fas fa-angle-double-right"/> もっと詳しくDiffenderについて知る</Link>
        </div>

        <h1 className={styles.h1}>Diffenderの使い方</h1>
        <div className={styles.message}>
          DiffenderでWebページの差分を検出するには<b>3つのStep</b>が必要です。
        </div>
        <UsageMenu />
        <div className={styles.betaMessage}>
          本サービスはベータ版です。以下の機能制限が存在します。<br/>
          ・<Link to={"/results"}>テスト結果</Link>は<b>登録後5日で自動削除</b>されます
        </div>
      </div>
    </React.Fragment>
  );
}