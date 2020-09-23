import React from 'react';
import { ReactSortable } from "react-sortablejs";
import ActionItem from './__ActionItem';
import styles from './_ActionForm.module.scss';

const ACTION_TYPE_GOTO = process.env.REACT_APP_ACTION_TYPE_GOTO;
const ACTION_TYPE_WAIT = process.env.REACT_APP_ACTION_TYPE_WAIT;
const ACTION_TYPE_LIST = [
  {
    type: ACTION_TYPE_GOTO,
    localName: "ページ遷移"
  },
  {
    type: ACTION_TYPE_WAIT,
    localName: "待機"
  }
];

export default function ActionForm(props = null) {
  // パラメータ取得
  const actionList = props.actionList;
  const setActionList = props.setActionList;

  return (
    <React.Fragment>
      <div className={styles.actionForm}>
        {/* アクションが定義されていない時に表示するメッセージ */}
        {(actionList.length === 0) && <div className={styles.noActionListMessage}>以下からアクションを追加してください</div>}
        {/* アクションアイテムの生成 */}
        <ReactSortable className={styles.actionList} list={actionList} setList={setActionList} handle=".draggable">
          {
            actionList.map( (action, index) => (
              <ActionItem key={index} index={index+1} action={action} 
                setAction={ (action) => {
                  actionList[index] = action;
                  setActionList(Object.assign([], actionList));
                }}
                deleteAction={ () => {
                  deleteAction(index);
                }}
              />
            ))
          }
        </ReactSortable>
        <div className={styles.actionCreater} >
          {/* アクションの追加ボタンを生成 */}
          {
            ACTION_TYPE_LIST.map( (actionType) => (
              <span key={actionType.type} className={styles.button} onClick={() => {addAction(actionList, setActionList, actionType)}}
              >{actionType.localName}</span>
            ))
          }
        </div>
          
      </div>
    </React.Fragment>
  );

  // アクションの追加
  function addAction(actionList, setActionList, actionType) {
    actionList.push({
      type: actionType.type,
      localName: actionType.localName,
      name: "",
      url: "",
      millisecond: 0,
      basicAuth: {
        user: "",
        password: ""
      }
    });
    setActionList(Object.assign([], actionList));
  }

  // アクションの削除
  function deleteAction(key) {
    if (!window.confirm('アクションを削除しますか？')) return;
    actionList.splice(key, 1); 
    setActionList(Object.assign([], actionList));
  }
}
