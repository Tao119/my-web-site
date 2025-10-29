"use client";

import { useState, useEffect } from "react";

export const usePortfolioTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

    // Initialize theme from localStorage
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('portfolio-dark-mode');
        if (savedDarkMode) {
            setIsDarkMode(JSON.parse(savedDarkMode));
        } else {
            // Default to dark mode for portfolio theme
            setIsDarkMode(true);
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem('portfolio-dark-mode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return {
        isDarkMode,
        toggleDarkMode,
    };
};