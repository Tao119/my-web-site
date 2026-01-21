'use client';

import { useEffect, useState } from 'react';
import '../cv/cv.css';

export default function CV4Page() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log('Conversion tracked - Programming School');
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
                <p className="cv-subtitle">無料カウンセリングの予約が完了しました</p>

                <div className="cv-info-box">
                    <h2>次のステップ</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>確認メールをチェック</h3>
                                <p>ご登録いただいたメールアドレスに、カウンセリングの詳細をお送りしました。</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>日時の選択</h3>
                                <p>メール内のリンクから、ご都合の良い日時を選択してください。</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>無料カウンセリング</h3>
                                <p>オンラインでキャリアアドバイザーがあなたの目標をヒアリングします。</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cv-benefits">
                    <h2>🎉 あなたの特典</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">💰</div>
                            <h3>初月70%OFF</h3>
                            <p>¥298,000 → ¥89,400</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">👨‍💻</div>
                            <h3>専属メンター</h3>
                            <p>現役エンジニア</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">📚</div>
                            <h3>教材無料</h3>
                            <p>全教材使い放題</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🎯</div>
                            <h3>転職サポート</h3>
                            <p>内定まで徹底支援</p>
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
                                <p>support@programming-school.example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
