"use client";

import { useState, useEffect } from "react";
import { ImageUpload } from "../ImageUpload";

interface Project {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    images: string[];
    technologies: string[];
    category: string;
    projectUrl?: string;
    githubUrl?: string;
    demoUrl?: string;
    featured: boolean;
    published: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

const projectCategories = [
    { id: "web", label: "Webアプリケーション", color: "#3b82f6" },
    { id: "mobile", label: "モバイルアプリ", color: "#10b981" },
    { id: "unity", label: "Unityゲーム", color: "#8b5cf6" },
    { id: "ai", label: "AI/ML", color: "#ec4899" },
    { id: "other", label: "その他", color: "#6b7280" },
];

const formatTimestamp = (value: unknown): string => {
    if (!value) return '-';
    if (typeof value === 'string') return value.split('T')[0];
    if (typeof value === 'object' && value !== null && 'seconds' in value) {
        return new Date((value as { seconds: number }).seconds * 1000).toISOString().split('T')[0];
    }
    return String(value);
};

export const ProjectsManager = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [orderChanged, setOrderChanged] = useState(false);

    // データ読み込み
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/projects');
            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects || []);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const newProjectTemplate: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
        title: "",
        description: "",
        thumbnail: "",
        images: [],
        technologies: [],
        category: "web",
        projectUrl: "",
        githubUrl: "",
        demoUrl: "",
        featured: false,
        published: false,
        order: projects.length + 1
    };

    const filteredProjects = selectedCategory === "all"
        ? projects
        : projects.filter(project => project.category === selectedCategory);

    const handleAddNew = () => {
        const now = new Date().toISOString().split('T')[0];
        setEditingProject({
            ...newProjectTemplate,
            id: Date.now().toString(),
            createdAt: now,
            updatedAt: now
        });
        setIsAddingNew(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject({ ...project });
        setIsAddingNew(false);
    };

    const handleSave = async () => {
        if (!editingProject) return;

        setSaving(true);
        try {
            if (isAddingNew) {
                // 新規追加
                const response = await fetch('/api/admin/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editingProject)
                });

                if (response.ok) {
                    const data = await response.json();
                    setProjects(prev => [...prev, { ...editingProject, id: data.id }]);
                } else {
                    throw new Error('Failed to create project');
                }
            } else {
                // 更新
                const response = await fetch(`/api/admin/projects/${editingProject.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editingProject)
                });

                if (response.ok) {
                    setProjects(prev => prev.map(project =>
                        project.id === editingProject.id ? editingProject : project
                    ));
                } else {
                    throw new Error('Failed to update project');
                }
            }

            setEditingProject(null);
            setIsAddingNew(false);
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (projectId: string) => {
        if (!confirm("このプロジェクトを削除しますか？")) return;

        setSaving(true);
        try {
            const response = await fetch(`/api/admin/projects/${projectId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setProjects(prev => prev.filter(project => project.id !== projectId));
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                throw new Error("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditingProject(null);
        setIsAddingNew(false);
    };

    const updateEditingProject = (field: keyof Project, value: any) => {
        if (!editingProject) return;
        setEditingProject(prev => prev ? { ...prev, [field]: value } : null);
    };

    const toggleFeatured = (projectId: string) => {
        setProjects(prev => prev.map(project =>
            project.id === projectId
                ? { ...project, featured: !project.featured }
                : project
        ));
    };

    const togglePublished = (projectId: string) => {
        setProjects(prev => prev.map(project =>
            project.id === projectId
                ? { ...project, published: !project.published }
                : project
        ));
    };

    const moveProject = (projectId: string, direction: "up" | "down") => {
        const projectIndex = projects.findIndex(p => p.id === projectId);
        if (projectIndex === -1) return;

        const newProjects = [...projects];
        const targetIndex = direction === "up" ? projectIndex - 1 : projectIndex + 1;

        if (targetIndex < 0 || targetIndex >= newProjects.length) return;

        [newProjects[projectIndex], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[projectIndex]];

        const updatedProjects = newProjects.map((project, index) => ({
            ...project,
            order: index + 1,
        }));

        setProjects(updatedProjects);
        setOrderChanged(true);
    };

    const saveOrder = async () => {
        setSaving(true);
        try {
            const promises = projects.map(async (project, index) => {
                const response = await fetch(`/api/admin/projects/${project.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: index + 1 }),
                });
                if (!response.ok) {
                    throw new Error(`Failed to update order for project ${project.id}`);
                }
                return response;
            });
            const results = await Promise.allSettled(promises);
            const failures = results.filter(r => r.status === 'rejected');
            if (failures.length > 0) {
                setSaveStatus("error");
                setTimeout(() => setSaveStatus("idle"), 3000);
                await loadProjects();
                return;
            }
            setOrderChanged(false);
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch {
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="c-projects-manager">
            <div className="c-projects-manager__header">
                <h2 className="c-projects-manager__title">プロジェクト管理</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {orderChanged && (
                        <button
                            onClick={saveOrder}
                            className="c-projects-manager__save-btn"
                            disabled={saving}
                        >
                            {saving ? "保存中..." : "並び順を保存"}
                        </button>
                    )}
                    <button
                        onClick={handleAddNew}
                        className="c-projects-manager__add-btn"
                        disabled={editingProject !== null}
                    >
                        + 新しいプロジェクト追加
                    </button>
                </div>
            </div>

            {saveStatus === "success" && (
                <div className="c-projects-manager__status c-projects-manager__status--success">
                    プロジェクト情報を保存しました
                </div>
            )}

            {saveStatus === "error" && (
                <div className="c-projects-manager__status c-projects-manager__status--error">
                    保存に失敗しました
                </div>
            )}

            <div className="c-projects-manager__filters">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`c-projects-manager__filter ${selectedCategory === "all" ? "c-projects-manager__filter--active" : ""}`}
                >
                    すべて ({projects.length})
                </button>
                {projectCategories.map(category => {
                    const count = projects.filter(p => p.category === category.id).length;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`c-projects-manager__filter ${selectedCategory === category.id ? "c-projects-manager__filter--active" : ""}`}
                            style={{ borderColor: category.color }}
                        >
                            {category.label} ({count})
                        </button>
                    );
                })}
            </div>

            <div className="c-projects-manager__content">
                {editingProject && (
                    <div className="c-projects-manager__editor">
                        <div className="c-projects-manager__editor-header">
                            <h3>{isAddingNew ? "新しいプロジェクト追加" : "プロジェクト編集"}</h3>
                            <div className="c-projects-manager__editor-actions">
                                <button
                                    onClick={handleCancel}
                                    className="c-projects-manager__cancel-btn"
                                    disabled={saving}
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="c-projects-manager__save-btn"
                                    disabled={saving || !editingProject.title.trim()}
                                >
                                    {saving ? "保存中..." : "保存"}
                                </button>
                            </div>
                        </div>

                        <div className="c-projects-manager__editor-form">
                            <div className="c-projects-manager__form-grid">
                                <div className="c-projects-manager__field">
                                    <label className="c-projects-manager__label">プロジェクト名</label>
                                    <input
                                        type="text"
                                        value={editingProject.title}
                                        onChange={(e) => updateEditingProject("title", e.target.value)}
                                        className="c-projects-manager__input"
                                        placeholder="例: ポートフォリオサイト"
                                    />
                                </div>

                                <div className="c-projects-manager__field">
                                    <label className="c-projects-manager__label">カテゴリ</label>
                                    <select
                                        value={editingProject.category}
                                        onChange={(e) => updateEditingProject("category", e.target.value)}
                                        className="c-projects-manager__select"
                                    >
                                        {projectCategories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="c-projects-manager__field">
                                    <label className="c-projects-manager__label">サムネイル画像</label>
                                    <ImageUpload
                                        folder="projects"
                                        currentImage={editingProject.thumbnail}
                                        onUploadComplete={(url) => updateEditingProject("thumbnail", url)}
                                        onUploadError={(error) => console.error('Thumbnail upload error:', error)}
                                        className="c-projects-manager__image-upload"
                                    />
                                    <div className="c-projects-manager__field" style={{ marginTop: '16px' }}>
                                        <label className="c-projects-manager__label">または画像URL</label>
                                        <input
                                            type="url"
                                            value={editingProject.thumbnail}
                                            onChange={(e) => updateEditingProject("thumbnail", e.target.value)}
                                            className="c-projects-manager__input"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                <div className="c-projects-manager__field">
                                    <label className="c-projects-manager__label">サイトURL</label>
                                    <input
                                        type="url"
                                        value={editingProject.projectUrl || ""}
                                        onChange={(e) => updateEditingProject("projectUrl", e.target.value)}
                                        className="c-projects-manager__input"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="c-projects-manager__field">
                                    <label className="c-projects-manager__label">GitHubリンク</label>
                                    <input
                                        type="url"
                                        value={editingProject.githubUrl || ""}
                                        onChange={(e) => updateEditingProject("githubUrl", e.target.value)}
                                        className="c-projects-manager__input"
                                        placeholder="https://github.com/username/project"
                                    />
                                </div>

                                <div className="c-projects-manager__field">
                                    <label className="c-projects-manager__label">デモリンク</label>
                                    <input
                                        type="url"
                                        value={editingProject.demoUrl || ""}
                                        onChange={(e) => updateEditingProject("demoUrl", e.target.value)}
                                        className="c-projects-manager__input"
                                        placeholder="https://project.example.com"
                                    />
                                </div>
                            </div>

                            <div className="c-projects-manager__field">
                                <label className="c-projects-manager__label">説明</label>
                                <textarea
                                    value={editingProject.description}
                                    onChange={(e) => updateEditingProject("description", e.target.value)}
                                    className="c-projects-manager__textarea"
                                    rows={4}
                                    placeholder="プロジェクトの詳細説明"
                                />
                            </div>

                            <div className="c-projects-manager__field">
                                <label className="c-projects-manager__label">使用技術（カンマ区切り）</label>
                                <input
                                    type="text"
                                    value={editingProject.technologies.join(", ")}
                                    onChange={(e) => updateEditingProject("technologies", e.target.value.split(", ").filter(t => t.trim()))}
                                    className="c-projects-manager__input"
                                    placeholder="React, TypeScript, Node.js"
                                />
                            </div>

                            <div className="c-projects-manager__field">
                                <label className="c-projects-manager__label">追加画像URL（カンマ区切り）</label>
                                <input
                                    type="text"
                                    value={editingProject.images.join(", ")}
                                    onChange={(e) => updateEditingProject("images", e.target.value.split(", ").filter(url => url.trim()))}
                                    className="c-projects-manager__input"
                                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                />
                            </div>

                            <div className="c-projects-manager__checkboxes">
                                <label className="c-projects-manager__checkbox">
                                    <input
                                        type="checkbox"
                                        checked={editingProject.featured}
                                        onChange={(e) => updateEditingProject("featured", e.target.checked)}
                                    />
                                    注目プロジェクトとして表示
                                </label>
                                <label className="c-projects-manager__checkbox">
                                    <input
                                        type="checkbox"
                                        checked={editingProject.published}
                                        onChange={(e) => updateEditingProject("published", e.target.checked)}
                                    />
                                    公開する
                                </label>
                            </div>

                            <div className="c-projects-manager__preview">
                                <h4>プレビュー</h4>
                                <div className="c-projects-manager__project-preview">
                                    {editingProject.thumbnail && (
                                        <div className="c-projects-manager__preview-image">
                                            <img src={editingProject.thumbnail} alt="プレビュー" />
                                        </div>
                                    )}
                                    <div className="c-projects-manager__preview-content">
                                        <div className="c-projects-manager__preview-title">
                                            {editingProject.title || "プロジェクト名"}
                                            {editingProject.featured && <span className="c-projects-manager__featured-badge">注目</span>}
                                        </div>
                                        <div className="c-projects-manager__preview-category">
                                            {projectCategories.find(c => c.id === editingProject.category)?.label}
                                        </div>
                                        <div className="c-projects-manager__preview-description">
                                            {editingProject.description || "プロジェクトの説明"}
                                        </div>
                                        {editingProject.technologies.length > 0 && (
                                            <div className="c-projects-manager__preview-technologies">
                                                {editingProject.technologies.map((tech, index) => (
                                                    <span key={index} className="c-projects-manager__tech-tag">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="c-projects-manager__preview-links">
                                            {editingProject.projectUrl && (
                                                <span className="c-projects-manager__preview-link">Site</span>
                                            )}
                                            {editingProject.githubUrl && (
                                                <span className="c-projects-manager__preview-link">GitHub</span>
                                            )}
                                            {editingProject.demoUrl && (
                                                <span className="c-projects-manager__preview-link">Demo</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="c-projects-manager__list">
                    {filteredProjects.length === 0 ? (
                        <div className="c-projects-manager__empty">
                            {selectedCategory === "all"
                                ? "まだプロジェクトが登録されていません"
                                : "このカテゴリにはプロジェクトがありません"
                            }
                        </div>
                    ) : (
                        filteredProjects.map((project, index) => (
                            <div key={project.id} className="c-projects-manager__item">
                                <div className="c-projects-manager__item-content">
                                    {project.thumbnail && (
                                        <div className="c-projects-manager__item-thumbnail">
                                            <img src={project.thumbnail} alt={project.title} />
                                        </div>
                                    )}
                                    <div className="c-projects-manager__item-info">
                                        <div className="c-projects-manager__item-header">
                                            <div className="c-projects-manager__item-title">
                                                {project.title}
                                                {project.featured && <span className="c-projects-manager__featured-badge">注目</span>}
                                                {!project.published && <span className="c-projects-manager__draft-badge">下書き</span>}
                                            </div>
                                            <div className="c-projects-manager__item-category">
                                                {projectCategories.find(c => c.id === project.category)?.label}
                                            </div>
                                        </div>
                                        <div className="c-projects-manager__item-description">
                                            {project.description}
                                        </div>
                                        {project.technologies.length > 0 && (
                                            <div className="c-projects-manager__item-technologies">
                                                {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                                    <span key={techIndex} className="c-projects-manager__tech-tag">
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies.length > 3 && (
                                                    <span className="c-projects-manager__tech-more">
                                                        +{project.technologies.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="c-projects-manager__item-meta">
                                            作成: {formatTimestamp(project.createdAt)} | 更新: {formatTimestamp(project.updatedAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="c-projects-manager__item-actions">
                                    <button
                                        onClick={() => moveProject(project.id, "up")}
                                        disabled={index === 0}
                                        className="c-projects-manager__move-btn"
                                        title="上に移動"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveProject(project.id, "down")}
                                        disabled={index === filteredProjects.length - 1}
                                        className="c-projects-manager__move-btn"
                                        title="下に移動"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => toggleFeatured(project.id)}
                                        className={`c-projects-manager__toggle-btn ${project.featured ? "c-projects-manager__toggle-btn--active" : ""}`}
                                        title="注目プロジェクト切り替え"
                                    >
                                        ⭐
                                    </button>
                                    <button
                                        onClick={() => togglePublished(project.id)}
                                        className={`c-projects-manager__toggle-btn ${project.published ? "c-projects-manager__toggle-btn--active" : ""}`}
                                        title="公開/非公開切り替え"
                                    >
                                        👁️
                                    </button>
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="c-projects-manager__edit-btn"
                                        disabled={editingProject !== null}
                                    >
                                        編集
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="c-projects-manager__delete-btn"
                                        disabled={saving}
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};