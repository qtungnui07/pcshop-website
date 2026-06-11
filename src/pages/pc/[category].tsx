import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Heart, 
  Grid, 
  List, 
  RotateCcw, 
  ChevronDown,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { pcProducts, type PCProduct } from '../../constants/pcData';

const API_BASE =
  typeof window !== "undefined"
    ? (window.location.hostname.includes("qtitpc.dev")
      ? "https://api-pc.qtitpc.dev"
      : `${window.location.protocol}//${window.location.hostname}:3001`)
    : "http://localhost:3001";

function parsePCProduct(raw: any): PCProduct {
  const priceVal = parseInt(raw.price?.toString().replace(/[^\d]/g, ""), 10) || 0;
  const specsStr = raw.specs || "";
  
  let ramVal: any = '16GB';
  if (specsStr.includes('128GB')) ramVal = '128GB';
  else if (specsStr.includes('64GB')) ramVal = '64GB';
  else if (specsStr.includes('32GB')) ramVal = '32GB';
  else if (specsStr.includes('8GB')) ramVal = '8GB';
  
  let gpuVal: any = 'Onboard';
  if (specsStr.includes('RTX 4090')) gpuVal = 'RTX 4090';
  else if (specsStr.includes('RTX 4080')) gpuVal = 'RTX 4080';
  else if (specsStr.includes('RTX 4070 Ti')) gpuVal = 'RTX 4070 Ti';
  else if (specsStr.includes('RTX 4070')) gpuVal = 'RTX 4070';
  else if (specsStr.includes('RTX 4060 Ti')) gpuVal = 'RTX 4060 Ti';
  else if (specsStr.includes('RTX 4060')) gpuVal = 'RTX 4060';
  else if (specsStr.includes('RTX 3050')) gpuVal = 'RTX 3050';
  else if (specsStr.includes('RX 7600')) gpuVal = 'RX 7600';

  let cpuSeriesVal: any = 'Core i5';
  if (specsStr.includes('i9') || specsStr.includes('14900')) cpuSeriesVal = 'Core i9';
  else if (specsStr.includes('i7') || specsStr.includes('14700') || specsStr.includes('13700')) cpuSeriesVal = 'Core i7';
  else if (specsStr.includes('i3')) cpuSeriesVal = 'Core i3';
  else if (specsStr.includes('Ryzen 9') || specsStr.includes('7900') || specsStr.includes('7970')) cpuSeriesVal = 'Ryzen 9';
  else if (specsStr.includes('Ryzen 7') || specsStr.includes('7800') || specsStr.includes('7700')) cpuSeriesVal = 'Ryzen 7';
  else if (specsStr.includes('Ryzen 5') || specsStr.includes('7600') || specsStr.includes('5600')) cpuSeriesVal = 'Ryzen 5';

  let cpuBrandVal: 'Intel' | 'AMD' = specsStr.toLowerCase().includes('ryzen') || specsStr.toLowerCase().includes('threadripper') ? 'AMD' : 'Intel';

  let categoryVal: any = 'PC Gaming';
  const nameLower = (raw.name || "").toLowerCase();
  const specsLower = specsStr.toLowerCase();
  if (nameLower.includes('workstation') || specsLower.includes('threadripper')) {
    categoryVal = 'PC Workstation';
  } else if (nameLower.includes('mini') || specsLower.includes('mini')) {
    categoryVal = 'PC Mini';
  } else if (nameLower.includes('văn phòng') || nameLower.includes('office')) {
    categoryVal = 'PC Văn Phòng';
  } else if (nameLower.includes('creator') || nameLower.includes('đồ họa') || nameLower.includes('studio')) {
    categoryVal = 'PC Đồ Họa';
  }

  let brandVal: any = 'ASUS';
  if (nameLower.includes('msi') || specsLower.includes('msi')) brandVal = 'MSI';
  else if (nameLower.includes('gigabyte')) brandVal = 'Gigabyte';
  else if (nameLower.includes('corsair')) brandVal = 'Corsair';
  else if (nameLower.includes('dell')) brandVal = 'Dell';
  else if (nameLower.includes('hp')) brandVal = 'HP';
  else if (nameLower.includes('acer')) brandVal = 'Acer';

  return {
    id: raw.id || raw.name?.replace(/\s+/g, '-').toLowerCase() || Math.random().toString(),
    name: raw.name || "",
    specs: specsStr,
    brand: brandVal,
    ram: ramVal,
    gpu: gpuVal,
    cpuBrand: cpuBrandVal,
    cpuSeries: cpuSeriesVal,
    price: priceVal,
    priceStr: priceVal.toLocaleString('vi-VN') + " đ",
    img: raw.image || raw.img || "",
    badge: raw.badge,
    badgeColor: raw.badgeColor,
    category: categoryVal,
    from: raw.from || "#7c3aed",
    to: raw.to || "#ec4899",
  };
}

const categoryMappings = {
  "pc-gaming": {
    title: "PC GAMING",
    subtitle: "mọi thứ sẽ giúp bạn gaming tốt hơn.",
    dbCategoryName: "PC Gaming" as const,
    from: "#a78bfa",
    to: "#ec4899",
    glow: "rgba(147,197,253,0.35)",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f0f6ff 40%, #e3effe 70%, #dceafd 100%)",
  },
  "pc-do-hoa": {
    title: "PC ĐỒ HỌA",
    subtitle: "thiết kế mượt mà, render nhanh chóng.",
    dbCategoryName: "PC Đồ Họa" as const,
    from: "#38bdf8",
    to: "#6366f1",
    glow: "rgba(99,102,241,0.3)",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 40%, #e0f2fe 70%, #bae6fd 100%)",
  },
  "pc-do-hoa-3d": {
    title: "PC ĐỒ HỌA",
    subtitle: "thiết kế mượt mà, render nhanh chóng.",
    dbCategoryName: "PC Đồ Họa" as const,
    from: "#38bdf8",
    to: "#6366f1",
    glow: "rgba(99,102,241,0.3)",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 40%, #e0f2fe 70%, #bae6fd 100%)",
  },
  "pc-o-hoa": {
    title: "PC ĐỒ HỌA",
    subtitle: "thiết kế mượt mà, render nhanh chóng.",
    dbCategoryName: "PC Đồ Họa" as const,
    from: "#38bdf8",
    to: "#6366f1",
    glow: "rgba(99,102,241,0.3)",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 40%, #e0f2fe 70%, #bae6fd 100%)",
  },
  "pc-o-hoa-3d": {
    title: "PC ĐỒ HỌA",
    subtitle: "thiết kế mượt mà, render nhanh chóng.",
    dbCategoryName: "PC Đồ Họa" as const,
    from: "#38bdf8",
    to: "#6366f1",
    glow: "rgba(99,102,241,0.3)",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 40%, #e0f2fe 70%, #bae6fd 100%)",
  },
  "pc-van-phong": {
    title: "PC VĂN PHÒNG",
    subtitle: "hiệu suất tối ưu cho công việc hàng ngày.",
    dbCategoryName: "PC Văn Phòng" as const,
    from: "#d4d4d8",
    to: "#a1a1aa",
    glow: "rgba(161,161,170,0.15)",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #f1f5f9 70%, #e2e8f0 100%)",
  },
  "pc-workstation": {
    title: "PC WORKSTATION",
    subtitle: "sức mạnh xử lý tuyệt đối cho các tác vụ chuyên nghiệp.",
    dbCategoryName: "PC Workstation" as const,
    from: "#1e293b",
    to: "#334155",
    glow: "rgba(51,65,85,0.4)",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #f1f5f9 70%, #cbd5e1 100%)",
  },
  "pc-mini": {
    title: "PC MINI",
    subtitle: "nhỏ gọn, tinh tế và đầy đủ năng lượng.",
    dbCategoryName: "PC Mini" as const,
    from: "#e2e8f0",
    to: "#cbd5e1",
    glow: "rgba(148,163,184,0.15)",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #fafafa 40%, #f5f5f5 70%, #e5e5e5 100%)",
  },
  "mini-pc": {
    title: "PC MINI",
    subtitle: "nhỏ gọn, tinh tế và đầy đủ năng lượng.",
    dbCategoryName: "PC Mini" as const,
    from: "#e2e8f0",
    to: "#cbd5e1",
    glow: "rgba(148,163,184,0.15)",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #fafafa 40%, #f5f5f5 70%, #e5e5e5 100%)",
  }
};

const defaultMeta = categoryMappings["pc-gaming"];

export default function PCCategoryPage() {
  const { category } = useParams();
  const slug = (category || '').toLowerCase();
  
  // Resolve category configuration, fallback to pc-gaming
  const meta = useMemo(() => {
    return categoryMappings[slug as keyof typeof categoryMappings] || defaultMeta;
  }, [slug]);

  // States for interactive filters
  const minLimit = 0;
  const maxLimit = 100000000;
  const [minPrice, setMinPrice] = useState(10000000);
  const [maxPrice, setMaxPrice] = useState(100000000);
  
  const [selectedRams, setSelectedRams] = useState<string[]>([]);
  const [selectedCpus, setSelectedCpus] = useState<string[]>([]);
  const [selectedGpus, setSelectedGpus] = useState<string[]>([]);
  
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const [products, setProducts] = useState<PCProduct[]>(pcProducts);

  useEffect(() => {
    fetch(`${API_BASE}/api/featured-pcs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const parsed = data.map(parsePCProduct);
          setProducts(parsed);
        }
      })
      .catch((err) => console.error("Error fetching PCs from backend:", err));
  }, []);

  // Static list values to show in filters
  const ramOptions = ["8GB", "16GB", "32GB", "64GB", "128GB"];
  const cpuOptions = [
    { label: "Intel Core i5", value: "Core i5" },
    { label: "Intel Core i7", value: "Core i7" },
    { label: "Intel Core i9", value: "Core i9" },
    { label: "AMD Ryzen 5", value: "Ryzen 5" },
    { label: "AMD Ryzen 7", value: "Ryzen 7" },
    { label: "AMD Ryzen 9", value: "Ryzen 9" }
  ];
  const gpuOptions = ["RTX 4060", "RTX 4060 Ti", "RTX 4070", "RTX 4070 Ti", "RTX 4080", "RTX 4090", "RX 7600"];

  // Toggle filter selections
  const handleRamToggle = (val: string) => {
    setSelectedRams(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const handleCpuToggle = (val: string) => {
    setSelectedCpus(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const handleGpuToggle = (val: string) => {
    setSelectedGpus(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const resetFilters = () => {
    setMinPrice(10000000);
    setMaxPrice(100000000);
    setSelectedRams([]);
    setSelectedCpus([]);
    setSelectedGpus([]);
  };

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    // 1. Filter by active category
    let list = products.filter(p => p.category === meta.dbCategoryName);

    // 2. Filter by Price Range
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // 3. Filter by RAM selection
    if (selectedRams.length > 0) {
      list = list.filter(p => selectedRams.includes(p.ram));
    }

    // 4. Filter by CPU selection
    if (selectedCpus.length > 0) {
      list = list.filter(p => selectedCpus.includes(p.cpuSeries));
    }

    // 5. Filter by GPU selection
    if (selectedGpus.length > 0) {
      list = list.filter(p => {
        return selectedGpus.some(gpu => p.gpu.includes(gpu));
      });
    }

    // 6. Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, meta.dbCategoryName, minPrice, maxPrice, selectedRams, selectedCpus, selectedGpus, sortBy]);

  // Count helper functions for labels
  const getFilterCounts = useMemo(() => {
    const baseList = products.filter(p => p.category === meta.dbCategoryName);
    
    const ramCounts: Record<string, number> = {};
    const cpuCounts: Record<string, number> = {};
    const gpuCounts: Record<string, number> = {};

    ramOptions.forEach(ram => {
      ramCounts[ram] = baseList.filter(p => p.ram === ram).length;
    });

    cpuOptions.forEach(cpu => {
      cpuCounts[cpu.value] = baseList.filter(p => p.cpuSeries === cpu.value).length;
    });

    gpuOptions.forEach(gpu => {
      gpuCounts[gpu] = baseList.filter(p => p.gpu.includes(gpu)).length;
    });

    return { ramCounts, cpuCounts, gpuCounts };
  }, [products, meta.dbCategoryName]);

  // Hero section animation variants
  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  
  const heroItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const } },
  };

  const heroRight = {
    hidden: { opacity: 0, scale: 0.96, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.0, ease: [0.25, 1, 0.5, 1] as const, delay: 0.15 } },
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16">
      
      {/* ══ 1. HERO SECTION — Matches general PC style but category specific ══ */}
      <div
        style={{
          background: meta.bgGradient,
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          marginTop: "-96px",
          paddingTop: "96px",
          paddingLeft: "calc(50vw - 50%)",
          paddingRight: "calc(50vw - 50%)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top-right blue glow */}
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: 800, height: 800,
          background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        {/* Bottom left soft white fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: 600, height: 400,
          background: "radial-gradient(ellipse at 0% 100%, rgba(255,255,255,0.9) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="max-w-[1500px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-19 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: "calc(100vh - 96px)" }}>
            
            {/* Left content */}
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col items-start justify-center pr-8 py-12 relative z-10"
            >
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-xs text-[#86868b] font-medium mb-6 relative z-10">
                <Link to="/" className="hover:text-black transition-colors">Trang chủ</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/pc" className="hover:text-black transition-colors">PC</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#1d1d1f] font-semibold">{meta.dbCategoryName}</span>
              </div>

              <motion.span 
                variants={heroItem} 
                className="inline-block px-3 py-1 bg-white/70 text-zinc-500 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-6 border border-zinc-200/60"
              >
                HIỆU NĂNG &amp; ĐỈNH CAO
              </motion.span>
              
              <motion.h1 
                variants={heroItem} 
                className="text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] font-bold tracking-tight text-zinc-900 leading-[1.08] mb-6 uppercase"
              >
                {meta.title}
              </motion.h1>
              
              <motion.p 
                variants={heroItem} 
                className="text-[17px] text-zinc-500 mb-10 leading-relaxed capitalize"
              >
                {meta.subtitle}
              </motion.p>
              
              <motion.div variants={heroItem} className="flex flex-row gap-3 mb-12">
                <a 
                  href="#products-section" 
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1d1d1f] hover:bg-zinc-800 text-white text-[15px] font-semibold rounded-full transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
                >
                  Mua sắm ngay <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div variants={heroItem} className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-7 border-t border-zinc-300/40 w-full">
                {[
                  { Icon: ShieldCheck, text: "Bảo hành lên đến\n36 tháng" },
                  { Icon: Truck,       text: "Giao hàng nhanh\ntoàn quốc" },
                  { Icon: CheckCircle2,text: "Hỗ trợ lắp ráp\nmiễn phí" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-zinc-700 shrink-0" strokeWidth={1.8} />
                    <span className="text-[13px] text-zinc-700 leading-tight whitespace-pre-line font-semibold">{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — PC image with lighting */}
            <motion.div
              variants={heroRight}
              initial="hidden"
              animate="show"
              className="hidden lg:flex items-end justify-center relative overflow-visible"
              style={{ alignSelf: "stretch" }}
            >
              {/* Blue glow behind PC */}
              <div style={{
                position: "absolute",
                width: 600, height: 600,
                background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`,
                bottom: "0%", left: "50%", transform: "translateX(-48%)",
                pointerEvents: "none",
                zIndex: 0,
              }} />
              {/* Floor reflection */}
              <div style={{
                position: "absolute",
                width: 500, height: 60,
                background: "radial-gradient(ellipse, rgba(120,170,250,0.2) 0%, transparent 70%)",
                bottom: "0%", left: "50%", transform: "translateX(-48%)",
                filter: "blur(10px)",
                pointerEvents: "none",
                zIndex: 0,
              }} />
              <img
                src="/src/assets/pc1.png"
                alt={meta.title}
                style={{
                  height: "100%",
                  width: "auto",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  position: "relative",
                  zIndex: 1,
                  transform: "translateX(2%) scale(1.4)",
                  transformOrigin: "bottom center",
                  filter: "drop-shadow(0 0 60px rgba(147,197,253,0.3))",
                }}
              />
            </motion.div>

          </div>
        </div>
      </div>

      {/* ══ 2. PRODUCT LISTING AND FILTERS SECTION ══ */}
      <div id="products-section" className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* LEFT COLUMN: Sidebar Filters */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-zinc-200/60 shadow-sm sticky top-20">
              
              {/* Header Filters */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80">
                <span className="text-[14px] font-bold text-zinc-900 uppercase tracking-wider">Bộ lọc</span>
                {(minPrice !== 10000000 || maxPrice !== 100000000 || selectedRams.length > 0 || selectedCpus.length > 0 || selectedGpus.length > 0) && (
                  <button 
                    onClick={resetFilters} 
                    className="text-[11px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Price Range Slider */}
              <div className="py-5 border-b border-zinc-200/70">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[13px] font-bold text-zinc-900">Khoảng giá</h4>
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                </div>
                
                {/* Numeric Price display boxes */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 text-center">
                    {minPrice.toLocaleString('vi-VN')} đ
                  </div>
                  <span className="text-zinc-400 font-bold">-</span>
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 text-center">
                    {maxPrice.toLocaleString('vi-VN')} đ
                  </div>
                </div>

                {/* Range Slider Track */}
                <div className="relative h-1.5 w-full bg-zinc-100 rounded-full mb-6">
                  {/* Colored active fill */}
                  <div 
                    className="absolute h-full bg-zinc-900 rounded-full"
                    style={{ 
                      left: `${((minPrice - minLimit) / (maxLimit - minLimit)) * 100}%`,
                      right: `${100 - ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100}%` 
                    }}
                  />
                  
                  {/* Range Input 1 (Min Price) */}
                  <input 
                    type="range" 
                    min={minLimit} 
                    max={maxLimit} 
                    step={1000000}
                    value={minPrice} 
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 5000000);
                      setMinPrice(val);
                    }}
                    className="absolute w-full h-1.5 pointer-events-none appearance-none bg-transparent top-0 left-0 outline-none
                      [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-950 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-md
                      [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-zinc-950 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:shadow-md"
                    style={{ zIndex: 10 }}
                  />
                  
                  {/* Range Input 2 (Max Price) */}
                  <input 
                    type="range" 
                    min={minLimit} 
                    max={maxLimit} 
                    step={1000000}
                    value={maxPrice} 
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 5000000);
                      setMaxPrice(val);
                    }}
                    className="absolute w-full h-1.5 pointer-events-none appearance-none bg-transparent top-0 left-0 outline-none
                      [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-950 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-md
                      [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-zinc-950 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:shadow-md"
                    style={{ zIndex: 11 }}
                  />
                </div>
              </div>

              {/* RAM Filter */}
              <div className="py-5 border-b border-zinc-200/70">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[13px] font-bold text-zinc-900">Dung lượng RAM</h4>
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-3">
                  {ramOptions.map(ram => {
                    const count = getFilterCounts.ramCounts[ram] || 0;
                    return (
                      <label key={ram} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedRams.includes(ram)}
                          onChange={() => handleRamToggle(ram)}
                          className="w-4.5 h-4.5 rounded border-zinc-350 text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer" 
                        />
                        <span className="text-[13px] text-zinc-600 font-semibold group-hover:text-zinc-900 transition-colors">
                          {ram} 
                          <span className="text-zinc-400 text-[11px] font-normal ml-1">({count})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* CPU Filter */}
              <div className="py-5 border-b border-zinc-200/70">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[13px] font-bold text-zinc-900">Dòng CPU</h4>
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-3">
                  {cpuOptions.map(cpu => {
                    const count = getFilterCounts.cpuCounts[cpu.value] || 0;
                    return (
                      <label key={cpu.value} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedCpus.includes(cpu.value)}
                          onChange={() => handleCpuToggle(cpu.value)}
                          className="w-4.5 h-4.5 rounded border-zinc-350 text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer" 
                        />
                        <span className="text-[13px] text-zinc-600 font-semibold group-hover:text-zinc-900 transition-colors">
                          {cpu.label} 
                          <span className="text-zinc-400 text-[11px] font-normal ml-1">({count})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* GPU Filter */}
              <div className="py-5 border-b border-zinc-200/70">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[13px] font-bold text-zinc-900">Card Đồ Họa</h4>
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-3">
                  {gpuOptions.map(gpu => {
                    const count = getFilterCounts.gpuCounts[gpu] || 0;
                    return (
                      <label key={gpu} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedGpus.includes(gpu)}
                          onChange={() => handleGpuToggle(gpu)}
                          className="w-4.5 h-4.5 rounded border-zinc-350 text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer" 
                        />
                        <span className="text-[13px] text-zinc-600 font-semibold group-hover:text-zinc-900 transition-colors">
                          {gpu} 
                          <span className="text-zinc-400 text-[11px] font-normal ml-1">({count})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Clear filters shortcut */}
              <div className="pt-5">
                <button 
                  onClick={resetFilters} 
                  className="w-full py-2.5 flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Xóa bộ lọc
                </button>
              </div>

            </div>
          </aside>

          {/* RIGHT COLUMN: Products listing */}
          <main className="flex-1">
            
            {/* Filter statistics & View layout switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-zinc-200/50 pb-4">
              <h2 className="text-[14px] font-semibold text-zinc-500">{filteredProducts.length} sản phẩm</h2>
              
              <div className="flex items-center gap-3">
                {/* Sort selector */}
                <div className="relative">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white border border-zinc-200 rounded-lg pl-3 pr-8 py-2 text-[13px] text-zinc-700 font-semibold cursor-pointer hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  >
                    <option value="newest">Sắp xếp: Mới nhất</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* View switcher (Grid vs List) */}
                <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1">
                  <button 
                    onClick={() => setIsGridView(true)} 
                    className={`p-1.5 rounded transition-colors cursor-pointer ${isGridView ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-450 hover:text-zinc-700'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsGridView(false)} 
                    className={`p-1.5 rounded transition-colors cursor-pointer ${!isGridView ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-450 hover:text-zinc-700'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* List products grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/50">
                <p className="text-zinc-400 text-base font-medium">Không tìm thấy sản phẩm phù hợp.</p>
                <button 
                  onClick={resetFilters} 
                  className="mt-4 px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-semibold rounded-full transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : isGridView ? (
              // GRID VIEW
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id} 
                    className="group bg-white rounded-2xl border border-zinc-200/40 p-4 shadow-sm hover:shadow-md hover:border-zinc-250 transition-all duration-300 flex flex-col relative"
                  >
                    {/* Favorite Heart Button */}
                    <button 
                      onClick={() => toggleLike(p.id)} 
                      className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-zinc-100 shadow-sm hover:bg-white transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${liked.has(p.id) ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
                    </button>
                    
                    {/* Badge display */}
                    {p.badge && (
                      <span 
                        className="absolute top-4 left-4 z-10 px-2.5 py-0.5 text-[9px] font-bold text-white rounded"
                        style={{ background: p.badgeColor || '#1d1d1f' }}
                      >
                        {p.badge}
                      </span>
                    )}

                    {/* Image */}
                     <div className={`aspect-[4/3] flex items-center justify-center mb-4 relative overflow-hidden rounded-xl ${
                      p.img.includes('/images/') ? 'bg-zinc-900' : 'bg-zinc-50/50 p-4'
                    }`}>
                      <img 
                        src={p.img} 
                        alt={p.name} 
                        className={p.img.includes('/images/')
                          ? "w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                          : "max-w-full max-h-full object-contain group-hover:scale-104 transition-transform duration-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                        }
                      />
                    </div>

                    {/* Content Details */}
                    <div className="flex flex-col flex-1">
                      <h3 className="text-[13.5px] font-bold text-zinc-900 leading-snug mb-2 line-clamp-2 min-h-[38px]">
                        {p.name}
                      </h3>
                      <p className="text-[11.5px] text-zinc-400 font-semibold leading-relaxed mb-4 flex-1 whitespace-pre-line">
                        {p.specs.replace(/ \/ /g, ' • ').replace(/ • /g, '\n')}
                      </p>
                      <div className="text-[14px] font-bold text-zinc-900 mt-auto">
                        {p.priceStr}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              // LIST VIEW
              <div className="space-y-4">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id} 
                    className="group bg-white rounded-2xl border border-zinc-200/40 p-4 shadow-sm hover:shadow-md hover:border-zinc-250 transition-all duration-300 flex flex-row items-center gap-6 relative"
                  >
                    {/* Badge */}
                    {p.badge && (
                      <span 
                        className="absolute top-4 left-4 z-10 px-2 py-0.5 text-[9px] font-bold text-white rounded"
                        style={{ background: p.badgeColor || '#1d1d1f' }}
                      >
                        {p.badge}
                      </span>
                    )}

                    {/* Image container */}
                     <div className={`w-[180px] h-[135px] shrink-0 flex items-center justify-center rounded-xl overflow-hidden ${
                      p.img.includes('/images/') ? 'bg-zinc-900' : 'bg-zinc-50/50 p-3'
                    }`}>
                      <img 
                        src={p.img} 
                        alt={p.name} 
                        className={p.img.includes('/images/')
                          ? "w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          : "max-w-full max-h-full object-contain group-hover:scale-103 transition-transform duration-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                        }
                      />
                    </div>

                    {/* Details content */}
                    <div className="flex-1 flex flex-col py-1">
                      <h3 className="text-[15px] font-bold text-zinc-900 leading-snug mb-1">
                        {p.name}
                      </h3>
                      <p className="text-[12px] text-zinc-400 font-semibold leading-relaxed mb-4 whitespace-pre-line max-w-[500px]">
                        {p.specs.replace(/ \/ /g, ' • ')}
                      </p>
                      <div className="text-[15px] font-bold text-zinc-900 mt-auto">
                        {p.priceStr}
                      </div>
                    </div>

                    {/* Right action tools */}
                    <div className="flex flex-col items-end gap-10 pr-2">
                      <button 
                        onClick={() => toggleLike(p.id)} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-50 border border-zinc-200 shadow-sm hover:bg-zinc-100 hover:border-zinc-300 transition-colors cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${liked.has(p.id) ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
                      </button>

                      <button className="px-5 py-2 bg-[#1d1d1f] hover:bg-zinc-800 text-white text-[12px] font-bold rounded-full transition-colors active:scale-95 cursor-pointer shadow-sm">
                        Mua ngay
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* ══ Pagination Layout indicator (Visual only matching the mockup) ══ */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 transition-colors"><ChevronDown className="w-4 h-4 rotate-90" /></button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-900 text-white font-semibold text-[13px]">1</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-semibold text-[13px] transition-colors">2</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-semibold text-[13px] transition-colors">3</button>
                <span className="px-2 text-zinc-400 font-bold">...</span>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-semibold text-[13px] transition-colors">6</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"><ChevronDown className="w-4 h-4 -rotate-90" /></button>
              </div>
            )}

          </main>

        </div>
      </div>

    </div>
  );
}
