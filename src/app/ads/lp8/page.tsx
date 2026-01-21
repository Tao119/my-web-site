'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../lp/lp.css';

export default function LP8Page() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePurchase = () => {
        router.push('/ads/cv8');
    };

    return (
        <div className="lp-container">
            <div className="fixed-cta-mobile">
                <button className="fixed-cta-button" onClick={handlePurchase}>
                    初回65%OFF で申し込む
                </button>
            </div>

            <header className="lp-header">
                <div className="header-content">
                    <div className="header-badge">期間限定</div>
                    <h1 className={`header-title ${isVisible ? 'fade-in' : ''}`}>
                        🍵 プレミアム日本茶定期便
                    </h1>
                    <p className="lp-subtitle">茶師が厳選した高級日本茶を毎月お届け</p>
                </div>
            </header>

            <section className="lp-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h2 className="hero-title">本物の日本茶の味わいを</h2>
                    <p className="hero-description">
                        茶師が全国の茶園から厳選した<br className="pc-only" />
                        最高級の日本茶を毎月3種類お届け
                    </p>
                    <div className="price-tag">
                        <div className="price-row">
                            <span className="original-price">通常価格 ¥5,800</span>
                            <span className="discount-badge">65% OFF</span>
                        </div>
                        <span className="special-price">初回限定 ¥2,030</span>
                        <span className="price-note">※2回目以降 ¥3,980</span>
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
                                <div className="feature-icon">👨‍🌾</div>
                            </div>
                            <h4>茶師厳選</h4>
                            <p>50年以上の経験を持つ茶師が全国の茶園を訪問し、最高品質の茶葉のみを厳選</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🌿</div>
                            </div>
                            <h4>産地直送</h4>
                            <p>静岡・京都・鹿児島など、各地の名産地から新鮮な状態で直送</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📖</div>
                            </div>
                            <h4>淹れ方ガイド付き</h4>
                            <p>それぞれのお茶に最適な淹れ方を詳しく解説したガイド付き</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-cta">
                <div className="cta-content">
                    <h3 className="cta-title">今だけ！初回限定65%OFF</h3>
                    <div className="cta-price-box">
                        <div className="cta-price-row">
                            <span className="cta-original">5,800円</span>
                            <span className="cta-arrow">→</span>
                            <span className="cta-special">2,030円</span>
                        </div>
                        <p className="cta-savings">3,770円もお得！</p>
                    </div>
                    <button className="cta-button" onClick={handlePurchase}>
                        <span className="button-text">今すぐ申し込む</span>
                        <span className="button-subtext">初回65%OFF適用</span>
                    </button>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="footer-content">
                    <button className="footer-cta-button" onClick={handlePurchase}>
                        初回限定65%OFFで申し込む
                    </button>
                    <p className="footer-note">© 2024 Premium Japanese Tea. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
