import React from 'react';

export default function LoadingScreen({ progress, isInteractive }) {
  const percentage = Math.min(100, Math.round(progress * 100));
  const formattedNumber = String(percentage).padStart(3, '0');

  return (
    <div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading studio experience"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0D] text-[#EDE8DF] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] select-none ${
        isInteractive ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs w-full px-6">
        {/* Official Automotive Crest Badge */}
        <img
          src="/assets/logo-crest.webp"
          alt="Legacy Studio Emblem"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-6 filter drop-shadow-[0_4px_24px_rgba(201,162,75,0.3)] animate-pulse"
        />

        {/* Monogram Brand Header */}
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C9A24B] mb-5">
          LEGACY DETAILING STUDIO
        </span>

        {/* Minimal Mono Counter */}
        <span className="font-mono text-5xl sm:text-7xl font-light tracking-tight text-[#EDE8DF] tabular-nums">
          {formattedNumber}%
        </span>

        {/* Thin Gold Progress Track */}
        <div className="w-full h-[1.5px] bg-[#EDE8DF]/15 mt-8 mb-4 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#C9A24B] transition-all duration-150 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Calm Technical Status */}
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#EDE8DF]/50">
          STREAMING CALIBRATED FRAMES
        </p>
      </div>
    </div>
  );
}
