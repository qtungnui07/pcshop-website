import { type Variants } from 'framer-motion';
import { Box, Monitor, Cpu, HardDrive, Mouse, Keyboard, Headphones } from 'lucide-react';

export const navItems = [
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

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const itemVariants: Variants = {
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

export const latestProducts = [
  { from: "D9F9DF", to: "AEE2FF" },
  { from: "AEE2FF", to: "B5BAFF" },
  { from: "B5BAFF", to: "9FA1FF" },
  { from: "9FA1FF", to: "ECB65F" },
  { from: "ECB65F", to: "F0E76F" },
  { from: "F0E76F", to: "D9F9DF" },
];

export const categories = [
  { name: 'PC Build', icon: <Box className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Màn Hình', icon: <Monitor className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Linh Kiện', icon: <Cpu className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Lưu Trữ', icon: <HardDrive className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Chuột', icon: <Mouse className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Bàn Phím', icon: <Keyboard className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Âm Thanh', icon: <Headphones className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
];
