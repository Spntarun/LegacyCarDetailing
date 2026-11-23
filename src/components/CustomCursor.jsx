import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only run on non-touch devices with fine pointers
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });

    const xRing = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.service-menu-row') ||
        target.closest('input') ||
        target.closest('[role="button"]')
      ) {
        ring.style.width = '46px';
        ring.style.height = '46px';
        ring.style.borderColor = 'rgba(201, 162, 75, 0.85)';
        ring.style.backgroundColor = 'rgba(201, 162, 75, 0.08)';
      } else {
        ring.style.width = '26px';
        ring.style.height = '26px';
        ring.style.borderColor = 'rgba(201, 162, 75, 0.4)';
        ring.style.backgroundColor = 'transparent';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring hidden md:block" aria-hidden="true" />
    </>
  );
}
