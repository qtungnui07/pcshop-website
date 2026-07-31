import {
  GraduationCap, Briefcase, Gamepad2, Palette, Feather, BatteryFull,
  ChevronRight, Heart, Grid, List, RotateCcw,
  ShieldCheck, Truck, CheckCircle2, ChevronDown,
  SlidersHorizontal, X, Search, ArrowRight,
} from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddToCartButton from "../../components/AddToCartButton";
import { ProductSkeletonGrid } from "../../components/ui/skeleton";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MACBOOK_NEO_MODEL = "/models/macbook-neo.glb";

function MacBookNeoViewer() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    let cancelled = false;
    let frameId = 0;
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const modelRoot = new THREE.Group();
    const clock = new THREE.Clock();
    const animationDuration = 3.2;

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    camera.position.set(0.25, 1.05, 6.8);
    camera.lookAt(0, 0, 0);
    scene.add(modelRoot);
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(3.2, 5, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9fc5ff, 1.5);
    fillLight.position.set(-4, 2.5, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    new GLTFLoader().load(
      MACBOOK_NEO_MODEL,
      (gltf) => {
        if (cancelled) return;

        const model = gltf.scene;
        const fittedModel = new THREE.Group();
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        const scale = 3.45 / maxAxis;

        model.position.sub(center);
        fittedModel.add(model);
        fittedModel.scale.setScalar(scale);
        fittedModel.rotation.set(-0.08, 0, 0);
        modelRoot.add(fittedModel);
        modelRoot.position.set(0.05, 0.05, 0);
        setLoaded(true);

        const animate = () => {
          if (cancelled) return;

          const elapsed = clock.getElapsedTime();
          const t = Math.min(elapsed / animationDuration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          modelRoot.rotation.y = Math.PI * 2 * (1 - eased);

          renderer.render(scene, camera);
          if (t < 1) {
            frameId = window.requestAnimationFrame(animate);
          }
        };

        animate();
      },
      undefined,
      () => {
        if (!cancelled) setFailed(true);
      }
    );

    return () => {
      cancelled = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material?.dispose?.());
      });
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="relative z-10 w-full h-[min(58vh,620px)] min-h-[440px] overflow-hidden">
      {!loaded && !failed && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-zinc-500">
          3D model unavailable
        </div>
      )}
      <div
        ref={mountRef}
        aria-label="MacBook Neo 3D model"
        className={`h-full w-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <a
        href="https://sketchfab.com/3d-models/macbook-neo-266970634d9a435fa4589efe326b25d6"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-4 right-4 z-30 rounded-full bg-white/75 px-3 py-1 text-[11px] font-semibold text-zinc-500 shadow-sm backdrop-blur transition hover:bg-white hover:text-zinc-800"
      >
        MacBook Neo by rtql8d
      </a>
    </div>
  );
}


type LaptopBrand = "ASUS" | "Apple" | "Dell" | "Lenovo" | "HP" | "Acer" | "MSI" | "Gigabyte";
type LaptopCPU =
  | "Intel Core i3" | "Intel Core i5" | "Intel Core i7" | "Intel Core i9"
  | "Intel Core Ultra 5" | "Intel Core Ultra 7" | "Intel Core Ultra 9"
  | "AMD Ryzen 5" | "AMD Ryzen 7" | "AMD Ryzen 9"
  | "AMD Ryzen AI 7" | "AMD Ryzen AI 9"
  | "Apple M Series";
type LaptopRAM = "8GB" | "16GB" | "32GB" | "64GB";
type LaptopScreen =
  | "14 inch" | "15.6 inch" | "16 inch trở lên" | "17.3 inch"
  | "60Hz" | "120Hz" | "144Hz" | "165Hz" | "240Hz"
  | "Màn hình OLED" | "Màn hình Mini-LED" | "Màn hình cảm ứng";
type LaptopGPU =
  | "Intel Iris Xe" | "AMD Radeon" | "Intel Arc Graphics"
  | "NVIDIA RTX 3050" | "NVIDIA RTX 4050"
  | "NVIDIA RTX 4060" | "NVIDIA RTX 4070" | "NVIDIA RTX 4080" | "NVIDIA RTX 4090"
  | "NVIDIA RTX 5060" | "NVIDIA RTX 5070" | "NVIDIA RTX 5080" | "NVIDIA RTX 5090"
  | "AMD Radeon RX 7000";

interface LaptopProduct {
  id: string;
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


const categories = [
  {
    icon: GraduationCap,
    title: "Học tập",
    desc: "Nhẹ, pin lâu, hiệu năng ổn định",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
    filterBrands: ["Lenovo", "Acer", "HP"] as LaptopBrand[],
  },
  {
    icon: Briefcase,
    title: "Văn phòng",
    desc: "Linh hoạt, bền bỉ, xử lý mượt mà",
    img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=800&auto=format&fit=crop",
    filterBrands: ["Dell", "Lenovo", "HP"] as LaptopBrand[],
  },
  {
    icon: Gamepad2,
    title: "Gaming",
    desc: "Hiệu năng mạnh mẽ, trải nghiệm đỉnh cao",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    filterBrands: ["ASUS", "MSI", "Acer"] as LaptopBrand[],
  },
  {
    icon: Palette,
    title: "Đồ họa - Sáng tạo",
    desc: "Màn hình đẹp, hiệu năng xử lý vượt trội",
    img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    filterBrands: ["Apple", "ASUS", "Dell"] as LaptopBrand[],
  },
  {
    icon: Feather,
    title: "Mỏng nhẹ",
    desc: "Thiết kế mỏng nhẹ, di chuyển dễ dàng",
    img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
    filterBrands: ["Apple", "Dell", "Lenovo"] as LaptopBrand[],
  },
  {
    icon: BatteryFull,
    title: "Pin lâu",
    desc: "Làm việc cả ngày không lo hết pin",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    filterBrands: ["Apple", "Lenovo", "HP"] as LaptopBrand[],
  },
];

const perks = [
  { icon: ShieldCheck,  title: "Bảo hành chính hãng", desc: "An tâm sử dụng dài lâu" },
  { icon: RotateCcw,    title: "Trả góp 0%",           desc: "Linh hoạt, dễ dàng" },
  { icon: Truck,        title: "Miễn phí vận chuyển",  desc: "Giao hàng toàn quốc" },
  { icon: CheckCircle2, title: "Tư vấn tận tâm",       desc: "Hỗ trợ 24/7" },
];

const BRANDS: LaptopBrand[]   = ["ASUS", "Apple", "Dell", "Lenovo", "HP", "Acer", "MSI", "Gigabyte"];
const RAMS:   LaptopRAM[]     = ["8GB", "16GB", "32GB", "64GB"];
const CPUS:   LaptopCPU[]     = [
  "Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9",
  "Intel Core Ultra 5", "Intel Core Ultra 7", "Intel Core Ultra 9",
  "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9",
  "AMD Ryzen AI 7", "AMD Ryzen AI 9",
  "Apple M Series",
];
const SCREENS: LaptopScreen[] = [
  "14 inch", "15.6 inch", "16 inch trở lên", "17.3 inch",
  "60Hz", "120Hz", "144Hz", "165Hz", "240Hz",
  "Màn hình OLED", "Màn hình Mini-LED", "Màn hình cảm ứng",
];
const GPUS:   LaptopGPU[]     = [
  "Intel Iris Xe", "Intel Arc Graphics",
  "AMD Radeon", "AMD Radeon RX 7000",
  "NVIDIA RTX 3050", "NVIDIA RTX 4050",
  "NVIDIA RTX 4060", "NVIDIA RTX 4070", "NVIDIA RTX 4080", "NVIDIA RTX 4090",
  "NVIDIA RTX 5060", "NVIDIA RTX 5070", "NVIDIA RTX 5080", "NVIDIA RTX 5090",
];

const MAX_PRICE = 55_000_000;
const MIN_PRICE = 0;


function formatPrice(p: number) {
  return new Intl.NumberFormat("vi-VN").format(p) + " đ";
}

function toggleSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}


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

function parseLaptopProduct(raw: any, index: number): LaptopProduct {
  const priceVal = parseInt(raw.price?.toString().replace(/[^\d]/g, ""), 10) || 0;
  const specsStr = raw.specs || "";
  const nameLower = (raw.name || "").toLowerCase();

  let brandVal: LaptopBrand = "ASUS";
  if (raw.brand && ["ASUS", "Apple", "Dell", "Lenovo", "HP", "Acer", "MSI"].includes(raw.brand)) {
    brandVal = raw.brand as LaptopBrand;
  } else {
    if (nameLower.includes("asus")) brandVal = "ASUS";
    else if (nameLower.includes("macbook") || nameLower.includes("apple")) brandVal = "Apple";
    else if (nameLower.includes("dell")) brandVal = "Dell";
    else if (nameLower.includes("lenovo") || nameLower.includes("thinkpad")) brandVal = "Lenovo";
    else if (nameLower.includes("hp") || nameLower.includes("spectre") || nameLower.includes("omen")) brandVal = "HP";
    else if (nameLower.includes("acer") || nameLower.includes("swift")) brandVal = "Acer";
    else if (nameLower.includes("msi") || nameLower.includes("stealth")) brandVal = "MSI";
  }

  let ramVal: LaptopRAM = "16GB";
  if (specsStr.includes("32GB")) ramVal = "32GB";
  else if (specsStr.includes("8GB")) ramVal = "8GB";

  let cpuVal: LaptopCPU = "Intel Core i7";
  const specsUpper = specsStr.toUpperCase();
  if (specsStr.includes("M4") || specsStr.includes("M3 Pro") || specsStr.includes("M3")) cpuVal = "Apple M Series";
  else if (specsStr.includes("M2")) cpuVal = "Apple M Series";
  else if (specsStr.includes("M1")) cpuVal = "Apple M Series";
  else if (specsUpper.includes("ULTRA 9") || specsStr.includes("285K") || specsStr.includes("275HX")) cpuVal = "Intel Core Ultra 9";
  else if (specsUpper.includes("ULTRA 7") || specsStr.includes("265HX") || specsStr.includes("258V")) cpuVal = "Intel Core Ultra 7";
  else if (specsUpper.includes("ULTRA 5") || specsStr.includes("225H")) cpuVal = "Intel Core Ultra 5";
  else if (specsStr.includes("i9") || specsStr.includes("14900") || specsStr.includes("13900") || specsStr.includes("12900")) cpuVal = "Intel Core i9";
  else if (specsStr.includes("i7") || specsStr.includes("13700") || specsStr.includes("12700")) cpuVal = "Intel Core i7";
  else if (specsStr.includes("i5") || specsStr.includes("125H") || specsStr.includes("13500")) cpuVal = "Intel Core i5";
  else if (specsStr.includes("i3")) cpuVal = "Intel Core i3";
  else if (specsStr.includes("Ryzen AI 9") || specsUpper.includes("HX 370")) cpuVal = "AMD Ryzen AI 9";
  else if (specsStr.includes("Ryzen AI 7") || specsUpper.includes("PRO 360")) cpuVal = "AMD Ryzen AI 7";
  else if (specsStr.includes("Ryzen 9")) cpuVal = "AMD Ryzen 9";
  else if (specsStr.includes("Ryzen 7")) cpuVal = "AMD Ryzen 7";
  else if (specsStr.includes("Ryzen 5")) cpuVal = "AMD Ryzen 5";

  let gpuVal: LaptopGPU = "Intel Iris Xe";
  if (specsStr.includes("5090")) gpuVal = "NVIDIA RTX 5090";
  else if (specsStr.includes("5080")) gpuVal = "NVIDIA RTX 5080";
  else if (specsStr.includes("5070")) gpuVal = "NVIDIA RTX 5070";
  else if (specsStr.includes("5060")) gpuVal = "NVIDIA RTX 5060";
  else if (specsStr.includes("4090")) gpuVal = "NVIDIA RTX 4090";
  else if (specsStr.includes("4080")) gpuVal = "NVIDIA RTX 4080";
  else if (specsStr.includes("4070")) gpuVal = "NVIDIA RTX 4070";
  else if (specsStr.includes("4060")) gpuVal = "NVIDIA RTX 4060";
  else if (specsStr.includes("4050")) gpuVal = "NVIDIA RTX 4050";
  else if (specsStr.includes("3050")) gpuVal = "NVIDIA RTX 3050";
  else if (specsStr.toLowerCase().includes("arc")) gpuVal = "Intel Arc Graphics";
  else if (specsStr.toLowerCase().includes("radeon")) gpuVal = "AMD Radeon";

  let screenVal: LaptopScreen = "14 inch";
  if (specsStr.includes('17.3"') || specsStr.includes('17.3 inch') || specsStr.includes('18"')) screenVal = "17.3 inch";
  else if (specsStr.includes('15.6"') || specsStr.includes('15.6 inch')) screenVal = "15.6 inch";
  else if (specsStr.includes('16"') || specsStr.includes('16 inch') || specsStr.includes('16.1"')) screenVal = "16 inch trở lên";
  else if (specsStr.includes('14"') || specsStr.includes('14 inch')) screenVal = "14 inch";
  
  if (specsUpper.includes("240HZ") || specsStr.includes("240Hz")) screenVal = "240Hz";
  else if (specsUpper.includes("165HZ") || specsStr.includes("165Hz")) screenVal = "165Hz";
  else if (specsUpper.includes("144HZ") || specsStr.includes("144Hz")) screenVal = "144Hz";
  else if (specsUpper.includes("120HZ") || specsStr.includes("120Hz")) screenVal = "120Hz";
  
  if (specsUpper.includes("OLED") && !specsUpper.includes("MINI-LED")) screenVal = "Màn hình OLED";
  else if (specsUpper.includes("MINI-LED") || specsUpper.includes("MINILED")) screenVal = "Màn hình Mini-LED";
  else if (specsUpper.includes("TOUCH") || specsStr.includes("cảm ứng") || specsStr.includes("Touch")) screenVal = "Màn hình cảm ứng";

  return {
    id: String(raw.id || `laptop-${index + 1}`),
    brand: brandVal,
    name: raw.name || "",
    cpu: cpuVal,
    ram: ramVal,
    screen: screenVal,
    gpu: gpuVal,
    specs: specsStr,
    price: priceVal,
    badge: raw.badge || undefined,
    img: raw.image || raw.img || ""
  };
}


export default function LaptopIndex() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const API_BASE =
    typeof window !== "undefined"
      ? (window.location.hostname.includes("qtitpc.dev")
        ? "https://api-pc.qtitpc.dev"
        : `${window.location.protocol}//${window.location.hostname}:3001`)
      : "http://localhost:3001";

  const [products, setProducts] = useState<LaptopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/laptops`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const parsed = data.map((item, idx) => parseLaptopProduct(item, idx));
          setProducts(parsed);
        }
      })
      .catch((err) => console.error("Error fetching laptops from backend:", err))
      .finally(() => setLoading(false));
  }, []);

  const [liked, setLiked] = useState<Set<any>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  
  const [selBrands,  setSelBrands]  = useState<Set<LaptopBrand>>(new Set());
  const [selRAMs,    setSelRAMs]    = useState<Set<LaptopRAM>>(new Set());
  const [selCPUs,    setSelCPUs]    = useState<Set<LaptopCPU>>(new Set());
  const [selScreens, setSelScreens] = useState<Set<LaptopScreen>>(new Set());
  const [selGPUs,    setSelGPUs]    = useState<Set<LaptopGPU>>(new Set());
  const [minPrice,   setMinPrice]   = useState(MIN_PRICE);
  const [maxPrice,   setMaxPrice]   = useState(MAX_PRICE);
  const [activeInput, setActiveInput] = useState<'min' | 'max'>('min');

  
  useEffect(() => {
    const filter = searchParams.get('filter');
    const brandParam = searchParams.get('thuong-hieu');
    const priceParam = searchParams.get('price');
    const gpuParam = searchParams.get('card-do-hoa-vga');
    const cpuParam = searchParams.get('vi-xu-ly-cpu');
    const ramParam = searchParams.get('dung-luong-ram') || searchParams.get('ram-o-cung') || searchParams.get('ram');
    const screenParam = searchParams.get('man-hinh');

    const newBrands = new Set<LaptopBrand>();
    const newGPUs = new Set<LaptopGPU>();
    const newCPUs = new Set<LaptopCPU>();
    const newRAMs = new Set<LaptopRAM>();
    const newScreens = new Set<LaptopScreen>();
    let newMinPrice = MIN_PRICE;
    let newMaxPrice = MAX_PRICE;
    let newCatIdx: number | null = null;

    if (filter) {
      const filterMap: Record<string, { brands: LaptopBrand[]; catIdx: number }> = {
        'laptop-gaming': { brands: ['ASUS', 'MSI', 'Acer'], catIdx: 2 },
        'laptop-van-phong': { brands: ['Dell', 'Lenovo', 'HP'], catIdx: 1 },
        'laptop-do-hoa': { brands: ['Apple', 'ASUS', 'Dell'], catIdx: 3 },
        'laptop-hoc-tap': { brands: ['Lenovo', 'Acer', 'HP'], catIdx: 0 },
        'laptop-mong-nhe': { brands: ['Apple', 'Dell', 'ASUS'], catIdx: 4 },
        'laptop-pin-lau': { brands: ['Apple', 'Lenovo', 'HP'], catIdx: 5 },
        'macbook': { brands: ['Apple'], catIdx: -1 },
      };
      const matched = filterMap[filter];
      if (matched) {
        matched.brands.forEach(b => newBrands.add(b));
        if (matched.catIdx >= 0) newCatIdx = matched.catIdx;
      }
    }

    if (brandParam) {
      const brandMap: Record<string, LaptopBrand> = {
        'asus-rog': 'ASUS', 'asus-tuf': 'ASUS', 'asus-vivobook': 'ASUS', 'asus-zenbook': 'ASUS',
        'msi-katana': 'MSI', 'msi-cyborg': 'MSI', 'msi-stealth': 'MSI', 'msi-pulse': 'MSI',
        'acer-nitro': 'Acer', 'acer-predator': 'Acer', 'acer-swift': 'Acer', 'acer-aspire': 'Acer',
        'lenovo-legion': 'Lenovo', 'lenovo-loq': 'Lenovo', 'lenovo-thinkpad': 'Lenovo', 'lenovo-yoga': 'Lenovo', 'lenovo-ideapad': 'Lenovo',
        'dell-alienware': 'Dell', 'dell-xps': 'Dell', 'dell-inspiron': 'Dell',
        'hp-omen': 'HP', 'hp-victus': 'HP', 'hp-pavilion': 'HP', 'hp-spectre': 'HP',
        'gigabyte-gamer': 'Gigabyte',
        'apple-macbook-pro': 'Apple', 'apple-macbook-air': 'Apple',
      };
      if (brandMap[brandParam]) {
        newBrands.add(brandMap[brandParam]);
      } else {
        const bp = brandParam.toLowerCase();
        if (bp.startsWith('asus')) newBrands.add('ASUS');
        else if (bp.startsWith('msi')) newBrands.add('MSI');
        else if (bp.startsWith('acer')) newBrands.add('Acer');
        else if (bp.startsWith('lenovo')) newBrands.add('Lenovo');
        else if (bp.startsWith('dell')) newBrands.add('Dell');
        else if (bp.startsWith('hp')) newBrands.add('HP');
        else if (bp.startsWith('gigabyte')) newBrands.add('Gigabyte');
        else if (bp.startsWith('apple') || bp.startsWith('macbook')) newBrands.add('Apple');
      }
    }

    if (priceParam) {
      const parts = priceParam.split('-');
      if (parts.length === 2) {
        const min = parseInt(parts[0], 10);
        const max = parseInt(parts[1], 10);
        if (!isNaN(min) && !isNaN(max)) {
          newMinPrice = min;
          newMaxPrice = Math.min(max, MAX_PRICE);
        }
      }
    }

    if (gpuParam) {
      const gpuMap: Record<string, LaptopGPU> = {
        'nvidia-rtx-5090': 'NVIDIA RTX 5090',
        'nvidia-rtx-5080': 'NVIDIA RTX 5080',
        'nvidia-rtx-5070': 'NVIDIA RTX 5070',
        'nvidia-rtx-5060': 'NVIDIA RTX 5060',
        'nvidia-rtx-4090': 'NVIDIA RTX 4090',
        'nvidia-rtx-4080': 'NVIDIA RTX 4080',
        'nvidia-rtx-4070': 'NVIDIA RTX 4070',
        'nvidia-rtx-4060': 'NVIDIA RTX 4060',
        'nvidia-rtx-4050': 'NVIDIA RTX 4050',
        'nvidia-rtx-3050': 'NVIDIA RTX 3050',
        'amd-radeon-rx-7000': 'AMD Radeon RX 7000',
        'intel-arc-graphics': 'Intel Arc Graphics',
        'intel-iris-xe-tich-hop': 'Intel Iris Xe',
        'intel-irix-xe-tich-hop': 'Intel Iris Xe',
        'amd-radeon-tich-hop': 'AMD Radeon',
      };
      if (gpuMap[gpuParam]) {
        newGPUs.add(gpuMap[gpuParam]);
      }
    }

    if (cpuParam) {
      const cpuMap: Record<string, LaptopCPU> = {
        'intel-core-i9': 'Intel Core i9',
        'intel-core-i7': 'Intel Core i7',
        'intel-core-i5': 'Intel Core i5',
        'intel-core-i3': 'Intel Core i3',
        'intel-core-ultra-9': 'Intel Core Ultra 9',
        'intel-core-ultra-7': 'Intel Core Ultra 7',
        'intel-core-ultra-5': 'Intel Core Ultra 5',
        'amd-ryzen-9': 'AMD Ryzen 9',
        'amd-ryzen-7': 'AMD Ryzen 7',
        'amd-ryzen-5': 'AMD Ryzen 5',
        'amd-ryzen-ai-9': 'AMD Ryzen AI 9',
        'amd-ryzen-ai-7': 'AMD Ryzen AI 7',
        'apple-m4-max': 'Apple M Series',
        'apple-m4-pro': 'Apple M Series',
        'apple-m4': 'Apple M Series',
        'apple-m3-max': 'Apple M Series',
        'apple-m3-pro': 'Apple M Series',
        'apple-m3': 'Apple M Series',
      };
      if (cpuMap[cpuParam]) {
        newCPUs.add(cpuMap[cpuParam]);
      }
    }

    if (ramParam) {
      const ramMap: Record<string, LaptopRAM> = {
        '8gb-ram': '8GB',
        '16gb-ram': '16GB',
        '32gb-ram': '32GB',
        '64gb-ram': '64GB',
      };
      if (ramMap[ramParam]) {
        newRAMs.add(ramMap[ramParam]);
      }
    }

    if (screenParam) {
      const screenMap: Record<string, LaptopScreen> = {
        '133-136-inch': '14 inch',
        '14-inch': '14 inch',
        '156-inch': '15.6 inch',
        '16-inch': '16 inch trở lên',
        '173-18-inch': '17.3 inch',
        '60hz': '60Hz',
        '120hz': '120Hz',
        '144hz': '144Hz',
        '165hz': '165Hz',
        '240hz': '240Hz',
        'man-hinh-oled': 'Màn hình OLED',
        'man-hinh-mini-led': 'Màn hình Mini-LED',
        'man-hinh-cam-ung': 'Màn hình cảm ứng',
      };
      if (screenMap[screenParam]) {
        newScreens.add(screenMap[screenParam]);
      }
    }

    if (filter || brandParam || priceParam || gpuParam || cpuParam || ramParam || screenParam) {
      setSelBrands(newBrands);
      setSelGPUs(newGPUs);
      setSelCPUs(newCPUs);
      setSelRAMs(newRAMs);
      setSelScreens(newScreens);
      setMinPrice(newMinPrice);
      setMaxPrice(newMaxPrice);
      setActiveCategory(newCatIdx);
    }
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    setCurrentPage(1);
  }, [selBrands, selRAMs, selCPUs, selScreens, selGPUs, minPrice, maxPrice, sortBy, activeCategory]);

  const toggleLike = (id: string) =>
    setLiked(p => toggleSet(p, id));

  const hasActiveFilter =
    selBrands.size > 0 || selRAMs.size > 0 || selCPUs.size > 0 ||
    selScreens.size > 0 || selGPUs.size > 0 || minPrice > MIN_PRICE || maxPrice < MAX_PRICE ||
    activeCategory !== null;

  const resetFilters = () => {
    setSelBrands(new Set());
    setSelRAMs(new Set());
    setSelCPUs(new Set());
    setSelScreens(new Set());
    setSelGPUs(new Set());
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    setActiveCategory(null);
    navigate('/laptop');
  };

  const handleCategoryClick = (idx: number) => {
    if (activeCategory === idx) {
      setActiveCategory(null);
      setSelBrands(new Set());
    } else {
      setActiveCategory(idx);
      setSelBrands(new Set(categories[idx].filterBrands));
    }
  };

  
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const specsUpper = p.specs.toUpperCase();
      const specsLower = p.specs.toLowerCase();

      if (selBrands.size > 0 && !selBrands.has(p.brand)) return false;

      if (selRAMs.size > 0) {
        const ramMatch = Array.from(selRAMs).some(r => p.ram === r || specsUpper.includes(r));
        if (!ramMatch) return false;
      }

      if (selCPUs.size > 0) {
        const cpuMatch = Array.from(selCPUs).some(c => {
          if (p.cpu === c) return true;
          if (c === "Apple M Series" && (p.brand === "Apple" || specsUpper.includes("APPLE M") || specsUpper.includes("M3") || specsUpper.includes("M4") || specsUpper.includes("M2") || specsUpper.includes("M1"))) return true;
          if (c === "Intel Core i3" && (specsUpper.includes("I3") || p.cpu === "Intel Core i3")) return true;
          if (c === "Intel Core i5" && (specsUpper.includes("I5") || specsUpper.includes("125H"))) return true;
          if (c === "Intel Core i7" && specsUpper.includes("I7")) return true;
          if (c === "Intel Core i9" && specsUpper.includes("I9")) return true;
          if (c.includes("Ultra 5") && specsUpper.includes("ULTRA 5")) return true;
          if (c.includes("Ultra 7") && specsUpper.includes("ULTRA 7")) return true;
          if (c.includes("Ultra 9") && specsUpper.includes("ULTRA 9")) return true;
          if (c.includes("Ryzen 5") && specsUpper.includes("RYZEN 5")) return true;
          if (c.includes("Ryzen 7") && specsUpper.includes("RYZEN 7")) return true;
          if (c.includes("Ryzen 9") && specsUpper.includes("RYZEN 9")) return true;
          return false;
        });
        if (!cpuMatch) return false;
      }

      if (selGPUs.size > 0) {
        const gpuMatch = Array.from(selGPUs).some(g => {
          if (p.gpu === g) return true;
          const modelCode = g.replace(/.*RTX\s*/i, "").replace(/.*RX\s*/i, "").trim();
          if (modelCode && specsUpper.includes(modelCode.toUpperCase())) return true;
          if (g === "Intel Iris Xe" && (specsLower.includes("iris") || specsLower.includes("intel"))) return true;
          if (g === "Intel Arc Graphics" && specsLower.includes("arc")) return true;
          if (g === "AMD Radeon" && specsLower.includes("radeon")) return true;
          return false;
        });
        if (!gpuMatch) return false;
      }

      if (selScreens.size > 0) {
        const screenMatch = Array.from(selScreens).some(s => {
          if (p.screen === s) return true;
          if (s === "14 inch" && (specsLower.includes('14"') || specsLower.includes('14 inch') || specsLower.includes('13.') || specsLower.includes('14.'))) return true;
          if (s === "15.6 inch" && (specsLower.includes('15.6') || specsLower.includes('15.6"'))) return true;
          if (s === "16 inch trở lên" && (specsLower.includes('16"') || specsLower.includes('16 inch') || specsLower.includes('16.1') || specsLower.includes('16.0'))) return true;
          if (s === "17.3 inch" && (specsLower.includes('17.3') || specsLower.includes('18"'))) return true;
          if (s === "60Hz" && specsUpper.includes("60HZ")) return true;
          if (s === "120Hz" && specsUpper.includes("120HZ")) return true;
          if (s === "144Hz" && specsUpper.includes("144HZ")) return true;
          if (s === "165Hz" && specsUpper.includes("165HZ")) return true;
          if (s === "240Hz" && specsUpper.includes("240HZ")) return true;
          if (s === "Màn hình OLED" && specsUpper.includes("OLED")) return true;
          if (s === "Màn hình Mini-LED" && (specsUpper.includes("MINI-LED") || specsUpper.includes("MINILED") || specsUpper.includes("LIQUID RETINA"))) return true;
          if (s === "Màn hình cảm ứng" && (specsLower.includes("touch") || specsLower.includes("cảm ứng"))) return true;
          return false;
        });
        if (!screenMatch) return false;
      }

      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });

    if (sortBy === "price-asc")  result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "name")       result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, selBrands, selRAMs, selCPUs, selScreens, selGPUs, minPrice, maxPrice, sortBy]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  }, [filteredProducts.length]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

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

  
  const sidebarContent = (
    <div className="space-y-0">
      
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

      
      <FilterGroup title="Nhu cầu sử dụng">
        {[
          { label: 'Học tập', brands: ['Lenovo', 'Acer', 'HP'] as LaptopBrand[] },
          { label: 'Văn phòng', brands: ['Dell', 'Lenovo', 'HP'] as LaptopBrand[] },
          { label: 'Gaming', brands: ['ASUS', 'MSI', 'Acer'] as LaptopBrand[] },
          { label: 'Đồ họa - Sáng tạo', brands: ['Apple', 'ASUS', 'Dell'] as LaptopBrand[] },
          { label: 'Mỏng nhẹ', brands: ['Apple', 'Dell', 'ASUS'] as LaptopBrand[] },
          { label: 'Pin lâu', brands: ['Apple', 'Lenovo', 'HP'] as LaptopBrand[] },
          { label: 'MacBook', brands: ['Apple'] as LaptopBrand[] },
        ].map(({ label, brands }) => {
          
          const selArr = [...selBrands].sort();
          const brandArr = [...brands].sort();
          const checked = selArr.length === brandArr.length && selArr.every((b, i) => b === brandArr[i]);
          return (
            <FilterCheckbox
              key={label}
              label={label}
              checked={checked}
              onChange={() => {
                if (checked) {
                  setSelBrands(new Set());
                  setActiveCategory(null);
                } else {
                  setSelBrands(new Set(brands));
                  
                  const catMap: Record<string, number> = {
                    'Học tập': 0, 'Văn phòng': 1, 'Gaming': 2,
                    'Đồ họa - Sáng tạo': 3, 'Mỏng nhẹ': 4, 'Pin lâu': 5,
                  };
                  setActiveCategory(catMap[label] ?? null);
                }
              }}
            />
          );
        })}
      </FilterGroup>

      
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
    <div className="bg-white min-h-screen pb-16">
      
      <div 
        className="overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0f6ff 40%, #e3effe 70%, #dceafd 100%)",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          marginTop: "-96px",
          paddingTop: "96px",
          paddingLeft: "calc(50vw - 50%)",
          paddingRight: "calc(50vw - 50%)",
        }}
      >
        
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: 800, height: 800,
          background: "radial-gradient(circle, rgba(147,197,253,0.35) 0%, rgba(165,180,252,0.15) 40%, transparent 70%)",
          pointerEvents: "none",
        }} />
        
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: 600, height: 400,
          background: "radial-gradient(ellipse at 0% 100%, rgba(255,255,255,0.9) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center" style={{ minHeight: "calc(100vh - 96px)" }}>
            <motion.div variants={heroContainer} initial="hidden" animate="show" className="max-w-2xl flex flex-col items-start justify-center pr-8 py-12 relative z-10">
              <motion.div variants={heroItem}>
                <span className="inline-block px-3 py-1 bg-white/70 text-zinc-500 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-6 border border-zinc-200/60">
                  Laptop chính hãng
                </span>
              </motion.div>
              <motion.h1
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
                }}
                className="text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] font-bold tracking-tight text-zinc-900 leading-[1.08] mb-6"
              >
                <span className="block">
                  {["Bứt", "phá", "giới", "hạn"].map((word, idx) => (
                    <motion.span
                      key={`w1-${idx}`}
                      variants={{
                        hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
                        show: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: { type: "spring", stiffness: 350, damping: 24 }
                        }
                      }}
                      className="inline-block mr-[0.25em] last:mr-0 cursor-default transition-transform duration-200 hover:scale-105"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <span className="block">
                  {["làm", "chủ", "công", "nghệ."].map((word, idx) => (
                    <motion.span
                      key={`w2-${idx}`}
                      variants={{
                        hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
                        show: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: { type: "spring", stiffness: 350, damping: 24 }
                        }
                      }}
                      className="inline-block mr-[0.25em] last:mr-0 cursor-default transition-transform duration-200 hover:scale-105"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>
              <motion.p variants={heroItem} className="text-[17px] text-zinc-500 mb-10 leading-relaxed">
                Laptop sẽ giúp bạn bật nguồn cảm hứng<br />
                sẵn sàng cùng bạn chinh phục mọi thử thách.
              </motion.p>
              <motion.div variants={heroItem} className="flex flex-row gap-3 mb-12">
                <button
                  onClick={() => {
                    document
                      .getElementById("chon-laptop-theo-nhu-cau")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1d1d1f] hover:bg-zinc-800 text-white text-[15px] font-semibold rounded-full transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
                >
                  Khám phá ngay <ArrowRight className="w-4 h-4" />
                </button>
                
                 <Link
                  to="/ho-tro" 
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/80 border border-zinc-300 hover:bg-white text-zinc-800 text-[15px] font-semibold rounded-full transition-all duration-200 shadow-sm active:scale-95 cursor-pointer text-center"
                >
                  Tư vấn chọn laptop <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div variants={heroItem} className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-7 border-t border-zinc-300/40 w-full">
                {perks.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-zinc-700 shrink-0" strokeWidth={1.8} />
                    <span className="text-[13px] text-zinc-700 leading-tight whitespace-pre-line font-semibold">{title}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-center"
              style={{ alignSelf: "stretch" }}
            >
              
              <div style={{
                position: "absolute",
                width: 600, height: 600,
                background: "radial-gradient(circle, rgba(147,197,253,0.3) 0%, rgba(165,180,252,0.1) 50%, transparent 70%)",
                bottom: "12%", left: "50%", transform: "translateX(-48%)",
                pointerEvents: "none",
                zIndex: 0,
              }} />
              
              
              <div style={{
                position: "absolute",
                width: 500, height: 60,
                background: "radial-gradient(ellipse, rgba(120,170,250,0.2) 0%, transparent 70%)",
                bottom: "14%", left: "50%", transform: "translateX(-48%)",
                pointerEvents: "none",
                zIndex: 1,
              }} />

              <div className="relative z-10 w-full flex items-center justify-center overflow-hidden">
                <MacBookNeoViewer />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 mt-8 md:mt-10">

        
        <section id="chon-laptop-theo-nhu-cau" className="scroll-mt-28 mb-16 md:mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">Chọn laptop theo nhu cầu</h2>
            {activeCategory !== null && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Bỏ chọn
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat, i) => {
              const isActive = activeCategory === i;
              return (
                <button
                  key={i}
                  onClick={() => handleCategoryClick(i)}
                  className={`group cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden text-left block w-full ${
                    isActive
                      ? "border-zinc-900 shadow-lg ring-2 ring-zinc-900/10 -translate-y-0.5"
                      : "border-zinc-100 bg-white shadow-sm hover:shadow-md hover:border-zinc-200 hover:-translate-y-0.5"
                  }`}
                >
                  
                  <div className="w-full aspect-[4/3] relative overflow-hidden bg-zinc-100">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {isActive && (
                      <div className="absolute inset-0 bg-zinc-900/20" />
                    )}
                    
                    <div className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-xl backdrop-blur flex items-center justify-center border shadow-sm transition-colors ${
                      isActive ? "bg-zinc-900 border-zinc-900" : "bg-white/80 border-white/20"
                    }`}>
                      <cat.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500"}`} strokeWidth={1.8} />
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-between px-3.5 py-3 ${
                    isActive ? "bg-zinc-900" : "bg-white"
                  }`}>
                    <span className={`text-[13px] font-bold transition-colors ${
                      isActive ? "text-white" : "text-zinc-800 group-hover:text-zinc-950"
                    }`}>{cat.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                      isActive ? "text-white rotate-90" : "text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5"
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        
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

        
        <div id="products-section" />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          
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

          
          <main className="flex-1 min-w-0">
            
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

            
            {loading ? (
              <ProductSkeletonGrid count={8} />
            ) : filteredProducts.length === 0 ? (
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
                {paginatedProducts.map((p) => (
                  viewMode === "grid" ? (
                    <div
                       key={p.id}
                      onClick={() => navigate(`/san-pham/${p.id}`)}
                      className="group bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm hover:shadow-md hover:border-zinc-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col relative cursor-pointer"
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
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[15px] font-bold text-zinc-900">{formatPrice(p.price)}</div>
                          <AddToCartButton
                            product={{
                              id: p.id,
                              name: p.name,
                              specs: p.specs,
                              price: p.price,
                              image: p.img,
                              category: "Laptop",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/san-pham/${p.id}`)}
                      className="group bg-white rounded-xl border border-zinc-100 p-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 relative cursor-pointer"
                    >
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
                      <AddToCartButton
                        product={{
                          id: p.id,
                          name: p.name,
                          specs: p.specs,
                          price: p.price,
                          image: p.img,
                          category: "Laptop",
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(p.id);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${liked.has(p.id) ? "fill-red-500 text-red-500" : "text-zinc-300"}`} />
                      </button>
                    </div>
                  )
                ))}
              </div>
            )}

            
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 transition-colors ${
                    currentPage === 1 ? "text-zinc-300 cursor-not-allowed opacity-50" : "text-zinc-600 hover:bg-zinc-50 cursor-pointer"
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
                        document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg font-medium text-[13px] transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-zinc-950 text-white"
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
                    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 transition-colors ${
                    currentPage === totalPages ? "text-zinc-300 cursor-not-allowed opacity-50" : "text-zinc-600 hover:bg-zinc-50 cursor-pointer"
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
