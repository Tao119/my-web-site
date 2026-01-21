'use client';

import { useEffect, useState } from 'react';
import '../cv/cv.css';

export default function CV6Page() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log('Conversion tracked - Yoga Items');
        setIsVisible(true);
    }, []);

    return (
        <div className="cv-container">
            <div className={`cv-content ${isVisible ? 'fade-in' : ''}`}>
                <div className="success-animation">
                    <div className="success-icon">✓</div>
                    <div className="success-circle"></div>
                </div>

                <h1 className="cv-title">ご購入ありがとうございます！</h1>
                <p className="cv-subtitle">ご注文が完了しました</p>

                <div className="cv-info-box">
                    <h2>次のステップ</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>確認メールをチェック</h3>
                                <p>ご登録いただいたメールアドレスに注文確認メールをお送りしました。</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>商品の発送</h3>
                                <p>1〜2営業日以内に発送いたします。配送状況はメールでお知らせします。</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>商品到着</h3>
                                <p>3〜5日でお届け予定です。到着後すぐにヨガを始められます！</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cv-benefits">
                    <h2>🎉 ご購入特典</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">💰</div>
                            <h3>55%OFF</h3>
                            <p>¥18,800 → ¥8,460</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🚚</div>
                            <h3>送料無料</h3>
                            <p>全国どこでも無料</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">📚</div>
                            <h3>ヨガガイド</h3>
                            <p>初心者向けPDF付き</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🔄</div>
                            <h3>30日間返品保証</h3>
                            <p>満足できなければ全額返金</p>
                        </div>
                    </div>
                </div>

                <div className="cv-contact">
                    <h2>お困りの際は</h2>
                    <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
                    <div className="contact-methods">
                        <div className="contact-method">
                            <div className="contact-icon">📧</div>
                            <div className="contact-info">
                                <h4>Email</h4>
                                <p>support@yoga-items.example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
