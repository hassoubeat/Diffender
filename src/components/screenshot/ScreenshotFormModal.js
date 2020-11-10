import React, { useState } from 'react';
import Modal from 'react-modal';
import ScreenshotRequestForm from 'components/screenshot/ScreenshotRequestForm';
import styles from './ScreenshotFormModal.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function ScreenshotFormModal(props = null) {
  // props setup
  const initSelectProjectId = props.initSelectProjectId;

  // state setup
  const [isDisplayModal, setIsDisplayModal] = useState(false);

  return (
    <React.Fragment>
      <Modal 
        isOpen={isDisplayModal}
        onRequestClose={() => {setIsDisplayModal(false)}}
        className={`modalContent ${styles.screenshotModalContent}`}
        overlayClassName="modalOverray"
      >
        <div className="modalTitle">スクリーンショットの撮影</div>
        <small className="modalSupportMessage">
          登録されているページのスクリーンショットを撮影します。
        </small>
        <ScreenshotRequestForm 
          initSelectProjectId={initSelectProjectId} 
          successPostCallback={() => {
            setIsDisplayModal(false);
          }}
        />
        <div className="closeModalButton" onClick={() => {setIsDisplayModal(false)
        }}>✕</div>
      </Modal>
      <div className="fixLowerRightButton" onClick={() => {
        setIsDisplayModal(true);
      }}>+</div>
    </React.Fragment>
  );
}
