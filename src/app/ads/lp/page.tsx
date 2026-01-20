'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import './lp.css';

export default function LandingPage() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePurchase = () => {
        router.push('/ads/cv');
    };

    return (
        <div className="lp-container">
            {/* Fixed CTA Bar for Mobile */}
            <div className="fixed-cta-mobile">
                <button className="fixed-cta-button" onClick={handlePurchase}>
                    初回40%OFF で申し込む
                </button>
            </div>

            <header className="lp-header">
                <div className="header-content">
                    <div className="header-badge">期間限定</div>
                    <h1 className={`header-title ${isVisible ? 'fade-in' : ''}`}>
                        ☕ プレミアムコーヒー定期便
                    </h1>
                    <p className="lp-subtitle">世界中から厳選された最高級コーヒー豆を毎月お届け</p>
                </div>
            </header>

            <section className="lp-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h2 className="hero-title">毎朝の一杯が、特別な時間に</h2>
                    <p className="hero-description">
                        バリスタが厳選した世界各地のスペシャルティコーヒーを、<br className="pc-only" />
                        焙煎したての新鮮な状態でお届けします。
                    </p>
                    <div className="price-tag">
                        <div className="price-row">
                            <span className="original-price">通常価格 ¥4,980</span>
                            <span className="discount-badge">40% OFF</span>
                        </div>
                        <span className="special-price">初回限定 ¥2,980</span>
                        <span className="price-note">※2回目以降も特別価格 ¥3,980</span>
                    </div>
                    <button className="hero-cta-button" onClick={handlePurchase}>
                        今すぐ申し込む
                        <span className="button-arrow">→</span>
                    </button>
                    <p className="hero-guarantee">30日間返金保証 / いつでも解約OK</p>
                </div>
            </section>

            <section className="lp-features">
                <div className="section-container">
                    <div className="section-header">
                        <h3>選ばれる3つの理由</h3>
                        <p className="section-subtitle">なぜ多くの方に選ばれているのか</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🌍</div>
                            </div>
                            <h4>世界中から厳選</h4>
                            <p>エチオピア、コロンビア、グアテマラなど、世界各地の農園から直接仕入れた最高品質の豆のみを使用</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🔥</div>
                            </div>
                            <h4>焙煎したて</h4>
                            <p>注文を受けてから焙煎するため、常に新鮮な状態でお届け。香り高い一杯をお楽しみいただけます</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📦</div>
                            </div>
                            <h4>毎月お届け</h4>
                            <p>毎月異なる産地のコーヒーをお楽しみいただけます。世界のコーヒーを旅するような体験を</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-showcase">
                <div className="section-container">
                    <div className="showcase-content">
                        <div className="showcase-image">
                            <div className="image-placeholder">
                                <span className="image-icon">☕</span>
                            </div>
                        </div>
                        <div className="showcase-text">
                            <h3>プロのバリスタが厳選</h3>
                            <p>
                                20年以上の経験を持つプロのバリスタが、世界中のコーヒー農園を訪問し、
                                品質・味・香りの全てにおいて最高評価を得た豆だけを厳選しています。
                            </p>
                            <ul className="showcase-list">
                                <li>✓ スペシャルティコーヒー認定</li>
                                <li>✓ フェアトレード認証</li>
                                <li>✓ 有機栽培（オーガニック）</li>
                                <li>✓ 単一農園（シングルオリジン）</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-testimonials">
                <div className="section-container">
                    <div className="section-header">
                        <h3>お客様の声</h3>
                        <p className="section-subtitle">実際にご利用いただいているお客様の声</p>
                    </div>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-rating">★★★★★</div>
                            <p className="testimonial-text">
                                「毎朝のコーヒータイムが楽しみになりました。香りも味も最高です！カフェで飲むよりも美味しいと感じています。」
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">T</div>
                                <div className="author-info">
                                    <p className="author-name">田中 美咲様</p>
                                    <p className="author-detail">東京都 / 30代女性 / 利用歴6ヶ月</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-rating">★★★★★</div>
                            <p className="testimonial-text">
                                「色々な産地のコーヒーを試せるのが嬉しい。毎月届くのが待ち遠しいです。解約も簡単なので安心して始められました。」
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">S</div>
                                <div className="author-info">
                                    <p className="author-name">佐藤 健太様</p>
                                    <p className="author-detail">大阪府 / 40代男性 / 利用歴1年</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-rating">★★★★★</div>
                            <p className="testimonial-text">
                                「在宅ワークが増えて、美味しいコーヒーが欠かせなくなりました。このサービスに出会えて本当に良かったです。」
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">Y</div>
                                <div className="author-info">
                                    <p className="author-name">山田 由美様</p>
                                    <p className="author-detail">神奈川県 / 20代女性 / 利用歴3ヶ月</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-cta">
                <div className="cta-content">
                    <h3 className="cta-title">今だけ！初回限定40%OFF</h3>
                    <div className="cta-price-box">
                        <div className="cta-price-row">
                            <span className="cta-original">月額4,980円</span>
                            <span className="cta-arrow">→</span>
                            <span className="cta-special">2,980円</span>
                        </div>
                        <p className="cta-savings">2,000円もお得！</p>
                    </div>
                    <p className="cta-note">※いつでも解約可能・送料無料・30日間返金保証</p>
                    <button className="cta-button" onClick={handlePurchase}>
                        <span className="button-text">今すぐ申し込む</span>
                        <span className="button-subtext">初回40%OFF適用</span>
                    </button>
                    <div className="cta-benefits">
                        <div className="benefit-item">
                            <span className="benefit-icon">✓</span>
                            <span>送料無料</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">✓</span>
                            <span>30日間返金保証</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">✓</span>
                            <span>いつでも解約OK</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lp-faq">
                <div className="section-container">
                    <div className="section-header">
                        <h3>よくある質問</h3>
                        <p className="section-subtitle">お客様からよくいただく質問</p>
                    </div>
                    <div className="faq-list">
                        <div className="faq-item">
                            <h4>Q. 解約はいつでもできますか？</h4>
                            <p>A. はい、マイページからいつでも解約可能です。解約手数料などは一切かかりません。</p>
                        </div>
                        <div className="faq-item">
                            <h4>Q. 配送頻度は変更できますか？</h4>
                            <p>A. 月1回、2週間に1回など、お好みの頻度に変更できます。スキップ機能もございます。</p>
                        </div>
                        <div className="faq-item">
                            <h4>Q. 豆の挽き方は選べますか？</h4>
                            <p>A. 豆のまま、または粗挽き・中挽き・細挽きから選択できます。ご注文時に指定してください。</p>
                        </div>
                        <div className="faq-item">
                            <h4>Q. 支払い方法は何がありますか？</h4>
                            <p>A. クレジットカード（VISA、MasterCard、JCB、AMEX）に対応しています。</p>
                        </div>
                        <div className="faq-item">
                            <h4>Q. 返金保証の条件は？</h4>
                            <p>A. 初回お届けから30日以内であれば、理由を問わず全額返金いたします。</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="footer-content">
                    <button className="footer-cta-button" onClick={handlePurchase}>
                        初回限定40%OFFで申し込む
                    </button>
                    <p className="footer-note">© 2024 Premium Coffee Subscription. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
