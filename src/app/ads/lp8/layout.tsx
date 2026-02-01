import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - プレミアム日本茶定期便 | 初回65%OFF',
    description: '茶師厳選の高級日本茶を毎月お届け。初回限定65%OFF、送料無料、いつでも解約OK。',
    openGraph: {
        title: '特別オファー - プレミアム日本茶定期便',
        description: '茶師厳選の高級日本茶を毎月お届け',
        type: 'website',
    },
};

export default function LP8Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp8" strategy="afterInteractive">
                {`
  var trackingId = "f7a4e5a7bde0";
  var baseUrl = "https://ads-tracker-api.onrender.com";
  var advertiserId = "adv_4a8699f9-eb1d-4d74-827";
  var adGroupId = "grp_ec1c281c-60e5-433f-8cc";
  var adId = "ad_d6139993-d24e-42f9-a0e9";
  var tagType = "ad";
  var uqid = "f7a4e5a7bde0";
  
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
