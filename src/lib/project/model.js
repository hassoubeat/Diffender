import * as bucketSort from 'lib/util/bucketSort';

// プロジェクト一覧のフィルタリング処理
export function filterProjectList(projectList, searchWord) {
  return projectList.filter((project) => {
    // プロジェクト名に検索ワードが含まれる要素のみフィルタリング
    return project.name.match(searchWord);
  });
}

// プロジェクトソートマップの更新
export function updateProjectListSortMap(projectList) {
  return bucketSort.generateSortMap(projectList, "id");
}

// プロジェクト一覧をソート
export function sortProjectList(projectList, projectSortMap={}) {
  const sortedObj = bucketSort.sort(projectList, projectSortMap, "id");
  return sortedObj.noSortedList.concat(sortedObj.sortedList);
}