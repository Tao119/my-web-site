"use client";

import { useState, useEffect } from "react";

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

  const defaultLinks: SocialLink[] = [
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
  ];

  const fetchSocialData = async () => {
    try {
      const response = await fetch('/api/portfolio/profile');
      if (response.ok) {
        const profile = await response.json();
        if (profile.socialLinks && Object.keys(profile.socialLinks).length > 0) {
          const links: SocialLink[] = Object.entries(profile.socialLinks)
            .filter(([_, url]) => url)
            .map(([platform, url]) => ({
              platform,
              url: url as string,
              username: platform,
              icon: `https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${platform.toLowerCase()}.svg`
            }));
          setSocialData({ links: links.length > 0 ? links : defaultLinks });
        } else {
          setSocialData({ links: defaultLinks });
        }
      } else {
        setSocialData({ links: defaultLinks });
      }
    } catch {
      setSocialData({ links: defaultLinks });
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
