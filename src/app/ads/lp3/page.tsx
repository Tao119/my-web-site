'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../lp/lp.css';

export default function LP3Page() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePurchase = () => {
        router.push('/ads/cv3');
    };

    return (
        <div className="lp-container">
            <div className="fixed-cta-mobile">
                <button className="fixed-cta-button" onClick={handlePurchase}>
                    30日間無料で始める
                </button>
            </div>

            <header className="lp-header">
                <div className="header-content">
                    <div className="header-badge">期間限定</div>
                    <h1 className={`header-title ${isVisible ? 'fade-in' : ''}`}>
                        💪 フィットネスアプリ
                    </h1>
                    <p className="lp-subtitle">自宅で本格トレーニング。プロ監修の動画見放題</p>
                </div>
            </header>

            <section className="lp-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h2 className="hero-title">理想のボディを手に入れよう</h2>
                    <p className="hero-description">
                        プロトレーナー監修の1000本以上の動画で<br className="pc-only" />
                        あなたの目標達成をサポート
                    </p>
                    <div className="price-tag">
                        <div className="price-row">
                            <span className="original-price">通常価格 ¥1,980/月</span>
                            <span className="discount-badge">30日無料</span>
                        </div>
                        <span className="special-price">初回30日 ¥0</span>
                        <span className="price-note">※31日目以降 ¥1,980/月</span>
                    </div>
                    <button className="hero-cta-button" onClick={handlePurchase}>
                        30日間無料で始める
                        <span className="button-arrow">→</span>
                    </button>
                    <p className="hero-guarantee">クレジットカード登録不要 / いつでも解約OK</p>
                </div>
            </section>

            <section className="lp-features">
                <div className="section-container">
                    <div className="section-header">
                        <h3>選ばれる3つの理由</h3>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🎥</div>
                            </div>
                            <h4>1000本以上の動画</h4>
                            <p>ヨガ、筋トレ、ダンス、ストレッチなど多彩なプログラムが見放題</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📱</div>
                            </div>
                            <h4>いつでもどこでも</h4>
                            <p>スマホ、タブレット、PCで視聴可能。自宅でもジムでも</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📊</div>
                            </div>
                            <h4>進捗管理機能</h4>
                            <p>トレーニング記録を自動保存。モチベーション維持をサポート</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-cta">
                <div className="cta-content">
                    <h3 className="cta-title">今だけ！30日間完全無料</h3>
                    <div className="cta-price-box">
                        <div className="cta-price-row">
                            <span className="cta-original">月額1,980円</span>
                            <span className="cta-arrow">→</span>
                            <span className="cta-special">0円</span>
                        </div>
                        <p className="cta-savings">30日間無料でお試し！</p>
                    </div>
                    <button className="cta-button" onClick={handlePurchase}>
                        <span className="button-text">今すぐ無料で始める</span>
                        <span className="button-subtext">クレジットカード不要</span>
                    </button>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="footer-content">
                    <button className="footer-cta-button" onClick={handlePurchase}>
                        30日間無料で始める
                    </button>
                    <p className="footer-note">© 2024 Fitness App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
