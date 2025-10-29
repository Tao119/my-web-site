"use client";

import { useEffect } from "react";
import ResponsiveNavigation from "../ResponsiveNavigation";
import { usePortfolioTheme } from "@/hooks/usePortfolioTheme";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { isDarkMode, toggleDarkMode } = usePortfolioTheme();

    useEffect(() => {
        // 管理画面のテーマコンテナクラスを適用
        document.body.classList.add('admin-container');

        // ポートフォリオのテーマ設定を管理画面にも適用
        if (isDarkMode) {
            document.body.classList.add('admin-dark-theme');
            document.body.classList.remove('admin-light-theme');
        } else {
            document.body.classList.add('admin-light-theme');
            document.body.classList.remove('admin-dark-theme');
        }

        return () => {
            document.body.classList.remove('admin-container', 'admin-dark-theme', 'admin-light-theme');
        };
    }, [isDarkMode]);

    return (
        <div className={`admin-layout ${isDarkMode ? 'admin-layout--dark' : 'admin-layout--light'}`}>
            {/* ヘッダーナビゲーション */}
            <ResponsiveNavigation
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
            />

            {/* 管理画面コンテンツ */}
            <main className="admin-layout__main">
                {children}
            </main>
        </div>
    );
};