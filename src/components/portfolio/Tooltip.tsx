"use client";

import { useState, useRef, useEffect } from "react";

interface TooltipProps {
    content: string | React.ReactNode;
    children: React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    delay?: number;
    className?: string;
}

const Tooltip = ({
    content,
    children,
    position = "top",
    delay = 300,
    className = ""
}: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const timeoutRef = useRef<NodeJS.Timeout>();
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            updatePosition();
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        let x = 0;
        let y = 0;

        switch (position) {
            case "top":
                x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                y = triggerRect.top - tooltipRect.height - 8;
                break;
            case "bottom":
                x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                y = triggerRect.bottom + 8;
                break;
            case "left":
                x = triggerRect.left - tooltipRect.width - 8;
                y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                break;
            case "right":
                x = triggerRect.right + 8;
                y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                break;
        }

        // Keep tooltip within viewport
        if (x < 8) x = 8;
        if (x + tooltipRect.width > viewport.width - 8) {
            x = viewport.width - tooltipRect.width - 8;
        }
        if (y < 8) y = 8;
        if (y + tooltipRect.height > viewport.height - 8) {
            y = viewport.height - tooltipRect.height - 8;
        }

        setTooltipPosition({ x, y });
    };

    useEffect(() => {
        if (isVisible) {
            updatePosition();
        }
    }, [isVisible]);

    useEffect(() => {
        const handleResize = () => {
            if (isVisible) {
                updatePosition();
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isVisible]);

    return (
        <>
            <div
                ref={triggerRef}
                className={`neo-tooltip-trigger ${className}`}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`neo-tooltip neo-tooltip--${position} ${isVisible ? 'neo-tooltip--visible' : ''}`}
                    style={{
                        position: 'fixed',
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        zIndex: 9999,
                    }}
                >
                    <div className="neo-tooltip__content">
                        {content}
                    </div>
                    <div className={`neo-tooltip__arrow neo-tooltip__arrow--${position}`} />
                </div>
            )}
        </>
    );
};

export default Tooltip;