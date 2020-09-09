import React from 'react';
import styles from './_BasicForm.module.scss';

export default function BasicForm(props = null) {
  // パラメータ取得
  const {pageName, setPageName} = props.payload;
  const {pageDescription, setPageDescription} = props.payload;

  return (
    <React.Fragment>
      <div className={styles.basicForm}>
        {/* ページ名の入力フォーム */}
        <div className={styles.inputItem}>
          <label className={styles.inputLabel}>
            ページ名
          </label>
          <div>
            <input className={styles.inputText} type="text" placeholder=" 例： Topページ" value={pageName} 
              onChange={(e) => {setPageName(e.target.value)}} 
            />
          </div>
        </div>
        {/* ページ名の入力フォーム */}
        <div className={styles.inputItem}>
          <label className={styles.inputLabel}>
            ページの説明
          </label>
          <div>
            <input className={styles.inputText} type="text" placeholder=" 例： Topページの正常系テスト" value={pageDescription} 
              onChange={(e) => {setPageDescription(e.target.value)}} 
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
