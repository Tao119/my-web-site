"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
    text?: string;
    texts?: string[];
    speed?: number;
    deleteSpeed?: number;
    pauseDuration?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
    loop?: boolean;
}

const TypewriterText = ({
    text,
    texts,
    speed = 100,
    deleteSpeed = 50,
    pauseDuration = 2000,
    className = "",
    prefix = "",
    suffix = "",
    loop = true
}: TypewriterTextProps) => {
    const textArray = text ? [text] : texts || [];
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (textArray.length === 0) return;

        const currentFullText = textArray[currentTextIndex];

        // If single text and not looping, just type once
        if (text && !loop && isComplete) return;

        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false);
                if (text && !loop) {
                    setIsComplete(true);
                } else {
                    setIsDeleting(true);
                }
            }, pauseDuration);

            return () => clearTimeout(pauseTimer);
        }

        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (currentText.length < currentFullText.length) {
                    setCurrentText(currentFullText.slice(0, currentText.length + 1));
                } else {
                    // Finished typing
                    if (text && !loop) {
                        setIsComplete(true);
                    } else {
                        setIsPaused(true);
                    }
                }
            } else {
                // Deleting
                if (currentText.length > 0) {
                    setCurrentText(currentText.slice(0, -1));
                } else {
                    // Finished deleting, move to next text
                    setIsDeleting(false);
                    setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
                }
            }
        }, isDeleting ? deleteSpeed : speed);

        return () => clearTimeout(timer);
    }, [currentText, currentTextIndex, isDeleting, isPaused, textArray, speed, deleteSpeed, pauseDuration, text, loop, isComplete]);

    return (
        <span className={className}>
            {prefix}
            <span className="typewriter-text">
                {currentText}
                <span className={`typewriter-cursor ${isComplete ? 'typewriter-cursor--hidden' : ''}`}>|</span>
            </span>
            {suffix}
        </span>
    );
};

export { TypewriterText };
export default TypewriterText;