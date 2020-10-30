const v8n = require("v8n");
const _ = require("lodash");
const actionValidator = require("action-validator");

// バリデーション処理の実行
const runValid = (validFunc, errorMessage="") => {
  try {
    validFunc();
  } catch (error) {
    console.error(error);
    console.log(error.message);

    error.message = errorMessage;
    error.statusCode = 400;
    throw error
  }
}
module.exports.runValid = runValid;

// ページ名のバリデーション
const pageNameValid = ({value, prependKey="", errorMessage}) => {
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
module.exports.pageNameValid = pageNameValid;

// ページ説明のバリデーション
const pageDescriptionValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .string()
        .length(0, 50)
        .check(value)
    },
    errorMessage || `[${prependKey}description] max 50 characters.`
  );
}
module.exports.pageDescriptionValid = pageDescriptionValid;

// ブラウザオプション(デバイスタイプ)のバリデーション
const deviceTypeOptionValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .not.undefined()
        .string()
        .check(value)
    },
    errorMessage || `[${prependKey}deviceType] required.`
  );
};
module.exports.deviceTypeOptionValid = deviceTypeOptionValid;

// ブラウザオプション(UserAgent)のバリデーション
const userAgentOptionValid = ({value, prependKey="", errorMessage}) => {
  // TODO 現在バリデーション内容なし  
};
module.exports.userAgentOptionValid = userAgentOptionValid;

// ブラウザオプション(画面横幅)のバリデーション
const viewPortWidthValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .not.undefined()
        .integer()
        .between(1, 2000)
        .check(value)
    },
    errorMessage || `[${prependKey}width] 0 ~ 2000 integer and required.`
  );
};
module.exports.viewPortWidthValid = viewPortWidthValid;

// ブラウザオプション(画面縦幅)のバリデーション
const viewPortHeightValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .not.undefined()
        .integer()
        .between(1, 2000)
        .check(value)
    },
    errorMessage || `[${prependKey}height] 0 ~ 2000 integer and required.`
  );
};
module.exports.viewPortHeightValid = viewPortHeightValid;

// フルページオプション設定のバリデーション
const fullPageOptionValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .not.undefined()
        .boolean()
        .check(value)
    },
    errorMessage || `[${prependKey}fullPage] boolean type and required.`
  );
}
module.exports.fullPageOptionValid = fullPageOptionValid;

// 事前共通アクションの実施有無のバリデーション
const isEnableBeforeCommonActionValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .not.undefined()
        .boolean()
        .check(value)
    },
    errorMessage || `[${prependKey}isEnableBeforeCommonAction] boolean type and required.`
  );
}
module.exports.isEnableBeforeCommonActionValid = isEnableBeforeCommonActionValid;

// 事後共通アクションの実施有無のバリデーション
const isEnableAfterCommonActionValid = ({value, prependKey="", errorMessage}) => {
  runValid(
    () => { 
      v8n()
        .not.null()
        .not.empty()
        .not.undefined()
        .boolean()
        .check(value)
    },
    errorMessage || `[${prependKey}isEnableAfterCommonAction] boolean type and required.`
  );
}
module.exports.isEnableAfterCommonActionValid = isEnableAfterCommonActionValid;

// Pageオブジェクト全てをバリデーション
 const pageValid = (page) => {
  pageNameValid({
    value: page.name
  });
  pageDescriptionValid({
    value: page.description
  });
  deviceTypeOptionValid({
    value: _.get(page, "browserSettings.deviceType"),
    prependKey: "browserSettings."
  });
  // デバイスタイプがカスタムの時のみ拡張内容のバリデーションを実施する
  if (_.get(page, "browserSettings.deviceType") === "custom") {
    userAgentOptionValid({
      value: _.get(page, "browserSettings.userAgent"),
      prependKey: "browserSettings."
    });
    viewPortWidthValid({
      value: _.get(page, "browserSettings.viewport.width"),
      prependKey: "browserSettings.viewport."
    });
    viewPortHeightValid({
      value: _.get(page, "browserSettings.viewport.height"),
      prependKey: "browserSettings.viewport."
    });
  }
  fullPageOptionValid({
    value: _.get(page, "screenshotOptions.fullPage"),
    prependKey: "screenshotOptions."
  });
  page.actions.forEach( (action, index) => {
    actionValidator.actionValid({
      action: action,
      prependKey: `actions[${index}].`
    })
  });
  isEnableBeforeCommonActionValid({
    value: page.isEnableBeforeCommonAction
  });
  isEnableAfterCommonActionValid({
    value: page.isEnableAfterCommonAction
  });
}
module.exports.pageValid = pageValid;