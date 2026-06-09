import { motion } from 'framer-motion';
import { categories, containerVariants, itemVariants } from '../constants/data';

export default function CategoryList() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="flex overflow-x-auto gap-8 pb-8 scrollbar-hide snap-x"
    >
      {categories.map((item, index) => (
        <motion.div variants={itemVariants} key={index} className="flex flex-col items-center justify-center min-w-[100px] cursor-pointer group snap-start">
          <div className="group-hover:scale-105 transition-transform duration-300">
            {item.icon}
          </div>
          <span className="text-sm font-medium text-[#1d1d1f] mt-1 group-hover:text-blue-600 transition-colors">
            {item.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
