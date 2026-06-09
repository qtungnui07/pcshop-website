import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { latestProducts } from '../constants/data';

export default function ProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollRight = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const cardWidth = (scrollRef.current.children[0] as HTMLElement).offsetWidth;
      const gap = window.innerWidth >= 768 ? 24 : 16;
      scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const cardWidth = (scrollRef.current.children[0] as HTMLElement).offsetWidth;
      const gap = window.innerWidth >= 768 ? 24 : 16;
      scrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-16 md:mt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-8">
          <span className="text-[#1d1d1f]">Thế hệ mới nhất.</span> <span className="text-[#86868b]">Xem ngay có gì mới.</span>
        </h2>
      </div>

      <div className="relative group">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-4 scrollbar-hide snap-x snap-mandatory"
        >
          <div className="shrink-0 snap-start" style={{ width: 'max(0px, 50vw - 800px)' }}></div>

          {latestProducts.map((product, idx) => (
            <div
              key={idx}
              className="min-w-[300px] md:min-w-[340px] lg:min-w-[400px] h-[480px] md:h-[500px] rounded-[2rem] snap-start relative overflow-hidden cursor-pointer shadow-[2px_4px_16px_rgba(0,0,0,0.04)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              style={{ background: `linear-gradient(135deg, #${product.from}, #${product.to})` }}
            >
            </div>
          ))}
          <div className="shrink-0 snap-end" style={{ width: 'max(0px, 50vw - 800px)' }}></div>
        </div>
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-[68px] h-[68px] bg-[#e8e8ed]/90 backdrop-blur-md rounded-full items-center justify-center shadow-sm hover:bg-[#e8e8ed] hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 text-[#424245]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-8 h-8 opacity-80 mr-1" strokeWidth={2.5} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-[68px] h-[68px] bg-[#e8e8ed]/90 backdrop-blur-md rounded-full items-center justify-center shadow-sm hover:bg-[#e8e8ed] hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 text-[#424245]"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-8 h-8 opacity-80 ml-1" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
