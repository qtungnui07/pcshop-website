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
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

/*
  src/pages/phu-kien/index.tsx

  Style: premium / Apple-like / clean ecommerce.
  Ảnh đang dùng là ảnh thật từ Unsplash CDN. Nếu muốn ổn định lâu dài hơn,
  hãy tải ảnh về public/accessories/ rồi đổi URL trong mảng REAL_IMAGES.
*/

type AccessoryCategory =
  | "Tai nghe"
  | "Bàn phím"
  | "Chuột"
  | "Lót chuột"
  | "Loa"
  | "Webcam"
  | "Giá đỡ"
  | "Cáp & Hub";

type ProductColor = "Đen" | "Trắng" | "Hồng" | "Xanh lá" | "Xanh dương" | "Tím";

type AccessoryProduct = {
  id: number;
  name: string;
  brand: string;
  category: AccessoryCategory;
  price: number;
  badge?: string;
  colors: ProductColor[];
  image: string;
  fallbackIcon: React.ElementType;
};

const REAL_IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1707858004668-d33b9a1d1956?auto=format&fit=crop&w=1600&q=85",
  setupDark:
    "https://images.unsplash.com/photo-1707858057802-ab1227691ed5?auto=format&fit=crop&w=1200&q=85",
  keyboardBlack:
    "https://images.unsplash.com/photo-1661588756719-8c7bd8bdc72d?auto=format&fit=crop&w=1200&q=85",
  keyboardWhite:
    "https://images.unsplash.com/photo-1632078965632-575bd4061be4?auto=format&fit=crop&w=1200&q=85",
  keyboardMono:
    "https://images.unsplash.com/photo-1636858508196-d4043dad51fd?auto=format&fit=crop&w=1200&q=85",
  headphonesWhite:
    "https://images.unsplash.com/photo-1713926304458-b8e00dfa9911?auto=format&fit=crop&w=1200&q=85",
  webcam:
    "https://images.unsplash.com/photo-1670278458296-00ff8a63141e?auto=format&fit=crop&w=1200&q=85",
  speaker:
    "https://images.unsplash.com/photo-1715321835688-831f4767cf93?auto=format&fit=crop&w=1200&q=85",
};

const categories: {
  name: AccessoryCategory;
  image: string;
  Icon: React.ElementType;
  count: number;
}[] = [
  { name: "Tai nghe", image: REAL_IMAGES.headphonesWhite, Icon: Headphones, count: 45 },
  { name: "Bàn phím", image: REAL_IMAGES.keyboardWhite, Icon: Keyboard, count: 62 },
  { name: "Chuột", image: REAL_IMAGES.hero, Icon: Mouse, count: 58 },
  { name: "Lót chuột", image: REAL_IMAGES.setupDark, Icon: Grid3X3, count: 32 },
  { name: "Loa", image: REAL_IMAGES.speaker, Icon: Speaker, count: 28 },
  { name: "Webcam", image: REAL_IMAGES.webcam, Icon: Webcam, count: 21 },
  { name: "Giá đỡ", image: REAL_IMAGES.setupDark, Icon: Monitor, count: 18 },
  { name: "Cáp & Hub", image: REAL_IMAGES.setupDark, Icon: Cable, count: 36 },
];

const brands = ["Logitech", "Razer", "HyperX", "Corsair", "Keychron", "UGREEN", "Harman Kardon"];

const colorOptions: { name: ProductColor; className: string }[] = [
  { name: "Đen", className: "bg-black" },
  { name: "Trắng", className: "bg-white border border-zinc-300" },
  { name: "Hồng", className: "bg-pink-300" },
  { name: "Xanh lá", className: "bg-emerald-400" },
  { name: "Xanh dương", className: "bg-cyan-500" },
  { name: "Tím", className: "bg-violet-500" },
];

const products: AccessoryProduct[] = [
  {
    id: 1,
    name: "Logitech G Pro X 2",
    brand: "Logitech",
    category: "Tai nghe",
    price: 3990000,
    badge: "Mới",
    colors: ["Đen", "Trắng"],
    image: REAL_IMAGES.headphonesWhite,
    fallbackIcon: Headphones,
  },
  {
    id: 2,
    name: "Razer BlackWidow V4",
    brand: "Razer",
    category: "Bàn phím",
    price: 4290000,
    badge: "Bán chạy",
    colors: ["Đen"],
    image: REAL_IMAGES.keyboardBlack,
    fallbackIcon: Keyboard,
  },
  {
    id: 3,
    name: "Logitech G Pro X Superlight 2",
    brand: "Logitech",
    category: "Chuột",
    price: 2690000,
    colors: ["Trắng", "Đen", "Hồng"],
    image: REAL_IMAGES.hero,
    fallbackIcon: Mouse,
  },
  {
    id: 4,
    name: "Razer Gigantus V2 Large",
    brand: "Razer",
    category: "Lót chuột",
    price: 490000,
    colors: ["Đen"],
    image: REAL_IMAGES.setupDark,
    fallbackIcon: Grid3X3,
  },
  {
    id: 5,
    name: "Harman Kardon Onyx Studio 8",
    brand: "Harman Kardon",
    category: "Loa",
    price: 5490000,
    colors: ["Đen", "Trắng"],
    image: REAL_IMAGES.speaker,
    fallbackIcon: Speaker,
  },
  {
    id: 6,
    name: "Logitech Brio 4K",
    brand: "Logitech",
    category: "Webcam",
    price: 4690000,
    colors: ["Đen"],
    image: REAL_IMAGES.webcam,
    fallbackIcon: Webcam,
  },
  {
    id: 7,
    name: "Razer Base Station V2 Chroma",
    brand: "Razer",
    category: "Giá đỡ",
    price: 1590000,
    colors: ["Đen"],
    image: REAL_IMAGES.setupDark,
    fallbackIcon: Monitor,
  },
  {
    id: 8,
    name: "UGREEN USB-C Hub 7-in-1",
    brand: "UGREEN",
    category: "Cáp & Hub",
    price: 890000,
    colors: ["Đen", "Trắng"],
    image: REAL_IMAGES.setupDark,
    fallbackIcon: Cable,
  },
  {
    id: 9,
    name: "Keychron K8 Pro",
    brand: "Keychron",
    category: "Bàn phím",
    price: 3190000,
    colors: ["Đen", "Xanh dương"],
    image: REAL_IMAGES.keyboardMono,
    fallbackIcon: Keyboard,
  },
  {
    id: 10,
    name: "HyperX Pulsefire Haste 2",
    brand: "HyperX",
    category: "Chuột",
    price: 1290000,
    colors: ["Trắng", "Đen", "Hồng"],
    image: REAL_IMAGES.hero,
    fallbackIcon: Mouse,
  },
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
  return new Intl.NumberFormat("vi-VN").format(price) + " đ";
}

function toggleSetValue<T>(set: Set<T>, value: T) {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
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

  if (failed) {
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
          className={`h-3.5 w-3.5 rounded-[3px] border transition ${
            checked ? "border-zinc-950 bg-zinc-950" : "border-zinc-300 bg-white"
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
  const [selectedCategories, setSelectedCategories] = useState<Set<AccessoryCategory>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<ProductColor>>(new Set());
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [maxPrice, setMaxPrice] = useState(10_900_000);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const hasActiveFilter =
    selectedCategories.size > 0 ||
    selectedBrands.size > 0 ||
    selectedColors.size > 0 ||
    maxPrice < 10_900_000;

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

    return result;
  }, [selectedCategories, selectedBrands, selectedColors, sortBy, maxPrice]);

  const resetFilters = () => {
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setSelectedColors(new Set());
    setMaxPrice(10_900_000);
  };

  return (
    <div className="bg-white text-[#1d1d1f]">
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-zinc-100 bg-[#f7f7fa]"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          marginTop: "-96px",
          paddingTop: "96px",
        }}
      >
        <div className="relative mx-auto grid min-h-[520px] max-w-[1700px] grid-cols-1 items-center gap-8 px-4 py-12 md:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:px-10 xl:px-12 2xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
            className="z-[2]"
          >
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              Phụ kiện
            </p>

            <h1 className="mb-5 text-[3.25rem] font-black uppercase leading-[0.95] tracking-[-0.05em] text-zinc-950 md:text-[4.8rem] lg:text-[5.15rem]">
              Nâng tầm
              <br />
              trải nghiệm.
            </h1>

            <p className="mb-7 max-w-[410px] text-[15px] leading-[1.75] text-zinc-500">
              Những phụ kiện chất lượng giúp bạn làm việc, giải trí và sáng tạo
              tốt hơn mỗi ngày.
            </p>

            <button className="rounded-lg bg-zinc-950 px-6 py-3 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition hover:bg-zinc-800 active:scale-95">
              Khám phá ngay
            </button>

            <div className="mt-10 grid max-w-[720px] grid-cols-2 gap-x-7 gap-y-5 lg:grid-cols-4">
              {heroBenefits.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-8 w-8 shrink-0 text-zinc-950" strokeWidth={1.45} />
                  <div>
                    <h3 className="text-[12px] font-bold text-zinc-950">{title}</h3>
                    <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-zinc-500">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1], delay: 0.08 }}
            className="relative hidden h-[410px] lg:block"
          >
            <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_52%_50%,rgba(255,255,255,0.95),rgba(247,247,250,0)_62%)]" />

            <ImageWithFallback
              src={REAL_IMAGES.hero}
              alt="Bộ phụ kiện máy tính"
              Icon={Keyboard}
              className="absolute left-[4%] top-[6%] h-[390px] w-[92%] rounded-[32px] object-cover object-center mix-blend-multiply opacity-[0.95] drop-shadow-[0_28px_45px_rgba(0,0,0,0.16)]"
              iconClassName="h-28 w-28 text-zinc-900"
            />

            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f7f7fa] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#f7f7fa] to-transparent" />
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
                className={`group rounded-[20px] border bg-[#fbfbfd] p-3.5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.07)] ${
                  selectedCategories.has(name) ? "border-zinc-900" : "border-zinc-100"
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
            className={`fixed inset-y-0 left-0 z-50 w-[300px] overflow-y-auto bg-white p-5 shadow-2xl transition-transform lg:sticky lg:top-24 lg:z-auto lg:h-fit lg:w-auto lg:translate-x-0 lg:rounded-[20px] lg:border lg:border-zinc-100 lg:shadow-[0_6px_22px_rgba(0,0,0,0.05)] ${
              showMobileFilter ? "translate-x-0" : "-translate-x-full"
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
                {categories.slice(0, 5).map((cat) => (
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

                <button className="mt-2 flex items-center gap-1 text-[12px] font-medium text-zinc-600">
                  Hiển thị thêm
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="mb-3 text-[13px] font-semibold text-zinc-900">Giá</h4>

                <p className="mb-3 text-center text-[11px] text-zinc-500">
                  100.000đ - {formatPrice(maxPrice)}
                </p>

                <input
                  type="range"
                  min={100000}
                  max={10900000}
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

                {brands.slice(0, 5).map((brand) => (
                  <FilterCheckbox
                    key={brand}
                    label={brand}
                    count={products.filter((p) => p.brand === brand).length}
                    checked={selectedBrands.has(brand)}
                    onChange={() => setSelectedBrands((prev) => toggleSetValue(prev, brand))}
                  />
                ))}

                <button className="mt-2 flex items-center gap-1 text-[12px] font-medium text-zinc-600">
                  Hiển thị thêm
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <h4 className="mb-3 text-[13px] font-semibold text-zinc-900">Màu sắc</h4>

                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColors((prev) => toggleSetValue(prev, color.name))}
                      className={`h-5 w-5 rounded-full ring-offset-2 transition ${color.className} ${
                        selectedColors.has(color.name) ? "ring-2 ring-zinc-950" : ""
                      }`}
                    />
                  ))}
                </div>

                <button className="mt-4 flex items-center gap-1 text-[12px] font-medium text-zinc-600">
                  Hiển thị thêm
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
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
                    className={`rounded-md p-2 ${
                      viewMode === "grid" ? "bg-zinc-100 text-zinc-950" : "text-zinc-400"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-md p-2 ${
                      viewMode === "list" ? "bg-zinc-100 text-zinc-950" : "text-zinc-400"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
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
                  const Icon = product.fallbackIcon;

                  return (
                    <article
                      key={product.id}
                      className={`group relative overflow-hidden rounded-[20px] border border-zinc-100 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] ${
                        viewMode === "list" ? "grid grid-cols-[210px_1fr] items-center" : ""
                      }`}
                    >
                      <button
                        onClick={() =>
                          setLiked((prev) => toggleSetValue(prev, product.id))
                        }
                        className="absolute right-4 top-4 z-[2] flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-400 shadow-sm transition hover:text-zinc-950"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isLiked ? "fill-red-500 text-red-500" : ""
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
                          {product.colors.slice(0, 4).map((color) => {
                            const colorClass =
                              colorOptions.find((item) => item.name === color)?.className ??
                              "bg-zinc-300";

                            return (
                              <span
                                key={color}
                                title={color}
                                className={`h-3.5 w-3.5 rounded-full ${colorClass}`}
                              />
                            );
                          })}
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
