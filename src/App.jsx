import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import IntroVideo from './components/IntroVideo';
import ScrollStoryCanvas from './components/ScrollStoryCanvas';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import FloatingMobileCTA from './components/FloatingMobileCTA';
import CustomCursor from './components/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const lenisRef = useRef(null);

  // Throttled progress handler to avoid re-renders
  const handleProgress = useCallback((progress) => {
    setLoadProgress((prev) => {
      if (prev >= 1) return 1;
      if (Math.abs(progress - prev) >= 0.02 || progress >= 1) {
        return progress;
      }
      return prev;
    });
  }, []);

  const handleInteractiveReady = useCallback(() => {
    setIsInteractive(true);
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#EDE8DF] font-body selection:bg-[#C9A24B] selection:text-[#0B0B0D]">
      {/* 3% Film Grain Atmosphere Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Luxury custom desktop cursor (dot + soft gold ring) */}
      <CustomCursor />

      {/* Cinematic Fullscreen Intro Video */}
      <IntroVideo onComplete={() => setIsIntroComplete(true)} />

      {/* Loading Screen until first 20% frames streamed & intro finished */}
      <LoadingScreen
        progress={loadProgress}
        isInteractive={isInteractive && isIntroComplete}
      />

      {/* Minimal Navbar with mix-blend-mode: difference */}
      <Navbar />

      {/* Core Hero Scroll Story Canvas with telemetry rail */}
      <ScrollStoryCanvas
        onProgressUpdate={handleProgress}
        onInteractiveReady={handleInteractiveReady}
      />

      {/* 8-Protocol Full-Width Editorial Service Menu */}
      <ServicesSection />

      {/* Direct Contact Section with Giant Phone & Studio Footer */}
      <ContactSection />

      {/* Mobile-first bottom action bar: Call 8123543569 */}
      <FloatingMobileCTA />
    </div>
  );
}
