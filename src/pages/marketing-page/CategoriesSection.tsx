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
            {/* Gradient placeholder */}
            <div
              className="w-full aspect-[4/3]"
              style={{ background: `linear-gradient(135deg, ${cat.from}, ${cat.to})` }}
            />
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
