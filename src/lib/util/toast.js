import izitoast from "izitoast";

export function infoToast(toastObj) {
  toastObj = commonSetting(toastObj);
  izitoast.info(toastObj);
}

export function successToast(toastObj) {
  toastObj = commonSetting(toastObj);
  izitoast.success(toastObj);
}

export function warningToast(toastObj) {
  toastObj = commonSetting(toastObj);
  izitoast.warning(toastObj);
}

export function errorToast(toastObj) {
  toastObj = commonSetting(toastObj);
  izitoast.error(toastObj);
}

export function toast(toastObj) {
  toastObj = commonSetting(toastObj);
  izitoast.show(toastObj);
}

// 共通のトースト設定
function commonSetting(toastObj) {
  toastObj.position = toastObj.position || 'topRight';
  toastObj.timeout = toastObj.timeout || 5000;
  return toastObj;
}