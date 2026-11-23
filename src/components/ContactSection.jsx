import React from 'react';
import { siteConfig } from '../config/siteConfig';

export default function ContactSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative bg-[#0B0B0D] text-[#EDE8DF] pt-28 sm:pt-40 pb-36 sm:pb-24 px-4 sm:px-8 border-t border-[#EDE8DF]/10 select-none"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Official Automotive Crest & Studio Badge */}
        <div className="mb-10 flex flex-col items-center">
          <img
            src={siteConfig.business.logo}
            alt="Legacy Car Detailing Studio Official Coat of Arms"
            className="w-44 sm:w-56 md:w-64 object-contain filter drop-shadow-[0_12px_36px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Editorial Subtitle */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="inline-block w-6 h-[1px] bg-[#C9A24B]" />
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#C9A24B]">
            DIRECT BAY RESERVATION
          </span>
          <span className="inline-block w-6 h-[1px] bg-[#C9A24B]" />
        </div>

        {/* Giant Serif Phone Number across full width with subtle gold glow hover */}
        <a
          href={siteConfig.business.telLink}
          aria-label={`Call Legacy Studio at ${siteConfig.business.phone}`}
          className="font-display font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#EDE8DF] hover:text-[#C9A24B] transition-colors duration-300 block mb-10 leading-none"
        >
          {siteConfig.business.phone}
        </a>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <a
            href={siteConfig.business.telLink}
            className="w-full sm:w-auto px-10 py-4 bg-[#C9A24B] text-[#0B0B0D] font-mono text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors text-center"
          >
            Direct Call
          </a>
          <a
            href={siteConfig.business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-4 border border-[#EDE8DF]/30 text-[#EDE8DF] font-mono text-xs uppercase tracking-[0.2em] font-medium hover:border-[#C9A24B] hover:text-[#C9A24B] transition-colors text-center"
          >
            WhatsApp Concierge
          </a>
        </div>

        {/* Confident Luxury Closing Statement */}
        {siteConfig.business.closingLine && (
          <p className="font-display italic text-lg sm:text-2xl text-[#EDE8DF]/70 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
            "{siteConfig.business.closingLine}"
          </p>
        )}

        {/* Studio Specifications & Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-[#EDE8DF]/10 w-full text-left font-mono text-xs text-[#EDE8DF]/60">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A24B] block mb-2">
              STUDIO LOCATION
            </span>
            <p className="text-[#EDE8DF] font-body text-sm font-light mb-1">
              {siteConfig.business.address}
            </p>
            <a
              href={siteConfig.business.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A24B] hover:text-white transition-colors text-[11px] tracking-wider uppercase inline-block mt-1"
            >
              Open in Google Maps →
            </a>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A24B] block mb-2">
              HOURS OF RESTORATION
            </span>
            <p className="text-[#EDE8DF] font-body text-sm font-light">
              {siteConfig.business.hours}
            </p>
            <span className="text-[11px] text-[#EDE8DF]/40 block mt-1">
              Private bay sessions by reservation
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A24B] block mb-2">
              CONNECT & INQUIRIES
            </span>
            <div className="flex flex-wrap gap-4 mt-1">
              {siteConfig.business.socialLinks?.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EDE8DF]/75 hover:text-[#C9A24B] transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Proper Copyright & Brand Attribution */}
        <div className="pt-8 w-full flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-[#EDE8DF]/40 tracking-wider gap-4">
          <div className="flex items-center space-x-3">
            <img
              src={siteConfig.business.crest}
              alt="Legacy Crest"
              className="w-5 h-5 object-contain opacity-85"
            />
            <span className="text-[#EDE8DF]/70 font-medium">{siteConfig.business.name}</span>
            <span>•</span>
            <span>Bespoke Detailing Studio</span>
          </div>

          <div>
            © {currentYear} {siteConfig.business.copyrightNotice}
          </div>
        </div>
      </div>
    </footer>
  );
}
