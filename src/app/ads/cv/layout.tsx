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
          var trackingId = "e71e17fa6495";
          var baseUrl = "http://localhost:8080";
          var advertiserId = "";
          var adGroupId = "grp_77703814-79ea-40ac-b65";
          var adId = "";
          var tagType = "group";
          var uqid = "e71e17fa6495";
          
          var cid = adGroupId;
          var gid = adGroupId;
          var sid = "";
          var uid1 = "";
          var uid2 = "";
          var uid3 = "";
          var uid4 = "";
          var uid5 = "";
          var uid6 = "";
          var uid7 = "";
          var uid8 = "";
          var catsPoint = "purchase_complete";
          var amount = "";
          var trackingUserId = "";
          var firstCookie = document.cookie;
          var catsOptions = {
            fpc_id: "",
            fb: { eventId: "" },
            tt: { event_id: "" },
            line: { deduplicationKey: "" },
            L_ad: { liff_id: "" }
          };
          
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
            
            a.onload = function() {
              setTimeout(function() {
                if (typeof CATS_Action === 'function') {
                  CATS_Action(cid, sid, uid1, uid2, uqid, uid3, uid4, uid5, uid6, uid7, uid8, catsPoint, amount, trackingUserId, firstCookie, catsOptions);
                } else if (typeof CATS_GroupAction === 'function') {
                  CATS_GroupAction(gid, sid, uid1, uid2, uqid, uid3, uid4, uid5, uid6, uid7, uid8, catsPoint, amount, trackingUserId, firstCookie, catsOptions);
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
