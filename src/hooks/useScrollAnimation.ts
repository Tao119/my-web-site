"use client";

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    triggerOnce?: boolean;
    rootMargin?: string;
}

export const useScrollAnimation = ({
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px',
}: UseScrollAnimationOptions = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.disconnect();
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold, triggerOnce, rootMargin]);

    return { ref, isVisible };
};

// スクロール位置を監視するフック
export const useScrollPosition = () => {
    const [scrollY, setScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollPosition = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', updateScrollPosition, { passive: true });
        return () => window.removeEventListener('scroll', updateScrollPosition);
    }, []);

    return { scrollY, scrollDirection };
};

// パララックス効果のフック
export const useParallax = (speed: number = 0.5) => {
    const [offset, setOffset] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const scrolled = window.scrollY;
                const rate = scrolled * speed;
                setOffset(rate);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return { ref, offset };
};

// スムーズスクロールのフック
export const useSmoothScroll = () => {
    const scrollToElement = (elementId: string, offset: number = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return { scrollToElement, scrollToTop };
};