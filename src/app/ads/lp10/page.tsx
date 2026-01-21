'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../lp/lp.css';

export default function LP10Page() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePurchase = () => {
        router.push('/ads/cv10');
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
                        🎨 趣味スターターキット
                    </h1>
                    <p className="lp-subtitle">新しい趣味を始めるための完全セット</p>
                </div>
            </header>

            <section className="lp-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h2 className="hero-title">新しい趣味で人生を豊かに</h2>
                    <p className="hero-description">
                        水彩画・書道・陶芸から選べる<br className="pc-only" />
                        プロ監修の初心者向け完全スターターキット
                    </p>
                    <div className="price-tag">
                        <div className="price-row">
                            <span className="original-price">通常価格 ¥24,800</span>
                            <span className="discount-badge">60% OFF</span>
                        </div>
                        <span className="special-price">初回限定 ¥9,920</span>
                        <span className="price-note">※送料無料・オンライン講座付き</span>
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
                                <div className="feature-icon">📦</div>
                            </div>
                            <h4>必要なものが全て揃う</h4>
                            <p>道具・材料・テキストが全てセット。届いたその日から始められます</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🎓</div>
                            </div>
                            <h4>プロ監修の教材</h4>
                            <p>各分野のプロが監修した初心者向けテキスト・動画講座付き</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">💬</div>
                            </div>
                            <h4>オンラインサポート</h4>
                            <p>専門家に質問できるオンラインコミュニティへのアクセス権付き</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-cta">
                <div className="cta-content">
                    <h3 className="cta-title">今だけ！初回限定60%OFF</h3>
                    <div className="cta-price-box">
                        <div className="cta-price-row">
                            <span className="cta-original">24,800円</span>
                            <span className="cta-arrow">→</span>
                            <span className="cta-special">9,920円</span>
                        </div>
                        <p className="cta-savings">14,880円もお得！</p>
                    </div>
                    <button className="cta-button" onClick={handlePurchase}>
                        <span className="button-text">今すぐ購入する</span>
                        <span className="button-subtext">初回60%OFF適用</span>
                    </button>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="footer-content">
                    <button className="footer-cta-button" onClick={handlePurchase}>
                        初回限定60%OFFで購入する
                    </button>
                    <p className="footer-note">© 2024 Hobby Starter Kit. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
