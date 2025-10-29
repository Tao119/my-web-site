"use client";

import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
    start?: number;
    end: number;
    duration?: number;
    decimals?: number;
    startOnMount?: boolean;
    easing?: (t: number) => number;
}

export const useCountUp = ({
    start = 0,
    end,
    duration = 2000,
    decimals = 0,
    startOnMount = false,
    easing = (t: number) => t * t * (3 - 2 * t) // smooth step
}: UseCountUpOptions) => {
    const [count, setCount] = useState(start);
    const [isAnimating, setIsAnimating] = useState(false);
    const frameRef = useRef<number>();
    const startTimeRef = useRef<number>();

    const startAnimation = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        startTimeRef.current = performance.now();

        const animate = (currentTime: number) => {
            if (!startTimeRef.current) return;

            const elapsed = currentTime - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = easing(progress);
            const currentCount = start + (end - start) * easedProgress;

            setCount(Number(currentCount.toFixed(decimals)));

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };

        frameRef.current = requestAnimationFrame(animate);
    };

    const reset = () => {
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
        }
        setCount(start);
        setIsAnimating(false);
        startTimeRef.current = undefined;
    };

    useEffect(() => {
        if (startOnMount) {
            startAnimation();
        }

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [startOnMount]);

    return {
        count,
        isAnimating,
        start: startAnimation,
        reset
    };
};