"use client";

import React, { useState, useRef, useEffect } from 'react';

// ホバー時の拡大効果
interface HoverScaleProps {
    children: React.ReactNode;
    scale?: number;
    duration?: number;
    className?: string;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
    children,
    scale = 1.05,
    duration = 0.2,
    className = '',
}) => {
    return (
        <div
            className={`hover-scale ${className}`}
            style={{
                transition: `transform ${duration}s ease`,
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = `scale(${scale})`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            {children}
        </div>
    );
};

// クリック時のリップル効果
interface RippleEffectProps {
    children: React.ReactNode;
    color?: string;
    duration?: number;
    className?: string;
    onClick?: () => void;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
    children,
    color = 'rgba(255, 255, 255, 0.6)',
    duration = 600,
    className = '',
    onClick,
}) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const nextRippleId = useRef(0);

    const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newRipple = {
            id: nextRippleId.current++,
            x,
            y,
        };

        setRipples(prev => [...prev, newRipple]);

        // リップルを削除
        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, duration);

        onClick?.();
    };

    return (
        <div
            className={`ripple-container ${className}`}
            style={{ position: 'relative', overflow: 'hidden' }}
            onClick={createRipple}
        >
            {children}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="ripple"
                    style={{
                        position: 'absolute',
                        left: ripple.x,
                        top: ripple.y,
                        width: '0',
                        height: '0',
                        borderRadius: '50%',
                        background: color,
                        transform: 'translate(-50%, -50%)',
                        animation: `ripple-animation ${duration}ms ease-out`,
                        pointerEvents: 'none',
                    }}
                />
            ))}
        </div>
    );
};

// フローティングアクションボタン
interface FloatingActionButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    color?: string;
    size?: 'small' | 'medium' | 'large';
    tooltip?: string;
    className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    icon,
    onClick,
    position = 'bottom-right',
    color = '#007bff',
    size = 'medium',
    tooltip,
    className = '',
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const sizeClasses = {
        small: 'w-12 h-12 text-sm',
        medium: 'w-14 h-14 text-base',
        large: 'w-16 h-16 text-lg',
    };

    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6',
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-50`}>
            {tooltip && showTooltip && (
                <div className="fab-tooltip">
                    {tooltip}
                </div>
            )}
            <RippleEffect
                onClick={onClick}
                className={`fab ${sizeClasses[size]} ${className}`}
                color="rgba(255, 255, 255, 0.3)"
            >
                <button
                    className="fab-button"
                    style={{ backgroundColor: color }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {icon}
                </button>
            </RippleEffect>
        </div>
    );
};

// パルス効果
interface PulseEffectProps {
    children: React.ReactNode;
    color?: string;
    duration?: number;
    intensity?: number;
    className?: string;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
    children,
    color = '#007bff',
    duration = 2,
    intensity = 0.8,
    className = '',
}) => {
    return (
        <div
            className={`pulse-effect ${className}`}
            style={{
                position: 'relative',
                display: 'inline-block',
            }}
        >
            {children}
            <div
                className="pulse-ring"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    border: `2px solid ${color}`,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: `pulse-animation ${duration}s ease-out infinite`,
                    opacity: intensity,
                }}
            />
        </div>
    );
};

// スライドイン効果
interface SlideInProps {
    children: React.ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    duration?: number;
    delay?: number;
    distance?: number;
    className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
    children,
    direction = 'up',
    duration = 0.6,
    delay = 0,
    distance = 30,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay * 1000);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    const getTransform = () => {
        if (isVisible) return 'translate(0, 0)';

        switch (direction) {
            case 'left':
                return `translate(-${distance}px, 0)`;
            case 'right':
                return `translate(${distance}px, 0)`;
            case 'up':
                return `translate(0, ${distance}px)`;
            case 'down':
                return `translate(0, -${distance}px)`;
            default:
                return `translate(0, ${distance}px)`;
        }
    };

    return (
        <div
            ref={elementRef}
            className={`slide-in ${className}`}
            style={{
                transform: getTransform(),
                opacity: isVisible ? 1 : 0,
                transition: `all ${duration}s ease-out`,
            }}
        >
            {children}
        </div>
    );
};

// カウントアップアニメーション
interface CountUpProps {
    end: number;
    start?: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
    end,
    start = 0,
    duration = 2,
    suffix = '',
    prefix = '',
    className = '',
}) => {
    const [count, setCount] = useState(start);
    const [hasStarted, setHasStarted] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);

                    const increment = (end - start) / (duration * 60); // 60fps
                    let current = start;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, 1000 / 60);

                    return () => clearInterval(timer);
                }
            },
            { threshold: 0.5 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [end, start, duration, hasStarted]);

    return (
        <span ref={elementRef} className={`count-up ${className}`}>
            {prefix}{count}{suffix}
        </span>
    );
};

// プログレスバーアニメーション
interface AnimatedProgressProps {
    value: number;
    max?: number;
    height?: number;
    color?: string;
    backgroundColor?: string;
    duration?: number;
    delay?: number;
    showValue?: boolean;
    className?: string;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
    value,
    max = 100,
    height = 8,
    color = '#007bff',
    backgroundColor = '#e9ecef',
    duration = 1.5,
    delay = 0,
    showValue = false,
    className = '',
}) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);

                    setTimeout(() => {
                        setAnimatedValue(value);
                    }, delay * 1000);
                }
            },
            { threshold: 0.5 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [value, delay, hasStarted]);

    const percentage = (animatedValue / max) * 100;

    return (
        <div ref={elementRef} className={`animated-progress ${className}`}>
            <div
                className="progress-bar"
                style={{
                    width: '100%',
                    height: `${height}px`,
                    backgroundColor,
                    borderRadius: `${height / 2}px`,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div
                    className="progress-fill"
                    style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: color,
                        transition: `width ${duration}s ease-out`,
                        borderRadius: `${height / 2}px`,
                    }}
                />
            </div>
            {showValue && (
                <div className="progress-value" style={{ marginTop: '4px', fontSize: '12px' }}>
                    {Math.round(animatedValue)}/{max}
                </div>
            )}
        </div>
    );
};
// インタラクティブボタン
interface InteractiveButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    className = '',
    type = 'button',
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsPressed(false);

    const baseClasses = 'interactive-button';
    const variantClasses = `interactive-button--${variant}`;
    const sizeClasses = `interactive-button--${size}`;
    const stateClasses = [
        disabled && 'interactive-button--disabled',
        loading && 'interactive-button--loading',
        isPressed && 'interactive-button--pressed',
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {loading ? (
                <span className="interactive-button__spinner">
                    <span className="spinner"></span>
                </span>
            ) : (
                children
            )}
        </button>
    );
};

// フローティングラベル入力
interface FloatingLabelInputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    className = '',
    placeholder = '',
    multiline = false,
    rows = 4,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = `floating-input-${Math.random().toString(36).substr(2, 9)}`;

    const hasValue = value.length > 0;
    const isLabelFloating = isFocused || hasValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const InputComponent = multiline ? 'textarea' : 'input';

    return (
        <div className={`floating-label-input ${error ? 'floating-label-input--error' : ''} ${className}`}>
            <div className="floating-label-input__container">
                <InputComponent
                    id={inputId}
                    type={multiline ? undefined : type}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={multiline ? rows : undefined}
                    className="floating-label-input__field"
                    required={required}
                />
                <label
                    htmlFor={inputId}
                    className={`floating-label-input__label ${isLabelFloating ? 'floating-label-input__label--floating' : ''}`}
                >
                    {label}
                    {required && <span className="floating-label-input__required">*</span>}
                </label>
            </div>
            {error && (
                <div className="floating-label-input__error">
                    {error}
                </div>
            )}
        </div>
    );
};