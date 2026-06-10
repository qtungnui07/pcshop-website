import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlides } from './data';

export default function HeroSection() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = heroSlides[slide];

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20 flex items-center gap-10 lg:gap-16" style={{ minHeight: 500 }}>

        {/* Left – text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit ={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="flex-1 min-w-0"
          >
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#86868b] uppercase mb-5">
              {current.label}
            </p>
            <h1 className="text-5xl lg:text-[3.75rem] font-bold tracking-tight text-[#1d1d1f] leading-[1.05] mb-6">
              {current.title[0]}<br />{current.title[1]}
            </h1>
            <p className="text-[15px] text-[#6e6e73] leading-relaxed mb-9 whitespace-pre-line">
              {current.desc}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button className="px-6 py-[11px] bg-[#1d1d1f] text-white text-sm font-medium rounded-full hover:bg-[#3d3d3f] active:scale-95 transition-all duration-200">
                {current.cta1}
              </button>
              <button className="px-6 py-[11px] border border-[#1d1d1f]/70 text-[#1d1d1f] text-sm font-medium rounded-full hover:bg-[#1d1d1f] hover:text-white active:scale-95 transition-all duration-200">
                {current.cta2}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right – gradient image placeholder */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${slide}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1   }}
            exit ={{ opacity: 0, scale: 0.95  }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="hidden md:flex flex-1 items-center justify-center"
          >
            <div
              className="w-full rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.10)]"
              style={{
                height: 380,
                background: `linear-gradient(135deg, ${current.from}, ${current.to})`,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === slide ? 'w-6 bg-[#1d1d1f]' : 'w-2 bg-[#1d1d1f]/25'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
