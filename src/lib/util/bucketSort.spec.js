import * as bucketSort from './bucketSort';

describe('ソートテスト 正常系のテスト群', () => {
  test('ソートテスト', async () => {

    const sortMap = {
      "Project-1": 4,
      "Project-2": 1,
      "Project-3": 0,
      "Project-4": 2,
    };

    const list = [
      { id: "Project-1", name: "プロジェクト1" },
      { id: "Project-2", name: "プロジェクト2" },
      { id: "Project-3", name: "プロジェクト3" },
      { id: "Project-4", name: "プロジェクト4" },
      { id: "Project-5", name: "プロジェクト5" }
    ];

    const sortedObj = bucketSort.sort(list, sortMap, "id");
    const sortedList = sortedObj.noSortedList.concat(sortedObj.sortedList);
    expect(sortedList).toEqual([
      { id: "Project-5", name: "プロジェクト5" },
      { id: "Project-3", name: "プロジェクト3" },
      { id: "Project-2", name: "プロジェクト2" },
      { id: "Project-4", name: "プロジェクト4" },
      { id: "Project-1", name: "プロジェクト1" }
    ]);
    
  });

  test('ソートマップ生成', async () => {
    const list = [
      { id: "Project-5", name: "プロジェクト5" },
      { id: "Project-3", name: "プロジェクト3" },
      { id: "Project-2", name: "プロジェクト2" },
      { id: "Project-4", name: "プロジェクト4" },
      { id: "Project-1", name: "プロジェクト1" }
    ];

    const sortMap = bucketSort.generateSortMap(list, "id");
    expect(sortMap).toEqual(
      {"Project-1": 4, "Project-2": 2, "Project-3": 1, "Project-4": 3, "Project-5": 0}
    );
    
  });
});