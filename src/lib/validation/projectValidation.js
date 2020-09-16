// TODO 
// /lambda/layer/my-lib/project-validatorの処理と同一
// スマートにコードの共通化する方法が見つかり次第、どちらかに寄せる
import v8n from "v8n";

const PROJECT_NAME = "name";
const PROJECT_DESCRIPTION = "description";
const PROJECT_TIE_USER_ID = "projectTieUserId";

// プロジェクト名のバリデーション
export const projectNameValid = (projectName, validErrorMessage) => {
  console.log(projectName);
  try {
    v8n()
      .string()
      .length(0, 30)
      .check(projectName);
  } catch (error) {
    console.error(error);

    // エラーメッセージのセット
    error.message = validErrorMessage || "プロジェクト名は最大30文字です";
    throw error;
  }
}

// プロジェクト説明のバリデーション
export const projectDescriptionValid = (projectDescription, validErrorMessage) => {
  try {
    v8n()
      .string()
      .length(0, 50)
      .check(projectDescription);
  } catch (error) {
    console.error(error);

    // エラーメッセージのセット
    error.message = validErrorMessage || "プロジェクト説明は最大50文字です";
    throw error;
  }
}

// プロジェクトに紐付けるユーザIDのバリデーション
export const projectTieUserIdValid = (projectTieUserId, validErrorMessage) => {
  try {
    v8n()
      .not.null()
      .not.empty()
      .string()
      .check(projectTieUserId);
  } catch (error) {
    console.error(error);

    // エラーメッセージのセット
    error.message = validErrorMessage || "プロジェクトに紐づくユーザIDは必須です";
    throw error;
  }
}

// バリデーションタイプを選択
export const valid = (validationType, project) => {  
  switch(validationType) {
    case PROJECT_NAME:
      return projectNameValid(project[validationType]);
    case PROJECT_DESCRIPTION:
      return projectDescriptionValid(project[validationType]);
    case PROJECT_TIE_USER_ID:
      return projectTieUserIdValid(project[validationType]);
    default:
      console.error("該当するバリデーションが存在しません");
  }
}

// Projectオブジェクト全てをバリデーション
export const projectValid = (project) => {
  Object.keys(project).forEach( inputType => {
    valid(inputType, project);
  });
}