import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PageForm from './pageForm/PageForm';
import styles from './PageInfo.module.scss';

import { setLoadedPageListMap, selectLoadedPageListMap } from 'app/appSlice';

import _ from 'lodash';
import * as pageModel from 'lib/page/model';

export default function PageInfo(props = null) {
  // props setup
  const projectId = props.projectId;
  const pageId = props.pageId;

  // hook setup
  const history = useHistory();
  const dispatch = useDispatch();

  // redux-state setup
  const loadedPageListMap = useSelector(selectLoadedPageListMap);

  return (
    <React.Fragment>
      <div className={styles.pageInfo}>
        <PageForm 
          projectId={projectId} 
          pageId={pageId} 
          postSuccessCallback={ async () => {
            const pageList = await pageModel.getPageList(projectId);
            dispatch(setLoadedPageListMap(_.cloneDeep({
              ...loadedPageListMap,
              [projectId]: pageList
            })));
          }}
          deleteSuccessCallback={ async () => {
            const pageList = await pageModel.getPageList(projectId);
            dispatch(setLoadedPageListMap(_.cloneDeep({
              ...loadedPageListMap,
              [projectId]: pageList
            })));
            history.push(`/projects/${projectId}/pages`)} 
          }
        />
      </div>  
    </React.Fragment>
  );
}
