'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InteractiveButton, FloatingLabelInput } from './MicroInteractions';
import { AccessibleButton, LiveRegion, ScreenReaderOnly } from './AccessibilityUtils';
// import { useToast } from '@/hooks/useMicroInteractions';

// Zod validation schema
const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, 'お名前は2文字以上で入力してください')
        .max(50, 'お名前は50文字以内で入力してください'),
    email: z
        .string()
        .email('正しいメールアドレスを入力してください')
        .min(1, 'メールアドレスは必須です'),
    subject: z
        .string()
        .min(5, '件名は5文字以上で入力してください')
        .max(100, '件名は100文字以内で入力してください'),
    message: z
        .string()
        .min(10, 'メッセージは10文字以上で入力してください')
        .max(1000, 'メッセージは1000文字以内で入力してください'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
    onSubmit: (data: ContactFormData) => Promise<void>;
    isLoading?: boolean;
}

export default function ContactForm({ onSubmit, isLoading = false }: ContactFormProps) {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: 'onChange', // リアルタイムバリデーション
    });

    const handleFormSubmit = async (data: ContactFormData) => {
        try {
            setSubmitStatus('idle');
            setErrorMessage('');
            await onSubmit(data);
            setSubmitStatus('success');
            reset(); // フォームをリセット
        } catch (error) {
            // エラーログを無効化
            setSubmitStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'メッセージの送信に失敗しました。');
        }
    };

    return (
        <div className="contact-form">
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="contact-form__form"
                noValidate
                aria-label="お問い合わせフォーム"
            >
                <ScreenReaderOnly>
                    <p>必須項目は * で示されています。</p>
                </ScreenReaderOnly>

                {/* Name Field */}
                <div className="contact-form__field">
                    <label htmlFor="name" className="contact-form__label">
                        お名前 <span className="contact-form__required" aria-label="必須">*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className={`contact-form__input ${errors.name ? 'contact-form__input--error' : ''}`}
                        placeholder="山田 太郎"
                        disabled={isSubmitting || isLoading}
                        aria-required="true"
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                        <p id="name-error" className="contact-form__error" role="alert">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div className="contact-form__field">
                    <label htmlFor="email" className="contact-form__label">
                        メールアドレス <span className="contact-form__required" aria-label="必須">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`contact-form__input ${errors.email ? 'contact-form__input--error' : ''}`}
                        placeholder="example@email.com"
                        disabled={isSubmitting || isLoading}
                        aria-required="true"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        autoComplete="email"
                    />
                    {errors.email && (
                        <p id="email-error" className="contact-form__error" role="alert">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Subject Field */}
                <div className="contact-form__field">
                    <label htmlFor="subject" className="contact-form__label">
                        件名 <span className="contact-form__required" aria-label="必須">*</span>
                    </label>
                    <input
                        id="subject"
                        type="text"
                        {...register('subject')}
                        className={`contact-form__input ${errors.subject ? 'contact-form__input--error' : ''}`}
                        placeholder="お仕事のご相談について"
                        disabled={isSubmitting || isLoading}
                        aria-required="true"
                        aria-invalid={errors.subject ? 'true' : 'false'}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                    />
                    {errors.subject && (
                        <p id="subject-error" className="contact-form__error" role="alert">
                            {errors.subject.message}
                        </p>
                    )}
                </div>

                {/* Message Field */}
                <div className="contact-form__field">
                    <label htmlFor="message" className="contact-form__label">
                        メッセージ <span className="contact-form__required" aria-label="必須">*</span>
                    </label>
                    <textarea
                        id="message"
                        rows={6}
                        {...register('message')}
                        className={`contact-form__textarea ${errors.message ? 'contact-form__input--error' : ''}`}
                        placeholder="お気軽にメッセージをお送りください..."
                        disabled={isSubmitting || isLoading}
                        aria-required="true"
                        aria-invalid={errors.message ? 'true' : 'false'}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && (
                        <p id="message-error" className="contact-form__error" role="alert">
                            {errors.message.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="contact-form__submit-wrapper">
                    <AccessibleButton
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="contact-form__submit"
                        ariaLabel={isSubmitting || isLoading ? '送信中です' : 'メッセージを送信する'}
                    >
                        {isSubmitting || isLoading ? (
                            <span className="contact-form__loading">
                                <span className="contact-form__spinner" aria-hidden="true"></span>
                                送信中...
                            </span>
                        ) : (
                            'メッセージを送信'
                        )}
                    </AccessibleButton>
                </div>

                {/* Feedback Messages */}
                <LiveRegion politeness="assertive">
                    {submitStatus === 'success' && (
                        <div className="contact-form__feedback contact-form__feedback--success" role="alert">
                            <div className="contact-form__feedback-icon" aria-hidden="true">✓</div>
                            <div>
                                <h4>送信完了</h4>
                                <p>メッセージを送信しました。お返事まで少々お待ちください。</p>
                            </div>
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="contact-form__feedback contact-form__feedback--error" role="alert">
                            <div className="contact-form__feedback-icon" aria-hidden="true">✕</div>
                            <div>
                                <h4>送信エラー</h4>
                                <p>{errorMessage || 'メッセージの送信に失敗しました。しばらく時間をおいて再度お試しください。'}</p>
                            </div>
                        </div>
                    )}
                </LiveRegion>
            </form>
        </div>
    );
}