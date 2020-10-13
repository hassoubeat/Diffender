import React, { useState, useEffect, createContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormProvider, useForm } from "react-hook-form";
import BrowserOptionsForm from './_BrowserSettingsForm';
import ScreenshotOptionsForm from './_ScreenshotOptionsForm';
import ScreenshotTest from './_ScreenshotTest';
import ActionForm from 'components/action/ActionForm';
import Accordion from 'components/util/accordion/Accordion';
import UtilInput from 'components/util/input/Input';
import Loading from 'components/common/Loading';

import { 
  selectLoadedPageListMap　
} from 'app/domainSlice';

import _ from 'lodash';
import * as toast from 'lib/util/toast';
import * as api from 'lib/api/api';
import styles from './PageForm.module.scss';

export const PageContext = createContext();

export default function PageForm(props = null) {
  // props setup
  const isUpdate = !!props.pageId;
  const projectId = props.projectId;
  const pageId = props.pageId;
  const postSuccessCallback = props.postSuccessCallback;
  const deleteSuccessCallback = props.deleteSuccessCallback;

  // redux-state setup
  const loadedPageListMap = useSelector(selectLoadedPageListMap);
  const pageList = _.get(loadedPageListMap, projectId, []);
  const reduxStatePage = pageList.find( (page) => {
    return page.id === pageId;
  });

  // state setup
  const [isLoading, setIsLoading] = useState(isUpdate);

  // ReactHookForm setup
  const reactHookFormMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: "",
      description: "",
      browserSettings: {
        deviceType: "iPhone 6"
      },
      screenshotOptions: {
        fullPage: false
      },
      actions: [],
      isEnableBeforeCommonAction: true,
      isEnableAfterCommonAction: true
    }
  });
  const {register, errors, reset, watch, setValue, handleSubmit} = reactHookFormMethods;

  // watch
  const isEnableBeforeCommonAction = watch("isEnableBeforeCommonAction");
  const isEnableAfterCommonAction = watch("isEnableAfterCommonAction");

  useEffect( () => {
    // 更新でない場合は終了
    if (!isUpdate) {
      setIsLoading(false);
      return;
    }

    // ページ情報の取得
    const asyncSetPage = async () => {
      // ReduxStateを優先、なかったらAPIで取得
      const page = reduxStatePage || await api.getPage({
        projectId: projectId,
        pageId: pageId
      });
      reset(page);
      setIsLoading(false);
    }
    asyncSetPage();
  }, [isUpdate, pageId, projectId, reset, setValue, reduxStatePage]);

  // submit成功時の処理
  const onSubmit = async (page) => { 
    const eventName = (isUpdate) ? "更新" : "登録";

    toast.infoToast(
      { message: `ページの${eventName}リクエストを送信しました` }
    );

    try {    
      page.actions = page.actions || [];
      page.actions.forEach((action) => {
        // TODO 数値型のキャスト変換
        // ReactHookFormで数値の自動キャストに対応していないため、手動キャスト
        // 自動キャストを追加するかの議論は https://github.com/react-hook-form/react-hook-form/issues/615
        // 自動キャストが実装された場合は対応して本処理を除外
        if (action.millisecond) action.millisecond = Number(action.millisecond);
      });

      if (isUpdate) {
        // ページの更新
        const updatePage = await api.getPage({
          projectId: projectId,
          pageId: pageId
        })
        await api.putPage({
          projectId: projectId, 
          pageId: pageId, 
          request : {
            body: {
              ...updatePage,
              ...page
            }
          }
        });
      } else {
        // ページの登録
        await api.postPage({
          projectId: projectId,
          request: {
            body: page
          }
        });
      }
      toast.successToast(
        { message: `ページの${eventName}が完了しました` }
      );
      if(postSuccessCallback) postSuccessCallback();
    } catch (error) {
      console.log(error.response);
      toast.errorToast(
        { message: `ページの${eventName}に失敗しました` }
      );
    }
  };

  // submit失敗時(バリデーションエラー)が発生した時のイベント処理
  const onSubmitError = (error) => { 
    console.table(error);
    console.log(error)
    toast.errorToast(
      { message: "入力エラーが存在します" }
    )
  };

  // 削除ボタン押下時の処理
  const handleDeleteProject = async () => {
    if (!window.confirm("ページを削除しますか？")) return;
    toast.infoToast(
      { message: "ページの削除リクエストを送信しました" }
    );
    try {
      await api.deletePage({
        projectId: projectId,
        pageId: pageId
      });
      toast.successToast(
        { message: "ページの削除が完了しました" }
      );
      if (deleteSuccessCallback) deleteSuccessCallback();
    } catch (error) {
      toast.errorToast(
        { message: "ページの削除に失敗しました" }
      );
    }
  }

  if (isLoading) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <form>
      <FormProvider {...reactHookFormMethods} >
      <div className={styles.pageForm}>
        <div className={styles.inputArea}>
          <div className={styles.sectionTitle}>基本情報</div>
          <hr className={styles.border}/>
          <small className={styles.sectionMessage}>
            ページに関する基本情報を設定します。
          </small>
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
            <BrowserOptionsForm deviceList={
              // TODO 環境変数からデバイスリストを取得
              [
                "iPhone 6",
                "iPhone 5"
              ]
            }/>
          </Accordion>
          <Accordion text="スクリーンショットオプション" >
            <ScreenshotOptionsForm />
          </Accordion>
          <div className={styles.sectionTitle}>アクション</div>
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
            {/* 更新時のみ削除ボタンを表示 */}
            {(isUpdate) && <span className={styles.deleteButton} onClick={
              async () => { 
                await handleDeleteProject();
              }
            }>削除</span>}
          </div>
        </div>
      </div>
      </FormProvider>
      </form>
    </React.Fragment>
  );
}