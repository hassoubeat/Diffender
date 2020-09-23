import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Breadcrumbs from 'components/common/Breadcrumbs';
import UserInfo from 'components/auth/UserInfo';
import ProjectList from 'components/project/ProjectList';
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
          <ProjectInfo projectId={match.params.projectId} />
        )} />
        <Route exact path="/projects/:projectId/pages" render={({match}) => (
          <PageList projectId={match.params.projectId} />
        )} />
        <Route exact path="/projects/:projectId/pages/:pageId" render={({match}) => (
          <PageInfo projectId={match.params.projectId} pageId={match.params.pageId} />
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
