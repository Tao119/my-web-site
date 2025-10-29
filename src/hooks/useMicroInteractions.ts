"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

// Button click feedback hook
export const useButtonFeedback = () => {
    const [isPressed, setIsPressed] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handlePress = useCallback(() => {
        setIsPressed(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setIsPressed(false);
        }, 150);
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { isPressed, handlePress };
};

// Hover state hook
export const useHoverState = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return {
        isHovered,
        hoverProps: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
        },
    };
};

// Focus state hook
export const useFocusState = () => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    return {
        isFocused,
        focusProps: {
            onFocus: handleFocus,
            onBlur: handleBlur,
        },
    };
};

// Loading state hook
export const useLoadingState = (initialState = false) => {
    const [isLoading, setIsLoading] = useState(initialState);

    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
        startLoading();
        try {
            const result = await asyncFn();
            return result;
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    return {
        isLoading,
        startLoading,
        stopLoading,
        withLoading,
    };
};

// Ripple effect hook
export const useRippleEffect = () => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const nextRippleId = useRef(0);

    const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newRipple = {
            id: nextRippleId.current++,
            x,
            y,
        };

        setRipples(prev => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
    }, []);

    return { ripples, createRipple };
};

// Form field animation hook
export const useFormFieldAnimation = (value: string) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value.length > 0;
    const isActive = isFocused || hasValue;

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    return {
        isActive,
        isFocused,
        hasValue,
        fieldProps: {
            onFocus: handleFocus,
            onBlur: handleBlur,
        },
    };
};

// Toast notification hook
export const useToast = () => {
    const [toasts, setToasts] = useState<Array<{
        id: number;
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
        duration?: number;
    }>>([]);
    const nextToastId = useRef(0);

    const showToast = useCallback((
        message: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'info',
        duration = 3000
    ) => {
        const newToast = {
            id: nextToastId.current++,
            message,
            type,
            duration,
        };

        setToasts(prev => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
            }, duration);
        }

        return newToast.id;
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        showToast,
        removeToast,
        clearAllToasts,
    };
};

// Smooth counter animation hook
export const useSmoothCounter = (
    targetValue: number,
    duration = 1000,
    startOnMount = true
) => {
    const [currentValue, setCurrentValue] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef<number>();
    const startTimeRef = useRef<number>();

    const startAnimation = useCallback(() => {
        if (isAnimating) return;

        setIsAnimating(true);
        startTimeRef.current = Date.now();

        const animate = () => {
            const elapsed = Date.now() - (startTimeRef.current || 0);
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const newValue = Math.round(targetValue * easedProgress);

            setCurrentValue(newValue);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [targetValue, duration, isAnimating]);

    useEffect(() => {
        if (startOnMount) {
            startAnimation();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [startOnMount, startAnimation]);

    return {
        currentValue,
        isAnimating,
        startAnimation,
    };
};

// Parallax scroll hook
export const useParallax = (speed = 0.5) => {
    const [offset, setOffset] = useState(0);
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!elementRef.current) return;

            const rect = elementRef.current.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = scrolled * -speed;

            setOffset(rate);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return { offset, ref: elementRef };
};