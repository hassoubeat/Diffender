import React from 'react';
import Accordion from 'components/util/accordion/Accordion'
import styles from './__ActionItem.module.scss';

const ACTION_TYPE_GOTO = process.env.REACT_APP_ACTION_TYPE_GOTO;
const ACTION_TYPE_WAIT = process.env.REACT_APP_ACTION_TYPE_WAIT;

export default function ActionItem(props = null) {
  // props展開
  const index = props.index;
  const action = props.action;
  const setAction = props.setAction;
  const deleteAction = props.deleteAction;

  const actionDom = {};
  actionDom[ACTION_TYPE_GOTO] = createGotoDom(action, setAction);
  actionDom[ACTION_TYPE_WAIT] = createWaitDom(action, setAction);
  

  return (
    <div  className={styles.actionItem} data-index={index} >
      <div className={styles.inputTitle}>
        <div className={styles.title}>{action.localName}</div>
        <div className={styles.trash} onClick={ () => {deleteAction()} }><i className="fa fa-trash-alt"></i></div>
        <div className="draggable"><i className="fa fa-arrows-alt"></i></div>
      </div>
      <div className={styles.inputItem}>
        <label className={styles.inputLabel}>
          アクション名
        </label>
        <div>
          <input className={styles.inputText} type="text" placeholder=" 例： example.comへのページ遷移" value={action.name} 
            onChange={(e) => {
              action.name = e.target.value;
              setAction(action);
            }} 
          />
        </div>
      </div>
      {/* アクションのタイプに応じたDOMをセット */}
      {actionDom[action.type]}
    </div>
  )
}

// ページ遷移アクションアイテムの生成処理
function createGotoDom(action, setAction) {
  return (
    <React.Fragment>
      <div className={styles.inputItem}>
        <label className={styles.inputLabel}>
          URL
        </label>
        <div>
          <input className={styles.inputText} type="text" placeholder=" 例： https://example.com" value={action.url} 
            onChange={(e) => {
              action.url = e.target.value;
              setAction(action);
            }} 
          />
        </div>
      </div>
      <Accordion text="オプション" className={styles.option}>
        <div className={styles.optionArea}>
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              Basic認証ユーザ
            </label>
            <div>
              <input className={styles.inputText} type="text" placeholder=" 例： User" value={action.basicAuth.user} 
                onChange={(e) => {
                  action.basicAuth.user = e.target.value;
                  setAction(action);
                }} 
              />
            </div>
          </div>
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              Basic認証パスワード
            </label>
            <div>
              <input className={styles.inputText} type="text" placeholder=" 例： Password" value={action.basicAuth.password} 
                onChange={(e) => {
                  action.basicAuth.password = e.target.value;
                  setAction(action);
                }} 
              />
            </div>
          </div>
        </div>
      </Accordion>
    </React.Fragment>
  );
}

// ページアクションアイテムの生成処理
function createWaitDom(action, setAction) {
  return (
    <React.Fragment>
      <div className={styles.inputItem}>
        <label className={styles.inputLabel}>
          待機時間(ミリ秒)
        </label>
        <div>
          <input className={styles.inputText} type="text" placeholder=" 例： 1000" value={action.millisecond} 
            onChange={(e) => {
              action.millisecond = e.target.value;
              setAction(action);
            }} 
          />
        </div>
      </div>
    </React.Fragment>
  );
}