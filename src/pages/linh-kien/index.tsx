import {
  ShieldCheck, Wrench, Truck, CheckCircle2,
  ChevronRight, Heart, Grid, List, RotateCcw,
  ChevronDown, ChevronLeft, SlidersHorizontal, X, Search
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

/* ── TYPES ─────────────────────────────────────────────────────────── */
interface Product {
  name: string;
  specs: string;
  price: string;
  badge?: string;
  badgeColor?: string;
  color?: string;
  category?: string;
}

/* ── DATA ──────────────────────────────────────────────────────────── */
const componentCategories = [
  { id: "ram",       label: "RAM",              from: "#7c3aed", to: "#a78bfa", glow: "rgba(167,139,250,0.35)" },
  { id: "cpu",       label: "CPU / Vi Xử Lý",  from: "#0f172a", to: "#1e3a5f", glow: "rgba(56,189,248,0.25)" },
  { id: "vga",       label: "VGA / Card Màn",   from: "#dc2626", to: "#f97316", glow: "rgba(249,115,22,0.30)" },
  { id: "mainboard", label: "Mainboard",         from: "#065f46", to: "#059669", glow: "rgba(5,150,105,0.30)" },
  { id: "ssd",       label: "SSD / Ổ Cứng SSD", from: "#1e40af", to: "#38bdf8", glow: "rgba(56,189,248,0.30)" },
  { id: "hdd",       label: "HDD / Ổ Cứng HDD", from: "#374151", to: "#6b7280", glow: "rgba(107,114,128,0.25)" },
  { id: "psu",       label: "PSU / Nguồn",       from: "#78350f", to: "#d97706", glow: "rgba(217,119,6,0.30)" },
  { id: "cooling",   label: "Tản Nhiệt",         from: "#164e63", to: "#06b6d4", glow: "rgba(6,182,212,0.30)" },
  { id: "case",      label: "Case / Vỏ Máy",     from: "#1c1917", to: "#44403c", glow: "rgba(68,64,60,0.40)" },
];

const defaultProducts: Product[] = [
  { name: "G.Skill Trident Z5 RGB",      specs: "18GB (2x8GB) DDR5 6000MHz",  price: "2.890.000đ", badge: "Mới",     badgeColor: "#22c55e", color: "#e0e7ef" },
  { name: "Corsair Vengeance RGB",        specs: "16GB (2x8GB) DDR5 5600MHz",  price: "2.290.000đ", badge: "Bán chạy",badgeColor: "#f97316", color: "#1a1a2e" },
  { name: "Kingston Fury Beast",          specs: "16GB (2x8GB) DDR4 3200MHz",  price: "990.000đ",   color: "#1a1a2e" },
  { name: "G.Skill Ripjaws V",            specs: "16GB (2x8GB) DDR4 3600MHz",  price: "1.290.000đ", color: "#2d2d2d" },
  { name: "Corsair Dominator Platinum",   specs: "32GB (2x16GB) DDR5 6000MHz", price: "5.990.000đ", color: "#c8d0dc" },
  { name: "TeamGroup T-Force Delta RGB",  specs: "32GB (2x16GB) DDR5 6000MHz", price: "4.490.000đ", color: "#111827" },
  { name: "Crucial Pro",                  specs: "32GB (2x16GB) DDR5 4800MHz", price: "1.690.000đ", color: "#1f2937" },
  { name: "Kingston Fury Beast",          specs: "32GB (2x16GB) DDR5 6000MHz", price: "4.290.000đ", color: "#1a1a2e" },
  { name: "G.Skill Trident Z5 RGB",      specs: "32GB (2x16GB) DDR5 6400MHz", price: "5.490.000đ", color: "#e0e7ef" },
  { name: "Corsair Vengeance LPX",        specs: "16GB (2x8GB) DDR4 3200MHz",  price: "1.190.000đ", color: "#111" },
  { name: "Apacer PANTHER",              specs: "16GB (2x8GB) DDR4 3600MHz",  price: "1.090.000đ", color: "#f59e0b" },
  { name: "TeamGroup T-Force Vulcan Z",  specs: "16GB (2x8GB) DDR4 3200MHz",  price: "890.000đ",   color: "#dc2626" },
];


const getCategoryBrands = (category: string) => {
  const cat = category.toLowerCase();
  if (cat === "ram") return ["Corsair", "G.Skill", "Kingston", "TeamGroup", "Crucial", "Apacer"];
  if (cat === "cpu") return ["Intel", "AMD"];
  if (cat === "vga") return ["NVIDIA", "AMD", "ASUS", "MSI", "Gigabyte"];
  if (cat === "mainboard") return ["ASUS", "MSI", "Gigabyte", "Intel", "AMD"];
  if (cat === "ssd" || cat === "hdd") return ["Samsung", "Kingston", "Crucial", "Western Digital", "Seagate"];
  if (cat === "psu") return ["Corsair", "MSI", "Asus", "Seasonic", "Antec"];
  if (cat === "cooling") return ["Corsair", "Lian Li", "Thermalright", "Noctua", "Deepcool"];
  if (cat === "case") return ["Corsair", "Lian Li", "NZXT", "Asus", "Montech"];
  return [];
};

const MAX_PRICE = 20_000_000;
const MIN_PRICE = 100_000;

const perks = [
  { icon: ShieldCheck, title: "Bảo hành lên đến 36 tháng" },
  { icon: Wrench,      title: "Hỗ trợ kỹ thuật miễn phí 24/7" },
  { icon: Truck,       title: "Giao hàng nhanh toàn quốc" },
  { icon: CheckCircle2,title: "Cam kết chính hãng 100%" },
];

/* ── HELPERS ────────────────────────────────────────────────────────── */
function parsePrice(priceStr: string) {
  return parseInt(priceStr.replace(/\\D/g, ''), 10) || 0;
}

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

/* ── PRODUCT PLACEHOLDER IMAGE ─────────────────────────────────────── */
function ProductPlaceholder({ color = "#e5e7eb" }: { color?: string }) {
  return (
    <div
      className="w-full aspect-[4/3] rounded-xl flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`, border: `1px solid ${color}33` }}
    >
      <div className="flex flex-col items-center gap-2 opacity-30">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color === "#e0e7ef" ? "#94a3b8" : "#6b7280"} strokeWidth="1.5">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <span className="text-[10px] font-medium" style={{ color: color === "#e0e7ef" ? "#94a3b8" : "#6b7280" }}>
          Ảnh sản phẩm
        </span>
      </div>
    </div>
  );
}

const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:3001`)
  : "http://localhost:3001";

/* ── PAGE ──────────────────────────────────────────────────────────── */
export default function LinhKienIndex() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState("ram");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  /* Filter state */
  const [selBrands,  setSelBrands]  = useState<Set<string>>(new Set());
  const [selCapacities, setSelCapacities] = useState<Set<string>>(new Set());
  const [selTypes, setSelTypes] = useState<Set<string>>(new Set());
  const [selBuses, setSelBuses] = useState<Set<string>>(new Set());
  const [selSeries, setSelSeries] = useState<Set<string>>(new Set());
  const [selWattages, setSelWattages] = useState<Set<string>>(new Set());
  const [selSizes, setSelSizes] = useState<Set<string>>(new Set());
  const [minPrice,   setMinPrice]   = useState(MIN_PRICE);
  const [maxPrice,   setMaxPrice]   = useState(MAX_PRICE);
  const [activeInput, setActiveInput] = useState<'min' | 'max'>('min');

  const [searchParams, setSearchParams] = useSearchParams();

  // Load from API on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/components`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching components:", err));
  }, []);

  // Sync from URL params to React states
  useEffect(() => {
    const category = searchParams.get("category") || "ram";
    setActiveCategory(category);

    const brands = searchParams.get("brand");
    setSelBrands(brands ? new Set(brands.split(",")) : new Set());

    const capacities = searchParams.get("capacity");
    setSelCapacities(capacities ? new Set(capacities.split(",")) : new Set());

    const types = searchParams.get("type");
    setSelTypes(types ? new Set(types.split(",")) : new Set());

    const buses = searchParams.get("bus");
    setSelBuses(buses ? new Set(buses.split(",")) : new Set());

    const cpuSeries = searchParams.get("cpuSeries");
    const vgaSeries = searchParams.get("vgaSeries");
    const series = cpuSeries || vgaSeries || searchParams.get("series");
    setSelSeries(series ? new Set(series.split(",")) : new Set());

    const wattages = searchParams.get("wattage");
    setSelWattages(wattages ? new Set(wattages.split(",")) : new Set());

    const chipset = searchParams.get("chipset");
    const size = searchParams.get("size");
    const sizes = chipset || size || searchParams.get("sizes");
    setSelSizes(sizes ? new Set(sizes.split(",")) : new Set());

    const minP = searchParams.get("minPrice");
    setMinPrice(minP ? Number(minP) : MIN_PRICE);

    const maxP = searchParams.get("maxPrice");
    setMaxPrice(maxP ? Number(maxP) : MAX_PRICE);
  }, [searchParams]);

  const toggleLike = (i: number) => {
    setLiked(p => toggleSet(p, i));
  };

  const hasActiveFilter =
    selBrands.size > 0 || selCapacities.size > 0 || selTypes.size > 0 ||
    selBuses.size > 0 || selSeries.size > 0 || selWattages.size > 0 ||
    selSizes.size > 0 || minPrice > MIN_PRICE || maxPrice < MAX_PRICE;

  const resetFilters = () => {
    setSelBrands(new Set());
    setSelCapacities(new Set());
    setSelTypes(new Set());
    setSelBuses(new Set());
    setSelSeries(new Set());
    setSelWattages(new Set());
    setSelSizes(new Set());
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);

    // Keep only category in search params
    setSearchParams({ category: activeCategory });
  };

  const handleFilterToggle = (
    set: Set<string>,
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string,
    paramName: string
  ) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setFn(next);

    // Sync to URL
    const newParams = new URLSearchParams(searchParams);
    if (next.size > 0) {
      newParams.set(paramName, Array.from(next).join(","));
    } else {
      newParams.delete(paramName);
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    resetFilters();
    setSearchParams({ category: catId });
  };

  /* Derived filtered + sorted list */
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      // 1. Filter by category
      const pCat = (p.category || 'RAM').toLowerCase();
      if (pCat !== activeCategory.toLowerCase()) return false;

      // 2. Filter by price range
      const priceNum = parsePrice(p.price);
      if (priceNum < minPrice || priceNum > maxPrice) return false;

      // 3. Filter by Brand
      if (selBrands.size > 0) {
        if (!Array.from(selBrands).some(b => p.name.toLowerCase().includes(b.toLowerCase()))) return false;
      }
      
      // 4. Filter by Capacity
      if (selCapacities.size > 0) {
        if (!Array.from(selCapacities).some(c => p.specs.includes(c))) return false;
      }

      // 5. Filter by Type (DDR4, DDR5, NVMe, SATA, AIO, etc.)
      if (selTypes.size > 0) {
        if (!Array.from(selTypes).some(t => p.specs.toLowerCase().includes(t.toLowerCase()))) return false;
      }

      // 6. Filter by Bus (RAM only)
      if (activeCategory === "ram" && selBuses.size > 0) {
        if (!Array.from(selBuses).some(b => p.specs.includes(b.replace('MHz', '')))) return false;
      }

      // 7. Filter by CPU / VGA Series
      if (selSeries.size > 0) {
        if (!Array.from(selSeries).some(s => p.name.toLowerCase().includes(s.toLowerCase()) || p.specs.toLowerCase().includes(s.toLowerCase()))) return false;
      }

      // 8. Filter by PSU Wattage
      if (selWattages.size > 0) {
        if (!Array.from(selWattages).some(w => p.specs.toLowerCase().includes(w.toLowerCase()))) return false;
      }

      // 9. Filter by Mainboard / Case Size
      if (selSizes.size > 0) {
        if (!Array.from(selSizes).some(sz => p.specs.toLowerCase().includes(sz.toLowerCase()) || p.name.toLowerCase().includes(sz.toLowerCase()))) return false;
      }

      return true;
    });

    if (sortBy === "price-asc")  result = [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sortBy === "price-desc") result = [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    if (sortBy === "name")       result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, activeCategory, selBrands, selCapacities, selTypes, selBuses, selSeries, selWattages, selSizes, minPrice, maxPrice, sortBy]);

  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] as const } },
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
              
              // Sync price to URL
              const newParams = new URLSearchParams(searchParams);
              newParams.set("minPrice", String(val));
              setSearchParams(newParams);
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

              // Sync price to URL
              const newParams = new URLSearchParams(searchParams);
              newParams.set("maxPrice", String(val));
              setSearchParams(newParams);
            }}
            className="dual-range-slider"
            style={{ zIndex: activeInput === 'max' ? 10 : 3 }}
          />
        </div>
      </div>

      {/* Brand Filters */}
      {getCategoryBrands(activeCategory).length > 0 && (
        <FilterGroup title="Thương hiệu">
          {getCategoryBrands(activeCategory).map(b => (
            <FilterCheckbox
              key={b}
              label={b}
              count={products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase() && p.name.toLowerCase().includes(b.toLowerCase())).length}
              checked={selBrands.has(b)}
              onChange={() => handleFilterToggle(selBrands, setSelBrands, b, "brand")}
            />
          ))}
        </FilterGroup>
      )}

      {/* Dynamic Filters based on category */}
      {activeCategory === "ram" && (
        <>
          <FilterGroup title="Dung lượng">
            {["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"].map(c => (
              <FilterCheckbox
                key={c}
                label={c}
                count={products.filter(p => p.category?.toLowerCase() === "ram" && p.specs.includes(c)).length}
                checked={selCapacities.has(c)}
                onChange={() => handleFilterToggle(selCapacities, setSelCapacities, c, "capacity")}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Loại RAM">
            {["DDR4", "DDR5"].map(t => (
              <FilterCheckbox
                key={t}
                label={t}
                count={products.filter(p => p.category?.toLowerCase() === "ram" && p.specs.includes(t)).length}
                checked={selTypes.has(t)}
                onChange={() => handleFilterToggle(selTypes, setSelTypes, t, "type")}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Tốc độ Bus">
            {["2666MHz", "3200MHz", "3600MHz", "4800MHz", "5600MHz", "6000MHz", "6400MHz"].map(b => (
              <FilterCheckbox
                key={b}
                label={b}
                count={products.filter(p => p.category?.toLowerCase() === "ram" && p.specs.includes(b.replace('MHz', ''))).length}
                checked={selBuses.has(b)}
                onChange={() => handleFilterToggle(selBuses, setSelBuses, b, "bus")}
              />
            ))}
          </FilterGroup>
        </>
      )}

      {activeCategory === "cpu" && (
        <FilterGroup title="Dòng CPU">
          {["Core i3", "Core i5", "Core i7", "Core i9", "Ryzen 5", "Ryzen 7", "Ryzen 9"].map(s => (
            <FilterCheckbox
              key={s}
              label={s}
              count={products.filter(p => p.category?.toLowerCase() === "cpu" && p.name.includes(s)).length}
              checked={selSeries.has(s)}
              onChange={() => handleFilterToggle(selSeries, setSelSeries, s, "cpuSeries")}
            />
          ))}
        </FilterGroup>
      )}

      {activeCategory === "vga" && (
        <FilterGroup title="Dòng Card đồ họa">
          {["RTX 4090", "RTX 4080", "RTX 4070", "RTX 4060", "RTX 30 Series", "RX 7000", "RX 6000"].map(s => (
            <FilterCheckbox
              key={s}
              label={s}
              count={products.filter(p => p.category?.toLowerCase() === "vga" && p.specs.includes(s.replace(' Series', ''))).length}
              checked={selSeries.has(s)}
              onChange={() => handleFilterToggle(selSeries, setSelSeries, s, "vgaSeries")}
            />
          ))}
        </FilterGroup>
      )}

      {activeCategory === "mainboard" && (
        <FilterGroup title="Chipset">
          {["Z790", "B760", "X670", "B650", "ITX"].map(s => (
            <FilterCheckbox
              key={s}
              label={s}
              count={products.filter(p => p.category?.toLowerCase() === "mainboard" && (p.name.includes(s) || p.specs.includes(s))).length}
              checked={selSizes.has(s)}
              onChange={() => handleFilterToggle(selSizes, setSelSizes, s, "chipset")}
            />
          ))}
        </FilterGroup>
      )}

      {(activeCategory === "ssd" || activeCategory === "hdd") && (
        <>
          <FilterGroup title="Dung lượng">
            {["256GB", "512GB", "1TB", "2TB", "4TB", "8TB+"].map(c => (
              <FilterCheckbox
                key={c}
                label={c}
                count={products.filter(p => p.category?.toLowerCase() === activeCategory && p.specs.includes(c)).length}
                checked={selCapacities.has(c)}
                onChange={() => handleFilterToggle(selCapacities, setSelCapacities, c, "capacity")}
              />
            ))}
          </FilterGroup>
          {activeCategory === "ssd" && (
            <FilterGroup title="Chuẩn kết nối">
              {["NVMe", "SATA"].map(t => (
                <FilterCheckbox
                  key={t}
                  label={t}
                  count={products.filter(p => p.category?.toLowerCase() === "ssd" && p.specs.includes(t)).length}
                  checked={selTypes.has(t)}
                  onChange={() => handleFilterToggle(selTypes, setSelTypes, t, "type")}
                />
              ))}
            </FilterGroup>
          )}
        </>
      )}

      {activeCategory === "psu" && (
        <>
          <FilterGroup title="Công suất">
            {["500W", "650W", "750W", "850W", "1000W"].map(w => (
              <FilterCheckbox
                key={w}
                label={w}
                count={products.filter(p => p.category?.toLowerCase() === "psu" && p.specs.includes(w)).length}
                checked={selWattages.has(w)}
                onChange={() => handleFilterToggle(selWattages, setSelWattages, w, "wattage")}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Chứng nhận 80 Plus">
            {["Bronze", "Gold", "Platinum"].map(c => (
              <FilterCheckbox
                key={c}
                label={c}
                count={products.filter(p => p.category?.toLowerCase() === "psu" && p.specs.includes(c)).length}
                checked={selTypes.has(c)}
                onChange={() => handleFilterToggle(selTypes, setSelTypes, c, "cert")}
              />
            ))}
          </FilterGroup>
        </>
      )}

      {activeCategory === "cooling" && (
        <FilterGroup title="Loại tản nhiệt">
          {["Khí", "AIO", "Custom", "Quạt"].map(t => (
            <FilterCheckbox
              key={t}
              label={t}
              count={products.filter(p => p.category?.toLowerCase() === "cooling" && p.specs.includes(t)).length}
              checked={selTypes.has(t)}
              onChange={() => handleFilterToggle(selTypes, setSelTypes, t, "type")}
            />
          ))}
        </FilterGroup>
      )}

      {activeCategory === "case" && (
        <FilterGroup title="Kích thước">
          {["ITX", "Micro ATX", "Mid Tower", "Full Tower"].map(s => (
            <FilterCheckbox
              key={s}
              label={s}
              count={products.filter(p => p.category?.toLowerCase() === "case" && p.specs.includes(s)).length}
              checked={selSizes.has(s)}
              onChange={() => handleFilterToggle(selSizes, setSelSizes, s, "size")}
            />
          ))}
        </FilterGroup>
      )}

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
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f0f4f8 40%, #e8eef5 100%)" }}>
        {/* BG glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 700, height: 700, background: "radial-gradient(circle, rgba(147,197,253,0.25) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 500, height: 300, background: "radial-gradient(ellipse at 0% 100%, rgba(255,255,255,0.8) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-10 md:py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* Left */}
            <motion.div variants={heroContainer} initial="hidden" animate="show" className="max-w-2xl">
              <motion.div variants={heroItem}>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-zinc-500 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  Linh kiện chính hãng
                </span>
              </motion.div>
              <motion.h1 variants={heroItem} className="text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] font-bold tracking-tight text-zinc-900 leading-[1.08] mb-6">
                Linh kiện PC<br />cho mọi cấu hình.
              </motion.h1>
              <motion.p variants={heroItem} className="text-[16px] text-zinc-500 leading-relaxed mb-8">
                Đa dạng linh kiện chính hãng, chất lượng cao.<br />
                Tương thích tối ưu – Bền bỉ – Hiệu suất vượt trội.
              </motion.p>
              <motion.div variants={heroItem} className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 px-7 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-[14px] font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-zinc-900/20 active:scale-95 cursor-pointer">
                  Xem linh kiện <ChevronRight className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center gap-2 px-7 py-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-[14px] font-semibold rounded-lg transition-all duration-200 shadow-sm active:scale-95 cursor-pointer">
                  Hướng dẫn build PC <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Mini perks */}
              <motion.div variants={heroItem} className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-zinc-200/60">
                {perks.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-zinc-500 shrink-0" strokeWidth={1.6} />
                    <span className="text-[12px] text-zinc-500 font-medium leading-tight">{title}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — PC case placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
              className="relative hidden lg:flex items-end justify-center"
              style={{ minHeight: 340 }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-3xl opacity-60 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%)" }} />
              {/* PC Case hero placeholder */}
              <div className="relative z-10 flex flex-col items-center justify-center w-[360px] h-[320px] rounded-3xl border-2 border-zinc-200/60 bg-white/40 backdrop-blur shadow-2xl">
                <div className="flex flex-col items-center gap-3 opacity-40">
                  <svg width="80" height="80" viewBox="0 0 64 64" fill="none" stroke="#64748b" strokeWidth="1.5">
                    <rect x="12" y="4" width="40" height="56" rx="4" />
                    <rect x="18" y="10" width="28" height="18" rx="2" />
                    <circle cx="32" cy="40" r="6" />
                    <circle cx="32" cy="40" r="2" />
                    <line x1="12" y1="32" x2="7" y2="32" />
                    <line x1="52" y1="32" x2="57" y2="32" />
                  </svg>
                  <span className="text-[13px] font-semibold text-zinc-500">Ảnh case PC</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ════════════════════════════════════════════════ */}
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 mt-10">

        {/* ══ 2. CATEGORY NAV ═══════════════════════════════════════════ */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-bold text-zinc-900">Danh mục linh kiện</h2>
            <a href="#" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 md:gap-4">
            {componentCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`group cursor-pointer bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden text-left
                  ${activeCategory === cat.id
                    ? "border-zinc-900 ring-2 ring-zinc-900/10"
                    : "border-zinc-100"}`}
              >
                {/* Gradient block */}
                <div
                  className="w-full aspect-[4/3] relative"
                  style={{
                    background: `linear-gradient(135deg, ${cat.from} 0%, ${cat.to} 100%)`,
                    overflow: "hidden",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(circle at 30% 30%, ${cat.glow} 0%, transparent 65%)`,
                    pointerEvents: "none",
                  }} />
                  {activeCategory === cat.id && (
                    <div className="absolute inset-0 ring-2 ring-inset ring-white/20" />
                  )}
                </div>
                {/* Label row */}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className={`text-[12px] font-semibold leading-tight transition-colors
                    ${activeCategory === cat.id ? "text-zinc-950" : "text-zinc-800 group-hover:text-zinc-950"}`}>
                    {cat.label}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-all duration-200
                    ${activeCategory === cat.id ? "text-zinc-700 translate-x-0.5" : "text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5"}`} />
                </div>
              </button>
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
            Bộ lọc {hasActiveFilter && <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white">{[selBrands, selCapacities, selTypes, selBuses].filter(s => s.size > 0).length + (minPrice > MIN_PRICE || maxPrice < MAX_PRICE ? 1 : 0)}</span>}
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

        {/* ══ 4. FILTER + GRID ══════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-7 lg:gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-zinc-950">Bộ lọc</h3>
                {hasActiveFilter && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
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
              className="fixed inset-0 z-40 bg-black/30 lg:hidden cursor-default"
              onClick={() => setShowMobileFilter(false)}
            />
          )}

          {/* Products */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <p className="text-[13px] text-zinc-500 font-medium">
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
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "list" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                  >
                    <List className="w-3.5 h-3.5" />
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
                  className="mt-5 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5"
                : "flex flex-col gap-3"
              }>
                {filteredProducts.map((p, i) => (
                  viewMode === "grid" ? (
                    <div key={i} className="group bg-white rounded-2xl border border-zinc-100 p-3.5 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-col relative">
                      {/* Badge */}
                      {p.badge && (
                        <span
                          className="absolute top-3 left-3 z-10 px-2 py-0.5 text-[10px] font-bold text-white rounded-full"
                          style={{ background: p.badgeColor }}
                        >
                          {p.badge}
                        </span>
                      )}
                      {/* Like */}
                      <button
                        onClick={() => toggleLike(i)}
                        className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-zinc-100 shadow-sm hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${liked.has(i) ? "fill-red-500 text-red-500" : "text-zinc-300"}`} />
                      </button>
                      {/* Image placeholder */}
                      <ProductPlaceholder color={p.color} />
                      {/* Info */}
                      <div className="mt-3 flex flex-col flex-1">
                        <h3 className="text-[13px] font-bold text-zinc-900 leading-tight mb-1 line-clamp-2">{p.name}</h3>
                        <p className="text-[11.5px] text-zinc-400 mb-3 flex-1">{p.specs}</p>
                        <p className="text-[14px] font-extrabold text-zinc-900">{p.price}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="group bg-white rounded-xl border border-zinc-100 p-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 relative">
                      <div className="w-20 h-16 shrink-0">
                        <ProductPlaceholder color={p.color} />
                      </div>
                      {p.badge && (
                        <span className="absolute top-3 left-2.5 px-2 py-0.5 text-[10px] font-bold text-white rounded-full" style={{ background: p.badgeColor }}>{p.badge}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-bold text-zinc-900 leading-tight mb-0.5">{p.name}</h3>
                        <p className="text-[11.5px] text-zinc-400">{p.specs}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[14px] font-extrabold text-zinc-900">{p.price}</p>
                      </div>
                      <button onClick={() => toggleLike(i)} className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0">
                        <Heart className={`w-3.5 h-3.5 transition-colors ${liked.has(i) ? "fill-red-500 text-red-500" : "text-zinc-300"}`} />
                      </button>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 transition-colors cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors cursor-pointer
                      ${n === 1 ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-1 text-zinc-400 text-[13px]">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-[13px] font-medium transition-colors cursor-pointer">
                  7
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
