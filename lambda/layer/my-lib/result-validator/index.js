const v8n = require("v8n");

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

// リザルト名のバリデーション
const resultNameValid = ({value, prependKey="", errorMessage}) => {
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
module.exports.resultNameValid = resultNameValid;

// リザルト説明のバリデーション
const resultDescriptionValid = ({value, prependKey="", errorMessage}) => {
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
module.exports.resultDescriptionValid = resultDescriptionValid;

// Resultオブジェクト全てをバリデーション
 const resultValid = (result) => {
  resultNameValid({
    value: result.name
  });
  resultDescriptionValid({
    value: result.description
  });
}
module.exports.resultValid = resultValid;