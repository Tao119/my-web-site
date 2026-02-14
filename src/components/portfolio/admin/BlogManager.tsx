"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "@/types/portfolio";

interface BlogManagerProps {
    className?: string;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ className = "" }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [orderChanged, setOrderChanged] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/blog/posts");
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts || []);
            }
        } catch {
            // Firestore未接続時は空配列
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingPost({
            title: "",
            externalUrl: "",
            thumbnail: "",
            category: "",
            tags: [],
            published: false,
        });
        setIsCreating(true);
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost({ ...post });
        setIsCreating(false);
    };

    const handleDelete = async (postId: string) => {
        if (!confirm("この記事を削除してもよろしいですか？")) return;

        try {
            const response = await fetch(`/api/admin/blog/posts/${postId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setPosts(prev => prev.filter(post => post.id !== postId));
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
                setTimeout(() => setSaveStatus("idle"), 3000);
            }
        } catch {
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        }
    };

    const handleSave = async () => {
        if (!editingPost || !editingPost.title?.trim()) return;

        setSaving(true);
        try {
            const postData = {
                ...editingPost,
                slug: editingPost.externalUrl
                    ? `external-${Date.now()}`
                    : editingPost.title?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim() || `post-${Date.now()}`,
                excerpt: editingPost.title || "",
                content: "",
                thumbnail: editingPost.thumbnail || "",
                readTime: 0,
                publishedAt: editingPost.published
                    ? ((editingPost as BlogPost).publishedAt || new Date().toISOString())
                    : null,
            };

            const url = isCreating ? "/api/admin/blog/posts" : `/api/admin/blog/posts/${(editingPost as BlogPost).id}`;
            const method = isCreating ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                const result = await response.json();
                if (isCreating) {
                    setPosts(prev => [result.post, ...prev]);
                } else {
                    setPosts(prev => prev.map(p => p.id === result.post.id ? result.post : p));
                }
                setEditingPost(null);
                setIsCreating(false);
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
                setTimeout(() => setSaveStatus("idle"), 3000);
            }
        } catch {
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditingPost(null);
        setIsCreating(false);
    };

    const updateField = (field: string, value: unknown) => {
        setEditingPost(prev => prev ? { ...prev, [field]: value } : null);
    };

    const movePost = (postId: string, direction: "up" | "down") => {
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const newPosts = [...posts];
        const targetIndex = direction === "up" ? postIndex - 1 : postIndex + 1;

        if (targetIndex < 0 || targetIndex >= newPosts.length) return;

        [newPosts[postIndex], newPosts[targetIndex]] = [newPosts[targetIndex], newPosts[postIndex]];

        const updatedPosts = newPosts.map((post, index) => ({
            ...post,
            order: index + 1,
        }));

        setPosts(updatedPosts);
        setOrderChanged(true);
    };

    const saveOrder = async () => {
        setSaving(true);
        try {
            const promises = posts.map((post, index) =>
                fetch(`/api/admin/blog/posts/${post.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: index + 1 }),
                })
            );
            await Promise.all(promises);
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
        <div className={`c-blog-manager ${className}`}>
            <div className="c-blog-manager__header">
                <h2 className="c-blog-manager__title">記事管理</h2>
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
                        onClick={handleCreate}
                        className="c-blog-manager__create-btn"
                        disabled={editingPost !== null}
                    >
                        + 新しい記事を追加
                    </button>
                </div>
            </div>

            {saveStatus === "success" && (
                <div className="c-projects-manager__status c-projects-manager__status--success">
                    記事を保存しました
                </div>
            )}

            {saveStatus === "error" && (
                <div className="c-projects-manager__status c-projects-manager__status--error">
                    保存に失敗しました
                </div>
            )}

            {/* Editor */}
            {editingPost && (
                <div className="c-projects-manager__editor">
                    <div className="c-projects-manager__editor-header">
                        <h3>{isCreating ? "新しい記事を追加" : "記事を編集"}</h3>
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
                                disabled={saving || !editingPost.title?.trim()}
                            >
                                {saving ? "保存中..." : "保存"}
                            </button>
                        </div>
                    </div>

                    <div className="c-projects-manager__editor-form">
                        <div className="c-projects-manager__form-grid">
                            <div className="c-projects-manager__field">
                                <label className="c-projects-manager__label">記事タイトル</label>
                                <input
                                    type="text"
                                    value={editingPost.title || ""}
                                    onChange={(e) => updateField("title", e.target.value)}
                                    className="c-projects-manager__input"
                                    placeholder="例: Next.jsで作るモダンなWebアプリ"
                                />
                            </div>

                            <div className="c-projects-manager__field">
                                <label className="c-projects-manager__label">外部URL</label>
                                <input
                                    type="url"
                                    value={editingPost.externalUrl || ""}
                                    onChange={(e) => updateField("externalUrl", e.target.value)}
                                    className="c-projects-manager__input"
                                    placeholder="https://note.com/... or https://zenn.dev/..."
                                />
                            </div>

                            <div className="c-projects-manager__field">
                                <label className="c-projects-manager__label">サムネイルURL</label>
                                <input
                                    type="url"
                                    value={editingPost.thumbnail || ""}
                                    onChange={(e) => updateField("thumbnail", e.target.value)}
                                    className="c-projects-manager__input"
                                    placeholder="https://example.com/thumbnail.jpg"
                                />
                            </div>

                            <div className="c-projects-manager__field">
                                <label className="c-projects-manager__label">カテゴリ</label>
                                <input
                                    type="text"
                                    value={editingPost.category || ""}
                                    onChange={(e) => updateField("category", e.target.value)}
                                    className="c-projects-manager__input"
                                    placeholder="例: Tech, 医療, AI"
                                />
                            </div>

                            <div className="c-projects-manager__field">
                                <label className="c-projects-manager__label">タグ（カンマ区切り）</label>
                                <input
                                    type="text"
                                    value={(editingPost.tags || []).join(", ")}
                                    onChange={(e) => updateField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                    className="c-projects-manager__input"
                                    placeholder="React, TypeScript, Next.js"
                                />
                            </div>
                        </div>

                        <div className="c-projects-manager__checkboxes">
                            <label className="c-projects-manager__checkbox">
                                <input
                                    type="checkbox"
                                    checked={editingPost.published || false}
                                    onChange={(e) => updateField("published", e.target.checked)}
                                />
                                公開する
                            </label>
                        </div>

                        {/* Preview */}
                        <div className="c-projects-manager__preview">
                            <h4>プレビュー</h4>
                            <div style={{ padding: '16px', border: '2px solid #000', background: '#fff' }}>
                                {editingPost.thumbnail && (
                                    <div style={{ marginBottom: '8px', height: '120px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                        <img
                                            src={editingPost.thumbnail}
                                            alt="サムネイル"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    {editingPost.category && (
                                        <span style={{
                                            background: '#facc15',
                                            color: '#000',
                                            padding: '2px 8px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            border: '1px solid #000'
                                        }}>
                                            {editingPost.category}
                                        </span>
                                    )}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {editingPost.title || "記事タイトル"}
                                    </span>
                                </div>
                                {editingPost.externalUrl && (
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {editingPost.externalUrl}
                                    </div>
                                )}
                                {(editingPost.tags || []).length > 0 && (
                                    <div style={{ marginTop: '4px', display: 'flex', gap: '6px' }}>
                                        {(editingPost.tags || []).map((tag, i) => (
                                            <span key={i} style={{ fontSize: '12px', color: '#888' }}>#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts List */}
            {loading ? (
                <div className="c-blog-manager__loading">記事を読み込み中...</div>
            ) : (
                <div className="c-projects-manager__list">
                    {posts.length === 0 ? (
                        <div className="c-projects-manager__empty">
                            まだ記事が登録されていません
                        </div>
                    ) : (
                        posts.map((post, index) => (
                            <div key={post.id} className="c-projects-manager__item">
                                <div className="c-projects-manager__item-content">
                                    <div className="c-projects-manager__item-info">
                                        <div className="c-projects-manager__item-header">
                                            <div className="c-projects-manager__item-title">
                                                {post.title}
                                                {!post.published && <span className="c-projects-manager__draft-badge">下書き</span>}
                                            </div>
                                            <div className="c-projects-manager__item-category">
                                                {post.category}
                                            </div>
                                        </div>
                                        {post.externalUrl && (
                                            <div className="c-projects-manager__item-description" style={{ fontSize: '13px' }}>
                                                <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                                                    {post.externalUrl}
                                                </a>
                                            </div>
                                        )}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="c-projects-manager__item-technologies">
                                                {post.tags.map((tag, i) => (
                                                    <span key={i} className="c-projects-manager__tech-tag">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="c-projects-manager__item-actions">
                                    <button
                                        onClick={() => movePost(post.id, "up")}
                                        disabled={index === 0}
                                        className="c-projects-manager__move-btn"
                                        title="上に移動"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => movePost(post.id, "down")}
                                        disabled={index === posts.length - 1}
                                        className="c-projects-manager__move-btn"
                                        title="下に移動"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="c-projects-manager__edit-btn"
                                        disabled={editingPost !== null}
                                    >
                                        編集
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
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
            )}
        </div>
    );
};
