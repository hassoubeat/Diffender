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
export async function updateProjectListSortMap(projectList) {
  const userOption = await api.getUserOption();
  userOption.projectsSortMap = bucketSort.generateSortMap(projectList, "id");;
  const request = {
    body: userOption
  }
  await api.putUserOption(request);
}

// プロジェクト一覧をソート
export async function sortProjectList(projectList) {
  const userOption = await api.getUserOption();
  const projectsSortMap = userOption.projectsSortMap || {};
  const sortedObj = bucketSort.sort(projectList, projectsSortMap, "id");
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