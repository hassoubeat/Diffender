const fs = require('fs');
const AWS = require('aws-sdk');
const config = {
  region: "ap-northeast-1",
  endpoint: "http://localhost:4566"  
}

const dynamoDB = new AWS.DynamoDB(config);
const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient(config);
const tableName = "local-diffender";

const dao = require("./index");

describe('DynamoDBのDao 正常系のテスト群', () => {

  beforeAll( async () => {
    console.log("beforeAll");

    // テーブル作成
    await createTestTable();
    // 初期データ登録
    await initDataInput();
  });

  // beforeEach( async () => {
  // });

  test('データ取得(get)のテスト', async () => {
    const response = await dao.get(
      dynamoDbDocumentClient,
      {
        TableName: tableName,
        Key: {
          'id': 'project-1'
        }
      }
    );
    expect(response).toEqual({
      Item: { 
          id: "project-1",
          projectTieUserId: "1d300296-7e68-4b33-ae21-921d2d05975f",
          createDtUnix: 1599544395895 
      }
    });
  });

  test('データ検索(query)のテスト ソート順昇順', async () => {
    const response = await dao.query(
      dynamoDbDocumentClient,
      {
        TableName: tableName,
        IndexName: "ProjectsByUserIdSearchIndex",
        KeyConditionExpression: "projectTieUserId=:projectTieUserId",
        ExpressionAttributeValues: {
          ":projectTieUserId": "1d300296-7e68-4b33-ae21-921d2d05975f"
        }
      }
    );
    expect(response).toEqual(
      {
        Items: [ 
          { 
            id: "project-1",
            projectTieUserId: "1d300296-7e68-4b33-ae21-921d2d05975f",
            createDtUnix: 1599544395895 
          },
          { 
            id: "project-2",
            projectTieUserId: "1d300296-7e68-4b33-ae21-921d2d05975f",
            createDtUnix: 1599544395896
          }
        ],
        Count: 2,
        ScannedCount: 2
      }
    );
  });

  test('データ検索(query)のテスト ソート順降順', async () => {
    const response = await dao.query(
      dynamoDbDocumentClient,
      {
        TableName: tableName,
        IndexName: "ProjectsByUserIdSearchIndex",
        KeyConditionExpression: "projectTieUserId=:projectTieUserId",
        ExpressionAttributeValues: {
          ":projectTieUserId": "1d300296-7e68-4b33-ae21-921d2d05975f"
        },
        ScanIndexForward: false
      }
    );
    expect(response).toEqual(
      {
        Items: [ 
          { 
            id: "project-2",
            projectTieUserId: "1d300296-7e68-4b33-ae21-921d2d05975f",
            createDtUnix: 1599544395896
          },
          { 
            id: "project-1",
            projectTieUserId: "1d300296-7e68-4b33-ae21-921d2d05975f",
            createDtUnix: 1599544395895 
          }
        ],
        Count: 2,
        ScannedCount: 2
      }
    );
  });

  test('プロジェクトIDのアトミックカウンター取得テスト', async () => {
    const response = await dao.getProjectId(dynamoDbDocumentClient, tableName);
    expect(response).toBe(1);
  });

  // afterEach( async () => {
  // });

  afterAll( async () => {
    console.log("afterAll");
    // 利用し終わったテーブルを削除
    await deleteTestTable();
  });

});

// テーブル作成
async function createTestTable() {
  var tableParams = {
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S'},
      { AttributeName: 'projectTieUserId', AttributeType: 'S' },
      { AttributeName: 'createDtUnix', AttributeType: 'N' },
    ],
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    GlobalSecondaryIndexes: [
      // ユーザIDでプロジェクト一覧を検索するためのGSI
      {
        IndexName: "ProjectsByUserIdSearchIndex",
        KeySchema: [
          { AttributeName: 'projectTieUserId', KeyType: 'HASH' },
          { AttributeName: 'createDtUnix', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 2, WriteCapacityUnits: 2 }
      }
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 2, WriteCapacityUnits: 2 }
  };
  resp = await dynamoDB.createTable(tableParams).promise();
}

// 初期データ投入
async function initDataInput() {
  const initInputDataObj = JSON.parse(fs.readFileSync(`${__dirname}/InitInputData.json`, 'utf8'));

  for (const obj of initInputDataObj.InitInputData) {
    const inputData = {
      TableName: tableName,
      Item: obj
    }
    await dynamoDbDocumentClient.put(inputData).promise();
  }
}

// テーブル削除
async function deleteTestTable() {
  const tableParams = { TableName: tableName }
  await dynamoDB.deleteTable(tableParams).promise();
}

// レコード取得
async function getRecord(id) {
  const getParams = { 
    TableName: tableName,
    Key: { Id : id }
  }
  return await dynamoDbDocumentClient.get(getParams).promise();
}

// レコード削除
async function deleteRecord(id) {
  const deleteParams = { 
    TableName: tableName,
    Key:{ Id: id }
  }
  await dynamoDbDocumentClient.delete(deleteParams).promise();
}