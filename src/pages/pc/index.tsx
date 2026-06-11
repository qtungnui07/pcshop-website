import { 
  ShieldCheck, Truck, CheckCircle2, Wrench, CreditCard, ChevronRight, Heart, ArrowRight,
  Gamepad2, Palette, Clock, Cpu, Box 
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface PCItem {
  badge: string;
  badgeColor: string;
  name: string;
  specs: string;
  price: string;
  from: string;
  to: string;
  image?: string;
  imgName?: string;
}

/* ── DATA ─────────────────────────────────────────────────────────── */

const pcCategories = [
  { name: "PC Gaming",     imgName: "cat-gaming.png",      Icon: Gamepad2 },
  { name: "PC Đồ Họa",    imgName: "cat-dohoa.png",       Icon: Palette },
  { name: "PC Văn Phòng",  imgName: "cat-vanphong.png",    Icon: Clock },
  { name: "PC Workstation",imgName: "cat-workstation.png",  Icon: Cpu },
  { name: "PC Mini",       imgName: "cat-mini.png",        Icon: Box },
];

const featuredPCs = [
  { badge: "Bán chạy", badgeColor: "#1d1d1f", name: "PC Gaming Infinity",   specs: "i7-14700K • RTX 4070 SUPER\n32GB RAM • 1TB SSD",          price: "28.990.000đ", from: "#7c3aed", to: "#ec4899", imgName: "pc-infinity.png" },
  { badge: "Mới",      badgeColor: "#2563eb", name: "PC Gaming Frost",       specs: "Ryzen 7 7800X3D • RTX 4070 Ti\n32GB RAM • 1TB SSD",       price: "32.990.000đ", from: "#1d4ed8", to: "#38bdf8", imgName: "pc-frost.png" },
  { badge: "Hot",      badgeColor: "#dc2626", name: "PC Gaming Nebula",      specs: "i9-14900K • RTX 4080 SUPER\n32GB RAM • 2TB SSD",          price: "45.990.000đ", from: "#0f172a", to: "#1e40af", imgName: "pc-nebula.png" },
  { badge: "",         badgeColor: "",        name: "PC Workstation Pro",    specs: "Threadripper 7970X • RTX 4090\n64GB RAM • 2TB SSD",       price: "89.990.000đ", from: "#18181b", to: "#3f3f46", imgName: "pc-workstation.png" },
  { badge: "",         badgeColor: "",        name: "PC Mini White",         specs: "Ryzen 5 7600 • RTX 4060\n16GB RAM • 1TB SSD",             price: "18.990.000đ", from: "#e2e8f0", to: "#f1f5f9", imgName: "pc-mini.png" },
];

const brands = [
  { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg" },
  { name: "AMD", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg" },
  { name: "Nvidia", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
  { name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Asus_blue_logo.svg" },
  { name: "MSI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Micro-Star_International_logo2020.svg" },
  { name: "Gigabyte", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Gigabyte_Technology_logo_20080107.svg" },
  { name: "AORUS", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87_AORUS_Black.png" },
  { name: "Corsair", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Corsair_2020_logo.svg" },
  { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" },
  { name: "Acer", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg" },
  { name: "Razer", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Razer_snake_logo.svg/960px-Razer_snake_logo.svg.png" },
  { name: "Kingston", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87_Kingston_WhiteHead_White_BG_Black.png" },
  { name: "Cooler Master", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Cooler_Master_Logo.svg" },
  { name: "HyperX", logo: "https://images.seeklogo.com/logo-png/42/1/hyperx-logo-png_seeklogo-425410.png" },
  { name: "SanDisk", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/SanDisk-Logo.svg" },
  { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Samsung_Orig_Wordmark_BLACK_RGB.png" },
  { name: "Logitech", logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Logitech_G_logo_stack_blue.svg" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
];

// const perks = [
//   { icon: ShieldCheck, title: "Bảo hành 36 tháng",      desc: "An tâm sử dụng dài lâu" },
 
//   { icon: Truck,       title: "Giao hàng toàn quốc",    desc: "Nhanh chóng & an toàn" },
//   { icon: CreditCard,  title: "Trả góp 0% lãi suất",    desc: "Dễ dàng & linh hoạt" },
// ];

/* ── GRADIENT BLOCK placeholder ───────────────────────────────────── */
function Grad({ from, to, glow, className = "", children }: {
  from: string; to: string; glow?: string; className?: string; children?: React.ReactNode;
}) {
  return (
    <div className={className} style={{ background:`linear-gradient(135deg,${from} 0%,${to} 100%)`, position:"relative", overflow:"hidden" }}>
      {glow && <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 30% 30%,${glow} 0%,transparent 65%)`, pointerEvents:"none" }} />}
      {children}
    </div>
  );
}

const getCategorySlug = (name: string) => {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:3001`)
  : "http://localhost:3001";

/* ── PAGE ─────────────────────────────────────────────────────────── */
export default function PCIndex() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [pcs, setPcs] = useState<PCItem[]>(() =>
    featuredPCs.map(pc => ({
      ...pc,
      image: `/images/${pc.imgName}`
    }))
  );

  useEffect(() => {
    fetch(`${API_BASE}/api/featured-pcs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const normalized = data.map((pc: any) => {
            let localImg = pc.image;
            if (pc.image && pc.image.includes('/images/')) {
              const fileName = pc.image.substring(pc.image.lastIndexOf('/') + 1);
              localImg = `/images/${fileName}`;
            }
            return {
              ...pc,
              image: localImg
            };
          });
          setPcs(normalized);
        }
      })
      .catch((err) => console.error("Error fetching featured PCs from backend:", err));
  }, []);

  const toggleLike = (i: number) =>
    setLiked(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });



  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] as const } },
  };
  const heroRight = {
    hidden: { opacity: 0, y: 60, scale: 0.96 },
    show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 1.3, ease: [0.25, 1, 0.5, 1] as const, delay: 0.25 } },
  };

  return (
    <div>
      {/* ══ 1. HERO — full-width, flush with navbar ═══════════════════ */}
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0f6ff 40%, #e3effe 70%, #dceafd 100%)",
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
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-19 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: "calc(100vh - 96px)" }}>
            {/* Left content */}
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col items-start justify-center pr-8 py-12 relative z-10"
            >
              <motion.span variants={heroItem} className="inline-block px-3 py-1 bg-white/70 text-zinc-500 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-6 border border-zinc-200/60">
                PC Gaming &amp; Workstation
              </motion.span>
              <motion.h1 variants={heroItem} className="text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] font-bold tracking-tight text-zinc-900 leading-[1.08] mb-6">
                PC mạnh mẽ<br />cho mọi nhu cầu.
              </motion.h1>
              <motion.p variants={heroItem} className="text-[17px] text-zinc-500 mb-10 leading-relaxed">
                Hiệu năng đỉnh cao, thiết kế tinh tế.<br />
                Được tối ưu cho Gaming, Work và Sáng tạo.
              </motion.p>
              <motion.div variants={heroItem} className="flex flex-row gap-3 mb-12">
                <Link to="/pc/pc-gaming" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1d1d1f] hover:bg-zinc-800 text-white text-[15px] font-semibold rounded-full transition-all duration-200 shadow-md active:scale-95 cursor-pointer">
                  Xem PC Gaming <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/tu-build-pc"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/80 border border-zinc-300 hover:bg-white text-zinc-800 text-[15px] font-semibold rounded-full transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                >
                  Tự build PC <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div variants={heroItem} className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-7 border-t border-zinc-300/40 w-full">
                {[
                  { Icon: ShieldCheck, text: "Bảo hành lên đến\n36 tháng" },
                  { Icon: Truck,       text: "Giao hàng nhanh\ntoàn quốc" },
                  { Icon: CheckCircle2,text: "Test máy kỹ càng\ntrước khi giao" },
                  { Icon: CreditCard,  text: "Trả góp 0% lãi suất" },
                  { Icon: Wrench,      text: "Hỗ trợ build miễn phí" },
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
                background: "radial-gradient(circle, rgba(147,197,253,0.3) 0%, rgba(165,180,252,0.1) 50%, transparent 70%)",
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
                alt="PC Gaming"
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

      {/* ══ REST of page inside normal container ═══════════════════════ */}
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">

        {/* ══ 2. SHOP THEO NHU CẦU ══════════════════════════════════════ */}
        <section className="mt-16 md:mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">Shop theo nhu cầu</h2>
            <Link to="/pc/all" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {pcCategories.map((cat, i) => (
              <Link to={`/pc/${getCategorySlug(cat.name)}`} key={i} className="group cursor-pointer bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden block">
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-zinc-50">
                  <img 
                    src={`/images/${cat.imgName}`} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center border border-white/20 shadow-sm">
                    {cat.name === "PC Workstation" ? (
                      <span className="text-[11px] font-black text-zinc-500">Ai</span>
                    ) : (
                      <cat.Icon className="w-4.5 h-4.5 text-zinc-500" strokeWidth={1.8} />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between px-3.5 py-3">
                  <span className="text-[13px] font-bold text-zinc-800 group-hover:text-zinc-950 transition-colors">{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ 3. PC NỔI BẬT ═════════════════════════════════════════════ */}
        <section className="mt-16 md:mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">PC nổi bật</h2>
            <Link to="/pc/all" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pcs.map((pc, i) => (
              <div key={i} className="w-full bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group/card">
                <div className="relative">
                  {pc.image ? (
                    <div className="w-full aspect-[4/3.5] relative overflow-hidden bg-zinc-900">
                      <img
                        src={pc.image}
                        alt={pc.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                    </div>
                  ) : (
                    <Grad from={pc.from} to={pc.to} className="w-full aspect-[4/3.5]" />
                  )}
                  {pc.badge && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-bold text-white rounded-full" style={{ background: pc.badgeColor }}>
                      {pc.badge}
                    </span>
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-[13px] font-bold text-zinc-900 leading-tight mb-1">{pc.name}</p>
                  <p className="text-[11px] text-zinc-400 leading-snug whitespace-pre-line mb-3">{pc.specs}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-zinc-900">{pc.price}</span>
                    <button onClick={() => toggleLike(i)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors cursor-pointer">
                      <Heart className={`w-4 h-4 transition-colors ${liked.has(i) ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 4. BRANDS ══════════════════════════════════════════════════ */}
        <section className="mt-16 md:mt-20 border-t border-b border-zinc-200/60 py-5 overflow-hidden">
          <div className="flex w-full overflow-hidden select-none">
            <div className="flex gap-20 animate-infinite-scroll py-2">
              {/* Loop multiple times to make it seamless on wide screens */}
              {[...brands, ...brands, ...brands].map((b, i) => (
                <div key={i} className="flex items-center justify-center h-8 w-24 shrink-0 cursor-pointer">
                  <img 
                    src={b.logo} 
                    alt={b.name} 
                    className="max-h-full max-w-full object-contain opacity-35 hover:opacity-85 transition-all duration-300 grayscale brightness-[0.2]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5. PERKS ═══════════════════════════════════════════════════ */}
        {/* <section className="mt-10 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {perks.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-zinc-600" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-zinc-800 leading-tight">{title}</p>
                  <p className="text-[12px] text-zinc-400 leading-tight mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section> */}

      </div>
    </div>
  );
}
