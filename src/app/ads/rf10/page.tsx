'use client';

import Link from 'next/link';
import './rf10.css';

export default function RF10Page() {
    return (
        <div className="rf10-container">
            {/* ヘッダー */}
            <header className="rf10-header">
                <div className="rf10-header-content">
                    <h1 className="rf10-site-title">健康ライフマガジン</h1>
                    <nav className="rf10-nav">
                        <a href="#" className="rf10-nav-link">ホーム</a>
                        <a href="#" className="rf10-nav-link">健康</a>
                        <a href="#" className="rf10-nav-link">美容</a>
                        <a href="#" className="rf10-nav-link">ダイエット</a>
                    </nav>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="rf10-main">
                <article className="rf10-article">
                    {/* パンくずリスト */}
                    <div className="rf10-breadcrumb">
                        <a href="#">ホーム</a> &gt; <a href="#">健康</a> &gt; <span>睡眠の質を改善する方法</span>
                    </div>

                    {/* 記事ヘッダー */}
                    <div className="rf10-article-header">
                        <div className="rf10-category-badge">健康・睡眠</div>
                        <h1 className="rf10-article-title">
                            【医師監修】睡眠の質を劇的に改善する7つの習慣｜今日から始められる快眠メソッド
                        </h1>
                        <div className="rf10-article-meta">
                            <time className="rf10-date">2024年1月20日</time>
                            <span className="rf10-author">健康ライフ編集部</span>
                            <span className="rf10-read-time">読了時間: 約8分</span>
                        </div>
                    </div>

                    {/* アイキャッチ画像 */}
                    <div className="rf10-featured-image">
                        <div className="rf10-image-placeholder">
                            <span>😴</span>
                            <p>質の高い睡眠で健康的な毎日を</p>
                        </div>
                    </div>

                    {/* 記事本文 */}
                    <div className="rf10-article-content">
                        {/* 導入文 */}
                        <div className="rf10-lead">
                            <p>
                                「最近よく眠れない」「朝起きても疲れが取れない」そんな悩みを抱えていませんか？
                                実は日本人の5人に1人が睡眠に関する悩みを抱えていると言われています。
                            </p>
                            <p>
                                この記事では、睡眠の専門医が推奨する、今日から実践できる睡眠の質を改善する方法を詳しく解説します。
                            </p>
                        </div>

                        {/* 目次 */}
                        <div className="rf10-toc">
                            <h2 className="rf10-toc-title">目次</h2>
                            <ol className="rf10-toc-list">
                                <li><a href="#section1">睡眠の質が低下する原因とは</a></li>
                                <li><a href="#section2">質の高い睡眠がもたらす効果</a></li>
                                <li><a href="#section3">睡眠の質を改善する7つの習慣</a></li>
                                <li><a href="#section4">避けるべきNG習慣</a></li>
                                <li><a href="#section5">まとめ</a></li>
                            </ol>
                        </div>

                        {/* セクション1 */}
                        <section id="section1" className="rf10-section">
                            <h2 className="rf10-section-title">睡眠の質が低下する原因とは</h2>
                            <p>
                                現代人の睡眠の質が低下している主な原因は、生活習慣の乱れとストレスです。
                                特に以下のような要因が睡眠に悪影響を及ぼしています。
                            </p>
                            <ul className="rf10-list">
                                <li><strong>スマートフォンやPCの使用</strong> - ブルーライトが睡眠ホルモンの分泌を妨げる</li>
                                <li><strong>不規則な生活リズム</strong> - 体内時計が乱れ、自然な眠気が訪れにくくなる</li>
                                <li><strong>ストレスや不安</strong> - 交感神経が優位になり、リラックスできない</li>
                                <li><strong>カフェインの過剰摂取</strong> - 覚醒作用が長時間続く</li>
                            </ul>
                        </section>

                        {/* セクション2 */}
                        <section id="section2" className="rf10-section">
                            <h2 className="rf10-section-title">質の高い睡眠がもたらす効果</h2>
                            <p>
                                質の高い睡眠を取ることで、心身ともに様々なメリットが得られます。
                            </p>
                            <div className="rf10-benefits">
                                <div className="rf10-benefit-card">
                                    <div className="rf10-benefit-icon">🧠</div>
                                    <h3>脳機能の向上</h3>
                                    <p>記憶力・集中力・判断力が向上し、仕事や勉強の効率がアップ</p>
                                </div>
                                <div className="rf10-benefit-card">
                                    <div className="rf10-benefit-icon">💪</div>
                                    <h3>免疫力の強化</h3>
                                    <p>病気にかかりにくくなり、健康的な体を維持できる</p>
                                </div>
                                <div className="rf10-benefit-card">
                                    <div className="rf10-benefit-icon">😊</div>
                                    <h3>メンタルの安定</h3>
                                    <p>ストレス耐性が高まり、前向きな気持ちで過ごせる</p>
                                </div>
                                <div className="rf10-benefit-card">
                                    <div className="rf10-benefit-icon">✨</div>
                                    <h3>美容効果</h3>
                                    <p>肌のターンオーバーが正常化し、美肌を保てる</p>
                                </div>
                            </div>
                        </section>

                        {/* セクション3 */}
                        <section id="section3" className="rf10-section">
                            <h2 className="rf10-section-title">睡眠の質を改善する7つの習慣</h2>

                            <div className="rf10-habit">
                                <h3 className="rf10-habit-title">
                                    <span className="rf10-habit-number">1</span>
                                    毎日同じ時間に起きる
                                </h3>
                                <p>
                                    休日も含めて毎日同じ時間に起きることで、体内時計が整います。
                                    起床時間を固定することで、自然と就寝時間も一定になり、質の高い睡眠につながります。
                                </p>
                            </div>

                            <div className="rf10-habit">
                                <h3 className="rf10-habit-title">
                                    <span className="rf10-habit-number">2</span>
                                    朝日を浴びる
                                </h3>
                                <p>
                                    起床後すぐに朝日を浴びることで、体内時計がリセットされます。
                                    セロトニンの分泌が促進され、夜には自然な眠気を感じやすくなります。
                                </p>
                            </div>

                            <div className="rf10-habit">
                                <h3 className="rf10-habit-title">
                                    <span className="rf10-habit-number">3</span>
                                    適度な運動を取り入れる
                                </h3>
                                <p>
                                    日中に適度な運動をすることで、夜の睡眠の質が向上します。
                                    ただし、就寝3時間前以降の激しい運動は避けましょう。
                                </p>
                            </div>

                            <div className="rf10-habit">
                                <h3 className="rf10-habit-title">
                                    <span className="rf10-habit-number">4</span>
                                    就寝2時間前からブルーライトを避ける
                                </h3>
                                <p>
                                    スマートフォンやPCの画面から発せられるブルーライトは、睡眠ホルモン「メラトニン」の分泌を抑制します。
                                    就寝前はデジタルデバイスの使用を控えましょう。
                                </p>
                            </div>

                            <div className="rf10-habit">
                                <h3 className="rf10-habit-title">
                                    <span className="rf10-habit-number">5</span>
                                    寝室の環境を整える
                                </h3>
                                <p>
                                    快適な睡眠環境を作ることが重要です。室温は16〜19℃、湿度は50〜60%が理想的。
                                    遮光カーテンで光を遮断し、静かな環境を保ちましょう。
                                </p>
                            </div>

                            <div className="rf10-habit">
                                <h3 className="rf10-habit-title">
                                    <span className="rf10-habit-number">6</span>
                                    入浴で体温をコントロール
                                </h3>
                                <p>
                                    就寝の1〜2時間前に38〜40℃のぬるめのお湯に15〜20分浸かることで、
                                    体温が下がるタイミングで自然な眠気が訪れます。
                                </p>
                            </div>

                            <div className="rf10-habit">
                                <h3 className="rf10-habit-title">
                                    <span className="rf10-habit-number">7</span>
                                    リラックスタイムを作る
                                </h3>
                                <p>
                                    就寝前にリラックスできる時間を設けましょう。
                                    読書、軽いストレッチ、瞑想など、自分に合った方法で心を落ち着かせることが大切です。
                                </p>
                            </div>
                        </section>

                        {/* CTA（広告リンク） */}
                        <div className="rf10-cta">
                            <div className="rf10-cta-content">
                                <h3 className="rf10-cta-title">睡眠の質を本気で改善したい方へ</h3>
                                <p className="rf10-cta-text">
                                    科学的根拠に基づいた睡眠改善プログラムで、あなたの睡眠を劇的に変えませんか？
                                    専門家が監修した独自メソッドで、多くの方が効果を実感しています。
                                </p>
                                <a href="http://localhost:8080/cl/5df0009bbf63?bid=0e2e51dd139414f0a51e46cf" className="rf10-cta-button" target="_blank" rel="noopener noreferrer">
                                    詳しくはこちら →
                                </a>
                            </div>
                        </div>

                        {/* セクション4 */}
                        <section id="section4" className="rf10-section">
                            <h2 className="rf10-section-title">避けるべきNG習慣</h2>
                            <p>
                                睡眠の質を下げてしまう習慣もあります。以下の行動は避けるようにしましょう。
                            </p>
                            <div className="rf10-ng-list">
                                <div className="rf10-ng-item">
                                    <span className="rf10-ng-icon">❌</span>
                                    <div>
                                        <h4>寝る直前の食事</h4>
                                        <p>消化活動が睡眠を妨げます。就寝3時間前までに食事を済ませましょう。</p>
                                    </div>
                                </div>
                                <div className="rf10-ng-item">
                                    <span className="rf10-ng-icon">❌</span>
                                    <div>
                                        <h4>アルコールの過剰摂取</h4>
                                        <p>寝つきは良くなりますが、睡眠の質は低下します。</p>
                                    </div>
                                </div>
                                <div className="rf10-ng-item">
                                    <span className="rf10-ng-icon">❌</span>
                                    <div>
                                        <h4>昼寝のしすぎ</h4>
                                        <p>昼寝は15〜20分程度に留めましょう。長時間の昼寝は夜の睡眠に影響します。</p>
                                    </div>
                                </div>
                                <div className="rf10-ng-item">
                                    <span className="rf10-ng-icon">❌</span>
                                    <div>
                                        <h4>寝だめ</h4>
                                        <p>休日の寝だめは体内時計を乱します。毎日一定の睡眠時間を確保しましょう。</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* セクション5 */}
                        <section id="section5" className="rf10-section">
                            <h2 className="rf10-section-title">まとめ</h2>
                            <p>
                                睡眠の質を改善することは、健康的な生活を送る上で非常に重要です。
                                今回ご紹介した7つの習慣を実践することで、多くの方が睡眠の質の向上を実感できるはずです。
                            </p>
                            <p>
                                すべてを一度に始める必要はありません。まずは1つか2つ、取り組みやすいものから始めてみてください。
                                継続することで、必ず効果を感じられるようになります。
                            </p>
                            <div className="rf10-summary-box">
                                <h3>この記事のポイント</h3>
                                <ul>
                                    <li>毎日同じ時間に起きて体内時計を整える</li>
                                    <li>朝日を浴びてセロトニンの分泌を促す</li>
                                    <li>就寝前のブルーライトを避ける</li>
                                    <li>快適な睡眠環境を整える</li>
                                    <li>リラックスタイムを作る</li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* 記事フッター */}
                    <div className="rf10-article-footer">
                        <div className="rf10-author-box">
                            <div className="rf10-author-avatar">👨‍⚕️</div>
                            <div className="rf10-author-info">
                                <h3>監修者プロフィール</h3>
                                <p className="rf10-author-name">山田太郎 医師</p>
                                <p className="rf10-author-bio">
                                    睡眠専門医。〇〇大学医学部卒業後、睡眠医療センターにて10年以上の臨床経験を持つ。
                                    「質の高い睡眠で人生を変える」をモットーに、多くの患者の睡眠改善をサポートしている。
                                </p>
                            </div>
                        </div>
                    </div>
                </article>

                {/* サイドバー */}
                <aside className="rf10-sidebar">
                    <div className="rf10-sidebar-widget">
                        <h3 className="rf10-widget-title">人気記事</h3>
                        <ul className="rf10-popular-list">
                            <li><a href="#">朝活で人生が変わる！効果的な朝の過ごし方</a></li>
                            <li><a href="#">ストレス解消に効く5つのリラックス法</a></li>
                            <li><a href="#">疲れが取れない原因と対策</a></li>
                            <li><a href="#">集中力を高める食事のコツ</a></li>
                        </ul>
                    </div>

                    <div className="rf10-sidebar-widget">
                        <h3 className="rf10-widget-title">カテゴリー</h3>
                        <ul className="rf10-category-list">
                            <li><a href="#">健康 (128)</a></li>
                            <li><a href="#">睡眠 (45)</a></li>
                            <li><a href="#">美容 (89)</a></li>
                            <li><a href="#">ダイエット (67)</a></li>
                            <li><a href="#">メンタルヘルス (52)</a></li>
                        </ul>
                    </div>
                </aside>
            </main>

            {/* フッター */}
            <footer className="rf10-footer">
                <div className="rf10-footer-content">
                    <p>&copy; 2024 健康ライフマガジン. All rights reserved.</p>
                    <nav className="rf10-footer-nav">
                        <a href="#">プライバシーポリシー</a>
                        <a href="#">利用規約</a>
                        <a href="#">お問い合わせ</a>
                    </nav>
                </div>
            </footer>
        </div >
    );
}
