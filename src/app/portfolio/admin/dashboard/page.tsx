"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { usePortfolioTheme } from "@/hooks/usePortfolioTheme";
// 一時的にプレースホルダーコンポーネントを使用
const ProfileEditor = () => <div className="c-admin-placeholder">プロフィール編集機能（開発中）</div>;
const SkillsManager = () => <div className="c-admin-placeholder">スキル管理機能（開発中）</div>;
const ProjectsManager = () => <div className="c-admin-placeholder">プロジェクト管理機能（開発中）</div>;
const AdminSettings = () => <div className="c-admin-placeholder">設定機能（開発中）</div>;
const BlogManager = () => <div className="c-admin-placeholder">ブログ管理機能（開発中）</div>;
import ResponsiveNavigation from "@/components/portfolio/ResponsiveNavigation";
import AccessibilityTester from "@/components/portfolio/AccessibilityTester";
import ResponsiveTestHelper from "@/components/portfolio/ResponsiveTestHelper";


type ActiveTab = "overview" | "profile" | "skills" | "projects" | "blog" | "settings";

const AdminDashboard = () => {
  const { isDarkMode, toggleDarkMode } = usePortfolioTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [showA11yTester, setShowA11yTester] = useState(false);
  const [showResponsiveTester, setShowResponsiveTester] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // 統計情報を読み込み
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // 管理画面のテーマコンテナクラスを適用
  useEffect(() => {
    document.body.classList.add('admin-container');

    // テーマに応じてクラスを適用
    if (isDarkMode) {
      document.body.classList.add('admin-dark-theme');
      document.body.classList.remove('admin-light-theme');
    } else {
      document.body.classList.add('admin-light-theme');
      document.body.classList.remove('admin-dark-theme');
    }

    return () => {
      document.body.classList.remove('admin-container', 'admin-dark-theme', 'admin-light-theme');
    };
  }, [isDarkMode]);





  const menuItems = [
    { id: "overview", label: "概要", icon: "📊" },
    { id: "profile", label: "プロフィール編集", icon: "👤" },
    { id: "skills", label: "スキル管理", icon: "⚡" },
    { id: "projects", label: "プロジェクト管理", icon: "🎨" },
    { id: "blog", label: "ブログ管理", icon: "📝" },
    { id: "settings", label: "設定", icon: "⚙️" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="c-admin-dashboard__overview">
            <div className="c-admin-dashboard__stats">
              <div className="c-admin-dashboard__stat-card">
                <div className="c-admin-dashboard__stat-icon">👤</div>
                <div className="c-admin-dashboard__stat-content">
                  <h3>プロフィール</h3>
                  <p>基本情報と経歴を管理</p>
                </div>
              </div>
              <div className="c-admin-dashboard__stat-card">
                <div className="c-admin-dashboard__stat-icon">⚡</div>
                <div className="c-admin-dashboard__stat-content">
                  <h3>技術スタック</h3>
                  <p>スキルレベルと経験年数</p>
                </div>
              </div>
              <div className="c-admin-dashboard__stat-card">
                <div className="c-admin-dashboard__stat-icon">🎨</div>
                <div className="c-admin-dashboard__stat-content">
                  <h3>プロジェクト</h3>
                  <p>作品と実績の管理</p>
                </div>
              </div>
              <div className="c-admin-dashboard__stat-card">
                <div className="c-admin-dashboard__stat-icon">📝</div>
                <div className="c-admin-dashboard__stat-content">
                  <h3>ブログ</h3>
                  <p>記事の作成と管理</p>
                </div>
              </div>
            </div>
            <div className="c-admin-dashboard__quick-actions">
              <h3>クイックアクション</h3>
              <div className="c-admin-dashboard__action-buttons">
                <button
                  onClick={() => setActiveTab("profile")}
                  className="c-admin-dashboard__action-btn"
                >
                  プロフィール編集
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className="c-admin-dashboard__action-btn"
                >
                  新しいスキル追加
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className="c-admin-dashboard__action-btn"
                >
                  新しいプロジェクト追加
                </button>
                <button
                  onClick={() => setActiveTab("blog")}
                  className="c-admin-dashboard__action-btn"
                >
                  新しい記事作成
                </button>
                <Link
                  href="/portfolio"
                  className="c-admin-dashboard__action-btn c-admin-dashboard__action-btn--secondary"
                >
                  ポートフォリオを表示
                </Link>
              </div>
            </div>
          </div>
        );
      case "profile":
        return <ProfileEditor />;
      case "skills":
        return <SkillsManager />;
      case "projects":
        return <ProjectsManager />;
      case "blog":
        return <BlogManager />;
      case "settings":
        return <AdminSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-layout">
      {/* ヘッダーナビゲーション */}
      <ResponsiveNavigation
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className="c-admin-dashboard" style={{ paddingTop: '80px' }}>
        <div className="c-admin-dashboard__header">
          <div className="c-admin-dashboard__header-left">
            <h1 className="c-admin-dashboard__title">管理ダッシュボード</h1>
            <div className="c-admin-dashboard__user-info">
              <span className="c-admin-dashboard__username">
                ようこそ、管理者さん
              </span>
            </div>
          </div>
          <div className="c-admin-dashboard__header-right">
            <button
              onClick={() => setShowA11yTester(true)}
              className="c-admin-dashboard__a11y-btn"
              aria-label="アクセシビリティチェッカーを開く"
            >
              ♿ A11Y
            </button>
            <button
              onClick={() => setShowResponsiveTester(true)}
              className="c-admin-dashboard__responsive-btn"
              aria-label="レスポンシブテストヘルパーを開く"
            >
              📱 RWD
            </button>
            <Link
              href="/portfolio"
              className="c-admin-dashboard__logout-btn"
            >
              ポートフォリオに戻る
            </Link>
          </div>
        </div>

        <div className="c-admin-dashboard__content">
          <div className="c-admin-dashboard__sidebar">
            <nav className="c-admin-dashboard__nav">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`c-admin-dashboard__nav-item ${activeTab === item.id ? "c-admin-dashboard__nav-item--active" : ""
                    }`}
                >
                  <span className="c-admin-dashboard__nav-icon">{item.icon}</span>
                  <span className="c-admin-dashboard__nav-label">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="c-admin-dashboard__main">
            {renderContent()}
          </div>
        </div>

        {/* アクセシビリティテスター */}
        <AccessibilityTester
          isVisible={showA11yTester}
          onClose={() => setShowA11yTester(false)}
        />

        {/* レスポンシブテストヘルパー */}
        <ResponsiveTestHelper
          isVisible={showResponsiveTester}
          onClose={() => setShowResponsiveTester(false)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
