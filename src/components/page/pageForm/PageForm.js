import React, { useEffect, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormProvider, useForm } from "react-hook-form";
import BrowserOptionsForm from './_BrowserSettingsForm';
import ScreenshotOptionsForm from './_ScreenshotOptionsForm';
import ScreenshotTest from './_ScreenshotTest';
import ActionForm from 'components/action/ActionForm';
import Accordion from 'components/util/accordion/Accordion';
import UtilInput from 'components/util/input/Input';

import { 
  setPage,
  selectPage
} from 'app/domainSlice';

import {
  postPage,
  putPage,
  inputPageManualCast
} from 'lib/page/model';

import { ACTION_DEVICE_TYPES } from 'lib/util/const';

import * as toast from 'lib/util/toast';
import styles from './PageForm.module.scss';

export const PageContext = createContext();

export default function PageForm(props = null) {
  // props setup
  const isUpdate = !!props.pageId;
  const projectId = props.projectId;
  const pageId = props.pageId;
  const postSuccessCallback = props.postSuccessCallback;

  // hook setup
  const dispatch = useDispatch();

  // redux-state setup
  const page = useSelector(selectPage(projectId, pageId, isUpdate));

  // ReactHookForm setup
  const reactHookFormMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: "",
      description: "",
      browserSettings: {
        deviceType: "iPhone 6",
        userAgent: "",
        viewport: {
          width: 0,
          height: 0
        }
      },
      screenshotOptions: {
        fullPage: false
      },
      actions: [],
      isEnableBeforeCommonAction: true,
      isEnableAfterCommonAction: true
    }
  });
  const {register, errors, reset, watch, handleSubmit} = reactHookFormMethods;

  // watch
  const isEnableBeforeCommonAction = watch("isEnableBeforeCommonAction");
  const isEnableAfterCommonAction = watch("isEnableAfterCommonAction");

  useEffect( () => {
    if (isUpdate) reset(page);
  }, [isUpdate, reset, page]);

  // submit成功時の処理
  const onSubmit = async (inputPage) => { 
    inputPage.actions = inputPage.actions || [];
    inputPage = inputPageManualCast(inputPage);

    let result = null;
    if (isUpdate) {
      result = await putPage(projectId, {
        ...page,
        ...inputPage
      });
    } else {
      result = await postPage(projectId, inputPage);
    }
    if (result) dispatch( setPage(result) ); 
    if (result && postSuccessCallback) postSuccessCallback();
  };

  // submit失敗時(バリデーションエラー)が発生した時のイベント処理
  const onSubmitError = (error) => { 
    console.table(error);
    console.log(error)
    toast.errorToast(
      { message: "入力エラーが存在します" }
    )
  };

  return (
    <React.Fragment>
      <form>
      <FormProvider {...reactHookFormMethods} >
      <div className={styles.pageForm}>
        <div className={styles.inputArea}>
          <div className="sectionTitle">ページ</div>
          <UtilInput
            label="ページ名" 
            placeholder="TOPページ" 
            type="text" 
            name="name" 
            errorMessages={ (errors.name) && [errors.name.message] } 
            inputRef={ register({
              maxLength : {
                value: 30,
                message: '最大30文字で入力してください'
              }
            })}
          />
          <UtilInput
            label="ページの説明" 
            placeholder="TOPページの正常系テスト" 
            type="text" 
            name="description" 
            errorMessages={ (errors.description) && [errors.description.message] } 
            inputRef={ register({
              maxLength : {
                value: 30,
                message: '最大50文字で入力してください'
              }
            })}
          />
          <Accordion text="ブラウザオプション" >
            <BrowserOptionsForm deviceList={ACTION_DEVICE_TYPES}/>
          </Accordion>
          <Accordion text="スクリーンショットオプション" >
            <ScreenshotOptionsForm />
          </Accordion>
          <div className="sectionTitle">アクション</div>
          <hr className={styles.border}/>
          <small className={styles.sectionMessage}>
            アクションとはスクリーンショットを撮影する前に行う処理です。<br/>
            スクリーンショットを撮影したいページへの遷移や事前のログインなどを行うことが可能です。
          </small>
          <Accordion className={styles.commonActionList} text="共通アクション(前処理)" >
            <div className={styles.detail}>
              <div className={styles.message}>
                共通アクションとはプロジェクトの全アクションで実施するアクションです。<br/>
                共通アクションの編集は<Link to={`/projects/${projectId}`}>こちら</Link>から
              </div>
              <input 
                name="isEnableBeforeCommonAction"
                className={styles.checkBox} 
                type="checkBox" 
                defaultChecked={isEnableBeforeCommonAction} 
                ref={register()}
              />共通アクションを実行する
            </div>
          </Accordion>
          <ActionForm actionsName="actions" />
          <Accordion className={styles.commonActionList} text="共通アクション(後処理)" >
            <div className={styles.detail}>
              <div className={styles.message}>
                共通アクションとはプロジェクトの全アクションで実施するアクションです。<br/>
                共通アクションの編集は<Link to={`/projects/${projectId}`}>こちら</Link>から
              </div>
              <input 
                name="isEnableAfterCommonAction"
                className={styles.checkBox} 
                type="checkBox" 
                defaultChecked={isEnableAfterCommonAction} 
                ref={register()}
              />共通アクションを実行する
            </div>
          </Accordion>
          <ScreenshotTest projectId={projectId} />
          <div className={styles.actionArea}>
            <span className={styles.postButton} onClick={
              handleSubmit(onSubmit, onSubmitError)
            }>
              {(isUpdate) ? '更新' : '登録'}
            </span>
          </div>
        </div>
      </div>
      </FormProvider>
      </form>
    </React.Fragment>
  );
}