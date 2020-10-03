import React from 'react';
import { useFormContext, useFieldArray } from "react-hook-form";
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
  const actionsName = props.actionsName;

  // Hook Setup
  const { control } = useFormContext();

  const {fields, append, remove, move } = useFieldArray({
    control, 
    name: actionsName,
  });

  // Event
  const addAction = (actionType) => {
    append({
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
  }

  const deleteAction = (key) => {
    if (!window.confirm('アクションを削除しますか？')) return;
    remove(key);
  }

  return (
    <React.Fragment>
      <div className={styles.actionForm}>
        {/* アクションが定義されていない時に表示するメッセージ */}
        {(fields.length === 0) && <div className={styles.noActionListMessage}>以下からアクションを追加してください</div>}

        {/* アクションアイテムの生成 */}
        <ReactSortable 
          className={styles.actionList} 
          list={fields} 
          setList={() => {}} 
          onEnd={(e) => {
            move(e.oldIndex, e.newIndex);
          }}
          handle=".draggable"
        >
          {
            fields.map( (action, index) => (
              <ActionItem 
                key={action.id} 
                index={index} 
                action={action}
                actionsName={actionsName} 
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
              <span 
                key={actionType.type} 
                className={styles.button} 
                onClick={() => {
                  addAction(actionType)
                }}
              >{actionType.localName}</span>
            ))
          }
        </div>
      </div>
    </React.Fragment>
  );
}
