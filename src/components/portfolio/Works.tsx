"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Project, ProjectCategory } from "@/types/portfolio";
import ProjectModal from "./ProjectModal";
import { ScrollAnimation, StaggerAnimation, CardAnimation } from "./ScrollAnimation";
import { ThumbnailImage } from "./OptimizedImage";
import { HoverScale, RippleEffect } from "./MicroInteractions";
import { SectionLoading } from "./LoadingStates";

// Technology color mapping for Neobrutalism design
const TECH_COLORS: Record<string, string> = {
  // Frontend
  "React": "bg-[#61DAFB] text-black",
  "Next.js": "bg-black text-white",
  "Vue.js": "bg-[#4FC08D] text-white",
  "TypeScript": "bg-[#3178C6] text-white",
  "JavaScript": "bg-[#F7DF1E] text-black",
  "HTML": "bg-[#E34F26] text-white",
  "CSS": "bg-[#1572B6] text-white",
  "Tailwind": "bg-[#06B6D4] text-white",
  "SCSS": "bg-[#CF649A] text-white",

  // Backend
  "Node.js": "bg-[#339933] text-white",
  "Python": "bg-[#3776AB] text-white",
  "PHP": "bg-[#777BB4] text-white",
  "Java": "bg-[#ED8B00] text-white",
  "C#": "bg-[#239120] text-white",

  // Database
  "MySQL": "bg-[#4479A1] text-white",
  "PostgreSQL": "bg-[#336791] text-white",
  "MongoDB": "bg-[#47A248] text-white",
  "Firebase": "bg-[#FFCA28] text-black",

  // Unity
  "Unity": "bg-black text-white",
  "C# Unity": "bg-[#239120] text-white",

  // AI/ML
  "TensorFlow": "bg-[#FF6F00] text-white",
  "PyTorch": "bg-[#EE4C2C] text-white",
  "OpenAI": "bg-[#412991] text-white",

  // Default
  "default": "bg-[#6B7280] text-white"
};

const Works = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTechnology, setSelectedTechnology] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/portfolio/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        setProjects(getMockProjects());
      }
    } catch {
      setProjects(getMockProjects());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Mock data for development
  const getMockProjects = (): Project[] => [
    {
      id: "1",
      title: "ポートフォリオサイト",
      description: "Next.js + TypeScript + Tailwind CSSで構築したレスポンシブなポートフォリオサイト。Neobrutalism デザインを採用し、ダークモード対応。",
      thumbnail: "/api/placeholder/400/300",
      images: ["/api/placeholder/800/600"],
      technologies: ["Next.js", "TypeScript", "Tailwind", "Firebase"],
      category: ProjectCategory.WEB,
      projectUrl: "https://portfolio.example.com",
      githubUrl: "https://github.com/example/portfolio",
      demoUrl: "https://portfolio.example.com",
      featured: true,
      order: 1,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Unity 3Dゲーム",
      description: "Unity 2022.3で開発した3Dアクションゲーム。物理演算とパーティクルシステムを活用したエフェクト。",
      thumbnail: "/api/placeholder/400/300",
      images: ["/api/placeholder/800/600"],
      technologies: ["Unity", "C# Unity", "Blender"],
      category: ProjectCategory.UNITY,
      githubUrl: "https://github.com/example/unity-game",
      demoUrl: "https://game.example.com",
      featured: true,
      order: 2,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "AI チャットボット",
      description: "OpenAI GPT-4を活用したインテリジェントなチャットボット。自然言語処理と機械学習を組み合わせた対話システム。",
      thumbnail: "/api/placeholder/400/300",
      images: ["/api/placeholder/800/600"],
      technologies: ["Python", "OpenAI", "FastAPI", "React"],
      category: ProjectCategory.AI,
      githubUrl: "https://github.com/example/ai-chatbot",
      featured: false,
      order: 3,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const categories = [
    { value: "all", label: "すべて" },
    { value: ProjectCategory.WEB, label: "Web開発" },
    { value: ProjectCategory.UNITY, label: "Unity" },
    { value: ProjectCategory.AI, label: "AI開発" },
    { value: ProjectCategory.MOBILE, label: "モバイル" },
    { value: ProjectCategory.OTHER, label: "その他" },
  ];

  // Get all unique technologies for filtering
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();

  // Filter projects by category and technology
  const filteredProjects = projects.filter(project => {
    const categoryMatch = selectedCategory === "all" || project.category === selectedCategory;
    const technologyMatch = selectedTechnology === "all" ||
      project.technologies.includes(selectedTechnology);
    return categoryMatch && technologyMatch;
  });

  // Handle project card click
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Reset technology filter when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedTechnology("all");
  };

  const getTechColor = (tech: string): string => {
    return TECH_COLORS[tech] || TECH_COLORS.default;
  };

  if (loading) {
    return (
      <div className="c-works c-works--loading">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="c-works" id="works">
      <div className="container mx-auto px-4 py-16">
        {/* Section Title */}
        <ScrollAnimation animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="c-works__title">
              作品・実績
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
              これまでに手がけたプロジェクトの一部をご紹介します
            </p>
          </div>
        </ScrollAnimation>

        {/* Filters */}
        <ScrollAnimation animation="fade-up" delay={200}>
          <div className="c-works__filters">
            {/* Category Filter */}
            <div className="c-works__filter-group">
              <h3 className="c-works__filter-title">カテゴリ</h3>
              <div className="c-works__filter">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    className={`c-works__filter-button ${selectedCategory === category.value ? "is-active" : ""
                      }`}
                    onClick={() => handleCategoryChange(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Technology Filter */}
            {allTechnologies.length > 0 && (
              <div className="c-works__filter-group">
                <h3 className="c-works__filter-title">技術</h3>
                <div className="c-works__filter c-works__filter--technologies">
                  <button
                    className={`c-works__filter-button ${selectedTechnology === "all" ? "is-active" : ""
                      }`}
                    onClick={() => setSelectedTechnology("all")}
                  >
                    すべて
                  </button>
                  {allTechnologies.map((tech) => (
                    <button
                      key={tech}
                      className={`c-works__filter-button c-works__filter-button--tech ${selectedTechnology === tech ? "is-active" : ""
                        } ${getTechColor(tech)}`}
                      onClick={() => setSelectedTechnology(tech)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollAnimation>

        {/* Projects Grid */}
        <StaggerAnimation>
          <div className="c-works__grid">
            {filteredProjects.map((project, index) => (
              <CardAnimation key={project.id}>
                <div
                  className="c-works__item"
                  onClick={() => handleProjectClick(project)}
                >
                  {/* Thumbnail */}
                  <div className="c-works__thumbnail">
                    <ThumbnailImage
                      src={project.thumbnail}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="c-works__thumbnail-image"
                      aspectRatio="4/3"
                    />
                    {project.featured && (
                      <div className="c-works__featured-badge">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="c-works__content">
                    <h3 className="c-works__item-title">
                      {project.title}
                    </h3>

                    <p className="c-works__description">
                      {project.description}
                    </p>

                    {/* Technology Tags */}
                    <div className="c-works__technologies">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`c-works__technology ${getTechColor(tech)}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="c-works__links">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="c-works__link c-works__link--demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>🌐</span>
                          サイトを見る
                        </a>
                      )}
                      {project.demoUrl && !project.projectUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="c-works__link c-works__link--demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>🚀</span>
                          デモを見る
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="c-works__link c-works__link--github"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>📂</span>
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardAnimation>
            ))}
          </div>
        </StaggerAnimation>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <ScrollAnimation animation="fade-up">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">
                {projects.length === 0 ? '📝' : '🔍'}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {projects.length === 0 ? 'プロジェクト情報がありません' : 'プロジェクトが見つかりません'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {projects.length === 0
                  ? '管理画面からプロジェクト情報を追加してください。'
                  : '選択したカテゴリにはプロジェクトがありません。'
                }
              </p>
            </div>
          </ScrollAnimation>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </section>
  );
};

export default Works;
