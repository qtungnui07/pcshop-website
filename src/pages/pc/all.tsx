import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ChevronRight, 
  RotateCcw, 
  Grid, 
  List, 
  ChevronDown,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { pcProducts } from '../../constants/pcData';

export default function AllPCsPage() {
  // Filter states
  const [minPrice, setMinPrice] = useState<number>(5000000);
  const [maxPrice, setMaxPrice] = useState<number>(100000000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRAMs, setSelectedRAMs] = useState<string[]>([]);
  const [selectedCPUs, setSelectedCPUs] = useState<string[]>([]);
  const [selectedGPUs, setSelectedGPUs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'name'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  
  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Collapse states for sidebar filter sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    brand: false,
    ram: false,
    cpu: false,
    gpu: false,
  });

  // Price range constants
  const minPriceLimit = 5000000;
  const maxPriceLimit = 100000000;

  // Toggle Collapse Sections
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggle individual filter value
  const handleFilterToggle = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (list) {
      setList(prev => 
        prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
      );
    }
  };

  // Toggle like
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setMinPrice(minPriceLimit);
    setMaxPrice(maxPriceLimit);
    setSelectedBrands([]);
    setSelectedRAMs([]);
    setSelectedCPUs([]);
    setSelectedGPUs([]);
    setSortBy('default');
  };

  // Format price VND (e.g. 28.990.000 đ)
  const formatPriceVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(value)
      .replace('₫', 'đ');
  };

  // Calculate dynamic counts based on the total database items
  const brandOptions = useMemo(() => {
    const brands: Record<string, number> = {};
    pcProducts.forEach(p => {
      brands[p.brand] = (brands[p.brand] || 0) + 1;
    });
    return Object.entries(brands).map(([label, count]) => ({ label, count }));
  }, []);

  const ramOptions = useMemo(() => {
    const rams: Record<string, number> = {};
    pcProducts.forEach(p => {
      rams[p.ram] = (rams[p.ram] || 0) + 1;
    });
    return Object.entries(rams).map(([label, count]) => ({ label, count }));
  }, []);

  const cpuOptions = useMemo(() => {
    const cpus: Record<string, number> = {};
    pcProducts.forEach(p => {
      const key = `${p.cpuBrand} ${p.cpuSeries}`;
      cpus[key] = (cpus[key] || 0) + 1;
    });
    return Object.entries(cpus).map(([label, count]) => ({ label, count }));
  }, []);

  const gpuOptions = useMemo(() => {
    const gpus: Record<string, number> = {};
    pcProducts.forEach(p => {
      gpus[p.gpu] = (gpus[p.gpu] || 0) + 1;
    });
    return Object.entries(gpus).map(([label, count]) => ({ label, count }));
  }, []);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return pcProducts
      .filter(p => {
        // Price Filter
        if (p.price < minPrice || p.price > maxPrice) return false;
        
        // Brand Filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
        
        // RAM Filter
        if (selectedRAMs.length > 0 && !selectedRAMs.includes(p.ram)) return false;
        
        // CPU Filter
        const cpuLabel = `${p.cpuBrand} ${p.cpuSeries}`;
        if (selectedCPUs.length > 0 && !selectedCPUs.includes(cpuLabel)) return false;
        
        // GPU Filter
        if (selectedGPUs.length > 0 && !selectedGPUs.includes(p.gpu)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // Default ordering
      });
  }, [minPrice, maxPrice, selectedBrands, selectedRAMs, selectedCPUs, selectedGPUs, sortBy]);

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16 pt-20">
      
      {/* Dynamic styles for dual slider thumbs */}
      <style>{`
        .dual-slider-input {
          pointer-events: none;
        }
        .dual-slider-input::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid #18181b;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          cursor: grab;
          transition: transform 0.1s;
        }
        .dual-slider-input::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.1);
        }
        .dual-slider-input::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid #18181b;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          cursor: grab;
          transition: transform 0.1s;
        }
        .dual-slider-input::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.1);
        }
      `}</style>

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

        {/* Layout: Sidebar and Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* ══ DESKTOP SIDEBAR FILTER ══ */}
          <aside className="w-full lg:w-[260px] shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm">
              
              {/* 1. Price Filter (Dual Slider) */}
              <div className="py-2 border-b border-zinc-200/70">
                <h4 className="text-[13px] font-bold text-zinc-900 mb-4">Giá</h4>
                
                {/* Min-Max numeric display */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-2.5 py-2 text-[11px] font-semibold text-zinc-700 text-center">
                    {formatPriceVND(minPrice)}
                  </div>
                  <span className="text-zinc-400">-</span>
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-2.5 py-2 text-[11px] font-semibold text-zinc-700 text-center">
                    {formatPriceVND(maxPrice)}
                  </div>
                </div>

                {/* Dual range track */}
                <div className="h-1 bg-zinc-200 rounded-full mb-6 relative">
                  <div 
                    className="absolute h-full bg-zinc-900 rounded-full"
                    style={{
                      left: `${((minPrice - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100}%`,
                      right: `${100 - ((maxPrice - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100}%`
                    }}
                  />
                  
                  {/* Min handle slider */}
                  <input 
                    type="range"
                    min={minPriceLimit}
                    max={maxPriceLimit}
                    step={1000000}
                    value={minPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 5000000);
                      setMinPrice(val);
                    }}
                    className="dual-slider-input absolute w-full h-1 appearance-none bg-transparent outline-none cursor-pointer"
                    style={{ WebkitAppearance: 'none', top: '-2px' }}
                  />

                  {/* Max handle slider */}
                  <input 
                    type="range"
                    min={minPriceLimit}
                    max={maxPriceLimit}
                    step={1000000}
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 5000000);
                      setMaxPrice(val);
                    }}
                    className="dual-slider-input absolute w-full h-1 appearance-none bg-transparent outline-none cursor-pointer"
                    style={{ WebkitAppearance: 'none', top: '-2px' }}
                  />
                </div>
              </div>

              {/* 2. Brand Section */}
              <div className="py-5 border-b border-zinc-200/70">
                <div 
                  onClick={() => toggleSection('brand')}
                  className="flex items-center justify-between mb-4 cursor-pointer group"
                >
                  <h4 className="text-[13px] font-bold text-zinc-900">Thương hiệu</h4>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-250 ${collapsedSections.brand ? 'rotate-180' : ''}`} />
                </div>
                {!collapsedSections.brand && (
                  <div className="space-y-3">
                    {brandOptions.map(opt => (
                      <label key={opt.label} className="flex items-center gap-3 cursor-pointer group select-none">
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(opt.label)}
                          onChange={() => handleFilterToggle(selectedBrands, setSelectedBrands, opt.label)}
                          className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer" 
                        />
                        <span className="text-[13px] text-zinc-600 group-hover:text-zinc-900 transition-colors">
                          {opt.label} <span className="text-zinc-400 text-[11px] ml-0.5">({opt.count})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. RAM Section */}
              <div className="py-5 border-b border-zinc-200/70">
                <div 
                  onClick={() => toggleSection('ram')}
                  className="flex items-center justify-between mb-4 cursor-pointer group"
                >
                  <h4 className="text-[13px] font-bold text-zinc-900">RAM</h4>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-250 ${collapsedSections.ram ? 'rotate-180' : ''}`} />
                </div>
                {!collapsedSections.ram && (
                  <div className="space-y-3">
                    {ramOptions.map(opt => (
                      <label key={opt.label} className="flex items-center gap-3 cursor-pointer group select-none">
                        <input 
                          type="checkbox" 
                          checked={selectedRAMs.includes(opt.label)}
                          onChange={() => handleFilterToggle(selectedRAMs, setSelectedRAMs, opt.label)}
                          className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer" 
                        />
                        <span className="text-[13px] text-zinc-600 group-hover:text-zinc-900 transition-colors">
                          {opt.label} <span className="text-zinc-400 text-[11px] ml-0.5">({opt.count})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. CPU Section */}
              <div className="py-5 border-b border-zinc-200/70">
                <div 
                  onClick={() => toggleSection('cpu')}
                  className="flex items-center justify-between mb-4 cursor-pointer group"
                >
                  <h4 className="text-[13px] font-bold text-zinc-900">CPU</h4>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-250 ${collapsedSections.cpu ? 'rotate-180' : ''}`} />
                </div>
                {!collapsedSections.cpu && (
                  <div className="space-y-3">
                    {cpuOptions.map(opt => (
                      <label key={opt.label} className="flex items-center gap-3 cursor-pointer group select-none">
                        <input 
                          type="checkbox" 
                          checked={selectedCPUs.includes(opt.label)}
                          onChange={() => handleFilterToggle(selectedCPUs, setSelectedCPUs, opt.label)}
                          className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer" 
                        />
                        <span className="text-[13px] text-zinc-600 group-hover:text-zinc-900 transition-colors">
                          {opt.label} <span className="text-zinc-400 text-[11px] ml-0.5">({opt.count})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. GPU Section */}
              <div className="py-5 border-b border-zinc-200/70">
                <div 
                  onClick={() => toggleSection('gpu')}
                  className="flex items-center justify-between mb-4 cursor-pointer group"
                >
                  <h4 className="text-[13px] font-bold text-zinc-900">Card đồ họa</h4>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-250 ${collapsedSections.gpu ? 'rotate-180' : ''}`} />
                </div>
                {!collapsedSections.gpu && (
                  <div className="space-y-3">
                    {gpuOptions.map(opt => (
                      <label key={opt.label} className="flex items-center gap-3 cursor-pointer group select-none">
                        <input 
                          type="checkbox" 
                          checked={selectedGPUs.includes(opt.label)}
                          onChange={() => handleFilterToggle(selectedGPUs, setSelectedGPUs, opt.label)}
                          className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer" 
                        />
                        <span className="text-[13px] text-zinc-600 group-hover:text-zinc-900 transition-colors">
                          {opt.label} <span className="text-zinc-400 text-[11px] ml-0.5">({opt.count})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Filters button */}
              <div className="pt-6">
                <button 
                  onClick={handleResetFilters}
                  className="w-full py-2.5 flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-[13px] font-medium rounded-lg transition-colors cursor-pointer active:scale-98"
                >
                  <RotateCcw className="w-4 h-4" /> Xóa bộ lọc
                </button>
              </div>

            </div>
          </aside>

          {/* ══ MAIN PRODUCT LISTINGS ══ */}
          <main className="flex-1">
            
            {/* Header controls bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              
              <div className="flex items-center gap-3">
                {/* Mobile Filter Trigger Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-4 py-2.5 text-[13px] text-zinc-700 font-semibold cursor-pointer shadow-sm active:scale-95"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Bộ lọc
                </button>
                <h2 className="text-[15px] font-medium text-zinc-500">{filteredProducts.length} sản phẩm</h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Sorting Select Option */}
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white border border-zinc-200 rounded-lg px-4 py-2 pr-8 text-[13px] font-semibold text-zinc-700 cursor-pointer hover:bg-zinc-50 outline-none transition-colors"
                  >
                    <option value="default">Sắp xếp: Mới nhất</option>
                    <option value="priceAsc">Giá: Thấp đến Cao</option>
                    <option value="priceDesc">Giá: Cao đến Thấp</option>
                    <option value="name">Tên: A đến Z</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* View Mode Grid/List buttons */}
                <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Grid View */}
            <AnimatePresence mode="popLayout">
              {viewMode === 'grid' ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {filteredProducts.map((pc) => {
                    const isLiked = liked.has(pc.id);
                    return (
                      <motion.div
                        layout
                        key={pc.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.25 }}
                        className="group bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-col relative"
                      >
                        {/* Floating Like Heart Icon */}
                        <button 
                          onClick={(e) => toggleLike(pc.id, e)} 
                          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-zinc-100 shadow-sm hover:bg-white transition-colors cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
                        </button>
                        
                        {/* Badge if present */}
                        {pc.badge && (
                          <span 
                            className="absolute top-4 left-4 z-10 px-2 py-0.5 text-[9px] font-bold text-white rounded"
                            style={{ background: pc.badgeColor || '#1d1d1f' }}
                          >
                            {pc.badge}
                          </span>
                        )}

                        {/* Image Container with same laptop scale logic */}
                        <div className="aspect-[4/3] flex items-center justify-center mb-4 p-4 bg-zinc-50/50 rounded-xl overflow-hidden relative">
                          <img 
                            src={pc.img} 
                            alt={pc.name} 
                            className="max-w-full max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-500 z-10" 
                            onError={(e) => {
                              // If image fails, fallback to simple case or default URL
                              (e.target as HTMLImageElement).src = "https://gtech.com.vn/wp-content/uploads/2023/12/case-pc.png";
                            }}
                          />
                        </div>

                        {/* Info details */}
                        <div className="flex flex-col flex-1">
                          <h3 className="text-[14px] font-bold text-zinc-900 leading-tight mb-2 line-clamp-2 min-h-[40px]">
                            {pc.name}
                          </h3>
                          
                          <p className="text-[12px] text-zinc-500 leading-relaxed mb-4 flex-1 whitespace-pre-line">
                            {pc.specs}
                          </p>
                          
                          <div className="text-[15px] font-bold text-zinc-900 mt-auto">
                            {pc.priceStr}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                
                // Catalog List View
                <motion.div 
                  layout
                  className="space-y-4"
                >
                  {filteredProducts.map((pc) => {
                    const isLiked = liked.has(pc.id);
                    return (
                      <motion.div
                        layout
                        key={pc.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                        className="group bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-row items-center gap-6 relative"
                      >
                        {/* Image Box */}
                        <div className="w-32 h-24 sm:w-40 sm:h-30 shrink-0 flex items-center justify-center bg-zinc-50/50 rounded-xl overflow-hidden p-2">
                          <img 
                            src={pc.img} 
                            alt={pc.name} 
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>

                        {/* Content details side-by-side */}
                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-[15px] font-bold text-zinc-900 leading-tight">
                              {pc.name}
                            </h3>
                            <p className="text-[12px] text-zinc-500 leading-relaxed whitespace-pre-line">
                              {pc.specs.replace(/\n/g, ' / ')}
                            </p>
                            <span className="inline-block text-[9px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded border border-zinc-200/50">
                              {pc.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-[16px] font-extrabold text-zinc-900">
                              {pc.priceStr}
                            </div>
                            
                            <button 
                              onClick={(e) => toggleLike(pc.id, e)} 
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-50 border border-zinc-100 shadow-sm hover:bg-white transition-colors cursor-pointer"
                            >
                              <Heart className={`w-4.5 h-4.5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State when no products match */}
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center bg-white rounded-2xl border border-zinc-100 space-y-4">
                <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mx-auto text-zinc-400">
                  ×
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-900 font-bold text-base">Không có cấu hình phù hợp</p>
                  <p className="text-zinc-400 text-xs max-w-sm mx-auto">Vui lòng điều chỉnh lại thanh giá hoặc bỏ bớt các tiêu chí lọc ở thanh bên.</p>
                </div>
                <button 
                  onClick={handleResetFilters}
                  className="px-5 py-2 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer active:scale-95"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* ══ MOBILE DRAWER FILTERS PANEL (SLIDES FROM RIGHT) ══ */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden"
            />

            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[320px] bg-white shadow-2xl p-5 overflow-y-auto lg:hidden flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <h3 className="text-sm font-bold text-zinc-900">Bộ lọc PC</h3>
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 font-bold hover:bg-zinc-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Price Filter */}
                <div className="space-y-3">
                  <h4 className="text-[13px] font-bold text-zinc-900">Khoảng giá</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded p-2 text-[11px] font-semibold text-zinc-700 text-center">
                      {formatPriceVND(minPrice)}
                    </div>
                    <span className="text-zinc-400">-</span>
                    <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded p-2 text-[11px] font-semibold text-zinc-700 text-center">
                      {formatPriceVND(maxPrice)}
                    </div>
                  </div>

                  <div className="h-1 bg-zinc-200 rounded-full relative pt-1">
                    <div 
                      className="absolute h-1 bg-zinc-900 rounded-full"
                      style={{
                        left: `${((minPrice - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100}%`,
                        right: `${100 - ((maxPrice - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100}%`
                      }}
                    />
                    <input 
                      type="range"
                      min={minPriceLimit}
                      max={maxPriceLimit}
                      step={1000000}
                      value={minPrice}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), maxPrice - 5000000);
                        setMinPrice(val);
                      }}
                      className="dual-slider-input absolute w-full h-1 appearance-none bg-transparent outline-none cursor-pointer"
                      style={{ WebkitAppearance: 'none', top: '0px' }}
                    />
                    <input 
                      type="range"
                      min={minPriceLimit}
                      max={maxPriceLimit}
                      step={1000000}
                      value={maxPrice}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), minPrice + 5000000);
                        setMaxPrice(val);
                      }}
                      className="dual-slider-input absolute w-full h-1 appearance-none bg-transparent outline-none cursor-pointer"
                      style={{ WebkitAppearance: 'none', top: '0px' }}
                    />
                  </div>
                </div>

                {/* Mobile Brands checklist */}
                <div className="space-y-2.5 border-t border-zinc-100 pt-4">
                  <h4 className="text-[13px] font-bold text-zinc-900">Thương hiệu</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {brandOptions.map(opt => {
                      const active = selectedBrands.includes(opt.label);
                      return (
                        <button
                          key={opt.label}
                          onClick={() => handleFilterToggle(selectedBrands, setSelectedBrands, opt.label)}
                          className={`py-2 px-3 border text-left text-xs font-semibold rounded-lg transition-colors cursor-pointer ${active ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                        >
                          {opt.label} ({opt.count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile RAM checklist */}
                <div className="space-y-2.5 border-t border-zinc-100 pt-4">
                  <h4 className="text-[13px] font-bold text-zinc-900">Dung lượng RAM</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {ramOptions.map(opt => {
                      const active = selectedRAMs.includes(opt.label);
                      return (
                        <button
                          key={opt.label}
                          onClick={() => handleFilterToggle(selectedRAMs, setSelectedRAMs, opt.label)}
                          className={`py-1.5 px-3 border text-xs font-semibold rounded-lg transition-colors cursor-pointer ${active ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-600'}`}
                        >
                          {opt.label} ({opt.count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile CPU checklist */}
                <div className="space-y-2.5 border-t border-zinc-100 pt-4">
                  <h4 className="text-[13px] font-bold text-zinc-900">CPU</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {cpuOptions.map(opt => {
                      const active = selectedCPUs.includes(opt.label);
                      return (
                        <button
                          key={opt.label}
                          onClick={() => handleFilterToggle(selectedCPUs, setSelectedCPUs, opt.label)}
                          className={`py-2 px-3 border text-left text-xs font-semibold rounded-lg transition-colors cursor-pointer ${active ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-600'}`}
                        >
                          {opt.label} ({opt.count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile GPU checklist */}
                <div className="space-y-2.5 border-t border-zinc-100 pt-4">
                  <h4 className="text-[13px] font-bold text-zinc-900">Card đồ họa</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {gpuOptions.map(opt => {
                      const active = selectedGPUs.includes(opt.label);
                      return (
                        <button
                          key={opt.label}
                          onClick={() => handleFilterToggle(selectedGPUs, setSelectedGPUs, opt.label)}
                          className={`py-2 px-3 border text-left text-xs font-semibold rounded-lg transition-colors cursor-pointer ${active ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-600'}`}
                        >
                          {opt.label} ({opt.count})
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Reset / Apply footer */}
              <div className="border-t border-zinc-100 pt-4 flex gap-3">
                <button
                  onClick={() => {
                    handleResetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="flex-1 py-2.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center shadow-md active:scale-97"
                >
                  Áp dụng ({filteredProducts.length})
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
