import {
  ShieldCheck, Wrench, Truck, CheckCircle2,
  ChevronRight, Heart, Grid, List, RotateCcw,
  ChevronDown, ChevronLeft, SlidersHorizontal, X, Search,
  ArrowRight
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
// import componentsHeroImage from "../../assets/rtx_5090.png";
const componentsHeroImage = "/images/pc.png";
import AddToCartButton from "../../components/AddToCartButton";

/* ── TYPES ─────────────────────────────────────────────────────────── */
interface Product {
  name: string;
  specs: string;
  price: string;
  badge?: string;
  badgeColor?: string;
  image?: string;
  color?: string;
  category?: string;
}

/* ── DATA ──────────────────────────────────────────────────────────── */
const componentCategories = [
  { id: "ram",       label: "RAM",             glow: "rgba(167,139,250,0.35)", image: "ram.webp" },
  { id: "cpu",       label: "CPU / Vi Xử Lý",  glow: "rgba(56,189,248,0.25)", image: "cpu.webp" },
  { id: "vga",       label: "VGA / Card Màn",   glow: "rgba(249,115,22,0.30)", image: "gpu.webp" },
  { id: "mainboard", label: "Mainboard", glow: "rgba(5,150,105,0.30)", image: "main.jpg" },
  { id: "ssd",       label: "SSD / Ổ Cứng SSD", glow: "rgba(56,189,248,0.30)", image: "ssd.jpg" },
  { id: "hdd",       label: "HDD / Ổ Cứng HDD", glow: "rgba(107,114,128,0.25)", image: "hdd.jpg" },
  { id: "psu",       label: "PSU / Nguồn",        glow: "rgba(217,119,6,0.30)", image: "psu.webp" },
  { id: "cooling",   label: "Tản Nhiệt",        glow: "rgba(6,182,212,0.30)", image: "tannhiet.webp" },
  { id: "case",      label: "Case / Vỏ Máy",     glow: "rgba(68,64,60,0.40)", image: "case.webp" },
];

const defaultProducts: Product[] = [
  // --- RAM ---
  { name: "G.Skill Trident Z5 RGB", specs: "16GB (2x8GB) DDR5 6000MHz", price: "2.890.000đ", badge: "Mới", badgeColor: "#22c55e", color: "#e0e7ef", category: "RAM" },
  { name: "Corsair Vengeance RGB", specs: "16GB (2x8GB) DDR5 5600MHz", price: "2.290.000đ", badge: "Bán chạy", badgeColor: "#f97316", color: "#1a1a2e", category: "RAM" },
  { name: "Kingston Fury Beast DDR4", specs: "16GB (2x8GB) DDR4 3200MHz", price: "990.000đ", color: "#1a1a2e", category: "RAM" },
  { name: "G.Skill Ripjaws V DDR4", specs: "16GB (2x8GB) DDR4 3600MHz", price: "1.290.000đ", color: "#2d2d2d", category: "RAM" },
  { name: "Corsair Dominator Platinum", specs: "32GB (2x16GB) DDR5 6000MHz", price: "5.990.000đ", color: "#c8d0dc", category: "RAM" },
  { name: "Kingston Fury Beast DDR5", specs: "32GB (2x16GB) DDR5 6000MHz", price: "4.290.000đ", color: "#1a1a2e", category: "RAM" },

  // --- CPU ---
  { name: "Intel Core i5-14600K", specs: "14 Cores / 20 Threads up to 5.3GHz LGA1700", price: "7.890.000đ", badge: "Bán chạy", badgeColor: "#2563eb", color: "#1a1a2e", category: "CPU" },
  { name: "Intel Core i7-14700K", specs: "20 Cores / 28 Threads up to 5.6GHz LGA1700", price: "10.490.000đ", badge: "Hot", badgeColor: "#dc2626", color: "#1a1a2e", category: "CPU" },
  { name: "Intel Core i9-14900K", specs: "24 Cores / 32 Threads up to 6.0GHz LGA1700", price: "15.990.000đ", color: "#1a1a2e", category: "CPU" },
  { name: "AMD Ryzen 5 7600X", specs: "6 Cores / 12 Threads up to 5.3GHz AM5", price: "5.890.000đ", color: "#1f2937", category: "CPU" },
  { name: "AMD Ryzen 7 7800X3D", specs: "8 Cores / 16 Threads up to 5.0GHz 96MB AM5", price: "10.890.000đ", badge: "Cực hot", badgeColor: "#8b5cf6", color: "#1f2937", category: "CPU" },
  { name: "AMD Ryzen 9 7900X", specs: "12 Cores / 24 Threads up to 5.6GHz AM5", price: "11.490.000đ", color: "#1f2937", category: "CPU" },

  // --- VGA ---
  { name: "ASUS Dual GeForce RTX 4060 White", specs: "8GB GDDR6 / 128-bit / 2 Fan / White", price: "8.490.000đ", badge: "Mới", badgeColor: "#10b981", color: "#e0e7ef", category: "VGA" },
  { name: "MSI GeForce RTX 4060 VENTUS 2X", specs: "8GB GDDR6 / 128-bit / 2 Fan / Black", price: "8.590.000đ", badge: "Bán chạy", badgeColor: "#f97316", color: "#111", category: "VGA" },
  { name: "Gigabyte RTX 4070 SUPER EAGLE", specs: "12GB GDDR6X / 192-bit / 3 Fan", price: "19.490.000đ", color: "#c8d0dc", category: "VGA" },
  { name: "ASUS ROG Strix RTX 4080 SUPER", specs: "16GB GDDR6X / 256-bit / RGB", price: "34.990.000đ", color: "#2d2d2d", category: "VGA" },
  { name: "MSI GeForce RTX 4090 SUPRIM X", specs: "24GB GDDR6X / 384-bit / Premium Design", price: "64.990.000đ", color: "#cbd5e1", category: "VGA" },

  // --- Mainboard ---
  { name: "ASUS TUF GAMING B760M-PLUS", specs: "LGA1700 / DDR5 / Intel B760 Micro-ATX", price: "4.490.000đ", color: "#1f2937", category: "Mainboard" },
  { name: "ASUS ROG STRIX B760-F GAMING", specs: "LGA1700 / DDR5 / Intel Chipset B760 ATX", price: "5.490.000đ", color: "#2d2d2d", category: "Mainboard" },
  { name: "Gigabyte Z790 AORUS ELITE AX", specs: "LGA1700 / DDR5 / Intel Chipset Z790 ATX", price: "7.990.000đ", badge: "Cao cấp", badgeColor: "#d97706", color: "#374151", category: "Mainboard" },
  { name: "MSI MAG B650 TOMAHAWK WIFI", specs: "Socket AM5 / DDR5 / AMD Chipset B650 ATX", price: "5.890.000đ", color: "#1a1a2e", category: "Mainboard" },
  { name: "ASUS ROG CROSSHAIR X670E HERO", specs: "Socket AM5 / DDR5 / AMD Chipset X670E ATX", price: "18.990.000đ", color: "#2d2d2d", category: "Mainboard" },

  // --- SSD ---
  { name: "Samsung 990 Pro 1TB NVMe", specs: "PCIe Gen 4.0 x4 M.2 2280 up to 7450MB/s", price: "2.990.000đ", badge: "Cực nhanh", badgeColor: "#2563eb", color: "#1e40af", category: "SSD" },
  { name: "Crucial P3 Plus 2TB NVMe", specs: "PCIe Gen 4.0 x4 M.2 2280 up to 5000MB/s", price: "3.290.000đ", color: "#38bdf8", category: "SSD" },
  { name: "Kingston NV2 500GB NVMe", specs: "PCIe Gen 4.0 x4 M.2 2280 up to 3500MB/s", price: "1.190.000đ", color: "#111827", category: "SSD" },
  { name: "Samsung 980 500GB NVMe", specs: "PCIe Gen 3.0 x4 M.2 2280 up to 3100MB/s", price: "1.490.000đ", color: "#1e40af", category: "SSD" },
  { name: "Western Digital Blue 1TB SATA III", specs: "2.5\" SSD read up to 560MB/s", price: "1.990.000đ", color: "#1f2937", category: "SSD" },

  // --- HDD ---
  { name: "Seagate Barracuda 2TB HDD", specs: "3.5\" SATA 3 7200RPM 256MB Cache", price: "1.590.000đ", color: "#374151", category: "HDD" },
  { name: "Western Digital Blue 1TB HDD", specs: "3.5\" SATA 3 7200RPM 64MB Cache", price: "1.190.000đ", color: "#1f2937", category: "HDD" },
  { name: "Seagate IronWolf 4TB NAS", specs: "3.5\" SATA 3 5900RPM 64MB Cache", price: "3.490.000đ", badge: "Dành cho NAS", badgeColor: "#2563eb", color: "#374151", category: "HDD" },
  { name: "Western Digital Red Pro 8TB NAS", specs: "3.5\" SATA 3 7200RPM 256MB Cache", price: "7.290.000đ", color: "#1f2937", category: "HDD" },

  // --- PSU ---
  { name: "Corsair RM750e 750W", specs: "750 Watt / 80 Plus Gold / Full Modular / ATX", price: "2.890.000đ", badge: "Bán chạy", badgeColor: "#f97316", color: "#78350f", category: "PSU" },
  { name: "MSI MAG A650BN 650W", specs: "650 Watt / 80 Plus Bronze / Non-Modular", price: "1.390.000đ", color: "#1a1a2e", category: "PSU" },
  { name: "ASUS ROG THOR 850P 850W", specs: "850 Watt / 80 Plus Platinum / OLED Screen", price: "6.490.000đ", badge: "Cao cấp", badgeColor: "#8b5cf6", color: "#2d2d2d", category: "PSU" },
  { name: "Corsair RM1000x 1000W", specs: "1000 Watt / 80 Plus Gold / Full Modular", price: "4.890.000đ", color: "#78350f", category: "PSU" },

  // --- Cooling ---
  { name: "Thermalright Peerless Assassin 120", specs: "Dual Fan Air Cooler / 6 Heatpipes / Black", price: "990.000đ", color: "#164e63", category: "Cooling" },
  { name: "Corsair iCUE H150i Elite White", specs: "360mm AIO Liquid Cooler / White Design / ARGB", price: "5.490.000đ", badge: "ARGB", badgeColor: "#ec4899", color: "#e0e7ef", category: "Cooling" },
  { name: "Lian Li Galahad II Trinity 360", specs: "360mm AIO Liquid Cooler / ARGB / Black", price: "4.190.000đ", color: "#1c1917", category: "Cooling" },
  { name: "Noctua NH-D15", specs: "Premium Dual-Tower Air Cooler / Quiet / Brown", price: "2.890.000đ", color: "#78350f", category: "Cooling" },

  // --- Case ---
  { name: "Lian Li O11 Dynamic EVO", specs: "Mid Tower Case / Dual Chamber / White", price: "4.290.000đ", badge: "Hot", badgeColor: "#8b5cf6", color: "#e0e7ef", category: "Case" },
  { name: "Corsair 4000D Airflow", specs: "Mid Tower Case / High-Airflow / Black", price: "2.190.000đ", color: "#111", category: "Case" },
  { name: "NZXT H9 Flow", specs: "Dual-Chamber Mid Tower / Glass Panel / Black", price: "4.490.000đ", color: "#1c1917", category: "Case" },
  { name: "ASUS ROG Hyperion GR701", specs: "Flagship Full Tower / E-ATX / RGB / Black", price: "10.990.000đ", color: "#2d2d2d", category: "Case" },

  // --- Extra RAM ---
  { name: "G.Skill Ripjaws S5", specs: "32GB (2x16GB) DDR5 5600MHz", price: "3.490.000đ", color: "#2d2d2d", category: "RAM" },
  { name: "Kingston Fury Renegade", specs: "32GB (2x16GB) DDR5 6400MHz", price: "4.990.000đ", badge: "Mới", badgeColor: "#22c55e", color: "#1a1a2e", category: "RAM" },

  // --- Extra CPU ---
  { name: "Intel Core i3-14100", specs: "4 Cores / 8 Threads up to 4.7GHz LGA1700", price: "3.290.000đ", color: "#1a1a2e", category: "CPU" },
  { name: "AMD Ryzen 5 7600", specs: "6 Cores / 12 Threads up to 5.1GHz AM5", price: "5.290.000đ", color: "#1f2937", category: "CPU" },

  // --- Extra VGA ---
  { name: "ASUS TUF RTX 4070 Ti SUPER", specs: "16GB GDDR6X / 256-bit / 3 Fan", price: "24.990.000đ", badge: "Cao cấp", badgeColor: "#d97706", color: "#2d2d2d", category: "VGA" },
  { name: "Gigabyte RX 7600 XT GAMING OC", specs: "16GB GDDR6 / 128-bit / 3 Fan", price: "9.990.000đ", color: "#c8d0dc", category: "VGA" },

  // --- Extra Mainboard ---
  { name: "MSI PRO Z790-P WIFI", specs: "LGA1700 / DDR5 / Intel Chipset Z790 ATX", price: "6.290.000đ", color: "#1a1a2e", category: "Mainboard" },
  { name: "Gigabyte B650M AORUS ELITE AX", specs: "Socket AM5 / DDR5 / AMD Chipset B650 Micro-ATX", price: "5.190.000đ", color: "#374151", category: "Mainboard" },

  // --- Extra SSD ---
  { name: "Samsung 980 Pro 2TB NVMe", specs: "PCIe Gen 4.0 x4 M.2 2280 up to 7000MB/s", price: "4.590.000đ", badge: "Bán chạy", badgeColor: "#f97316", color: "#1e40af", category: "SSD" },
  { name: "Kingston NV2 2TB NVMe", specs: "PCIe Gen 4.0 x4 M.2 2280 up to 3500MB/s", price: "3.390.000đ", color: "#111827", category: "SSD" },

  // --- Extra HDD ---
  { name: "Western Digital Purple 4TB", specs: "3.5\" SATA 3 5400RPM 64MB Cache", price: "2.990.000đ", color: "#1f2937", category: "HDD" },
  { name: "Seagate IronWolf Pro 12TB NAS", specs: "3.5\" SATA 3 7200RPM 256MB Cache", price: "9.490.000đ", color: "#374151", category: "HDD" },

  // --- Extra PSU ---
  { name: "ASUS ROG Strix 750W Gold", specs: "750 Watt / 80 Plus Gold / Full Modular", price: "3.290.000đ", color: "#2d2d2d", category: "PSU" },
  { name: "MSI MAG A850GL 850W", specs: "850 Watt / 80 Plus Gold / Full Modular / ATX 3.0", price: "3.390.000đ", color: "#1a1a2e", category: "PSU" },

  // --- Extra Cooling ---
  { name: "Deepcool AK400 Digital", specs: "Single Fan Air Cooler / Digital Screen / Black", price: "850.000đ", color: "#164e63", category: "Cooling" },
  { name: "NZXT Kraken 360 RGB", specs: "360mm AIO Liquid Cooler / LCD Screen / Black", price: "6.290.000đ", badge: "Màn hình LCD", badgeColor: "#8b5cf6", color: "#1c1917", category: "Cooling" },

  // --- Extra Case ---
  { name: "NZXT H5 Flow", specs: "Compact Mid Tower / High-Airflow / Black", price: "2.390.000đ", color: "#1c1917", category: "Case" },
  { name: "Corsair 3000D RGB Airflow White", specs: "Mid Tower Case / 3x ARGB Fans / White", price: "2.290.000đ", color: "#e0e7ef", category: "Case" },

  // --- 10 more RAM ---
  { name: "Corsair Vengeance LPX DDR4 8G", specs: "8GB DDR4 3200MHz Black", price: "550.000đ", color: "#111", category: "RAM" },
  { name: "Corsair Vengeance LPX DDR4 16G", specs: "16GB (2x8GB) DDR4 3200MHz Black", price: "1.090.000đ", color: "#111", category: "RAM" },
  { name: "Kingston Fury Beast RGB DDR4", specs: "16GB (2x8GB) DDR4 3600MHz RGB", price: "1.390.000đ", color: "#1a1a2e", category: "RAM" },
  { name: "G.Skill Trident Z Royal Gold", specs: "16GB (2x8GB) DDR4 3600MHz Gold", price: "2.490.000đ", badge: "Premium", badgeColor: "#f59e0b", color: "#fca5a5", category: "RAM" },
  { name: "G.Skill Trident Z Royal Silver", specs: "32GB (2x16GB) DDR4 3600MHz Silver", price: "3.990.000đ", badge: "Premium", badgeColor: "#64748b", color: "#e2e8f0", category: "RAM" },
  { name: "TeamGroup T-Force Delta DDR5 16G", specs: "16GB (2x8GB) DDR5 5200MHz RGB", price: "1.990.000đ", color: "#111827", category: "RAM" },
  { name: "TeamGroup T-Force Delta DDR5 32G", specs: "32GB (2x16GB) DDR5 6000MHz RGB", price: "3.790.000đ", color: "#111827", category: "RAM" },
  { name: "Crucial Pro DDR5", specs: "32GB (2x16GB) DDR5 5600MHz Black", price: "2.690.000đ", color: "#1f2937", category: "RAM" },
  { name: "Corsair Dominator Titanium", specs: "32GB (2x16GB) DDR5 7200MHz White", price: "6.990.000đ", badge: "Siêu cấp", badgeColor: "#dc2626", color: "#e0e7ef", category: "RAM" },
  { name: "G.Skill Trident Z5 Neo", specs: "64GB (2x32GB) DDR5 6000MHz RGB", price: "6.490.000đ", color: "#2d2d2d", category: "RAM" },

  // --- 8 more CPU ---
  { name: "Intel Core i3-12100F", specs: "4 Cores / 8 Threads up to 4.3GHz LGA1700", price: "1.990.000đ", color: "#1a1a2e", category: "CPU" },
  { name: "Intel Core i5-12400F", specs: "6 Cores / 12 Threads up to 4.4GHz LGA1700", price: "3.490.000đ", badge: "Bán chạy", badgeColor: "#f97316", color: "#1a1a2e", category: "CPU" },
  { name: "Intel Core i5-13400F", specs: "10 Cores / 16 Threads up to 4.6GHz LGA1700", price: "4.990.000đ", color: "#1a1a2e", category: "CPU" },
  { name: "Intel Core i7-13700K", specs: "16 Cores / 24 Threads up to 5.4GHz LGA1700", price: "8.990.000đ", color: "#1a1a2e", category: "CPU" },
  { name: "AMD Ryzen 5 5600X", specs: "6 Cores / 12 Threads up to 4.6GHz AM4", price: "3.890.000đ", color: "#1f2937", category: "CPU" },
  { name: "AMD Ryzen 5 7600X", specs: "6 Cores / 12 Threads up to 5.3GHz AM5", price: "5.790.000đ", color: "#1f2937", category: "CPU" },
  { name: "AMD Ryzen 7 5700X", specs: "8 Cores / 16 Threads up to 4.6GHz AM4", price: "4.890.000đ", color: "#1f2937", category: "CPU" },
  { name: "AMD Ryzen 9 7950X", specs: "16 Cores / 32 Threads up to 5.7GHz AM5", price: "14.990.000đ", badge: "Flagship", badgeColor: "#8b5cf6", color: "#1f2937", category: "CPU" },

  // --- 8 more VGA ---
  { name: "MSI GTX 1650 D6 VENTUS XS", specs: "4GB GDDR6 / 128-bit / 2 Fan", price: "3.690.000đ", color: "#111", category: "VGA" },
  { name: "ASUS Dual Radeon RX 6600", specs: "8GB GDDR6 / 128-bit / 2 Fan", price: "5.990.000đ", color: "#2d2d2d", category: "VGA" },
  { name: "Gigabyte RTX 3060 WINDFORCE", specs: "12GB GDDR6 / 192-bit / 2 Fan", price: "7.990.000đ", color: "#c8d0dc", category: "VGA" },
  { name: "MSI RTX 4060 Ti GAMING X", specs: "8GB GDDR6 / 128-bit / Twin Frozr", price: "11.490.000đ", badge: "RGB", badgeColor: "#22c55e", color: "#111", category: "VGA" },
  { name: "Gigabyte RTX 4070 WINDFORCE", specs: "12GB GDDR6X / 192-bit / 3 Fan", price: "16.990.000đ", color: "#c8d0dc", category: "VGA" },
  { name: "ASUS TUF RTX 4070 Ti SUPER OC", specs: "16GB GDDR6X / 256-bit / 3 Fan", price: "25.990.000đ", color: "#2d2d2d", category: "VGA" },
  { name: "ASUS ROG Strix RTX 4090 OC", specs: "24GB GDDR6X / 384-bit / Flagship GPU", price: "69.990.000đ", badge: "Khủng", badgeColor: "#dc2626", color: "#cbd5e1", category: "VGA" },
  { name: "PowerColor Hellhound RX 7800 XT", specs: "16GB GDDR6 / 256-bit / Led Ice Blue", price: "14.490.000đ", color: "#1c1917", category: "VGA" }
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
  return parseInt(priceStr.replace(/\D/g, ''), 10) || 0;
}

function formatPrice(p: number) {
  return new Intl.NumberFormat("vi-VN").format(p) + " đ";
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

/* ── PRODUCT IMAGE ─────────────────────────────────────────────────── */
function ProductImage({
  src,
  alt,
  color = "#e5e7eb",
}: {
  src?: string;
  alt: string;
  color?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(src && !imageFailed);

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-xl flex items-center justify-center overflow-hidden bg-white"
      style={shouldShowImage
        ? { border: "1px solid #f1f5f9" }
        : { background: "#f8fafc", border: "1px solid #e5e7eb" }
      }
    >
      {shouldShowImage ? (
        <>
          <div
            className="absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-25"
            style={{ backgroundColor: color }}
          />
          <img
            src={src}
            alt={alt}
            className="absolute inset-2 m-auto max-w-[calc(100%-16px)] max-h-[calc(100%-16px)] object-contain"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        </>
      ) : (
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
      )}
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
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Set<string>>(new Set());
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

  const toggleLike = (name: string) => {
    setLiked(p => {
      const next = new Set(p);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 16;

  // Reset page when category or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCategory,
    selBrands,
    selCapacities,
    selTypes,
    selBuses,
    selSeries,
    selWattages,
    selSizes,
    minPrice,
    maxPrice
  ]);

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
    setSearchParams({ category: activeCategory }, { replace: true });
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
    setSearchParams(newParams, { replace: true });
  };
  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    resetFilters();
    setSearchParams({ category: catId }, { replace: true });
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

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  }, [filteredProducts.length]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

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
              setSearchParams(newParams, { replace: true });
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
              setSearchParams(newParams, { replace: true });
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
      <div 
        className="relative overflow-hidden" 
        style={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f0f6ff 40%, #e3effe 70%, #dceafd 100%)",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          marginTop: "-96px",
          paddingTop: "96px",
          paddingLeft: "calc(50vw - 50%)",
          paddingRight: "calc(50vw - 50%)",
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

        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" style={{ minHeight: "calc(100vh - 96px)" }}>

            {/* Left */}
            <motion.div variants={heroContainer} initial="hidden" animate="show" className="max-w-2xl flex flex-col items-start justify-center pr-8 py-12 relative z-10">
              <motion.div variants={heroItem}>
                <span className="inline-block px-3 py-1 bg-white/70 text-zinc-500 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-6 border border-zinc-200/60">
                  Linh kiện chính hãng
                </span>
              </motion.div>
              <motion.h1 variants={heroItem} className="text-[3.1rem] md:text-[4.2rem] lg:text-[4.35rem] font-bold tracking-tight text-zinc-900 leading-[1.08] mb-6">
                Linh kiện PC<br /><span className="whitespace-nowrap">cho mọi cấu hình.</span>
              </motion.h1>
              <motion.p variants={heroItem} className="text-[17px] text-zinc-500 leading-relaxed mb-10">
                Đa dạng linh kiện chính hãng, chất lượng cao.<br />
                Tương thích tối ưu – Bền bỉ – Hiệu suất vượt trội.
              </motion.p>
              <motion.div variants={heroItem} className="flex flex-row gap-3 mb-12">
                <button
                  onClick={() => {
                    document
                      .getElementById("danh-muc-linh-kien")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1d1d1f] hover:bg-zinc-800 text-white text-[15px] font-semibold rounded-full transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
                >
                  Xem linh kiện <ArrowRight className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/80 border border-zinc-300 hover:bg-white text-zinc-800 text-[15px] font-semibold rounded-full transition-all duration-200 shadow-sm active:scale-95 cursor-pointer">
                  Hướng dẫn build PC <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Mini perks */}
              <motion.div variants={heroItem} className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-7 border-t border-zinc-300/40 w-full">
                {perks.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-zinc-700 shrink-0" strokeWidth={1.8} />
                    <span className="text-[13px] text-zinc-700 leading-tight whitespace-pre-line font-semibold">{title}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — components hero image */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-center"
              style={{ alignSelf: "stretch" }}
            >
              {/* Blue glow behind PC */}
              <div style={{
                position: "absolute",
                width: 600, height: 600,
                background: "radial-gradient(circle, rgba(147,197,253,0.3) 0%, rgba(165,180,252,0.1) 50%, transparent 70%)",
                top: "50%", left: "50%", transform: "translate(-48%, -50%)",
                pointerEvents: "none",
                zIndex: 0,
              }} />
              
              {/* Floor reflection */}
              <div style={{
                position: "absolute",
                width: 500, height: 60,
                background: "radial-gradient(ellipse, rgba(120,170,250,0.2) 0%, transparent 70%)",
                bottom: "18%", left: "50%", transform: "translateX(-48%)",
                pointerEvents: "none",
                zIndex: 1,
              }} />

              <motion.img
                src={componentsHeroImage}
                alt="Linh kiện PC"
                initial={{ opacity: 0, y: 32, scale: 1.1 }}
                animate={{ opacity: 1, y: 0, scale: 1.5 }}
                transition={{ type: "spring", stiffness: 150, damping: 14, delay: 0.38 }}
                className="relative z-10 w-[580px] max-w-full object-contain drop-shadow-2xl"
              />
            </motion.div>

          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ════════════════════════════════════════════════ */}
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 mt-10">

        {/* ══ 2. CATEGORY NAV ═══════════════════════════════════════════ */}
        <section id="danh-muc-linh-kien" className="scroll-mt-28 mb-10">
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
                  className="w-full aspect-[4/3] relative flex items-center justify-center overflow-hidden"
                  style={{
                    // background: `linear-gradient(135deg, ${cat.from} 0%, ${cat.to} 100%)`,
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(circle at 30% 30%, ${cat.glow} 0%, transparent 65%)`,
                    pointerEvents: "none",
                  }} />
                  {cat.image && (
                    <img
                      src={`${API_BASE}/images/linh-kien/${cat.image}`}
                      alt={cat.label}
                      className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  )}
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
          <main id="components-grid-top" className="flex-1 min-w-0">
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
                {paginatedProducts.map((p, i) => (
                  viewMode === "grid" ? (
                    <div
                      key={i}
                      onClick={() => navigate(`/san-pham/component-${p.category || "linh-kien"}-${p.name}`)}
                      className="group bg-white rounded-2xl border border-zinc-100 p-3.5 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-col relative cursor-pointer"
                    >
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
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(p.name);
                        }}
                        className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-zinc-100 shadow-sm hover:bg-white transition-colors cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${liked.has(p.name) ? "fill-red-500 text-red-500" : "text-zinc-300"}`} />
                      </button>
                      <ProductImage src={p.image} alt={p.name} color={p.color} />
                      {/* Info */}
                      <div className="mt-3 flex flex-col flex-1">
                        <h3 className="text-[13px] font-bold text-zinc-900 leading-tight mb-1 line-clamp-2">{p.name}</h3>
                        <p className="text-[11.5px] text-zinc-400 mb-3 flex-1">{p.specs}</p>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[14px] font-extrabold text-zinc-900">{p.price}</p>
                          <AddToCartButton
                            product={{
                              id: `component-${p.category || "linh-kien"}-${p.name}`,
                              name: p.name,
                              specs: p.specs,
                              price: p.price,
                              image: p.image,
                              category: p.category || "Linh kiện",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={i}
                      onClick={() => navigate(`/san-pham/component-${p.category || "linh-kien"}-${p.name}`)}
                      className="group bg-white rounded-xl border border-zinc-100 p-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 relative cursor-pointer"
                    >
                      <div className="w-20 h-16 shrink-0">
                        <ProductImage src={p.image} alt={p.name} color={p.color} />
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
                      <AddToCartButton
                        product={{
                          id: `component-${p.category || "linh-kien"}-${p.name}`,
                          name: p.name,
                          specs: p.specs,
                          price: p.price,
                          image: p.image,
                          category: p.category || "Linh kiện",
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(p.name);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${liked.has(p.name) ? "fill-red-500 text-red-500" : "text-zinc-300"}`} />
                      </button>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    document.getElementById("components-grid-top")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 transition-colors ${
                    currentPage === 1 ? "text-zinc-350 cursor-not-allowed" : "text-zinc-650 hover:bg-zinc-50 cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        document.getElementById("components-grid-top")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-zinc-900 text-white"
                          : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
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
                    document.getElementById("components-grid-top")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 transition-colors ${
                    currentPage === totalPages ? "text-zinc-350 cursor-not-allowed" : "text-zinc-650 hover:bg-zinc-50 cursor-pointer"
                  }`}
                >
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
