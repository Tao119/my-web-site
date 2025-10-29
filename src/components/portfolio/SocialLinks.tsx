"use client";

import { useState, useEffect } from "react";
import { getFirebaseApp } from "@/lib/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

interface SocialLink {
  platform: string;
  url: string;
  username: string;
  icon: string;
}

interface SocialData {
  links: SocialLink[];
}

const SocialLinks = () => {
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialData();
  }, []);

  const fetchSocialData = async () => {
    try {
      const app = getFirebaseApp();
      const db = getFirestore(app);
      const docRef = doc(db, "portfolio", "social");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSocialData(docSnap.data() as SocialData);
      } else {
        // Use default social data if Firebase data is not available
        setSocialData({
          links: [
            {
              platform: "X",
              url: "https://x.com/tao_matsumr",
              username: "@tao_matsumr",
              icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg"
            },
            {
              platform: "Instagram",
              url: "https://instagram.com/tao_matsumr",
              username: "@tao_matsumr",
              icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg"
            },
            {
              platform: "Facebook",
              url: "https://facebook.com/profile.php?id=100027431360651",
              username: "Tao Matsumura",
              icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg"
            },
            {
              platform: "LinkedIn",
              url: "https://www.linkedin.com/in/%E5%A4%A7%E5%A4%AE-%E6%9D%BE%E6%9D%91-474a15277/",
              username: "大央 松村",
              icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg"
            }
          ]
        });
      }
    } catch (error) {
      // エラーログを無効化
      // Use default social data on error
      setSocialData({
        links: [
          {
            platform: "X (Twitter)",
            url: "https://x.com/tao_matsumr",
            username: "@tao_matsumr",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg"
          },
          {
            platform: "Instagram",
            url: "https://instagram.com/tao_matsumr",
            username: "@tao_matsumr",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg"
          },
          {
            platform: "Facebook",
            url: "https://facebook.com/profile.php?id=100027431360651",
            username: "Tao Matsumura",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg"
          },
          {
            platform: "LinkedIn",
            url: "https://www.linkedin.com/in/%E5%A4%A7%E5%A4%AE-%E6%9D%BE%E6%9D%91-474a15277/",
            username: "大央 松村",
            icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="c-social c-social--loading">Loading...</div>;
  }

  if (!socialData || !socialData.links.length) {
    return <div className="c-social c-social--empty">SNSリンクがありません</div>;
  }

  return (
    <div className="c-social">
      <h2 className="c-social__title">SNSアカウント</h2>
      <div className="c-social__links">
        {socialData.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="c-social__link"
          >
            <div className="c-social__icon">
              {link.icon && (
                <img src={link.icon} alt={link.platform} className="c-social__icon-image" />
              )}
            </div>
            <div className="c-social__info">
              <p className="c-social__platform">{link.platform}</p>
              <p className="c-social__username">{link.username}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
