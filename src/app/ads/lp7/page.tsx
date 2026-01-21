'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../lp/lp.css';

export default function LP7Page() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePurchase = () => {
        router.push('/ads/cv7');
    };

    return (
        <div className="lp-container">
            <div className="fixed-cta-mobile">
                <button className="fixed-cta-button" onClick={handlePurchase}>
                    初回45%OFF で申し込む
                </button>
            </div>

            <header className="lp-header">
                <div className="header-content">
                    <div className="header-badge">期間限定</div>
                    <h1 className={`header-title ${isVisible ? 'fade-in' : ''}`}>
                        📚 読書グッズセット
                    </h1>
                    <p className="lp-subtitle">快適な読書時間を演出するプレミアムアイテム</p>
                </div>
            </header>

            <section className="lp-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h2 className="hero-title">読書がもっと楽しくなる</h2>
                    <p className="hero-description">
                        目に優しいLEDブックライト・高級しおり・<br className="pc-only" />
                        角度調整可能なブックスタンドの3点セット
                    </p>
                    <div className="price-tag">
                        <div className="price-row">
                            <span className="original-price">通常価格 ¥12,800</span>
                            <span className="discount-badge">45% OFF</span>
                        </div>
                        <span className="special-price">初回限定 ¥7,040</span>
                        <span className="price-note">※送料無料・ギフトラッピング無料</span>
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
                                <div className="feature-icon">💡</div>
                            </div>
                            <h4>目に優しいLED</h4>
                            <p>ブルーライトカット機能付き。長時間の読書でも目が疲れにくい</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🎨</div>
                            </div>
                            <h4>高級感あるデザイン</h4>
                            <p>本革製しおり・木製スタンド。インテリアとしても美しい</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🎁</div>
                            </div>
                            <h4>ギフトに最適</h4>
                            <p>無料ギフトラッピング対応。読書好きへのプレゼントに</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-cta">
                <div className="cta-content">
                    <h3 className="cta-title">今だけ！初回限定45%OFF</h3>
                    <div className="cta-price-box">
                        <div className="cta-price-row">
                            <span className="cta-original">12,800円</span>
                            <span className="cta-arrow">→</span>
                            <span className="cta-special">7,040円</span>
                        </div>
                        <p className="cta-savings">5,760円もお得！</p>
                    </div>
                    <button className="cta-button" onClick={handlePurchase}>
                        <span className="button-text">今すぐ購入する</span>
                        <span className="button-subtext">初回45%OFF適用</span>
                    </button>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="footer-content">
                    <button className="footer-cta-button" onClick={handlePurchase}>
                        初回限定45%OFFで購入する
                    </button>
                    <p className="footer-note">© 2024 Reading Goods. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
