import React from 'react';
import { siteConfig } from '../config/siteConfig';

export default function ContactSection() {
  return (
    <footer id="contact" className="relative bg-[#0E0F10] text-[#EDE8DF] pt-24 sm:pt-36 pb-16 px-4 sm:px-8 border-t border-[#EDE8DF]/15 select-none">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Label */}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#EDE8DF]/50 mb-6 block">
          [ DIRECT BAY BOOKING ]
        </span>

        {/* Giant Serif Phone Number across full width */}
        <a
          href={siteConfig.business.telLink}
          className="font-display font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#EDE8DF] hover:text-[#FF4D1C] transition-colors block mb-10 leading-none"
        >
          {siteConfig.business.phone}
        </a>

        {/* Two Simple Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <a
            href={siteConfig.business.telLink}
            className="w-full sm:w-auto px-8 py-4 bg-[#FF4D1C] text-[#0E0F10] font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors rounded-none sm:rounded-sm text-center"
          >
            Call now
          </a>
          <a
            href={siteConfig.business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 border border-[#EDE8DF] text-[#EDE8DF] font-mono text-xs uppercase tracking-widest font-semibold hover:bg-[#EDE8DF] hover:text-[#0E0F10] transition-colors rounded-none sm:rounded-sm text-center"
          >
            WhatsApp
          </a>
        </div>

        {/* Essential Info Only */}
        <div className="pt-8 border-t border-[#EDE8DF]/10 w-full flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-[#EDE8DF]/50 gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-medium text-[#EDE8DF]">{siteConfig.business.name}</span>
            <span>•</span>
            <span>{siteConfig.business.address}</span>
          </div>

          <div className="text-[11px] tracking-wider text-[#EDE8DF]/40">
            {siteConfig.business.footerText}
          </div>
        </div>
      </div>
    </footer>
  );
}
