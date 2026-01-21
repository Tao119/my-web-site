'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../lp/lp.css';

export default function LP4Page() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePurchase = () => {
        router.push('/ads/cv4');
    };

    return (
        <div className="lp-container">
            <div className="fixed-cta-mobile">
                <button className="fixed-cta-button" onClick={handlePurchase}>
                    初月70%OFF で申し込む
                </button>
            </div>

            <header className="lp-header">
                <div className="header-content">
                    <div className="header-badge">期間限定</div>
                    <h1 className={`header-title ${isVisible ? 'fade-in' : ''}`}>
                        💻 プログラミングスクール
                    </h1>
                    <p className="lp-subtitle">現役エンジニアがマンツーマンで徹底指導</p>
                </div>
            </header>

            <section className="lp-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h2 className="hero-title">未経験からエンジニアへ</h2>
                    <p className="hero-description">
                        現役エンジニアによる完全マンツーマン指導で<br className="pc-only" />
                        確実にスキルを身につける
                    </p>
                    <div className="price-tag">
                        <div className="price-row">
                            <span className="original-price">通常価格 ¥298,000</span>
                            <span className="discount-badge">70% OFF</span>
                        </div>
                        <span className="special-price">初月限定 ¥89,400</span>
                        <span className="price-note">※分割払い可能（月々¥7,450〜）</span>
                    </div>
                    <button className="hero-cta-button" onClick={handlePurchase}>
                        無料カウンセリングを予約
                        <span className="button-arrow">→</span>
                    </button>
                    <p className="hero-guarantee">無料カウンセリング / 転職サポート付き</p>
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
                                <div className="feature-icon">👨‍💻</div>
                            </div>
                            <h4>現役エンジニア講師</h4>
                            <p>実務経験5年以上の現役エンジニアが専属メンターとしてサポート</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📚</div>
                            </div>
                            <h4>実践的カリキュラム</h4>
                            <p>実際の開発現場で使われる技術を学び、ポートフォリオを作成</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🎯</div>
                            </div>
                            <h4>転職サポート</h4>
                            <p>履歴書添削、面接対策、企業紹介まで転職成功まで徹底サポート</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-cta">
                <div className="cta-content">
                    <h3 className="cta-title">今だけ！初月限定70%OFF</h3>
                    <div className="cta-price-box">
                        <div className="cta-price-row">
                            <span className="cta-original">298,000円</span>
                            <span className="cta-arrow">→</span>
                            <span className="cta-special">89,400円</span>
                        </div>
                        <p className="cta-savings">208,600円もお得！</p>
                    </div>
                    <button className="cta-button" onClick={handlePurchase}>
                        <span className="button-text">無料カウンセリングを予約</span>
                        <span className="button-subtext">初月70%OFF適用</span>
                    </button>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="footer-content">
                    <button className="footer-cta-button" onClick={handlePurchase}>
                        初月限定70%OFFで申し込む
                    </button>
                    <p className="footer-note">© 2024 Programming School. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
