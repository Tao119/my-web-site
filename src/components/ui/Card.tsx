"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CardProps } from "@/types/portfolio";

const Card: React.FC<CardProps> = ({
    variant = "default",
    children,
    className,
    onClick,
    ...props
}) => {
    const baseClasses = [
        "border-4 border-black rounded-neo p-6",
        "transition-all duration-150",
    ];

    const variantClasses = {
        default: [
            "bg-white shadow-neo-lg",
            onClick && "cursor-pointer hover:shadow-neo-xl hover:-translate-y-1",
        ],
        accent: [
            "bg-neon-lime text-black shadow-neo-lg",
            onClick && "cursor-pointer hover:shadow-neo-xl hover:-translate-y-1",
        ],
        dark: [
            "bg-dark-surface border-white text-dark-text shadow-neo-lg",
            onClick && "cursor-pointer hover:shadow-neo-xl hover:-translate-y-1",
        ],
        glass: [
            "backdrop-blur-md bg-white/10 border-white/20 shadow-lg",
            "border-2", // Thinner border for glass effect
            onClick && "cursor-pointer hover:bg-white/20 hover:-translate-y-1",
        ],
    };

    const classes = cn(
        baseClasses,
        variantClasses[variant],
        className
    );

    const Component = onClick ? "button" : "div";

    return (
        <Component
            className={classes}
            onClick={onClick}
            {...props}
        >
            {children}
        </Component>
    );
};

// Sub-components for better composition
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => (
    <div className={cn("mb-4", className)}>
        {children}
    </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => (
    <h3 className={cn("text-xl font-bold neo-heading", className)}>
        {children}
    </h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => (
    <div className={cn("neo-text", className)}>
        {children}
    </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => (
    <div className={cn("mt-4 pt-4 border-t-2 border-black", className)}>
        {children}
    </div>
);

export default Card;