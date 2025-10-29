"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Project } from "@/types/portfolio";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !project) return null;

    const images = project.images.length > 0 ? project.images : [project.thumbnail];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Technology color mapping
    const getTechColor = (tech: string): string => {
        const colors: Record<string, string> = {
            "React": "bg-[#61DAFB] text-black",
            "Next.js": "bg-black text-white",
            "Vue.js": "bg-[#4FC08D] text-white",
            "TypeScript": "bg-[#3178C6] text-white",
            "JavaScript": "bg-[#F7DF1E] text-black",
            "HTML": "bg-[#E34F26] text-white",
            "CSS": "bg-[#1572B6] text-white",
            "Tailwind": "bg-[#06B6D4] text-white",
            "SCSS": "bg-[#CF649A] text-white",
            "Node.js": "bg-[#339933] text-white",
            "Python": "bg-[#3776AB] text-white",
            "PHP": "bg-[#777BB4] text-white",
            "Java": "bg-[#ED8B00] text-white",
            "C#": "bg-[#239120] text-white",
            "MySQL": "bg-[#4479A1] text-white",
            "PostgreSQL": "bg-[#336791] text-white",
            "MongoDB": "bg-[#47A248] text-white",
            "Firebase": "bg-[#FFCA28] text-black",
            "Unity": "bg-black text-white",
            "C# Unity": "bg-[#239120] text-white",
            "TensorFlow": "bg-[#FF6F00] text-white",
            "PyTorch": "bg-[#EE4C2C] text-white",
            "OpenAI": "bg-[#412991] text-white",
            "default": "bg-[#6B7280] text-white"
        };
        return colors[tech] || colors.default;
    };

    return (
        <div className="c-project-modal">
            {/* Backdrop */}
            <div
                className="c-project-modal__backdrop"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="c-project-modal__content">
                {/* Close Button */}
                <button
                    className="c-project-modal__close"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ✕
                </button>

                {/* Image Gallery */}
                <div className="c-project-modal__gallery">
                    <div className="c-project-modal__image-container">
                        <Image
                            src={images[currentImageIndex]}
                            alt={`${project.title} - Image ${currentImageIndex + 1}`}
                            width={800}
                            height={600}
                            className="c-project-modal__image"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    className="c-project-modal__nav c-project-modal__nav--prev"
                                    onClick={prevImage}
                                    aria-label="Previous image"
                                >
                                    ‹
                                </button>
                                <button
                                    className="c-project-modal__nav c-project-modal__nav--next"
                                    onClick={nextImage}
                                    aria-label="Next image"
                                >
                                    ›
                                </button>
                            </>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="c-project-modal__thumbnails">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    className={`c-project-modal__thumbnail ${index === currentImageIndex ? "is-active" : ""
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        width={80}
                                        height={60}
                                        className="c-project-modal__thumbnail-image"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Project Info */}
                <div className="c-project-modal__info">
                    <div className="c-project-modal__header">
                        <h2 className="c-project-modal__title">
                            {project.title}
                        </h2>
                        {project.featured && (
                            <span className="c-project-modal__featured">
                                ⭐ Featured
                            </span>
                        )}
                    </div>

                    <p className="c-project-modal__description">
                        {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="c-project-modal__section">
                        <h3 className="c-project-modal__section-title">使用技術</h3>
                        <div className="c-project-modal__technologies">
                            {project.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className={`c-project-modal__technology ${getTechColor(tech)}`}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="c-project-modal__section">
                        <h3 className="c-project-modal__section-title">カテゴリ</h3>
                        <span className="c-project-modal__category">
                            {project.category}
                        </span>
                    </div>

                    {/* Links */}
                    <div className="c-project-modal__actions">
                        {project.demoUrl && (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="c-project-modal__link c-project-modal__link--demo"
                            >
                                <span>🚀</span>
                                ライブデモ
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="c-project-modal__link c-project-modal__link--github"
                            >
                                <span>📂</span>
                                GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;