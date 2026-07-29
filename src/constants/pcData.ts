export interface PCProduct {
  id: string;
  name: string;
  specs: string;
  brand: 'ASUS' | 'MSI' | 'Gigabyte' | 'Corsair' | 'Dell' | 'HP' | 'Acer';
  ram: '8GB' | '16GB' | '32GB' | '64GB' | '128GB';
  gpu: 'RTX 3050' | 'RTX 4060' | 'RTX 4060 Ti' | 'RTX 4070' | 'RTX 4070 Ti' | 'RTX 4080' | 'RTX 4090' | 'RX 7600' | 'Onboard';
  cpuBrand: 'Intel' | 'AMD';
  cpuSeries: 'Core i3' | 'Core i5' | 'Core i7' | 'Core i9' | 'Ryzen 5' | 'Ryzen 7' | 'Ryzen 9';
  price: number;
  priceStr: string;
  img: string;
  badge?: string;
  badgeColor?: string;
  category: 'PC Gaming' | 'PC Đồ Họa' | 'PC Văn Phòng' | 'PC Workstation' | 'PC Mini';
  from: string;
  to: string;
  glow?: string;
}
