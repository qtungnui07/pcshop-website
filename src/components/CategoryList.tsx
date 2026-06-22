  import { motion } from 'framer-motion';
  import { Link } from 'react-router-dom';
  import { categories, containerVariants, itemVariants } from '../constants/data';

  const getCategoryUrl = (name: string) => {
    switch (name.toLowerCase()) {
      case 'pc': return '/pc';
      case 'laptop': return '/laptop';
      case 'màn hình': return '/phu-kien?category=man-hinh';
      case 'cpu': return '/linh-kien?category=cpu#danh-muc-linh-kien';
      case 'gpu': return '/linh-kien?category=vga#danh-muc-linh-kien';
      case 'ram': return '/linh-kien?category=ram#danh-muc-linh-kien';
      case 'hdd/ssd': return '/linh-kien?category=ssd#danh-muc-linh-kien';
      case 'chuột': return '/phu-kien?category=chuot';
      case 'bàn phím': return '/phu-kien?category=ban-phim';
      case 'âm thanh': return '/phu-kien?category=tai-nghe';
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
        className="flex overflow-x-auto lg:justify-center gap-8 pb-8 scrollbar-hide snap-x"
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
