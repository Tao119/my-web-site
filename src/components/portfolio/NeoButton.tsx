import React from "react";

interface NeoButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: "primary" | "secondary" | "accent" | "outline";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    target?: "_blank" | "_self";
    rel?: string;
}

const NeoButton = ({
    children,
    onClick,
    href,
    variant = "primary",
    size = "medium",
    disabled = false,
    className = "",
    type = "button",
    target,
    rel,
}: NeoButtonProps) => {
    const baseClasses = `neo-button neo-button--${variant} neo-button--${size} ${className}`;

    if (href) {
        return (
            <a
                href={href}
                className={baseClasses}
                target={target}
                rel={rel}
                onClick={onClick}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={baseClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default NeoButton;