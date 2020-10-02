import React, { useState, useEffect, createContext } from 'react';
import { useImmer } from "use-immer";
import { FormProvider, useForm } from "react-hook-form";
import BasicForm from './_BasicForm';
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
  const [isLoading, setIsLoading] = useState(isUpdate);
  const [page, setPage] = useImmer({
    name: "",
    description: "",
    browserSettings: {
      deviceType: "iPhone6"
    },
    screenshotOptions: {
      fullPage: false
    },
    actions: [],
    isEnableBeforeCommonAction: true,
    isEnableAfterCommonAction: true
  });
  const [beforeCommonActions, setBeforeCommonActions] = useState([]);
  const [afterCommonActions, setAfterCommonActions] = useState([]);

  // ReactHookForm setup
  const reactHookFormMethods = useForm({
    mode: 'onChange'
  });
  const {register, errors} = reactHookFormMethods;
  const onSubmit = (data) => { console.table(data) };

  useEffect( () => {
    // 共通アクションリストのセット
    const asyncSetCommonActions = async () => {
      const project = await api.getProject(projectId);
      setBeforeCommonActions(project.beforeCommonActions);
      setAfterCommonActions(project.afterCommonActions);
    }
    asyncSetCommonActions();

    // 更新でない場合は終了
    if (!isUpdate) return;

    // ページ情報の取得
    const asyncSetPage = async () => {
      const page = await api.getPage(projectId, pageId);
      setPage(page);
      setIsLoading(false);
    }
    asyncSetPage();
  }, [isUpdate, pageId, projectId, setPage]);

  if (isLoading) return (
    <Loading/>
  );

  return (
    <React.Fragment>
      <form onSubmit={reactHookFormMethods.handleSubmit(onSubmit)}>
      <FormProvider {...reactHookFormMethods} >
      <PageContext.Provider value={{page, setPage}}>
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
                  defaultValue={ page.name } 
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
                  defaultValue={ page.description } 
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
              </React.Fragment>
            ]
          } />
        </div>
        <button type="submit">Submit</button>
      </div>
      </PageContext.Provider>
      </FormProvider>
      </form>
    </React.Fragment>
  );

  async function getPage(pageId) {
    console.log(pageId);
    // TODO API呼び出し
    return {
      id: "Page-1",
      pageName: "ページ1",
      pageDescription: "example.comのTOPページ",
      browserSettings: {
        deviceType: "iPhone 6"
      },
      screenshotOptions: {
        fullPage: true
      },
      isEnableBeforeCommonAction: true,
      isEnableAfterCommonAction: false,
      actionList: [
        {
          type: "GOTO",
          localName: "ページ遷移",
          name: "アクション1",
          url: "https://example.com",
          millisecond: 0,
          basicAuth: {
            user: "user",
            password: "password"
          }
        },
        {
          type: "WAIT",
          localName: "待機",
          name: "アクション2",
          url: "",
          millisecond: 1000,
          basicAuth: {
            user: "",
            password: ""
          }
        },
      ]
    }
  }

  // async function postPage(postObj, successCallback) {
  //   console.log(postObj);
  //   toast.infoToast(
  //     { message: "リクエストを送信しました" }
  //   );
  //   // TODO APIの呼び出し
  //   // TODO 新規登録と更新で呼び出すAPIを変更
  //   // TODO 共通アクションリストの処理
  //   toast.infoToast(
  //     { message: "リクエストが完了しました" }
  //   );
  //   if (successCallback) successCallback();
  // }

  // async function deletePage(pageId, successCallback) {
  //   console.log(pageId);
  //   if (!window.confirm('ページを削除しますか？')) return;

  //   toast.infoToast(
  //     { message: "削除リクエストを送信しました" }
  //   );
  //   // TODO APIの呼び出し
  //   toast.infoToast(
  //     { message: "削除が完了しました" }
  //   );
  //   if (successCallback) successCallback();
  // }

  // // Pageオブジェクトを生成する
  // function pageObjBuild() {
  //   // TODO API側の仕様を決定した後に詳細を実装
  //   const test = JSON.stringify(actionList);
  //   console.log(actionList);
  //   console.log(test);
  //   console.log(JSON.parse(test));

  //   return {
  //     pageName: pageName,
  //     pageDescription: pageDescription,
  //     browserSettings: browserSettings,
  //     screenshotOptions: screenshotOptions,
  //     actionList: actionList,
  //     isEnableBeforeCommonAction: isEnableBeforeCommonAction,
  //     isEnableAfterCommonAction: isEnableAfterCommonAction
  //   }
  // }
}


// // 2P目
// <React.Fragment>
// <div className={styles.sectionTitle}>アクション</div>
// <small className={styles.sectionMessage}>
//   アクションとはスクリーンショットを撮影する前に行う処理です。<br/>
//   スクリーンショットを撮影したいページへの遷移や事前のログインなどを行うことが可能です。
// </small>
// <Accordion className={styles.commonActionList} text="共通アクション(前処理)" >
//   <div className={styles.detail}>
//     <div className={styles.message}>
//       共通アクションとはプロジェクトの全アクションで実施するアクションです。<br/>
//       多くの画面で共通して実行するアクション(ログインなど)は本機能に記載することを推奨します。<br/>
//     </div>
//     {/* 共通アクションが無効の時はdisable */}
//     <div className={(isEnableBeforeCommonAction) ? "" : styles.disable }>
//       <ActionForm
//         actionList={beforeCommonActionList} 
//         setActionList={setBeforeCommonActionList}
//       />
//     </div>
//     <div className={styles.enableActionToggle}>
//       <input className={styles.checkBox} type="checkBox" checked={isEnableBeforeCommonAction} onChange={
//         (e) => { 
//           setIsEnableBeforeCommonAction(e.target.checked);
//         }
//       } />共通アクションを実行する
//     </div>
//   </div>
// </Accordion>
// <ActionForm 
//   actionList={actionList} 
//   setActionList={setActionList}
// />
// <Accordion className={styles.commonActionList} text="共通アクション(後処理)" >
//   <div className={styles.detail}>
//     <div className={styles.message}>
//       共通アクションとはプロジェクトの全アクションで実施するアクションです。<br/>
//       多くの画面で共通して実行するアクション(ログアウトなど)は本機能に記載することを推奨します。<br/>
//     </div>
//     {/* 共通アクションが無効の時はdisable */}
//     <div className={(isEnableAfterCommonAction) ? "" : styles.disable }>
//       <ActionForm
//         actionList={afterCommonActionList} 
//         setActionList={setAfterCommonActionList}
//       />
//     </div>
//     <div className={styles.enableActionToggle}>
//       <input className={styles.checkBox} type="checkBox" checked={isEnableAfterCommonAction} onChange={
//         (e) => { 
//           setIsEnableAfterCommonAction(e.target.checked);
//         }
//       } />共通アクションを実行する
//     </div>
//   </div>
// </Accordion>
// <div className={styles.actionArea}>
//   <span className={styles.postButton} onClick={async () => { await postPage(
//     pageObjBuild(),
//     postSuccessCallback
//   )}}>
//     {(isUpdate) ? '更新' : '登録'}
//   </span>
//   {/* 更新時のみ削除ボタンを表示 */}
//   {(isUpdate) && <span className={styles.deleteButton} onClick={
//     async () => { 
//       await deletePage(pageId, deleteSuccessCallback)
//     }
//   }>削除</span>}
// </div>
// </React.Fragment>