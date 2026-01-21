import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '特別オファー - プレミアムコーヒー定期便 | 初回40%OFF',
  description: '厳選された世界のコーヒー豆を毎月お届け。初回限定40%OFF、送料無料、30日間返金保証。',
  openGraph: {
    title: '特別オファー - プレミアムコーヒー定期便',
    description: '厳選された世界のコーヒー豆を毎月お届け',
    type: 'website',
  },
};

export default function LPLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script id="cats-tracking-lp" strategy="afterInteractive">
        {`
  // 互換設定
  var trackingId = "5ddea53206cc";
  var baseUrl = "https://ads-tracker-api.onrender.com/";
  var advertiserId = "";
  var adGroupId = "grp_ff66893e-b51d-41bd-98d";
  var adId = "";
  var tagType = "group";
  var uqid = "5ddea53206cc";
  
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

      {/* Google Analytics - LPページ用 */}
      {/* <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        strategy="afterInteractive"
      />
      <Script id="google-analytics-lp" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID', {
            page_path: '/ads/lp'
          });
        `}
      </Script> */}

      {/* Facebook Pixel - LPページビュー */}
      {/* <Script id="facebook-pixel-lp" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'YOUR_PIXEL_ID');
          fbq('track', 'PageView');
          fbq('track', 'ViewContent', {
            content_name: 'Coffee Subscription LP',
            content_category: 'Landing Page'
          });
        `}
      </Script> */}

      {/* Twitter Pixel - LPページ */}
      {/* <Script id="twitter-pixel-lp" strategy="afterInteractive">
        {`
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','YOUR_TWITTER_PIXEL_ID');
          twq('track','PageView');
        `}
      </Script> */}

      {children}
    </>
  );
}
