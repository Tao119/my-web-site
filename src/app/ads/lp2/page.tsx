'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../lp/lp.css';

export default function LP2Page() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePurchase = () => {
        router.push('/ads/cv2');
    };

    return (
        <div className="lp-container">
            <div className="fixed-cta-mobile">
                <button className="fixed-cta-button" onClick={handlePurchase}>
                    初月50%OFF で申し込む
                </button>
            </div>

            <header className="lp-header">
                <div className="header-content">
                    <div className="header-badge">期間限定</div>
                    <h1 className={`header-title ${isVisible ? 'fade-in' : ''}`}>
                        🌍 オンライン英会話
                    </h1>
                    <p className="lp-subtitle">ネイティブ講師とマンツーマンで本格英語学習</p>
                </div>
            </header>

            <section className="lp-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h2 className="hero-title">あなたの英語力を次のレベルへ</h2>
                    <p className="hero-description">
                        経験豊富なネイティブ講師による<br className="pc-only" />
                        マンツーマンレッスンで確実にスキルアップ
                    </p>
                    <div className="price-tag">
                        <div className="price-row">
                            <span className="original-price">通常価格 ¥12,800</span>
                            <span className="discount-badge">50% OFF</span>
                        </div>
                        <span className="special-price">初月限定 ¥6,400</span>
                        <span className="price-note">※2ヶ月目以降 ¥9,800</span>
                    </div>
                    <button className="hero-cta-button" onClick={handlePurchase}>
                        無料体験レッスンを予約
                        <span className="button-arrow">→</span>
                    </button>
                    <p className="hero-guarantee">無料体験レッスン付き / いつでも解約OK</p>
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
                                <div className="feature-icon">👨‍🏫</div>
                            </div>
                            <h4>ネイティブ講師</h4>
                            <p>全員が英語教育資格保有者。アメリカ、イギリス、カナダ出身の経験豊富な講師陣</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📱</div>
                            </div>
                            <h4>24時間予約可能</h4>
                            <p>早朝から深夜まで、あなたのライフスタイルに合わせてレッスン予約が可能</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📊</div>
                            </div>
                            <h4>個別カリキュラム</h4>
                            <p>あなたのレベルと目標に合わせた完全オーダーメイドのレッスンプラン</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-cta">
                <div className="cta-content">
                    <h3 className="cta-title">今だけ！初月限定50%OFF</h3>
                    <div className="cta-price-box">
                        <div className="cta-price-row">
                            <span className="cta-original">月額12,800円</span>
                            <span className="cta-arrow">→</span>
                            <span className="cta-special">6,400円</span>
                        </div>
                        <p className="cta-savings">6,400円もお得！</p>
                    </div>
                    <button className="cta-button" onClick={handlePurchase}>
                        <span className="button-text">無料体験を申し込む</span>
                        <span className="button-subtext">初月50%OFF適用</span>
                    </button>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="footer-content">
                    <button className="footer-cta-button" onClick={handlePurchase}>
                        初月限定50%OFFで申し込む
                    </button>
                    <p className="footer-note">© 2024 Online English School. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
