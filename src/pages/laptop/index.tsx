import {
  GraduationCap, Briefcase, Gamepad2, Palette, Feather, BatteryFull,
  ChevronRight, Heart, Grid, List, RotateCcw,
  ShieldCheck, Truck, CheckCircle2, ChevronDown,
  SlidersHorizontal, X, Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ── TYPES ─────────────────────────────────────────────────────────── */
type LaptopBrand = "ASUS" | "Apple" | "Dell" | "Lenovo" | "HP" | "Acer" | "MSI";
type LaptopCPU = "Intel Core i5" | "Intel Core i7" | "Intel Core i9" | "AMD Ryzen 7" | "AMD Ryzen 9" | "Apple M Series";
type LaptopRAM = "8GB" | "16GB" | "32GB";
type LaptopScreen = "13 - 14 inch" | "15 - 15.6 inch" | "16 inch trở lên";
type LaptopGPU = "Intel Iris Xe" | "AMD Radeon" | "NVIDIA RTX 4060" | "NVIDIA RTX 4070";

interface LaptopProduct {
  id: number;
  brand: LaptopBrand;
  name: string;
  cpu: LaptopCPU;
  ram: LaptopRAM;
  screen: LaptopScreen;
  gpu: LaptopGPU;
  specs: string;
  price: number;
  badge?: string;
  img: string;
}

/* ── DATA ──────────────────────────────────────────────────────────── */
const categories = [
  { icon: GraduationCap, title: "Học tập",         desc: "Nhẹ, pin lâu,\nhiệu năng ổn định" },
  { icon: Briefcase,     title: "Văn phòng",        desc: "Linh hoạt, bền bỉ,\nxử lý mượt mà" },
  { icon: Gamepad2,      title: "Gaming",           desc: "Hiệu năng mạnh mẽ,\ntrải nghiệm đỉnh cao" },
  { icon: Palette,       title: "Đồ họa - Sáng tạo",desc: "Màn hình đẹp, hiệu năng\nxử lý vượt trội" },
  { icon: Feather,       title: "Mỏng nhẹ",         desc: "Thiết kế mỏng nhẹ,\ndi chuyển dễ dàng" },
  { icon: BatteryFull,   title: "Pin lâu",           desc: "Làm việc cả ngày\nkhông lo hết pin" },
];

const products: LaptopProduct[] = [
  { id: 1,  brand: "ASUS",   name: "ASUS ROG Zephyrus G14 2024",  cpu: "AMD Ryzen 9",    ram: "16GB", screen: "13 - 14 inch",   gpu: "NVIDIA RTX 4060", specs: "Ryzen 9 8945HS / 16GB /\n1TB SSD / RTX 4060 / 14\" OLED",        price: 28990000, badge: "Bán chạy", img: "https://dlcdnwebimgs.asus.com/gain/97f4b8da-e77d-418c-8515-3850123533be/w800" },
  { id: 2,  brand: "Apple",  name: "MacBook Air M3 13 inch",       cpu: "Apple M Series", ram: "16GB", screen: "13 - 14 inch",   gpu: "Apple M Series" as any, specs: "Apple M3 / 16GB / 512GB SSD /\n13.6\" Liquid Retina",               price: 24990000, img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034" },
  { id: 3,  brand: "Dell",   name: "Dell XPS 13 Plus 9320",        cpu: "Intel Core i7",  ram: "16GB", screen: "13 - 14 inch",   gpu: "Intel Iris Xe",   specs: "Intel Core i7-1360P / 16GB /\n512GB SSD / 13.4\" FHD+",             price: 27490000, img: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/xs9320nt-cnb-00000ff090-gy.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=555&qlt=100,1&resMode=sharp2&size=555,402&chrss=full" },
  { id: 4,  brand: "Lenovo", name: "Lenovo Yoga Slim 7i Pro",      cpu: "Intel Core i7",  ram: "16GB", screen: "13 - 14 inch",   gpu: "Intel Iris Xe",   specs: "Intel Core i7-13700H / 16GB /\n1TB SSD / 14.5\" 3K",               price: 24490000, img: "https://p1-ofp.static.pub/fes/cms/2022/07/12/3og7y6a14mve0h7m99a4zcwf47u10v359190.png" },
  { id: 5,  brand: "HP",     name: "HP Spectre x360 14",           cpu: "Intel Core i7",  ram: "16GB", screen: "13 - 14 inch",   gpu: "Intel Iris Xe",   specs: "Intel Core i7-1355U / 16GB /\n1TB SSD / 14\" 2.8K OLED",           price: 26990000, img: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08404555.png" },
  { id: 6,  brand: "Acer",   name: "Acer Swift Go 14 OLED",        cpu: "Intel Core i5",  ram: "16GB", screen: "13 - 14 inch",   gpu: "Intel Iris Xe",   specs: "Intel Core Ultra 5 125H / 16GB /\n512GB SSD / 14\" 2.8K OLED",      price: 20990000, img: "https://images.acer.com/is/image/acer/swift-go-14-sfg14-72-sfg14-73-glare-silver-ui-01?$Product-Cards-XL$" },
  { id: 7,  brand: "ASUS",   name: "ASUS TUF Gaming A15",          cpu: "AMD Ryzen 7",    ram: "16GB", screen: "15 - 15.6 inch", gpu: "NVIDIA RTX 4060", specs: "AMD Ryzen 7 7735HS / 16GB /\n512GB SSD / RTX 4060 / 15.6\" 144Hz", price: 24490000, badge: "Mới", img: "https://dlcdnwebimgs.asus.com/gain/d3ad557c-864a-4d7a-8f4b-2d7c58ed00ee/w800" },
  { id: 8,  brand: "MSI",    name: "MSI Stealth 16 Studio",        cpu: "Intel Core i7",  ram: "32GB", screen: "16 inch trở lên",gpu: "NVIDIA RTX 4070", specs: "Intel Core i7-13700H / 32GB /\n1TB SSD / RTX 4070 / 16\" 16:10",    price: 37990000, img: "https://asset.msi.com/resize/image/global/product/product_1672728476839352c3c97db317e0b510ed9c882193.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png" },
  { id: 9,  brand: "Apple",  name: "MacBook Pro M3 Pro 14 inch",   cpu: "Apple M Series", ram: "32GB", screen: "13 - 14 inch",   gpu: "Apple M Series" as any, specs: "Apple M3 Pro / 32GB / 1TB SSD /\n14.2\" Liquid Retina XDR",          price: 49990000, badge: "Mới", img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830200" },
  { id: 10, brand: "Dell",   name: "Dell Alienware m16 R2",        cpu: "Intel Core i9",  ram: "32GB", screen: "16 inch trở lên",gpu: "NVIDIA RTX 4070", specs: "Intel Core i9-14900HX / 32GB /\n1TB SSD / RTX 4070 / 16\" QHD+",    price: 52990000, img: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-m16-r2/spi/notebook-alienware-m16-r2-nt-front-open-hero.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=555&qlt=100,1&resMode=sharp2&size=555,402" },
  { id: 11, brand: "HP",     name: "HP OMEN 16",                   cpu: "AMD Ryzen 7",    ram: "16GB", screen: "16 inch trở lên",gpu: "NVIDIA RTX 4060", specs: "AMD Ryzen 7 7745HX / 16GB /\n512GB SSD / RTX 4060 / 16.1\" 165Hz", price: 26490000, img: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08538591.png" },
  { id: 12, brand: "Lenovo", name: "Lenovo ThinkPad X1 Carbon",    cpu: "Intel Core i7",  ram: "16GB", screen: "13 - 14 inch",   gpu: "Intel Iris Xe",   specs: "Intel Core i7-1365U / 16GB /\n512GB SSD / 14\" 2.8K OLED",         price: 42990000, img: "https://p4-ofp.static.pub/fes/cms/2023/02/08/jf0hbfmfrlprkbgkm8v9oalz1twvix693003.png" },
];

const perks = [
  { icon: ShieldCheck,  title: "Bảo hành chính hãng", desc: "An tâm sử dụng dài lâu" },
  { icon: RotateCcw,    title: "Trả góp 0%",           desc: "Linh hoạt, dễ dàng" },
  { icon: Truck,        title: "Miễn phí vận chuyển",  desc: "Giao hàng toàn quốc" },
  { icon: CheckCircle2, title: "Tư vấn tận tâm",       desc: "Hỗ trợ 24/7" },
];

const BRANDS: LaptopBrand[]   = ["ASUS", "Apple", "Dell", "Lenovo", "HP", "Acer", "MSI"];
const RAMS:   LaptopRAM[]     = ["8GB", "16GB", "32GB"];
const CPUS:   LaptopCPU[]     = ["Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M Series"];
const SCREENS: LaptopScreen[] = ["13 - 14 inch", "15 - 15.6 inch", "16 inch trở lên"];
const GPUS:   LaptopGPU[]     = ["Intel Iris Xe", "AMD Radeon", "NVIDIA RTX 4060", "NVIDIA RTX 4070"];

const MAX_PRICE = 55_000_000;
const MIN_PRICE = 10_000_000;

/* ── HELPERS ────────────────────────────────────────────────────────── */
function formatPrice(p: number) {
  return new Intl.NumberFormat("vi-VN").format(p) + " đ";
}

function toggleSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

/* ── FilterCheckbox ─────────────────────────────────────────────────── */
function FilterCheckbox({
  checked, label, count, onChange,
}: {
  checked: boolean; label: string; count?: number; onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-3 py-1.5 text-left"
    >
      <span className="flex items-center gap-2 text-[12px] text-zinc-600 group-hover:text-zinc-900">
        <span className={`h-3.5 w-3.5 rounded-[3px] border transition ${checked ? "border-zinc-950 bg-zinc-950" : "border-zinc-300 bg-white"}`} />
        {label}
      </span>
      {typeof count === "number" && (
        <span className="text-[11px] text-zinc-400">({count})</span>
      )}
    </button>
  );
}

/* ── FilterGroup ────────────────────────────────────────────────────── */
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-zinc-100 pt-4 pb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <h4 className="text-[13px] font-semibold text-zinc-900">{title}</h4>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}

/* ── PAGE ───────────────────────────────────────────────────────────── */
export default function LaptopIndex() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  /* Filter state */
  const [selBrands,  setSelBrands]  = useState<Set<LaptopBrand>>(new Set());
  const [selRAMs,    setSelRAMs]    = useState<Set<LaptopRAM>>(new Set());
  const [selCPUs,    setSelCPUs]    = useState<Set<LaptopCPU>>(new Set());
  const [selScreens, setSelScreens] = useState<Set<LaptopScreen>>(new Set());
  const [selGPUs,    setSelGPUs]    = useState<Set<LaptopGPU>>(new Set());
  const [minPrice,   setMinPrice]   = useState(MIN_PRICE);
  const [maxPrice,   setMaxPrice]   = useState(MAX_PRICE);
  const [activeInput, setActiveInput] = useState<'min' | 'max'>('min');

  const toggleLike = (id: number) =>
    setLiked(p => toggleSet(p, id));

  const hasActiveFilter =
    selBrands.size > 0 || selRAMs.size > 0 || selCPUs.size > 0 ||
    selScreens.size > 0 || selGPUs.size > 0 || minPrice > MIN_PRICE || maxPrice < MAX_PRICE;

  const resetFilters = () => {
    setSelBrands(new Set());
    setSelRAMs(new Set());
    setSelCPUs(new Set());
    setSelScreens(new Set());
    setSelGPUs(new Set());
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
  };

  /* Derived filtered + sorted list */
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      if (selBrands.size  > 0 && !selBrands.has(p.brand))   return false;
      if (selRAMs.size    > 0 && !selRAMs.has(p.ram))        return false;
      if (selCPUs.size    > 0 && !selCPUs.has(p.cpu))        return false;
      if (selScreens.size > 0 && !selScreens.has(p.screen))  return false;
      if (selGPUs.size    > 0 && !selGPUs.has(p.gpu as LaptopGPU)) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });

    if (sortBy === "price-asc")  result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "name")       result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [selBrands, selRAMs, selCPUs, selScreens, selGPUs, minPrice, maxPrice, sortBy]);

  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] as const } },
  };

  const percentMin = ((minPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const percentMax = ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  /* Sidebar JSX — reused for both desktop + mobile */
  const sidebarContent = (
    <div className="space-y-0">
      {/* Price */}
      <div className="pb-4">
        <h4 className="text-[13px] font-semibold text-zinc-900 mb-3">Giá</h4>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-2 py-1.5 text-[11px] text-zinc-700 text-center">
            {formatPrice(minPrice)}
          </div>
          <span className="text-zinc-400">-</span>
          <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-2 py-1.5 text-[11px] text-zinc-700 text-center">
            {formatPrice(maxPrice)}
          </div>
        </div>
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
            className="absolute h-full bg-zinc-950 rounded-full"
            style={{
              left: `${percentMin}%`,
              right: `${100 - percentMax}%`,
            }}
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={500000}
            value={minPrice}
            onChange={e => {
              const val = Math.min(Number(e.target.value), maxPrice - 500000);
              setMinPrice(val);
            }}
            className="dual-range-slider"
            style={{ zIndex: activeInput === 'min' ? 10 : 3 }}
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={500000}
            value={maxPrice}
            onChange={e => {
              const val = Math.max(Number(e.target.value), minPrice + 500000);
              setMaxPrice(val);
            }}
            className="dual-range-slider"
            style={{ zIndex: activeInput === 'max' ? 10 : 3 }}
          />
        </div>
      </div>

      {/* Brand */}
      <FilterGroup title="Thương hiệu">
        {BRANDS.map(b => (
          <FilterCheckbox
            key={b}
            label={b}
            count={products.filter(p => p.brand === b).length}
            checked={selBrands.has(b)}
            onChange={() => setSelBrands(prev => toggleSet(prev, b))}
          />
        ))}
      </FilterGroup>

      {/* RAM */}
      <FilterGroup title="RAM">
        {RAMS.map(r => (
          <FilterCheckbox
            key={r}
            label={r}
            count={products.filter(p => p.ram === r).length}
            checked={selRAMs.has(r)}
            onChange={() => setSelRAMs(prev => toggleSet(prev, r))}
          />
        ))}
      </FilterGroup>

      {/* CPU */}
      <FilterGroup title="CPU">
        {CPUS.map(c => (
          <FilterCheckbox
            key={c}
            label={c}
            count={products.filter(p => p.cpu === c).length}
            checked={selCPUs.has(c)}
            onChange={() => setSelCPUs(prev => toggleSet(prev, c))}
          />
        ))}
      </FilterGroup>

      {/* Screen */}
      <FilterGroup title="Màn hình">
        {SCREENS.map(s => (
          <FilterCheckbox
            key={s}
            label={s}
            count={products.filter(p => p.screen === s).length}
            checked={selScreens.has(s)}
            onChange={() => setSelScreens(prev => toggleSet(prev, s))}
          />
        ))}
      </FilterGroup>

      {/* GPU */}
      <FilterGroup title="Card đồ họa">
        {GPUS.map(g => (
          <FilterCheckbox
            key={g}
            label={g}
            count={products.filter(p => p.gpu === g).length}
            checked={selGPUs.has(g as LaptopGPU)}
            onChange={() => setSelGPUs(prev => toggleSet(prev, g as LaptopGPU))}
          />
        ))}
      </FilterGroup>

      {/* Reset */}
      {hasActiveFilter && (
        <button
          onClick={resetFilters}
          className="mt-4 w-full py-2.5 flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-[13px] font-medium rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Xóa bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16">
      {/* ══ 1. HERO ═════════════════════════════════════════════════════ */}
      <div 
        className="pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #f0f6ff 40%, #e3effe 70%, #dceafd 100%)" }}
      >
        {/* Top-right blue glow */}
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: 800, height: 800,
          background: "radial-gradient(circle, rgba(147,197,253,0.35) 0%, rgba(165,180,252,0.15) 40%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Bottom left soft white fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: 600, height: 400,
          background: "radial-gradient(ellipse at 0% 100%, rgba(255,255,255,0.9) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={heroContainer} initial="hidden" animate="show" className="max-w-2xl relative z-10">
              <motion.h1 variants={heroItem} className="text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-bold tracking-tight text-zinc-900 leading-[1.08] mb-6 whitespace-nowrap">
                Laptop Gaming<br />hiệu năng bứt phá.
              </motion.h1>
              <motion.p variants={heroItem} className="text-[17px] text-zinc-500 mb-10 leading-relaxed max-w-md">
                Sức mạnh tản nhiệt đỉnh cao,<br />
                sẵn sàng cùng bạn chiến mọi tựa game.
              </motion.p>
              <motion.div variants={heroItem} className="flex flex-wrap items-center gap-4">
                <button className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white text-[15px] font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-zinc-900/20 active:scale-95 cursor-pointer">
                  Khám phá ngay
                </button>
                <button className="px-8 py-3.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-[15px] font-semibold rounded-lg transition-all duration-200 shadow-sm active:scale-95 cursor-pointer">
                  Tư vấn chọn laptop
                </button>
              </motion.div>
              <motion.div variants={heroItem} className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-7 mt-8 border-t border-zinc-200 w-full">
                {perks.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-zinc-500 shrink-0" strokeWidth={1.8} />
                    <span className="text-[13px] text-zinc-500 leading-tight whitespace-pre-line font-medium">{title}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-zinc-200/40 rounded-full blur-3xl opacity-60 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop"
                alt="Laptop display"
                className="w-full relative z-10 object-cover rounded-xl shadow-2xl mix-blend-multiply"
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop"; }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 mt-8 md:mt-10">

        {/* ══ 2. CHỌN THEO NHU CẦU ═══════════════════════════════════════ */}
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

        {/* ══ 3. MOBILE TOOLBAR ══════════════════════════════════════════ */}
        <section className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Bộ lọc {hasActiveFilter && <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white">{[selBrands, selRAMs, selCPUs, selScreens, selGPUs].filter(s => s.size > 0).length + (minPrice > MIN_PRICE || maxPrice < MAX_PRICE ? 1 : 0)}</span>}
          </button>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm outline-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="name">Tên A-Z</option>
          </select>
        </section>

        {/* ══ 4. MAIN LAYOUT: FILTERS & GRID ════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-zinc-950">Bộ lọc</h3>
                {hasActiveFilter && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Xóa tất cả
                  </button>
                )}
              </div>
              {sidebarContent}
            </div>
          </aside>

          {/* Mobile Sidebar Drawer */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-[300px] overflow-y-auto bg-white p-5 shadow-2xl transition-transform lg:hidden ${showMobileFilter ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-zinc-950">Bộ lọc</h3>
              <div className="flex items-center gap-3">
                {hasActiveFilter && (
                  <button onClick={resetFilters} className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-950">
                    <RotateCcw className="h-3.5 w-3.5" /> Xóa
                  </button>
                )}
                <button onClick={() => setShowMobileFilter(false)}>
                  <X className="h-5 w-5 text-zinc-600" />
                </button>
              </div>
            </div>
            {sidebarContent}
          </aside>

          {showMobileFilter && (
            <button
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setShowMobileFilter(false)}
            />
          )}

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <p className="text-[13px] text-zinc-500">
                <span className="font-semibold text-zinc-900">{filteredProducts.length}</span> sản phẩm
              </p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none rounded-lg border border-zinc-200 bg-white py-2.5 pl-4 pr-10 text-[13px] font-medium text-zinc-700 shadow-sm outline-none cursor-pointer"
                  >
                    <option value="newest">Sắp xếp: Mới nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="name">Tên A-Z</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                </div>
                <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "grid" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "list" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-white border border-zinc-100 shadow-sm text-center">
                <Search className="mb-4 h-10 w-10 text-zinc-300" />
                <h3 className="text-lg font-bold text-zinc-900">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="mt-2 text-sm text-zinc-500">Thử xóa bớt bộ lọc hoặc điều chỉnh mức giá.</p>
                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-3"
              }>
                {filteredProducts.map((p) => (
                  viewMode === "grid" ? (
                    <div key={p.id} className="group bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm hover:shadow-md hover:border-zinc-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col relative">
                      <button
                        onClick={() => toggleLike(p.id)}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-zinc-100 shadow-sm hover:bg-white transition-colors cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${liked.has(p.id) ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
                      </button>
                      {p.badge && (
                        <span className="absolute top-4 left-4 z-10 px-2 py-0.5 text-[10px] font-bold text-white rounded-full bg-zinc-900">
                          {p.badge}
                        </span>
                      )}
                      <div className="aspect-[4/3] flex items-center justify-center mb-4 p-4">
                        <img src={p.img} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <h3 className="text-[14px] font-bold text-zinc-900 leading-tight mb-2 line-clamp-2">{p.name}</h3>
                        <p className="text-[12px] text-zinc-500 leading-relaxed mb-4 flex-1 whitespace-pre-line">{p.specs}</p>
                        <div className="text-[15px] font-bold text-zinc-900">{formatPrice(p.price)}</div>
                      </div>
                    </div>
                  ) : (
                    <div key={p.id} className="group bg-white rounded-xl border border-zinc-100 p-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 relative">
                      <div className="w-24 h-20 shrink-0 flex items-center justify-center p-2">
                        <img src={p.img} alt={p.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-bold text-zinc-900 leading-tight mb-0.5 line-clamp-1">{p.name}</h3>
                        <p className="text-[11.5px] text-zinc-400 whitespace-pre-line">{p.specs}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[14px] font-extrabold text-zinc-900">{formatPrice(p.price)}</p>
                      </div>
                      <button onClick={() => toggleLike(p.id)} className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0">
                        <Heart className={`w-3.5 h-3.5 transition-colors ${liked.has(p.id) ? "fill-red-500 text-red-500" : "text-zinc-300"}`} />
                      </button>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 transition-colors cursor-pointer">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-900 text-white font-medium text-[13px]">1</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-medium text-[13px] transition-colors cursor-pointer">2</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-medium text-[13px] transition-colors cursor-pointer">3</button>
                <span className="px-2 text-zinc-400">...</span>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-medium text-[13px] transition-colors cursor-pointer">6</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer">
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
