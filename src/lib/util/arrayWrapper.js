// indexの要素をatの位置に移動する
export function moveAt(array, index, at) {
  if (index === at || index > array.length -1 || at > array.length - 1) {
    return array;
  }

  const value = array[index];
  const tail = array.slice(index + 1);

  array.splice(index);
  Array.prototype.push.apply(array, tail);

  array.splice(at, 0, value);

  return array;
}