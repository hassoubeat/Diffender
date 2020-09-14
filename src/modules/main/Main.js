import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Breadcrumbs from 'modules/breadcrumbs/Breadcrumbs';
import UserInfo from 'modules/userInfo/UserInfo';
import ProjectList from 'modules/projectList/ProjectList';
import ProjectInfo from 'modules/projectInfo/ProjectInfo';
import PageList from 'modules/pageList/PageList';
import PageInfo from 'modules/pageInfo/PageInfo';
import ResultList from 'modules/resultList/ResultList';
import ResultInfo from 'modules/resultInfo/ResultInfo';
import NotFound404 from 'modules/notFound/NotFound';
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
