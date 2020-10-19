import * as bucketSort from 'lib/util/bucketSort';
import * as api from 'lib/api/api';
import * as toast from 'lib/util/toast';

// プロジェクト一覧のフィルタリング処理
export function filterProjectList(projectList, searchWord) {
  return projectList.filter((project) => {
    // プロジェクト名に検索ワードが含まれる要素のみフィルタリング
    return project.name.match(searchWord);
  });
}

// プロジェクトソートマップの更新
export async function updateProjectListSortMap(projectList, userOption) {
  userOption.projectsSortMap = bucketSort.generateSortMap(projectList, "id");
  const request = {
    body: userOption
  }
  return await api.putUserOption(request);
}

// プロジェクト一覧をソート
export function sortProjectList(projectList, projectSortMap={}) {
  const sortedObj = bucketSort.sort(projectList, projectSortMap, "id");
  return sortedObj.noSortedList.concat(sortedObj.sortedList);
}

// プロジェクト一覧の取得
export async function getProjectList() {
  let projectList = [];
  try {
    projectList = await api.getProjectList({});
  } catch (error) {
    toast.errorToast(
      { message: "プロジェクト一覧の取得に失敗しました" }
    );
  }
  // ソートして返却
  return　sortProjectList(projectList);
}