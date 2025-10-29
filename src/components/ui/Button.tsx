"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/types/portfolio";

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    children,
    onClick,
    className,
    ...props
}) => {
    const baseClasses = [
        "inline-flex items-center justify-center font-bold border-4 border-black",
        "transition-all duration-150 cursor-pointer focus:outline-none",
        "hover:translate-x-[2px] hover:translate-y-[2px]",
        "active:translate-x-[4px] active:translate-y-[4px]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "disabled:hover:translate-x-0 disabled:hover:translate-y-0",
    ];

    const variantClasses = {
        primary: [
            "bg-navy-900 text-white border-navy-900",
            "shadow-neo hover:shadow-neo-sm active:shadow-none",
            "hover:bg-navy-800 hover:border-navy-800",
        ],
        secondary: [
            "bg-neon-yellow text-black border-black",
            "shadow-neo hover:shadow-neo-sm active:shadow-none",
            "hover:bg-yellow-300",
        ],
        accent: [
            "bg-neon-pink text-white border-black",
            "shadow-neo hover:shadow-neo-sm active:shadow-none",
            "hover:bg-pink-600",
        ],
        outline: [
            "bg-transparent text-black border-black",
            "shadow-neo hover:shadow-neo-sm active:shadow-none",
            "hover:bg-black hover:text-white",
        ],
        ghost: [
            "bg-transparent text-black border-transparent",
            "hover:bg-gray-100 hover:border-black",
            "shadow-none hover:shadow-neo-sm",
        ],
    };

    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl",
    };

    const classes = cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
    );

    return (
        <button
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;