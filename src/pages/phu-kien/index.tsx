import {
  BadgeCheck,
  Cable,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Headphones,
  Headset,
  Heart,
  Keyboard,
  List,
  Monitor,
  Mouse,
  PackageCheck,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Truck,
  Webcam,
  X,
  Speaker,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import AddToCartButton from "../../components/AddToCartButton";

/*
  src/pages/phu-kien/index.tsx

  Trang này chỉ là FRONTEND HIỂN THỊ.
  Không hardcode danh sách sản phẩm phụ kiện trong file này.

  Luồng đúng:
  Admin thêm/sửa/xóa phụ kiện
  → Backend lưu dữ liệu
  → Trang /phu-kien fetch từ /api/accessories
  → Frontend render sản phẩm.
*/

type AccessoryProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  badge?: string;
  colors: string[];
  image: string;
  fallbackIcon?: React.ElementType | string;
  isActive?: boolean;
  createdAt?: string;
};

type RawAccessoryProduct = {
  id?: string | number;
  name?: string;
  brand?: string;
  category?: string;
  price?: number | string;
  badge?: string;
  colors?: string[] | string;
  image?: string;
  fallbackIcon?: React.ElementType | string;
  isActive?: boolean;
  createdAt?: string;
};

type AccessoryCombo = {
  id: string;
  title: string;
  desc: string;
  productIds: string[];
  discountPercent: number;
  image: string;
  isActive?: boolean;
  createdAt?: string;
};

type RawAccessoryCombo = {
  id?: string | number;
  title?: string;
  name?: string;
  desc?: string;
  specs?: string;
  productIds?: Array<string | number>;
  discountPercent?: number | string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
};

const API_BASE =
  typeof window !== "undefined"
    ? (window.location.hostname.includes("qtitpc.dev")
      ? "https://api-pc.qtitpc.dev"
      : `${window.location.protocol}//${window.location.hostname}:3001`)
    : "http://localhost:3001";

const DEFAULT_MAX_PRICE = 10_900_000;
const CATEGORY_PREVIEW_LIMIT = 8;
const PRODUCTS_PER_PAGE = 15;
const BRAND_PREVIEW_LIMIT = 5;
const COLOR_PREVIEW_LIMIT = 6;
const COMBO_PREVIEW_LIMIT = 3;

const baseBrandOptions = [
  "Logitech",
  "Razer",
  "Corsair",
  "SteelSeries",
  "HyperX",
  "Keychron",
  "ASUS",
  "MSI",
  "LG",
  "Dell",
  "Samsung",
  "AOC",
  "BenQ",
  "ViewSonic",
  "Acer",
  "Gigabyte",
  "Sony",
  "JBL",
  "Harman Kardon",
  "Edifier",
  "UGREEN",
  "Baseus",
  "Anker",
  "Belkin",
  "TP-Link",
];

const ICON_MAP: Record<string, React.ElementType> = {
  Headphones,
  Keyboard,
  Mouse,
  Grid3X3,
  Speaker,
  Webcam,
  Monitor,
  Cable,
};

const REAL_IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1707858004668-d33b9a1d1956?auto=format&fit=crop&w=1600&q=85",
  monitor: "/accessories/categories/man-hinh.png",
  keyboardWhite: "/accessories/categories/ban-phim.png",
  mouse: "/accessories/categories/chuot.png",
  mousePad: "/accessories/categories/lot-chuot.png",
  headphonesWhite: "/accessories/categories/tai-nghe.png",
  speaker: "/accessories/categories/loa.png",
  webcam: "/accessories/categories/webcam.png",
  cableHub: "/accessories/categories/cap-hub.png",
  monitorStand: "/accessories/categories/gia-do.png",
  setupDark: "/accessories/categories/chuot.png",
};

const HERO_ACCESSORIES_IMAGE = "/accessories/hero-phu-kien.png";

const baseCategories: {
  name: string;
  image: string;
  Icon: React.ElementType;
}[] = [
    { name: "Màn hình", image: REAL_IMAGES.monitor, Icon: Monitor },
    { name: "Bàn phím", image: REAL_IMAGES.keyboardWhite, Icon: Keyboard },
    { name: "Chuột", image: REAL_IMAGES.mouse, Icon: Mouse },
    { name: "Tai nghe", image: REAL_IMAGES.headphonesWhite, Icon: Headphones },
    { name: "Loa", image: REAL_IMAGES.speaker, Icon: Speaker },
    { name: "Webcam", image: REAL_IMAGES.webcam, Icon: Webcam },
    { name: "Lót chuột", image: REAL_IMAGES.mousePad, Icon: Grid3X3 },
    { name: "Cáp & Hub", image: REAL_IMAGES.cableHub, Icon: Cable },
    { name: "Giá đỡ", image: REAL_IMAGES.monitorStand, Icon: Monitor },
  ];

const baseColorOptions: { name: string; className: string }[] = [
  { name: "Đen", className: "bg-black" },
  { name: "Trắng", className: "bg-white border border-zinc-300" },
  { name: "Xám", className: "bg-zinc-400" },
  { name: "Bạc", className: "bg-zinc-200 border border-zinc-300" },
  { name: "Hồng", className: "bg-pink-300" },
  { name: "Xanh dương", className: "bg-sky-500" },
  { name: "Đỏ", className: "bg-red-500" },
  { name: "Xanh lá", className: "bg-emerald-500" },
  { name: "Tím", className: "bg-violet-500" },
  { name: "Vàng", className: "bg-yellow-400" },
  { name: "Cam", className: "bg-orange-400" },
];

const heroBenefits = [
  {
    Icon: Truck,
    title: "Giao hàng nhanh",
    desc: "Giao hàng toàn quốc\ntrong 24 - 48h",
  },
  {
    Icon: BadgeCheck,
    title: "Bảo hành chính hãng",
    desc: "Cam kết 100% chính hãng,\nbảo hành uy tín",
  },
  {
    Icon: PackageCheck,
    title: "Đổi trả dễ dàng",
    desc: "Hỗ trợ đổi trả trong\n7 ngày nếu lỗi NSX",
  },
  {
    Icon: Headset,
    title: "Tư vấn tận tâm",
    desc: "Đội ngũ chuyên nghiệp\nhỗ trợ 24/7",
  },
];


function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price || 0) + " đ";
}

function toNumberPrice(value: number | string | undefined) {
  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const cleanValue = value.replace(/[^\d]/g, "");
    return Number(cleanValue) || 0;
  }

  return 0;
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeColors(value: string[] | string | undefined) {
  if (Array.isArray(value)) {
    return value.map((color) => String(color).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeProducts(data: unknown): AccessoryProduct[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter((item): item is RawAccessoryProduct => {
      return Boolean(item && typeof item === "object" && item.isActive !== false);
    })
    .map((item, index) => {
      const id = item.id ? String(item.id) : `accessory-${index}`;

      return {
        id,
        name: item.name?.trim() || "Sản phẩm chưa đặt tên",
        brand: item.brand?.trim() || "Khác",
        category: item.category?.trim() || "Khác",
        price: toNumberPrice(item.price),
        badge: item.badge?.trim() || "",
        colors: normalizeColors(item.colors),
        image: item.image?.trim() || "",
        fallbackIcon: item.fallbackIcon,
        isActive: item.isActive !== false,
        createdAt: item.createdAt,
      };
    });
}

function normalizeCombos(data: unknown): AccessoryCombo[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter((item): item is RawAccessoryCombo => {
      return Boolean(item && typeof item === "object" && item.isActive !== false);
    })
    .map((item, index) => ({
      id: item.id ? String(item.id) : `combo-${index}`,
      title: item.title?.trim() || item.name?.trim() || "Combo phụ kiện",
      desc: item.desc?.trim() || item.specs?.trim() || "Bộ phụ kiện được ghép từ các sản phẩm đang bán.",
      productIds: Array.isArray(item.productIds)
        ? item.productIds.map((id) => String(id)).filter(Boolean)
        : [],
      discountPercent: Math.min(
        90,
        Math.max(0, Number(String(item.discountPercent ?? 0).replace(/[^\d]/g, "")) || 0)
      ),
      image: item.image?.trim() || "",
      isActive: item.isActive !== false,
      createdAt: item.createdAt,
    }));
}

function toggleSetValue<T>(set: Set<T>, value: T) {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

function getIconByCategory(category: string) {
  const categoryItem = baseCategories.find((item) => item.name === category);
  return categoryItem?.Icon || Headphones;
}

function getColorClass(colorName: string, colorOptions: { name: string; className: string }[]) {
  return (
    colorOptions.find((item) => item.name === colorName)?.className ??
    "bg-zinc-300"
  );
}

function ImageWithFallback({
  src,
  alt,
  Icon,
  className,
  iconClassName = "h-16 w-16 text-zinc-800",
}: {
  src: string;
  alt: string;
  Icon: React.ElementType;
  className: string;
  iconClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#fbfbfd]`}>
        <Icon className={iconClassName} strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
      draggable={false}
    />
  );
}

function FilterCheckbox({
  checked,
  label,
  count,
  onChange,
}: {
  checked: boolean;
  label: string;
  count?: number;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-3 py-1.5 text-left"
    >
      <span className="flex items-center gap-2 text-[12px] text-zinc-600">
        <span
          className={`h-3.5 w-3.5 rounded-[3px] border transition ${checked ? "border-zinc-950 bg-zinc-950" : "border-zinc-300 bg-white"
            }`}
        />
        {label}
      </span>

      {typeof count === "number" && (
        <span className="text-[11px] text-zinc-400">({count})</span>
      )}
    </button>
  );
}

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | string> = [1];
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  if (startPage > 2) {
    items.push("ellipsis-start");
  }

  for (let page = startPage; page <= endPage; page += 1) {
    items.push(page);
  }

  if (endPage < totalPages - 1) {
    items.push("ellipsis-end");
  }

  items.push(totalPages);
  return items;
}

export default function PhuKienIndex() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<AccessoryProduct[]>([]);
  const [combos, setCombos] = useState<AccessoryCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [comboLoading, setComboLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [minPrice, setMinPrice] = useState(100000);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [activeInput, setActiveInput] = useState<'min' | 'max'>('min');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllCombos, setShowAllCombos] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const categoryParam = searchParams.get("category");

    if (!categoryParam) {
      setSelectedCategories(new Set());
      return;
    }

    const matchedCategory = baseCategories.find(
      (category) => generateSlug(category.name) === categoryParam
    );

    if (matchedCategory) {
      setSelectedCategories(new Set([matchedCategory.name]));

      setShowAllCategories(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setFetchError("");

    fetch(`${API_BASE}/api/accessories`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể tải dữ liệu phụ kiện.");
        }

        return res.json();
      })
      .then((data) => {
        const normalizedProducts = normalizeProducts(data);
        setProducts(normalizedProducts);

        const highestPrice =
          normalizedProducts.length > 0
            ? Math.max(DEFAULT_MAX_PRICE, ...normalizedProducts.map((product) => product.price))
            : DEFAULT_MAX_PRICE;

        setMaxPrice(highestPrice);
      })
      .catch((err) => {
        console.error("Error fetching accessories:", err);
        setProducts([]);
        setFetchError("Không thể kết nối tới backend phụ kiện.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setComboLoading(true);

    fetch(`${API_BASE}/api/accessory-combos`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCombos(normalizeCombos(data)))
      .catch((err) => {
        console.error("Error fetching accessory combos:", err);
        setCombos([]);
      })
      .finally(() => setComboLoading(false));
  }, []);

  const highestPrice = useMemo(() => {
    if (products.length === 0) return DEFAULT_MAX_PRICE;
    return Math.max(DEFAULT_MAX_PRICE, ...products.map((product) => product.price));
  }, [products]);

  const categories = useMemo(() => {
    const extraCategoryNames = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter((category) => !baseCategories.some((item) => item.name === category))
      ),
    ];

    const extraCategories = extraCategoryNames.map((name) => ({
      name,
      image: REAL_IMAGES.setupDark,
      Icon: Headphones,
    }));

    return [...baseCategories, ...extraCategories].map((category) => ({
      ...category,
      count: products.filter((product) => product.category === category.name).length,
    }));
  }, [products]);

  const visibleCategories = useMemo(() => {
    return showAllCategories
      ? categories
      : categories.slice(0, CATEGORY_PREVIEW_LIMIT);
  }, [categories, showAllCategories]);

  const brands = useMemo(() => {
    const productBrands = products.map((product) => product.brand).filter(Boolean);

    return [
      ...baseBrandOptions,
      ...productBrands.filter((brand) => !baseBrandOptions.includes(brand)),
    ];
  }, [products]);

  const visibleBrands = useMemo(() => {
    return showAllBrands ? brands : brands.slice(0, BRAND_PREVIEW_LIMIT);
  }, [brands, showAllBrands]);

  const colorOptions = useMemo(() => {
    const productColors = [
      ...new Set(products.flatMap((product) => product.colors || [])),
    ];

    const extraColors = productColors
      .filter((color) => !baseColorOptions.some((item) => item.name === color))
      .map((color) => ({ name: color, className: "bg-zinc-300" }));

    return [...baseColorOptions, ...extraColors];
  }, [products]);

  const visibleColorOptions = useMemo(() => {
    return showAllColors
      ? colorOptions
      : colorOptions.slice(0, COLOR_PREVIEW_LIMIT);
  }, [colorOptions, showAllColors]);

  const comboDisplayItems = useMemo(() => {
    return combos
      .map((combo) => {
        const comboProducts = combo.productIds
          .map((id) => products.find((product) => String(product.id) === String(id)))
          .filter((product): product is AccessoryProduct => Boolean(product));

        const originalPrice = comboProducts.reduce((sum, product) => sum + product.price, 0);
        const discountedPrice = Math.max(
          0,
          Math.round(originalPrice * (100 - combo.discountPercent) / 100)
        );

        return {
          ...combo,
          products: comboProducts,
          originalPrice,
          discountedPrice,
          image: combo.image || comboProducts[0]?.image || REAL_IMAGES.setupDark,
        };
      })
      .filter((combo) => combo.products.length > 0 && combo.originalPrice > 0);
  }, [combos, products]);

  const visibleCombos = useMemo(() => {
    return showAllCombos ? comboDisplayItems : comboDisplayItems.slice(0, COMBO_PREVIEW_LIMIT);
  }, [comboDisplayItems, showAllCombos]);

  const hasActiveFilter =
    selectedCategories.size > 0 ||
    selectedBrands.size > 0 ||
    selectedColors.size > 0 ||
    minPrice > 100000 ||
    maxPrice < highestPrice;

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchCategory =
        selectedCategories.size === 0 || selectedCategories.has(product.category);

      const matchBrand =
        selectedBrands.size === 0 || selectedBrands.has(product.brand);

      const matchColor =
        selectedColors.size === 0 ||
        product.colors.some((color) => selectedColors.has(color));

      const matchPrice = product.price >= minPrice && product.price <= maxPrice;

      return matchCategory && matchBrand && matchColor && matchPrice;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "newest") {
      result = [...result].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    return result;
  }, [products, selectedCategories, selectedBrands, selectedColors, sortBy, minPrice, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, selectedColors, sortBy, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const paginationItems = useMemo(() => {
    return getPaginationItems(currentPage, totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetFilters = () => {
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setSelectedColors(new Set());
    setMinPrice(100000);
    setMaxPrice(highestPrice);
    setShowAllBrands(false);
    setShowAllColors(false);
  };

  return (
    <div className="bg-white text-[#1d1d1f]">
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-zinc-100 bg-[linear-gradient(90deg,#f8f8fa_0%,#f5f5f7_50%,#f2f2f4_100%)]"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          marginTop: "-96px",
          paddingTop: "96px",
        }}
      >
        <div className="relative mx-auto grid min-h-[570px] max-w-[1700px] grid-cols-1 items-center gap-10 px-4 py-14 md:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 xl:px-12 2xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
            className="z-[2]"
          >
            <div className="mb-7 inline-flex rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 shadow-sm backdrop-blur">
              Phụ kiện cao cấp
            </div>

            <h1 className="mb-7 max-w-[660px] text-[3rem] font-bold leading-[1.12] tracking-[-0.035em] text-[#1d1d1f] md:text-[4.25rem] lg:text-[4.85rem]">
              Nâng tầm
              <br />
              trải nghiệm.
            </h1>

            <p className="mb-8 max-w-[470px] text-[15px] leading-7 text-zinc-600 md:text-[16px]">
              Phụ kiện tối giản, đồng bộ và tinh tế cho góc làm việc,
              giải trí và sáng tạo mỗi ngày.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("accessories-products")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-[13px] font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-zinc-800 active:scale-95"
              >
                Khám phá ngay
                <ChevronRight className="h-4 w-4" />
              </button>

              <Link
                to="/ho-tro"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-7 py-3.5 text-[13px] font-bold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white active:scale-95"
              >
                Tư vấn phụ kiện
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid max-w-[650px] grid-cols-2 gap-x-7 gap-y-5 border-t border-zinc-200/80 pt-7 lg:grid-cols-4">
              {heroBenefits.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-800" strokeWidth={1.75} />
                  <div>
                    <h3 className="text-[12px] font-bold leading-snug text-zinc-950">
                      {title}
                    </h3>
                    <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-zinc-500">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1], delay: 0.08 }}
            className="relative hidden h-[460px] lg:block"
          >
            <div className="absolute -inset-8 rounded-[44px] bg-[radial-gradient(circle_at_52%_45%,rgba(255,255,255,0.95),rgba(255,255,255,0)_65%)]" />

            <ImageWithFallback
              src={HERO_ACCESSORIES_IMAGE}
              alt="Bộ phụ kiện máy tính màu trắng"
              Icon={Keyboard}
              className="absolute right-0 top-1/2 h-[420px] w-[94%] -translate-y-1/2 rounded-[34px] object-cover object-center shadow-[0_28px_70px_rgba(15,23,42,0.16)] ring-1 ring-white/80"
              iconClassName="h-28 w-28 text-zinc-900"
            />
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-[1700px] px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        {/* CATEGORIES */}
        <section className="py-9">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[19px] font-bold tracking-tight text-zinc-950">
              Danh mục phụ kiện
            </h2>

            {categories.length > CATEGORY_PREVIEW_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllCategories((prev) => !prev)}
                className="flex items-center gap-1 text-[13px] font-medium text-zinc-700 transition hover:text-zinc-950"
              >
                {showAllCategories ? "Thu gọn" : "Xem tất cả"}
                {showAllCategories ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {visibleCategories.map(({ name, image, Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedCategories((prev) => toggleSetValue(prev, name))}
                className={`group rounded-[20px] border bg-[#fbfbfd] p-3.5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.07)] ${selectedCategories.has(name) ? "border-zinc-900" : "border-zinc-100"
                  }`}
              >
                <div className="mb-3 flex h-[108px] items-center justify-center overflow-hidden rounded-[16px] bg-white">
                  <ImageWithFallback
                    src={image}
                    alt={name}
                    Icon={Icon}
                    className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                    iconClassName="h-10 w-10 text-zinc-900"
                  />
                </div>
                <p className="text-center text-[13px] font-semibold tracking-tight text-zinc-900">
                  {name}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* MOBILE TOOLBAR */}
        <section className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Bộ lọc
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm outline-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="name">Tên A-Z</option>
          </select>
        </section>

        {/* PRODUCT AREA */}
        <section
          id="accessories-products"
          className="scroll-mt-28 grid grid-cols-1 gap-8 lg:grid-cols-[245px_1fr]"
        >
          {/* FILTER SIDEBAR */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-[300px] overflow-y-auto bg-white p-5 shadow-2xl transition-transform lg:sticky lg:top-24 lg:z-auto lg:h-fit lg:w-auto lg:translate-x-0 lg:rounded-[20px] lg:border lg:border-zinc-100 lg:shadow-[0_6px_22px_rgba(0,0,0,0.05)] ${showMobileFilter ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-zinc-950">Bộ lọc</h3>

              <div className="flex items-center gap-3">
                {hasActiveFilter && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-950"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Xóa bộ lọc
                  </button>
                )}

                <button onClick={() => setShowMobileFilter(false)} className="lg:hidden">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-[13px] font-semibold text-zinc-900">Danh mục</h4>
                {categories.map((cat) => (
                  <FilterCheckbox
                    key={cat.name}
                    label={cat.name}
                    count={cat.count}
                    checked={selectedCategories.has(cat.name)}
                    onChange={() =>
                      setSelectedCategories((prev) => toggleSetValue(prev, cat.name))
                    }
                  />
                ))}

              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="mb-3 text-[13px] font-semibold text-zinc-900">Giá</h4>

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
                    const value = 100000 + percent * (highestPrice - 100000);
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
                    const value = 100000 + percent * (highestPrice - 100000);
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
                      left: `${((minPrice - 100000) / (highestPrice - 100000)) * 100}%`,
                      right: `${100 - ((maxPrice - 100000) / (highestPrice - 100000)) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={100000}
                    max={highestPrice}
                    step={100000}
                    value={minPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 100000);
                      setMinPrice(val);
                    }}
                    className="dual-range-slider"
                    style={{ zIndex: activeInput === 'min' ? 10 : 3 }}
                  />
                  <input
                    type="range"
                    min={100000}
                    max={highestPrice}
                    step={100000}
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 100000);
                      setMaxPrice(val);
                    }}
                    className="dual-range-slider"
                    style={{ zIndex: activeInput === 'max' ? 10 : 3 }}
                  />
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="mb-3 text-[13px] font-semibold text-zinc-900">Thương hiệu</h4>

                {visibleBrands.map((brand) => (
                  <FilterCheckbox
                    key={brand}
                    label={brand}
                    count={products.filter((p) => p.brand === brand).length}
                    checked={selectedBrands.has(brand)}
                    onChange={() => setSelectedBrands((prev) => toggleSetValue(prev, brand))}
                  />
                ))}

                {brands.length > BRAND_PREVIEW_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowAllBrands((prev) => !prev)}
                    className="mt-2 flex items-center gap-1 text-[12px] font-medium text-zinc-600 transition hover:text-zinc-950"
                  >
                    {showAllBrands ? "Thu gọn" : "Hiển thị thêm"}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition ${showAllBrands ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="mb-3 text-[13px] font-semibold text-zinc-900">Màu sắc</h4>

                <div className="flex flex-wrap gap-3">
                  {visibleColorOptions.map((color) => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColors((prev) => toggleSetValue(prev, color.name))}
                      className={`h-5 w-5 rounded-full ring-offset-2 transition ${color.className} ${selectedColors.has(color.name) ? "ring-2 ring-zinc-950" : ""
                        }`}
                    />
                  ))}
                </div>

                {colorOptions.length > COLOR_PREVIEW_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowAllColors((prev) => !prev)}
                    className="mt-4 flex items-center gap-1 text-[12px] font-medium text-zinc-600 transition hover:text-zinc-950"
                  >
                    {showAllColors ? "Thu gọn" : "Hiển thị thêm"}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition ${showAllColors ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>
            </div>
          </aside>

          {showMobileFilter && (
            <button
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setShowMobileFilter(false)}
            />
          )}

          {/* PRODUCTS */}
          <div>
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <p className="text-[13px] text-zinc-500">
                <span className="font-semibold text-zinc-900">
                  {filteredProducts.length}
                </span>{" "}
                sản phẩm
              </p>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-lg border border-zinc-200 bg-white py-2.5 pl-4 pr-10 text-[13px] font-medium text-zinc-700 shadow-sm outline-none"
                  >
                    <option value="newest">Sắp xếp: Mới nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="name">Tên A-Z</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                </div>

                <div className="flex rounded-lg border border-zinc-200 bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-md p-2 ${viewMode === "grid" ? "bg-zinc-100 text-zinc-950" : "text-zinc-400"
                      }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-md p-2 ${viewMode === "list" ? "bg-zinc-100 text-zinc-950" : "text-zinc-400"
                      }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-[#fbfbfd] text-center shadow-sm">
                <div className="mb-4 h-9 w-9 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
                <h3 className="text-lg font-bold text-zinc-900">
                  Đang tải phụ kiện từ backend...
                </h3>
              </div>
            ) : fetchError ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-[#fbfbfd] text-center shadow-sm">
                <Search className="mb-4 h-10 w-10 text-zinc-300" />
                <h3 className="text-lg font-bold text-zinc-900">
                  {fetchError}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Kiểm tra backend đã chạy và có route /api/accessories chưa.
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-[#fbfbfd] text-center shadow-sm">
                <Search className="mb-4 h-10 w-10 text-zinc-300" />
                <h3 className="text-lg font-bold text-zinc-900">
                  Chưa có phụ kiện nào
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Trang này không tự có sẵn sản phẩm. Sản phẩm phụ kiện sẽ hiển thị
                  sau khi admin thêm dữ liệu trong trang quản trị.
                </p>
                <Link
                  to="/admin/phu-kien"
                  className="mt-5 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Mở admin phụ kiện
                </Link>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-[#fbfbfd] text-center shadow-sm">
                <Search className="mb-4 h-10 w-10 text-zinc-300" />
                <h3 className="text-lg font-bold text-zinc-900">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Thử xóa bớt bộ lọc hoặc đổi mức giá.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"
                    : "grid grid-cols-1 gap-4"
                }
              >
                {paginatedProducts.map((product) => {
                  const isLiked = liked.has(product.id);
                  const Icon =
                    typeof product.fallbackIcon === "string"
                      ? ICON_MAP[product.fallbackIcon] || getIconByCategory(product.category)
                      : product.fallbackIcon || getIconByCategory(product.category);

                  return (
                    <article
                      key={product.id}
                      className={`group relative overflow-hidden rounded-[20px] border border-zinc-100 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] ${viewMode === "list" ? "grid grid-cols-[210px_1fr] items-center" : ""
                        }`}
                    >
                      <button
                        onClick={() =>
                          setLiked((prev) => toggleSetValue(prev, product.id))
                        }
                        className="absolute right-4 top-4 z-[2] flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-400 shadow-sm transition hover:text-zinc-950"
                      >
                        <Heart
                          className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""
                            }`}
                        />
                      </button>

                      {product.badge && (
                        <span className="absolute left-4 top-4 z-[2] rounded-md bg-[#f3f4f6] px-2.5 py-1 text-[10px] font-medium text-zinc-600">
                          {product.badge}
                        </span>
                      )}

                      <div className="flex h-[235px] items-center justify-center overflow-hidden bg-[#fbfbfd] px-0 pt-0">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          Icon={Icon}
                          className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.04]"
                          iconClassName="h-24 w-24 text-zinc-900"
                        />
                      </div>

                      <div className="px-5 pb-5 pt-4">
                        <h3 className="mb-1 min-h-[42px] text-[15px] font-bold leading-snug tracking-tight text-zinc-950">
                          {product.name}
                        </h3>

                        <p className="mb-3 text-[12px] text-zinc-400">
                          {product.brand}
                        </p>

                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-[15px] font-bold text-zinc-950">
                            {formatPrice(product.price)}
                          </p>

                          <AddToCartButton
                            product={{
                              id: `accessory-${product.id}`,
                              name: product.name,
                              specs: `${product.brand} • ${product.category}`,
                              price: product.price,
                              image: product.image,
                              category: `Phụ kiện - ${product.category}`,
                            }}
                            label={viewMode === "list" ? "Thêm vào giỏ" : undefined}
                            className={viewMode === "list" ? "shrink-0" : ""}
                          />
                        </div>

                        <div className="flex gap-1.5">
                          {product.colors.slice(0, 4).map((color) => (
                            <span
                              key={color}
                              title={color}
                              className={`h-3.5 w-3.5 rounded-full ${getColorClass(
                                color,
                                colorOptions
                              )}`}
                            />
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && !fetchError && filteredProducts.length > PRODUCTS_PER_PAGE && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:border-zinc-300 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </button>

                {paginationItems.map((item, index) =>
                  typeof item === "number" ? (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCurrentPage(item)}
                      className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-[13px] font-semibold transition ${currentPage === item
                        ? "bg-zinc-950 text-white shadow-sm"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-950"
                        }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <span
                      key={`${item}-${index}`}
                      className="flex h-9 min-w-9 items-center justify-center text-sm text-zinc-400"
                    >
                      ...
                    </span>
                  )
                )}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:border-zinc-300 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* COMBOS */}
        <section className="py-14 md:py-16 lg:ml-[277px]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-zinc-200 bg-[#fbfbfd] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                Combo phụ kiện
              </div>
              <h2 className="text-[22px] font-black tracking-[-0.03em] text-zinc-950">
                Có thể bạn sẽ cần
              </h2>
              <p className="mt-1 max-w-[620px] text-[13px] leading-6 text-zinc-500">
                Các bộ phụ kiện được ghép từ sản phẩm đang bán, mua theo combo sẽ có giá tốt hơn so với mua lẻ.
              </p>
            </div>

            {comboDisplayItems.length > COMBO_PREVIEW_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllCombos((prev) => !prev)}
                className="inline-flex w-fit items-center gap-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13px] font-bold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:text-zinc-950"
              >
                {showAllCombos ? "Thu gọn" : "Xem tất cả combo"}
                {showAllCombos ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {comboLoading ? (
            <div className="rounded-[28px] border border-zinc-100 bg-[#fbfbfd] px-5 py-10 text-center text-[13px] font-semibold text-zinc-500 shadow-[0_4px_18px_rgba(0,0,0,0.03)]">
              Đang tải combo phụ kiện...
            </div>
          ) : comboDisplayItems.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-zinc-200 bg-[#fbfbfd] px-5 py-10 text-center shadow-[0_4px_18px_rgba(0,0,0,0.03)]">
              <h3 className="text-[15px] font-bold text-zinc-900">Chưa có combo phụ kiện</h3>
              <p className="mt-2 text-[13px] text-zinc-500">
                Admin có thể tạo combo ngay trong mục Phụ kiện Gaming.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {visibleCombos.map((combo) => (
                <article
                  key={combo.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(0,0,0,0.09)]"
                >
                  <div className="relative flex h-[185px] items-center justify-center overflow-hidden bg-[#fbfbfd]">
                    <ImageWithFallback
                      src={combo.image}
                      alt={combo.title}
                      Icon={PackageCheck}
                      className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                      iconClassName="h-16 w-16 text-zinc-900"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-[11px] font-black text-white shadow-sm">
                      -{combo.discountPercent}%
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-[16px] font-black leading-snug tracking-[-0.02em] text-zinc-950">
                      {combo.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 text-[12px] leading-relaxed text-zinc-500">
                      {combo.desc}
                    </p>

                    <div className="mb-4 rounded-2xl border border-zinc-100 bg-[#fbfbfd] p-3">
                      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-400">
                        Gồm {combo.products.length} sản phẩm
                      </p>
                      <div className="space-y-1.5">
                        {combo.products.slice(0, 3).map((product) => (
                          <p key={product.id} className="truncate text-[12px] font-semibold text-zinc-700">
                            • {product.name}
                          </p>
                        ))}
                        {combo.products.length > 3 && (
                          <p className="text-[12px] font-semibold text-zinc-400">
                            +{combo.products.length - 3} sản phẩm khác
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-zinc-100 pt-4">
                      <div>
                        <p className="text-[11px] font-medium text-zinc-400 line-through">
                          {formatPrice(combo.originalPrice)}
                        </p>
                        <p className="text-[18px] font-black text-zinc-950">
                          {formatPrice(combo.discountedPrice)}
                        </p>
                      </div>

                      <AddToCartButton
                        product={{
                          id: `combo-${combo.id}`,
                          name: combo.title,
                          specs: `${combo.products.map((product) => product.name).join(" + ")} • Giảm ${combo.discountPercent}%`,
                          price: combo.discountedPrice,
                          image: combo.image,
                          category: "Combo phụ kiện",
                        }}
                        label="Thêm"
                        className="shrink-0"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}