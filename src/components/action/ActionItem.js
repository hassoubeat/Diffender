import React from 'react';
import { useFormContext } from "react-hook-form";
import _ from "lodash";

import Accordion from 'components/util/accordion/Accordion'
import UtilInput from 'components/util/input/Input';
import styles from './ActionItem.module.scss';

import {
  ACTION_TYPE_GOTO,
  ACTION_TYPE_WAIT,
  ACTION_TYPE_CLICK,
  ACTION_TYPE_FOCUS,
  ACTION_TYPE_INPUT,
  ACTION_TYPE_SCROLL
} from 'lib/util/const'

export default function ActionItem(props = null) {
  // props展開
  const index = props.index;
  const action = props.action;
  const actionsName = props.actionsName;
  const deleteAction = props.deleteAction;

  // Hook Setup
  const {register, errors } = useFormContext();

  const actionDom = {};
  const actionDomParams = {
    action: action, 
    actionsName: actionsName, 
    index: index,
    errors: errors,
    register: register
  }
  actionDom[ACTION_TYPE_GOTO] = createGotoDom(actionDomParams)
  actionDom[ACTION_TYPE_WAIT] = createWaitDom(actionDomParams);
  actionDom[ACTION_TYPE_CLICK] = createClickDom(actionDomParams);
  actionDom[ACTION_TYPE_FOCUS] = createFucusDom(actionDomParams);
  actionDom[ACTION_TYPE_INPUT] = createInputDom(actionDomParams);
  actionDom[ACTION_TYPE_SCROLL] = createScrollDom(actionDomParams);

  return (
    <div className={styles.actionItem} data-index={index+1} >
      <div className={styles.inputTitle}>
        <div className={styles.title}>{action.typeName}</div>
        <div className={styles.trash} onClick={ () => {deleteAction()} }><i className="fa fa-trash-alt"></i></div>
        <div className="draggable"><i className="fa fa-arrows-alt"></i></div>
      </div>
      <UtilInput
        label="ブラウザ操作名称" 
        type="text" 
        name={`${actionsName}[${index}].name`}
        defaultValue={action.name}
        errorMessages={ _.get(errors, `${actionsName}[${index}].name.message`) && [ _.get(errors, `${actionsName}[${index}].name.message`) ] } 
        inputRef={register({
          maxLength : {
            value: 100,
            message: '最大100文字で入力してください'
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

// 遷移
function createGotoDom({action, actionsName, index, errors, register}) {
  return (
    <React.Fragment>
      <UtilInput
        label="遷移するURL" 
        placeholder="https://example.com" 
        type="text" 
        name={`${actionsName}[${index}].url`}
        defaultValue={action.url}
        errorMessages={ _.get(errors, `${actionsName}[${index}].url.message`) && [ _.get(errors, `${actionsName}[${index}].url.message`) ] } 
        inputRef={register({
          required: '遷移するURLは必須です',
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

// 待機
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

// クリック
function createClickDom({action, actionsName, index, errors, register}) {
  return (
    <React.Fragment>
      <UtilInput
        label="クリックする要素" 
        placeholder="#loginButton" 
        type="text" 
        name={`${actionsName}[${index}].selector`}
        defaultValue={_.get(action, "selector", "")}
        errorMessages={ _.get(errors, `${actionsName}[${index}].selector.message`) && [ _.get(errors, `${actionsName}[${index}].selector.message`) ] } 
        inputRef={ register({
          required: '要素の指定は必須です'
        }) }
      />
    </React.Fragment>
  );
}

// フォーカス
function createFucusDom({action, actionsName, index, errors, register}) {
  return (
    <React.Fragment>
      <UtilInput
        label="フォーカスする要素" 
        placeholder="#search" 
        type="text" 
        name={`${actionsName}[${index}].selector`}
        defaultValue={_.get(action, "selector", "")}
        errorMessages={ _.get(errors, `${actionsName}[${index}].selector.message`) && [ _.get(errors, `${actionsName}[${index}].selector.message`) ] } 
        inputRef={ register({
          required: '要素の指定は必須です'
        }) }
      />
    </React.Fragment>
  );
}

// 入力
function createInputDom({action, actionsName, index, errors, register}) {
  return (
    <React.Fragment>
      <UtilInput
        label="入力する要素" 
        placeholder="#userId" 
        type="text" 
        name={`${actionsName}[${index}].selector`}
        defaultValue={_.get(action, "selector", "")}
        errorMessages={ _.get(errors, `${actionsName}[${index}].selector.message`) && [ _.get(errors, `${actionsName}[${index}].selector.message`) ] } 
        inputRef={ register({
          required: '要素の指定は必須です'
        }) }
      />
      <UtilInput
        label="入力する値" 
        placeholder="example@example.com" 
        type="text" 
        name={`${actionsName}[${index}].value`}
        defaultValue={_.get(action, "value", "")}
        errorMessages={ _.get(errors, `${actionsName}[${index}].value.message`) && [ _.get(errors, `${actionsName}[${index}].value.message`) ] } 
        inputRef={ register() }
      />
    </React.Fragment>
  );
}

// スクロール
function createScrollDom({action, actionsName, index, errors, register}) {
  return (
    <React.Fragment>
      <UtilInput
        label="横方向のスクロール(ピクセル)" 
        placeholder="1000" 
        type="number" 
        name={`${actionsName}[${index}].distance.xPixel`}
        defaultValue={_.get(action, "distance.xPixel", "")}
        errorMessages={ _.get(errors, `${actionsName}[${index}].distance.xPixel.message`) && [ _.get(errors, `${actionsName}[${index}].distance.xPixel.message`) ] } 
        inputRef={ register({
          required: '要素の指定は必須です'
        }) }
      />
      <UtilInput
        label="縦方向のスクロール(ピクセル)" 
        placeholder="1000" 
        type="number" 
        name={`${actionsName}[${index}].distance.yPixel`}
        defaultValue={_.get(action, "distance.yPixel", "")}
        errorMessages={ _.get(errors, `${actionsName}[${index}].distance.yPixel.message`) && [ _.get(errors, `${actionsName}[${index}].distance.yPixel.message`) ] } 
        inputRef={ register({
          required: '要素の指定は必須です'
        }) }
      />
    </React.Fragment>
  );
}