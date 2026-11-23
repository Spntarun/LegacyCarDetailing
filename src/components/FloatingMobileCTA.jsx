import React from 'react';
import { siteConfig } from '../config/siteConfig';

export default function FloatingMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0B0B0D]/95 backdrop-blur-md px-4 py-3 border-t border-[#EDE8DF]/15 select-none pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
      <a
        href={siteConfig.business.telLink}
        aria-label={`Direct Call ${siteConfig.business.phone}`}
        className="w-full flex items-center justify-center py-3.5 bg-[#C9A24B] text-[#0B0B0D] font-mono text-xs uppercase tracking-[0.2em] font-semibold active:bg-white transition-colors shadow-lg"
      >
        <span>Call {siteConfig.business.phone}</span>
        <span className="ml-2">→</span>
      </a>
    </div>
  );
}
