import React, { useEffect, useState, createContext } from 'react';
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

  // state setup
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;

    setIsSubmitting(true);
    
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

    setIsSubmitting(false);

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
    <form onSubmit={ handleSubmit(onSubmit, onSubmitError)}>
      <FormProvider {...reactHookFormMethods} >
      <input type="submit" className="hidden" />
      <div className={styles.pageForm}>
        <div className={styles.inputArea}>
          <UtilInput
            label="ページ名" 
            placeholder="TOPページ" 
            type="text" 
            name="name" 
            errorMessages={ (errors.name) && [errors.name.message] } 
            inputRef={ register({
              maxLength : {
                value: 100,
                message: '最大100文字で入力してください'
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
                value: 400,
                message: '最大400文字で入力してください'
              }
            })}
          />
          <Accordion text="ブラウザオプション" >
            <BrowserOptionsForm deviceList={ACTION_DEVICE_TYPES}/>
          </Accordion>
          <Accordion text="スクリーンショットオプション" >
            <ScreenshotOptionsForm />
          </Accordion>
          <div className="sectionTitle">ブラウザ操作</div>
          <hr className={styles.border}/>
          <small className={styles.sectionMessage}>
            <b>ブラウザ操作はスクリーンショットを撮影する前にブラウザに対して行う操作</b>のことです。<br/>
            スクリーンショットを撮影したいページへの遷移や事前のログインなどを行うことが可能です。
          </small>
          <Accordion className={styles.commonActionList} text="共通ブラウザ操作(前処理)" >
            <div className={styles.detail}>
              <div className={styles.message}>
                共通ブラウザ操作とは全ページで共通して実施するブラウザ操作です。<br/>
                共通ブラウザ操作の編集は<Link to={`/projects/${projectId}`}>こちら</Link>から
              </div>
              <input 
                name="isEnableBeforeCommonAction"
                className={styles.checkBox} 
                type="checkBox" 
                defaultChecked={isEnableBeforeCommonAction} 
                ref={register()}
              />共通ブラウザ操作を実行する
            </div>
          </Accordion>
          <ActionForm actionsName="actions" />
          <Accordion className={styles.commonActionList} text="共通ブラウザ操作(後処理)" >
            <div className={styles.detail}>
              <div className={styles.message}>
                共通ブラウザ操作とは全ページで共通して実施するブラウザ操作です。<br/>
                共通ブラウザ操作の編集は<Link to={`/projects/${projectId}`}>こちら</Link>から
              </div>
              <input 
                name="isEnableAfterCommonAction"
                className={styles.checkBox} 
                type="checkBox" 
                defaultChecked={isEnableAfterCommonAction} 
                ref={register()}
              />共通ブラウザ操作を実行する
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
  );
}