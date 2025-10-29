"use client";

import { useState, useEffect } from "react";
import Profile from "@/components/portfolio/Profile";
import { ImageUpload } from "../ImageUpload";

interface ProfileData {
    name: string;
    nameEn: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    avatar: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
        facebook?: string;
        x?: string;
        instagram?: string;
        note?: string;
        qiita?: string;
        zenn?: string;
    };
    education: Array<{
        institution: string;
        degree: string;
        field: string;
        startDate: string;
        endDate?: string;
        description?: string;
        order?: number;
    }>;
    experience: Array<{
        company: string;
        position: string;
        startDate: string;
        endDate?: string;
        description: string;
        technologies: string[];
        order?: number;
    }>;
}

export const ProfileEditor = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "",
        nameEn: "",
        title: "",
        bio: "",
        location: "",
        email: "",
        avatar: "",
        socialLinks: {
            github: "",
            linkedin: "",
            facebook: "",
            x: "",
            instagram: "",
            note: "",
            qiita: "",
            zenn: ""
        },
        education: [],
        experience: []
    });

    const [previewMode, setPreviewMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // データを読み込む
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/admin/profile');
            if (response.ok) {
                const data = await response.json();

                // 新しいデータ構造に対応
                setProfileData({
                    name: data.name || "",
                    nameEn: data.nameEn || "",
                    title: data.title || "",
                    bio: data.bio || "",
                    location: data.location || "",
                    email: data.email || "",
                    avatar: data.avatar || "",
                    socialLinks: data.socialLinks || {},
                    education: (data.education || []).map((edu: any, index: number) => ({
                        ...edu,
                        subjects: edu.subjects || [],
                        order: edu.order !== undefined ? edu.order : index
                    })),
                    experience: (data.experience || []).map((exp: any, index: number) => ({
                        ...exp,
                        technologies: exp.technologies || [],
                        order: exp.order !== undefined ? exp.order : index
                    }))
                });
            } else {
                // データが存在しない場合は空データを設定
                setProfileData({
                    name: "",
                    nameEn: "",
                    title: "",
                    bio: "",
                    location: "",
                    email: "",
                    avatar: "",
                    socialLinks: {},
                    education: [],
                    experience: []
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            // エラーの場合も空データを設定
            setProfileData({
                name: "",
                nameEn: "",
                title: "",
                bio: "",
                location: "",
                email: "",
                avatar: "",
                socialLinks: {},
                education: [],
                experience: []
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof ProfileData, value: any) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSocialLinkChange = (platform: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value
            }
        }));
    };

    const handleAvatarUpload = (url: string) => {
        setProfileData(prev => ({
            ...prev,
            avatar: url
        }));
        setUploadingAvatar(false);
    };

    const handleAvatarUploadError = (error: string) => {
        console.error('Avatar upload error:', error);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
        setUploadingAvatar(false);
    };

    const handleEducationChange = (index: number, field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const handleExperienceChange = (index: number, field: string, value: string | string[]) => {
        setProfileData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const addEducation = () => {
        setProfileData(prev => ({
            ...prev,
            education: [...prev.education, {
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                description: "",
                order: prev.education.length
            }]
        }));
    };

    const addExperience = () => {
        setProfileData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
                technologies: [],
                order: prev.experience.length
            }]
        }));
    };

    const removeEducation = (index: number) => {
        setProfileData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const removeExperience = (index: number) => {
        setProfileData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    // 学歴の順番操作
    const moveEducation = (fromIndex: number, toIndex: number) => {
        setProfileData(prev => {
            const newEducation = [...prev.education];
            const [movedItem] = newEducation.splice(fromIndex, 1);
            newEducation.splice(toIndex, 0, movedItem);

            // order プロパティを更新
            return {
                ...prev,
                education: newEducation.map((edu, index) => ({
                    ...edu,
                    order: index
                }))
            };
        });
    };

    // 職歴の順番操作
    const moveExperience = (fromIndex: number, toIndex: number) => {
        setProfileData(prev => {
            const newExperience = [...prev.experience];
            const [movedItem] = newExperience.splice(fromIndex, 1);
            newExperience.splice(toIndex, 0, movedItem);

            // order プロパティを更新
            return {
                ...prev,
                experience: newExperience.map((exp, index) => ({
                    ...exp,
                    order: index
                }))
            };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: profileData.name,
                    nameEn: profileData.nameEn,
                    title: profileData.title,
                    bio: profileData.bio,
                    location: profileData.location,
                    email: profileData.email,
                    avatar: profileData.avatar,
                    education: profileData.education,
                    experience: profileData.experience,
                    socialLinks: profileData.socialLinks
                })
            });

            if (response.ok) {
                setSaveStatus("success");
                console.log('Profile saved successfully');

                // プロフィール更新イベントを発火
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('profileUpdated', {
                        detail: { profileData }
                    }));
                }

                // データを再読み込み
                await fetchProfileData();

                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                const errorData = await response.json();
                console.error('Save failed:', errorData);
                throw new Error(`Save failed: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            // エラーログを無効化
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="c-profile-editor">
                <div className="c-profile-editor__loading">
                    <div className="c-profile-editor__spinner"></div>
                    <p>プロフィール情報を読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="c-profile-editor">
            <div className="c-profile-editor__header">
                <h2 className="c-profile-editor__title">プロフィール編集</h2>
                <div className="c-profile-editor__controls">
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`c-profile-editor__preview-btn ${previewMode ? "c-profile-editor__preview-btn--active" : ""}`}
                    >
                        {previewMode ? "編集モード" : "プレビューモード"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="c-profile-editor__save-btn"
                    >
                        {saving ? "保存中..." : "保存"}
                    </button>
                </div>
            </div>

            {saveStatus === "success" && (
                <div className="c-profile-editor__status c-profile-editor__status--success">
                    プロフィールを保存しました
                </div>
            )}

            {saveStatus === "error" && (
                <div className="c-profile-editor__status c-profile-editor__status--error">
                    保存に失敗しました
                </div>
            )}

            <div className="c-profile-editor__content">
                {previewMode ? (
                    <div className="c-profile-editor__preview">
                        <Profile />
                    </div>
                ) : (
                    <div className="c-profile-editor__form">
                        {/* Basic Information */}
                        <div className="c-profile-editor__section">
                            <h3 className="c-profile-editor__section-title">基本情報</h3>
                            <div className="c-profile-editor__grid">
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">名前（日本語）</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">名前（英語）</label>
                                    <input
                                        type="text"
                                        value={profileData.nameEn}
                                        onChange={(e) => handleInputChange("nameEn", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">肩書き</label>
                                    <input
                                        type="text"
                                        value={profileData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">所在地</label>
                                    <input
                                        type="text"
                                        value={profileData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">メールアドレス</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">アバター画像</label>
                                    <ImageUpload
                                        folder="profiles"
                                        currentImage={profileData.avatar}
                                        onUploadComplete={handleAvatarUpload}
                                        onUploadError={handleAvatarUploadError}
                                        disabled={uploadingAvatar || saving}
                                        className="c-profile-editor__avatar-upload"
                                    />
                                    <div className="c-profile-editor__field" style={{ marginTop: '16px' }}>
                                        <label className="c-profile-editor__label">または画像URL</label>
                                        <input
                                            type="url"
                                            value={profileData.avatar}
                                            onChange={(e) => handleInputChange("avatar", e.target.value)}
                                            className="c-profile-editor__input"
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="c-profile-editor__field">
                                <label className="c-profile-editor__label">自己紹介</label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => handleInputChange("bio", e.target.value)}
                                    className="c-profile-editor__textarea"
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="c-profile-editor__section">
                            <h3 className="c-profile-editor__section-title">SNSリンク</h3>
                            <div className="c-profile-editor__grid">
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">GitHub</label>
                                    <input
                                        type="url"
                                        value={profileData.socialLinks.github || ""}
                                        onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">LinkedIn</label>
                                    <input
                                        type="url"
                                        value={profileData.socialLinks.linkedin || ""}
                                        onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">X (Twitter)</label>
                                    <input
                                        type="url"
                                        value={profileData.socialLinks.x || ""}
                                        onChange={(e) => handleSocialLinkChange("x", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">Facebook</label>
                                    <input
                                        type="url"
                                        value={profileData.socialLinks.facebook || ""}
                                        onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">Instagram</label>
                                    <input
                                        type="url"
                                        value={profileData.socialLinks.instagram || ""}
                                        onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">Note</label>
                                    <input
                                        type="url"
                                        value={profileData.socialLinks.note || ""}
                                        onChange={(e) => handleSocialLinkChange("note", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">Qiita</label>
                                    <input
                                        type="url"
                                        value={profileData.socialLinks.qiita || ""}
                                        onChange={(e) => handleSocialLinkChange("qiita", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                                <div className="c-profile-editor__field">
                                    <label className="c-profile-editor__label">Zenn</label>
                                    <input
                                        type="url"
                                        value={profileData.socialLinks.zenn || ""}
                                        onChange={(e) => handleSocialLinkChange("zenn", e.target.value)}
                                        className="c-profile-editor__input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="c-profile-editor__section">
                            <div className="c-profile-editor__section-header">
                                <h3 className="c-profile-editor__section-title">学歴</h3>
                                <button onClick={addEducation} className="c-profile-editor__add-btn">
                                    + 追加
                                </button>
                            </div>
                            {profileData.education.map((edu, index) => (
                                <div key={index} className="c-profile-editor__item">
                                    <div className="c-profile-editor__item-header">
                                        <span className="c-profile-editor__item-number">{index + 1}</span>
                                        <div className="c-profile-editor__item-controls">
                                            <button
                                                onClick={() => moveEducation(index, Math.max(0, index - 1))}
                                                disabled={index === 0}
                                                className="c-profile-editor__move-btn"
                                                title="上に移動"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => moveEducation(index, Math.min(profileData.education.length - 1, index + 1))}
                                                disabled={index === profileData.education.length - 1}
                                                className="c-profile-editor__move-btn"
                                                title="下に移動"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => removeEducation(index)}
                                                className="c-profile-editor__remove-btn"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                    <div className="c-profile-editor__grid">
                                        <div className="c-profile-editor__field">
                                            <label className="c-profile-editor__label">学校名</label>
                                            <input
                                                type="text"
                                                value={edu.institution}
                                                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                                                className="c-profile-editor__input"
                                            />
                                        </div>
                                        <div className="c-profile-editor__field">
                                            <label className="c-profile-editor__label">学位</label>
                                            <input
                                                type="text"
                                                value={edu.degree}
                                                onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                                                className="c-profile-editor__input"
                                            />
                                        </div>
                                        <div className="c-profile-editor__field">
                                            <label className="c-profile-editor__label">専攻</label>
                                            <input
                                                type="text"
                                                value={edu.field}
                                                onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                                                className="c-profile-editor__input"
                                            />
                                        </div>
                                        <div className="c-profile-editor__field">
                                            <label className="c-profile-editor__label">開始日</label>
                                            <input
                                                type="month"
                                                value={edu.startDate}
                                                onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                                                className="c-profile-editor__input"
                                            />
                                        </div>
                                        <div className="c-profile-editor__field">
                                            <label className="c-profile-editor__label">終了日</label>
                                            <input
                                                type="month"
                                                value={edu.endDate || ""}
                                                onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                                                className="c-profile-editor__input"
                                            />
                                        </div>
                                    </div>
                                    <div className="c-profile-editor__field">
                                        <label className="c-profile-editor__label">説明</label>
                                        <textarea
                                            value={edu.description || ""}
                                            onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                                            className="c-profile-editor__textarea"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Experience */}
                        <div className="c-profile-editor__section">
                            <div className="c-profile-editor__section-header">
                                <h3 className="c-profile-editor__section-title">職歴</h3>
                                <button onClick={addExperience} className="c-profile-editor__add-btn">
                                    + 追加
                                </button>
                            </div>
                            {profileData.experience.map((exp, index) => (
                                <div key={index} className="c-profile-editor__item">
                                    <div className="c-profile-editor__item-header">
                                        <span className="c-profile-editor__item-number">{index + 1}</span>
                                        <div className="c-profile-editor__item-controls">
                                            <button
                                                onClick={() => moveExperience(index, Math.max(0, index - 1))}
                                                disabled={index === 0}
                                                className="c-profile-editor__move-btn"
                                                title="上に移動"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => moveExperience(index, Math.min(profileData.experience.length - 1, index + 1))}
                                                disabled={index === profileData.experience.length - 1}
                                                className="c-profile-editor__move-btn"
                                                title="下に移動"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => removeExperience(index)}
                                                className="c-profile-editor__remove-btn"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                    <div className="c-profile-editor__grid">
                                        <div className="c-profile-editor__field">
                                            <label className="c-profile-editor__label">会社名</label>
                                            <input
                                                type="text"
                                                value={exp.company}
                                                onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                                                className="c-profile-editor__input"
                                            />
                                        </div>
                                        <div className="c-profile-editor__field">
                                            <label className="c-profile-editor__label">役職</label>
                                            <input
                                                type="text"
                                                value={exp.position}
                                                onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                                                className="c-profile-editor__input"
                                            />
                                        </div>
                                        <div className="c-profile-editor__field">
                                            <label className="c-profile-editor__label">開始日</label>
                                            <input
                                                type="month"
                                                value={exp.startDate}
                                                onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                                                className="c-profile-editor__input"
                                            />
                                        </div>
                                        <div className="c-profile-editor__field">
                                            <label className="c-profile-editor__label">終了日</label>
                                            <input
                                                type="month"
                                                value={exp.endDate || ""}
                                                onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                                                className="c-profile-editor__input"
                                            />
                                        </div>
                                    </div>
                                    <div className="c-profile-editor__field">
                                        <label className="c-profile-editor__label">業務内容</label>
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                                            className="c-profile-editor__textarea"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="c-profile-editor__field">
                                        <label className="c-profile-editor__label">使用技術（カンマ区切り）</label>
                                        <input
                                            type="text"
                                            value={(exp.technologies || []).join(", ")}
                                            onChange={(e) => handleExperienceChange(index, "technologies", e.target.value.split(", ").filter(t => t.trim()))}
                                            className="c-profile-editor__input"
                                            placeholder="React, Node.js, TypeScript"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};