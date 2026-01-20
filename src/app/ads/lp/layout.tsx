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
  // CATS互換設定
  var trackingId = "dfb2f6c6a158";
  var baseUrl = "https://016fbaa2dfbb.ngrok-free.app";
  var advertiserId = "";
  var adGroupId = "grp_77703814-79ea-40ac-b65";
  var adId = "";
  var tagType = "group";
  var uqid = "dfb2f6c6a158";
  
  // CATS互換パラメータ
  var cid = adGroupId; // CATSではCIDはグループID
  var gid = adGroupId;
  var can_organic_search = "off";
  var can_chatbot = "off";
  var cats_options = {
    fpc_id: "",
    api_parameter_inheritance: "on"
  };

  // CATS風の動的スクリプト読み込み
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
        if (typeof CATS_Create === 'function' && tagType !== 'group') {
          CATS_Create(cid, uqid, can_organic_search, can_chatbot, cats_options);
        } else if (typeof CATS_GroupCreate === 'function') {
          CATS_GroupCreate(gid, uqid, cid, can_organic_search, can_chatbot, cats_options);
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
