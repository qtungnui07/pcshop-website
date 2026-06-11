import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ImageIcon, Plus, Search, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type BuildProduct = {
  id: string;
  name: string;
  specs: string;
  price: string;
  category: string;
  image?: string;
  source: "component" | "accessory";
};

type RawComponent = {
  name?: string;
  specs?: string;
  price?: string | number;
  category?: string;
  image?: string;
};

type RawAccessory = {
  id?: string | number;
  name?: string;
  brand?: string;
  category?: string;
  price?: string | number;
  image?: string;
};

type BuildSlot = {
  id: string;
  label: string;
  buttonLabel: string;
  note?: string;
  match: (product: BuildProduct) => boolean;
};

const API_BASE =
  typeof window !== "undefined"
    ? (window.location.hostname.includes("qtitpc.dev")
      ? "https://api-pc.qtitpc.dev"
      : `${window.location.protocol}//${window.location.hostname}:3001`)
    : "http://localhost:3001";

const parsePrice = (price: string) => Number(price.replace(/\D/g, "")) || 0;

const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN").format(price) + "đ";

const normalizePrice = (price: string | number | undefined) => {
  if (typeof price === "number") return formatPrice(price);
  return price || "0đ";
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

const BUILD_SLOTS: BuildSlot[] = [
  {
    id: "cpu",
    label: "Bộ vi xử lý",
    buttonLabel: "Chọn Bộ vi xử lý",
    note: "Giá tốt nhất thị trường",
    match: (product) => normalizeText(product.category) === "cpu",
  },
  {
    id: "mainboard",
    label: "Bo mạch chủ",
    buttonLabel: "Chọn Bo mạch chủ",
    match: (product) => normalizeText(product.category) === "mainboard",
  },
  {
    id: "ram",
    label: "RAM",
    buttonLabel: "Chọn RAM",
    note: "Giá tốt nhất thị trường",
    match: (product) => normalizeText(product.category) === "ram",
  },
  {
    id: "hdd",
    label: "HDD",
    buttonLabel: "Chọn HDD",
    match: (product) => normalizeText(product.category) === "hdd",
  },
  {
    id: "ssd",
    label: "SSD",
    buttonLabel: "Chọn SSD",
    note: "Giá tốt nhất thị trường",
    match: (product) => normalizeText(product.category) === "ssd",
  },
  {
    id: "vga",
    label: "VGA",
    buttonLabel: "Chọn VGA",
    note: "Giá tốt nhất thị trường",
    match: (product) => normalizeText(product.category) === "vga",
  },
  {
    id: "psu",
    label: "Nguồn",
    buttonLabel: "Chọn Nguồn",
    match: (product) => normalizeText(product.category) === "psu",
  },
  {
    id: "case",
    label: "Vỏ Case",
    buttonLabel: "Chọn Vỏ Case",
    match: (product) => normalizeText(product.category) === "case",
  },
  {
    id: "monitor",
    label: "Màn hình",
    buttonLabel: "Chọn Màn hình",
    match: (product) => normalizeText(product.category) === "man hinh",
  },
  {
    id: "keyboard",
    label: "Bàn phím",
    buttonLabel: "Chọn Bàn phím",
    match: (product) => normalizeText(product.category) === "ban phim",
  },
  {
    id: "mouse",
    label: "Chuột",
    buttonLabel: "Chọn Chuột",
    match: (product) => normalizeText(product.category) === "chuot",
  },
  {
    id: "headset",
    label: "Tai nghe",
    buttonLabel: "Chọn Tai nghe",
    match: (product) => normalizeText(product.category) === "tai nghe",
  },
  {
    id: "speaker",
    label: "Loa",
    buttonLabel: "Chọn Loa",
    match: (product) => normalizeText(product.category) === "loa",
  },
];

export default function TuBuildPcIndex() {
  const [products, setProducts] = useState<BuildProduct[]>([]);
  const [selected, setSelected] = useState<Record<string, BuildProduct>>({});
  const [activeSlot, setActiveSlot] = useState<BuildSlot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`${API_BASE}/api/components`).then((res) => (res.ok ? res.json() : [])),
      fetch(`${API_BASE}/api/accessories`).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([components, accessories]: [RawComponent[], RawAccessory[]]) => {
        const componentItems = components.map((item, index): BuildProduct => ({
          id: `component-${index}-${item.name || "item"}`,
          name: item.name || "Linh kiện",
          specs: item.specs || "",
          price: normalizePrice(item.price),
          category: item.category || "Linh kiện",
          image: item.image,
          source: "component",
        }));

        const accessoryItems = accessories.map((item, index): BuildProduct => ({
          id: `accessory-${item.id || index}`,
          name: item.name || "Phụ kiện",
          specs: [item.brand, item.category].filter(Boolean).join(" • "),
          price: normalizePrice(item.price),
          category: item.category || "Phụ kiện",
          image: item.image,
          source: "accessory",
        }));

        setProducts([...componentItems, ...accessoryItems]);
      })
      .catch((err) => {
        console.error("Error loading build products:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeSlot) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeSlot]);

  const totalPrice = useMemo(
    () => Object.values(selected).reduce((sum, product) => sum + parsePrice(product.price), 0),
    [selected]
  );

  const selectableProducts = useMemo(() => {
    if (!activeSlot) return [];

    const q = normalizeText(searchQuery.trim());
    return products
      .filter(activeSlot.match)
      .filter((product) => {
        if (!q) return true;
        return normalizeText(`${product.name} ${product.specs} ${product.category}`).includes(q);
      })
      .slice(0, 50);
  }, [activeSlot, products, searchQuery]);

  const closePicker = () => {
    setActiveSlot(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-zinc-400 mb-3">PC Builder</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950">Tự build PC</h1>
            <p className="mt-3 text-sm text-zinc-500 max-w-2xl">
              Chọn linh kiện có sẵn trong database, xem cấu hình và tổng chi phí ngay trên một bảng đơn giản.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-zinc-100 px-5 py-4 shadow-sm min-w-[240px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Tổng tạm tính</p>
            <p className="mt-1 text-2xl font-extrabold text-zinc-950">{formatPrice(totalPrice)}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="hidden md:grid grid-cols-[180px_1fr] bg-zinc-950 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">
            <div>Danh mục</div>
            <div>Linh kiện đã chọn</div>
          </div>

          {BUILD_SLOTS.map((slot, index) => {
            const chosen = selected[slot.id];

            return (
              <div
                key={slot.id}
                className={`grid min-h-[72px] grid-cols-1 items-center gap-3 border-t border-zinc-100 px-4 py-3 md:grid-cols-[180px_1fr] ${
                  index % 2 === 0 ? "bg-white" : "bg-zinc-50"
                }`}
              >
                <div className="flex items-center text-sm font-extrabold text-zinc-900">
                  {index + 1}. {slot.label}
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  {chosen ? (
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-14 w-14 shrink-0 rounded-xl border border-zinc-100 bg-white flex items-center justify-center overflow-hidden">
                        {chosen.image ? (
                          <img src={chosen.image} alt={chosen.name} className="max-h-full max-w-full object-contain p-1" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-zinc-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-zinc-950">{chosen.name}</p>
                        <p className="truncate text-xs text-zinc-400">{chosen.specs || chosen.category}</p>
                      </div>
                      <p className="shrink-0 text-sm font-extrabold text-zinc-950">{chosen.price}</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveSlot(slot)}
                        className="inline-flex min-w-[150px] items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white/80 px-3 py-2 text-xs font-extrabold text-zinc-950 shadow-sm backdrop-blur hover:bg-white active:scale-95 transition cursor-pointer"
                      >
                        <Plus className="h-4 w-4" /> {slot.buttonLabel}
                      </button>
                      {slot.note && (
                        <span className="hidden sm:inline text-xs font-extrabold uppercase italic tracking-wide text-zinc-300">
                          {slot.note}
                        </span>
                      )}
                    </div>
                  )}

                  {chosen && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveSlot(slot)}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
                      >
                        Đổi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = { ...selected };
                          delete next[slot.id];
                          setSelected(next);
                        }}
                        className="rounded-lg border border-red-100 px-3 py-2 text-red-600 hover:bg-red-50 transition cursor-pointer"
                        aria-label={`Xóa ${slot.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-extrabold text-zinc-950">Cấu hình hiện tại</p>
            <p className="text-xs text-zinc-400">
              Đã chọn {Object.keys(selected).length}/{BUILD_SLOTS.length} hạng mục.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelected({})}
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
          >
            Xóa tất cả
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeSlot && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/25 px-4 py-8 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={closePicker}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onMouseDown={(event) => event.stopPropagation()}
              className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              style={{
                width: "min(860px, calc(100vw - 32px))",
                height: "min(760px, calc(100dvh - 128px))",
                maxHeight: "calc(100dvh - 128px)",
              }}
            >
              <div className="shrink-0 flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Chọn linh kiện</p>
                  <h2 className="text-lg font-extrabold text-zinc-950">{activeSlot.label}</h2>
                </div>
                <button
                  type="button"
                  onClick={closePicker}
                  className="h-9 w-9 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 flex items-center justify-center cursor-pointer"
                  aria-label="Đóng"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="shrink-0 border-b border-zinc-100 px-5 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={`Tìm trong ${activeSlot.label}...`}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3"
                onWheel={(event) => event.stopPropagation()}
                onTouchMove={(event) => event.stopPropagation()}
              >
                {loading ? (
                  <div className="flex h-40 items-center justify-center text-sm font-bold text-zinc-400">
                    Đang tải dữ liệu...
                  </div>
                ) : selectableProducts.length === 0 ? (
                  <div className="flex h-40 items-center justify-center text-sm font-bold text-zinc-400">
                    Chưa có sản phẩm phù hợp trong database.
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {selectableProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          setSelected({ ...selected, [activeSlot.id]: product });
                          closePicker();
                        }}
                        className="group flex items-center gap-3 rounded-xl border border-zinc-100 bg-white p-2 text-left shadow-sm hover:border-red-100 hover:bg-red-50/30 transition cursor-pointer"
                      >
                        <div className="h-16 w-16 shrink-0 rounded-xl border border-zinc-100 bg-white flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain p-1" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-zinc-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold text-zinc-950 group-hover:text-red-600">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-zinc-400">{product.specs || product.category}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-sm font-extrabold text-zinc-950">{product.price}</p>
                          <span className="hidden rounded-lg bg-zinc-950 px-3 py-2 text-xs font-extrabold text-white group-hover:bg-red-600 sm:inline-flex">
                            Chọn
                          </span>
                          <CheckCircle2 className="h-5 w-5 text-zinc-300 group-hover:text-red-600 sm:hidden" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
