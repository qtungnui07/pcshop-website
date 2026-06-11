import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Heart, 
  Grid, 
  List, 
  RotateCcw, 
  ChevronDown 
} from "lucide-react";
import { pcProducts } from "../../constants/pcData";

function formatPrice(p: number) {
  return new Intl.NumberFormat("vi-VN").format(p) + " đ";
}

const filterData = [
  {
    title: "Nhu cầu",
    options: [
      { label: "PC Gaming", count: 8 }, 
      { label: "PC Đồ Họa", count: 2 }, 
      { label: "PC Văn Phòng", count: 2 },
      { label: "PC Workstation", count: 1 }, 
      { label: "PC Mini", count: 2 }
    ],
    defaultChecked: ["PC Gaming"]
  },
  {
    title: "RAM",
    options: [
      { label: "8GB", count: 2 }, { label: "16GB", count: 8 }, { label: "32GB", count: 4 },
      { label: "64GB", count: 1 }, { label: "128GB", count: 1 }
    ],
    defaultChecked: ["16GB"]
  },
  {
    title: "CPU",
    options: [
      { label: "Intel Core i3", count: 2 }, { label: "Intel Core i5", count: 3 }, { label: "Intel Core i7", count: 3 },
      { label: "Intel Core i9", count: 2 }, { label: "AMD Ryzen 5", count: 2 }, { label: "AMD Ryzen 7", count: 2 },
      { label: "AMD Ryzen 9", count: 2 }
    ],
    defaultChecked: ["Intel Core i7"]
  },
  {
    title: "Card đồ họa",
    options: [
      { label: "RTX 3050", count: 1 }, { label: "RTX 4060", count: 1 }, { label: "RTX 4070", count: 4 },
      { label: "RTX 4080", count: 1 }, { label: "RTX 4090", count: 1 }, { label: "RX 7600", count: 1 },
      { label: "Onboard", count: 5 }
    ],
    defaultChecked: ["RTX 4070"]
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

export default function AllPCsPage() {
  const MIN_PRICE = 5_000_000;
  const MAX_PRICE = 100_000_000;
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [activeInput, setActiveInput] = useState<'min' | 'max'>('min');
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const filteredProducts = useMemo(() => {
    return pcProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
  }, [minPrice, maxPrice]);

  const percentMin = ((minPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const percentMax = ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16 pt-20">
      
      {/* Main Container */}
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-[#86868b] font-medium mb-6">
          <Link to="/" className="hover:text-black transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/pc" className="hover:text-black transition-colors">PC</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1d1d1f] font-semibold">Tất cả PC</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl xl:text-[44px] font-semibold tracking-tight text-[#1d1d1f] mb-8">
          Tất cả PC
        </h1>

        {/* Layout: Sidebar and Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-[260px] shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm">
              <div className="py-2 border-b border-zinc-200/70">
                <h4 className="text-[13px] font-bold text-zinc-900 mb-4">Giá</h4>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-[12px] text-zinc-700 text-center">
                    {formatPrice(minPrice)}
                  </div>
                  <span className="text-zinc-400">-</span>
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-[12px] text-zinc-700 text-center">
                    {formatPrice(maxPrice)}
                  </div>
                </div>
                {/* Dual range slider */}
                <div 
                  className="h-1 bg-zinc-200 rounded-full mb-6 relative mt-4 cursor-pointer"
                  onMouseMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const value = MIN_PRICE + percent * (MAX_PRICE - MIN_PRICE);
                    if (Math.abs(value - minPrice) < Math.abs(value - maxPrice)) {
                      setActiveInput('min');
                    } else {
                      setActiveInput('max');
                    }
                  }}
                  onTouchStart={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const percent = (touch.clientX - rect.left) / rect.width;
                    const value = MIN_PRICE + percent * (MAX_PRICE - MIN_PRICE);
                    if (Math.abs(value - minPrice) < Math.abs(value - maxPrice)) {
                      setActiveInput('min');
                    } else {
                      setActiveInput('max');
                    }
                  }}
                >
                  <div
                    className="absolute h-full bg-zinc-900 rounded-full"
                    style={{
                      left: `${percentMin}%`,
                      right: `${100 - percentMax}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={1000000}
                    value={minPrice}
                    onChange={e => {
                      const val = Math.min(Number(e.target.value), maxPrice - 1000000);
                      setMinPrice(val);
                    }}
                    className="dual-range-slider"
                    style={{ zIndex: activeInput === 'min' ? 10 : 3 }}
                  />
                  <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={1000000}
                    value={maxPrice}
                    onChange={e => {
                      const val = Math.max(Number(e.target.value), minPrice + 1000000);
                      setMaxPrice(val);
                    }}
                    className="dual-range-slider"
                    style={{ zIndex: activeInput === 'max' ? 10 : 3 }}
                  />
                </div>
              </div>

              {filterData.map(f => (
                <FilterSection key={f.title} title={f.title} options={f.options} defaultChecked={f.defaultChecked} />
              ))}

              <div className="pt-6">
                <button
                  onClick={() => {
                    setMinPrice(MIN_PRICE);
                    setMaxPrice(MAX_PRICE);
                  }}
                  className="w-full py-2.5 flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-[13px] font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Xóa bộ lọc
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid Column */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-[15px] font-medium text-zinc-500">{filteredProducts.length} sản phẩm</h2>
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

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((p, i) => (
                <div key={i} className="group bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-col relative">
                  <button onClick={() => toggleLike(p.id)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-zinc-100 shadow-sm hover:bg-white transition-colors cursor-pointer">
                    <Heart className={`w-4 h-4 transition-colors ${liked.has(p.id) ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
                  </button>
                  
                  {p.badge && (
                    <span 
                      className="absolute top-4 left-4 z-10 px-2 py-0.5 text-[9px] font-bold text-white rounded"
                      style={{ background: p.badgeColor || '#1d1d1f' }}
                    >
                      {p.badge}
                    </span>
                  )}

                  <div className={`aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden rounded-xl ${
                    p.img.includes('/images/') ? 'bg-zinc-900' : 'p-4 bg-zinc-50/50'
                  }`}>
                    <img
                      src={p.img}
                      alt={p.name}
                      className={p.img.includes('/images/')
                        ? "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        : "max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      }
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="text-[14px] font-bold text-zinc-900 leading-tight mb-2 line-clamp-2 min-h-[40px]">{p.name}</h3>
                    <p className="text-[12px] text-zinc-500 leading-relaxed mb-4 flex-1 whitespace-pre-line">{p.specs}</p>
                    <div className="text-[15px] font-bold text-zinc-900">{p.priceStr}</div>
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
