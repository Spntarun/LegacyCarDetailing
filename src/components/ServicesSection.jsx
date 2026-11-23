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
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
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

    const xTo = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3.out' });

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
      className="relative py-28 sm:py-36 px-4 sm:px-8 lg:px-12 bg-[#0B0B0D] text-[#EDE8DF] select-none border-t border-[#EDE8DF]/10"
    >
      {/* Floating cursor thumbnail for desktop hover */}
      <div
        ref={floatingImageRef}
        className={`hidden md:block fixed top-0 left-0 w-60 aspect-[16/10] overflow-hidden pointer-events-none z-50 border border-[#C9A24B]/35 bg-[#141417] shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hoveredImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {hoveredImage && (
          <img
            src={hoveredImage}
            alt="Treatment Stage Preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 pb-8 border-b border-[#EDE8DF]/10">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="inline-block w-6 h-[1px] bg-[#C9A24B]" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C9A24B]">
                SIGNATURE PROTOCOLS • PPF • CERAMIC • SUN FILMS • WRAPS
              </span>
            </div>
            <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#EDE8DF] leading-[0.98]">
              Automotive protection, <br />
              <span className="italic font-light text-[#C9A24B]">executed to perfection.</span>
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-[#EDE8DF]/70 max-w-sm mt-6 md:mt-0 font-light leading-relaxed">
            Specialized studio expertise in self-healing Paint Protection Film (PPF), multi-layer 9H ceramic coatings, high heat-rejection sun films, and bespoke vinyl transformations.
          </p>
        </div>

        {/* 8 Full-Width Interactive Rows */}
        <div ref={rowsContainerRef} className="border-t border-[#EDE8DF]/10 divide-y divide-[#EDE8DF]/10">
          {siteConfig.services.map((service) => {
            const isExpanded = expandedMobileId === service.id;
            const hasMeta = service.duration || service.from || service.includes;

            return (
              <div
                key={service.id}
                className="service-menu-row group relative transition-colors duration-300 cursor-pointer hover:bg-[#141417]/60"
                onMouseEnter={() => setHoveredImage(service.imageCrop)}
                onMouseLeave={() => setHoveredImage(null)}
                onClick={() => toggleMobileExpand(service.id)}
              >
                {/* Accent hairline underline that expands on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C9A24B] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

                <div className="py-7 sm:py-10 px-2 sm:px-6 flex items-center justify-between">
                  {/* Left: Index + Title */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-8">
                    <div className="flex items-baseline space-x-4 sm:space-x-8">
                      <span className="font-mono text-sm sm:text-base text-[#C9A24B]/70 group-hover:text-[#C9A24B] transition-colors">
                        {service.num}
                      </span>
                      <h3 className="font-display font-light text-2xl sm:text-4xl md:text-5xl tracking-tight text-[#EDE8DF] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                        {service.title}
                      </h3>
                    </div>

                    {/* Optional metadata line rendered only when values exist */}
                    {hasMeta && (
                      <div className="hidden lg:flex items-center space-x-2 font-mono text-[11px] text-[#C9A24B]/80 uppercase tracking-widest mt-1 sm:mt-0 sm:ml-4">
                        {service.duration && <span>{service.duration}</span>}
                        {service.duration && service.from && <span>•</span>}
                        {service.from && <span>From {service.from}</span>}
                        {(service.duration || service.from) && service.includes && <span>•</span>}
                        {service.includes && <span>{service.includes}</span>}
                      </div>
                    )}
                  </div>

                  {/* Right: Short description on desktop + Arrow */}
                  <div className="flex items-center space-x-6 sm:space-x-10">
                    <p className="hidden md:block font-body text-xs sm:text-sm text-[#EDE8DF]/65 group-hover:text-[#EDE8DF]/90 max-w-xs text-right transition-colors font-light leading-relaxed">
                      {service.description}
                    </p>
                    <span className="font-mono text-lg sm:text-2xl text-[#EDE8DF]/50 group-hover:text-[#C9A24B] transition-all duration-300 transform group-hover:-rotate-45">
                      →
                    </span>
                  </div>
                </div>

                {/* Mobile Tap-To-Expand Details */}
                <div
                  className={`md:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] px-4 sm:px-6 ${
                    isExpanded ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                  }`}
                >
                  <p className="font-body text-xs text-[#EDE8DF]/80 mb-4 leading-relaxed font-light">
                    {service.description}
                  </p>

                  {hasMeta && (
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[#C9A24B] uppercase tracking-wider mb-4 pb-2 border-b border-[#EDE8DF]/10">
                      {service.duration && <span>{service.duration}</span>}
                      {service.from && <span>• From {service.from}</span>}
                      {service.includes && <span>• {service.includes}</span>}
                    </div>
                  )}

                  <div className="relative aspect-[16/9] w-full max-w-sm overflow-hidden border border-[#EDE8DF]/15 mb-4 shadow-lg">
                    <img
                      src={service.imageCrop}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <a
                    href={`https://wa.me/918123543569?text=Hello%20Legacy%20Car%20Detailing%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(service.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2.5 bg-[#C9A24B] text-[#0B0B0D] font-mono text-[11px] uppercase tracking-wider font-semibold hover:bg-white transition-colors"
                  >
                    Reserve Protocol via WhatsApp →
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
