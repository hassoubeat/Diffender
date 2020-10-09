const v8n = require("v8n");
const actionValidator = require("action-validator");

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

// Projectオブジェクト全てをバリデーション
 const projectValid = (project) => {
  projectNameValid(project.name);
  projectDescriptionValid(project.description);
  project.beforeCommonActions.forEach( (action, index) => {
    actionValidator.actionValid({
      action: action,
      prependKey: `beforeCommonActions[${index}].`
    })
  });
  project.afterCommonActions.forEach( (action, index) => {
    actionValidator.actionValid({
      action: action,
      prependKey: `afterCommonActions[${index}].`
    })
  });
}
module.exports.projectValid = projectValid;