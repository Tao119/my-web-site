import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - オンライン英会話 | 初月50%OFF',
    description: 'ネイティブ講師とマンツーマンレッスン。初月限定50%OFF、無料体験レッスン付き。',
    openGraph: {
        title: '特別オファー - オンライン英会話',
        description: 'ネイティブ講師とマンツーマンレッスン',
        type: 'website',
    },
};

export default function LP2Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp2" strategy="afterInteractive">
                {`
           // 互換設定
  var trackingId = "47d3fb033ed8";
  var baseUrl = "https://ads-tracker-api.onrender.com";
  var advertiserId = "";
  var adGroupId = "grp_ff66893e-b51d-41bd-98d";
  var adId = "";
  var tagType = "group";
  var uqid = "47d3fb033ed8";
  
  // 互換パラメータ
  var cid = adId || ""; // 個別広告IDがある場合のみ設定
  var gid = adGroupId; // 広告グループID
  var can_organic_search = "off";
  var can_chatbot = "off";
  var options = {
    fpc_id: "",
    api_parameter_inheritance: "on"
  };

  // 動的スクリプト読み込み
  (function() {
    var a = document.createElement('script');
    a.type = 'text/javascript';
    a.async = true;
    a.defer = true;
    a.charset = 'UTF-8';
    a.id = 'ck_' + uqid;
    a.src = baseUrl + '/ck/' + uqid + '/cookie.js';
    
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(a, s);
    
    // cookie.js読み込み完了後に計測実行
    a.onload = function() {
      setTimeout(function() {
        // グループタグの場合はGroupCreateを使用
        if (tagType === 'group' && typeof AdsTracker_GroupCreate === 'function') {
          AdsTracker_GroupCreate(gid, uqid, cid, can_organic_search, can_chatbot, options);
        } else if (tagType === 'ad' && typeof AdsTracker_Create === 'function') {
          // 個別広告タグの場合はCreateを使用
          AdsTracker_Create(cid, uqid, can_organic_search, can_chatbot, options);
        } else {
          console.error('[Ads Tracker] Function not found or invalid tag type');
        }
      }, 100);
    };
  })();
        `}
            </Script>

            {children}
        </>
    );
}
