import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Breadcrumbs from 'components/common/Breadcrumbs';
import UserInfo from 'components/auth/UserInfo';
import ProjectList from 'components/project/ProjectList';
import ProjectListQuickView from 'components/project/ProjectListQuickView';
import ProjectInfo from 'components/project/ProjectInfo';
import PageList from 'components/page/PageList';
import PageInfo from 'components/page/PageInfo';
import ResultList from 'components/result/ResultList';
import ResultInfo from 'components/result/ResultInfo';
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
        <Route exact path="/projects" component={ProjectList} />
        <Route exact path="/projects/:projectId" render={({match}) => (
          <React.Fragment>
            <div className={styles.flex}>
              <div className={styles.projectListQuickView}>
                <ProjectListQuickView selectedProjectId={match.params.projectId} />
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
              <div className={styles.projectListQuickView}>
                <ProjectListQuickView selectedProjectId={match.params.projectId} />
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
              <div className={styles.projectListQuickView}>
                <ProjectListQuickView selectedProjectId={match.params.projectId} />
              </div>
              <div className={styles.content}>
                <PageInfo projectId={match.params.projectId} pageId={match.params.pageId} />
              </div>
            </div>
          </React.Fragment>
        )} />
        <Route exact path="/results" component={ResultList} />
        <Route exact path="/results/:resultId" render={({match}) => (
          <ResultInfo resultId={match.params.resultId} />
        )} />
        <Route component={NotFound404} />
      </Switch>
    </div>
  );
}
