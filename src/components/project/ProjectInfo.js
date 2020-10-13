import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from './ProjectForm';
import ScreenshotRequestForm from './ScreenshotRequestForm';
import ResultList from 'components/result/ResultList';
import styles from './ProjectInfo.module.scss';

import { setLoadedProjectList } from 'app/domainSlice';

import * as projectModel from 'lib/project/model';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ProjectInfo(props = null) {
  // props setup
  const projectId = props.projectId;

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // state setup
  const [isDisplayScreenshotRequestFormModal, setIsDisplayScreenshotRequestFormModal] = useState(false);

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
        <ProjectForm 
          projectId={projectId} 
          successPostCallback={ async () => {
            const projectList = await projectModel.getProjectList();
            dispatch(setLoadedProjectList(projectList));
          }}
          successDeleteCallback={ async  () => {
            const projectList = await projectModel.getProjectList();
            dispatch(setLoadedProjectList(projectList));
            history.push('/projects');
          }} 
        />
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
