"use client";

import { useState, useEffect } from "react";

interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    years: number;
    icon: string;
    description: string;
    order: number;
}

const skillCategories = [
    { id: "language", label: "プログラミング言語", color: "#3b82f6" },
    { id: "frontend", label: "フロントエンド", color: "#06b6d4" },
    { id: "backend", label: "バックエンド", color: "#10b981" },
    { id: "mobile", label: "モバイル", color: "#f59e0b" },
    { id: "database", label: "データベース", color: "#ef4444" },
    { id: "infrastructure", label: "インフラ・DevOps", color: "#8b5cf6" },
    { id: "ai", label: "AI・機械学習", color: "#ec4899" },
    { id: "unity", label: "Unity・ゲーム", color: "#7c3aed" },
    { id: "design", label: "デザイン・クリエイティブ", color: "#f97316" },
    { id: "management", label: "マネジメント・その他", color: "#6b7280" },
];

export const SkillsManager = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [initializing, setInitializing] = useState(false);
    const [initStatus, setInitStatus] = useState<"idle" | "success" | "error">("idle");

    // データ読み込み
    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/skills');
            if (response.ok) {
                const data = await response.json();
                const sortedSkills = (data.skills || []).sort((a: Skill, b: Skill) => {
                    if (a.order !== undefined && b.order !== undefined) {
                        return a.order - b.order;
                    }
                    // orderが設定されていない場合はlevelの降順
                    return (b.level || 0) - (a.level || 0);
                });
                setSkills(sortedSkills);
            }
        } catch (error) {
            console.error('Failed to load skills:', error);
        } finally {
            setLoading(false);
        }
    };

    // スキルデータベース初期化
    const initializeSkills = async () => {
        if (!confirm('スキルデータベースを初期化しますか？既存のデータがある場合は上書きされません。')) {
            return;
        }

        try {
            setInitializing(true);
            setInitStatus("idle");

            const response = await fetch('/api/admin/skills/initialize', {
                method: 'POST'
            });

            if (response.ok) {
                const data = await response.json();
                setInitStatus("success");
                console.log('Skills initialized:', data);

                // データを再読み込み
                await loadSkills();

                alert(`スキルデータベースの初期化が完了しました。\n成功: ${data.success}件\n失敗: ${data.failures}件`);
            } else {
                const errorData = await response.json();
                setInitStatus("error");
                alert(`初期化に失敗しました: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Failed to initialize skills:', error);
            setInitStatus("error");
            alert('初期化中にエラーが発生しました');
        } finally {
            setInitializing(false);
        }
    };

    // スキルデータベースクリア
    const clearSkills = async () => {
        if (!confirm('すべてのスキルデータを削除しますか？この操作は取り消せません。')) {
            return;
        }

        try {
            setInitializing(true);

            const response = await fetch('/api/admin/skills/clear', {
                method: 'DELETE'
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Skills cleared:', data);

                // データを再読み込み
                await loadSkills();

                alert(`スキルデータをクリアしました。削除件数: ${data.deletedCount}件`);
            } else {
                const errorData = await response.json();
                alert(`クリアに失敗しました: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Failed to clear skills:', error);
            alert('クリア中にエラーが発生しました');
        } finally {
            setInitializing(false);
        }
    };

    const newSkillTemplate: Omit<Skill, "id"> = {
        name: "",
        category: "language",
        level: 50,
        years: 1,
        icon: "🔧",
        description: "",
        order: skills.length + 1
    };

    const filteredSkills = selectedCategory === "all"
        ? skills
        : skills.filter(skill => skill.category === selectedCategory);

    const generateId = (name: string) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20) || `skill_${Date.now()}`;
    };

    const handleAddNew = () => {
        // 新しいスキルのorderは現在のスキル数+1
        const newOrder = skills.length + 1;
        setEditingSkill({
            ...newSkillTemplate,
            id: `skill_${Date.now()}`,
            order: newOrder
        });
        setIsAddingNew(true);
    };

    const handleEdit = (skill: Skill) => {
        setEditingSkill({ ...skill });
        setIsAddingNew(false);
    };

    const handleSave = async () => {
        if (!editingSkill) return;

        setSaving(true);
        try {
            if (isAddingNew) {
                // 新規追加
                const response = await fetch('/api/admin/skills', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editingSkill)
                });

                if (response.ok) {
                    const data = await response.json();
                    setSkills(prev => [...prev, { ...editingSkill, id: data.id }]);
                } else {
                    throw new Error('Failed to create skill');
                }
            } else {
                // 更新
                const response = await fetch(`/api/admin/skills/${editingSkill.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editingSkill)
                });

                if (response.ok) {
                    setSkills(prev => prev.map(skill =>
                        skill.id === editingSkill.id ? editingSkill : skill
                    ));
                } else {
                    throw new Error('Failed to update skill');
                }
            }

            setEditingSkill(null);
            setIsAddingNew(false);
            setSaveStatus("success");

            // スキル更新イベントを発火
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('skillsUpdated'));
            }

            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (skillId: string) => {
        if (!confirm("このスキルを削除しますか？")) return;

        setSaving(true);
        try {
            const response = await fetch(`/api/admin/skills/${skillId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setSkills(prev => prev.filter(skill => skill.id !== skillId));
                setSaveStatus("success");
            } else {
                throw new Error('Failed to delete skill');
            }

            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (error) {
            console.error('Delete error:', error);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditingSkill(null);
        setIsAddingNew(false);
    };

    const updateEditingSkill = (field: keyof Skill, value: any) => {
        if (!editingSkill) return;
        setEditingSkill(prev => prev ? { ...prev, [field]: value } : null);
    };

    const moveSkill = (skillId: string, direction: "up" | "down") => {
        const skillIndex = skills.findIndex(s => s.id === skillId);
        if (skillIndex === -1) return;

        const newSkills = [...skills];
        const targetIndex = direction === "up" ? skillIndex - 1 : skillIndex + 1;

        if (targetIndex < 0 || targetIndex >= newSkills.length) return;

        [newSkills[skillIndex], newSkills[targetIndex]] = [newSkills[targetIndex], newSkills[skillIndex]];

        // Update order values
        newSkills.forEach((skill, index) => {
            skill.order = index + 1;
        });

        setSkills(newSkills);
    };

    return (
        <div className="c-skills-manager">
            <div className="c-skills-manager__header">
                <h2 className="c-skills-manager__title">スキル管理</h2>
                <div className="c-skills-manager__actions">
                    <button
                        onClick={clearSkills}
                        className="c-skills-manager__clear-btn"
                        disabled={initializing || editingSkill !== null}
                    >
                        {initializing ? '処理中...' : 'スキル全削除'}
                    </button>
                    <button
                        onClick={initializeSkills}
                        className="c-skills-manager__init-btn"
                        disabled={initializing || editingSkill !== null}
                    >
                        {initializing ? '初期化中...' : 'スキルDB初期化'}
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="c-skills-manager__add-btn"
                        disabled={editingSkill !== null}
                    >
                        + 新しいスキル追加
                    </button>
                </div>
            </div>

            {saveStatus === "success" && (
                <div className="c-skills-manager__status c-skills-manager__status--success">
                    スキル情報を保存しました
                </div>
            )}

            {saveStatus === "error" && (
                <div className="c-skills-manager__status c-skills-manager__status--error">
                    保存に失敗しました
                </div>
            )}

            <div className="c-skills-manager__filters">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`c-skills-manager__filter ${selectedCategory === "all" ? "c-skills-manager__filter--active" : ""}`}
                >
                    すべて ({skills.length})
                </button>
                {skillCategories.map(category => {
                    const count = skills.filter(s => s.category === category.id).length;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`c-skills-manager__filter ${selectedCategory === category.id ? "c-skills-manager__filter--active" : ""}`}
                            style={{ borderColor: category.color }}
                        >
                            {category.label} ({count})
                        </button>
                    );
                })}
            </div>

            <div className="c-skills-manager__content">
                {editingSkill && (
                    <div className="c-skills-manager__editor">
                        <div className="c-skills-manager__editor-header">
                            <h3>{isAddingNew ? "新しいスキル追加" : "スキル編集"}</h3>
                            <div className="c-skills-manager__editor-actions">
                                <button
                                    onClick={handleCancel}
                                    className="c-skills-manager__cancel-btn"
                                    disabled={saving}
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="c-skills-manager__save-btn"
                                    disabled={saving || !editingSkill.name.trim()}
                                >
                                    {saving ? "保存中..." : "保存"}
                                </button>
                            </div>
                        </div>

                        <div className="c-skills-manager__editor-form">
                            <div className="c-skills-manager__form-grid">
                                <div className="c-skills-manager__field">
                                    <label className="c-skills-manager__label">スキル名</label>
                                    <input
                                        type="text"
                                        value={editingSkill.name}
                                        onChange={(e) => updateEditingSkill("name", e.target.value)}
                                        className="c-skills-manager__input"
                                        placeholder="例: React"
                                    />
                                </div>

                                <div className="c-skills-manager__field">
                                    <label className="c-skills-manager__label">カテゴリ</label>
                                    <select
                                        value={editingSkill.category}
                                        onChange={(e) => updateEditingSkill("category", e.target.value)}
                                        className="c-skills-manager__select"
                                    >
                                        {skillCategories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="c-skills-manager__field">
                                    <label className="c-skills-manager__label">
                                        スキルレベル ({editingSkill.level}%)
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={editingSkill.level}
                                        onChange={(e) => updateEditingSkill("level", parseInt(e.target.value))}
                                        className="c-skills-manager__range"
                                    />
                                </div>

                                <div className="c-skills-manager__field">
                                    <label className="c-skills-manager__label">経験年数</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        step="0.5"
                                        value={editingSkill.years}
                                        onChange={(e) => updateEditingSkill("years", parseFloat(e.target.value))}
                                        className="c-skills-manager__input"
                                    />
                                </div>

                                <div className="c-skills-manager__field">
                                    <label className="c-skills-manager__label">アイコン</label>
                                    <input
                                        type="text"
                                        value={editingSkill.icon}
                                        onChange={(e) => updateEditingSkill("icon", e.target.value)}
                                        className="c-skills-manager__input"
                                        placeholder="絵文字またはアイコン"
                                    />
                                </div>
                            </div>

                            <div className="c-skills-manager__field">
                                <label className="c-skills-manager__label">説明</label>
                                <textarea
                                    value={editingSkill.description}
                                    onChange={(e) => updateEditingSkill("description", e.target.value)}
                                    className="c-skills-manager__textarea"
                                    rows={3}
                                    placeholder="このスキルの詳細説明"
                                />
                            </div>

                            <div className="c-skills-manager__preview">
                                <h4>プレビュー</h4>
                                <div className="c-skills-manager__skill-preview">
                                    <div className="c-skills-manager__skill-icon">{editingSkill.icon}</div>
                                    <div className="c-skills-manager__skill-info">
                                        <div className="c-skills-manager__skill-name">{editingSkill.name || "スキル名"}</div>
                                        <div className="c-skills-manager__skill-meta">
                                            {editingSkill.years}年 • {editingSkill.level}%
                                        </div>
                                        <div className="c-skills-manager__skill-progress">
                                            <div
                                                className="c-skills-manager__skill-progress-bar"
                                                style={{ width: `${editingSkill.level}%` }}
                                            />
                                        </div>
                                        {editingSkill.description && (
                                            <div className="c-skills-manager__skill-desc">{editingSkill.description}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="c-skills-manager__list">
                    {filteredSkills.length === 0 ? (
                        <div className="c-skills-manager__empty">
                            {selectedCategory === "all"
                                ? "まだスキルが登録されていません"
                                : "このカテゴリにはスキルがありません"
                            }
                        </div>
                    ) : (
                        filteredSkills.map((skill, index) => (
                            <div key={skill.id} className="c-skills-manager__item">
                                <div className="c-skills-manager__item-content">
                                    <div className="c-skills-manager__item-icon">{skill.icon}</div>
                                    <div className="c-skills-manager__item-info">
                                        <div className="c-skills-manager__item-name">{skill.name}</div>
                                        <div className="c-skills-manager__item-category">
                                            {skillCategories.find(c => c.id === skill.category)?.label}
                                        </div>
                                        <div className="c-skills-manager__item-meta">
                                            {skill.years}年経験 • レベル {skill.level}%
                                        </div>
                                        {skill.description && (
                                            <div className="c-skills-manager__item-desc">{skill.description}</div>
                                        )}
                                    </div>
                                    <div className="c-skills-manager__item-progress">
                                        <div
                                            className="c-skills-manager__item-progress-bar"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="c-skills-manager__item-actions">
                                    <button
                                        onClick={() => moveSkill(skill.id, "up")}
                                        disabled={index === 0}
                                        className="c-skills-manager__move-btn"
                                        title="上に移動"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveSkill(skill.id, "down")}
                                        disabled={index === filteredSkills.length - 1}
                                        className="c-skills-manager__move-btn"
                                        title="下に移動"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => handleEdit(skill)}
                                        className="c-skills-manager__edit-btn"
                                        disabled={editingSkill !== null}
                                    >
                                        編集
                                    </button>
                                    <button
                                        onClick={() => handleDelete(skill.id)}
                                        className="c-skills-manager__delete-btn"
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