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
import { getBlogPosts } from "@/lib/dataService";
import { useState, useEffect } from "react";

const PortfolioPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await getBlogPosts(true);
        setBlogPosts(posts);
      } catch {
        // Firestore未接続時は空配列のまま
      }
    };
    loadPosts();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              記事
            </h2>
            <BlogList posts={blogPosts} showCount={6} />
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
