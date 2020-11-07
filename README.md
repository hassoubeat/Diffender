# Diffender

Diffender(ディフェンダー)はWebサイトの変更点を視覚的に検出するE2Eテストサービスです。

## Architecture(アーキテクチャ)
**React + Redux + AWSのサーバレスSPA構成**

**TODO**
アーキテクチャの一枚絵を載せる

## DeployProcess(デプロイ手順)

### 事前準備
・Node.jsのインストール
・AWS SAM CLIの導入・及び設定

### AWS SAMのビルド
AWS SAM(※)のtemplate.yamlの内容に基づいてビルドする。
※ Infrastructure as CodeのAWS CloudFormationをサーバレス用途にカスタマイズしたサービス

`sam build`

### AWS SAMのデプロイ
ビルドしたAWS SAMの内容をAWSにデプロイする。

`sam deploy --guided`

**TODO**
質問に対する返答を記載

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

### AWS Cognitoの通知メールサービスをAWS SESに変更
本サービスではユーザ管理にAWS Cognitoを利用している。  
Cognitoはデフォルトでは**1日に最大50件のメールしか送信**できない。  
上限を超えるとメールを送信できなくなる(※)  
※ サインアップ通知などのメールが送信されない  

そのため不特定多数にアクセスされる場合は上限が更に大きいメール送信用のAWS SES設定を作成することを推奨する。  
https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/user-pool-email.html