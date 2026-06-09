import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { featuredProducts } from './data';

export default function FeaturedProductsSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 lg:px-10 pb-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#86868b] uppercase mb-2">
            PC BÁN CHẠY
          </p>
          <h2 className="text-[2rem] font-bold tracking-tight text-[#1d1d1f]">Sản phẩm nổi bật</h2>
        </div>
        <a href="#" className="text-sm text-[#0071e3] hover:underline flex items-center gap-1 shrink-0">
          Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredProducts.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -5 }}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#e8e8ed] shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Gradient image placeholder */}
            <div className="relative">
              <div
                className="w-full aspect-square"
                style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
              />
              {p.badge && (
                <span className="absolute top-3 left-3 bg-[#1d1d1f] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  {p.badge}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-1">{p.name}</h3>
              <p className="text-[11px] text-[#86868b] leading-relaxed mb-3">{p.specs}</p>
              <p className="text-[13px] font-bold text-[#1d1d1f]">{p.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
