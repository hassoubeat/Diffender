const v8n = require("v8n");

const PROJECT_NAME = "name";
const PROJECT_DESCRIPTION = "description";
const PROJECT_TIE_USER_ID = "projectTieUserId";

// プロジェクト名のバリデーション
const projectNameValid = (projectName, validErrorMessage) => {
  try {
    v8n()
      .string()
      .length(0, 30)
      .check(projectName);
  } catch (error) {
    console.error(error);

    // エラーメッセージのセット
    error.message = validErrorMessage || "プロジェクト名は最大30文字です";
    error.statusCode = 400;
    throw error;
  }
}
module.exports.projectNameValid = projectNameValid;

// プロジェクト説明のバリデーション
const projectDescriptionValid = (projectDescription, validErrorMessage) => {
  try {
    v8n()
      .string()
      .length(0, 50)
      .check(projectDescription);
  } catch (error) {
    console.error(error);

    // エラーメッセージのセット
    error.message = validErrorMessage || "プロジェクト説明は最大50文字です";
    error.statusCode = 400;
    throw error;
  }
}
module.exports.projectDescriptionValid = projectDescriptionValid;

// プロジェクトに紐付けるユーザIDのバリデーション
const projectTieUserIdValid = (projectTieUserId, validErrorMessage) => {
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
    error.statusCode = 400;
    throw error;
  }
}
module.exports.projectTieUserIdValid = projectTieUserIdValid;

// バリデーションタイプを選択
const valid = (validationType, project) => {  
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
module.exports.valid = valid;

// Projectオブジェクト全てをバリデーション
 const projectValid = (project) => {
  Object.keys(project).forEach( inputType => {
    valid(inputType, project);
  });
}
module.exports.projectValid = projectValid;