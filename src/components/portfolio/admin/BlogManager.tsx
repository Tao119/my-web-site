"use client";

import { useState, useEffect } from "react";
import { BlogPost, BlogCategory } from "@/types/portfolio";
import { MarkdownEditor } from "./MarkdownEditor";
import { ImageUpload } from "../ImageUpload";

interface BlogManagerProps {
    className?: string;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ className = "" }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Load posts and categories on component mount
    useEffect(() => {
        loadPosts();
        loadCategories();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/blog/posts");
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts || []);
            }
        } catch (error) {
            // エラーログを無効化
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetch("/api/admin/blog/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            // エラーログを無効化
        }
    };

    const handleCreatePost = () => {
        const newPost: Partial<BlogPost> = {
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            thumbnail: "",
            category: "",
            tags: [],
            readTime: 0,
            published: false,
        };
        setSelectedPost(newPost as BlogPost);
        setIsCreating(true);
        setIsEditing(true);
    };

    const handleEditPost = (post: BlogPost) => {
        setSelectedPost(post);
        setIsCreating(false);
        setIsEditing(true);
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm("この記事を削除してもよろしいですか？")) return;

        try {
            const response = await fetch(`/api/admin/blog/posts/${postId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setPosts(posts.filter(post => post.id !== postId));
            } else {
                alert("記事の削除に失敗しました");
            }
        } catch (error) {
            // エラーログを無効化
            alert("記事の削除に失敗しました");
        }
    };

    const handleTogglePublish = async (post: BlogPost) => {
        try {
            const response = await fetch(`/api/admin/blog/posts/${post.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    published: !post.published,
                    publishedAt: !post.published ? new Date().toISOString() : post.publishedAt,
                }),
            });

            if (response.ok) {
                const updatedPost = await response.json();
                setPosts(posts.map(p => p.id === post.id ? updatedPost.post : p));
            } else {
                alert("公開状態の変更に失敗しました");
            }
        } catch (error) {
            // エラーログを無効化
            alert("公開状態の変更に失敗しました");
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "all" || post.category === filterCategory;
        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "published" && post.published) ||
            (filterStatus === "draft" && !post.published);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (isEditing && selectedPost) {
        return (
            <BlogEditor
                post={selectedPost}
                isCreating={isCreating}
                categories={categories}
                onSave={(savedPost) => {
                    if (isCreating) {
                        setPosts([savedPost, ...posts]);
                    } else {
                        setPosts(posts.map(p => p.id === savedPost.id ? savedPost : p));
                    }
                    setIsEditing(false);
                    setSelectedPost(null);
                }}
                onCancel={() => {
                    setIsEditing(false);
                    setSelectedPost(null);
                }}
            />
        );
    }

    return (
        <div className={`c-blog-manager ${className}`}>
            <div className="c-blog-manager__header">
                <h2 className="c-blog-manager__title">ブログ管理</h2>
                <button
                    onClick={handleCreatePost}
                    className="c-blog-manager__create-btn"
                >
                    新しい記事を作成
                </button>
            </div>

            <div className="c-blog-manager__filters">
                <div className="c-blog-manager__search">
                    <input
                        type="text"
                        placeholder="記事を検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="c-blog-manager__search-input"
                    />
                </div>

                <div className="c-blog-manager__filter-group">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="c-blog-manager__filter-select"
                    >
                        <option value="all">すべてのカテゴリ</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.slug}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="c-blog-manager__filter-select"
                    >
                        <option value="all">すべての状態</option>
                        <option value="published">公開済み</option>
                        <option value="draft">下書き</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="c-blog-manager__loading">
                    記事を読み込み中...
                </div>
            ) : (
                <div className="c-blog-manager__list">
                    {filteredPosts.length === 0 ? (
                        <div className="c-blog-manager__empty">
                            記事が見つかりませんでした
                        </div>
                    ) : (
                        filteredPosts.map(post => (
                            <div key={post.id} className="c-blog-manager__item">
                                <div className="c-blog-manager__item-content">
                                    <div className="c-blog-manager__item-header">
                                        <h3 className="c-blog-manager__item-title">{post.title}</h3>
                                        <div className="c-blog-manager__item-meta">
                                            <span className={`c-blog-manager__status ${post.published ? 'c-blog-manager__status--published' : 'c-blog-manager__status--draft'}`}>
                                                {post.published ? '公開済み' : '下書き'}
                                            </span>
                                            <span className="c-blog-manager__category">{post.category}</span>
                                            <span className="c-blog-manager__date">
                                                {new Date(post.updatedAt).toLocaleDateString('ja-JP')}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="c-blog-manager__item-excerpt">{post.excerpt}</p>
                                    <div className="c-blog-manager__item-tags">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="c-blog-manager__tag">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="c-blog-manager__item-actions">
                                    <button
                                        onClick={() => handleEditPost(post)}
                                        className="c-blog-manager__action-btn c-blog-manager__action-btn--edit"
                                    >
                                        編集
                                    </button>
                                    <button
                                        onClick={() => handleTogglePublish(post)}
                                        className={`c-blog-manager__action-btn ${post.published ? 'c-blog-manager__action-btn--unpublish' : 'c-blog-manager__action-btn--publish'}`}
                                    >
                                        {post.published ? '非公開' : '公開'}
                                    </button>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="c-blog-manager__action-btn c-blog-manager__action-btn--delete"
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

// Blog Editor Component
interface BlogEditorProps {
    post: BlogPost;
    isCreating: boolean;
    categories: BlogCategory[];
    onSave: (post: BlogPost) => void;
    onCancel: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
    post,
    isCreating,
    categories,
    onSave,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        thumbnail: post.thumbnail || "",
        category: post.category || "",
        tags: post.tags?.join(", ") || "",
        published: post.published || false,
    });
    const [saving, setSaving] = useState(false);
    const [isDraft, setIsDraft] = useState(false);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim();
    };

    const handleTitleChange = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: isCreating ? generateSlug(title) : prev.slug,
        }));
    };

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };



    const handleSave = async (asDraft = false) => {
        if (!formData.title.trim()) {
            alert("タイトルを入力してください");
            return;
        }

        setSaving(true);
        setIsDraft(asDraft);

        try {
            const postData = {
                ...formData,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
                readTime: calculateReadTime(formData.content),
                published: asDraft ? false : formData.published,
                publishedAt: asDraft ? null : (formData.published ? new Date().toISOString() : null),
            };

            const url = isCreating ? "/api/admin/blog/posts" : `/api/admin/blog/posts/${post.id}`;
            const method = isCreating ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                const result = await response.json();
                onSave(result.post);
            } else {
                const error = await response.json();
                alert(error.message || "保存に失敗しました");
            }
        } catch (error) {
            // エラーログを無効化
            alert("保存に失敗しました");
        } finally {
            setSaving(false);
            setIsDraft(false);
        }
    };

    return (
        <div className="c-blog-editor">
            <div className="c-blog-editor__header">
                <h2 className="c-blog-editor__title">
                    {isCreating ? "新しい記事を作成" : "記事を編集"}
                </h2>
                <div className="c-blog-editor__actions">
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="c-blog-editor__btn c-blog-editor__btn--draft"
                    >
                        {isDraft ? "下書き保存中..." : "下書き保存"}
                    </button>
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="c-blog-editor__btn c-blog-editor__btn--save"
                    >
                        {saving && !isDraft ? "保存中..." : "保存"}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={saving}
                        className="c-blog-editor__btn c-blog-editor__btn--cancel"
                    >
                        キャンセル
                    </button>
                </div>
            </div>

            <div className="c-blog-editor__form">
                <div className="c-blog-editor__row">
                    <div className="c-blog-editor__field">
                        <label className="c-blog-editor__label">タイトル</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="c-blog-editor__input"
                            placeholder="記事のタイトルを入力..."
                        />
                    </div>
                </div>

                <div className="c-blog-editor__row">
                    <div className="c-blog-editor__field">
                        <label className="c-blog-editor__label">スラッグ</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            className="c-blog-editor__input"
                            placeholder="url-slug"
                        />
                    </div>
                </div>

                <div className="c-blog-editor__row c-blog-editor__row--two-cols">
                    <div className="c-blog-editor__field">
                        <label className="c-blog-editor__label">カテゴリ</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="c-blog-editor__select"
                        >
                            <option value="">カテゴリを選択</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="c-blog-editor__field">
                        <label className="c-blog-editor__label">タグ (カンマ区切り)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                            className="c-blog-editor__input"
                            placeholder="React, TypeScript, Next.js"
                        />
                    </div>
                </div>

                <div className="c-blog-editor__row">
                    <div className="c-blog-editor__field">
                        <label className="c-blog-editor__label">概要</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            className="c-blog-editor__textarea c-blog-editor__textarea--small"
                            placeholder="記事の概要を入力..."
                            rows={3}
                        />
                    </div>
                </div>

                <div className="c-blog-editor__row">
                    <div className="c-blog-editor__field">
                        <label className="c-blog-editor__label">サムネイル画像</label>
                        <ImageUpload
                            folder="blog"
                            currentImage={formData.thumbnail}
                            onUploadComplete={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))}
                            onUploadError={(error) => console.error('Thumbnail upload error:', error)}
                            className="c-blog-editor__image-upload"
                        />
                        <div className="c-blog-editor__field" style={{ marginTop: '16px' }}>
                            <label className="c-blog-editor__label">または画像URL</label>
                            <input
                                type="url"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                                className="c-blog-editor__input"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>
                </div>

                <div className="c-blog-editor__row">
                    <div className="c-blog-editor__field">
                        <label className="c-blog-editor__label">本文 (Markdown)</label>
                        <MarkdownEditor
                            value={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                            placeholder="Markdownで記事の本文を入力..."
                        />
                    </div>
                </div>

                <div className="c-blog-editor__row">
                    <div className="c-blog-editor__field">
                        <label className="c-blog-editor__checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.published}
                                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                                className="c-blog-editor__checkbox"
                            />
                            公開する
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};