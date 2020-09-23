import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';
import ScreenshotRequestForm from './ScreenshotRequestForm';
import ResultList from 'components/result/ResultList';
import styles from './ProjectInfo.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ProjectInfo(props = null) {
  // props展開
  const projectId = props.projectId;

  // state設定
  const [isDisplayScreenshotRequestFormModal, setIsDisplayScreenshotRequestFormModal] = useState(false);

  const history = useHistory();

  return (
    <React.Fragment>
      <div className={styles.projectInfo}>
        <div className={styles.actionArea}>
          <button className={`button ${styles.screenshotRequestButton}`} onClick={
            async () => { setIsDisplayScreenshotRequestFormModal(true) }
          }>スクリーンショットの取得</button>
          <button className={`button ${styles.addPageButton}`} onClick={() => {history.push(`/projects/${projectId}/pages`)} }>
            ページの追加
          </button>
        </div>
        <ProjectForm projectId={projectId} successDeleteCallback={ () => {history.push('/projects')} } />
        <div className={styles.relateResultArea}>
          <div className={styles.title}>関連するリザルト</div>
          {/* TODO 検索条件をpropsとして渡す */}
          <ResultList />
        </div>
      </div>
      <Modal 
        isOpen={isDisplayScreenshotRequestFormModal}
        onRequestClose={() => {setIsDisplayScreenshotRequestFormModal(false)}}
        className="modalContent"
        overlayClassName="modalOverray"
      >
        <div className="modalTitle">スクリーンショットを取得する</div>
        <small className="modalSupportMessage">
          現在のプロジェクトに登録されているページのスクリーンショットを取得します。<br/>
          スクリーンショットの取得結果は”リザルト”として登録されます。<br/>
          ※ ページ数が多い場合、完了まで時間がかかります
        </small>
        <ScreenshotRequestForm projectId={projectId} requestSuccessCallback={() => {setIsDisplayScreenshotRequestFormModal(false)}} />
        <div className="closeModalButton" onClick={() => {setIsDisplayScreenshotRequestFormModal(false)}}>✕</div>
      </Modal>
    </React.Fragment>
  );
}
