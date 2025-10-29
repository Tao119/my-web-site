import { PortfolioConfig } from "../types/portfolio";

export const portfolioConfig: PortfolioConfig = {
    site: {
        title: "Portfolio | Full-stack Developer & Unity Engineer",
        description: "モダンな技術スタックを使用したフルスタック開発とUnityゲーム開発を専門とするエンジニアのポートフォリオサイト",
        url: "https://your-portfolio-domain.com",
        author: "Your Name",
    },
    features: {
        darkMode: true,
        animations: true,
        blog: true,
        admin: true,
    },
    social: {
        github: "https://github.com/Tao119",
        linkedin: "https://linkedin.com/in/yourusername",
        twitter: "https://x.com/tao_matsumr",
        email: "your.email@example.com",
    },
    analytics: {
        googleAnalytics: "GA_MEASUREMENT_ID", // Replace with your GA4 measurement ID
        // plausible: "your-domain.com", // Uncomment if using Plausible
    },
};

export default portfolioConfig;