import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Monitor, Cpu, Mouse, Keyboard, Headphones, Box, HardDrive } from 'lucide-react';

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

function App() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
      
      {/* --- LỚP PHỦ LÀM MỜ NỀN (OVERLAY) --- */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            // bg-black/40 tạo màu tối mờ, backdrop-blur-md làm nhòe nội dung bên dưới
            className="fixed inset-0 z-40  backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* --- GLOBAL NAVBAR --- */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
          // Đổi sang nền trắng sáng thay vì đen
          activeMenu ? 'bg-white' : 'bg-white/70 backdrop-blur-md'
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-[1024px] mx-auto px-4">
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

        {/* --- MEGA MENU DROPDOWN --- */}
        <AnimatePresence>
          {activeMenu && navItems.find(i => i.name === activeMenu)?.dropdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              // Background trắng hoàn toàn, không có viền đen
              className="absolute top-11 left-0 w-full bg-white overflow-hidden"
            >
              <div className="max-w-[1024px] mx-auto px-4 py-10 flex gap-16">
                {navItems.find(i => i.name === activeMenu)?.dropdown?.map((col, idx) => (
                  <div key={idx} className="flex flex-col">
                    {/* Tiêu đề cột nhạt màu */}
                    <h3 className="text-[12px] text-[#86868b] mb-3">{col.title}</h3>
                    <ul className="space-y-2">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx}>
                          {/* Chữ to, đậm, đen xám chuẩn Apple */}
                          <a href="#" className="text-xl font-semibold text-[#1d1d1f] hover:text-blue-600 transition-colors">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="pt-24 pb-12 relative z-10">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
          
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
      </main>
    </div>
  );
}

export default App;