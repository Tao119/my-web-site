"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { InputProps } from "@/types/portfolio";

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    ({ type = "text", placeholder, value, onChange, error, disabled, className, ...props }, ref) => {
        const baseClasses = [
            "border-4 border-black bg-white px-4 py-3 rounded-neo",
            "font-medium transition-all duration-150",
            "focus:outline-none focus:shadow-neo",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "placeholder:text-gray-500",
        ];

        const errorClasses = error ? [
            "border-red-500 bg-red-50",
            "focus:border-red-500 focus:shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]",
        ] : [];

        const classes = cn(baseClasses, errorClasses, className);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onChange?.(e.target.value);
        };

        if (type === "textarea") {
            return (
                <div className="w-full">
                    <textarea
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        className={cn(classes, "min-h-[120px] resize-vertical")}
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        disabled={disabled}
                        {...props}
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                            {error}
                        </p>
                    )}
                </div>
            );
        }

        return (
            <div className="w-full">
                <input
                    ref={ref as React.Ref<HTMLInputElement>}
                    type={type}
                    className={classes}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

// Label component for forms
export const Label: React.FC<{
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
    className?: string;
}> = ({ children, htmlFor, required, className }) => (
    <label
        htmlFor={htmlFor}
        className={cn(
            "block text-sm font-bold text-black mb-2",
            className
        )}
    >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
    </label>
);

// Form group component
export const FormGroup: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={cn("mb-6", className)}>
        {children}
    </div>
);

export default Input;