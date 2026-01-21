'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../lp/lp.css';

export default function LP5Page() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePurchase = () => {
        router.push('/ads/cv5');
    };

    return (
        <div className="lp-container">
            <div className="fixed-cta-mobile">
                <button className="fixed-cta-button" onClick={handlePurchase}>
                    初回60%OFF で申し込む
                </button>
            </div>

            <header className="lp-header">
                <div className="header-content">
                    <div className="header-badge">期間限定</div>
                    <h1 className={`header-title ${isVisible ? 'fade-in' : ''}`}>
                        🥬 オーガニック野菜宅配
                    </h1>
                    <p className="lp-subtitle">農家直送の新鮮野菜を毎週お届け</p>
                </div>
            </header>

            <section className="lp-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h2 className="hero-title">安心・安全な野菜を食卓に</h2>
                    <p className="hero-description">
                        農薬不使用・化学肥料不使用の<br className="pc-only" />
                        オーガニック野菜を農家から直送
                    </p>
                    <div className="price-tag">
                        <div className="price-row">
                            <span className="original-price">通常価格 ¥3,980</span>
                            <span className="discount-badge">60% OFF</span>
                        </div>
                        <span className="special-price">初回限定 ¥1,580</span>
                        <span className="price-note">※2回目以降 ¥2,980</span>
                    </div>
                    <button className="hero-cta-button" onClick={handlePurchase}>
                        今すぐ申し込む
                        <span className="button-arrow">→</span>
                    </button>
                    <p className="hero-guarantee">送料無料 / いつでも解約OK</p>
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
                                <div className="feature-icon">🌱</div>
                            </div>
                            <h4>100%オーガニック</h4>
                            <p>農薬・化学肥料不使用。有機JAS認証取得農家から直送</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🚚</div>
                            </div>
                            <h4>農家直送</h4>
                            <p>収穫後24時間以内に発送。新鮮な状態でお届け</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📦</div>
                            </div>
                            <h4>季節の野菜セット</h4>
                            <p>旬の野菜8〜10品目を厳選。レシピ付きで届く</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-cta">
                <div className="cta-content">
                    <h3 className="cta-title">今だけ！初回限定60%OFF</h3>
                    <div className="cta-price-box">
                        <div className="cta-price-row">
                            <span className="cta-original">3,980円</span>
                            <span className="cta-arrow">→</span>
                            <span className="cta-special">1,580円</span>
                        </div>
                        <p className="cta-savings">2,400円もお得！</p>
                    </div>
                    <button className="cta-button" onClick={handlePurchase}>
                        <span className="button-text">今すぐ申し込む</span>
                        <span className="button-subtext">初回60%OFF適用</span>
                    </button>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="footer-content">
                    <button className="footer-cta-button" onClick={handlePurchase}>
                        初回限定60%OFFで申し込む
                    </button>
                    <p className="footer-note">© 2024 Organic Vegetable Delivery. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
