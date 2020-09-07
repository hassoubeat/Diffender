// 画面に関する汎用

// 画面サイズをSPサイズか判定する
export function isSpWindowSize(width){
  return (width <= process.env.REACT_APP_SP_MAX_WIDTH);
}

// 画面サイズをPCサイズか判定する
export function isPcWindowSize(width){
  return (width >= process.env.REACT_APP_PC_MIN_WIDTH);
}