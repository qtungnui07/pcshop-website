import {
  GraduationCap, Briefcase, Gamepad2, Palette, Feather, BatteryFull,
  ChevronRight, Heart, Grid, List, RotateCcw,
  ShieldCheck, Truck, CheckCircle2, ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const categories = [
  { icon: GraduationCap, title: "Học tập", desc: "Nhẹ, pin lâu,\nhiệu năng ổn định" },
  { icon: Briefcase, title: "Văn phòng", desc: "Linh hoạt, bền bỉ,\nxử lý mượt mà" },
  { icon: Gamepad2, title: "Gaming", desc: "Hiệu năng mạnh mẽ,\ntrải nghiệm đỉnh cao" },
  { icon: Palette, title: "Đồ họa - Sáng tạo", desc: "Màn hình đẹp, hiệu năng\nxử lý vượt trội" },
  { icon: Feather, title: "Mỏng nhẹ", desc: "Thiết kế mỏng nhẹ,\ndi chuyển dễ dàng" },
  { icon: BatteryFull, title: "Pin lâu", desc: "Làm việc cả ngày\nkhông lo hết pin" },
];

const defaultProducts = [
  { brand: "ASUS", name: "ASUS ROG Zephyrus G14 2024", specs: "Ryzen 9 8945HS / 16GB /\n1TB SSD / RTX 4060 / 14\" OLED", price: "28.990.000 đ", img: "https://dlcdnwebimgs.asus.com/gain/97f4b8da-e77d-418c-8515-3850123533be/w800" },
  { brand: "Apple", name: "MacBook Air M3 13 inch", specs: "Apple M3 / 16GB / 512GB SSD /\n13.6\" Liquid Retina", price: "24.990.000 đ", img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034" },
  { brand: "Dell", name: "Dell XPS 13 Plus 9320", specs: "Intel Core i7-1360P / 16GB /\n512GB SSD / 13.4\" FHD+", price: "27.490.000 đ", img: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/xs9320nt-cnb-00000ff090-gy.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=555&qlt=100,1&resMode=sharp2&size=555,402&chrss=full" },
  { brand: "Lenovo", name: "Lenovo Yoga Slim 7i Pro", specs: "Intel Core i7-13700H / 16GB /\n1TB SSD / 14.5\" 3K", price: "24.490.000 đ", img: "https://p1-ofp.static.pub/fes/cms/2022/07/12/3og7y6a14mve0h7m99a4zcwf47u10v359190.png" },
  { brand: "HP", name: "HP Spectre x360 14", specs: "Intel Core i7-1355U / 16GB /\n1TB SSD / 14\" 2.8K OLED", price: "26.990.000 đ", img: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08404555.png" },
  { brand: "Acer", name: "Acer Swift Go 14 OLED", specs: "Intel Core Ultra 5 125H / 16GB /\n512GB SSD / 14\" 2.8K OLED", price: "20.990.000 đ", img: "https://images.acer.com/is/image/acer/swift-go-14-sfg14-72-sfg14-73-glare-silver-ui-01?$Product-Cards-XL$" },
  { brand: "ASUS", name: "ASUS TUF Gaming A15", specs: "AMD Ryzen 7 7735HS / 16GB /\n512GB SSD / RTX 4060 / 15.6\" FHD 144Hz", price: "24.490.000 đ", img: "https://dlcdnwebimgs.asus.com/gain/d3ad557c-864a-4d7a-8f4b-2d7c58ed00ee/w800" },
  { brand: "MSI", name: "MSI Stealth 16 Studio", specs: "Intel Core i7-13700H / 32GB /\n1TB SSD / RTX 4070 / 16\" 16:10", price: "37.990.000 đ", img: "https://asset.msi.com/resize/image/global/product/product_1672728476839352c3c97db317e0b510ed9c882193.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png" },
];



const perks = [
  { icon: ShieldCheck, title: "Bảo hành chính hãng", desc: "An tâm sử dụng dài lâu" },
  { icon: RotateCcw, title: "Trả góp 0%", desc: "Linh hoạt, dễ dàng" },
  { icon: Truck, title: "Miễn phí vận chuyển", desc: "Giao hàng toàn quốc" },
  { icon: CheckCircle2, title: "Tư vấn tận tâm", desc: "Hỗ trợ 24/7" },
];

const filterData = [
  {
    title: "Thương hiệu",
    options: [
      { label: "ASUS", count: 12 }, { label: "Dell", count: 9 }, { label: "Lenovo", count: 8 },
      { label: "HP", count: 7 }, { label: "Acer", count: 5 }, { label: "Apple", count: 6 }
    ]
  },
  {
    title: "RAM",
    options: [
      { label: "8GB", count: 10 }, { label: "16GB", count: 28 }, { label: "32GB", count: 10 }
    ],
    defaultChecked: ["16GB"]
  },
  {
    title: "CPU",
    options: [
      { label: "Intel Core i5", count: 15 }, { label: "Intel Core i7", count: 20 }, { label: "Intel Core i9", count: 8 },
      { label: "AMD Ryzen 5", count: 10 }, { label: "AMD Ryzen 7", count: 12 }, { label: "Apple M Series", count: 6 }
    ],
    defaultChecked: ["Intel Core i7"]
  },
  {
    title: "Màn hình",
    options: [
      { label: "13 - 14 inch", count: 14 }, { label: "15 - 15.6 inch", count: 24 }, { label: "16 inch trở lên", count: 10 }
    ],
    defaultChecked: ["15 - 15.6 inch"]
  },
  {
    title: "Card đồ họa",
    options: [
      { label: "Intel Iris Xe", count: 18 }, { label: "NVIDIA RTX 4050", count: 10 }, { label: "NVIDIA RTX 4060", count: 12 },
      { label: "NVIDIA RTX 4070", count: 6 }, { label: "NVIDIA RTX 4080", count: 2 }
    ],
    defaultChecked: ["NVIDIA RTX 4060"]
  }
];

function FilterSection({ title, options, defaultChecked = [] }: { title: string, options: { label: string, count: number }[], defaultChecked?: string[] }) {
  return (
    <div className="py-5 border-b border-zinc-200/70">
      <div className="flex items-center justify-between mb-4 cursor-pointer group">
        <h4 className="text-[13px] font-bold text-zinc-900">{title}</h4>
        <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
      </div>
      <div className="space-y-3">
        {options.map(opt => (
          <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" defaultChecked={defaultChecked.includes(opt.label)} className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer" />
            <span className="text-[13px] text-zinc-600 group-hover:text-zinc-900 transition-colors">{opt.label} <span className="text-zinc-400 text-[11px] ml-0.5">({opt.count})</span></span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function LaptopIndex() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [products, setProducts] = useState(defaultProducts);

  useEffect(() => {
    fetch("http://localhost:3001/api/laptops")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching laptops:", err));
  }, []);

  const toggleLike = (i: number) => {
    setLiked(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };

  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] as const } },
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16">
      {/* ══ 1. HERO ═════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-zinc-100 via-zinc-50 to-white pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-200/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={heroContainer} initial="hidden" animate="show" className="max-w-xl">
              <motion.h1 variants={heroItem} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.1] mb-4">
                LAPTOP
              </motion.h1>
              <motion.h2 variants={heroItem} className="text-2xl md:text-3xl font-semibold text-zinc-800 mb-6">
                Sức mạnh trong mọi chuyển động.
              </motion.h2>
              <motion.p variants={heroItem} className="text-[17px] text-zinc-500 mb-10 leading-relaxed max-w-md">
                Từ học tập, làm việc đến sáng tạo,<br />
                luôn có một chiếc laptop phù hợp với bạn.
              </motion.p>
              <motion.div variants={heroItem} className="flex flex-wrap items-center gap-4">
                <button className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white text-[15px] font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-zinc-900/20 active:scale-95 cursor-pointer">
                  Khám phá ngay
                </button>
                <button className="px-8 py-3.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-[15px] font-semibold rounded-lg transition-all duration-200 shadow-sm active:scale-95 cursor-pointer">
                  Tư vấn chọn laptop
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-zinc-200/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
              {/* Replace with realistic high-res laptop mockup from web */}
              <img
                src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop"
                alt="Laptop display"
                className="w-[120%] max-w-none relative z-10 scale-110 translate-x-10 object-cover rounded-xl shadow-2xl mix-blend-multiply"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop";
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 mt-8 md:mt-10">

        {/* ══ PERKS (MOVED TO TOP) ═════════════════════════════════════════ */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-5 md:p-6 mb-12 md:mb-16 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {perks.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-zinc-900 leading-tight mb-1">{title}</p>
                  <p className="text-[12px] text-zinc-500 leading-tight">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 2. CHỌN THEO NHU CẦU ════════════════════════════════════ */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 mb-8">Chọn laptop theo nhu cầu</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="group cursor-pointer bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <cat.icon className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-bold text-zinc-900 mb-2">{cat.title}</h3>
                <p className="text-[12px] text-zinc-500 whitespace-pre-line leading-relaxed flex-1">{cat.desc}</p>
                <div className="mt-4 flex justify-end">
                  <div className="w-6 h-6 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 3. MAIN LAYOUT: FILTERS & GRID ════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Sidebar */}
          <aside className="w-full lg:w-[260px] shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm">
              <div className="py-2 border-b border-zinc-200/70">
                <h4 className="text-[13px] font-bold text-zinc-900 mb-4">Giá</h4>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-[12px] text-zinc-700 text-center">
                    10.000.000đ
                  </div>
                  <span className="text-zinc-400">-</span>
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-[12px] text-zinc-700 text-center">
                    50.000.000đ
                  </div>
                </div>
                {/* Fake slider */}
                <div className="h-1 bg-zinc-200 rounded-full mb-6 relative">
                  <div className="absolute left-[20%] right-[30%] h-full bg-zinc-900 rounded-full"></div>
                  <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-zinc-900 rounded-full shadow cursor-grab"></div>
                  <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-zinc-900 rounded-full shadow cursor-grab"></div>
                </div>
              </div>

              {filterData.map(f => (
                <FilterSection key={f.title} title={f.title} options={f.options} defaultChecked={f.defaultChecked} />
              ))}

              <div className="pt-6">
                <button className="w-full py-2.5 flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-[13px] font-medium rounded-lg transition-colors">
                  <RotateCcw className="w-4 h-4" /> Xóa bộ lọc
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-[15px] font-medium text-zinc-500">48 sản phẩm</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-700 cursor-pointer hover:bg-zinc-50">
                  <span className="font-medium">Sắp xếp:</span> Mới nhất <ChevronDown className="w-4 h-4 ml-1" />
                </div>
                <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1">
                  <button className="p-1.5 bg-zinc-100 rounded text-zinc-900"><Grid className="w-4 h-4" /></button>
                  <button className="p-1.5 text-zinc-400 hover:text-zinc-600"><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p, i) => (
                <div key={i} className="group bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-col relative">
                  <button onClick={() => toggleLike(i)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-zinc-100 shadow-sm hover:bg-white transition-colors cursor-pointer">
                    <Heart className={`w-4 h-4 transition-colors ${liked.has(i) ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
                  </button>
                  <div className="aspect-[4/3] flex items-center justify-center mb-4 p-4">
                    <img src={p.img} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="text-[14px] font-bold text-zinc-900 leading-tight mb-2 line-clamp-2">{p.name}</h3>
                    <p className="text-[12px] text-zinc-500 leading-relaxed mb-4 flex-1 whitespace-pre-line">{p.specs}</p>
                    <div className="text-[15px] font-bold text-zinc-900">{p.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 transition-colors"><ChevronDown className="w-4 h-4 rotate-90" /></button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-900 text-white font-medium text-[13px]">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-medium text-[13px] transition-colors">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-medium text-[13px] transition-colors">3</button>
              <span className="px-2 text-zinc-400">...</span>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-medium text-[13px] transition-colors">6</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"><ChevronDown className="w-4 h-4 -rotate-90" /></button>
            </div>
          </main>
        </div>


      </div>
    </div>
  );
}

