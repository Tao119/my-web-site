"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
    threshold?: number | number[];
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useIntersectionObserver = <T extends HTMLElement = HTMLElement>({
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true
}: UseIntersectionObserverOptions = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const elementRef = useRef<T>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isVisible = entry.isIntersecting;

                if (isVisible && (!triggerOnce || !hasTriggered)) {
                    setIsIntersecting(true);
                    if (triggerOnce) {
                        setHasTriggered(true);
                    }
                } else if (!triggerOnce && !isVisible) {
                    setIsIntersecting(false);
                }
            },
            {
                threshold,
                rootMargin
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce, hasTriggered]);

    return {
        elementRef,
        isIntersecting,
        hasTriggered
    };
};