"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/lib/dataService";
import { Profile as ProfileType } from "@/types/portfolio";
import Image from "next/image";
// import { TypewriterText } from "./TypewriterText";
// import { ScrollAnimation } from "./ScrollAnimation";
// import { OptimizedImage } from "./OptimizedImage";
// import { HoverScale, RippleEffect } from "./MicroInteractions";

interface ProfileProps {
  showDetailedInfo?: boolean;
}

const Profile = ({ showDetailedInfo = false }: ProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  // プロフィール更新イベントをリッスン
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('Profile update event received, refreshing data...');
      fetchProfileData(true); // 強制リフレッシュ
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const fetchProfileData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const profile = await getProfile(forceRefresh);
      setProfileData(profile);
      setIsOffline(false);
      console.log('Profile data loaded:', profile);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      // エラーが発生した場合はmockDataを直接使用
      const { mockProfile } = await import('@/lib/mockData');
      setProfileData(mockProfile);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      github: "🐙",
      linkedin: "💼",
      x: "🔗",
      instagram: "📷",
      facebook: "📘",
      note: "📝",
      qiita: "📚",
      zenn: "⚡",
      youtube: "📺",
      email: "📧",
    };
    return icons[platform.toLowerCase()] || "🔗";
  };

  if (loading) {
    return (
      <div className="neo-profile neo-profile--loading">
        <div className="neo-profile__skeleton">
          <div className="neo-profile__skeleton-avatar"></div>
          <div className="neo-profile__skeleton-content">
            <div className="neo-profile__skeleton-line neo-profile__skeleton-line--title"></div>
            <div className="neo-profile__skeleton-line neo-profile__skeleton-line--subtitle"></div>
            <div className="neo-profile__skeleton-line neo-profile__skeleton-line--text"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData || (!profileData.name && !profileData.title && !profileData.bio)) {
    return (
      <div className="neo-profile neo-profile--empty">
        <div className="neo-card neo-card--empty">
          <h3>プロフィール情報がありません</h3>
          <p>管理画面からプロフィール情報を追加してください。{isOffline && ' (オフラインモード)'}</p>
        </div>
      </div>
    );
  }

  return (
    <section id="profile" className="neo-profile">
      <div className="neo-profile__container">
        {/* Basic Profile Display */}
        <div className="neo-profile__main">
          {/* Profile Avatar */}
          <div className="neo-profile__avatar-wrapper">
            <div className="neo-profile__avatar">
              {profileData?.avatar ? (
                <Image
                  src={profileData.avatar}
                  alt={profileData.name || 'Profile'}
                  width={120}
                  height={120}
                  priority
                  className="neo-profile__avatar-image"
                />
              ) : (
                <div className="neo-profile__avatar-placeholder">
                  <span className="neo-profile__avatar-initial">
                    {profileData?.name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div className="neo-profile__avatar-border"></div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="neo-profile__content">
            <div className="neo-profile__header">
              <h1 className="neo-profile__name">
                {profileData?.name || 'Unknown'}
              </h1>

              <div className="neo-profile__title">
                <span className="neo-profile__title-text">
                  {profileData?.title || ''}
                </span>
              </div>
            </div>

            <div className="neo-profile__bio">
              <p style={{ whiteSpace: 'pre-line' }}>{profileData?.bio || ''}</p>
            </div>

            <div className="neo-profile__info">
              {profileData?.location && (
                <div className="neo-profile__info-item">
                  <span className="neo-profile__info-icon">📍</span>
                  <span className="neo-profile__info-text">{profileData.location}</span>
                </div>
              )}
              {profileData?.email && (
                <div className="neo-profile__info-item">
                  <span className="neo-profile__info-icon">📧</span>
                  <span className="neo-profile__info-text">{profileData.email}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {profileData?.socialLinks && Object.keys(profileData.socialLinks).length > 0 && (
              <div className="neo-profile__social">
                <h3 className="neo-profile__social-title">Connect with me</h3>
                <div className="neo-profile__social-links">
                  {Object.entries(profileData.socialLinks)
                    .filter(([_, url]) => url)
                    .map(([platform, url], index) => (
                      <div
                        key={index}
                        className="neo-profile__social-link"
                        title={platform}
                        onClick={() => window.open(url, '_blank')}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="neo-profile__social-icon">
                          {getSocialIcon(platform)}
                        </span>
                        <span className="neo-profile__social-platform">
                          {platform}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
