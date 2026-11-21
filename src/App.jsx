import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import ScrollStoryCanvas from './components/ScrollStoryCanvas';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import FloatingMobileCTA from './components/FloatingMobileCTA';
import CustomCursor from './components/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
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
    <div className="min-h-screen bg-[#0E0F10] text-[#EDE8DF] font-sans selection:bg-[#FF4D1C] selection:text-[#0E0F10]">
      {/* Custom subtle desktop cursor */}
      <CustomCursor />

      {/* Loading Screen until first 20% frames loaded */}
      <LoadingScreen
        progress={loadProgress}
        isInteractive={isInteractive}
      />

      {/* Minimal Navbar with mix-blend-mode: difference */}
      <Navbar />

      {/* Core Hero Scroll Story Canvas with telemetry rail */}
      <ScrollStoryCanvas
        onProgressUpdate={handleProgress}
        onInteractiveReady={handleInteractiveReady}
      />

      {/* 8-Row Full-Width Editorial Service Menu */}
      <ServicesSection />

      {/* Direct Contact Section with Giant Serif Phone Number & Footer */}
      <ContactSection />

      {/* Mobile-first bottom action bar: Call 8660036822 */}
      <FloatingMobileCTA />
    </div>
  );
}
