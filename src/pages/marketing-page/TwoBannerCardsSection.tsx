import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const cards = [
  {
    badge: 'MỚI MẺ',
    title: 'Trải nghiệm vượt trội',
    description: 'Nâng tầm không gian làm việc của bạn với hệ sinh thái đa dạng.',
    from: 'e0c3fc',
    to: '8ec5fc',
  },
  {
    badge: 'ƯU ĐÃI',
    title: 'Combo Siêu Tiết Kiệm',
    description: 'Mua PC kèm màn hình và phụ kiện để nhận ngay giá hời.',
    from: 'fbc2eb',
    to: 'a6c1ee',
  }
];

export default function TwoBannerCardsSection() {
  return (
    <div className="pb-12 md:pb-24">
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
          <span className="text-[#1d1d1f]">Ưu đãi đặc biệt.</span> <span className="text-[#86868b]">Dành riêng cho bạn.</span>
        </h2>
      </div>

      <div className="relative group">
        <motion.div
          className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-4 scrollbar-hide snap-x snap-mandatory"
        >
          <div className="shrink-0 snap-start [--page-padding:16px] md:[--page-padding:32px] lg:[--page-padding:40px] xl:[--page-padding:48px] 2xl:[--page-padding:64px]" style={{ width: 'max(var(--page-padding), calc(50vw - 900px + var(--page-padding)))' }}></div>

          {cards.map((card, idx) => (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              key={idx}
              className="w-[280px] md:w-[300px] lg:w-[320px] xl:w-[360px] 2xl:w-[400px] shrink-0 h-[360px] md:h-[400px] lg:h-[420px] xl:h-[460px] 2xl:h-[500px] rounded-[2rem] snap-start relative overflow-hidden shadow-[2px_4px_16px_rgba(0,0,0,0.04)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-6 md:p-8 flex flex-col justify-between group cursor-pointer"
              style={{ background: `linear-gradient(135deg, #${card.from}, #${card.to})` }}
            >
              {/* Nội dung chữ */}
              <div className="flex flex-col text-[#1d1d1f]">
                {card.badge && (
                  <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-2 md:mb-3 opacity-80">
                    {card.badge}
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-sm md:text-base opacity-80 max-w-[80%] leading-relaxed">
                  {card.description}
                </p>
              </div>
              
              {/* Hiệu ứng mờ góc dưới */}
              <div className="flex justify-end items-end w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    →
                 </div>
              </div>
            </motion.div>
          ))}

          <div className="shrink-0 snap-end [--page-padding:16px] md:[--page-padding:32px] lg:[--page-padding:40px] xl:[--page-padding:48px] 2xl:[--page-padding:64px]" style={{ width: 'max(var(--page-padding), calc(50vw - 900px + var(--page-padding)))' }}></div>
        </motion.div>
      </div>
    </div>
  );
}
