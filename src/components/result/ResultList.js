import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { 
  selectResults,
  deleteResult,
} from 'app/domainSlice';

import _ from 'lodash';
import {
  sort,
  filterResultList
} from 'lib/result/model';

import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

import styles from './ResultList.module.scss';

export default function ResultList(props = null) {
  // props setup
  const projectId = props.projectId;

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const resultList = sort(
    _.cloneDeep(useSelector(selectResults({projectId: projectId})
  )));

  const [searchWord, setSearchWord] = useState("");
  const [isSearchScreenshotResultFilter, setIsSearchScreenshotResultFilter] = useState(true);
  const [isSearchDiffResultFilter, setIsSearchDiffResultFilter] = useState(true);

  const filterObj = {
    searchWord: searchWord,
    isSearchScreenshotResultFilter: isSearchScreenshotResultFilter,
    isSearchDiffResultFilter: isSearchDiffResultFilter
  }

  // 削除ボタン押下時の処理
  const handleDeleteResult = async (resultId, resultName) => {
    if (!window.confirm(`リザルト「${resultName}」を削除しますか？`)) return;
    toast.infoToast(
      { message: `リザルト「${resultName}」の削除リクエストを送信しました` }
    );
    try {
      await api.deleteResult({
        resultId: resultId
      });
      toast.successToast(
        { message: `リザルト「${resultName}」の削除が完了しました` }
      );
      dispatch(deleteResult(resultId));
    } catch (error) {
      toast.errorToast(
        { message: `リザルト「${resultName}」の削除に失敗しました` }
      );
    }
  }

  return (
    <React.Fragment>
      <div className={styles.resultList}>
        <div className="sectionTitle">リザルト一覧</div>
        <div className={styles.filters}>
          <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
          <div className={styles.filter}>
            <input className={styles.checkBox} type="checkBox" checked={isSearchScreenshotResultFilter} onChange={
              (e) => setIsSearchScreenshotResultFilter(e.target.checked)
            } />SS
          </div>
          <div className={styles.filter}>
            <input className={styles.checkBox} type="checkBox" checked={isSearchDiffResultFilter} onChange={
              (e) => setIsSearchDiffResultFilter(e.target.checked)
            } />Diff
          </div>
        </div>
        {/* フィルタリングを行いながら行いながらリザルト一覧を展開 */}
        {filterResultList(resultList, filterObj).map( (result) => (
          <div 
            key={result.id}
            className={`${styles.resultItem} ${result.resultType}`}
            onClick={() => history.push(`/results/${result.id}`) }
          >
            <div className={styles.name}>
              {result.name}
            </div>
            <div className={styles.description}>
              {result.description}
            </div>
            <div className={styles.createDate}>
              {result.createDt}
            </div>
            <div className={styles.actions}>
              <i className={`fa fa-trash-alt ${styles.item} ${styles.delete}`} onClick={(e) => {
                e.stopPropagation()
                handleDeleteResult(result.id, result.name)
              }}/>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
