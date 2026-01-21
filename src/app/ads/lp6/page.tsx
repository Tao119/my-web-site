'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../lp/lp.css';

export default function LP6Page() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePurchase = () => {
        router.push('/ads/cv6');
    };

    return (
        <div className="lp-container">
            <div className="fixed-cta-mobile">
                <button className="fixed-cta-button" onClick={handlePurchase}>
                    初回55%OFF で申し込む
                </button>
            </div>

            <header className="lp-header">
                <div className="header-content">
                    <div className="header-badge">期間限定</div>
                    <h1 className={`header-title ${isVisible ? 'fade-in' : ''}`}>
                        🧘 ヨガアイテムセット
                    </h1>
                    <p className="lp-subtitle">プロ推奨の高品質ヨガグッズで快適なヨガライフを</p>
                </div>
            </header>

            <section className="lp-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h2 className="hero-title">心と体を整える最高のヨガ体験</h2>
                    <p className="hero-description">
                        ヨガインストラクター推奨の<br className="pc-only" />
                        プレミアムヨガマット・ブロック・ストラップの3点セット
                    </p>
                    <div className="price-tag">
                        <div className="price-row">
                            <span className="original-price">通常価格 ¥18,800</span>
                            <span className="discount-badge">55% OFF</span>
                        </div>
                        <span className="special-price">初回限定 ¥8,460</span>
                        <span className="price-note">※送料無料・30日間返品保証</span>
                    </div>
                    <button className="hero-cta-button" onClick={handlePurchase}>
                        今すぐ購入する
                        <span className="button-arrow">→</span>
                    </button>
                    <p className="hero-guarantee">30日間返品保証 / 送料無料</p>
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
                                <div className="feature-icon">✨</div>
                            </div>
                            <h4>プロ推奨品質</h4>
                            <p>ヨガインストラクター100名が推奨。滑りにくく、クッション性抜群のマット</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🌿</div>
                            </div>
                            <h4>エコ素材使用</h4>
                            <p>環境に優しいTPE素材。無毒・無臭で安心して使用できます</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📦</div>
                            </div>
                            <h4>充実の3点セット</h4>
                            <p>マット・ブロック・ストラップがセット。初心者から上級者まで対応</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-cta">
                <div className="cta-content">
                    <h3 className="cta-title">今だけ！初回限定55%OFF</h3>
                    <div className="cta-price-box">
                        <div className="cta-price-row">
                            <span className="cta-original">18,800円</span>
                            <span className="cta-arrow">→</span>
                            <span className="cta-special">8,460円</span>
                        </div>
                        <p className="cta-savings">10,340円もお得！</p>
                    </div>
                    <button className="cta-button" onClick={handlePurchase}>
                        <span className="button-text">今すぐ購入する</span>
                        <span className="button-subtext">初回55%OFF適用</span>
                    </button>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="footer-content">
                    <button className="footer-cta-button" onClick={handlePurchase}>
                        初回限定55%OFFで購入する
                    </button>
                    <p className="footer-note">© 2024 Yoga Items. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
