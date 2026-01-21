import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'お申し込みありがとうございます | プレミアムコーヒー定期便',
  description: 'ご登録が完了しました。確認メールをご確認ください。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CVLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script id="cats-conversion-cv" strategy="afterInteractive">
        {`
  // 設定
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
  var sid = "";
  var uid1 = "";
  var uid2 = "";
  var uid3 = "";
  var uid4 = "";
  var uid5 = "";
  var uid6 = "";
  var uid7 = "";
  var uid8 = "";
  var eventPoint = "purchase_complete";
  var amount = ""; // 金額は外部サービスから取得する必要がある
  var trackingUserId = "";
  var firstCookie = document.cookie;
  
  var options = {
    fpc_id: "",
    fb: { eventId: "" },
    tt: { event_id: "" },
    line: { deduplicationKey: "" },
    L_ad: { liff_id: "" }
  };

  // 動的スクリプト読み込み
  (function() {
    var a = document.createElement('script');
    a.type = 'text/javascript';
    a.async = true;
    a.defer = true;
    a.charset = 'UTF-8';
    a.id = 'ac_' + uqid;
    a.src = baseUrl + '/ck/' + uqid + '/action.js';
    
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(a, s);
    
    // action.js読み込み完了後にコンバージョン実行
    a.onload = function() {
      // 少し遅延させて確実に実行
      setTimeout(function() {
        // グループタグの場合はGroupActionを使用
        if (tagType === 'group' && typeof AdsTracker_GroupAction === 'function') {
          AdsTracker_GroupAction(gid, sid, uid1, uid2, uqid, uid3, uid4, uid5, uid6, uid7, uid8, eventPoint, amount, trackingUserId, firstCookie, options);
        } else if (tagType === 'ad' && typeof AdsTracker_Action === 'function') {
          // 個別広告タグの場合はActionを使用
          AdsTracker_Action(cid, sid, uid1, uid2, uqid, uid3, uid4, uid5, uid6, uid7, uid8, eventPoint, amount, trackingUserId, firstCookie, options);
        } else {
          console.error('[Ads Tracker] Function not found or invalid tag type');
        }
      }, 500);
    };
  })();
        `}
      </Script>

      {children}
    </>
  );
}
