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
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

const API_BASE =
  typeof window !== "undefined"
    ? (window.location.hostname.includes("qtitpc.dev")
      ? "https://api-pc.qtitpc.dev"
      : `${window.location.protocol}//${window.location.hostname}:3001`)
    : "http://localhost:3001";

const DEFAULT_MAX_PRICE = 10_900_000;

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
  setupDark:
    "https://images.unsplash.com/photo-1707858057802-ab1227691ed5?auto=format&fit=crop&w=1200&q=85",
  keyboardWhite:
    "https://images.unsplash.com/photo-1632078965632-575bd4061be4?auto=format&fit=crop&w=1200&q=85",
  headphonesWhite:
    "https://images.unsplash.com/photo-1713926304458-b8e00dfa9911?auto=format&fit=crop&w=1200&q=85",
  webcam:
    "https://images.unsplash.com/photo-1670278458296-00ff8a63141e?auto=format&fit=crop&w=1200&q=85",
  speaker:
    "https://images.unsplash.com/photo-1715321835688-831f4767cf93?auto=format&fit=crop&w=1200&q=85",
};

const HERO_ACCESSORIES_IMAGE = "/accessories/hero-phu-kien.png";

const baseCategories: {
  name: string;
  image: string;
  Icon: React.ElementType;
}[] = [
    { name: "Tai nghe", image: REAL_IMAGES.headphonesWhite, Icon: Headphones },
    { name: "Bàn phím", image: REAL_IMAGES.keyboardWhite, Icon: Keyboard },
    { name: "Chuột", image: REAL_IMAGES.hero, Icon: Mouse },
    { name: "Lót chuột", image: REAL_IMAGES.setupDark, Icon: Grid3X3 },
    { name: "Loa", image: REAL_IMAGES.speaker, Icon: Speaker },
    { name: "Webcam", image: REAL_IMAGES.webcam, Icon: Webcam },
    { name: "Giá đỡ", image: REAL_IMAGES.setupDark, Icon: Monitor },
    { name: "Cáp & Hub", image: REAL_IMAGES.setupDark, Icon: Cable },
  ];

const baseColorOptions: { name: string; className: string }[] = [
  { name: "Đen", className: "bg-black" },
  { name: "Trắng", className: "bg-white border border-zinc-300" },
  { name: "Hồng", className: "bg-pink-300" },
  { name: "Xanh lá", className: "bg-emerald-400" },
  { name: "Xanh dương", className: "bg-cyan-500" },
  { name: "Tím", className: "bg-violet-500" },
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

const comboItems = [
  {
    title: "Combo Gaming",
    desc: "Tai nghe + Chuột +\nLót chuột",
    save: "Tiết kiệm 15%",
    image: REAL_IMAGES.setupDark,
    Icon: Headphones,
  },
  {
    title: "Combo Văn phòng",
    desc: "Bàn phím + Chuột",
    save: "Tiết kiệm 10%",
    image: REAL_IMAGES.keyboardWhite,
    Icon: Keyboard,
  },
  {
    title: "Combo Streamer",
    desc: "Webcam + Micro +\nĐèn LED",
    save: "Tiết kiệm 15%",
    image: REAL_IMAGES.webcam,
    Icon: Webcam,
  },
  {
    title: "Combo Phụ kiện cao cấp",
    desc: "Tai nghe + Giá đỡ +\nHub chuyển đổi",
    save: "Tiết kiệm 20%",
    image: REAL_IMAGES.headphonesWhite,
    Icon: Headphones,
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

export default function PhuKienIndex() {
  const [products, setProducts] = useState<AccessoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

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

  const brands = useMemo(() => {
    return [...new Set(products.map((product) => product.brand).filter(Boolean))];
  }, [products]);

  const colorOptions = useMemo(() => {
    const productColors = [
      ...new Set(products.flatMap((product) => product.colors || [])),
    ];

    const extraColors = productColors
      .filter((color) => !baseColorOptions.some((item) => item.name === color))
      .map((color) => ({ name: color, className: "bg-zinc-300" }));

    return [...baseColorOptions, ...extraColors];
  }, [products]);

  const hasActiveFilter =
    selectedCategories.size > 0 ||
    selectedBrands.size > 0 ||
    selectedColors.size > 0 ||
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

      const matchPrice = product.price <= maxPrice;

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
  }, [products, selectedCategories, selectedBrands, selectedColors, sortBy, maxPrice]);

  const resetFilters = () => {
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setSelectedColors(new Set());
    setMaxPrice(highestPrice);
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
              <button className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-[13px] font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-zinc-800 active:scale-95">
                Khám phá ngay
                <ChevronRight className="h-4 w-4" />
              </button>

              <button className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-7 py-3.5 text-[13px] font-bold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white active:scale-95">
                Xem phụ kiện
                <ChevronRight className="h-4 w-4" />
              </button>
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

            <a
              href="#"
              className="flex items-center gap-1 text-[13px] font-medium text-zinc-700 transition hover:text-zinc-950"
            >
              Xem tất cả
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map(({ name, image, Icon }) => (
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
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[245px_1fr]">
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
                {categories.slice(0, 8).map((cat) => (
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

                {categories.length > 8 && (
                  <button className="mt-2 flex items-center gap-1 text-[12px] font-medium text-zinc-600">
                    Hiển thị thêm
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="mb-3 text-[13px] font-semibold text-zinc-900">Giá</h4>

                <p className="mb-3 text-center text-[11px] text-zinc-500">
                  100.000đ - {formatPrice(maxPrice)}
                </p>

                <input
                  type="range"
                  min={100000}
                  max={highestPrice}
                  step={100000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-zinc-950"
                />

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-zinc-200 bg-white px-2 py-2 text-center text-[11px] text-zinc-600">
                    100.000đ
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-white px-2 py-2 text-center text-[11px] text-zinc-600">
                    {formatPrice(maxPrice)}
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="mb-3 text-[13px] font-semibold text-zinc-900">Thương hiệu</h4>

                {brands.length === 0 ? (
                  <p className="text-[12px] text-zinc-400">Chưa có thương hiệu</p>
                ) : (
                  brands.slice(0, 5).map((brand) => (
                    <FilterCheckbox
                      key={brand}
                      label={brand}
                      count={products.filter((p) => p.brand === brand).length}
                      checked={selectedBrands.has(brand)}
                      onChange={() => setSelectedBrands((prev) => toggleSetValue(prev, brand))}
                    />
                  ))
                )}

                {brands.length > 5 && (
                  <button className="mt-2 flex items-center gap-1 text-[12px] font-medium text-zinc-600">
                    Hiển thị thêm
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="mb-3 text-[13px] font-semibold text-zinc-900">Màu sắc</h4>

                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColors((prev) => toggleSetValue(prev, color.name))}
                      className={`h-5 w-5 rounded-full ring-offset-2 transition ${color.className} ${selectedColors.has(color.name) ? "ring-2 ring-zinc-950" : ""
                        }`}
                    />
                  ))}
                </div>

                {colorOptions.length > 6 && (
                  <button className="mt-4 flex items-center gap-1 text-[12px] font-medium text-zinc-600">
                    Hiển thị thêm
                    <ChevronDown className="h-3.5 w-3.5" />
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
                {filteredProducts.map((product) => {
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

                        <p className="mb-3 text-[15px] font-bold text-zinc-950">
                          {formatPrice(product.price)}
                        </p>

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
          </div>
        </section>

        {/* COMBOS */}
        <section className="py-14 md:py-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[19px] font-bold tracking-tight text-zinc-950">
              Có thể bạn sẽ cần
            </h2>

            <a
              href="#"
              className="flex items-center gap-1 text-[13px] font-medium text-zinc-700 transition hover:text-zinc-950"
            >
              Xem tất cả
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {comboItems.map(({ title, desc, save, image, Icon }) => (
              <article
                key={title}
                className="group grid min-h-[138px] grid-cols-[1fr_150px] overflow-hidden rounded-[20px] bg-[#fbfbfd] shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.07)]"
              >
                <div className="p-5">
                  <h3 className="mb-2 text-[13px] font-bold text-zinc-950">
                    {title}
                  </h3>
                  <p className="mb-3 whitespace-pre-line text-[12px] leading-relaxed text-zinc-500">
                    {desc}
                  </p>
                  <p className="text-[12px] font-medium text-red-500">{save}</p>
                </div>

                <div className="flex items-center justify-center overflow-hidden bg-white p-0">
                  <ImageWithFallback
                    src={image}
                    alt={title}
                    Icon={Icon}
                    className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                    iconClassName="h-16 w-16 text-zinc-900"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}