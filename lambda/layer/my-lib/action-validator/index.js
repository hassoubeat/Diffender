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

// GOTO:URLのバリデーション
const gotoUrlValid = ({value, prependKey="", errorMessage}) => {
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
module.exports.gotoUrlValid = gotoUrlValid;

// WAIT:ミリ秒のバリデーション
const waitMillisecondValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .integer()
        .check(value)
    },
    errorMessage || `[${prependKey}millisecond] is integer and required.`
  );
}
module.exports.waitMillisecondValid = waitMillisecondValid;

// CLICK:セレクターのバリデーション
const clickSelectorValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .check(value)
    },
    errorMessage || `[${prependKey}selector] is required.`
  );
}
module.exports.clickSelectorValid = clickSelectorValid;

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
      gotoUrlValid({
        value: action.url,
        prependKey: prependKey
      });
      break;
    case "WAIT":
      waitMillisecondValid({
        value: action.millisecond,
        prependKey: prependKey
      });
      break;
    case "CLICK":
      clickSelectorValid({
        value: action.millisecond,
        prependKey: prependKey
      });
      break;
    default: 
      const error = new Error(`action type ${action.type} not found.`);
      error.statusCode = 400;
      throw error;
  }
}
module.exports.actionValid = actionValid;