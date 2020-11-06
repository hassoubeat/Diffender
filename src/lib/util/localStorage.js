// ローカルストレージから要素の取得
export const getLSItem = (key, notfoundReturnParam) => {
  const value = localStorage.getItem(key);
  return (value === null) ? notfoundReturnParam : toBoolean(value);
}

// ローカルストレージに要素の設定
export const setLSItem = (key, value) => {
  localStorage.setItem(key, value);
}

// ローカルストレージで審議値は文字列で保持されるため変換用関数
export const toBoolean = (value) => {
  return (value === 'true');
}