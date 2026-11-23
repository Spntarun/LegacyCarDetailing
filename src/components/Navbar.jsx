import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 pointer-events-none mix-blend-difference ${
          isScrolled ? 'border-b border-white/15' : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          {/* Minimal Architectural Wordmark + Metallic Crest */}
          <a
            href="#story-section"
            onClick={(e) => scrollTo(e, 'story-section')}
            aria-label="Legacy Car Detailing Studio Home"
            className="pointer-events-auto text-white group flex items-center space-x-3 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A24B]"
          >
            <img
              src={siteConfig.business.crest}
              alt="Legacy Crest Badge"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain filter drop-shadow-[0_2px_8px_rgba(201,162,75,0.25)] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex items-baseline">
              <span className="font-display text-xl sm:text-2xl tracking-[0.28em] font-light uppercase text-white transition-opacity group-hover:opacity-80">
                LEGACY
              </span>
              <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-[0.25em] text-white/50 ml-3 pl-3 border-l border-white/20">
                Detailing Studio
              </span>
            </div>
          </a>

          {/* Desktop Links + Outlined Accent CTA */}
          <nav
            aria-label="Primary Navigation"
            className="pointer-events-auto hidden md:flex items-center space-x-8 text-white font-mono text-xs tracking-[0.2em] uppercase select-none"
          >
            <a
              href="#story-section"
              onClick={(e) => scrollTo(e, 'story-section')}
              className="text-white/80 hover:text-white transition-opacity"
            >
              The Process
            </a>
            <a
              href="#services"
              onClick={(e) => scrollTo(e, 'services')}
              className="text-white/80 hover:text-white transition-opacity"
            >
              Treatments
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, 'contact')}
              className="text-white/80 hover:text-white transition-opacity"
            >
              Studio
            </a>
            <a
              href={siteConfig.business.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[#C9A24B] text-white hover:bg-[#C9A24B] hover:text-[#0B0B0D] transition-all duration-300"
            >
              Book Now
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="pointer-events-auto md:hidden p-2 text-white font-mono text-xs uppercase tracking-widest focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A24B]"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-40 bg-[#0B0B0D]/95 backdrop-blur-md flex flex-col justify-between px-6 pt-20 pb-12 select-none md:hidden"
        >
          <div>
            <div className="flex items-center space-x-3 pb-6 border-b border-[#EDE8DF]/10 mb-8">
              <img
                src={siteConfig.business.crest}
                alt="Legacy Emblem"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="font-display text-xl tracking-[0.2em] font-light uppercase text-[#EDE8DF] block leading-none">
                  LEGACY
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#C9A24B]">
                  Detailing Studio • PPF • Ceramic • Wraps
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-8 font-display text-3xl font-light tracking-tight text-[#EDE8DF]">
              <a
                href="#story-section"
                onClick={(e) => scrollTo(e, 'story-section')}
                className="hover:text-[#C9A24B] transition-colors"
              >
                The Process
              </a>
              <a
                href="#services"
                onClick={(e) => scrollTo(e, 'services')}
                className="hover:text-[#C9A24B] transition-colors"
              >
                Treatments
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollTo(e, 'contact')}
                className="hover:text-[#C9A24B] transition-colors"
              >
                Studio & Contact
              </a>
            </div>
          </div>

          <div className="flex flex-col space-y-4 pt-8 border-t border-[#EDE8DF]/15">
            <a
              href={siteConfig.business.telLink}
              className="w-full py-4 text-center border border-[#EDE8DF]/30 font-mono text-xs uppercase tracking-widest text-[#EDE8DF]"
            >
              Direct Line ({siteConfig.business.phone})
            </a>
            <a
              href={siteConfig.business.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 text-center bg-[#C9A24B] text-[#0B0B0D] font-mono text-xs uppercase tracking-widest font-semibold"
            >
              Book via WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
