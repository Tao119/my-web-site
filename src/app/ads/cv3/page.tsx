'use client';

import { useEffect, useState } from 'react';
import '../cv/cv.css';

export default function CV3Page() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log('Conversion tracked - Fitness App');
        setIsVisible(true);
    }, []);

    return (
        <div className="cv-container">
            <div className={`cv-content ${isVisible ? 'fade-in' : ''}`}>
                <div className="success-animation">
                    <div className="success-icon">✓</div>
                    <div className="success-circle"></div>
                </div>

                <h1 className="cv-title">お申し込みありがとうございます！</h1>
                <p className="cv-subtitle">30日間無料トライアルが開始されました</p>

                <div className="cv-info-box">
                    <h2>次のステップ</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>アプリをダウンロード</h3>
                                <p>App StoreまたはGoogle Playからアプリをダウンロードしてください。</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>ログイン</h3>
                                <p>登録したメールアドレスとパスワードでログインしてください。</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>トレーニング開始</h3>
                                <p>1000本以上の動画から好きなプログラムを選んで始めましょう！</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cv-benefits">
                    <h2>🎉 あなたの特典</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">🎁</div>
                            <h3>30日間無料</h3>
                            <p>完全無料でお試し</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🎥</div>
                            <h3>動画見放題</h3>
                            <p>1000本以上</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">📱</div>
                            <h3>全デバイス対応</h3>
                            <p>スマホ・PC・タブレット</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">✨</div>
                            <h3>いつでも解約</h3>
                            <p>解約手数料なし</p>
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
                                <p>support@fitness-app.example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
