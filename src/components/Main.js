import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Breadcrumbs from 'components/common/Breadcrumbs';
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
import NotFound404 from 'components/common/NotFound';
import styles from './Main.module.scss';

export default function Main() {

  return (
    <div className={styles.main}>
      <Breadcrumbs />
      <Switch>
        <Route exact path="/user" render={() => (
          <UserInfo />
        )} />
        <Route exact path="/projects" render={() => (
          <div className={styles.flex}>
            <div className={styles.quickView}>
              <ProjectListQuickView />
            </div>
            <div className={styles.content}>
              <ProjectList />
            </div>
          </div>
        )} />
        <Route exact path="/projects/:projectId" render={({match}) => (
          <React.Fragment>
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
        <Route exact path="/projects/:projectId/pages" render={({match}) => (
          <React.Fragment>
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
                <PageList projectId={match.params.projectId} />
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route exact path="/projects/:projectId/pages/:pageId" render={({match}) => (
          <React.Fragment>
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
        <Route component={NotFound404} />
      </Switch>
    </div>
  );
}
