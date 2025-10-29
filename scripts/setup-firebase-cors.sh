#!/bin/bash

# Firebase Storage CORS設定スクリプト
echo "Firebase Storage CORS設定を適用しています..."

# Google Cloud SDKがインストールされているかチェック
if ! command -v gsutil &> /dev/null; then
    echo "❌ Google Cloud SDK (gsutil) がインストールされていません。"
    echo "以下のURLからインストールしてください："
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Firebase プロジェクトIDを取得
if [ -f ".firebaserc" ]; then
    PROJECT_ID=$(cat .firebaserc | grep -o '"default": "[^"]*"' | cut -d'"' -f4)
    echo "プロジェクトID: $PROJECT_ID"
else
    echo "❌ .firebaserc ファイルが見つかりません。"
    echo "Firebase プロジェクトを初期化してください: firebase init"
    exit 1
fi

# CORS設定を適用
echo "CORS設定を適用中..."
gsutil cors set cors.json gs://${PROJECT_ID}.appspot.com

if [ $? -eq 0 ]; then
    echo "✅ CORS設定が正常に適用されました！"
    echo "現在の設定を確認:"
    gsutil cors get gs://${PROJECT_ID}.appspot.com
else
    echo "❌ CORS設定の適用に失敗しました。"
    echo "Google Cloud SDKにログインしているか確認してください:"
    echo "gcloud auth login"
    exit 1
fi