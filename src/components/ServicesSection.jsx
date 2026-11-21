import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../config/siteConfig';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const rowsContainerRef = useRef(null);
  const floatingImageRef = useRef(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [expandedMobileId, setExpandedMobileId] = useState(null);

  // Stagger reveal on scroll
  useEffect(() => {
    const rows = rowsContainerRef.current?.querySelectorAll('.service-menu-row');
    if (!rows) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        {
          y: 35,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Floating thumbnail follows mouse on desktop
  useEffect(() => {
    const el = floatingImageRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      xTo(e.clientX + 24);
      yTo(e.clientY - 60);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleMobileExpand = (id) => {
    setExpandedMobileId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#EDE8DF] text-[#0E0F10] select-none"
    >
      {/* Floating cursor thumbnail for desktop hover */}
      <div
        ref={floatingImageRef}
        className={`hidden md:block fixed top-0 left-0 w-52 aspect-[16/10] overflow-hidden pointer-events-none z-50 border border-[#0E0F10] bg-[#0E0F10] shadow-2xl transition-opacity duration-200 ${
          hoveredImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {hoveredImage && (
          <img
            src={hoveredImage}
            alt="Service stage preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 pb-8 border-b border-[#0E0F10]/20">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#0E0F10]/60 mb-3 block">
              [ SERVICE MENU • 08 TREATMENTS ]
            </span>
            <h2 className="font-display font-normal text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#0E0F10] leading-[0.95]">
              Hand-finished care, <br />
              <span className="italic font-light">zero shortcuts.</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#0E0F10]/70 max-w-sm mt-6 md:mt-0 font-normal leading-relaxed">
            Every vehicle receives dedicated bay time, clean microfiber towels, and medical-grade attention. Select a treatment below.
          </p>
        </div>

        {/* 8 Full-Width Interactive Rows */}
        <div ref={rowsContainerRef} className="border-t border-[#0E0F10]/20 divide-y divide-[#0E0F10]/20">
          {siteConfig.services.map((service) => {
            const isExpanded = expandedMobileId === service.id;

            return (
              <div
                key={service.id}
                className="service-menu-row group relative transition-colors duration-200 cursor-pointer hover:bg-[#0E0F10] hover:text-[#EDE8DF]"
                onMouseEnter={() => setHoveredImage(service.imageCrop)}
                onMouseLeave={() => setHoveredImage(null)}
                onClick={() => toggleMobileExpand(service.id)}
              >
                <div className="py-6 sm:py-9 px-2 sm:px-6 flex items-center justify-between">
                  {/* Left: Index + Title */}
                  <div className="flex items-baseline space-x-4 sm:space-x-8">
                    <span className="font-mono text-sm sm:text-lg text-[#0E0F10]/40 group-hover:text-[#EDE8DF]/50 transition-colors">
                      {service.num}
                    </span>
                    <h3 className="font-display font-normal text-2xl sm:text-4xl md:text-5xl tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                      {service.title}
                    </h3>
                  </div>

                  {/* Right: Short description on desktop + Arrow */}
                  <div className="flex items-center space-x-6 sm:space-x-12">
                    <p className="hidden md:block font-sans text-xs sm:text-sm text-[#0E0F10]/65 group-hover:text-[#EDE8DF]/80 max-w-xs text-right transition-colors font-light">
                      {service.description}
                    </p>
                    <span className="font-mono text-lg sm:text-2xl text-[#0E0F10] group-hover:text-[#FF4D1C] transition-all duration-300 transform group-hover:-rotate-45">
                      →
                    </span>
                  </div>
                </div>

                {/* Mobile Tap-To-Expand Details */}
                <div
                  className={`md:hidden overflow-hidden transition-all duration-300 px-4 sm:px-6 ${
                    isExpanded ? 'max-h-80 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                  }`}
                >
                  <p className="font-sans text-xs text-[#0E0F10]/80 group-hover:text-[#EDE8DF]/90 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="relative aspect-[16/9] w-full max-w-sm rounded-none overflow-hidden border border-[#0E0F10]/20 mb-3">
                    <img
                      src={service.imageCrop}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <a
                    href={`https://wa.me/918660036822?text=Hello%20Dolphin%20Car%20Spa%2C%20I%20would%20like%20to%20book%20${encodeURIComponent(service.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-[#FF4D1C] text-[#0E0F10] font-mono text-[11px] uppercase tracking-wider font-semibold"
                  >
                    Book via WhatsApp →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
