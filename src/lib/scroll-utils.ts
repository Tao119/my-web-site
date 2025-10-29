/**
 * Get the current header height based on scroll state and CSS values
 */
export const getHeaderHeight = (): number => {
    const header = document.querySelector('.neo-nav');
    if (!header) return 80; // Default fallback

    const isScrolled = header.classList.contains('neo-nav--scrolled');
    // Based on CSS min-height values: 70px normal, 60px scrolled
    return isScrolled ? 60 : 70;
};

/**
 * Smooth scroll to element with proper header offset
 * @param targetId - The ID of the target element
 * @param additionalOffset - Additional offset beyond header height (default: 20px for better spacing)
 */
export const smoothScrollToElement = (targetId: string, additionalOffset: number = 20) => {
    const target = document.getElementById(targetId);
    if (!target) {
        // ログ出力を無効化
        return;
    }

    // Calculate header height dynamically
    const headerHeight = getHeaderHeight();
    const totalOffset = headerHeight + additionalOffset;
    const targetPosition = target.offsetTop - totalOffset;

    window.scrollTo({
        top: Math.max(0, targetPosition), // Ensure we don't scroll to negative position
        behavior: 'smooth'
    });
};

/**
 * Handle click event for smooth scrolling (for use in onClick handlers)
 * @param e - React mouse event
 * @param targetId - The ID of the target element
 * @param additionalOffset - Additional offset beyond header height
 */
export const handleSmoothScrollClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    additionalOffset?: number
) => {
    e.preventDefault();
    smoothScrollToElement(targetId, additionalOffset);
};