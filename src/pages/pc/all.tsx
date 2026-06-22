import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  Heart, 
  Grid, 
  List, 
  RotateCcw, 
  ChevronDown 
} from "lucide-react";
import { type PCProduct } from "../../constants/pcData";
import AddToCartButton from "../../components/AddToCartButton";

const API_BASE =
  typeof window !== "undefined"
    ? (window.location.hostname.includes("qtitpc.dev")
      ? "https://api-pc.qtitpc.dev"
      : `${window.location.protocol}//${window.location.hostname}:3001`)
    : "http://localhost:3001";

function formatPrice(p: number) {
  return new Intl.NumberFormat("vi-VN").format(p) + " đ";
}

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
  const navigate = useNavigate();
  const MIN_PRICE = 5_000_000;
  const MAX_PRICE = 100_000_000;
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [activeInput, setActiveInput] = useState<'min' | 'max'>('min');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<PCProduct[]>([]);

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

  const toggleLike = (id: string) => {
    setLiked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.price >= minPrice && p.price <= maxPrice);
  }, [products, minPrice, maxPrice]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  }, [filteredProducts.length]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const percentMin = ((minPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const percentMax = ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  // Calculate dynamic options count for the sidebar filters
  const filterData = useMemo(() => {
    const counts = {
      category: { 'PC Gaming': 0, 'PC Đồ Họa': 0, 'PC Văn Phòng': 0, 'PC Workstation': 0, 'PC Mini': 0 },
      ram: { '8GB': 0, '16GB': 0, '32GB': 0, '64GB': 0, '128GB': 0 },
      cpu: { 'Intel Core i3': 0, 'Intel Core i5': 0, 'Intel Core i7': 0, 'Intel Core i9': 0, 'AMD Ryzen 5': 0, 'AMD Ryzen 7': 0, 'AMD Ryzen 9': 0 },
      gpu: { 'RTX 3050': 0, 'RTX 4060': 0, 'RTX 4070': 0, 'RTX 4080': 0, 'RTX 4090': 0, 'RX 7600': 0, 'Onboard': 0 }
    };

    products.forEach(p => {
      // Category
      const catKey = p.category as keyof typeof counts.category;
      if (counts.category[catKey] !== undefined) counts.category[catKey]++;
      // RAM
      const ramKey = p.ram as keyof typeof counts.ram;
      if (counts.ram[ramKey] !== undefined) counts.ram[ramKey]++;
      
      // CPU
      const cpuKey = `${p.cpuBrand} ${p.cpuSeries}` as keyof typeof counts.cpu;
      if (counts.cpu[cpuKey] !== undefined) counts.cpu[cpuKey]++;
      
      // GPU
      let gpuKey: keyof typeof counts.gpu = 'Onboard';
      if (p.gpu.includes('4090')) gpuKey = 'RTX 4090';
      else if (p.gpu.includes('4080')) gpuKey = 'RTX 4080';
      else if (p.gpu.includes('4070')) gpuKey = 'RTX 4070';
      else if (p.gpu.includes('4060')) gpuKey = 'RTX 4060';
      else if (p.gpu.includes('3050')) gpuKey = 'RTX 3050';
      else if (p.gpu.includes('7600')) gpuKey = 'RX 7600';
      if (counts.gpu[gpuKey] !== undefined) counts.gpu[gpuKey]++;
    });

    return [
      {
        title: "Nhu cầu",
        options: [
          { label: "PC Gaming", count: counts.category['PC Gaming'] }, 
          { label: "PC Đồ Họa", count: counts.category['PC Đồ Họa'] }, 
          { label: "PC Văn Phòng", count: counts.category['PC Văn Phòng'] },
          { label: "PC Workstation", count: counts.category['PC Workstation'] }, 
          { label: "PC Mini", count: counts.category['PC Mini'] }
        ],
        defaultChecked: ["PC Gaming"]
      },
      {
        title: "RAM",
        options: [
          { label: "8GB", count: counts.ram['8GB'] }, 
          { label: "16GB", count: counts.ram['16GB'] }, 
          { label: "32GB", count: counts.ram['32GB'] },
          { label: "64GB", count: counts.ram['64GB'] }, 
          { label: "128GB", count: counts.ram['128GB'] }
        ],
        defaultChecked: ["16GB"]
      },
      {
        title: "CPU",
        options: [
          { label: "Intel Core i3", count: counts.cpu['Intel Core i3'] }, 
          { label: "Intel Core i5", count: counts.cpu['Intel Core i5'] }, 
          { label: "Intel Core i7", count: counts.cpu['Intel Core i7'] },
          { label: "Intel Core i9", count: counts.cpu['Intel Core i9'] }, 
          { label: "AMD Ryzen 5", count: counts.cpu['AMD Ryzen 5'] }, 
          { label: "AMD Ryzen 7", count: counts.cpu['AMD Ryzen 7'] },
          { label: "AMD Ryzen 9", count: counts.cpu['AMD Ryzen 9'] }
        ],
        defaultChecked: ["Intel Core i7"]
      },
      {
        title: "Card đồ họa",
        options: [
          { label: "RTX 3050", count: counts.gpu['RTX 3050'] }, 
          { label: "RTX 4060", count: counts.gpu['RTX 4060'] }, 
          { label: "RTX 4070", count: counts.gpu['RTX 4070'] },
          { label: "RTX 4080", count: counts.gpu['RTX 4080'] }, 
          { label: "RTX 4090", count: counts.gpu['RTX 4090'] }, 
          { label: "RX 7600", count: counts.gpu['RX 7600'] },
          { label: "Onboard", count: counts.gpu['Onboard'] }
        ],
        defaultChecked: ["RTX 4070"]
      }
    ];
  }, [products]);

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
          <main id="products-grid-top" className="flex-1">
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
              {paginatedProducts.map((p, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/san-pham/pc-${p.name}`)}
                  className="group bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-col relative cursor-pointer"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(p.id);
                    }}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-zinc-100 shadow-sm hover:bg-white transition-colors cursor-pointer"
                  >
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
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[15px] font-bold text-zinc-900">{p.priceStr}</div>
                      <AddToCartButton
                        product={{
                          id: `pc-${p.name}`,
                          name: p.name,
                          specs: p.specs,
                          price: p.price,
                          image: p.img,
                          category: "PC",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    document.getElementById("products-grid-top")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 transition-colors ${
                    currentPage === 1 ? "text-zinc-300 cursor-not-allowed" : "text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                  }`}
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                
                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        document.getElementById("products-grid-top")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg font-medium text-[13px] transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-zinc-950 text-white"
                          : "border border-zinc-200 text-zinc-650 hover:bg-zinc-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    document.getElementById("products-grid-top")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 transition-colors ${
                    currentPage === totalPages ? "text-zinc-300 cursor-not-allowed" : "text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                  }`}
                >
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}
