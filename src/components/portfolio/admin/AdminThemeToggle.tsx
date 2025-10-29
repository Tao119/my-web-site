"use client";

import { useState, useEffect } from "react";

interface AdminThemeToggleProps {
    showLabel?: boolean;
    className?: string;
}

export const AdminThemeToggle: React.FC<AdminThemeToggleProps> = ({
    showLabel = false,
    className = ""
}) => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    // コンポーネントがマウントされた後にテーマを読み込む
    useEffect(() => {
        setMounted(true);

        // ポートフォリオのテーマ設定を優先的に使用
        const portfolioTheme = localStorage.getItem('portfolio-dark-mode');
        const adminTheme = localStorage.getItem("admin-theme") as "light" | "dark" | null;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

        let initialTheme: "light" | "dark";

        if (portfolioTheme !== null) {
            // ポートフォリオのテーマ設定がある場合はそれを使用
            initialTheme = JSON.parse(portfolioTheme) ? "dark" : "light";
        } else if (adminTheme) {
            // 管理画面のテーマ設定がある場合はそれを使用
            initialTheme = adminTheme;
        } else {
            // どちらもない場合はシステムテーマを使用
            initialTheme = systemTheme;
        }

        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    // システムテーマの変更を監視
    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            const savedTheme = localStorage.getItem("admin-theme");
            if (!savedTheme) {
                const newTheme = e.matches ? "dark" : "light";
                setTheme(newTheme);
                applyTheme(newTheme);
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [mounted]);

    const applyTheme = (newTheme: "light" | "dark") => {
        // ヘッダーと同じテーマ管理システムを使用
        if (newTheme === "dark") {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }

        // 管理画面用のテーマクラスも適用（後方互換性のため）
        const adminContainer = document.querySelector('.admin-container') || document.body;
        const adminElements = document.querySelectorAll('.c-admin-dashboard, .c-admin-login, .c-blog-manager, .c-blog-editor, .c-markdown-editor, .c-admin-settings');

        if (newTheme === "dark") {
            adminContainer.classList.add("admin-dark-theme");
            adminContainer.classList.remove("admin-light-theme");
        } else {
            adminContainer.classList.add("admin-light-theme");
            adminContainer.classList.remove("admin-dark-theme");
        }

        adminElements.forEach(element => {
            if (newTheme === "dark") {
                element.classList.add("admin-dark-theme");
                element.classList.remove("admin-light-theme");
            } else {
                element.classList.add("admin-light-theme");
                element.classList.remove("admin-dark-theme");
            }
        });

        // ポートフォリオのテーマ設定も同期
        localStorage.setItem('portfolio-dark-mode', JSON.stringify(newTheme === 'dark'));
    };

    const toggleTheme = () => {
        if (!mounted) return;

        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        // 両方のテーマ設定を更新
        localStorage.setItem("admin-theme", newTheme);
        localStorage.setItem('portfolio-dark-mode', JSON.stringify(newTheme === 'dark'));

        applyTheme(newTheme);
    };

    // マウント前は何も表示しない（ハイドレーションエラー防止）
    if (!mounted) {
        return (
            <div className={`c-admin-theme-toggle ${className}`}>
                <div className="c-admin-theme-toggle__placeholder">
                    <div className="c-admin-theme-toggle__switch">
                        <div className="c-admin-theme-toggle__slider"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`c-admin-theme-toggle ${className}`}>
            <div className="c-admin-theme-toggle__container">
                {showLabel && (
                    <span className="c-admin-theme-toggle__label">
                        {theme === "light" ? "ライト" : "ダーク"}モード
                    </span>
                )}

                <button
                    onClick={toggleTheme}
                    className={`c-admin-theme-toggle__switch ${theme === "dark" ? "c-admin-theme-toggle__switch--dark" : ""}`}
                    aria-label={`${theme === "light" ? "ダーク" : "ライト"}モードに切り替え`}
                    title={`${theme === "light" ? "ダーク" : "ライト"}モードに切り替え`}
                >
                    <div className="c-admin-theme-toggle__slider">
                        <div className="c-admin-theme-toggle__icon">
                            {theme === "light" ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            )}
                        </div>
                    </div>
                </button>

                {!showLabel && (
                    <span className="c-admin-theme-toggle__tooltip">
                        {theme === "light" ? "ダーク" : "ライト"}モードに切り替え
                    </span>
                )}
            </div>
        </div>
    );
};