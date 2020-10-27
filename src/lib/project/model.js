import _ from 'lodash';
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
export function updateProjectListSortMap(projectList) {
  return bucketSort.generateSortMap(projectList, "id");
}

// プロジェクト一覧をソート
export function sortProjectList(projectList, projectSortMap={}) {
  // 降順でソート
  projectList.sort( (a, b) =>  {
    if( a.createDtUnix > b.createDtUnix ) return -1;
    if( a.createDtUnix < b.createDtUnix ) return 1;
    return 0;
  });
  const sortedObj = bucketSort.sort(projectList, projectSortMap, "id");
  return sortedObj.noSortedList.concat(sortedObj.sortedList);
}

// プロジェクトの登録
export async function postProject(project) {

  toast.infoToast(
    { message: `プロジェクトの登録リクエストを送信しました` }
  );

  try {
    const result = await api.postProject({
      request: {
        body: project
      }
    })

    toast.successToast(
      { message: `プロジェクトの登録が完了しました` }
    );

    return result;
  } catch (error) {
    console.log(error.response);

    let errorMessage = `プロジェクトの登録に失敗しました`;

    const responseMesssage = _.get(error, 'response.data.message');
    if (responseMesssage) {
      errorMessage += `<br/>${responseMesssage}`
    }

    toast.errorToast(
      { message: errorMessage }
    );
  }
}

// プロジェクトの変更
export async function putProject(project) {
  toast.infoToast(
    { message: `プロジェクトの変更リクエストを送信しました` }
  );

  try {
    const result = await api.putProject({
      projectId: project.id, 
      request : {
        body: project
      }
    });

    toast.successToast(
      { message: `プロジェクトの変更が完了しました` }
    );

    return result;

  } catch (error) {
    console.log(error.response);

    toast.errorToast(
      { message: `プロジェクトの変更に失敗しました` }
    );
  }
}

// プロジェクトの削除
export async function deleteProject(projectId) {
  toast.infoToast(
    { message: `プロジェクトの削除リクエストを送信しました` }
  );

  try {
    const result = await api.deleteProject({
      projectId: projectId
    });

    toast.successToast(
      { message: `プロジェクトの削除が完了しました` }
    );

    return result;
  } catch (error) {
    toast.errorToast(
      { message: `プロジェクトの削除に失敗しました` }
    );
  }
}

