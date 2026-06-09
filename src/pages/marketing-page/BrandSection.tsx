import { motion } from 'framer-motion';
// import { Play } from 'lucide-react';

export default function BrandSection() {
  return (
    <section className="bg-white py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="max-w-[560px] mx-auto px-6"
      >
        <h2 className="text-[2.5rem] font-bold tracking-tight text-[#1d1d1f] leading-tight mb-5">
          Đẳng cấp trong từng chi tiết
        </h2>
        <p className="text-[15px] text-[#6e6e73] leading-relaxed mb-10">
          Chúng tôi không chỉ bán PC, chúng tôi mang đến trải nghiệm.<br />
          Từ hiệu năng, thiết kế đến dịch vụ hậu mãi — tất cả đều ở mức tốt nhất.
        </p>
      </motion.div>
    </section>
  );
}
