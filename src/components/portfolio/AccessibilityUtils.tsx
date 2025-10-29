"use client";

import React, { useEffect, useState } from 'react';

// スクリーンリーダー専用テキスト
interface ScreenReaderOnlyProps {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
    children,
    as: Component = 'span'
}) => (
    <Component className="sr-only">
        {children}
    </Component>
);

// フォーカス管理フック
export const useFocusManagement = () => {
    const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

    const trapFocus = (container: HTMLElement) => {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);
        return () => container.removeEventListener('keydown', handleTabKey);
    };

    const restoreFocus = () => {
        if (focusedElement) {
            focusedElement.focus();
            setFocusedElement(null);
        }
    };

    const saveFocus = () => {
        setFocusedElement(document.activeElement as HTMLElement);
    };

    return { trapFocus, restoreFocus, saveFocus };
};

// キーボードナビゲーション対応ボタン
interface AccessibleButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    disabled?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    style?: React.CSSProperties;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
    children,
    onClick,
    onKeyDown,
    disabled = false,
    ariaLabel,
    ariaDescribedBy,
    className = '',
    type = 'button',
    style,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
        }
        onKeyDown?.(e);
    };

    return (
        <button
            type={type}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            className={`accessible-button ${className}`}
            tabIndex={disabled ? -1 : 0}
            style={style}
        >
            {children}
        </button>
    );
};

// アクセシブルなリンク
interface AccessibleLinkProps {
    href: string;
    children: React.ReactNode;
    external?: boolean;
    ariaLabel?: string;
    className?: string;
}

export const AccessibleLink: React.FC<AccessibleLinkProps> = ({
    href,
    children,
    external = false,
    ariaLabel,
    className = '',
}) => {
    return (
        <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={ariaLabel}
            className={`accessible-link ${className}`}
        >
            {children}
            {external && (
                <ScreenReaderOnly>
                    (新しいタブで開きます)
                </ScreenReaderOnly>
            )}
        </a>
    );
};

// スキップリンク
interface SkipLinkProps {
    href: string;
    children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
    return (
        <a
            href={href}
            className="skip-link"
            onFocus={(e) => e.currentTarget.classList.add('skip-link--visible')}
            onBlur={(e) => e.currentTarget.classList.remove('skip-link--visible')}
        >
            {children}
        </a>
    );
};

// ライブリージョン（動的コンテンツの通知）
interface LiveRegionProps {
    children: React.ReactNode;
    politeness?: 'polite' | 'assertive' | 'off';
    atomic?: boolean;
    className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
    children,
    politeness = 'polite',
    atomic = false,
    className = '',
}) => {
    return (
        <div
            aria-live={politeness}
            aria-atomic={atomic}
            className={`live-region ${className}`}
        >
            {children}
        </div>
    );
};

// プログレスバー（アクセシブル）
interface AccessibleProgressProps {
    value: number;
    max?: number;
    label: string;
    showValue?: boolean;
    className?: string;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({
    value,
    max = 100,
    label,
    showValue = true,
    className = '',
}) => {
    const percentage = Math.round((value / max) * 100);

    return (
        <div className={`accessible-progress ${className}`}>
            <div className="accessible-progress__label">
                {label}
                {showValue && (
                    <span className="accessible-progress__value">
                        {percentage}%
                    </span>
                )}
            </div>
            <div
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-label={`${label}: ${percentage}%`}
                className="accessible-progress__bar"
            >
                <div
                    className="accessible-progress__fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// モーダルダイアログ（アクセシブル）
interface AccessibleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className = '',
}) => {
    const { trapFocus, restoreFocus, saveFocus } = useFocusManagement();
    const modalRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            saveFocus();
            document.body.style.overflow = 'hidden';

            if (modalRef.current) {
                const cleanup = trapFocus(modalRef.current);
                modalRef.current.focus();
                return cleanup;
            }
        } else {
            document.body.style.overflow = '';
            restoreFocus();
        }
    }, [isOpen, trapFocus, restoreFocus, saveFocus]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="accessible-modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className={`accessible-modal ${className}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="accessible-modal__header">
                    <h2 id="modal-title" className="accessible-modal__title">
                        {title}
                    </h2>
                    <AccessibleButton
                        onClick={onClose}
                        ariaLabel="モーダルを閉じる"
                        className="accessible-modal__close"
                    >
                        ×
                    </AccessibleButton>
                </div>
                <div className="accessible-modal__content">
                    {children}
                </div>
            </div>
        </div>
    );
};

// カラーコントラストチェッカー（開発用）
export const useColorContrast = () => {
    const checkContrast = (foreground: string, background: string): number => {
        // 簡易的なコントラスト比計算
        const getLuminance = (color: string): number => {
            // RGB値を取得（簡易実装）
            const rgb = color.match(/\d+/g);
            if (!rgb) return 0;

            const [r, g, b] = rgb.map(x => {
                const val = parseInt(x) / 255;
                return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
            });

            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const l1 = getLuminance(foreground);
        const l2 = getLuminance(background);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);

        return (lighter + 0.05) / (darker + 0.05);
    };

    const isAccessible = (ratio: number, level: 'AA' | 'AAA' = 'AA'): boolean => {
        return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
    };

    return { checkContrast, isAccessible };
};