const v8n = require("v8n");
const _ = require("lodash");

// バリデーション処理の実行
const runValid = (validFunc, errorMessage="") => {
  try {
    validFunc();
  } catch (error) {
    console.error(error);

    error.message = errorMessage;
    error.statusCode = 400;
    throw error
  }
}
module.exports.runValid = runValid;

// アクションタイプのバリデーション
const actionTypeValid = ({value, prependKey="", errorMessage}) => {
  runValid( 
    () => {
      v8n()
        .not.null()
        .not.empty()
        .string()
        .check(value)
    },
    errorMessage || `[${prependKey}type] required.`
  );
}
module.exports.actionTypeValid = actionTypeValid;

// アクションタイプ名のバリデーション
const actionTypeNameValid = ({value, prependKey="", errorMessage}) => {
  runValid( 
    () => {
      v8n()
        .not.null()
        .not.empty()
        .string()
        .check(value)
    },
    errorMessage || `[${prependKey}typeName] required.`
  );
}
module.exports.actionTypeNameValid = actionTypeNameValid;

// アクション名のバリデーション
const actionNameValid = ({value, prependKey="", errorMessage}) => {
  runValid( 
    () => {
      v8n()
        .string()
        .length(0, 30)
        .check(value)
    },
    errorMessage || `[${prependKey}name] is max 30 characters.`
  );
}
module.exports.actionNameValid = actionNameValid;

// URLのバリデーション
const urlValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .pattern(new RegExp("https?://[\\w/:%#$&?()~.=+-]+"))
        .check(value)
    },
    errorMessage || `[${prependKey}url] url format and required.`
  );
}
module.exports.urlValid = urlValid;

// ミリ秒のバリデーション
const millsecondValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .integer()
        .check(value)
    },
    errorMessage || `[${prependKey}millsecond] is integer.`
  );
}
module.exports.millsecondValid = millsecondValid;

// Actionオブジェクト全てをバリデーション
 const actionValid = ({action, prependKey=""}) => {
   
  actionTypeValid({
    value: action.type,
    prependKey: prependKey
  })
  actionTypeNameValid({
    value: action.typeName,
    prependKey: prependKey
  })
  actionNameValid({
    value: action.name,
    prependKey: prependKey
  })
  switch(action.type) {
    case "GOTO": 
      urlValid({
        value: action.url,
        prependKey: prependKey
      });
      break;
    case "WAIT":
      millsecondValid({
        value: action.millsecond,
        prependKey: prependKey
      });
      break;
    default: 
      new Error("action type not found.");
      error.statusCode = 400;
      throw error;
  }
}
module.exports.actionValid = actionValid;