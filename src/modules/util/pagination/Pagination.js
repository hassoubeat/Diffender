import React, { useState } from 'react';
import styles from './Pagination.module.scss';

export default function Pagination(props = null) {
  // propsの展開
  const renderList = props.renderList || [];

  // Stateの設定
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <React.Fragment>
      <div className={styles.pagination}>
        {
          renderList.map( (renderItem, index) => (
            <div key={index} className={`${styles.page} ${(index + 1 === currentPage) && styles.display}`}>
              {renderItem}
            </div>
          ))
        }
        <div className={styles.actions}>
          <PageButton
            buttonText="戻る"
            clickEvent={() => {
              setCurrentPage(currentPage - 1);
            }}
            isDisplay={
              (currentPage > 1)
            }
            className={styles.previewPageButton}
          />
          <div className={styles.space}></div>
          <PageButton
            buttonText="進む"
            clickEvent={() => {
              setCurrentPage(currentPage + 1);
            }}
            isDisplay={
              (currentPage < renderList.length)
            }
            className={styles.previewPageButton}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

function PageButton(props = null) {
  // props展開
  const isDisplay = props.isDisplay;
  const className = props.className || "";
  const buttonText = props.buttonText || "";
  const clickEvent = props.clickEvent || {};

  if (isDisplay) {
    return (
      <div className={`${className} ${styles.pageButton}`} onClick={ () => { clickEvent() } } >
        {buttonText}
      </div>
    );
  } else {
    return <React.Fragment></React.Fragment>;
  }
}
