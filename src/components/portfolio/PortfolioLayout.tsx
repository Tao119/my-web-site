"use client";

import { useEffect } from "react";
import ResponsiveNavigation from "./ResponsiveNavigation";
import { usePortfolioTheme } from "@/hooks/usePortfolioTheme";
import { SkipLink } from "./AccessibilityUtils";
import { PerformanceMonitor } from "./PerformanceMonitor";

interface PortfolioLayoutProps {
    children: React.ReactNode;
}

const PortfolioLayout = ({ children }: PortfolioLayoutProps) => {
    const { isDarkMode, toggleDarkMode } = usePortfolioTheme();

    // Apply portfolio styles to document
    useEffect(() => {
        // Add portfolio page class to body
        document.body.classList.add('portfolio-page');

        // Cleanup function to remove portfolio class when component unmounts
        return () => {
            document.body.classList.remove('portfolio-page');
        };
    }, []);

    return (
        <div className={`neo-portfolio ${isDarkMode ? 'neo-portfolio--dark' : 'neo-portfolio--light'}`}>
            {/* Skip Links for Accessibility */}
            <SkipLink href="#main-content">メインコンテンツにスキップ</SkipLink>
            <SkipLink href="#navigation">ナビゲーションにスキップ</SkipLink>

            {/* Navigation Header */}
            <ResponsiveNavigation
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
            />

            {/* Main Content */}
            <main id="main-content" className="neo-portfolio__main" role="main">
                {children}
            </main>

            {/* Footer */}
            <footer className="neo-portfolio__footer" role="contentinfo">
                <div className="neo-portfolio__footer-container">
                    <div className="neo-portfolio__footer-content">
                        <section className="neo-portfolio__footer-section">
                            <h3 className="neo-portfolio__footer-title">Tao Matsumura</h3>
                            <p className="neo-portfolio__footer-description">
                                Full-stack Developer & Unity Engineer
                            </p>
                        </section>

                        <nav className="neo-portfolio__footer-section" aria-labelledby="footer-nav-title">
                            <h4 id="footer-nav-title" className="neo-portfolio__footer-subtitle">Quick Links</h4>
                            <ul className="neo-portfolio__footer-links">
                                <li><a href="#profile" className="neo-portfolio__footer-link">Profile</a></li>
                                <li><a href="#skills" className="neo-portfolio__footer-link">Skills</a></li>
                                <li><a href="#projects" className="neo-portfolio__footer-link">Projects</a></li>
                                <li><a href="#contact" className="neo-portfolio__footer-link">Contact</a></li>
                            </ul>
                        </nav>

                        <section className="neo-portfolio__footer-section" aria-labelledby="social-links-title">
                            <h4 id="social-links-title" className="neo-portfolio__footer-subtitle">Connect</h4>
                            <div className="neo-portfolio__footer-social" role="list">
                                <a
                                    href="https://github.com/Tao119"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="neo-portfolio__footer-social-link"
                                    aria-label="GitHub プロフィールを新しいタブで開く"
                                    role="listitem"
                                >
                                    GitHub
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="neo-portfolio__footer-social-link"
                                    aria-label="LinkedIn プロフィールを新しいタブで開く"
                                    role="listitem"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="https://x.com/tao_matsumr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="neo-portfolio__footer-social-link"
                                    aria-label="X (Twitter) プロフィールを新しいタブで開く"
                                    role="listitem"
                                >
                                    X
                                </a>
                            </div>
                        </section>
                    </div>

                    <div className="neo-portfolio__footer-bottom">
                        <p className="neo-portfolio__footer-copyright">
                            © 2024 Tao Matsumura. All rights reserved.
                        </p>
                        <p className="neo-portfolio__footer-built">
                            Built with Next.js & Neobrutalism Design
                        </p>
                    </div>
                </div>
            </footer>

            {/* パフォーマンスモニター（開発環境 + 特定条件でのみ表示） */}
            {process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_PERFORMANCE_MONITOR === 'true' && (
                <PerformanceMonitor
                    enableConsoleLogging={true}
                    enableVisualIndicator={false}
                />
            )}
        </div>
    );
};

export default PortfolioLayout;