"use client";

import React from 'react';

interface SkeletonLoaderProps {
    className?: string;
    height?: string;
    variant?: 'text' | 'rectangular' | 'circular' | 'card';
    lines?: number;
    animation?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    className = '',
    height = '20px',
    variant = 'text',
    lines = 1,
    animation = true,
}) => {
    const baseClasses = `skeleton-loader ${animation ? 'skeleton-loader--animated' : ''} ${className}`;

    if (variant === 'card') {
        return (
            <div className={`${baseClasses} skeleton-loader--card`}>
                <div className="skeleton-loader__card-header">
                    <div className="skeleton-loader__avatar"></div>
                    <div className="skeleton-loader__card-content">
                        <div className="skeleton-loader__line skeleton-loader__line--title"></div>
                        <div className="skeleton-loader__line skeleton-loader__line--subtitle"></div>
                    </div>
                </div>
                <div className="skeleton-loader__card-body">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="skeleton-loader__line skeleton-loader__line--body"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'circular') {
        return (
            <div
                className={`${baseClasses} skeleton-loader--circular`}
                style={{ width: height, height }}
            />
        );
    }

    if (variant === 'rectangular') {
        return (
            <div
                className={`${baseClasses} skeleton-loader--rectangular`}
                style={{ height }}
            />
        );
    }

    // Text variant (default)
    return (
        <div className={`${baseClasses} skeleton-loader--text`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={`skeleton-loader__line ${index === lines - 1 ? 'skeleton-loader__line--last' : ''}`}
                    style={{ height }}
                />
            ))}
        </div>
    );
};

// プリセット付きのスケルトンコンポーネント
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
    <SkeletonLoader variant="card" className={className} />
);

export const SkeletonAvatar: React.FC<{ size?: string; className?: string }> = ({
    size = '40px',
    className = ''
}) => (
    <SkeletonLoader variant="circular" height={size} className={className} />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
    lines = 3,
    className = ''
}) => (
    <SkeletonLoader variant="text" lines={lines} className={className} />
);

export const SkeletonImage: React.FC<{ height?: string; className?: string }> = ({
    height = '200px',
    className = ''
}) => (
    <SkeletonLoader variant="rectangular" height={height} className={className} />
);

// セクション別のスケルトンコンポーネント
export const SkeletonProfile: React.FC = () => (
    <div className="skeleton-profile">
        <div className="skeleton-profile__avatar">
            <SkeletonAvatar size="120px" />
        </div>
        <div className="skeleton-profile__content">
            <SkeletonLoader variant="text" height="32px" className="skeleton-profile__name" />
            <SkeletonLoader variant="text" height="20px" lines={2} className="skeleton-profile__description" />
            <div className="skeleton-profile__social">
                {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonAvatar key={index} size="32px" />
                ))}
            </div>
        </div>
    </div>
);

export const SkeletonSkills: React.FC = () => (
    <div className="skeleton-skills">
        <div className="skeleton-skills__tabs">
            {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonLoader key={index} variant="rectangular" height="40px" className="skeleton-skills__tab" />
            ))}
        </div>
        <div className="skeleton-skills__content">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="skeleton-skills__item">
                    <SkeletonAvatar size="48px" />
                    <SkeletonLoader variant="text" height="16px" />
                    <SkeletonLoader variant="rectangular" height="8px" className="skeleton-skills__progress" />
                </div>
            ))}
        </div>
    </div>
);

export const SkeletonWorks: React.FC = () => (
    <div className="skeleton-works">
        {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-works__item">
                <SkeletonImage height="200px" />
                <div className="skeleton-works__content">
                    <SkeletonLoader variant="text" height="24px" className="skeleton-works__title" />
                    <SkeletonLoader variant="text" height="16px" lines={3} />
                    <div className="skeleton-works__tags">
                        {Array.from({ length: 3 }).map((_, tagIndex) => (
                            <SkeletonLoader key={tagIndex} variant="rectangular" height="24px" className="skeleton-works__tag" />
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonBlog: React.FC = () => (
    <div className="skeleton-blog">
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton-blog__item">
                <SkeletonImage height="150px" />
                <div className="skeleton-blog__content">
                    <SkeletonLoader variant="text" height="20px" className="skeleton-blog__title" />
                    <SkeletonLoader variant="text" height="14px" lines={2} />
                    <div className="skeleton-blog__meta">
                        <SkeletonLoader variant="rectangular" height="16px" className="skeleton-blog__date" />
                        <SkeletonLoader variant="rectangular" height="16px" className="skeleton-blog__category" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);