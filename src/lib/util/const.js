// プロジェクト名
export const PROJECT_NAME = process.env.REACT_APP_PROJECT_NAME;

//プロジェクトの説明
export const PROJECT_DESCRIPTION = process.env.REACT_APP_PROJECT_DESCRIPTION;

// 本アプリのSPサイズとみなすブレイクポイント
export const SP_MAX_WIDTH = process.env.REACT_APP_SP_MAX_WIDTH;
// 本アプリのPCサイズとみなすブレイクポイント
export const PC_MIN_WIDTH = process.env.REACT_APP_PC_MIN_WIDTH;

// アクションタイプ
export const ACTION_TYPE_GOTO = process.env.REACT_APP_ACTION_TYPE_GOTO;
export const ACTION_TYPE_WAIT = process.env.REACT_APP_ACTION_TYPE_WAIT;
export const ACTION_TYPE_CLICK = process.env.REACT_APP_ACTION_TYPE_CLICK;
export const ACTION_TYPE_FOCUS = process.env.REACT_APP_ACTION_TYPE_FOCUS;
export const ACTION_TYPE_INPUT = process.env.REACT_APP_ACTION_TYPE_INPUT;
export const ACTION_TYPE_SCROLL = process.env.REACT_APP_ACTION_TYPE_SCROLL;

// リザルトに紐づくリザルトタイプ
export const RESULT_TYPE_SS = process.env.REACT_APP_RESULT_TYPE_SS;
export const RESULT_TYPE_DIFF = process.env.REACT_APP_RESULT_TYPE_DIFF;

// リザルトアイテムの実行状態
export const RESULT_ITEM_STATUS_TYPE_SUCCESS = process.env.REACT_APP_RESULT_ITEM_STATUS_TYPE_SUCCESS;
export const RESULT_ITEM_STATUS_TYPE_ERROR = process.env.REACT_APP_RESULT_ITEM_STATUS_TYPE_ERROR;
export const RESULT_ITEM_STATUS_TYPE_WAIT = process.env.REACT_APP_RESULT_ITEM_STATUS_TYPE_WAIT;

// 環境
export const ENV = process.env.REACT_APP_ENV;

// AWSリージョン
export const AWS_REGION = process.env.REACT_APP_AWS_REGION;

// AWS Cognitoの情報
export const AWS_COGNITO_USER_POOL_ID = process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID;
export const AWS_COGNITO_CLIENT_ID = process.env.REACT_APP_AWS_COGNITO_CLIENT_ID;

// AWS APIGatewayに関する設定情報
export const AWS_APP_API_NAME = process.env.REACT_APP_AWS_APP_API_NAME;
export const AWS_APP_API_ENDPOINT = process.env.REACT_APP_AWS_APP_API_ENDPOINT;
export const AWS_APP_API_STAGE = process.env.REACT_APP_AWS_APP_API_STAGE;


// ACTIONのデバイスタイプ
export const ACTION_DEVICE_TYPES = [
  'Blackberry PlayBook',
  'Blackberry PlayBook landscape',
  'BlackBerry Z30',
  'BlackBerry Z30 landscape',
  'Galaxy Note 3',
  'Galaxy Note 3 landscape',
  'Galaxy Note II',
  'Galaxy Note II landscape',
  'Galaxy S III',
  'Galaxy S III landscape',
  'Galaxy S5',
  'Galaxy S5 landscape',
  'iPad',
  'iPad landscape',
  'iPad Mini',
  'iPad Mini landscape',
  'iPad Pro',
  'iPad Pro landscape',
  'iPhone 4',
  'iPhone 4 landscape',
  'iPhone 5',
  'iPhone 5 landscape',
  'iPhone 6',
  'iPhone 6 landscape',
  'iPhone 6 Plus',
  'iPhone 6 Plus landscape',
  'iPhone 7',
  'iPhone 7 landscape',
  'iPhone 7 Plus',
  'iPhone 7 Plus landscape',
  'iPhone 8',
  'iPhone 8 landscape',
  'iPhone 8 Plus',
  'iPhone 8 Plus landscape',
  'iPhone SE',
  'iPhone SE landscape',
  'iPhone X',
  'iPhone X landscape',
  'iPhone XR',
  'iPhone XR landscape',
  'JioPhone 2',
  'JioPhone 2 landscape',
  'Kindle Fire HDX',
  'Kindle Fire HDX landscape',
  'LG Optimus L70',
  'LG Optimus L70 landscape',
  'Microsoft Lumia 550',
  'Microsoft Lumia 950',
  'Microsoft Lumia 950 landscape',
  'Nexus 10',
  'Nexus 10 landscape',
  'Nexus 4',
  'Nexus 4 landscape',
  'Nexus 5',
  'Nexus 5 landscape',
  'Nexus 5X',
  'Nexus 5X landscape',
  'Nexus 6',
  'Nexus 6 landscape',
  'Nexus 6P',
  'Nexus 6P landscape',
  'Nexus 7',
  'Nexus 7 landscape',
  'Nokia Lumia 520',
  'Nokia Lumia 520 landscape',
  'Nokia N9',
  'Nokia N9 landscape',
  'Pixel 2',
  'Pixel 2 landscape',
  'Pixel 2 XL',
  'Pixel 2 XL landscape'
]