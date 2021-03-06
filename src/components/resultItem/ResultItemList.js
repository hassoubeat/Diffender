import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ResultItemListCount from './ResultItemListCount';
import Loading from 'components/common/Loading';

import { 
  selectIsLoadedResultItemsByResultId,
  selectResultItemsByResultId,
  setLoadStateResultItemList
} from 'app/domainSlice';

import { 
  sort,
  filterResultItemList,
  getDiffMisMatchPercentageClass
} from 'lib/resultItem/model'

import _ from 'lodash';

import {  RESULT_ITEM_STATUS_TYPE_SUCCESS} from 'lib/util/const'

import styles from './ResultItemList.module.scss';

export default function ResultItemList(props = null) {
  // props setup
  const resultId = props.resultId;
  const toResultItemInfoLink = props.toResultItemInfoLink || `/results/${resultId}/result-items`;

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

  // 一覧の表示コンポーネント
  const ResultItemList = () => {
    // 一件もデータが存在しない場合
    if (resultItemList.length === 0) {
      return (
        <React.Fragment>
          テスト結果アイテムは存在しません。
        </React.Fragment>
      )
    }
    // フィルタリングを行いながら行いながらテスト結果アイテム一覧を展開
    return filterResultItemList(resultItemList, filterObj).map( (resultItem) => (
      <Link key={resultItem.id} to={`${toResultItemInfoLink}/${resultItem.id}`}>
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
    ))
  }

  // テスト結果アイテム一覧の再読み込み
  const reload = () => {
    dispatch( setLoadStateResultItemList({
      resultId: resultId,
      isLoaded: false
    }));
  };

  return (
    <React.Fragment>
      <div className={`${styles.resultItemList} scroll`}>
        <div className="sectionTitle">
          <div className="main">アイテム一覧</div>
          <div className="action" onClick={ () => {reload()}}>
            <i className="fas fa-sync"/>
          </div>
          <ResultItemListCount resultId={resultId} />
        </div>
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
        { (isLoadedResultItem) ?
          <ResultItemList/> : <Loading/>
        }
      </div>
    </React.Fragment>
  );
}
