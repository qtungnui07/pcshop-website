import { type Variants } from 'framer-motion';

import { Box, Monitor, Cpu, HardDrive, Mouse, Keyboard, Headphones, Laptop, MemoryStick, Gpu } from 'lucide-react';

export const navItems = [
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
      {
        name: 'RAM',
        title: 'Dung Lượng & Chuẩn RAM',
        groups: [
          {
            title: 'Dung Lượng RAM',
            links: ['4GB', '8GB', '16GB', '32GB', '64GB'],
          },
          {
            title: 'Chuẩn RAM (Loại)',
            links: ['DDR4', 'DDR5'],
          },
        ],
      },
      { name: 'CPU - Vi Xử Lý', title: 'Dòng CPU', links: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'] },
      { name: 'VGA - Card Màn Hình', title: 'Dòng Card', links: ['NVIDIA RTX 40 Series', 'NVIDIA RTX 30 Series', 'AMD Radeon RX 7000', 'AMD Radeon RX 6000'] },
      { name: 'Mainboard - Bo Mạch Chủ', title: 'Chipset', links: ['Intel Z790', 'Intel B760', 'AMD X670', 'AMD B650', 'Mainboard ITX'] },
      {
        name: 'Ổ Cứng SSD',
        title: 'Dung Lượng & Chuẩn Giao Tiếp',
        groups: [
          {
            title: 'Dung Lượng Ổ Cứng',
            links: ['256GB', '512GB', '1TB', '2TB'],
          },
          {
            title: 'Chuẩn Giao Tiếp',
            links: ['SSD NVMe PCIe', 'SSD SATA III'],
          },
        ],
      },
      { name: 'Ổ Cứng HDD', title: 'Dung Lượng', links: ['1TB', '2TB', '4TB', '8TB+'] },
      { name: 'Nguồn (PSU)', title: 'Công Suất', links: ['Dưới 500W', '500W - 650W', '700W - 850W', 'Trên 1000W', 'Chứng Nhận 80 Plus'] },
      { name: 'Tản Nhiệt', title: 'Loại Tản Nhiệt', links: ['Tản Nhiệt Khí', 'Tản Nhiệt Nước AIO', 'Tản Nhiệt Nước Custom', 'Quạt Tản Nhiệt'] },
      { name: 'Case - Vỏ Máy Tính', title: 'Kích Thước', links: ['Mini ITX', 'Micro ATX', 'Mid Tower', 'Full Tower'] },
    ]
  },
  {
    name: 'Laptop',
    isSplit: true,
    splitData: [
      {
        name: 'Thương Hiệu',
        title: 'Tất cả thương hiệu',
        links: [
          'ASUS ROG', 'ASUS TUF', 'ASUS Vivobook', 'ASUS ZenBook',
          'MSI Katana', 'MSI Cyborg', 'MSI Stealth', 'MSI Pulse',
          'Acer Nitro', 'Acer Predator', 'Acer Swift', 'Acer Aspire',
          'Lenovo Legion', 'Lenovo LOQ', 'Lenovo ThinkPad', 'Lenovo Yoga', 'Lenovo IdeaPad',
          'Dell Alienware', 'Dell XPS', 'Dell Inspiron',
          'HP Omen', 'HP Victus', 'HP Pavilion', 'HP Spectre',
          'Gigabyte Gamer',
          'Apple MacBook Pro', 'Apple MacBook Air',
        ]
      },
      {
        name: 'Card Đồ Họa (VGA)',
        title: 'Theo dòng GPU',
        groups: [
          {
            title: 'NVIDIA RTX 50 Series',
            links: ['NVIDIA RTX 5090', 'NVIDIA RTX 5080', 'NVIDIA RTX 5070', 'NVIDIA RTX 5060'],
          },
          {
            title: 'NVIDIA RTX 40 Series',
            links: ['NVIDIA RTX 4090', 'NVIDIA RTX 4080', 'NVIDIA RTX 4070', 'NVIDIA RTX 4060', 'NVIDIA RTX 4050'],
          },
          {
            title: 'NVIDIA RTX 30 Series',
            links: ['NVIDIA RTX 3050'],
          },
          {
            title: 'AMD Radeon',
            links: ['AMD Radeon RX 7000'],
          },
          {
            title: 'Intel Graphics',
            links: ['Intel Arc Graphics', 'Intel Iris Xe (Tích hợp)'],
          },
          {
            title: 'Đồ họa tích hợp',
            links: ['AMD Radeon (Tích hợp)'],
          },
        ],
      },
      {
        name: 'Vi Xử Lý (CPU)',
        title: 'Theo CPU',
        links: [
          'Intel Core i9', 'Intel Core i7', 'Intel Core i5', 'Intel Core i3',
          'Intel Core Ultra 9', 'Intel Core Ultra 7', 'Intel Core Ultra 5',
          'AMD Ryzen 9', 'AMD Ryzen 7', 'AMD Ryzen 5',
          'AMD Ryzen AI 9', 'AMD Ryzen AI 7',
          'Apple M4 Max', 'Apple M4 Pro', 'Apple M4',
          'Apple M3 Max', 'Apple M3 Pro', 'Apple M3',
        ]
      },
      {
        name: 'Dung Lượng RAM',
        title: 'Dung lượng RAM',
        links: [
          '8GB RAM', '16GB RAM', '32GB RAM', '64GB RAM',
        ]
      },
      {
        name: 'Ổ Cứng (SSD)',
        title: 'Dung lượng Ổ Cứng',
        links: [
          'SSD 256GB', 'SSD 512GB', 'SSD 1TB', 'SSD 2TB',
        ]
      },
      {
        name: 'Màn Hình',
        title: 'Kích thước & Tần số quét',
        links: [
          '13.3 - 13.6 inch', '14 inch', '15.6 inch', '16 inch', '17.3 - 18 inch',
          '60Hz', '120Hz', '144Hz', '165Hz', '240Hz',
          'Màn hình OLED', 'Màn hình Mini-LED', 'Màn hình cảm ứng',
        ]
      },
      {
        name: 'Nhu Cầu',
        title: 'Phân loại theo nhu cầu',
        links: [
          'Laptop Gaming', 'Laptop Văn Phòng', 'Laptop Đồ Họa - Dựng Phim',
          'Laptop Học Tập - Sinh Viên', 'Laptop Mỏng Nhẹ', 'Laptop Pin Lâu',
          'MacBook (Apple)',
        ]
      },
      {
        name: 'Mức Giá',
        title: 'Phân Khúc Giá',
        links: [
          'Dưới 15 Triệu', '15 - 20 Triệu', '20 - 25 Triệu',
          '25 - 30 Triệu', '30 - 40 Triệu', 'Trên 40 Triệu (Hi-End)',
        ]
      },
    ]
  },
  {
    name: 'Phụ kiện',
    dropdown: [
      {
        title: 'Thiết bị chính',
        links: ['Màn hình', 'Bàn phím', 'Chuột']
      },
      {
        title: 'Âm thanh & ghi hình',
        links: ['Tai nghe', 'Loa', 'Webcam']
      },
      {
        title: 'Phụ trợ setup',
        links: ['Lót chuột', 'Cáp & Hub', 'Giá đỡ']
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
