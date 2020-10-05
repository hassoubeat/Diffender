import React, { useState, useEffect, createContext } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import BrowserOptionsForm from './_BrowserSettingsForm';
import ScreenshotOptionsForm from './_ScreenshotOptionsForm';
import ActionForm from 'components/page/pageForm/_ActionForm';
import Accordion from 'components/util/accordion/Accordion';
import Pagination from 'components/util/pagination/Pagination';
import UtilInput from 'components/util/input/Input';
import Loading from 'components/common/Loading';

import * as toast from 'lib/util/toast';
import * as api from 'lib/api/api';
import styles from './PageForm.module.scss';

export const PageContext = createContext();

export default function PageForm(props = null) {

  // パラメータ取得
  const isUpdate = !!props.pageId;
  const projectId = props.projectId;
  const pageId = props.pageId;
  const postSuccessCallback = props.postSuccessCallback;
  const deleteSuccessCallback = props.deleteSuccessCallback;

  // 入力フォーム用のState定義
  const [isLoading, setIsLoading] = useState(true);
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
      isEnableAfterCommonAction: true,
      beforeCommonActions: [],
      afterCommonActions: []
    }
  });
  const {register, errors, reset, watch, setValue, handleSubmit} = reactHookFormMethods;

  // watch
  const isEnableBeforeCommonAction = watch("isEnableBeforeCommonAction");
  const isEnableAfterCommonAction = watch("isEnableAfterCommonAction");

  useEffect( () => {
    // 共通アクションリストのセット
    const asyncSetCommonActions = async () => {
      const project = await api.getProject({
        projectId: projectId
      });
      setValue("beforeCommonActions", project.beforeCommonActions);
      setValue("afterCommonActions", project.afterCommonActions);
    }
    asyncSetCommonActions();

    // 更新でない場合は終了
    if (!isUpdate) {
      setIsLoading(false);
      return;
    }

    // ページ情報の取得
    const asyncSetPage = async () => {
      const page = await getPage(pageId);
      reset(page);
      setIsLoading(false);
    }
    asyncSetPage();
  }, [isUpdate, pageId, projectId, reset, setValue]);

  // submit成功時の処理
  const onSubmit = async (data) => { 
    toast.infoToast(
      { message: "ページの登録リクエストを送信しました" }
    );

    try {
      const project =  await api.getProject({
        projectId: projectId
      });

      // 共通アクションの登録
      await api.putProject({
        projectId: projectId, 
        request : {
          body: {
            ...project,
            beforeCommonActions: data.beforeCommonActions || [],
            afterCommonActions: data.afterCommonActions || []
          }
        }
      })

      // ページの登録
      await api.postPage({
        projectId: projectId,
        request: {
          body: {
            ...data,
            actions: data.actions || []
          }
        }
      });
      toast.successToast(
        { message: "ページの登録が完了しました" }
      );
      if(postSuccessCallback) postSuccessCallback();
    } catch (error) {
      console.log(error.response);
      toast.errorToast(
        { message: "ページの登録に失敗しました" }
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

  if (isLoading) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <form>
      <FormProvider {...reactHookFormMethods} >
      <div className={styles.pageForm}>
        <div className={styles.inputArea}>
          <Pagination renderList={
            [
              // 1P目
              <React.Fragment>
                <div className={styles.sectionTitle}>基本情報</div>
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
                    required: 'ページ名は必須です',
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
              </React.Fragment>,
              // 2P目
              <React.Fragment>
                <div className={styles.sectionTitle}>アクション</div>
                <small className={styles.sectionMessage}>
                  アクションとはスクリーンショットを撮影する前に行う処理です。<br/>
                  スクリーンショットを撮影したいページへの遷移や事前のログインなどを行うことが可能です。
                </small>
                <Accordion className={styles.commonActionList} text="共通アクション(前処理)" >
                  <div className={styles.detail}>
                    <div className={styles.message}>
                      共通アクションとはプロジェクトの全アクションで実施するアクションです。<br/>
                      多くの画面で共通して実行するアクション(ログインなど)は本機能に記載することを推奨します。<br/>
                    </div>
                    <div className={(isEnableBeforeCommonAction) ? "" : styles.disable }>
                      <ActionForm actionsName="beforeCommonActions" />
                    </div>
                    <div className={styles.enableActionToggle}>
                      <input 
                        name="isEnableBeforeCommonAction"
                        className={styles.checkBox} 
                        type="checkBox" 
                        defaultChecked={isEnableBeforeCommonAction} 
                        ref={register()}
                      />共通アクションを実行する
                    </div>
                  </div>
                </Accordion>
                <ActionForm actionsName="actions" />
                <Accordion className={styles.commonActionList} text="共通アクション(後処理)" >
                  <div className={styles.detail}>
                    <div className={styles.message}>
                      共通アクションとはプロジェクトの全アクションで実施するアクションです。<br/>
                      多くの画面で共通して実行するアクション(ログアウトなど)は本機能に記載することを推奨します。<br/>
                    </div>
                    <div className={(isEnableAfterCommonAction) ? "" : styles.disable }>
                      <ActionForm actionsName="afterCommonActions" />
                    </div>
                    <div className={styles.enableActionToggle}>
                      <input 
                        name="isEnableAfterCommonAction"
                        className={styles.checkBox} 
                        type="checkBox" 
                        defaultChecked={isEnableAfterCommonAction} 
                        ref={register()}
                      />共通アクションを実行する
                    </div>
                  </div>
                </Accordion>
                <div className={styles.actionArea}>
                  <span className={styles.postButton} onClick={
                    handleSubmit(onSubmit, onSubmitError)
                  }>
                    {(isUpdate) ? '更新' : '登録'}
                  </span>
                  {/* 更新時のみ削除ボタンを表示 */}
                  {(isUpdate) && <span className={styles.deleteButton} onClick={
                    async () => { 
                      await deletePage(pageId, deleteSuccessCallback)
                    }
                  }>削除</span>}
                </div>
              </React.Fragment>
            ]
          } />
        </div>
      </div>
      </FormProvider>
      </form>
    </React.Fragment>
  );

  async function getPage(pageId) {
    console.log(pageId);
    // TODO API呼び出し
    return {
      name: "test3",
      description: "",
      browserSettings: {
        deviceType: "iPhone5",
        deviceSize: "1200x900"
      },
      screenshotOptions: {
        fullPage: false
      },
      actions: [],
      isEnableBeforeCommonAction: true,
      isEnableAfterCommonAction: true,
      beforeCommonActions: [],
      afterCommonActions: []
    }
  }

  async function deletePage(pageId, successCallback) {
    console.log(pageId);
    if (!window.confirm('ページを削除しますか？')) return;

    toast.infoToast(
      { message: "削除リクエストを送信しました" }
    );
    // TODO APIの呼び出し
    toast.infoToast(
      { message: "削除が完了しました" }
    );
    if (successCallback) successCallback();
  }
}