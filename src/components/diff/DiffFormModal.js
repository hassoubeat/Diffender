import React, { useState } from 'react';
import Modal from 'react-modal';
import DiffRequestForm from './DiffRequestForm';
import styles from './DiffFormModal.module.scss';

// モーダルの展開先エレメントの指定
Modal.setAppElement('#root');

export default function DiffFormModal(props = null) {
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
        <div className="modalTitle">Diffの検出</div>
        <small className="modalSupportMessage">
          スクリーンショットを比較してDiff(差分)を検出します。
        </small>
        <DiffRequestForm 
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
