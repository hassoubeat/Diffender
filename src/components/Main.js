import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import TopPage from './TopPage';
import UserInfo from 'components/auth/UserInfo';
import ProjectList from 'components/project/ProjectList';
import ProjectListQuickView from 'components/project/ProjectListQuickView';
import ProjectInfo from 'components/project/ProjectInfo';
import PageList from 'components/page/PageList';
import PageListQuickView from 'components/page/PageListQuickView';
import PageInfo from 'components/page/PageInfo';
import ResultList from 'components/result/ResultList';
import ResultListQuickView from 'components/result/ResultListQuickView';
import ResultInfo from 'components/result/ResultInfo';
import ResultItemList from 'components/resultItem/ResultItemList';
import ResultItemListQuickView from 'components/resultItem/ResultItemListQuickView';
import ResultItemInfo from 'components/resultItem/ResultItemInfo';
import ScreenshotInfo from 'components/screenshot/ScreenshotInfo';
import DiffScreenshotInfo from 'components/diff/DiffScreenshotInfo';
import NotFound404 from 'components/common/NotFound';
import styles from './Main.module.scss';

import _ from 'lodash';
import queryString from 'query-string';

import { 
  selectInitialLoadState,
  fetchPages,
  fetchResultItemsByResultId
} from 'app/domainSlice';

export default function Main() {

  // hook setup
  const dispatch = useDispatch();
  const isLoadedState = useSelector(selectInitialLoadState());

  // URLに含まれているidによって必要なデータを予め取得する
  const fetchData = (params) => {
    const projectId = params.projectId;
    const resultId = params.resultId;
    const isLoadedPages = _.get(isLoadedState, `pageListMap.${projectId}`, false);
    const isLoadedResultItems = _.get(isLoadedState, `resultItemListMap.${resultId}`, false);

    // ProjectIdがパラメータに存在する時、ProjectIdに紐づくPagesを取得する
    if (projectId) {
      if (!isLoadedPages) dispatch( fetchPages(projectId) );
    }

    // ResultIdがパラメータに存在する時、ResultIdに紐づくResultItemsを取得する
    if (resultId) {
      if (!isLoadedResultItems) dispatch( fetchResultItemsByResultId(resultId) );
    }
  }

  return (
    <div className={styles.main}>
      {/* <Breadcrumbs /> */}
      <Switch>
        <Route exact path="/" render={() => (
          <TopPage/>
        )} />
        <Route exact path="/user" render={() => (
          <UserInfo />
        )} />
        <Route exact path="/projects" render={({location}) => (
          <div className={styles.flex}>
            <div className={styles.quickView}>
              <ProjectListQuickView />
            </div>
            <div className={styles.content}>
              <ProjectList isIntialDisplayRegisterModal={
                !!getQueryparameter(location, "isIntialDisplayRegisterModal")
              } />
            </div>
          </div>
        )} />
        <Route exact path="/projects/:projectId" render={({match}) => (
          <React.Fragment>
            {fetchData(match.params)}
            <div className={styles.flex}>
              <div className={styles.quickView}>
                <ProjectListQuickView selectedProjectId={match.params.projectId} />
              </div>
              <div className={styles.quickView}>
                <PageListQuickView 
                  projectId={match.params.projectId} 
                />
              </div>
              <div className={styles.content}>
                <ProjectInfo projectId={match.params.projectId} />
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route exact path="/projects/:projectId/pages" render={({location, match}) => (
          <React.Fragment>
            {fetchData(match.params)}
            <div className={styles.flex}>
              <div className={styles.quickView}>
                <ProjectListQuickView selectedProjectId={match.params.projectId} />
              </div>
              <div className={styles.quickView}>
                <PageListQuickView 
                  projectId={match.params.projectId} 
                />
              </div>
              <div className={styles.content}>
                <PageList 
                  projectId={match.params.projectId} 
                  isIntialDisplayRegisterModal={
                    !!getQueryparameter(location, "isIntialDisplayRegisterModal")
                  }
                />
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route exact path="/projects/:projectId/pages/:pageId" render={({match}) => (
          <React.Fragment>
            {fetchData(match.params)}
            <div className={styles.flex}>
              <div className={styles.quickView}>
                <ProjectListQuickView selectedProjectId={match.params.projectId} />
              </div>
              <div className={styles.quickView}>
                <PageListQuickView 
                  projectId={match.params.projectId} 
                  selectedPageId={match.params.pageId} 
                />
              </div>
              <div className={styles.content}>
                <PageInfo projectId={match.params.projectId} pageId={match.params.pageId} />
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route exact path="/results" render={() => (
          <React.Fragment>
            <div className={styles.flex}>
              <div className={styles.quickView}>
                <ResultListQuickView />
              </div>
              <div className={styles.content}>
                <ResultList />
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route exact path="/results/:resultId" render={({match}) => (
          <React.Fragment>
            {fetchData(match.params)}
            <div className={styles.flex}>
              <div className={styles.quickView}>
                <ResultListQuickView selectedResultId={match.params.resultId} />
              </div>
              <div className={styles.quickView}>
                <ResultItemListQuickView resultId={match.params.resultId} />
              </div>
              <div className={styles.content}>
                <ResultInfo resultId={match.params.resultId} />
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route exact path="/results/:resultId/result-items" render={({match}) => (
          <React.Fragment>
            {fetchData(match.params)}
            <div className={styles.flex}>
              <div className={styles.quickView}>
                <ResultListQuickView selectedResultId={match.params.resultId} />
              </div>
              <div className={styles.quickView}>
                <ResultItemListQuickView 
                  resultId={match.params.resultId}
                />
              </div>
              <div className={styles.content}>
                <ResultItemList resultId={match.params.resultId} />
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route exact path="/results/:resultId/result-items/:resultItemId" render={({match}) => (
          <React.Fragment>
            {fetchData(match.params)}
            <div className={styles.flex}>
              <div className={styles.quickView}>
                <ResultListQuickView selectedResultId={match.params.resultId} />
              </div>
              <div className={styles.quickView}>
                <ResultItemListQuickView 
                  resultId={match.params.resultId}
                  selectedResultItemId={match.params.resultItemId} 
                />
              </div>
              <div className={styles.content}>
                <ResultItemInfo 
                  resultId={match.params.resultId} 
                  resultItemId={match.params.resultItemId} 
                />
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route exact path="/screenshot-request" render={() => (
          <ScreenshotInfo/ >
        )} />
        <Route exact path="/diff-screenshot-request" render={() => (
          <DiffScreenshotInfo/ >
        )} />
        <Route component={NotFound404} />
      </Switch>
    </div>
  );
}

// locationオブジェクトから指定したKeyのクエリパラメータを取得する
function getQueryparameter(location, key) {
  return _.get(queryString.parse(location.search), key);
}