import React from 'react';

export default function LoadingScreen({ progress, isInteractive }) {
  const percentage = Math.min(100, Math.round(progress * 100));
  const formattedNumber = String(percentage).padStart(3, '0');

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0F10] text-[#EDE8DF] transition-opacity duration-500 select-none ${
        isInteractive ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Big Mono Counter */}
        <span className="font-mono text-6xl sm:text-8xl md:text-9xl font-light tracking-tighter text-[#EDE8DF] tabular-nums">
          {formattedNumber}
        </span>

        {/* Editorial Subline */}
        <p className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-[#EDE8DF]/60 mt-4">
          Warming up the polisher...
        </p>
      </div>
    </div>
  );
}
