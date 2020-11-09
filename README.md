# (Diffender)[https://diffender.hassoubeat.com/about]

Diffender(ディフェンダー)はWebサイトの変更点を視覚的に検出するE2Eテストサービスです。

## Architecture(アーキテクチャ)
**React + Redux + AWSのサーバレスSPA構成**

![architecture](https://user-images.githubusercontent.com/42881127/98458607-e180d700-21d5-11eb-8e83-dc4e002465c3.png)

## DeployProcess(デプロイ手順)

### 事前準備
・Node.jsのインストール  
・AWS SAM CLIの導入・及び設定  

### AWS SAMのビルド
AWS SAM(※1)のtemplate.yaml(※2)の内容に基づいてビルドする。  
※1 Infrastructure as Codeを提供するAWS CloudFormationをサーバレス用途に拡張されたサービス  
※2 本サービスの実行に必要なAWSリソースの情報が定義されている。

`sam build`

### AWS SAMのデプロイ
ビルドしたAWSリソースをAWSにデプロイする。

`sam deploy --guided`

デプロイ時は以下の質問に回答して、デプロイ設定を行う。

**本デプロイをCloudFormation上で管理するスタック名**  
Stack Name :  
**リソースをデプロイするAWSリージョン**  
AWS Region :  
**デプロイ時の環境(local, stg, prodのいずれかを選択)**  
Parameter Env :  
**デプロイ時の必要なIAMロールを生成してよいか？**  
Allow SAM CLI IAM role creation :  
**ここまで回答した内容をsamconfig.tomlに保存するか否か(※)**  
**※ 以降は`sam deploy`でここまでの質問に回答せずデプロイが実施できる**  
Save arguments to samconfig.toml :  

デプロイ後表示される情報は次の手順で必要になるため控える。

### 環境変数の設定
上記手順で控えた情報を以下のファイルに展開する。

.env.development ... 開発時に適用される環境変数ファイル  
.env.production ... 本番ビルドに適用される環境変数ファイル  

### npm依存パッケージのインストール
フロントエンド側の依存パッケージをインストールする。

`npm install`

### 開発環境の起動
設定内容が正しく動作するか開発モードで確認する。

```
npm run start

Compiled successfully!

You can now view diffender in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.0.xxx:3000
```

開発モード起動後、localhost:3000にアクセスして問題なく動作することを確認する。

### 本番環境用のビルド
本番用のファイルをビルドして生成する。

`npm run build`

/buildディレクトリに結果が出力される。  
後は好みの環境にデプロイを行う。


ここまでデプロイして利用するまでの最小限の設定は以上。  
本格運用の際は後述する「推奨設定について」も要確認。

## 推奨設定について
デフォルトの設定は即利用できる最小限のシステム構成となっている。  
本番運用の際は、以下の推奨設定も追加で実施することを推奨する。  

### API Gatewayのドメインを独自ドメインに変更
上記手順でデプロイした時点では時点ではユーザリーダブルなドメインではないため、独自ドメインの適用を推奨する。  
https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/how-to-custom-domains.html

### AWS Cognitoの通知メールサービスをAWS SESに変更
本サービスではユーザ管理にAWS Cognitoを利用している。  
Cognitoはデフォルトでは**1日に最大50件のメールしか送信**できない。  
上限を超えるとメールを送信できなくなる(※)  
※ サインアップ通知などのメールが送信されない  

そのため不特定多数にアクセスされる場合は上限が更に大きいメール送信用のAWS SES設定を作成することを推奨する。  
https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/user-pool-email.html