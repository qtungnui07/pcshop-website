import { motion } from 'framer-motion';
import { trustBadges } from './data';

export default function TrustBadgesSection() {
  return (
    <section className="border-t border-[#d2d2d7] bg-white py-14">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#e8e8ed]">
          {trustBadges.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center text-center gap-3 py-8 lg:py-0 px-6"
            >
              <Icon className="w-7 h-7 text-[#1d1d1f]" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] font-semibold text-[#1d1d1f]">{title}</p>
                <p className="text-[11px] text-[#86868b] mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
