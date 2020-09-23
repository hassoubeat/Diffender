import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import DiffRequestForm from './DiffRequestForm';
import styles from './ResultList.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ReusltList(props = null) {
  // propsの展開
  // TODO 検索条件を取得

  const [searchWord, setSearchWord] = useState("");
  const [isSearchScreenshotResultFilter, setIsSearchScreenshotResultFilter] = useState(true);
  const [isSearchDiffResultFilter, setIsSearchDiffResultFilter] = useState(true);
  const [resultList, setResultList] = useState([]);
  const [isDisplayDiffRequestFormModal, setIsDisplayDiffRequestFormModal] = useState(false);

  useEffect( () => {
    // プロジェクト一覧を取得して、Stateを更新
    const asyncUpdateResultList = async () => {
      setResultList(await getResultList());
    };
    asyncUpdateResultList();
  }, []);

  const filterObj = {
    searchWord: searchWord,
    isSearchScreenshotResultFilter: isSearchScreenshotResultFilter,
    isSearchDiffResultFilter: isSearchDiffResultFilter
  }
  return (
    <React.Fragment>
      <div className={styles.resultList}>
        <div className={styles.actionArea}>
          <button className={`button ${styles.diffRequestButton}`} onClick={
            async () => { setIsDisplayDiffRequestFormModal(true) }
          }>Diffの取得</button>
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
          <Link key={result.Id} to={`/results/${result.Id}`}>
            <div className={`${styles.resultItem} ${result.resultType}`}>
              {result.resultName}
              <div className={styles.createDate}>
                {result.createDate}
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

  function filterResultList(resultList, filterObj) {
    return resultList.filter((result) => { 
      return (
        // プロジェクト名に検索ワードが含まれる要素のみフィルタリング
        !!result.resultName.match(filterObj.searchWord) &&
        (
          // スクリーンショットリザルトのフィルタリング
          (filterObj.isSearchScreenshotResultFilter && result.resultType === "SS") ||
          // Diffリザルトのフィルタリング
          (filterObj.isSearchDiffResultFilter && result.resultType === "DIFF")
        )
      );
    });
  }

  async function getResultList() {
    // TODO いずれlibにAPIを実装してそちらからデータを取得
    return [
      {
        Id: "result-1",
        resultName: "リザルト1",
        resultType: "SS",
        createDate: "2020/07/01 15:30:15"
      },
      {
        Id: "result-2",
        resultName: "リザルト2",
        resultType: "DIFF",
        createDate: "2020/07/01 15:30:30"
      },
      {
        Id: "result-3",
        resultName: "リザルト3",
        resultType: "SS",
        createDate: "2020/07/01 15:30:45"
      },
    ];
  }
}
