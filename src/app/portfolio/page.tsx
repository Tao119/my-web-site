"use client";

import Profile from "@/components/portfolio/Profile";
import DetailedProfile from "@/components/portfolio/DetailedProfile";
import Skills from "@/components/portfolio/Skills";
import Works from "@/components/portfolio/Works";
import SocialLinks from "@/components/portfolio/SocialLinks";
import BlogList from "@/components/portfolio/BlogList";
import HeroSection from "@/components/portfolio/HeroSection";
import ContactSection from "@/components/portfolio/ContactSection";
import { OfflineIndicator } from "@/components/portfolio/OfflineIndicator";
import { SlideIn, FloatingActionButton } from "@/components/portfolio/MicroInteractions";
import { BlogPost } from "@/types/portfolio";
import { useState, useEffect } from "react";

const PortfolioPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // スクロール位置を監視してトップに戻るボタンの表示を制御
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // トップに戻る関数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Sample blog posts data
  const sampleBlogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Next.js 14とApp Routerで作るモダンなポートフォリオサイト",
      slug: "nextjs-14-portfolio-site",
      excerpt: "Next.js 14の新機能App Routerを使用して、パフォーマンスとSEOに優れたポートフォリオサイトを構築する方法を詳しく解説します。",
      content: "",
      thumbnail: "/placeholder-blog.jpg",
      category: "Web Development",
      tags: ["Next.js", "React", "TypeScript", "Portfolio"],
      readTime: 8,
      published: true,
      publishedAt: new Date("2024-01-15"),
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Tailwind CSSとNeobrutalism UIで作る印象的なデザイン",
      slug: "tailwind-neobrutalism-design",
      excerpt: "Neobrutalism UIデザインの特徴である太いボーダー、鮮やかな色彩、大胆なタイポグラフィをTailwind CSSで実装する方法を紹介します。",
      content: "",
      thumbnail: "/placeholder-blog.jpg",
      category: "Design",
      tags: ["Tailwind CSS", "UI Design", "Neobrutalism", "CSS"],
      readTime: 6,
      published: true,
      publishedAt: new Date("2024-01-10"),
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
    },
    {
      id: "3",
      title: "UnityとWebGLで作るブラウザゲーム開発入門",
      slug: "unity-webgl-browser-game",
      excerpt: "Unityを使ってブラウザで動作するWebGLゲームを開発する際のベストプラクティスと最適化テクニックを解説します。",
      content: "",
      thumbnail: "/placeholder-blog.jpg",
      category: "Game Development",
      tags: ["Unity", "WebGL", "Game Development", "JavaScript"],
      readTime: 12,
      published: true,
      publishedAt: new Date("2024-01-05"),
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-05"),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Welcome to My Portfolio"
        subtitle="Full-stack Developer & Unity Engineer"
        catchphrase="Creating innovative digital experiences with modern technology"
        ctaText="View My Work"
        backgroundType="parallax"
      />

      {/* Profile Section */}
      <SlideIn direction="up" delay={0.1}>
        <Profile />
      </SlideIn>

      {/* Detailed Profile Section */}
      <SlideIn direction="up" delay={0.2}>
        <DetailedProfile />
      </SlideIn>

      {/* Skills Section */}
      <SlideIn direction="up" delay={0.3}>
        <Skills />
      </SlideIn>

      {/* Projects Section */}
      <SlideIn direction="up" delay={0.4}>
        <Works />
      </SlideIn>

      {/* Blog Section */}
      <SlideIn direction="up" delay={0.5}>
        <section id="blog" className="neo-section">
          <div className="neo-container">
            <h2 className="neo-heading neo-heading--2" style={{ textAlign: 'center', marginBottom: '40px' }}>
              Blog
            </h2>
            <BlogList posts={[]} showCount={3} showViewAll={true} />
          </div>
        </section>
      </SlideIn>

      {/* Contact Section */}
      <SlideIn direction="up" delay={0.6}>
        <ContactSection />
      </SlideIn>

      {/* Social Links Section */}
      <SlideIn direction="up" delay={0.7}>
        <section id="social" className="neo-section">
          <div className="neo-container">
            <h2 className="neo-heading neo-heading--2" style={{ textAlign: 'center', marginBottom: '40px' }}>
              Social Links
            </h2>
            <SocialLinks />
          </div>
        </section>
      </SlideIn>

      {/* フローティングアクションボタン - トップに戻る */}
      {showScrollTop && (
        <FloatingActionButton
          icon={<span>↑</span>}
          onClick={scrollToTop}
          position="bottom-right"
          tooltip="トップに戻る"
          color="#007bff"
        />
      )}

      {/* オフラインインジケーター */}
      <OfflineIndicator />
    </>
  );
};

export default PortfolioPage;
