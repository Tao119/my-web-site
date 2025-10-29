"use client";

import { Dispatch, SetStateAction } from "react";

interface NavigationProps {
  activeSection: string;
  setActiveSection: Dispatch<SetStateAction<string>>;
}

const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const sections = [
    { id: "profile", label: "プロフィール" },
    { id: "career", label: "経歴" },
    { id: "skills", label: "スキル" },
    { id: "works", label: "作品・実績" },
    { id: "social", label: "SNS" },
    { id: "blog", label: "ブログ" },
  ];

  return (
    <nav className="c-portfolio-nav">
      <ul className="c-portfolio-nav__list">
        {sections.map((section) => (
          <li key={section.id} className="c-portfolio-nav__item">
            <button
              className={`c-portfolio-nav__button ${activeSection === section.id ? "is-active" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
