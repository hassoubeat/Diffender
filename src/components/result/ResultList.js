import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import ResultListCount from './ResultListCount';

import { 
  selectResults,
  deleteResult,
} from 'app/domainSlice';

import _ from 'lodash';
import {
  sort,
  filterResultList,
  deleteResult as DeleteResult
} from 'lib/result/model';

import styles from './ResultList.module.scss';

export default function ResultList(props = null) {
  // props setup
  const projectId = props.projectId;
  const sectionTitle = props.sectionTitle || "テスト結果一覧";
  const isDisplayListCount = props.isDisplayListCount === undefined ? true : props.isDisplayListCount;
  const isDisplaySSFilter = props.isDisplaySSFilter === undefined ? true : props.isDisplaySSFilter;
  const isDisplayDiffFilter = props.isDisplayDiffFilter === undefined ? true : props.isDisplayDiffFilter;
  const isInitSearchScreenshotResultFilter = props.isInitSearchScreenshotResultFilter  === undefined ? true : props.isInitSearchScreenshotResultFilter;
  const isInitSearchDiffResultFilter = props.isInitSearchDiffResultFilter  === undefined ? true : props.isInitSearchDiffResultFilter;
  const toResultInfoLink = props.toResultInfoLink || "/results";

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const resultList = sort(
    _.cloneDeep(useSelector(selectResults({projectId: projectId})
  )));

  const [searchWord, setSearchWord] = useState("");
  const [isSearchScreenshotResultFilter, setIsSearchScreenshotResultFilter] = useState(isInitSearchScreenshotResultFilter);
  const [isSearchDiffResultFilter, setIsSearchDiffResultFilter] = useState(isInitSearchDiffResultFilter);

  const filterObj = {
    searchWord: searchWord,
    isSearchScreenshotResultFilter: isSearchScreenshotResultFilter,
    isSearchDiffResultFilter: isSearchDiffResultFilter
  }

  // 削除ボタン押下時の処理
  const handleDeleteResult = async (resultId, resultName) => {
    if (!window.confirm(`テスト結果「${resultName}」を削除しますか？`)) return;
    const result = await DeleteResult(resultId);
    if (result) dispatch( deleteResult(result.id) );
  }

  useEffect( () => {
    setIsSearchScreenshotResultFilter(isInitSearchScreenshotResultFilter);
    setIsSearchDiffResultFilter(isInitSearchDiffResultFilter);
  }, [isInitSearchScreenshotResultFilter, isInitSearchDiffResultFilter]);

  return (
    <React.Fragment>
      <div className={`${styles.resultList} scroll`}>
        <div className="sectionTitle">
          <div className="main">{sectionTitle}</div>
          { (isDisplayListCount) && 
            <ResultListCount projectId={projectId} />
          }
        </div>
        <div className={styles.filters}>
          <input className={styles.searchBox} type="text" placeholder="search" onChange={(e) => setSearchWord(e.target.value)} />
          { isDisplaySSFilter && 
            <div className={styles.filter}>
              <input className={styles.checkBox} type="checkBox" checked={isSearchScreenshotResultFilter} onChange={
                (e) => setIsSearchScreenshotResultFilter(e.target.checked)
              } />SS
            </div>
          }
          { isDisplayDiffFilter && 
            <div className={`${styles.filter} ${styles.diff}`}>
              <input className={styles.checkBox} type="checkBox" checked={isSearchDiffResultFilter} onChange={
                (e) => setIsSearchDiffResultFilter(e.target.checked)
              } />Diff
            </div>
          }
        </div>
        {/* フィルタリングを行いながら行いながらテスト結果を展開 */}
        {filterResultList(resultList, filterObj).map( (result) => (
          <div 
            key={result.id}
            className={`${styles.resultItem} ${result.resultType}`}
            onClick={() => {
              history.push(`${toResultInfoLink}/${result.id}`) 
            }}
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
            { (result.ttlDt) &&
              <div className={styles.ttlDate}>
                {result.ttlDt} <i className={`fa fa-trash-alt`} />
              </div>
            }
            <div className={styles.actions}>
              <i className={`fa fa-trash-alt ${styles.item} ${styles.delete}`} onClick={(e) => {
                e.stopPropagation()
                handleDeleteResult(result.id, result.name)
              }}/>
            </div>
          </div>
        ))}
        { (resultList.length === 0) &&
          <React.Fragment>
            テスト結果は存在しません。<br/>
            <Link to={'/screenshot-request'}>スクリーンショットの撮影</Link>、<Link to={'/screenshot-request'}>Diffの検出</Link>の実行結果が表示されます。
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  );
}
