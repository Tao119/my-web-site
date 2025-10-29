"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { smoothScrollToElement, getHeaderHeight } from "@/lib/scroll-utils";
import { SkipLink, AccessibleButton, useFocusManagement } from "./AccessibilityUtils";

interface NavigationProps {
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

const ResponsiveNavigation = ({ isDarkMode, onToggleDarkMode }: NavigationProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState("");
    const pathname = usePathname();
    const mobileMenuRef = useRef<HTMLElement>(null);
    const { trapFocus, restoreFocus, saveFocus } = useFocusManagement();

    // Navigation items
    const navigationItems = useMemo(() => [
        { id: "hero", label: "Home", href: "#hero" },
        { id: "profile", label: "Profile", href: "#profile" },
        { id: "skills", label: "Skills", href: "#skills" },
        { id: "works", label: "Projects", href: "#works" },
        { id: "blog", label: "Blog", href: "#blog" },
        { id: "contact", label: "Contact", href: "#contact" },
    ], []);

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);

            // Update current section based on scroll position
            const sections = navigationItems.map(item => item.id);
            let current = "";

            // Calculate header height for accurate section detection
            const headerHeight = getHeaderHeight();
            const threshold = headerHeight + 20; // Add some buffer

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= threshold && rect.bottom >= threshold) {
                        current = sectionId;
                        break;
                    }
                }
            }

            if (current !== currentSection) {
                setCurrentSection(current);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial call

        return () => window.removeEventListener("scroll", handleScroll);
    }, [currentSection, navigationItems]);

    // Handle smooth scroll
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        smoothScrollToElement(targetId);
        setIsMenuOpen(false);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMenuOpen && !(event.target as Element).closest('.neo-nav')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    // Prevent body scroll when menu is open and manage focus
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            saveFocus();

            // Focus trap for mobile menu
            if (mobileMenuRef.current) {
                const cleanup = trapFocus(mobileMenuRef.current);
                // Focus first menu item
                const firstMenuItem = mobileMenuRef.current.querySelector('a');
                if (firstMenuItem) {
                    (firstMenuItem as HTMLElement).focus();
                }
                return cleanup;
            }
        } else {
            document.body.style.overflow = 'unset';
            restoreFocus();
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen, trapFocus, restoreFocus, saveFocus]);

    // Handle escape key for mobile menu
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMenuOpen]);

    // Check if we're in admin area
    const isAdminArea = pathname?.includes('/admin');

    return (
        <>
            {/* Skip Links */}
            <SkipLink href="#main-content">
                メインコンテンツにスキップ
            </SkipLink>
            <SkipLink href="#navigation">
                ナビゲーションにスキップ
            </SkipLink>

            <header
                className={`neo-nav ${isScrolled ? 'neo-nav--scrolled' : ''} ${isDarkMode ? 'neo-nav--dark' : ''} ${isAdminArea ? 'neo-nav--admin' : ''}`}
                role="banner"
            >
                <div className="neo-nav__container">
                    {/* Logo */}
                    <Link
                        href="/portfolio"
                        className="neo-nav__logo"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Tao Matsumura Portfolio - ホームページに戻る"
                    >
                        <span className="neo-nav__logo-text">Tao Matsumura</span>
                        <span className="neo-nav__logo-subtitle">Portfolio</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="neo-nav__desktop" id="navigation" aria-label="メインナビゲーション">
                        <ul className="neo-nav__list" role="menubar">
                            {pathname === "/portfolio" ? (
                                navigationItems.map((item) => (
                                    <li key={item.id} className="neo-nav__item" role="none">
                                        <a
                                            href={item.href}
                                            className={`neo-nav__link ${currentSection === item.id ? 'neo-nav__link--active' : ''}`}
                                            onClick={(e) => handleSmoothScroll(e, item.id)}
                                            role="menuitem"
                                            aria-current={currentSection === item.id ? 'page' : undefined}
                                            aria-label={`${item.label}セクションに移動`}
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li className="neo-nav__item" role="none">
                                    <Link
                                        href="/portfolio"
                                        className="neo-nav__link"
                                        role="menuitem"
                                        aria-label="ホームページに戻る"
                                    >
                                        Home
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>

                    {/* Controls */}
                    <div className="neo-nav__controls">
                        {/* Dark Mode Toggle */}
                        <AccessibleButton
                            className={`neo-nav__dark-toggle ${isDarkMode ? 'neo-nav__dark-toggle--active' : ''}`}
                            onClick={onToggleDarkMode}
                            ariaLabel={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                        >
                            <span className="neo-nav__dark-toggle-icon" aria-hidden="true">
                                {isDarkMode ? '☀️' : '🌙'}
                            </span>
                        </AccessibleButton>

                        {/* Mobile Menu Button */}
                        <AccessibleButton
                            className={`neo-nav__menu-button ${isMenuOpen ? 'neo-nav__menu-button--open' : ''}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            ariaLabel={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                        >
                            <span className="neo-nav__menu-line" aria-hidden="true"></span>
                            <span className="neo-nav__menu-line" aria-hidden="true"></span>
                            <span className="neo-nav__menu-line" aria-hidden="true"></span>
                            <span className="sr-only">
                                {isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                            </span>
                        </AccessibleButton>
                    </div>

                    {/* Mobile Navigation */}
                    <nav
                        ref={mobileMenuRef}
                        className={`neo-nav__mobile ${isMenuOpen ? 'neo-nav__mobile--open' : ''}`}
                        aria-label="モバイルナビゲーション"
                        aria-hidden={!isMenuOpen}
                    >
                        <div className="neo-nav__mobile-content">
                            <ul className="neo-nav__mobile-list" role="menu">
                                {pathname === "/portfolio" ? (
                                    navigationItems.map((item, index) => (
                                        <li
                                            key={item.id}
                                            className="neo-nav__mobile-item"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                            role="none"
                                        >
                                            <a
                                                href={item.href}
                                                className={`neo-nav__mobile-link ${currentSection === item.id ? 'neo-nav__mobile-link--active' : ''}`}
                                                onClick={(e) => handleSmoothScroll(e, item.id)}
                                                role="menuitem"
                                                aria-current={currentSection === item.id ? 'page' : undefined}
                                                tabIndex={isMenuOpen ? 0 : -1}
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li className="neo-nav__mobile-item" role="none">
                                        <Link
                                            href="/portfolio"
                                            className="neo-nav__mobile-link"
                                            onClick={() => setIsMenuOpen(false)}
                                            role="menuitem"
                                            tabIndex={isMenuOpen ? 0 : -1}
                                        >
                                            Home
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>

                    {/* Mobile Overlay */}
                    {isMenuOpen && (
                        <div
                            className="neo-nav__overlay"
                            onClick={() => setIsMenuOpen(false)}
                            aria-hidden="true"
                        />
                    )}
                </div>
            </header>
        </>
    );
};

export default ResponsiveNavigation;