import { Shield, Wrench, Truck, CheckCircle } from 'lucide-react';

export const heroSlides = [
  {
    label: 'PERFORMANCE WITHOUT LIMITS',
    title: ['Build Beyond', 'Performance'],
    desc: 'PC Gaming & Workstation được tối ưu cho mọi nhu cầu.\nHiệu năng mạnh mẽ trong một thiết kế đẳng cấp.',
    cta1: 'Xem PC Gaming',
    link1: '/pc/pc-gaming',
    cta2: 'Tự Build PC',
    link2: '/tu-build-pc',
    from: '#d1d1d6',
    to: '#a8a8b3',
  },
  {
    label: 'WORKSTATION SERIES',
    title: ['Sức Mạnh', 'Chuyên Nghiệp'],
    desc: 'Đồ họa 3D, AI, video editing — được thiết kế\ncho những công việc đòi hỏi hiệu năng đỉnh cao.',
    cta1: 'Xem Workstation',
    link1: '/pc/pc-workstation',
    cta2: 'Tư vấn ngay',
    link2: '/ho-tro',
    from: '#AEE2FF',
    to: '#B5BAFF',
  },
  {
    label: 'LINH KIỆN CAO CẤP',
    title: ['Nâng Cấp', 'Không Giới Hạn'],
    desc: 'Hàng nghìn linh kiện chính hãng, giá tốt nhất thị trường.\nGiao hàng toàn quốc trong 24h.',
    cta1: 'Xem Linh Kiện',
    link1: '/linh-kien',
    cta2: 'Tư vấn build',
    link2: '/ho-tro',
    from: '#D9F9DF',
    to: '#AEE2FF',
  },
];

export const pcCategories = [
  { name: 'PC Gaming',            imgName: "cat-gaming.png"},
  { name: 'PC Workstation',       imgName: "cat-workstation.png" },
  { name: 'PC Văn phòng',         imgName: "cat-vanphong.png" },
  { name: 'PC Đồ họa',            imgName: "cat-dohoa.png" },
];

export const featuredProducts = [
  {
    badge: 'Bán chạy',
    name: 'PC Gaming Infinity',
    specs: 'i7-14700K / RTX 4070 SUPER / 32GB RAM',
    price: '28.990.000 đ',
    from: '#D9F9DF', to: '#AEE2FF',
  },
  {
    badge: 'Bán chạy',
    name: 'PC Gaming Galaxy',
    specs: 'Ryzen 7 7800X3D / RTX 4070 Ti SUPER / 32GB RAM',
    price: '32.990.000 đ',
    from: '#AEE2FF', to: '#B5BAFF',
  },
  {
    badge: '',
    name: 'PC Gaming Nebula',
    specs: 'i9-14900K / RTX 4080 SUPER / 32GB RAM',
    price: '45.990.000 đ',
    from: '#B5BAFF', to: '#9FA1FF',
  },
  {
    badge: '',
    name: 'PC Workstation Pro',
    specs: 'Threadripper 7970X / RTX 4090 / 64GB RAM',
    price: '89.990.000 đ',
    from: '#9FA1FF', to: '#ECB65F',
  },
];

export const trustBadges = [
  { Icon: Shield,       title: 'Bảo hành 36 tháng',      desc: 'An tâm sử dụng dài lâu' },
  { Icon: Wrench,       title: 'Hỗ trợ build miễn phí',  desc: 'Tư vấn & lắp ráp chuyên nghiệp' },
  { Icon: Truck,        title: 'Giao hàng toàn quốc',     desc: 'Nhanh chóng & an toàn' },
  { Icon: CheckCircle,  title: 'Test kỹ trước khi giao',  desc: 'Đảm bảo chất lượng tuyệt đối' },
];
