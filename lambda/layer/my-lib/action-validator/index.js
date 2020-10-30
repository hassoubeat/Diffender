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
        .not.undefined()
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
        .not.undefined()
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
        .not.undefined()
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
        .not.undefined()
        .integer()
        .check(value)
    },
    errorMessage || `[${prependKey}millisecond] is integer and required.`
  );
}
module.exports.waitMillisecondValid = waitMillisecondValid;

// CLICK:セレクターのバリデーション
const clickSelectorValid = ({value, prependKey="", errorMessage}) => {
  console.log(value);
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .not.undefined()
        .check(value)
    },
    errorMessage || `[${prependKey}selector] is required.`
  );
}
module.exports.clickSelectorValid = clickSelectorValid;

// FUCUS:セレクターのバリデーション
const focusSelectorValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .not.undefined()
        .check(value)
    },
    errorMessage || `[${prependKey}focus] is required.`
  );
}
module.exports.focusSelectorValid = focusSelectorValid;

// INPUT:入力のselectorバリデーション
const inputSelectorValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .not.undefined()
        .check(value)
    },
    errorMessage || `[${prependKey}selector] is required.`
  );
}
module.exports.inputSelectorValid = inputSelectorValid;

// INPUT:入力のバリデーション
const inputValueValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .length(0, 1000)
        .check(value)
    },
    errorMessage || `[${prependKey}value] is max 1000 characters.`
  );
}
module.exports.inputValueValid = inputValueValid;

// SCROLL: xPixelのバリデーション
const scrollXPixelValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .integer()
        .check(value)
    },
    errorMessage || `[${prependKey}xpixel] is integer and required.`
  );
}
module.exports.scrollXPixelValid = scrollXPixelValid;

// SCROLL: yPixelのバリデーション
const scrollYPixelValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .integer()
        .check(value)
    },
    errorMessage || `[${prependKey}xpixel] is integer and required.`
  );
}
module.exports.scrollYPixelValid = scrollYPixelValid;

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
        value: action.selector,
        prependKey: prependKey
      });
      break;
    case "FOCUS":
      focusSelectorValid({
        value: action.selector,
        prependKey: prependKey
      });
      break;
    case "INPUT":
      inputSelectorValid({
        value: action.selector,
        prependKey: prependKey
      });
      inputValueValid({
        value: action.value,
        prependKey: prependKey
      });
      break;
    case "SCROLL":
      scrollXPixelValid({
        value: _.get(action, "distance.xPixel"),
        prependKey: prependKey
      });
      scrollYPixelValid({
        value: _.get(action, "distance.yPixel"),
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