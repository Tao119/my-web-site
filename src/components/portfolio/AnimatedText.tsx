"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedTextProps {
    text: string;
    animation?: "fadeInUp" | "slideInLeft" | "slideInRight" | "scaleIn" | "rotateIn" | "bounceIn";
    delay?: number;
    duration?: number;
    className?: string;
    children?: React.ReactNode;
    splitBy?: "word" | "char" | "none";
    stagger?: number;
}

const AnimatedText = ({
    text,
    animation = "fadeInUp",
    delay = 0,
    duration = 600,
    className = "",
    children,
    splitBy = "word",
    stagger = 100
}: AnimatedTextProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setTimeout(() => {
                        setIsVisible(true);
                        setHasAnimated(true);
                    }, delay);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [delay, hasAnimated]);

    const getAnimationClass = (index: number = 0) => {
        const baseClass = `animated-text animated-text--${animation}`;
        const visibleClass = isVisible ? "animated-text--visible" : "";
        const delayStyle = splitBy !== "none" ? { animationDelay: `${index * stagger}ms` } : {};

        return {
            className: `${baseClass} ${visibleClass}`,
            style: delayStyle
        };
    };

    const renderSplitText = () => {
        if (splitBy === "none") {
            return (
                <span {...getAnimationClass()}>
                    {children || text}
                </span>
            );
        }

        const splitText = splitBy === "word" ? text.split(" ") : text.split("");
        const separator = splitBy === "word" ? " " : "";

        return splitText.map((part, index) => (
            <span
                key={index}
                {...getAnimationClass(index)}
                className={`${getAnimationClass(index).className} animated-text__${splitBy}`}
                style={{
                    ...getAnimationClass(index).style,
                    animationDuration: `${duration}ms`
                }}
            >
                {part}
                {splitBy === "word" && index < splitText.length - 1 && separator}
            </span>
        ));
    };

    return (
        <div ref={elementRef} className={`animated-text-container ${className}`}>
            {children ? (
                <span {...getAnimationClass()}>
                    {children}
                </span>
            ) : (
                renderSplitText()
            )}
        </div>
    );
};

export default AnimatedText;