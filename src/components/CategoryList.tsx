import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories, containerVariants, itemVariants } from '../constants/data';

const getCategoryUrl = (name: string) => {
  switch (name.toLowerCase()) {
    case 'pc': return '/pc';
    case 'laptop': return '/laptop';
    case 'màn hình': return '/phu-kien/man-hinh';
    case 'cpu': return '/linh-kien/cpu-vi-xu-ly';
    case 'gpu': return '/linh-kien/vga-card-man-hinh';
    case 'ram': return '/linh-kien/ram';
    case 'hdd/ssd': return '/linh-kien/o-cung-ssd';
    case 'chuột': return '/phu-kien/chuot';
    case 'bàn phím': return '/phu-kien/ban-phim';
    case 'âm thanh': return '/phu-kien/tai-nghe';
    default: return `/store/${name.toLowerCase()}`;
  }
};

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
        <Link to={getCategoryUrl(item.name)} key={index}>
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center min-w-[100px] cursor-pointer group snap-start">
            <div className="group-hover:scale-105 transition-transform duration-300">
              {item.icon}
            </div>
            <span className="text-sm font-medium text-[#1d1d1f] mt-1 group-hover:text-blue-600 transition-colors">
              {item.name}
            </span>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
}
