import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ResultItemList.module.scss';

export default function ResultItemList(props = null) {
  // propsの展開
  const resultId = props.resultId;

  // Stateの設定
  const [resultItemList, setResultItemList] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [isDisplayResultProgressSuccess, setIsDisplayResultProgressSuccess] = useState(true);
  const [isDisplayResultProgressError, setIsDisplayResultProgressError] = useState(true);
  const [isDisplayResultProgressWait, setIsDisplayResultProgressWait] = useState(true);

  useEffect( () => {
    // ResultItem一覧を取得して、Stateを更新
    const asyncUpdateResultItemList = async () => {
      setResultItemList(await getResultItemList(resultId));
    };
    asyncUpdateResultItemList();
  }, [resultId]);

  const filterObj = {
    searchWord: searchWord,
    isDisplayResultProgressSuccess: isDisplayResultProgressSuccess,
    isDisplayResultProgressError: isDisplayResultProgressError,
    isDisplayResultProgressWait: isDisplayResultProgressWait
  }

  return (
    <React.Fragment>
      <div className={styles.resultItemList}>
        <input className={styles.searchBox} type="text" placeholder="search" onChange={
          (e) => setSearchWord(e.target.value)}
        />
        <div className={styles.filter}>
          <div className={styles.success}>
            <input className={styles.checkBox} type="checkBox" checked={isDisplayResultProgressSuccess} onChange={
              (e) => setIsDisplayResultProgressSuccess(e.target.checked)
            } />正常終了
          </div>
          <div className={styles.error}>
            <input className={styles.checkBox} type="checkBox" checked={isDisplayResultProgressError} onChange={
              (e) => setIsDisplayResultProgressError(e.target.checked)
            } />エラー
          </div>
          <div className={styles.wait}>
            <input className={styles.checkBox} type="checkBox" checked={isDisplayResultProgressWait} onChange={
              (e) => setIsDisplayResultProgressWait(e.target.checked)
            } />実行待ち
          </div>
        </div>
        {/* フィルタリングを行いながら行いながらリザルトアイテム一覧を展開 */}
        {filterResultItemList(resultItemList, filterObj).map( (resultItem) => (
          <Link key={resultItem.id} to={`/results/${resultItem.resultId}/item/${resultItem.id}`}>
            <div className={`${styles.resultItem} ${resultItem.progress}`}>
              {resultItem.name}
              <div className={styles.createDate}>
                {resultItem.createDate}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </React.Fragment>
  );

  function filterResultItemList(resultItemList, filterObj) {
    return resultItemList.filter((resultItem) => { 
      console.log(resultItem);
      return (
        // プロジェクト名に検索ワードが含まれる要素のみフィルタリング
        !!resultItem.name.match(filterObj.searchWord) &&
        (
          // Itemの進行状況が「正常終了」のフィルタリング
          (filterObj.isDisplayResultProgressSuccess && resultItem.progress === "SUCCESS") ||
          // Itemの進行状況が「エラー」のフィルタリング
          (filterObj.isDisplayResultProgressError && resultItem.progress === "ERROR") ||
          // Itemの進行状況が「実行待ち」のフィルタリング
          (filterObj.isDisplayResultProgressWait && resultItem.progress === "WAIT")
        )
      );
    });
  }

  async function getResultItemList(resultId) {
    console.log(resultId);
    // TODO いずれlibにAPIを実装してそちらからデータを取得
    return [
      {
        id: "Item-1",
        name: "アイテム1",
        progress: "SUCCESS",
        resultId: "Result-1",
        createDate: "2020/07/01 15:30:15"
      },
      {
        id: "Item-2",
        name: "アイテム2",
        progress: "ERROR",
        resultId: "Result-1",
        createDate: "2020/07/01 15:30:15"
      },
      {
        id: "Item-3",
        name: "アイテム3",
        progress: "WAIT",
        resultId: "Result-1",
        createDate: "2020/07/01 15:30:15"
      },
    ];
  }
}
