"use client";

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollAnimationProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'rotate';
    delay?: number;
    className?: string;
    threshold?: number;
    triggerOnce?: boolean;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
    children,
    animation = 'fade-up',
    delay = 0,
    className = '',
    threshold = 0.1,
    triggerOnce = true,
}) => {
    const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

    const animationClass = `scroll-animation scroll-animation--${animation}`;
    const delayClass = delay > 0 ? `scroll-animation--delay-${delay}` : '';
    const visibleClass = isVisible ? 'visible' : '';

    return (
        <div
            ref={ref}
            className={`${animationClass} ${delayClass} ${visibleClass} ${className}`.trim()}
            style={{ transitionDelay: delay > 500 ? `${delay}ms` : undefined }}
        >
            {children}
        </div>
    );
};

interface StaggerAnimationProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
    triggerOnce?: boolean;
}

export const StaggerAnimation: React.FC<StaggerAnimationProps> = ({
    children,
    className = '',
    threshold = 0.1,
    triggerOnce = true,
}) => {
    const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

    return (
        <div
            ref={ref}
            className={`stagger-animation ${isVisible ? 'visible' : ''} ${className}`.trim()}
        >
            {children}
        </div>
    );
};

interface TextRevealProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
    triggerOnce?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
    children,
    className = '',
    threshold = 0.1,
    triggerOnce = true,
}) => {
    const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

    return (
        <div
            ref={ref}
            className={`text-reveal ${isVisible ? 'visible' : ''} ${className}`.trim()}
        >
            <div className="text-reveal-inner">
                {children}
            </div>
        </div>
    );
};

interface CardAnimationProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
    triggerOnce?: boolean;
}

export const CardAnimation: React.FC<CardAnimationProps> = ({
    children,
    className = '',
    threshold = 0.1,
    triggerOnce = true,
}) => {
    const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

    return (
        <div
            ref={ref}
            className={`card-animation ${isVisible ? 'visible' : ''} ${className}`.trim()}
        >
            {children}
        </div>
    );
};