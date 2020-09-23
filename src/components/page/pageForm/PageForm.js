import React, { useState, useEffect } from 'react';
import BasicForm from './_BasicForm';
import BrowserOptionsForm from './_BrowserSettingsForm';
import ScreenshotOptionsForm from './_ScreenshotOptionsForm';
import ActionForm from 'components/page/pageForm/_ActionForm';
import Accordion from 'components/util/accordion/Accordion';
import Pagination from 'components/util/pagination/Pagination';
import * as toast from 'lib/util/toast';
import styles from './PageForm.module.scss';

export default function PageForm(props = null) {
  // パラメータ取得
  const isUpdate = !!props.pageId;
  // const projectId = props.projectId;
  const pageId = props.pageId;
  const postSuccessCallback = props.postSuccessCallback;
  const deleteSuccessCallback = props.deleteSuccessCallback;

  // 入力フォーム用のState定義
  const [pageName, setPageName] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [browserSettings, setBrowserSettings] = useState({});
  const [screenshotOptions, setScreenshotOptions] = useState({});
  const [actionList, setActionList] = useState([]);
  const [beforeCommonActionList, setBeforeCommonActionList] = useState([]);
  const [isEnableBeforeCommonAction, setIsEnableBeforeCommonAction] = useState(true);
  const [afterCommonActionList, setAfterCommonActionList] = useState([]);
  const [isEnableAfterCommonAction, setIsEnableAfterCommonAction] = useState(true);

  useEffect( () => {
    // TODO 共通アクションリストにセット
    if (!isUpdate) return;
    const asyncSetProject = async () => {
      const page = await getPage(pageId);;
      setPageName(page.pageName);
      setPageDescription(page.pageDescription);
      setBrowserSettings(page.browserSettings)
      setScreenshotOptions(page.screenshotOptions)
      setActionList(page.actionList);
      setIsEnableBeforeCommonAction(page.isEnableBeforeCommonAction);
      setIsEnableAfterCommonAction(page.isEnableAfterCommonAction);

      // TODO projectから取得
      setBeforeCommonActionList([
        {
          type: "GOTO",
          localName: "ページ遷移",
          name: "共通アクション(前) 1",
          url: "https://example.com",
          millisecond: 0,
          basicAuth: {
            user: "user",
            password: "password"
          }
        }
      ]);
      setAfterCommonActionList([
        {
          type: "GOTO",
          localName: "ページ遷移",
          name: "共通アクション(後) 1",
          url: "https://example.com",
          millisecond: 0,
          basicAuth: {
            user: "user",
            password: "password"
          }
        }
      ]);
    }
    asyncSetProject();
  }, [isUpdate, pageId]);

  return (
    <React.Fragment>
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
                <BasicForm payload={
                  {
                    pageName: pageName,
                    setPageName: setPageName,
                    pageDescription: pageDescription,
                    setPageDescription: setPageDescription
                  }
                }/>
                <Accordion text="ブラウザオプション" >
                  <BrowserOptionsForm payload={
                    {
                      browserSettings: browserSettings,
                      setBrowserSettings: setBrowserSettings,
                      // TODO 環境変数からデバイスリストを取得
                      deviceList: [
                        "iPhone 6",
                        "iPhone 5"
                      ]
                    }
                  }/>
                </Accordion>
                <Accordion text="スクリーンショットオプション" >
                  <ScreenshotOptionsForm payload={
                    {
                      screenshotOptions: screenshotOptions,
                      setScreenshotOptions: setScreenshotOptions
                    }
                  }/>
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
                    {/* 共通アクションが無効の時はdisable */}
                    <div className={(isEnableBeforeCommonAction) ? "" : styles.disable }>
                      <ActionForm
                        actionList={beforeCommonActionList} 
                        setActionList={setBeforeCommonActionList}
                      />
                    </div>
                    <div className={styles.enableActionToggle}>
                      <input className={styles.checkBox} type="checkBox" checked={isEnableBeforeCommonAction} onChange={
                        (e) => { 
                          setIsEnableBeforeCommonAction(e.target.checked);
                        }
                      } />共通アクションを実行する
                    </div>
                  </div>
                </Accordion>
                <ActionForm 
                  actionList={actionList} 
                  setActionList={setActionList}
                />
                <Accordion className={styles.commonActionList} text="共通アクション(後処理)" >
                  <div className={styles.detail}>
                    <div className={styles.message}>
                      共通アクションとはプロジェクトの全アクションで実施するアクションです。<br/>
                      多くの画面で共通して実行するアクション(ログアウトなど)は本機能に記載することを推奨します。<br/>
                    </div>
                    {/* 共通アクションが無効の時はdisable */}
                    <div className={(isEnableAfterCommonAction) ? "" : styles.disable }>
                      <ActionForm
                        actionList={afterCommonActionList} 
                        setActionList={setAfterCommonActionList}
                      />
                    </div>
                    <div className={styles.enableActionToggle}>
                      <input className={styles.checkBox} type="checkBox" checked={isEnableAfterCommonAction} onChange={
                        (e) => { 
                          setIsEnableAfterCommonAction(e.target.checked);
                        }
                      } />共通アクションを実行する
                    </div>
                  </div>
                </Accordion>
                <div className={styles.actionArea}>
                  <span className={styles.postButton} onClick={async () => { await postPage(
                    pageObjBuild(),
                    postSuccessCallback
                  )}}>
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

  async function postPage(postObj, successCallback) {
    console.log(postObj);
    toast.infoToast(
      { message: "リクエストを送信しました" }
    );
    // TODO APIの呼び出し
    // TODO 新規登録と更新で呼び出すAPIを変更
    // TODO 共通アクションリストの処理
    toast.infoToast(
      { message: "リクエストが完了しました" }
    );
    if (successCallback) successCallback();
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

  // Pageオブジェクトを生成する
  function pageObjBuild() {
    // TODO API側の仕様を決定した後に詳細を実装
    const test = JSON.stringify(actionList);
    console.log(actionList);
    console.log(test);
    console.log(JSON.parse(test));

    return {
      pageName: pageName,
      pageDescription: pageDescription,
      browserSettings: browserSettings,
      screenshotOptions: screenshotOptions,
      actionList: actionList,
      isEnableBeforeCommonAction: isEnableBeforeCommonAction,
      isEnableAfterCommonAction: isEnableAfterCommonAction
    }
  }
}