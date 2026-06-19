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
    <section className="relative overflow-hidden w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${slide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit ={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Thay thế bằng thẻ <img src="..." className="w-full h-full object-cover" /> sau này */}
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${current.from}, ${current.to})`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === slide ? 'w-6 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]' : 'w-2 bg-white/50 hover:bg-white/70 shadow-[0_1px_2px_rgba(0,0,0,0.2)]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
