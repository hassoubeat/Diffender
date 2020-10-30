import { SP_MAX_WIDTH, PC_MIN_WIDTH } from 'lib/util/const'

// 画面サイズをSPサイズか判定する
export function isSpWindowSize(width){
  return (width <= SP_MAX_WIDTH);
}

// 画面サイズをPCサイズか判定する
export function isPcWindowSize(width){
  return (width >= PC_MIN_WIDTH);
}