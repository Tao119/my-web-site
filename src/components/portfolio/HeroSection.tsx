"use client";

import { useEffect, useState } from "react";
import TypewriterText from "./TypewriterText";
import AnimatedText from "./AnimatedText";
import { handleSmoothScrollClick } from "@/lib/scroll-utils";
import { ScrollAnimation, TextReveal } from "./ScrollAnimation";

interface HeroSectionComponentProps {
    title?: string;
    subtitle?: string;
    catchphrase?: string;
    ctaText?: string;
    backgroundType?: "parallax" | "animated" | "gradient";
}

const HeroSection = ({
    title = "Welcome to My Portfolio",
    subtitle = "Full-stack Developer & Unity Engineer",
    catchphrase = "Creating innovative digital experiences with modern technology",
    ctaText = "View My Work",
    backgroundType = "parallax"
}: HeroSectionComponentProps) => {
    const [scrollY, setScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        if (backgroundType === "parallax") {
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [backgroundType]);

    const parallaxOffset = scrollY * 0.5;



    if (!mounted) {
        return (
            <section className="hero-section">
                <div className="hero-section__content">
                    <div style={{ color: 'white' }}>Loading...</div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* CSS Animations */}
            <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .hero-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .hero-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

            <section
                id="hero"
                className="hero-section"
            >
                {/* Background Layer */}
                <div
                    className={`hero-section__background hero-section__background--${backgroundType}`}
                    style={backgroundType === "parallax" ? { transform: `translateY(${parallaxOffset}px)` } : {}}
                />

                {/* Overlay for better text readability */}
                <div className="hero-section__overlay" />

                {/* Decorative Elements */}
                <div className="hero-section__decorations">
                    {/* Floating geometric shapes */}
                    <div className="decoration decoration--square"
                        style={{
                            top: '5rem',
                            left: '2.5rem',
                            width: '4rem',
                            height: '4rem',
                            animationDelay: "0s"
                        }} />
                    <div className="decoration decoration--triangle"
                        style={{
                            top: '10rem',
                            right: '5rem',
                            width: '3rem',
                            height: '3rem',
                            animationDelay: "2s"
                        }} />
                    <div className="decoration decoration--circle"
                        style={{
                            bottom: '10rem',
                            left: '5rem',
                            width: '5rem',
                            height: '5rem',
                            animationDelay: "4s"
                        }} />
                    <div className="decoration decoration--diamond"
                        style={{
                            bottom: '5rem',
                            right: '2.5rem',
                            width: '3.5rem',
                            height: '3.5rem',
                            animationDelay: "1s"
                        }} />
                </div>

                {/* Main Content */}
                <div className="hero-section__content">
                    {/* Title */}
                    <h1 className="hero-section__title">
                        <AnimatedText
                            text={title}
                            animation="fadeInUp"
                            splitBy="word"
                            stagger={150}
                            className="hero-title-animated"
                        />
                    </h1>

                    {/* Subtitle with Typewriter Effect */}
                    <h2 className="hero-section__subtitle">
                        <TypewriterText
                            texts={[
                                subtitle,
                                "Creative Problem Solver",
                                "Technology Enthusiast",
                                "Digital Innovation Expert"
                            ]}
                            speed={80}
                            deleteSpeed={40}
                            pauseDuration={3000}
                            className="hero-subtitle-animated"
                        />
                    </h2>

                    {/* Catchphrase */}
                    <div className="hero-section__catchphrase">
                        <AnimatedText
                            text={catchphrase}
                            animation="slideInLeft"
                            delay={1000}
                            splitBy="word"
                            stagger={50}
                        />
                    </div>

                    {/* CTA Buttons */}
                    <div className="hero-section__cta">
                        <AnimatedText
                            text=""
                            animation="bounceIn"
                            delay={1500}
                            splitBy="none"
                        >
                            <a
                                href="#works"
                                className="neo-button neo-button--primary neo-button--large w-full sm:w-auto"
                                onClick={(e) => handleSmoothScrollClick(e, 'works')}
                            >
                                {ctaText}
                            </a>
                        </AnimatedText>
                        <AnimatedText
                            text=""
                            animation="bounceIn"
                            delay={1700}
                            splitBy="none"
                        >
                            <a
                                href="#contact"
                                className="neo-button neo-button--accent neo-button--large w-full sm:w-auto"
                                onClick={(e) => handleSmoothScrollClick(e, 'contact')}
                            >
                                Get In Touch
                            </a>
                        </AnimatedText>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="hero-section__scroll-indicator">
                    <AnimatedText
                        text=""
                        animation="fadeInUp"
                        delay={2000}
                        splitBy="none"
                    >
                        <div>
                            <span className="hero-section__scroll-indicator-text">Scroll Down</span>
                            <div className="hero-section__scroll-indicator-icon">
                            </div>
                        </div>
                    </AnimatedText>
                </div>
            </section>
        </>
    );
};

export default HeroSection;