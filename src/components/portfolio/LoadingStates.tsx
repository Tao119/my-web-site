"use client";

import React from 'react';
import { SkeletonLoader, SkeletonProfile, SkeletonSkills, SkeletonWorks, SkeletonBlog } from './SkeletonLoader';

// ページ全体のローディング
interface PageLoadingProps {
    message?: string;
    showLogo?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
    message = "読み込み中...",
    showLogo = true,
}) => {
    return (
        <div className="page-loading">
            <div className="page-loading__content">
                {showLogo && (
                    <div className="page-loading__logo">
                        <div className="page-loading__logo-icon">⚡</div>
                        <div className="page-loading__logo-text">Portfolio</div>
                    </div>
                )}
                <div className="page-loading__spinner">
                    <div className="loading-spinner loading-spinner--large">
                        <div className="loading-spinner__circle"></div>
                    </div>
                </div>
                <div className="page-loading__message">{message}</div>
            </div>
        </div>
    );
};

// セクション別ローディング
interface SectionLoadingProps {
    section: 'profile' | 'skills' | 'works' | 'blog';
    className?: string;
}

export const SectionLoading: React.FC<SectionLoadingProps> = ({
    section,
    className = '',
}) => {
    const renderSkeleton = () => {
        switch (section) {
            case 'profile':
                return <SkeletonProfile />;
            case 'skills':
                return <SkeletonSkills />;
            case 'works':
                return <SkeletonWorks />;
            case 'blog':
                return <SkeletonBlog />;
            default:
                return <SkeletonLoader variant="card" />;
        }
    };

    return (
        <div className={`section-loading ${className}`}>
            {renderSkeleton()}
        </div>
    );
};

// インラインローディング（小さなコンポーネント用）
interface InlineLoadingProps {
    size?: 'small' | 'medium' | 'large';
    variant?: 'spinner' | 'dots' | 'pulse';
    color?: 'primary' | 'accent' | 'white' | 'dark';
    className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
    size = 'medium',
    variant = 'spinner',
    color = 'primary',
    className = '',
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-6 h-6',
        large: 'w-8 h-8',
    };

    if (variant === 'dots') {
        return (
            <div className={`loading-dots loading-dots--${size} loading-dots--${color} ${className}`}>
                <div className="loading-dots__dot"></div>
                <div className="loading-dots__dot"></div>
                <div className="loading-dots__dot"></div>
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div className={`loading-pulse loading-pulse--${color} ${sizeClasses[size]} ${className}`}></div>
        );
    }

    // Default: spinner
    return (
        <div className={`loading-spinner loading-spinner--${size} loading-spinner--${color} ${className}`}>
            <div className="loading-spinner__circle"></div>
        </div>
    );
};

// ボタンローディング状態
interface ButtonLoadingProps {
    children: React.ReactNode;
    isLoading: boolean;
    loadingText?: string;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
    children,
    isLoading,
    loadingText = "処理中...",
    disabled = false,
    className = '',
    onClick,
}) => {
    return (
        <button
            className={`button-loading ${isLoading ? 'button-loading--active' : ''} ${className}`}
            disabled={disabled || isLoading}
            onClick={onClick}
        >
            {isLoading && (
                <div className="button-loading__spinner">
                    <InlineLoading size="small" color="white" />
                </div>
            )}
            <div className={`button-loading__text ${isLoading ? 'button-loading__text--hidden' : ''}`}>
                {isLoading ? loadingText : children}
            </div>
        </button>
    );
};

// オーバーレイローディング
interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
    backdrop?: boolean;
    className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isVisible,
    message = "読み込み中...",
    backdrop = true,
    className = '',
}) => {
    if (!isVisible) return null;

    return (
        <div className={`loading-overlay ${className}`}>
            {backdrop && <div className="loading-overlay__backdrop"></div>}
            <div className="loading-overlay__content">
                <InlineLoading size="large" color="white" />
                <div className="loading-overlay__message">{message}</div>
            </div>
        </div>
    );
};

// プログレスローディング
interface ProgressLoadingProps {
    progress: number;
    max?: number;
    showPercentage?: boolean;
    message?: string;
    className?: string;
}

export const ProgressLoading: React.FC<ProgressLoadingProps> = ({
    progress,
    max = 100,
    showPercentage = true,
    message,
    className = '',
}) => {
    const percentage = Math.min((progress / max) * 100, 100);

    return (
        <div className={`progress-loading ${className}`}>
            {message && <div className="progress-loading__message">{message}</div>}
            <div className="progress-loading__bar">
                <div
                    className="progress-loading__fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {showPercentage && (
                <div className="progress-loading__percentage">
                    {Math.round(percentage)}%
                </div>
            )}
        </div>
    );
};

// カードローディング（リスト用）
interface CardLoadingProps {
    count?: number;
    variant?: 'simple' | 'detailed';
    className?: string;
}

export const CardLoading: React.FC<CardLoadingProps> = ({
    count = 3,
    variant = 'simple',
    className = '',
}) => {
    return (
        <div className={`card-loading ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="card-loading__item">
                    {variant === 'detailed' ? (
                        <SkeletonLoader variant="card" />
                    ) : (
                        <div className="card-loading__simple">
                            <SkeletonLoader variant="rectangular" height="120px" />
                            <div className="card-loading__content">
                                <SkeletonLoader variant="text" height="20px" />
                                <SkeletonLoader variant="text" height="16px" lines={2} />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// 遅延読み込みコンテナ
interface LazyLoadingContainerProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
    className?: string;
}

export const LazyLoadingContainer: React.FC<LazyLoadingContainerProps> = ({
    children,
    fallback,
    threshold = 0.1,
    rootMargin = '50px',
    className = '',
}) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasLoaded) {
                    setIsVisible(true);
                    setHasLoaded(true);
                }
            },
            { threshold, rootMargin }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin, hasLoaded]);

    return (
        <div ref={containerRef} className={`lazy-loading-container ${className}`}>
            {isVisible ? children : (fallback || <SkeletonLoader variant="card" />)}
        </div>
    );
};