import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { pcCategories } from './data';

export default function CategoriesSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 lg:px-10 py-20">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-[#86868b] uppercase mb-2">
        SHOP THEO NHU CẦU
      </p>
      <h2 className="text-[2rem] font-bold tracking-tight text-[#1d1d1f] mb-10">
        Chọn PC phù hợp với bạn
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {pcCategories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -5 }}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#e8e8ed] shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Product image */}
            <div
              className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-50"
              style={{
                background: cat.imgName
                  ? `linear-gradient(135deg, ${cat.from || '#f8fafc'}, ${cat.to || '#eef2ff'})`
                  : '#f8fafc'
              }}
            >
              {(cat.imgName || cat.image) && (
                <img
                  src={cat.imgName ? `/images/${cat.imgName}` : cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1d1d1f]">{cat.name}</span>
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
