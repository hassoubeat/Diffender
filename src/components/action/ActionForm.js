import React from 'react';
import { useFormContext, useFieldArray } from "react-hook-form";
import { ReactSortable } from "react-sortablejs";
import ActionItem from './ActionItem';
import styles from './ActionForm.module.scss';

import {
  ACTION_TYPE_GOTO,
  ACTION_TYPE_WAIT,
  ACTION_TYPE_CLICK,
  ACTION_TYPE_FOCUS,
  ACTION_TYPE_INPUT,
  ACTION_TYPE_SCROLL
} from 'lib/util/const'


const ACTION_TYPE_LIST = [
  {
    type: ACTION_TYPE_GOTO,
    typeName: "ページ遷移"
  },
  {
    type: ACTION_TYPE_WAIT,
    typeName: "待機"
  },
  {
    type: ACTION_TYPE_CLICK,
    typeName: "クリック"
  },
  {
    type: ACTION_TYPE_FOCUS,
    typeName: "フォーカス"
  },
  {
    type: ACTION_TYPE_INPUT,
    typeName: "入力"
  },
  {
    type: ACTION_TYPE_SCROLL,
    typeName: "スクロール"
  },
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
      typeName: actionType.typeName,
      name: "",
      url: "",
      millisecond: 0,
      basicAuth: {
        user: "",
        password: ""
      },
      distance: {
        xPixel: 0,
        yPixel: 0
      },
      selector: "",
      value: ""
    });
  }

  const deleteAction = (key) => {
    if (!window.confirm('ブラウザ操作を削除しますか？')) return;
    remove(key);
  }

  return (
    <React.Fragment>
      <div className={styles.actionForm}>
        {/* アクションが定義されていない時に表示するメッセージ */}
        {(fields.length === 0) && <div className={styles.noActionListMessage}>以下からブラウザ操作を追加してください</div>}

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
            ACTION_TYPE_LIST.map( (actionType, index) => (
              <span 
                key={index} 
                className={styles.button} 
                onClick={() => {
                  addAction(actionType)
                }}
              >{actionType.typeName}</span>
            ))
          }
        </div>
      </div>
    </React.Fragment>
  );
}
