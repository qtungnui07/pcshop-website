import { motion } from 'framer-motion';
import { ChevronRight, Gamepad2, Clock, Palette, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';
import { laptopCategories } from './data';

const getCategorySlug = (name: string) => {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('gaming')) return Gamepad2;
  if (n.includes('van phong') || n.includes('văn phòng')) return Clock;
  if (n.includes('macbook')) return Laptop;
  if (n.includes('do hoa') || n.includes('đồ họa')) return Palette;
  return Laptop; // Default
};

export default function LaptopCategoriesSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10 pb-20">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-[#86868b] uppercase mb-2">
        LAPTOP THEO NHU CẦU
      </p>
      <h2 className="text-[2rem] font-bold tracking-tight text-[#1d1d1f] mb-10">
        Chọn Laptop phù hợp với bạn
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {laptopCategories.map((cat, i) => {
          const Icon = getCategoryIcon(cat.name);
          return (
            <Link
              to={`/laptop/${getCategorySlug(cat.name)}`}
              key={cat.name}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Product image */}
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-zinc-50">
                  <img
                    src={`/images/${cat.imgName}`}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center border border-white/20 shadow-sm">
                    <Icon className="w-4.5 h-4.5 text-zinc-500" strokeWidth={1.8} />
                  </div>
                </div>
                <div className="flex items-center justify-between px-3.5 py-3">
                  <span className="text-[13px] font-bold text-zinc-800 group-hover:text-zinc-950 transition-colors">{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
