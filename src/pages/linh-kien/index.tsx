import {
  ShieldCheck, Wrench, Truck, CheckCircle2,
  ChevronRight, Heart, Grid, List, RotateCcw,
  ChevronDown, ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

/* ── TYPES ─────────────────────────────────────────────────────────── */
interface Product {
  name: string;
  specs: string;
  price: string;
  badge?: string;
  badgeColor?: string;
  color?: string;
}

/* ── DATA ──────────────────────────────────────────────────────────── */
const componentCategories = [
  { id: "ram",      icon: "💾", label: "RAM" },
  { id: "cpu",      icon: "🔲", label: "CPU\nVi Xử Lý" },
  { id: "vga",      icon: "🖥",  label: "VGA\nCard Màn Hình" },
  { id: "mainboard",icon: "📋", label: "Mainboard\nBo Mạch Chủ" },
  { id: "ssd",      icon: "💿", label: "SSD\nỔ Cứng SSD" },
  { id: "hdd",      icon: "🗄",  label: "HDD\nỔ Cứng HDD" },
  { id: "psu",      icon: "🔌", label: "PSU\nNguồn" },
  { id: "cooling",  icon: "❄",  label: "Tản Nhiệt" },
  { id: "case",     icon: "🖥",  label: "Case\nVỏ Máy Tính" },
];

const products: Product[] = [
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

const brandFilters = [
  { label: "Corsair", count: 32 }, { label: "G.Skill", count: 28 }, { label: "Kingston", count: 18 },
  { label: "TeamGroup", count: 14 }, { label: "Crucial", count: 12 },
];

const capacityFilters = [
  { label: "8GB", count: 18 }, { label: "16GB", count: 45 }, { label: "32GB", count: 38 },
  { label: "64GB", count: 12 }, { label: "128GB", count: 3 },
];

const typeFilters = [
  { label: "DDR4", count: 33 }, { label: "DDR5", count: 82 },
];

const busFilters = [
  { label: "2666MHz", count: 8 }, { label: "3200MHz", count: 18 }, { label: "3600MHz", count: 23 },
  { label: "5600MHz", count: 25 }, { label: "6000MHz+", count: 22 },
];

const perks = [
  { icon: ShieldCheck, title: "Bảo hành lên đến 36 tháng" },
  { icon: Wrench,      title: "Hỗ trợ kỹ thuật miễn phí 24/7" },
  { icon: Truck,       title: "Giao hàng nhanh toàn quốc" },
  { icon: CheckCircle2,title: "Cam kết chính hãng 100%" },
];

/* ── FILTER SECTION ─────────────────────────────────────────────────── */
function FilterSection({
  title, options, defaultChecked = [], showMore = false,
}: {
  title: string;
  options: { label: string; count: number }[];
  defaultChecked?: string[];
  showMore?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const visible = expanded || !showMore ? options : options.slice(0, 4);

  return (
    <div className="border-b border-zinc-100 py-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <span className="text-[13px] font-semibold text-zinc-800">{title}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-2.5">
          {visible.map(opt => (
            <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked={defaultChecked.includes(opt.label)}
                className="w-3.5 h-3.5 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
              />
              <span className="text-[12.5px] text-zinc-600 group-hover:text-zinc-900 flex-1">{opt.label}</span>
              <span className="text-[11px] text-zinc-400">({opt.count})</span>
            </label>
          ))}
          {showMore && options.length > 4 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[12px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1 mt-1"
            >
              {expanded ? "Thu gọn" : `Xem thêm ${options.length - 4}`}
              <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      )}
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

/* ── PAGE ──────────────────────────────────────────────────────────── */
export default function LinhKienIndex() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState("ram");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleLike = (i: number) => {
    setLiked(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };

  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] as const } },
  };

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
              <motion.h1 variants={heroItem} className="text-[2.4rem] md:text-[3rem] lg:text-[3.4rem] font-extrabold text-zinc-900 leading-[1.1] tracking-tight mb-5">
                Hiệu năng mạnh mẽ,<br />xây dựng theo cách của bạn.
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
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {componentCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-200 shrink-0 min-w-[80px] cursor-pointer
                  ${activeCategory === cat.id
                    ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                    : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300 hover:shadow-sm"}`}
              >
                <span className="text-xl leading-none">{cat.icon}</span>
                <span className="text-[11px] font-semibold leading-tight text-center whitespace-pre-line">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ══ 3. FILTER + GRID ══════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-7 lg:gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-[220px] shrink-0">
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-zinc-900">Bộ lọc</h3>
                <button className="text-[12px] text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors">
                  Xóa tất cả
                </button>
              </div>

              {/* Price */}
              <div className="border-b border-zinc-100 py-4">
                <button className="w-full flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold text-zinc-800">Giá</span>
                  <ChevronDown className="w-4 h-4 text-zinc-400 rotate-180" />
                </button>
                <div className="h-1 bg-zinc-200 rounded-full mb-4 relative">
                  <div className="absolute left-[5%] right-[5%] h-full bg-zinc-900 rounded-full" />
                  <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-zinc-900 rounded-full shadow cursor-grab" />
                  <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-zinc-900 rounded-full shadow cursor-grab" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-[11px] text-zinc-600 text-center">100.000đ</div>
                  <div className="text-zinc-300 text-xs">—</div>
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-[11px] text-zinc-600 text-center">20.000.000đ</div>
                </div>
              </div>

              <FilterSection title="Thương hiệu" options={brandFilters} showMore />
              <FilterSection title="Dung lượng" options={capacityFilters} />
              <FilterSection title="Loại RAM" options={typeFilters} />
              <FilterSection title="Tốc độ Bus" options={busFilters} />

              <button className="w-full mt-4 py-2 flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 text-[12.5px] font-medium rounded-lg transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Xóa bộ lọc
              </button>
            </div>
          </aside>

          {/* Products */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <p className="text-[13px] text-zinc-500 font-medium">124 sản phẩm</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-[12.5px] text-zinc-700 cursor-pointer hover:bg-zinc-50 transition-colors">
                  <span className="font-semibold text-zinc-500">Sắp xếp:</span> Mới nhất
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </div>
                <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1">
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

            {/* Grid */}
            <div className={viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5"
              : "flex flex-col gap-3"
            }>
              {products.map((p, i) => (
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

            {/* Pagination */}
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
          </main>

        </div>
      </div>
    </div>
  );
}
