import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Search, ShoppingBag, Monitor, Cpu, Mouse, Keyboard, Headphones, Box, HardDrive, ChevronRight, ChevronLeft } from 'lucide-react';

const navItems = [
  {
    name: 'Cửa hàng',
    dropdown: [
      { title: 'Mua sắm', links: ['Mua Sản Phẩm Mới Nhất', 'PC Build Sẵn', 'Linh Kiện Lẻ', 'Màn Hình', 'Gaming Gear'] },
      { title: 'Liên kết nhanh', links: ['Tìm cửa hàng gần nhất', 'Tình trạng đơn hàng', 'Chính sách bảo hành'] },
    ]
  },
  {
    name: 'PC Build',
    dropdown: [
      { title: 'Theo Nhu Cầu', links: ['PC Gaming', 'PC Đồ Họa 3D', 'PC Sinh Viên - Văn Phòng', 'Mini PC'] },
      { title: 'Theo Mức Giá', links: ['Phổ thông (Dưới 15Tr)', 'Tầm trung (15 - 30Tr)', 'Cao cấp (Trên 30Tr)', 'Hi-End Custom'] },
    ]
  },
  {
    name: 'Linh kiện',
    dropdown: [
      { title: 'Xử Lý & Đồ Họa', links: ['CPU - Vi Xử Lý', 'VGA - Card Màn Hình', 'Mainboard - Bo Mạch Chủ'] },
      { title: 'Lưu Trữ & Bộ Nhớ', links: ['RAM', 'Ổ Cứng SSD', 'Ổ Cứng HDD'] },
      { title: 'Năng Lượng & Tản Nhiệt', links: ['Nguồn (PSU)', 'Tản Nhiệt Khí', 'Tản Nhiệt Nước (AIO/Custom)', 'Case - Vỏ Máy Tính'] },
    ]
  },
  { name: 'Phụ kiện', dropdown: null },
  { name: 'Hỗ trợ', dropdown: null },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      // Các phần tử con (các cột) sẽ xuất hiện cách nhau 0.05 giây để tạo hiệu ứng gợn sóng
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -12
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1]
    }
  },
};

function App() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollRight = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const cardWidth = (scrollRef.current.children[0] as HTMLElement).offsetWidth;
      const gap = window.innerWidth >= 768 ? 24 : 16;
      scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const cardWidth = (scrollRef.current.children[0] as HTMLElement).offsetWidth;
      const gap = window.innerWidth >= 768 ? 24 : 16;
      scrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }
  };

  const latestProducts = [
    { from: "D9F9DF", to: "AEE2FF" },
    { from: "AEE2FF", to: "B5BAFF" },
    { from: "B5BAFF", to: "9FA1FF" },
    { from: "9FA1FF", to: "ECB65F" },
    { from: "ECB65F", to: "F0E76F" },
    { from: "F0E76F", to: "D9F9DF" },
  ];

  const categories = [
    { name: 'PC Build', icon: <Box className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
    { name: 'Màn Hình', icon: <Monitor className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
    { name: 'Linh Kiện', icon: <Cpu className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
    { name: 'Lưu Trữ', icon: <HardDrive className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
    { name: 'Chuột', icon: <Mouse className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
    { name: 'Bàn Phím', icon: <Keyboard className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
    { name: 'Âm Thanh', icon: <Headphones className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-blue-200">
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${activeMenu ? 'bg-white' : 'bg-white/70 backdrop-blur-md'
          }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-[1000px] mx-auto px-4">
          <ul className="flex items-center justify-between h-11 text-[12px] text-[#1d1d1f]/80 font-medium tracking-wide">
            <li><a href="#" className="hover:text-black transition-colors"><Monitor className="w-4 h-4" /></a></li>

            {navItems.map((item) => (
              <li
                key={item.name}
                className="hidden md:block h-11"
                onMouseEnter={() => setActiveMenu(item.name)}
              >
                <a href="#" className="h-full flex items-center px-2 hover:text-black transition-colors">
                  {item.name}
                </a>
              </li>
            ))}

            <li><a href="#" className="hover:text-black transition-colors"><Search className="w-4 h-4" /></a></li>
            <li><a href="#" className="hover:text-black transition-colors"><ShoppingBag className="w-4 h-4" /></a></li>
          </ul>
        </div>
        <AnimatePresence>
          {activeMenu && navItems.find(i => i.name === activeMenu)?.dropdown && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="absolute top-11 left-0 w-full bg-white overflow-hidden"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-[1000px] mx-auto px-4 py-12 flex gap-16"
              >
                {navItems.find(i => i.name === activeMenu)?.dropdown?.map((col, idx) => (
                  // MỖI CỘT
                  <div
                    key={idx}
                    className="flex flex-col"
                  >
                    <motion.h3 variants={itemVariants} className="text-[12px] text-[#86868b] mb-4 tracking-wider uppercase font-semibold">
                      {col.title}
                    </motion.h3>
                    <ul className="space-y-3">
                      {col.links.map((link, lIdx) => (
                        <motion.li variants={itemVariants} key={lIdx}>
                          <a href="#" className="text-xl font-medium text-[#1d1d1f] hover:text-blue-600 transition-colors block">
                            {link}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-24 pb-12 relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pt-8">
            <h1 className="text-4xl md:text-[48px] font-semibold tracking-tight text-[#1d1d1f]">
              Cửa Hàng
            </h1>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-[#86868b] text-sm md:text-base font-medium">
                Cách tốt nhất để mua <br className="hidden md:block" /> <span className="text-[#1d1d1f]">linh kiện bạn thích.</span>
              </p>
              <a href="#" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
                Kết nối với Kỹ thuật viên &gt;
              </a>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-8 pb-8 scrollbar-hide snap-x">
            {categories.map((item, index) => (
              <div key={index} className="flex flex-col items-center justify-center min-w-[100px] cursor-pointer group snap-start">
                <div className="group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-[#1d1d1f] mt-1 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

        </div>

        <div className="mt-16 md:mt-24 pb-12">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-8">
              <span className="text-[#1d1d1f]">Thế hệ mới nhất.</span> <span className="text-[#86868b]">Xem ngay có gì mới.</span>
            </h2>
          </div>

          <div className="relative group">
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-4 scrollbar-hide snap-x snap-mandatory"
            >
              <div className="shrink-0 snap-start" style={{ width: 'max(0px, 50vw - 800px)' }}></div>

              {latestProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="min-w-[300px] md:min-w-[340px] lg:min-w-[400px] h-[480px] md:h-[500px] rounded-[2rem] snap-start relative overflow-hidden cursor-pointer shadow-[2px_4px_16px_rgba(0,0,0,0.04)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  style={{ background: `linear-gradient(135deg, #${product.from}, #${product.to})` }}
                >
                </div>
              ))}
              <div className="shrink-0 snap-end" style={{ width: 'max(0px, 50vw - 800px)' }}></div>
            </div>
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-[68px] h-[68px] bg-[#e8e8ed]/90 backdrop-blur-md rounded-full items-center justify-center shadow-sm hover:bg-[#e8e8ed] hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 text-[#424245]"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-8 h-8 opacity-80 mr-1" strokeWidth={2.5} />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-[68px] h-[68px] bg-[#e8e8ed]/90 backdrop-blur-md rounded-full items-center justify-center shadow-sm hover:bg-[#e8e8ed] hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 text-[#424245]"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-8 h-8 opacity-80 ml-1" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;