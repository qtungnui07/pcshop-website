import { type Variants } from 'framer-motion';

import { Box, Monitor, Cpu, HardDrive, Mouse, Keyboard, Headphones, Laptop, MemoryStick, Gpu } from 'lucide-react';

export const navItems = [
  {
    name: 'Cửa hàng',
    dropdown: [
      { title: 'Mua sắm', links: ['Mua Sản Phẩm Mới Nhất', 'PC Build Sẵn', 'Linh Kiện Lẻ', 'Màn Hình', 'Gaming Gear'] },
      { title: 'Liên kết nhanh', links: ['Tìm cửa hàng gần nhất', 'Tình trạng đơn hàng', 'Chính sách bảo hành'] },
    ]
  },
  {
    name: 'PC',
    dropdown: [
      { title: 'Theo Nhu Cầu', links: ['PC Gaming', 'PC Đồ Họa 3D', 'PC Văn Phòng', 'PC Workstation', 'Mini PC'] },
      { title: 'Theo Mức Giá', links: ['Phổ thông (Dưới 15Tr)', 'Tầm trung (15 - 30Tr)', 'Cao cấp (Trên 30Tr)', 'Hi-End Custom'] },
    ]
  },
  {
    name: 'Linh kiện',
    isSplit: true,
    splitData: [
      { name: 'RAM', title: 'Dung Lượng & Loại', links: ['4GB', '8GB', '16GB', '32GB', '64GB', 'DDR4', 'DDR5'] },
      { name: 'CPU - Vi Xử Lý', title: 'Dòng CPU', links: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'] },
      { name: 'VGA - Card Màn Hình', title: 'Dòng Card', links: ['NVIDIA RTX 40 Series', 'NVIDIA RTX 30 Series', 'AMD Radeon RX 7000', 'AMD Radeon RX 6000'] },
      { name: 'Mainboard - Bo Mạch Chủ', title: 'Chipset', links: ['Intel Z790', 'Intel B760', 'AMD X670', 'AMD B650', 'Mainboard ITX'] },
      { name: 'Ổ Cứng SSD', title: 'Dung Lượng & Chuẩn Giao Tiếp', links: ['256GB', '512GB', '1TB', '2TB', 'SSD NVMe PCIe', 'SSD SATA III'] },
      { name: 'Ổ Cứng HDD', title: 'Dung Lượng', links: ['1TB', '2TB', '4TB', '8TB+'] },
      { name: 'Nguồn (PSU)', title: 'Công Suất', links: ['Dưới 500W', '500W - 650W', '700W - 850W', 'Trên 1000W', 'Chứng Nhận 80 Plus'] },
      { name: 'Tản Nhiệt', title: 'Loại Tản Nhiệt', links: ['Tản Nhiệt Khí', 'Tản Nhiệt Nước AIO', 'Tản Nhiệt Nước Custom', 'Quạt Tản Nhiệt'] },
      { name: 'Case - Vỏ Máy Tính', title: 'Kích Thước', links: ['Mini ITX', 'Micro ATX', 'Mid Tower', 'Full Tower'] },
    ]
  },
  { name: 'Laptop', dropdown: null },
  { name: 'Phụ kiện', dropdown: [
    {
      title: 'Danh mục phụ kiện', 
      links: ['Màn hình', 'Bàn Phím', 'Chuột', 'Tai nghe', 'Webcam', 'Mic', 'Loa']
    }
  ]
  },  
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
  { name: 'PC', icon: <Box className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Laptop', icon: <Laptop className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Màn Hình', icon: <Monitor className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'CPU', icon: <Cpu className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'GPU', icon: <Gpu className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'RAM', icon: <MemoryStick className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'HDD/SSD', icon: <HardDrive className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Chuột', icon: <Mouse className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Bàn Phím', icon: <Keyboard className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
  { name: 'Âm Thanh', icon: <Headphones className="w-10 h-10 mb-3 text-[#1d1d1f]" strokeWidth={1} /> },
];
