import { useState, useEffect } from 'react';

export type AdminTheme = 'light' | 'dark';

export const useAdminTheme = () => {
    const [theme, setTheme] = useState<AdminTheme>('light'); // Default to light for admin
    const [isLoading, setIsLoading] = useState(true);

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('admin-theme') as AdminTheme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            setTheme(savedTheme);
        } else {
            // Default to light mode for admin
            setTheme('light');
        }
        setIsLoading(false);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (isLoading) return;

        // Remove existing theme classes
        document.documentElement.classList.remove('admin-light', 'admin-dark');
        document.body.classList.remove('admin-light', 'admin-dark');

        // Add current theme class
        document.documentElement.classList.add(`admin-${theme}`);
        document.body.classList.add(`admin-${theme}`);

        // Set data attribute for CSS
        document.documentElement.setAttribute('data-admin-theme', theme);

        // Save to localStorage
        localStorage.setItem('admin-theme', theme);

        // Update CSS custom properties for admin theme
        const root = document.documentElement;
        if (theme === 'dark') {
            root.style.setProperty('--admin-bg-primary', '#0f172a');
            root.style.setProperty('--admin-bg-secondary', '#1e293b');
            root.style.setProperty('--admin-bg-tertiary', '#334155');
            root.style.setProperty('--admin-text-primary', '#f8fafc');
            root.style.setProperty('--admin-text-secondary', '#cbd5e1');
            root.style.setProperty('--admin-border-color', '#475569');
            root.style.setProperty('--admin-shadow-color', 'rgba(0, 0, 0, 0.5)');
        } else {
            root.style.setProperty('--admin-bg-primary', '#ffffff');
            root.style.setProperty('--admin-bg-secondary', '#f8fafc');
            root.style.setProperty('--admin-bg-tertiary', '#e2e8f0');
            root.style.setProperty('--admin-text-primary', '#0f172a');
            root.style.setProperty('--admin-text-secondary', '#475569');
            root.style.setProperty('--admin-border-color', '#000000');
            root.style.setProperty('--admin-shadow-color', 'rgba(0, 0, 0, 1)');
        }
    }, [theme, isLoading]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const setLightTheme = () => {
        setTheme('light');
    };

    const setDarkTheme = () => {
        setTheme('dark');
    };

    return {
        theme,
        isLoading,
        toggleTheme,
        setLightTheme,
        setDarkTheme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
    };
};