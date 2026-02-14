"use client";

import { useState, useEffect } from "react";
import { getSkills } from "@/lib/dataService";
import { Skill, SkillCategory } from "@/types/portfolio";
import { ScrollAnimation } from "./ScrollAnimation";

interface SkillsProps {
  animateOnScroll?: boolean;
}

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

const SKILL_ICONS: Record<string, string> = {
  "React": "⚛️", "Next.js": "▲", "Vue.js": "💚", "TypeScript": "🔷",
  "JavaScript": "🟨", "HTML": "🌐", "CSS": "🎨", "Sass": "💗",
  "Tailwind": "🌊", "Node.js": "🟢", "Python": "🐍", "Java": "☕",
  "C#": "#️⃣", "PHP": "🐘", "Go": "🐹", "Rust": "🦀",
  "MySQL": "🐬", "PostgreSQL": "🐘", "MongoDB": "🍃", "Redis": "🔴",
  "Firebase": "🔥", "AWS": "☁️", "Docker": "🐳", "Kubernetes": "⚓",
  "Linux": "🐧", "Git": "📝", "Unity": "🎮", "C# Unity": "🎯",
  "TensorFlow": "🧠", "PyTorch": "🔥", "OpenAI": "🤖", "Machine Learning": "📊",
};

const Skills = ({ animateOnScroll = true }: SkillsProps) => {
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
      const skillsList = await getSkills();
      setSkills(skillsList);
    } catch {
      // Firestore未接続時は空配列のまま
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

        <div className="space-y-8">
          {sortedCategories.map((category, catIdx) => {
            const config = CATEGORY_CONFIG[category];
            const categorySkills = groupedSkills[category].sort((a, b) => b.level - a.level);

            return (
              <ScrollAnimation key={category} animation="fade-up" delay={catIdx * 100}>
                <div
                  className="border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] bg-white dark:bg-gray-800"
                >
                  {/* Category Header */}
                  <div
                    className="flex items-center gap-3 px-5 py-3 border-b-2 border-black dark:border-white"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <span className="text-xl" aria-hidden="true">{config.icon}</span>
                    <h3 className="text-base font-bold">{config.label}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({categorySkills.length})
                    </span>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-gray-200 dark:divide-gray-700">
                    {categorySkills.map((skill) => {
                      const icon = skill.icon || SKILL_ICONS[skill.name] || "💻";
                      return (
                        <div
                          key={skill.id}
                          className="flex items-center gap-3 px-5 py-3 sm:border-r-0 lg:border-r last:border-r-0 border-gray-200 dark:border-gray-700"
                        >
                          <span className="text-lg shrink-0" aria-hidden="true">{icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-sm truncate">{skill.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                {skill.years}年
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${skill.level}%`,
                                  backgroundColor: config.color,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
