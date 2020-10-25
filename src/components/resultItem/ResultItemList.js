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
  filterResultItemList,
  getDiffMisMatchPercentageClass
} from 'lib/resultItem/model'
import _ from 'lodash';

import styles from './ResultItemList.module.scss';

const RESULT_ITEM_STATUS_TYPE_SUCCESS = process.env.REACT_APP_RESULT_ITEM_STATUS_TYPE_SUCCESS;

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
          <Link key={resultItem.id} to={`/results/${resultItem.resultItemTieResultId}/result-items/${resultItem.id}`}>
            <div className={`${styles.resultItem} ${resultItem.status.type}`}>
              {resultItem.name}
              {/* ステータスが完了していなければメッセージを表示する */}
              { (_.get(resultItem, 'status.type') !== RESULT_ITEM_STATUS_TYPE_SUCCESS ) && 
                  <div className={`${styles.message} ${_.get(resultItem, 'status.type')}`}>
                    {_.get(resultItem, 'status.message')}
                  </div>
                }
              <div className={styles.flex}>
                {/* 登録日付 */}
                <div className={styles.createDate}>
                  {resultItem.createDt}
                </div>
                {/* Diff%が存在するときのみ表示する */}
                { (_.get(resultItem, 'status.misMatchPercentage') >= 0) && 
                  <div className={`${styles.diffPer} ${getDiffMisMatchPercentageClass(_.get(resultItem, 'status.misMatchPercentage'))}`}>
                    {_.get(resultItem, 'status.misMatchPercentage')}%
                  </div>
                }
              </div>
            </div>
          </Link>
        ))}
        { (resultItemList.length === 0) &&
          <React.Fragment>
            リザルトアイテムは存在しません。
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  );
}
