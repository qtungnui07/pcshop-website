import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  SlidersHorizontal, 
  Search, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  Cpu, 
  Tag,
  Grid,
  ShoppingBag,
  ArrowUpDown
} from 'lucide-react';
import { pcProducts } from '../../constants/pcData';

export default function AllPCsPage() {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<'All' | 'Intel' | 'AMD'>('All');
  const [selectedCPUs, setSelectedCPUs] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000000); // Max 100 million VND
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'name'>('default');
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Constants
  const minPriceLimit = 5000000;
  const maxPriceLimit = 100000000;

  // CPU list based on brand
  const cpuOptions = useMemo(() => {
    const intelCPUs = ['Core i3', 'Core i5', 'Core i7', 'Core i9'];
    const amdCPUs = ['Ryzen 5', 'Ryzen 7', 'Ryzen 9'];
    
    if (selectedBrand === 'Intel') return intelCPUs;
    if (selectedBrand === 'AMD') return amdCPUs;
    return [...intelCPUs, ...amdCPUs];
  }, [selectedBrand]);

  // Toggle CPU selection
  const handleCpuToggle = (cpu: string) => {
    setSelectedCPUs(prev => 
      prev.includes(cpu) ? prev.filter(c => c !== cpu) : [...prev, cpu]
    );
  };

  // Toggle like status
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProducts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Quick price filters
  const applyQuickPrice = (maxVal: number) => {
    setMaxPrice(maxVal);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('All');
    setSelectedCPUs([]);
    setMaxPrice(maxPriceLimit);
    setSortBy('default');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return pcProducts
      .filter(p => {
        // Search term filter
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.specs.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Brand filter
        const matchesBrand = selectedBrand === 'All' || p.cpuBrand === selectedBrand;
        
        // CPU Series filter
        const matchesCpu = selectedCPUs.length === 0 || selectedCPUs.includes(p.cpuSeries);
        
        // Price filter
        const matchesPrice = p.price <= maxPrice;

        return matchesSearch && matchesBrand && matchesCpu && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // default order
      });
  }, [searchTerm, selectedBrand, selectedCPUs, maxPrice, sortBy]);

  // Helper for formatting prices
  const formatPriceVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(value)
      .replace('₫', 'đ');
  };

  // Card component wrapper to handle gradient aesthetics
  function GradBackground({ from, to, glow, className = "", children }: {
    from: string; to: string; glow?: string; className?: string; children?: React.ReactNode;
  }) {
    return (
      <div className={className} style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`, position: "relative", overflow: "hidden" }}>
        {glow && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 30%, ${glow} 0%, transparent 65%)`, pointerEvents: "none" }} />}
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-24 pb-20">
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        
        {/* ══ BREADCRUMBS ══ */}
        <div className="flex items-center gap-1.5 text-xs text-[#86868b] font-medium mb-6">
          <Link to="/" className="hover:text-black transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/pc" className="hover:text-black transition-colors">PC</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1d1d1f] font-semibold">Tất cả PC</span>
        </div>

        {/* ══ TITLE & TOTALS ══ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200/80 pb-8 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl xl:text-[44px] font-semibold tracking-tight text-[#1d1d1f] leading-none mb-3">
              Tất Cả PC Gaming &amp; Workstation
            </h1>
            <p className="text-[#86868b] text-[15px] font-medium">
              Tìm kiếm cấu hình máy tính hoàn hảo phù hợp với nhu cầu và ngân sách của bạn.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-500 bg-white px-4 py-2 rounded-full border border-zinc-200/60 shadow-sm">
              Tìm thấy <strong className="text-zinc-800 font-bold">{filteredProducts.length}</strong> sản phẩm
            </span>
            <button 
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 text-xs font-semibold rounded-full border border-zinc-200/60 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ══ DESKTOP FILTER SIDEBAR ══ */}
          <aside className="hidden lg:block space-y-6 self-start sticky top-24">
            
            {/* Filter Group: Search */}
            <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-zinc-400" />
                Tìm kiếm sản phẩm
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên PC, VGA, RAM..." 
                  className="w-full text-sm bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-zinc-400 focus:bg-white text-zinc-800 placeholder-zinc-400 rounded-xl px-4 py-2.5 outline-none transition-all duration-200"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs font-bold bg-zinc-200/50 hover:bg-zinc-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Filter Group: CPU Brand */}
            <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-zinc-400" />
                Dòng vi xử lý (CPU)
              </h3>
              
              {/* Brand Selector */}
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-zinc-100/80 rounded-xl border border-zinc-200/30">
                {(['All', 'Intel', 'AMD'] as const).map(brand => (
                  <button
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setSelectedCPUs([]); // Clear model filters when switching brands
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all duration-150 ${selectedBrand === brand ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              {/* CPU Model Options */}
              <div className="space-y-2.5 pt-2">
                {cpuOptions.map(cpu => {
                  const isChecked = selectedCPUs.includes(cpu);
                  return (
                    <label 
                      key={cpu} 
                      className="flex items-center gap-3 cursor-pointer group text-sm text-zinc-600 hover:text-zinc-900 select-none transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleCpuToggle(cpu)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-300 group-hover:border-zinc-400 bg-white'}`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="font-medium text-zinc-700">{cpu}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Group: Price Slider */}
            <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-zinc-400" />
                Khoảng giá (VND)
              </h3>
              
              <div className="space-y-1">
                <span className="text-xs text-zinc-400 font-medium">Giá tối đa</span>
                <div className="text-xl font-bold text-blue-600 tracking-tight">
                  {formatPriceVND(maxPrice)}
                </div>
              </div>

              <div className="pt-2">
                <input 
                  type="range" 
                  min={minPriceLimit}
                  max={maxPriceLimit}
                  step={1000000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold pt-2">
                  <span>5.000.000đ</span>
                  <span>100.000.000đ</span>
                </div>
              </div>

              {/* Quick Select Prices */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block">Chọn nhanh</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button 
                    onClick={() => applyQuickPrice(15000000)}
                    className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-800 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-left"
                  >
                    Dưới 15 Triệu
                  </button>
                  <button 
                    onClick={() => applyQuickPrice(30000000)}
                    className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-800 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-left"
                  >
                    Dưới 30 Triệu
                  </button>
                  <button 
                    onClick={() => applyQuickPrice(50000000)}
                    className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-800 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-left"
                  >
                    Dưới 50 Triệu
                  </button>
                  <button 
                    onClick={() => applyQuickPrice(maxPriceLimit)}
                    className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-800 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-left"
                  >
                    Tất cả giá
                  </button>
                </div>
              </div>
            </div>

          </aside>

          {/* ══ MAIN PRODUCTS COLUMN ══ */}
          <main className="lg:col-span-3 space-y-6">

            {/* ══ MOBILE FILTERS TOGGLE & SORTING BAR ══ */}
            <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-4 flex flex-row items-center justify-between gap-3">
              
              {/* Mobile filter toggle */}
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-[#1d1d1f] text-sm font-semibold rounded-xl transition-colors active:scale-95 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
              </button>

              {/* Grid visual marker */}
              <div className="hidden lg:flex items-center gap-2 text-zinc-400">
                <Grid className="w-4 h-4 text-zinc-800" />
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Danh mục sản phẩm</span>
              </div>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline-block">Sắp xếp:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-sm font-semibold text-zinc-700 rounded-xl px-4 py-2 pr-8 outline-none transition-all duration-200 cursor-pointer"
                  >
                    <option value="default">Mặc định</option>
                    <option value="priceAsc">Giá: Thấp đến Cao</option>
                    <option value="priceDesc">Giá: Cao đến Thấp</option>
                    <option value="name">Tên: A đến Z</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ══ PRODUCT GRID ══ */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((pc) => {
                  const isLiked = likedProducts.includes(pc.id);
                  return (
                    <motion.div
                      layout
                      key={pc.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                      whileHover={{ y: -6 }}
                      className="group bg-white rounded-2xl border border-zinc-200/50 shadow-sm hover:shadow-lg hover:border-zinc-300/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
                      {/* Image Gradient block */}
                      <Link to={`/pc/${pc.id}`} className="block relative aspect-[4/3.2] overflow-hidden">
                        <GradBackground from={pc.from} to={pc.to} glow={pc.glow} className="w-full h-full transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-white/25 group-hover:text-white/40 transition-colors duration-300 stroke-[1.2]" />
                        </GradBackground>

                        {/* Badges */}
                        {pc.badge && (
                          <span 
                            className="absolute top-3.5 left-3.5 px-3 py-1 text-[10px] font-bold text-white rounded-full shadow-sm"
                            style={{ background: pc.badgeColor || '#1d1d1f' }}
                          >
                            {pc.badge}
                          </span>
                        )}

                        {/* Floating category tag */}
                        <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 text-[9px] font-bold bg-white/70 backdrop-blur-md text-zinc-800 border border-zinc-200/40 rounded-md">
                          {pc.category}
                        </span>
                      </Link>

                      {/* Content block */}
                      <div className="p-4.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors duration-200 leading-snug line-clamp-2">
                            {pc.name}
                          </h3>
                          
                          <div className="pt-2 pb-3.5 flex flex-wrap gap-x-2 gap-y-1 items-center border-b border-zinc-100">
                            <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 border border-zinc-200/30 px-2 py-0.5 rounded">
                              {pc.cpuSeries}
                            </span>
                            <span className="text-[11px] text-zinc-400 leading-snug whitespace-pre-line">
                              {pc.specs.replace(`${pc.cpuSeries} • `, '')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Giá bán</span>
                            <span className="text-[15px] font-extrabold text-zinc-900 tracking-tight">
                              {pc.priceStr}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => toggleLike(pc.id, e)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200/50 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 active:scale-95 transition-all duration-150 cursor-pointer"
                            >
                              <Heart className={`w-4.5 h-4.5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
                            </button>
                            
                            <button 
                              className="px-4 py-2 bg-[#1d1d1f] hover:bg-blue-600 active:scale-95 text-white text-[12px] font-bold rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
                            >
                              Mua ngay
                            </button>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* ══ EMPTY STATE ══ */}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-16 px-4 text-center bg-white rounded-3xl border border-zinc-200/60 shadow-sm space-y-4">
                  <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-zinc-900">Không tìm thấy sản phẩm phù hợp</h3>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">
                      Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại các bộ lọc CPU/Giá của bạn.
                    </p>
                  </div>
                  <button 
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#1d1d1f] hover:bg-zinc-800 text-white text-xs font-semibold rounded-full transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {/* ══ MOBILE FILTERS DRAWER BACKDROP & PANEL ══ */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm lg:hidden"
            />

            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[340px] bg-white shadow-2xl p-6 overflow-y-auto lg:hidden flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <h2 className="text-lg font-extrabold text-[#1d1d1f] flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Bộ lọc tìm kiếm
                  </h2>
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold hover:bg-zinc-200 cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                {/* Filter 1: Search */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">Tìm kiếm</span>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tên PC, linh kiện..." 
                      className="w-full text-sm bg-zinc-50 border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-2.5 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Filter 2: CPU */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider block">Dòng CPU</span>
                  
                  {/* Mobile Brand selector */}
                  <div className="grid grid-cols-3 gap-1 p-0.5 bg-zinc-100 rounded-xl border border-zinc-200/30">
                    {(['All', 'Intel', 'AMD'] as const).map(brand => (
                      <button
                        key={brand}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setSelectedCPUs([]);
                        }}
                        className={`py-1 text-xs font-semibold rounded-lg cursor-pointer ${selectedBrand === brand ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-zinc-500'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>

                  {/* CPU series list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cpuOptions.map(cpu => {
                      const isChecked = selectedCPUs.includes(cpu);
                      return (
                        <button
                          key={cpu}
                          onClick={() => handleCpuToggle(cpu)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                        >
                          {cpu}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter 3: Price slider */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider block">Giá tối đa</span>
                  <div className="text-lg font-bold text-blue-600">
                    {formatPriceVND(maxPrice)}
                  </div>
                  <input 
                    type="range" 
                    min={minPriceLimit}
                    max={maxPriceLimit}
                    step={1000000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold">
                    <span>5.000.000đ</span>
                    <span>100.000.000đ</span>
                  </div>
                </div>

              </div>

              {/* Drawer footer buttons */}
              <div className="pt-6 border-t border-zinc-100 flex items-center gap-3">
                <button 
                  onClick={() => {
                    handleResetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="flex-1 py-3 border border-zinc-200 text-zinc-600 hover:text-zinc-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
                >
                  Xóa bộ lọc
                </button>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-[#1d1d1f] hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center shadow-sm"
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
