// 指定したリストからソートマップを作成する
export function generateSortMap(list, key) {
  let sortMap = {};
  list.forEach( (object, index) => {
    sortMap[object[key]] = index;
  });
  return sortMap;
}


// ソートマップを利用してソートを実施する
export function sort(list, sortMap, key) {
  const sortedList = [];
  const noSortedList = [];

  list.forEach( object => {
    const mapKey = object[key];
    const index = sortMap[mapKey]
    if (index !== undefined) {
      const index = sortMap[mapKey];
      sortedList[index] = object;
    } else {
      noSortedList.push(object);
    }
  });

  return {
    sortedList: sortedList.filter(Boolean),
    noSortedList: noSortedList
  }
}

