"use client";

import { useState, useEffect } from "react";
import { Skill, SkillCategory } from "@/types/portfolio";
import { ScrollAnimation } from "./ScrollAnimation";

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  [SkillCategory.LANGUAGE]: { label: "プログラミング言語", icon: "💻", color: "#3b82f6" },
  [SkillCategory.FRONTEND]: { label: "フロントエンド", icon: "🎨", color: "#06b6d4" },
  [SkillCategory.BACKEND]: { label: "バックエンド", icon: "⚙️", color: "#10b981" },
  [SkillCategory.MOBILE]: { label: "モバイル", icon: "📱", color: "#f59e0b" },
  [SkillCategory.DATABASE]: { label: "データベース", icon: "🗄️", color: "#ef4444" },
  [SkillCategory.INFRASTRUCTURE]: { label: "インフラ・DevOps", icon: "☁️", color: "#8b5cf6" },
  [SkillCategory.AI]: { label: "AI・機械学習", icon: "🤖", color: "#ec4899" },
  [SkillCategory.UNITY]: { label: "Unity・ゲーム", icon: "🎮", color: "#7c3aed" },
  [SkillCategory.DESIGN]: { label: "デザイン", icon: "🎭", color: "#f97316" },
  [SkillCategory.MANAGEMENT]: { label: "マネジメント", icon: "📋", color: "#6b7280" },
};

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    const handleSkillsUpdate = () => {
      fetchSkills();
    };
    window.addEventListener('skillsUpdated', handleSkillsUpdate);
    return () => window.removeEventListener('skillsUpdated', handleSkillsUpdate);
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/portfolio/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills || []);
      }
    } catch {
      // API接続エラー時は空配列のまま
    } finally {
      setLoading(false);
    }
  };

  // カテゴリごとにグループ化
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || "other";
    return {
      ...acc,
      [cat]: [...(acc[cat] || []), skill],
    };
  }, {});

  // カテゴリ順序を定義
  const categoryOrder = [
    SkillCategory.LANGUAGE,
    SkillCategory.FRONTEND,
    SkillCategory.BACKEND,
    SkillCategory.MOBILE,
    SkillCategory.DATABASE,
    SkillCategory.INFRASTRUCTURE,
    SkillCategory.AI,
    SkillCategory.UNITY,
    SkillCategory.DESIGN,
    SkillCategory.MANAGEMENT,
  ];

  const sortedCategories = categoryOrder.filter(cat => groupedSkills[cat]?.length > 0);

  if (loading) {
    return (
      <section className="neo-skills neo-skills--loading">
        <div className="neo-skills__container">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mx-auto mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
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
              これまでに習得した技術と経験年数
            </p>
          </header>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedCategories.map((category, catIdx) => {
            const config = CATEGORY_CONFIG[category];
            const categorySkills = groupedSkills[category].sort((a, b) => b.level - a.level);

            return (
              <ScrollAnimation key={category} animation="fade-up" delay={catIdx * 80}>
                <div
                  className="border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] bg-white dark:bg-gray-800 h-full"
                >
                  {/* Category Header */}
                  <div
                    className="flex items-center gap-3 px-5 py-3 border-b-2 border-black dark:border-white"
                    style={{ backgroundColor: `${config.color}25` }}
                  >
                    <span className="text-2xl" aria-hidden="true">{config.icon}</span>
                    <h3 className="text-lg font-bold">{config.label}</h3>
                  </div>

                  {/* Skills as chips */}
                  <div className="flex flex-wrap gap-2.5 p-5">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black dark:border-gray-500 bg-gray-50 dark:bg-gray-700 text-sm font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)]"
                      >
                        <span>{skill.name}</span>
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded-sm text-white"
                          style={{ backgroundColor: config.color }}
                        >
                          {skill.years}y
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
