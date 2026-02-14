/**
 * Simple class name utility function
 * Combines multiple class names and filters out falsy values
 */
export function cn(...inputs: any[]): string {
    return inputs
        .flat(Infinity)
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Format date range
 */
export function formatDateRange(startDate: Date | string, endDate?: Date | string): string {
    const start = formatDate(startDate);
    if (!endDate) return `${start} - 現在`;
    const end = formatDate(endDate);
    return `${start} - ${end}`;
}

/**
 * Calculate reading time for blog posts
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200; // Average reading speed
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

/**
 * Slugify string for URLs
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(elementId: string, offset: number = 0): void {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    }
}

/**
 * Get current section based on scroll position
 */
export function getCurrentSection(sections: string[]): string {
    for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                return sectionId;
            }
        }
    }
    return sections[0] || "";
}

/**
 * Generate random ID
 */
export function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * Get contrast color (black or white) for given background color
 */
export function getContrastColor(hexColor: string): string {
    // Remove # if present
    const color = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000000" : "#ffffff";
}

/**
 * Generate color palette for tags/categories
 */
export function generateColorPalette(count: number): string[] {
    const colors = [
        "#fbbf24", // yellow
        "#ec4899", // pink
        "#84cc16", // lime
        "#f97316", // orange
        "#3b82f6", // blue
        "#8b5cf6", // purple
        "#06b6d4", // cyan
        "#10b981", // emerald
        "#f59e0b", // amber
        "#ef4444", // red
    ];

    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }
    return result;
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Handle storage quota exceeded or other errors
            // ログ出力を無効化
        }
    },

    remove: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch {
            // ログ出力を無効化
        }
    },
};

/**
 * Device detection utilities
 */
export const device = {
    isMobile: (): boolean => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    },

    isTablet: (): boolean => {
        return /iPad|Android/i.test(navigator.userAgent) && !device.isMobile();
    },

    isDesktop: (): boolean => {
        return !device.isMobile() && !device.isTablet();
    },

    getTouchSupport: (): boolean => {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    },
};

/**
 * Animation utilities
 */
export const animation = {
    // Easing functions
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",

    // Duration presets
    duration: {
        fast: 150,
        normal: 300,
        slow: 500,
    },

    // Stagger delay for list animations
    getStaggerDelay: (index: number, baseDelay: number = 100): number => {
        return index * baseDelay;
    },
};

/**
 * URL utilities
 */
export function isValidImageUrl(urlStr: string): boolean {
    try {
        const parsed = new URL(urlStr);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

export const url = {
    isExternal: (url: string): boolean => {
        return /^https?:\/\//.test(url) && !url.includes(window.location.hostname);
    },

    addProtocol: (url: string): string => {
        if (!/^https?:\/\//.test(url)) {
            return `https://${url}`;
        }
        return url;
    },

    getQueryParams: (): Record<string, string> => {
        const params = new URLSearchParams(window.location.search);
        const result: Record<string, string> = {};
        params.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    },
};

/**
 * Performance utilities
 */
export const performanceUtils = {
    // Measure function execution time
    measure: <T extends (...args: any[]) => any>(
        fn: T,
        label?: string
    ): ((...args: Parameters<T>) => ReturnType<T>) => {
        return (...args: Parameters<T>): ReturnType<T> => {
            const start = globalThis.performance.now();
            const result = fn(...args);
            const end = globalThis.performance.now();
            // ログ出力を無効化
            return result;
        };
    },

    // Lazy load images
    lazyLoadImage: (img: HTMLImageElement, src: string): void => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    img.src = src;
                    observer.unobserve(img);
                }
            });
        });
        observer.observe(img);
    },
};