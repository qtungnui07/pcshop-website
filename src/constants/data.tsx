import { type Variants } from 'framer-motion';
import { Box, Monitor, Cpu, HardDrive, Mouse, Keyboard, Headphones, Laptop } from 'lucide-react';

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
  { name: 'Laptop', dropdown: null },
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
  { badge: "Mới", title: "PC Build Gaming", description: "Sức mạnh vượt trội. Chiến mọi tựa game.", price: "Từ 15.990.000đ", from: "D9F9DF", to: "AEE2FF" },
  { badge: "Bán chạy", title: "Màn hình 4K", description: "Độ phân giải siêu nét cho đồ họa.", price: "Từ 8.490.000đ", from: "AEE2FF", to: "B5BAFF" },
  { badge: "Sắp ra mắt", title: "RTX 5090", description: "Đỉnh cao card đồ họa thế hệ mới.", price: "Đang cập nhật", from: "B5BAFF", to: "9FA1FF" },
  { badge: "Giảm giá", title: "Bàn phím Cơ", description: "Gõ êm ái, LED RGB siêu sáng.", price: "Từ 1.290.000đ", from: "9FA1FF", to: "ECB65F" },
  { badge: "Mới", title: "Chuột Siêu Nhẹ", description: "Phản hồi nhanh, thiết kế công thái học.", price: "Từ 1.990.000đ", from: "ECB65F", to: "F0E76F" },
  { badge: "", title: "Tai nghe 7.1", description: "Âm thanh vòm sống động.", price: "Từ 2.490.000đ", from: "F0E76F", to: "D9F9DF" },
];

export const categories = [
  { name: 'PC Build', icon: <Box className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Màn Hình', icon: <Monitor className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Laptop', icon: <Laptop className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Linh Kiện', icon: <Cpu className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Lưu Trữ', icon: <HardDrive className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Chuột', icon: <Mouse className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Bàn Phím', icon: <Keyboard className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Âm Thanh', icon: <Headphones className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
];
