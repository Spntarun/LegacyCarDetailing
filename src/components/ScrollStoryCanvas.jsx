import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../config/siteConfig';

gsap.registerPlugin(ScrollTrigger);

// Pure calculation for stage overlay visibility
function calculateStageStyle(stage, p) {
  const { id, scrollStart, scrollEnd } = stage;

  // Stage 1 (Hero): Visible at scroll 0, fades out as scroll passes 0.12
  if (id === 'hero') {
    if (p <= 0.12) {
      return { opacity: 1, translateY: 0, pointerEvents: 'auto' };
    } else if (p < scrollEnd) {
      const exitRatio = 1 - (p - 0.12) / (scrollEnd - 0.12);
      const opacity = Math.max(0, Math.min(1, exitRatio));
      const translateY = (1 - opacity) * -20;
      return {
        opacity,
        translateY,
        pointerEvents: opacity > 0.2 ? 'auto' : 'none',
      };
    } else {
      return { opacity: 0, translateY: -20, pointerEvents: 'none' };
    }
  }

  // Stage 5 (Showroom Reveal): Fades in around 0.82 and remains visible
  if (id === 'showroom-reveal') {
    if (p < scrollStart) {
      return { opacity: 0, translateY: 20, pointerEvents: 'none' };
    } else if (p >= 0.88) {
      return { opacity: 1, translateY: 0, pointerEvents: 'auto' };
    } else {
      const enterRatio = (p - scrollStart) / (0.88 - scrollStart);
      const opacity = Math.max(0, Math.min(1, enterRatio));
      const translateY = (1 - opacity) * 20;
      return {
        opacity,
        translateY,
        pointerEvents: opacity > 0.2 ? 'auto' : 'none',
      };
    }
  }

  // Stages 2, 3, 4: Bell curve in-out
  if (p < scrollStart || p > scrollEnd) {
    return { opacity: 0, translateY: 20, pointerEvents: 'none' };
  }

  const duration = scrollEnd - scrollStart;
  const enterEnd = scrollStart + duration * 0.28;
  const exitStart = scrollEnd - duration * 0.28;

  let opacity = 1;
  let translateY = 0;

  if (p < enterEnd) {
    opacity = (p - scrollStart) / (enterEnd - scrollStart);
    translateY = (1 - opacity) * 16;
  } else if (p > exitStart) {
    opacity = (scrollEnd - p) / (scrollEnd - exitStart);
    translateY = (1 - opacity) * -16;
  }

  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  return {
    opacity: clampedOpacity,
    translateY,
    pointerEvents: clampedOpacity > 0.2 ? 'auto' : 'none',
  };
}

export default function ScrollStoryCanvas({
  onProgressUpdate,
  onInteractiveReady
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRefs = useRef([]);
  const dirtLevelTextRef = useRef(null);
  const dirtBarFillRef = useRef(null);
  const railTickRefs = useRef([]);

  const onProgressUpdateRef = useRef(onProgressUpdate);
  const onInteractiveReadyRef = useRef(onInteractiveReady);
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
    onInteractiveReadyRef.current = onInteractiveReady;
  });

  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [comparisonSliderPos, setComparisonSliderPos] = useState(50);

  const imagesRef = useRef([]);
  const loadedCountRef = useRef(0);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animationFrameIdRef = useRef(null);
  const lastDrawnIndexRef = useRef(-1);
  const loadSingleFrameRef = useRef(null);
  const interactiveFiredRef = useRef(false);

  const frameConfig = isMobile ? siteConfig.frames.mobile : siteConfig.frames.desktop;
  const totalFrames = frameConfig.total;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    let resizeTimer = null;
    const checkMobile = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        setIsMobile((prev) => (prev !== mobile ? mobile : prev));
      }, 150);
    };

    window.addEventListener('resize', checkMobile);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
      clearTimeout(resizeTimer);
    };
  }, []);

  const renderImageCover = useCallback((ctx, canvas, img) => {
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || frameConfig.width;
    const ih = img.naturalHeight || frameConfig.height;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const cx = (cw - nw) / 2;
    const cy = (ch - nh) / 2;

    ctx.drawImage(img, cx, cy, nw, nh);
  }, [frameConfig.width, frameConfig.height]);

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (img && img.complete && img.naturalWidth > 0) {
      renderImageCover(ctx, canvas, img);
      lastDrawnIndexRef.current = index;
      return;
    }

    let fallback = null;
    let fallbackIdx = -1;
    for (let i = index; i >= 0; i--) {
      if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
        fallback = imagesRef.current[i];
        fallbackIdx = i;
        break;
      }
    }
    if (!fallback) {
      for (let i = index; i < totalFrames; i++) {
        if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
          fallback = imagesRef.current[i];
          fallbackIdx = i;
          break;
        }
      }
    }

    if (fallback) {
      renderImageCover(ctx, canvas, fallback);
      lastDrawnIndexRef.current = fallbackIdx;
    }
  }, [totalFrames, renderImageCover]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const newW = Math.round(rect.width * dpr);
    const newH = Math.round(rect.height * dpr);

    if (canvas.width !== newW || canvas.height !== newH) {
      canvas.width = newW;
      canvas.height = newH;
    }

    drawFrame(Math.round(currentFrameRef.current));
  }, [drawFrame]);

  useEffect(() => {
    imagesRef.current = new Array(totalFrames).fill(null);
    loadedCountRef.current = 0;
    lastDrawnIndexRef.current = -1;
    interactiveFiredRef.current = false;

    const interactiveTarget = Math.ceil(totalFrames * siteConfig.frames.interactiveThreshold);

    const loadSingleFrame = async (idx) => {
      if (imagesRef.current[idx]) return true;

      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(idx + 1).padStart(frameConfig.digits, '0');
        img.src = `${frameConfig.path}${frameNum}${frameConfig.extension}`;

        const finalize = () => {
          imagesRef.current[idx] = img;
          loadedCountRef.current += 1;
          const currentLoaded = loadedCountRef.current;
          const progress = currentLoaded / totalFrames;

          onProgressUpdateRef.current?.(progress);

          if (!interactiveFiredRef.current && currentLoaded >= interactiveTarget) {
            interactiveFiredRef.current = true;
            onInteractiveReadyRef.current?.();
          }

          if (idx === 0 && lastDrawnIndexRef.current === -1) {
            drawFrame(0);
          }
          resolve(true);
        };

        img.onload = () => {
          if ('decode' in img) {
            img.decode().then(finalize).catch(finalize);
          } else {
            finalize();
          }
        };

        img.onerror = () => {
          loadedCountRef.current += 1;
          resolve(false);
        };
      });
    };

    loadSingleFrameRef.current = loadSingleFrame;

    loadSingleFrame(0).then(() => {
      const initialBatch = [];
      for (let i = 1; i < interactiveTarget; i++) {
        initialBatch.push(loadSingleFrame(i));
      }

      Promise.all(initialBatch).then(() => {
        let cursor = interactiveTarget;
        const batchSize = 10;

        const loadRemaining = () => {
          if (cursor >= totalFrames) return;
          const batch = [];
          const end = Math.min(cursor + batchSize, totalFrames);
          for (let i = cursor; i < end; i++) {
            batch.push(loadSingleFrame(i));
          }
          cursor = end;
          Promise.all(batch).then(() => {
            setTimeout(loadRemaining, 8);
          });
        };

        loadRemaining();
      });
    });

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [totalFrames, frameConfig, drawFrame, handleResize]);

  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!active) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      const diff = target - current;
      if (Math.abs(diff) > 0.005) {
        currentFrameRef.current += diff * 0.2;
      } else {
        currentFrameRef.current = target;
      }

      const frameToDraw = Math.min(
        Math.max(0, Math.round(currentFrameRef.current)),
        totalFrames - 1
      );

      if (frameToDraw !== lastDrawnIndexRef.current) {
        drawFrame(frameToDraw);
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [totalFrames, drawFrame]);

  // GSAP ScrollTrigger driving frame index, telemetry rail, and direct DOM captions
  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    siteConfig.stages.forEach((stage, idx) => {
      const el = overlayRefs.current[idx];
      if (!el) return;
      const style = calculateStageStyle(stage, 0);
      el.style.opacity = style.opacity;
      el.style.transform = `translate3d(0, ${style.translateY}px, 0)`;
      el.style.pointerEvents = style.pointerEvents;
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=400%',
      pin: true,
      pinSpacing: true,
      scrub: 0.15,
      onUpdate: (self) => {
        const p = self.progress;
        const target = p * (totalFrames - 1);
        targetFrameRef.current = target;

        const rounded = Math.round(target);
        if (loadSingleFrameRef.current && (!imagesRef.current[rounded] || !imagesRef.current[rounded].complete)) {
          loadSingleFrameRef.current(rounded);
        }

        // Live "DIRT LEVEL" calculation: 100% down to 0%
        const dirtPercent = Math.max(0, Math.min(100, Math.round((1 - p) * 100)));
        if (dirtLevelTextRef.current) {
          dirtLevelTextRef.current.innerText = `${dirtPercent}%`;
          if (dirtPercent <= 10) {
            dirtLevelTextRef.current.style.color = '#EDE8DF';
          } else if (dirtPercent <= 50) {
            dirtLevelTextRef.current.style.color = '#FF4D1C';
          } else {
            dirtLevelTextRef.current.style.color = '#EDE8DF';
          }
        }
        if (dirtBarFillRef.current) {
          dirtBarFillRef.current.style.height = `${dirtPercent}%`;
        }

        // Direct DOM update of 5 editorial stage overlays
        siteConfig.stages.forEach((stage, idx) => {
          const el = overlayRefs.current[idx];
          if (!el) return;
          const style = calculateStageStyle(stage, p);
          el.style.opacity = style.opacity;
          el.style.transform = `translate3d(0, ${style.translateY}px, 0)`;
          el.style.pointerEvents = style.pointerEvents;
        });

        // Update vertical tick marks
        siteConfig.stages.forEach((stage, idx) => {
          const tick = railTickRefs.current[idx];
          if (!tick) return;
          const isActive = p >= stage.scrollStart && p <= stage.scrollEnd;
          if (isActive) {
            tick.style.backgroundColor = '#FF4D1C';
            tick.style.transform = 'scaleX(1.8)';
          } else {
            tick.style.backgroundColor = 'rgba(237, 232, 223, 0.3)';
            tick.style.transform = 'scaleX(1)';
          }
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, [totalFrames, prefersReducedMotion]);

  // Positioning editorial captions pinned to screen edges, never overlapping car center
  const getCaptionClasses = (position, stageId) => {
    if (stageId === 'hero') {
      return 'left-6 sm:left-16 md:left-24 bottom-24 sm:bottom-16 max-w-lg';
    }
    if (stageId === 'showroom-reveal') {
      return 'left-6 sm:left-16 md:left-24 bottom-24 sm:bottom-16 max-w-lg';
    }

    switch (position) {
      case 'right-top':
        return 'right-6 sm:right-16 md:right-24 top-24 sm:top-28 md:top-36 max-w-sm sm:max-w-md text-right';
      case 'left-top':
        return 'left-6 sm:left-16 md:left-24 top-24 sm:top-28 md:top-36 max-w-sm sm:max-w-md text-left';
      case 'right-bottom':
        return 'right-6 sm:right-16 md:right-24 bottom-28 sm:bottom-24 max-w-sm sm:max-w-md text-right';
      case 'left-bottom':
        return 'left-6 sm:left-16 md:left-24 bottom-28 sm:bottom-24 max-w-sm sm:max-w-md text-left';
      default:
        return 'left-6 bottom-24 max-w-md';
    }
  };

  // Reduced motion alternative
  if (prefersReducedMotion) {
    return (
      <section id="story-section" className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 px-4 bg-[#0E0F10] text-[#EDE8DF]">
        <div className="max-w-4xl w-full text-center mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF4D1C] mb-3 block">
            [ BEFORE & AFTER INSPECTION ]
          </span>
          <h1 className="font-display font-normal text-4xl sm:text-6xl text-[#EDE8DF] mb-3">
            Dolphin Car <span className="italic text-[#FF4D1C]">Spa</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#EDE8DF]/70 max-w-md mx-auto">
            {siteConfig.business.tagline} Drag slider to compare arrival mud with finished luster.
          </p>
        </div>

        <div className="relative w-full max-w-4xl aspect-video overflow-hidden border border-[#EDE8DF]/20 select-none">
          <img
            src="/assets/frames/frame_0150.webp"
            alt="Spotless Showroom Finish"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-[#0E0F10] text-[10px] font-mono uppercase tracking-widest text-[#EDE8DF] border border-[#EDE8DF]/30">
            SHOWROOM
          </div>

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${comparisonSliderPos}%` }}
          >
            <img
              src="/assets/frames/frame_0001.webp"
              alt="Dirty Car Arrival"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-[#0E0F10] text-[10px] font-mono uppercase tracking-widest text-[#FF4D1C] border border-[#FF4D1C]/50">
              DIRTY ARRIVAL
            </div>
          </div>

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#FF4D1C] z-20"
            style={{ left: `${comparisonSliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-[#0E0F10] border border-[#FF4D1C] flex items-center justify-center text-[#FF4D1C] font-mono text-xs">
              ↔
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={comparisonSliderPos}
            onChange={(e) => setComparisonSliderPos(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            aria-label="Before and After car clean comparison slider"
          />
        </div>

        <div className="mt-8 flex gap-4">
          <a
            href={siteConfig.business.telLink}
            className="px-6 py-3 bg-[#FF4D1C] text-[#0E0F10] font-mono text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors"
          >
            Call {siteConfig.business.phone}
          </a>
          <a
            href="#services"
            className="px-6 py-3 border border-[#EDE8DF]/40 text-[#EDE8DF] font-mono text-xs uppercase tracking-wider hover:border-[#EDE8DF] transition-colors"
          >
            Service Menu ↓
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      id="story-section"
      ref={containerRef}
      className="relative w-full h-screen bg-[#0E0F10] overflow-hidden select-none"
    >
      {/* Full-bleed Car Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block object-cover z-0 cursor-default bg-[#0E0F10]"
      />

      {/* Subtle edge vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0E0F10]/70 via-transparent to-[#0E0F10]/50" />

      {/* DASHBOARD TELEMETRY RAIL: Left Edge Progress & Live Dirt Level Readout */}
      <div className="hidden sm:flex flex-col items-start absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        {/* Dirt level title */}
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#EDE8DF]/40 mb-2">
          DIRT LEVEL
        </span>

        {/* Live Dirt Level Percentage Count */}
        <div
          ref={dirtLevelTextRef}
          className="font-mono text-2xl md:text-3xl font-light tabular-nums tracking-tight text-[#EDE8DF] mb-4"
        >
          100%
        </div>

        {/* Vertical Rail with Gauge */}
        <div className="relative w-0.5 h-44 bg-[#EDE8DF]/15 my-1 ml-1 flex flex-col justify-between">
          {/* Active Level Fill Line */}
          <div
            ref={dirtBarFillRef}
            className="absolute top-0 left-0 w-full bg-[#FF4D1C] transition-all duration-75"
            style={{ height: '100%' }}
          />

          {/* 5 Stage Tick Marks */}
          {siteConfig.stages.map((stg, i) => (
            <div
              key={stg.id}
              ref={(el) => (railTickRefs.current[i] = el)}
              className="relative -left-[3px] w-2 h-0.5 bg-[#EDE8DF]/30 origin-left transition-all duration-200"
            />
          ))}
        </div>

        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#EDE8DF]/30 mt-3">
          AUTO 01-05
        </span>
      </div>

      {/* 5 EDITORIAL CAPTIONS (Direct typography on screen, no boxes, no cards) */}
      {siteConfig.stages.map((stage, idx) => {
        const captionClass = getCaptionClasses(stage.position, stage.id);
        const isRight = stage.position.includes('right');

        return (
          <div
            key={stage.id}
            ref={(el) => (overlayRefs.current[idx] = el)}
            className={`absolute z-20 ${captionClass} will-change-transform will-change-opacity`}
            style={{
              opacity: stage.id === 'hero' ? 1 : 0,
              transform: stage.id === 'hero' ? 'translate3d(0, 0px, 0)' : 'translate3d(0, 20px, 0)',
              pointerEvents: stage.id === 'hero' ? 'auto' : 'none'
            }}
          >
            {stage.id === 'hero' ? (
              /* Hero State */
              <div className="text-left">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#EDE8DF]/60 mb-3 block">
                  [{stage.stageTag}]
                </span>
                <h1 className="font-display font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#EDE8DF] leading-[0.95] mb-4">
                  Dolphin Car <span className="italic text-[#FF4D1C]">Spa</span>
                </h1>
                <p className="font-sans text-base sm:text-xl text-[#EDE8DF]/85 max-w-md font-light mb-6">
                  {stage.tagline}
                </p>
                <div className="font-mono text-xs tracking-widest uppercase text-[#EDE8DF]/50 flex items-center space-x-2">
                  <span>Scroll down to clean</span>
                  <span className="text-[#FF4D1C]">↓</span>
                </div>
              </div>
            ) : stage.id === 'showroom-reveal' ? (
              /* Stage 5: Final Reveal */
              <div className="text-left">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF4D1C] mb-2 block">
                  [{stage.stageTag} • COMPLETE]
                </span>
                <h2 className="font-display font-normal text-3xl sm:text-5xl md:text-6xl text-[#EDE8DF] leading-tight mb-2">
                  {stage.title}
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#EDE8DF]/80 max-w-md font-light mb-6">
                  {stage.shortLine}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#contact"
                    className="inline-block px-7 py-3.5 bg-[#FF4D1C] text-[#0E0F10] font-mono text-xs uppercase tracking-wider font-semibold rounded-none hover:bg-[#EDE8DF] transition-colors"
                  >
                    {stage.ctaText} →
                  </a>
                  <a
                    href={siteConfig.business.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3.5 border border-[#EDE8DF]/40 text-[#EDE8DF] font-mono text-xs uppercase tracking-wider hover:border-[#EDE8DF] transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              /* Stages 2, 3, 4: Pure Editorial Captions */
              <div className={`flex flex-col ${isRight ? 'items-end' : 'items-start'}`}>
                <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#EDE8DF]/50 mb-1.5 block">
                  [{stage.stageTag}]
                </span>
                <h2 className="font-display font-normal text-2xl sm:text-4xl md:text-5xl text-[#EDE8DF] leading-tight mb-2">
                  {stage.title}
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#EDE8DF]/75 font-light max-w-sm sm:max-w-md leading-relaxed">
                  {stage.shortLine}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
