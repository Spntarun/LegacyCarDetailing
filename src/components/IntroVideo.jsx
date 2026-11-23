import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function IntroVideo({ onComplete }) {
  const videoRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const handleFinish = useCallback(() => {
    if (isFadingOut || isRemoved) return;
    setIsFadingOut(true);
    setTimeout(() => {
      setIsRemoved(true);
      onComplete?.();
    }, 900);
  }, [isFadingOut, isRemoved, onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly enforce muted attribute for iOS Safari and mobile Chrome autoplay policy
    video.muted = true;
    video.defaultMuted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, wait for user tap or skip
      });
    }

    // Fallback safety timer: video is ~5s. If stalled or blocked, finish after 6.5s
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 6500);

    return () => clearTimeout(safetyTimer);
  }, [handleFinish]);

  if (isRemoved) return null;

  return (
    <div
      aria-label="Studio Cinematic Introduction"
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-[#0B0B0D] overflow-hidden select-none transition-opacity duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Full-bleed Cinematic Video */}
      <video
        ref={videoRef}
        src="/assets/introvideo.mp4"
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        onEnded={handleFinish}
        className="w-full h-full object-cover"
      />

      {/* Subtle Luxury Film Grain & Edge Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(11,11,13,0.85)_100%)] z-10" />

      {/* Top Left Studio Emblem */}
      <div className="absolute top-6 left-6 z-20 flex items-center space-x-3 pointer-events-none opacity-80">
        <img
          src="/assets/logo-crest.webp"
          alt="Legacy Crest"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain filter drop-shadow-[0_2px_8px_rgba(201,162,75,0.4)]"
        />
        <div className="flex items-baseline">
          <span className="font-display text-lg sm:text-xl tracking-[0.25em] font-light uppercase text-white">
            LEGACY
          </span>
          <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A24B] ml-2 pl-2 border-l border-white/20">
            Studio Intro
          </span>
        </div>
      </div>

      {/* Top Right Skip Button */}
      <button
        type="button"
        onClick={handleFinish}
        aria-label="Skip introduction video"
        className="absolute top-6 right-6 z-20 font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#EDE8DF]/80 hover:text-[#C9A24B] px-4 py-2 border border-[#EDE8DF]/20 hover:border-[#C9A24B] bg-[#0B0B0D]/60 backdrop-blur-sm transition-all duration-300"
      >
        Skip Intro →
      </button>

      {/* Bottom Center Audio Note */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none font-mono text-[9px] uppercase tracking-[0.25em] text-[#EDE8DF]/40">
        PREVIEW REEL • MUTED PLAYBACK
      </div>
    </div>
  );
}
