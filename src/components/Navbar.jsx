import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > 40) {
            setIsScrolled(true);
          } else if (y < 15) {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 pointer-events-none mix-blend-difference ${
        isScrolled ? 'border-b border-white/20' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* Editorial Wordmark */}
        <a
          href="#story-section"
          onClick={(e) => scrollTo(e, 'story-section')}
          className="pointer-events-auto text-white group flex items-baseline select-none"
        >
          <span className="font-display text-xl sm:text-2xl tracking-tight font-normal">
            Dolphin Car <span className="italic font-light">Spa</span>
          </span>
        </a>

        {/* Minimal Monospace Links */}
        <nav className="pointer-events-auto flex items-center space-x-6 sm:space-x-10 text-white font-mono text-xs tracking-widest uppercase">
          <a
            href="#services"
            onClick={(e) => scrollTo(e, 'services')}
            className="hover:opacity-60 transition-opacity"
          >
            Services
          </a>
          <a
            href="#contact"
            onClick={(e) => scrollTo(e, 'contact')}
            className="hover:opacity-60 transition-opacity"
          >
            Contact
          </a>
          <a
            href={siteConfig.business.telLink}
            className="hover:opacity-60 transition-opacity border-b border-white pb-0.5"
          >
            Call
          </a>
        </nav>
      </div>
    </header>
  );
}
