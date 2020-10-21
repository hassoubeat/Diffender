import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from 'components/common/Loading';

import { 
  selectIsLoadedResultItemsByResultId,
  selectResultItemsByResultId,
  fetchResultItemsByResultId
} from 'app/domainSlice';

import { 
  sort,
  filterResultItemList
} from 'lib/resultItem/model'

import styles from './ResultItemList.module.scss';

export default function ResultItemList(props = null) {
  // props setup
  const resultId = props.resultId;

  // hook setup
  const dispatch = useDispatch();

  // redux-state setup
  const isLoadedResultItem = useSelector( selectIsLoadedResultItemsByResultId(resultId) );
  const resultItemList = sort(
    useSelector( selectResultItemsByResultId(resultId) )
  );

  // Stateの設定
  const [searchWord, setSearchWord] = useState("");
  const [isDisplayResultProgressSuccess, setIsDisplayResultProgressSuccess] = useState(true);
  const [isDisplayResultProgressError, setIsDisplayResultProgressError] = useState(true);
  const [isDisplayResultProgressWait, setIsDisplayResultProgressWait] = useState(true);

  const filterObj = {
    searchWord: searchWord,
    isDisplayResultProgressSuccess: isDisplayResultProgressSuccess,
    isDisplayResultProgressError: isDisplayResultProgressError,
    isDisplayResultProgressWait: isDisplayResultProgressWait
  }

  useEffect( () => {
    // 一度読み込みが完了している場合は再読み込みを実行しない
    if (!isLoadedResultItem) dispatch( fetchResultItemsByResultId(resultId) );
  }, [dispatch, resultId, isLoadedResultItem])

  if (!isLoadedResultItem) return (
    <Loading/>
  );

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
          <Link key={resultItem.id} to={`/results/${resultItem.resultItemTieResultId}/item/${resultItem.id}`}>
            <div className={`${styles.resultItem} ${resultItem.status.type}`}>
              {resultItem.name}
              <div className={styles.createDate}>
                {resultItem.createDt}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </React.Fragment>
  );
}
