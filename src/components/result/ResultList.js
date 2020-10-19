import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import DiffRequestForm from './DiffRequestForm';

import { 
  selectResults
} from 'app/domainSlice';

import _ from 'lodash';
import {
  sort,
  filterResultList
} from 'lib/result/model';
import styles from './ResultList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ResultList(props = null) {
  // props setup
  const projectId = props.projectId;
  const isDisplayDiffRequestForm = props.isDisplayDiffRequestForm || false;

  // redux-state setup
  const resultList = sort(
    _.cloneDeep(useSelector(selectResults({projectId: projectId})
  )));

  const [searchWord, setSearchWord] = useState("");
  const [isSearchScreenshotResultFilter, setIsSearchScreenshotResultFilter] = useState(true);
  const [isSearchDiffResultFilter, setIsSearchDiffResultFilter] = useState(true);
  const [isDisplayDiffRequestFormModal, setIsDisplayDiffRequestFormModal] = useState(false);

  const filterObj = {
    searchWord: searchWord,
    isSearchScreenshotResultFilter: isSearchScreenshotResultFilter,
    isSearchDiffResultFilter: isSearchDiffResultFilter
  }

  return (
    <React.Fragment>
      <div className={styles.resultList}>
        <div className={styles.actionArea}>
          { isDisplayDiffRequestForm &&
            <button className={`button ${styles.diffRequestButton}`} onClick={
              async () => { setIsDisplayDiffRequestFormModal(true) }
            }>Diffの取得</button>
          }
        </div>
        <div className={styles.actions}>
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
          <Link key={result.id} to={`/results/${result.id}`}>
            <div className={`${styles.resultItem} ${result.resultType}`}>
              {result.name}
              <div className={styles.description}>
                {result.description}
              </div>
              <div className={styles.createDate}>
                {result.createDt}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Modal 
        isOpen={isDisplayDiffRequestFormModal}
        onRequestClose={() => {setIsDisplayDiffRequestFormModal(false)}}
        className="modalContent"
        overlayClassName="modalOverray"
      >
        <div className="modalTitle">Diffを取得する</div>
        <small className="modalSupportMessage">
          Diffとは2つのスクリーンショットを比較して異なる差分のことです。<br/>
          差分を抽出したい2つのリザルトを選択してください。<br/>
          ※ 選択したリザルト両方に存在する同名のスクリーンショットを比較します <br/>
          ※ 比較するスクリーンショットが多い場合、完了まで時間がかかります
        </small>
        <DiffRequestForm resultList={resultList} successDiffRequestCallback={() => {setIsDisplayDiffRequestFormModal(false)} } />
        <div className="closeModalButton" onClick={() => {setIsDisplayDiffRequestFormModal(false)}}>✕</div>
      </Modal>
    </React.Fragment>
  );
}
