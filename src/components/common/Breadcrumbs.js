import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectBreadcrumbs, setBreadcrumbs } from 'app/appSlice';
import styles from './Breadcrumbs.module.scss';

export default function Breadcrumbs() {
  const dispatch = useDispatch();
  const breadcrumbs = useSelector(selectBreadcrumbs);
  const location = useLocation();

  useEffect(() => {
    // パス変更時、パンくずリストを再生成
    dispatch(setBreadcrumbs(outputBreadcrumbs(location)));
  }, [dispatch, location]);
  
  // パンくずリストの配列が空だった場合、オブジェクトを非表示
  if (breadcrumbs.length === 0) return "";

  const breadcrumbItems = breadcrumbs.map( (breadcrumb, index) => (
    <div className={styles.breadcrumb} key={`breadcrumb-${index}`} >
      <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
    </div>
  ));

  return (
    <React.Fragment>
      <div className={styles.breadcrumbs}>
        {breadcrumbItems}
      </div>
    </React.Fragment>
  );
}

// パンくずリストの出力
function outputBreadcrumbs(location) {
  let breadcrumbs = [];

  let chainPath = "";
  for (const pathItem of location.pathname.split('/')) {
    if (pathItem === "") continue;
    chainPath += `/${pathItem}`
    breadcrumbs.push({
      title: pathItem,
      path: chainPath
    })
  }
  return breadcrumbs;
}