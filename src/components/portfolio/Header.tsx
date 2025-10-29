"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const headerHeight = 80;
      const targetPosition = target.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { href: "#profile", label: "Profile", id: "profile" },
    { href: "#career", label: "Career", id: "career" },
    { href: "#skills", label: "Skills", id: "skills" },
    { href: "#works", label: "Works", id: "works" },
    { href: "#social", label: "SNS", id: "social" },
    { href: "#blog", label: "Blog", id: "blog" },
  ];

  return (
    <header className={`c-header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="c-header__inner">
        <Link href="/portfolio" className="c-header__logo">
          <span className="c-header__logo-text">Tao Matsumura</span>
          <span className="c-header__logo-subtitle">Portfolio</span>
        </Link>

        <nav className={`c-header__nav ${isMenuOpen ? "is-open" : ""}`}>
          <ul className="c-header__nav-list">
            {pathname === "/portfolio" ? (
              menuItems.map((item) => (
                <li key={item.id} className="c-header__nav-item">
                  <a
                    href={item.href}
                    className="c-header__nav-link"
                    onClick={(e) => handleSmoothScroll(e, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))
            ) : (
              <li className="c-header__nav-item">
                <Link href="/portfolio" className="c-header__nav-link">
                  Home
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <button
          className={`c-header__menu-button ${isMenuOpen ? "is-open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="メニュー"
        >
          <span className="c-header__menu-button-line"></span>
          <span className="c-header__menu-button-line"></span>
          <span className="c-header__menu-button-line"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
