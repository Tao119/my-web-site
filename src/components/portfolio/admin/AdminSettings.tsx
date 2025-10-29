"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";


export const AdminSettings = () => {
    const { changePassword, session } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({
        type: "idle",
        message: ""
    });

    const adminEmail = session?.email || "tao.dama.art@gmail.com";

    const formatDate = (dateString?: string) => {
        if (!dateString) return '不明';
        return new Date(dateString).toLocaleString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setStatus({
                type: "error",
                message: "新しいパスワードと確認パスワードが一致しません"
            });
            return;
        }

        if (newPassword.length < 6) {
            setStatus({
                type: "error",
                message: "パスワードは6文字以上である必要があります"
            });
            return;
        }

        setSaving(true);
        setStatus({ type: "idle", message: "" });

        try {
            const result = await changePassword(currentPassword, newPassword);

            if (result.success) {
                setStatus({
                    type: "success",
                    message: result.message || "パスワードが正常に変更されました"
                });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setStatus({
                    type: "error",
                    message: result.error || "パスワードの変更に失敗しました"
                });
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: "パスワードの変更に失敗しました"
            });
        } finally {
            setSaving(false);
            setTimeout(() => setStatus({ type: "idle", message: "" }), 5000);
        }
    };

    return (
        <div className="c-admin-settings">
            <div className="c-admin-settings__header">
                <h2 className="c-admin-settings__title">管理者設定</h2>
            </div>

            {status.type !== "idle" && (
                <div className={`c-admin-settings__status c-admin-settings__status--${status.type}`}>
                    {status.message}
                </div>
            )}

            <div className="c-admin-settings__content">
                {/* Theme Settings */}
                <div className="c-admin-settings__section">
                    <h3 className="c-admin-settings__section-title">表示設定</h3>
                    <div className="c-admin-settings__theme-card">
                        <div className="c-admin-settings__theme-item">
                            <div className="c-admin-settings__theme-info">
                                <label className="c-admin-settings__theme-label">テーマ</label>
                                <div className="c-admin-settings__theme-description">
                                    テーマの切り替えは、ポートフォリオページのヘッダーから行えます
                                </div>
                            </div>
                            <div className="c-admin-settings__theme-note">
                                <p>💡 ヒント: ポートフォリオページ（<a href="/portfolio" target="_blank" rel="noopener noreferrer">/portfolio</a>）のヘッダーにあるテーマトグルボタンで、サイト全体のテーマを切り替えることができます。</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="c-admin-settings__section">
                    <h3 className="c-admin-settings__section-title">アカウント情報</h3>
                    <div className="c-admin-settings__info-card">
                        <div className="c-admin-settings__info-item">
                            <label className="c-admin-settings__info-label">管理者メールアドレス</label>
                            <div className="c-admin-settings__info-value">
                                {adminEmail}
                                <span className="c-admin-settings__info-note">
                                    パスワードリセット用メールアドレス
                                </span>
                            </div>
                        </div>
                        <div className="c-admin-settings__info-item">
                            <label className="c-admin-settings__info-label">ログイン日時</label>
                            <div className="c-admin-settings__info-value">
                                {formatDate(session?.createdAt)}
                                <span className="c-admin-settings__info-note">
                                    最後にログインした日時
                                </span>
                            </div>
                        </div>
                        <div className="c-admin-settings__info-item">
                            <label className="c-admin-settings__info-label">セッション有効期限</label>
                            <div className="c-admin-settings__info-value">
                                {formatDate(session?.expiresAt)}
                                <span className="c-admin-settings__info-note">
                                    自動ログアウト予定日時
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Change */}
                <div className="c-admin-settings__section">
                    <h3 className="c-admin-settings__section-title">パスワード変更</h3>
                    <form onSubmit={handlePasswordChange} className="c-admin-settings__form">
                        <div className="c-admin-settings__field">
                            <label htmlFor="currentPassword" className="c-admin-settings__label">
                                現在のパスワード
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="c-admin-settings__input"
                                required
                                disabled={saving}
                                placeholder="現在のパスワードを入力"
                            />
                        </div>

                        <div className="c-admin-settings__field">
                            <label htmlFor="newPassword" className="c-admin-settings__label">
                                新しいパスワード
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="c-admin-settings__input"
                                required
                                disabled={saving}
                                placeholder="新しいパスワードを入力（6文字以上）"
                                minLength={6}
                            />
                        </div>

                        <div className="c-admin-settings__field">
                            <label htmlFor="confirmPassword" className="c-admin-settings__label">
                                新しいパスワード（確認）
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="c-admin-settings__input"
                                required
                                disabled={saving}
                                placeholder="新しいパスワードを再入力"
                                minLength={6}
                            />
                        </div>

                        <div className="c-admin-settings__form-actions">
                            <button
                                type="submit"
                                className="c-admin-settings__submit-btn"
                                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                            >
                                {saving ? "変更中..." : "パスワードを変更"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Information */}
                <div className="c-admin-settings__section">
                    <h3 className="c-admin-settings__section-title">セキュリティ情報</h3>
                    <div className="c-admin-settings__security-info">
                        <div className="c-admin-settings__security-item">
                            <div className="c-admin-settings__security-icon">🔒</div>
                            <div className="c-admin-settings__security-content">
                                <h4>パスワード要件</h4>
                                <p>パスワードは6文字以上で設定してください。より強固なパスワードを推奨します。</p>
                            </div>
                        </div>
                        <div className="c-admin-settings__security-item">
                            <div className="c-admin-settings__security-icon">⏰</div>
                            <div className="c-admin-settings__security-content">
                                <h4>自動ログアウト</h4>
                                <p>セキュリティのため、7日間操作がない場合は自動的にログアウトされます。</p>
                            </div>
                        </div>
                        <div className="c-admin-settings__security-item">
                            <div className="c-admin-settings__security-icon">🛡️</div>
                            <div className="c-admin-settings__security-content">
                                <h4>セッション管理</h4>
                                <p>ログイン状態は安全に暗号化されたクッキーで管理されています。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};