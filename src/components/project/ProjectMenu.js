import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './ProjectMenu.module.scss';

export default function ProjectMenu(props = null) {
  // props setup
  const projectId = props.projectId;

  // hook setup
  const history = useHistory();
  const location = useLocation();

  const isSelectMenu = (pattern) => {
    const reg = new RegExp(pattern);
    return reg.test(location.pathname) && styles.selected;
  }

  return (
    <ul className={styles.projectMenu}>
      <li 
        className={`${styles.item} ${isSelectMenu(`^/projects/${projectId}$`)}`}
        onClick={() => {
          history.push(`/projects/${projectId}`);
        }}
      >
        <i className="fas fa-desktop"/> サイト
      </li>
      <li 
        className={`${styles.item} ${isSelectMenu(`^/projects/${projectId}/pages.*$`)}`}
        onClick={() => {
          history.push(`/projects/${projectId}/pages`);
        }}
      >
        <i className="far fa-file-alt"/> ページ
      </li>
      <li 
        className={`${styles.item} ${isSelectMenu(`^/projects/${projectId}/screenshots.*$`)}`}
        onClick={() => {
          history.push(`/projects/${projectId}/screenshots`);
        }}
      >
        <i className="far fa-image"/> SS
      </li>
      <li 
        className={`${styles.item} ${isSelectMenu(`^/projects/${projectId}/diffs.*$`)}`}
        onClick={() => {
          history.push(`/projects/${projectId}/diffs`);
        }}
      >
        <i className="far fa-images"></i> DIFF
      </li>
    </ul>
  );
}