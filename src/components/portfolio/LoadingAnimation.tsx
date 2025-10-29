"use client";

import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'accent' | 'white' | 'dark';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = 'primary',
    className = ''
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    const colorClasses = {
        primary: 'border-blue-500',
        accent: 'border-purple-500',
        white: 'border-white',
        dark: 'border-gray-800'
    };

    return (
        <div className={`loading-spinner ${sizeClasses[size]} ${className}`}>
            <div className={`loading-spinner__circle ${colorClasses[color]}`}></div>
        </div>
    );
};

interface LoadingDotsProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'accent' | 'white' | 'dark';
    className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
    size = 'medium',
    color = 'primary',
    className = ''
}) => {
    const sizeClasses = {
        small: 'loading-dots--small',
        medium: 'loading-dots--medium',
        large: 'loading-dots--large'
    };

    const colorClasses = {
        primary: 'loading-dots--primary',
        accent: 'loading-dots--accent',
        white: 'loading-dots--white',
        dark: 'loading-dots--dark'
    };

    return (
        <div className={`loading-dots ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
            <div className="loading-dots__dot"></div>
            <div className="loading-dots__dot"></div>
            <div className="loading-dots__dot"></div>
        </div>
    );
};

interface LoadingPulseProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'accent' | 'white' | 'dark';
    className?: string;
}

export const LoadingPulse: React.FC<LoadingPulseProps> = ({
    size = 'medium',
    color = 'primary',
    className = ''
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    const colorClasses = {
        primary: 'bg-blue-500',
        accent: 'bg-purple-500',
        white: 'bg-white',
        dark: 'bg-gray-800'
    };

    return (
        <div className={`loading-pulse ${sizeClasses[size]} ${colorClasses[color]} ${className}`}></div>
    );
};

interface PageLoadingProps {
    message?: string;
    showLogo?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
    message = "Loading...",
    showLogo = true
}) => {
    return (
        <div className="page-loading">
            <div className="page-loading__content">
                {showLogo && (
                    <div className="page-loading__logo">
                        <div className="page-loading__logo-icon">🚀</div>
                        <div className="page-loading__logo-text">Portfolio</div>
                    </div>
                )}
                <LoadingSpinner size="large" color="primary" />
                <p className="page-loading__message">{message}</p>
            </div>
        </div>
    );
};

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = '1rem',
    className = '',
    variant = 'text'
}) => {
    const variantClasses = {
        text: 'skeleton--text',
        rectangular: 'skeleton--rectangular',
        circular: 'skeleton--circular'
    };

    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div
            className={`skeleton ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

interface SkeletonCardProps {
    showAvatar?: boolean;
    lines?: number;
    className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
    showAvatar = false,
    lines = 3,
    className = ''
}) => {
    return (
        <div className={`skeleton-card ${className}`}>
            {showAvatar && (
                <Skeleton variant="circular" width={60} height={60} className="skeleton-card__avatar" />
            )}
            <div className="skeleton-card__content">
                <Skeleton height="1.5rem" className="skeleton-card__title" />
                {Array.from({ length: lines }).map((_, index) => (
                    <Skeleton
                        key={index}
                        height="1rem"
                        width={index === lines - 1 ? '60%' : '100%'}
                        className="skeleton-card__line"
                    />
                ))}
            </div>
        </div>
    );
};

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
    children?: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isVisible,
    message = "Loading...",
    children
}) => {
    if (!isVisible) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-overlay__backdrop" />
            <div className="loading-overlay__content">
                {children || (
                    <>
                        <LoadingSpinner size="large" color="white" />
                        <p className="loading-overlay__message">{message}</p>
                    </>
                )}
            </div>
        </div>
    );
};