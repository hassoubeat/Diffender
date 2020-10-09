import React from 'react';
import { useFormContext } from "react-hook-form";
import _ from "lodash";

import Accordion from 'components/util/accordion/Accordion'
import UtilInput from 'components/util/input/Input';
import styles from './ActionItem.module.scss';

const ACTION_TYPE_GOTO = process.env.REACT_APP_ACTION_TYPE_GOTO;
const ACTION_TYPE_WAIT = process.env.REACT_APP_ACTION_TYPE_WAIT;

export default function ActionItem(props = null) {
  // props展開
  const index = props.index;
  const action = props.action;
  const actionsName = props.actionsName;
  const deleteAction = props.deleteAction;

  // Hook Setup
  const {register, errors } = useFormContext();

  const actionDom = {};
  actionDom[ACTION_TYPE_GOTO] = createGotoDom({
    action: action, 
    actionsName: actionsName, 
    index: index,
    errors: errors,
    register: register
  })
  actionDom[ACTION_TYPE_WAIT] = createWaitDom(({
    action: action, 
    actionsName: actionsName,
    index: index,
    errors: errors,
    register: register
  }));

  return (
    <div className={styles.actionItem} data-index={index} >
      <div className={styles.inputTitle}>
        <div className={styles.title}>{action.typeName}</div>
        <div className={styles.trash} onClick={ () => {deleteAction()} }><i className="fa fa-trash-alt"></i></div>
        <div className="draggable"><i className="fa fa-arrows-alt"></i></div>
      </div>
      <UtilInput
        label="アクション名" 
        placeholder="example.comへのページ遷移" 
        type="text" 
        name={`${actionsName}[${index}].name`}
        defaultValue={action.name}
        errorMessages={ _.get(errors, `${actionsName}[${index}].name.message`) && [ _.get(errors, `${actionsName}[${index}].name.message`) ] } 
        inputRef={register({
          maxLength : {
            value: 30,
            message: '最大30文字で入力してください'
          }
        })}
      />
      <input
        name={`${actionsName}[${index}].type`}
        type="hidden" 
        defaultValue={action.type} 
        ref={register()}
      />
      <input
        name={`${actionsName}[${index}].typeName`}
        type="hidden" 
        defaultValue={action.typeName} 
        ref={register()}
      />
      {/* アクションのタイプに応じたDOMをセット */}
      {actionDom[action.type]}
    </div>
  )
}

// ページ遷移アクションアイテムの生成処理
function createGotoDom({action, actionsName, index, errors, register}) {
  return (
    <React.Fragment>
      <UtilInput
        label="URL" 
        placeholder="https://example.com" 
        type="text" 
        name={`${actionsName}[${index}].url`}
        defaultValue={action.url}
        errorMessages={ _.get(errors, `${actionsName}[${index}].url.message`) && [ _.get(errors, `${actionsName}[${index}].url.message`) ] } 
        inputRef={register({
          required: 'URLは必須です',
          pattern: {
            value: new RegExp("https?://[\\w/:%#$&?()~.=+-]+"),
            message: 'URLの形式で入力してください'
          }
        })}
      />
      <Accordion text="オプション" className={styles.option}>
        <div className={styles.optionArea}>
          <UtilInput
            label="Basic認証ユーザ" 
            placeholder="User" 
            type="text" 
            name={`${actionsName}[${index}].basicAuth.user`}
            defaultValue={_.get(action, "basicAuth.user", "")}
            errorMessages={ _.get(errors, `${actionsName}[${index}].basicAuth.user.message`) && [ _.get(errors, `${actionsName}[${index}].basicAuth.user.message`) ] } 
            inputRef={ register() }
          />
          <UtilInput
            label="Basic認証パスワード" 
            placeholder="Password" 
            type="text" 
            name={`${actionsName}[${index}].basicAuth.password`}
            defaultValue={_.get(action, "basicAuth.password", "")}
            errorMessages={ _.get(errors, `${actionsName}[${index}].basicAuth.password.message`) && [ _.get(errors, `${actionsName}[${index}].basicAuth.password.message`) ] } 
            inputRef={ register() }
          />
        </div>
      </Accordion>
    </React.Fragment>
  );
}

// ページアクションアイテムの生成処理
function createWaitDom({action, actionsName, index, errors, register}) {
  return (
    <React.Fragment>
      <UtilInput
        label="待機時間(ミリ秒)" 
        placeholder="1000" 
        type="number" 
        name={`${actionsName}[${index}].millisecond`}
        defaultValue={_.get(action, "millisecond", "")}
        errorMessages={ _.get(errors, `${actionsName}[${index}].millisecond.message`) && [ _.get(errors, `${actionsName}[${index}].millisecond.message`) ] } 
        inputRef={ register({
          required: '待機時間(ミリ秒)は必須です'
        }) }
      />
    </React.Fragment>
  );
}