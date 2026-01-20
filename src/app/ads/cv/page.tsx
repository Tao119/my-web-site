'use client';

import { useEffect, useState } from 'react';
import './cv.css';

export default function ConversionPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // コンバージョントラッキング
        console.log('Conversion tracked');

        // アニメーション開始
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
                <p className="cv-subtitle">
                    ご登録が完了しました
                </p>

                <div className="cv-info-box">
                    <h2>次のステップ</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>確認メールをチェック</h3>
                                <p>ご登録いただいたメールアドレスに確認メールをお送りしました。メールが届かない場合は、迷惑メールフォルダもご確認ください。</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>お支払い情報の登録</h3>
                                <p>メール内のリンクからお支払い情報をご登録ください。登録完了後、すぐに初回配送の準備を開始いたします。</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>初回配送</h3>
                                <p>3〜5営業日以内に初回のコーヒーをお届けします。配送状況はマイページから確認できます。</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cv-benefits">
                    <h2>🎉 あなたの特典</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">💰</div>
                            <h3>初回40%OFF</h3>
                            <p>¥4,980 → ¥2,980</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🚚</div>
                            <h3>送料無料</h3>
                            <p>全国どこでも無料</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🔄</div>
                            <h3>30日間返金保証</h3>
                            <p>満足できなければ全額返金</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">✨</div>
                            <h3>いつでも解約可能</h3>
                            <p>解約手数料なし</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">📖</div>
                            <h3>レシピブック</h3>
                            <p>会員限定PDF配布</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🎁</div>
                            <h3>次回10%OFF</h3>
                            <p>2回目以降も特別価格</p>
                        </div>
                    </div>
                </div>

                <div className="cv-timeline">
                    <h2>お届けまでの流れ</h2>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>本日</h4>
                                <p>お申し込み完了</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>1〜2日後</h4>
                                <p>お支払い情報登録・焙煎開始</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>3〜5日後</h4>
                                <p>初回コーヒーお届け</p>
                            </div>
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
                                <p>support@premium-coffee.example.com</p>
                                <span className="contact-note">24時間受付・24時間以内に返信</span>
                            </div>
                        </div>
                        <div className="contact-method">
                            <div className="contact-icon">📞</div>
                            <div className="contact-info">
                                <h4>電話</h4>
                                <p>0120-XXX-XXX</p>
                                <span className="contact-note">平日 10:00-18:00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cv-social">
                    <h2>公式SNSをフォロー</h2>
                    <p>コーヒーの淹れ方やレシピ、キャンペーン情報を配信中</p>
                    <div className="social-links">
                        <a href="#" className="social-link instagram">
                            <span className="social-icon">📷</span>
                            <span>Instagram</span>
                        </a>
                        <a href="#" className="social-link twitter">
                            <span className="social-icon">🐦</span>
                            <span>Twitter</span>
                        </a>
                        <a href="#" className="social-link facebook">
                            <span className="social-icon">👍</span>
                            <span>Facebook</span>
                        </a>
                    </div>
                </div>

                <div className="cv-footer-note">
                    <p>このページはブックマークしておくことをおすすめします</p>
                </div>
            </div>
        </div>
    );
}
