"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/lib/dataService";
import { Profile, Education, Experience } from "@/types/portfolio";

interface DetailedProfileProps {
    className?: string;
}

interface AccordionItemProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const AccordionItem = ({ title, icon, children, defaultOpen = false }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`neo-accordion-item ${isOpen ? 'neo-accordion-item--open' : ''}`}>
            <button
                className="neo-accordion-header"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="neo-accordion-header__content">
                    <span className="neo-accordion-header__icon">{icon}</span>
                    <span className="neo-accordion-header__title">{title}</span>
                </div>
                <div className="neo-accordion-header__toggle">
                    <span className={`neo-accordion-toggle ${isOpen ? 'neo-accordion-toggle--open' : ''}`}>
                        {isOpen ? '−' : '+'}
                    </span>
                </div>
            </button>
            <div className={`neo-accordion-content ${isOpen ? 'neo-accordion-content--open' : ''}`}>
                <div className="neo-accordion-content__inner">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DetailedProfile = ({ className = "" }: DetailedProfileProps) => {
    const [profileData, setProfileData] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchDetailedProfile();
    }, []);

    // プロフィール更新イベントをリッスン
    useEffect(() => {
        const handleProfileUpdate = () => {
            console.log('Profile update event received in DetailedProfile, refreshing data...');
            fetchDetailedProfile();
        };

        window.addEventListener('profileUpdated', handleProfileUpdate);
        return () => {
            window.removeEventListener('profileUpdated', handleProfileUpdate);
        };
    }, []);

    const fetchDetailedProfile = async () => {
        try {
            const profile = await getProfile();
            setProfileData(profile);
            setError(false);
        } catch (error) {
            console.error('Failed to fetch detailed profile:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return `${d.getFullYear()}年${d.getMonth() + 1}月`;
    };

    const formatDateRange = (startDate: Date | string, endDate?: Date | string) => {
        const start = formatDate(startDate);
        const end = endDate ? formatDate(endDate) : "現在";
        return `${start} 〜 ${end}`;
    };

    if (loading) {
        return (
            <div className={`neo-detailed-profile neo-detailed-profile--loading ${className}`}>
                <div className="neo-detailed-profile__skeleton">
                    <div className="neo-accordion-skeleton">
                        <div className="neo-accordion-skeleton__header"></div>
                        <div className="neo-accordion-skeleton__header"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profileData || (!profileData.education?.length && !profileData.experience?.length)) {
        return (
            <div className={`neo-detailed-profile neo-detailed-profile--empty ${className}`}>
                <div className="neo-card neo-card--empty">
                    <h3>詳細プロフィール情報がありません</h3>
                    <p>管理画面から学歴・職歴情報を追加してください。</p>
                </div>
            </div>
        );
    }

    return (
        <section className={`neo-detailed-profile ${className}`}>
            <div className="neo-detailed-profile__container">
                <div className="neo-detailed-profile__header">
                    <h2 className="neo-detailed-profile__title">詳細プロフィール</h2>
                    <p className="neo-detailed-profile__subtitle">
                        学歴・職歴の詳細情報をご覧いただけます
                    </p>
                </div>

                <div className="neo-detailed-profile__content">
                    <div className="neo-accordion">
                        {/* Education Section */}
                        {profileData.education && profileData.education.length > 0 && (
                            <AccordionItem title="学歴" icon="🎓" defaultOpen={true}>
                                <div className="neo-timeline">
                                    {profileData.education
                                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                                        .map((edu, index) => (
                                            <div key={index} className="neo-timeline-item">
                                                <div className="neo-timeline-marker">
                                                    <div className="neo-timeline-dot"></div>
                                                </div>
                                                <div className="neo-timeline-content">
                                                    <div className="neo-timeline-header">
                                                        <h4 className="neo-timeline-title">{edu.institution}</h4>
                                                        <span className="neo-timeline-period">
                                                            {formatDateRange(edu.startDate, edu.endDate)}
                                                        </span>
                                                    </div>
                                                    <div className="neo-timeline-details">
                                                        <p className="neo-timeline-degree">
                                                            <strong>{edu.degree}</strong>
                                                            {(edu as any).field && <span> - {(edu as any).field}</span>}
                                                        </p>
                                                        {edu.description && (
                                                            <p className="neo-timeline-description">{edu.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </AccordionItem>
                        )}

                        {/* Experience Section */}
                        {profileData.experience && profileData.experience.length > 0 && (
                            <AccordionItem title="職歴" icon="💼" defaultOpen={true}>
                                <div className="neo-timeline">
                                    {profileData.experience
                                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                                        .map((exp, index) => (
                                            <div key={index} className="neo-timeline-item">
                                                <div className="neo-timeline-marker">
                                                    <div className="neo-timeline-dot"></div>
                                                </div>
                                                <div className="neo-timeline-content">
                                                    <div className="neo-timeline-header">
                                                        <h4 className="neo-timeline-title">{exp.company}</h4>
                                                        <span className="neo-timeline-period">
                                                            {formatDateRange(exp.startDate, exp.endDate)}
                                                        </span>
                                                    </div>
                                                    <div className="neo-timeline-details">
                                                        <p className="neo-timeline-position">
                                                            <strong>{exp.position}</strong>
                                                        </p>
                                                        {exp.description && (
                                                            <p className="neo-timeline-description">{exp.description}</p>
                                                        )}
                                                        {exp.technologies && exp.technologies.length > 0 && (
                                                            <div className="neo-timeline-technologies">
                                                                <span className="neo-timeline-tech-label">使用技術:</span>
                                                                <div className="neo-timeline-tech-list">
                                                                    {exp.technologies.map((tech, index) => (
                                                                        <span key={index} className="neo-timeline-tech-tag">
                                                                            {tech}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </AccordionItem>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailedProfile;