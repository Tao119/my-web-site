'use client';

import { useState } from 'react';
import ContactForm, { ContactFormData } from './ContactForm';
import { ScrollAnimation } from './ScrollAnimation';

export default function ContactSection() {
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (data: ContactFormData) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle different error types
                switch (result.code) {
                    case 'RATE_LIMIT_EXCEEDED':
                        throw new Error('送信回数の上限に達しました。しばらく時間をおいてから再度お試しください。');
                    case 'VALIDATION_ERROR':
                        throw new Error('入力内容に問題があります。フォームを確認してください。');
                    case 'SPAM_DETECTED':
                        throw new Error('メッセージがスパムとして検出されました。内容を見直してください。');
                    default:
                        throw new Error(result.error || 'メッセージの送信に失敗しました。');
                }
            }

            // Success - the ContactForm component will handle the success state
            // ログ出力を無効化

        } catch (error) {
            // エラーログを無効化
            throw error; // Re-throw for ContactForm component to handle
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="contact-section__container">
                <ScrollAnimation animation="fade-up">
                    <div className="contact-section__header">
                        <h2 className="contact-section__title">
                            Contact
                        </h2>
                        <p className="contact-section__subtitle">
                            お気軽にお問い合わせください
                        </p>
                        <p className="contact-section__description">
                            プロジェクトのご相談、お仕事のご依頼、技術的なご質問など、
                            どんなことでもお気軽にメッセージをお送りください。
                            できるだけ早くお返事いたします。
                        </p>
                    </div>
                </ScrollAnimation>

                <ScrollAnimation animation="fade-up" delay={200}>
                    <div className="contact-section__form-wrapper">
                        <ContactForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                    </div>
                </ScrollAnimation>

                <ScrollAnimation animation="fade-up" delay={400}>
                    <div className="contact-section__info">
                        <div className="contact-section__info-grid">
                            <div className="contact-section__info-item">
                                <div className="contact-section__info-icon">📧</div>
                                <div className="contact-section__info-content">
                                    <h3>Email</h3>
                                    <p>tao.dama.art@gmail.com</p>
                                </div>
                            </div>

                            <div className="contact-section__info-item">
                                <div className="contact-section__info-icon">📱</div>
                                <div className="contact-section__info-content">
                                    <h3>Phone</h3>
                                    <p>080-9978-8248</p>
                                </div>
                            </div>

                            <div className="contact-section__info-item">
                                <div className="contact-section__info-icon">⏰</div>
                                <div className="contact-section__info-content">
                                    <h3>Response Time</h3>
                                    <p>通常24時間以内</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}