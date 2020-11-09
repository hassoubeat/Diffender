import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProjectMenu from 'components/project/ProjectMenu';
import ProjectInfo from 'components/project/ProjectInfo';
import ProjectListQuickView from 'components/project/ProjectListQuickView';
import ProjectList from 'components/project/ProjectList';
import PageList from 'components/page/PageList';
import PageListQuickView from 'components/page/PageListQuickView';
import PageInfo from 'components/page/PageInfo';
import ResultList from 'components/result/ResultList';
import ResultListQuickView from 'components/result/ResultListQuickView';
import ResultItemList from 'components/resultItem/ResultItemList';
import ResultItemListQuickView from 'components/resultItem/ResultItemListQuickView';
import ResultItemInfo from 'components/resultItem/ResultItemInfo';
import NotFound404 from 'components/common/NotFound';
import styles from './ProjectView.module.scss';

import _ from 'lodash';
import queryString from 'query-string';

export default function ProjectView(props = null) {
  // props setup
  const fetchData = props.fetchData;

  return (
    <Switch>
      <Route path="/projects/:projectId" render={({match}) => (
        <div className={styles.flex}>
          <div className={styles.quickView}>
            <ProjectListQuickView selectedProjectId={match.params.projectId} />
          </div>
          <div className={styles.content}>
            <ProjectMenu projectId={match.params.projectId} />
              <Switch>
                {/* プロジェクト詳細 */}
                <Route exact path="/projects/:projectId" render={({match}) => (
                  <ProjectInfo projectId={match.params.projectId} />
                )} />
                {/* ページ一覧 */}
                <Route exact path="/projects/:projectId/pages" render={({location, match}) => (
                  <React.Fragment>
                    {fetchData(match.params)}
                    <PageList 
                      projectId={match.params.projectId} 
                      isIntialDisplayRegisterModal={
                        !!getQueryparameter(location, "isIntialDisplayRegisterModal")
                      }
                    />
                  </React.Fragment>
                )} />
                {/* ページ詳細 */}
                <Route exact path="/projects/:projectId/pages/:pageId" render={({location, match}) => (
                  <React.Fragment>
                    {fetchData(match.params)}
                    <div className={styles.flex}>
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
                {/* プロジェクトに紐づくリザルト(スクリーンショット) */}
                <Route exact path="/projects/:projectId/screenshots" render={({match}) => (
                  <React.Fragment>
                    {fetchData(match.params)}
                    <ResultList 
                      projectId={match.params.projectId}
                      sectionTitle="スクリーンショット一覧"
                      isDisplayListCount={false}
                      isDisplayFilter={false}
                      isInitSearchDiffResultFilter={false}
                      isDisplaySSFilter={false}
                      isDisplayDiffFilter={false}
                      toResultInfoLink={`/projects/${match.params.projectId}/screenshots`}
                    />
                  </React.Fragment>
                )} />
                {/* リザルト(スクリーンショット)の詳細 */}
                <Route exact path="/projects/:projectId/screenshots/:resultId" render={({match}) => (
                  <React.Fragment>
                    {fetchData(match.params)}
                    <div className={styles.flex}>
                      <div className={styles.quickView}>
                        <ResultListQuickView 
                          projectId={match.params.projectId}
                          isSearchDiffResultFilter={false}
                          selectedResultId={match.params.resultId}
                          isDisplayListCount={false}
                          toResultInfoLink={`/projects/${match.params.projectId}/screenshots`}
                        />
                      </div>
                      <div className={styles.content}>
                        <ResultItemList
                          resultId={match.params.resultId}
                          toResultItemInfoLink={`/projects/${match.params.projectId}/screenshots/${match.params.resultId}`}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                )} />
                {/* スクリーンショット */}
                <Route exact path="/projects/:projectId/screenshots/:resultId/:resultItemId" render={({match}) => (
                  <React.Fragment>
                    {fetchData(match.params)}
                    <div className={styles.flex}>
                      <div className={styles.quickView}>
                        <ResultListQuickView 
                          projectId={match.params.projectId}
                          isSearchDiffResultFilter={false}
                          selectedResultId={match.params.resultId}
                          isDisplayListCount={false}
                          toResultInfoLink={`/projects/${match.params.projectId}/screenshots`}
                        />
                      </div>
                      <div className={styles.quickView}>
                        <ResultItemListQuickView 
                          resultId={match.params.resultId}
                          selectedResultItemId={match.params.resultItemId}
                          isDisplayListCount={false}
                          toResultItemInfoLink={`/projects/${match.params.projectId}/screenshots/${match.params.resultId}`}
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
                {/* プロジェクトに紐づくリザルト(Diff) */}
                <Route exact path="/projects/:projectId/diffs" render={({match}) => (
                  <React.Fragment>
                    {fetchData(match.params)}
                    <ResultList 
                      projectId={match.params.projectId}
                      sectionTitle="Diff一覧"
                      isDisplayListCount={false}
                      isDisplayFilter={false}
                      isInitSearchScreenshotResultFilter={false}
                      isDisplaySSFilter={false}
                      isDisplayDiffFilter={false}
                      toResultInfoLink={`/projects/${match.params.projectId}/diffs`}
                    />
                  </React.Fragment>
                )} />
                {/* リザルト(Diff)の詳細 */}
                <Route exact path="/projects/:projectId/diffs/:resultId" render={({match}) => (
                  <React.Fragment>
                    {fetchData(match.params)}
                    <div className={styles.flex}>
                      <div className={styles.quickView}>
                        <ResultListQuickView 
                          projectId={match.params.projectId}
                          isSearchScreenshotResultFilter={false}
                          selectedResultId={match.params.resultId}
                          isDisplayListCount={false}
                          toResultInfoLink={`/projects/${match.params.projectId}/diffs`}
                        />
                      </div>
                      <div className={styles.content}>
                        <ResultItemList
                          resultId={match.params.resultId}
                          toResultItemInfoLink={`/projects/${match.params.projectId}/diffs/${match.params.resultId}`}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                )} />
                {/* Diff */}
                <Route exact path="/projects/:projectId/diffs/:resultId/:resultItemId" render={({match}) => (
                  <React.Fragment>
                    {fetchData(match.params)}
                    <div className={styles.flex}>
                      <div className={styles.quickView}>
                        <ResultListQuickView 
                          projectId={match.params.projectId}
                          isSearchScreenshotResultFilter={false}
                          selectedResultId={match.params.resultId}
                          isDisplayListCount={false}
                          toResultInfoLink={`/projects/${match.params.projectId}/diffs`}
                        />
                      </div>
                      <div className={styles.quickView}>
                        <ResultItemListQuickView 
                          resultId={match.params.resultId}
                          selectedResultItemId={match.params.resultItemId}
                          isDisplayListCount={false}
                          toResultItemInfoLink={`/projects/${match.params.projectId}/diffs/${match.params.resultId}`}
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
                {/* NotFound */}
                <Route component={NotFound404} />
              </Switch>
            </div>
          </div>
      )} />
      {/* プロジェクト一覧 */}
      <Route exact render={({location}) => (
        <ProjectList 
          isIntialDisplayRegisterModal={
            !!getQueryparameter(location, "isIntialDisplayRegisterModal")
          } 
        />
      )} />
    </Switch>
  );
}

// locationオブジェクトから指定したKeyのクエリパラメータを取得する
function getQueryparameter(location, key) {
  return _.get(queryString.parse(location.search), key);
}