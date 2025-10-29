"use client";

import { useState, useEffect } from "react";
import { getSkills } from "@/lib/dataService";
import { Skill, SkillCategory } from "@/types/portfolio";
import Tooltip from "./Tooltip";
import { useCountUp } from "@/hooks/useCountUp";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ScrollAnimation, StaggerAnimation, CardAnimation } from "./ScrollAnimation";
import { AccessibleButton, AccessibleProgress, ScreenReaderOnly } from "./AccessibilityUtils";

interface SkillsProps {
  animateOnScroll?: boolean;
}

interface SkillCardProps {
  skill: Skill;
  index: number;
  categoryColor: string;
  animateOnScroll: boolean;
}

const SkillCard = ({ skill, index, categoryColor, animateOnScroll }: SkillCardProps) => {
  const { elementRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.3,
    triggerOnce: true
  });

  const { count: animatedLevel } = useCountUp({
    end: skill.level,
    duration: 1500,
    startOnMount: isIntersecting && animateOnScroll
  });

  const { count: animatedYears } = useCountUp({
    end: skill.years,
    duration: 1000,
    startOnMount: isIntersecting && animateOnScroll
  });

  const getSkillIcon = (name: string): string => {
    const iconMap: Record<string, string> = {
      // Frontend
      "React": "⚛️",
      "Next.js": "▲",
      "Vue.js": "💚",
      "TypeScript": "🔷",
      "JavaScript": "🟨",
      "HTML": "🌐",
      "CSS": "🎨",
      "Sass": "💗",
      "Tailwind": "🌊",

      // Backend
      "Node.js": "🟢",
      "Python": "🐍",
      "Java": "☕",
      "C#": "#️⃣",
      "PHP": "🐘",
      "Go": "🐹",
      "Rust": "🦀",

      // Database
      "MySQL": "🐬",
      "PostgreSQL": "🐘",
      "MongoDB": "🍃",
      "Redis": "🔴",
      "Firebase": "🔥",

      // Infrastructure
      "AWS": "☁️",
      "Docker": "🐳",
      "Kubernetes": "⚓",
      "Linux": "🐧",
      "Git": "📝",

      // Unity
      "Unity": "🎮",
      "C# Unity": "🎯",

      // AI
      "TensorFlow": "🧠",
      "PyTorch": "🔥",
      "OpenAI": "🤖",
      "Machine Learning": "📊",
    };

    return iconMap[name] || "💻";
  };

  const getLevelLabel = (level: number): string => {
    if (level >= 90) return "エキスパート";
    if (level >= 70) return "上級";
    if (level >= 50) return "中級";
    if (level >= 30) return "初級";
    return "学習中";
  };

  const getTooltipContent = () => (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
        {skill.name}
      </div>
      <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
        レベル: {skill.level}% ({getLevelLabel(skill.level)})
      </div>
      <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
        経験年数: {skill.years}年
      </div>
      {skill.description && (
        <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.8 }}>
          {skill.description}
        </div>
      )}
    </div>
  );

  return (
    <article
      ref={elementRef}
      className="neo-skills__card"
      style={{
        animationDelay: animateOnScroll ? `${index * 0.1}s` : '0s'
      }}
      role="article"
      aria-labelledby={`skill-${skill.id}-name`}
      aria-describedby={`skill-${skill.id}-description`}
    >
      <Tooltip content={getTooltipContent()} position="top">
        <div className="neo-skills__card-header">
          <div className="neo-skills__card-icon" aria-hidden="true">
            {skill.icon || getSkillIcon(skill.name)}
          </div>
          <div className="neo-skills__card-info">
            <h3 id={`skill-${skill.id}-name`} className="neo-skills__card-name">
              {skill.name}
            </h3>
            <span className="neo-skills__card-years" aria-label={`経験年数 ${animateOnScroll ? animatedYears : skill.years}年`}>
              {animateOnScroll ? animatedYears : skill.years}年
            </span>
          </div>
        </div>

        <div className="neo-skills__card-level">
          <AccessibleProgress
            value={animateOnScroll ? animatedLevel : skill.level}
            max={100}
            label={`${skill.name}のスキルレベル`}
            showValue={true}
            className="neo-skills__accessible-progress"
          />
          <ScreenReaderOnly>
            スキルレベル: {getLevelLabel(animateOnScroll ? animatedLevel : skill.level)}
          </ScreenReaderOnly>
        </div>

        {skill.description && (
          <p id={`skill-${skill.id}-description`} className="neo-skills__card-description">
            {skill.description}
          </p>
        )}
      </Tooltip>

      <div className="neo-skills__card-category" aria-hidden="true">
        <span
          className="neo-skills__category-tag"
          style={{
            backgroundColor: categoryColor
          }}
        >
          {/* Category shown in tooltip */}
        </span>
      </div>
    </article>
  );
};

const Skills = ({ animateOnScroll = true }: SkillsProps) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [showMoreLoading, setShowMoreLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  // スキル更新イベントをリッスン
  useEffect(() => {
    const handleSkillsUpdate = () => {
      console.log('Skills update event received, refreshing data...');
      fetchSkills();
    };

    window.addEventListener('skillsUpdated', handleSkillsUpdate);
    return () => {
      window.removeEventListener('skillsUpdated', handleSkillsUpdate);
    };
  }, []);

  const fetchSkills = async () => {
    try {
      const skillsList = await getSkills();
      setSkills(skillsList);
    } catch (error) {
      // エラーログを無効化
    } finally {
      setLoading(false);
    }
  };

  const categoryLabels: Record<string, { label: string; icon: string; color: string }> = {
    all: { label: "すべて", icon: "🎯", color: "#6366f1" },
    [SkillCategory.LANGUAGE]: { label: "プログラミング言語", icon: "💻", color: "#3b82f6" },
    [SkillCategory.FRONTEND]: { label: "フロントエンド", icon: "🎨", color: "#06b6d4" },
    [SkillCategory.BACKEND]: { label: "バックエンド", icon: "⚙️", color: "#10b981" },
    [SkillCategory.MOBILE]: { label: "モバイル", icon: "📱", color: "#f59e0b" },
    [SkillCategory.DATABASE]: { label: "データベース", icon: "🗄️", color: "#ef4444" },
    [SkillCategory.INFRASTRUCTURE]: { label: "インフラ・DevOps", icon: "☁️", color: "#8b5cf6" },
    [SkillCategory.AI]: { label: "AI・機械学習", icon: "🤖", color: "#ec4899" },
    [SkillCategory.UNITY]: { label: "Unity・ゲーム", icon: "🎮", color: "#7c3aed" },
    [SkillCategory.DESIGN]: { label: "デザイン・クリエイティブ", icon: "🎭", color: "#f97316" },
    [SkillCategory.MANAGEMENT]: { label: "マネジメント・その他", icon: "📋", color: "#6b7280" },
  };

  const getFilteredSkills = () => {
    if (activeCategory === "all") return skills;
    return skills.filter(skill => skill.category === activeCategory);
  };

  const getVisibleSkills = () => {
    const filtered = getFilteredSkills();
    return filtered.slice(0, visibleCount);
  };

  const hasMoreSkills = () => {
    return getFilteredSkills().length > visibleCount;
  };

  const handleShowMore = async () => {
    setShowMoreLoading(true);
    // アニメーション効果のための短い遅延
    await new Promise(resolve => setTimeout(resolve, 300));
    setVisibleCount(prev => prev + 6);
    setShowMoreLoading(false);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(6); // カテゴリ変更時は表示数をリセット
  };

  const getCategories = () => {
    const categories = ["all"];
    const skillCategories = Array.from(new Set(skills.map(skill => skill.category)));
    return categories.concat(skillCategories);
  };

  if (loading) {
    return (
      <section className="neo-skills neo-skills--loading">
        <div className="neo-skills__container">
          <div className="neo-skills__skeleton">
            <div className="neo-skills__skeleton-header">
              <div className="neo-skills__skeleton-title"></div>
              <div className="neo-skills__skeleton-tabs">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="neo-skills__skeleton-tab"></div>
                ))}
              </div>
            </div>
            <div className="neo-skills__skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="neo-skills__skeleton-card"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (skills.length === 0) {
    return (
      <section className="neo-skills neo-skills--empty">
        <div className="neo-skills__container">
          <ScrollAnimation animation="fade-up">
            <div className="neo-skills__header">
              <h2 className="neo-skills__title">技術スタック</h2>
            </div>
            <div className="neo-card neo-card--empty">
              <h3>スキル情報がありません</h3>
              <p>管理画面からスキル情報を追加してください。</p>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="neo-skills" aria-labelledby="skills-title">
      <div className="neo-skills__container">
        <ScrollAnimation animation="fade-up">
          <header className="neo-skills__header">
            <h2 id="skills-title" className="neo-skills__title">技術スタック</h2>
            <p className="neo-skills__subtitle">
              これまでに習得した技術と経験年数をご紹介します
            </p>
          </header>
        </ScrollAnimation>

        {/* Category Tabs */}
        <ScrollAnimation animation="fade-up" delay={200}>
          <div className="neo-skills__tabs" role="tablist" aria-label="技術カテゴリ選択">
            <div className="neo-skills__tab-list">
              {getCategories().map((category) => {
                const categoryInfo = categoryLabels[category];
                if (!categoryInfo) return null;

                return (
                  <AccessibleButton
                    key={category}
                    className={`neo-skills__tab ${activeCategory === category ? 'neo-skills__tab--active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                    ariaLabel={`${categoryInfo.label}カテゴリを表示 (${category === "all" ? skills.length : skills.filter(s => s.category === category).length}件)`}
                    style={{ '--tab-color': categoryInfo.color } as React.CSSProperties}
                  >
                    <span className="neo-skills__tab-icon" aria-hidden="true">{categoryInfo.icon}</span>
                    <span className="neo-skills__tab-label">{categoryInfo.label}</span>
                    <span className="neo-skills__tab-count" aria-hidden="true">
                      {category === "all" ? skills.length : skills.filter(s => s.category === category).length}
                    </span>
                  </AccessibleButton>
                );
              })}
            </div>
          </div>
        </ScrollAnimation>

        {/* Skills Grid */}
        <div className="neo-skills__content" role="tabpanel" aria-labelledby={`tab-${activeCategory}`}>
          <ScreenReaderOnly>
            現在表示中: {categoryLabels[activeCategory]?.label || 'すべて'}のスキル ({getFilteredSkills().length}件)
          </ScreenReaderOnly>

          <StaggerAnimation>
            <div className="neo-skills__grid" role="list" aria-label="技術スキル一覧">
              {getVisibleSkills().map((skill, index) => (
                <CardAnimation key={skill.id}>
                  <div role="listitem">
                    <SkillCard
                      skill={skill}
                      index={index}
                      categoryColor={categoryLabels[skill.category]?.color || '#6b7280'}
                      animateOnScroll={animateOnScroll}
                    />
                  </div>
                </CardAnimation>
              ))}
            </div>
          </StaggerAnimation>

          {/* Show More Button */}
          {hasMoreSkills() && (
            <ScrollAnimation animation="fade-up" delay={300}>
              <div className="neo-skills__show-more">
                <AccessibleButton
                  className={`neo-skills__show-more-btn ${showMoreLoading ? 'neo-skills__show-more-btn--loading' : ''}`}
                  onClick={handleShowMore}
                  disabled={showMoreLoading}
                  ariaLabel={`さらに${Math.min(6, getFilteredSkills().length - visibleCount)}件のスキルを表示`}
                >
                  <span className="neo-skills__show-more-icon" aria-hidden="true">
                    {showMoreLoading ? '⏳' : '+'}
                  </span>
                  <span className="neo-skills__show-more-text">
                    {showMoreLoading ? '読み込み中...' : `もっと見る (${getFilteredSkills().length - visibleCount}件)`}
                  </span>
                </AccessibleButton>
              </div>
            </ScrollAnimation>
          )}

          {/* Skills Summary */}
          <ScrollAnimation animation="fade-up" delay={400}>
            <div className="neo-skills__summary" role="status" aria-live="polite">
              <p className="neo-skills__summary-text">
                {categoryLabels[activeCategory]?.label || 'すべて'}のスキル:
                <strong> {Math.min(visibleCount, getFilteredSkills().length)} / {getFilteredSkills().length}件</strong>を表示中
              </p>
            </div>
          </ScrollAnimation>

          {getFilteredSkills().length === 0 && (
            <ScrollAnimation animation="fade-up">
              <div className="neo-skills__empty" role="status" aria-live="polite">
                <div className="neo-skills__empty-icon" aria-hidden="true">🔍</div>
                <h3 className="neo-skills__empty-title">スキルが見つかりません</h3>
                <p className="neo-skills__empty-description">
                  選択されたカテゴリにはスキルがありません。
                </p>
              </div>
            </ScrollAnimation>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
