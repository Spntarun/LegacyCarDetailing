import React from 'react';
import { siteConfig } from '../config/siteConfig';

export default function FloatingMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0E0F10] p-2 border-t border-[#EDE8DF]/20 select-none">
      <a
        href={siteConfig.business.telLink}
        className="w-full flex items-center justify-center py-3.5 bg-[#FF4D1C] text-[#0E0F10] font-mono text-xs uppercase tracking-widest font-bold active:bg-white transition-colors"
      >
        <span>Call {siteConfig.business.phone}</span>
        <span className="ml-2">→</span>
      </a>
    </div>
  );
}
