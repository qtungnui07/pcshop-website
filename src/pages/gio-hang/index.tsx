import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart, formatCartPrice, parseCartPrice } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const getCheckoutSelectionKey = (userId: string) => `pcshop_checkout_selection_${userId}`;

const titleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const titleWordVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.85, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 20,
    },
  },
};

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    setSelectedIds((current) => {
      const validIds = new Set(items.map((item) => item.id));
      const next = new Set([...current].filter((id) => validIds.has(id)));

      if (current.size === 0 && items.length > 0) {
        return new Set(items.map((item) => item.id));
      }

      return next;
    });
  }, [items]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const selectedTotalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + parseCartPrice(item.price) * item.quantity,
    0
  );
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleItem = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setCartError("");
    setSelectedIds(allSelected ? new Set() : new Set(items.map((item) => item.id)));
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      setCartError("Vui lòng chọn ít nhất một sản phẩm để xóa.");
      return;
    }

    selectedItems.forEach((item) => removeItem(item.id));
    setSelectedIds(new Set());
    setCartError("");
  };

  const handleClearCart = () => {
    clearCart();
    setSelectedIds(new Set());
    setCartError("");
  };

  const handleGoCheckout = () => {
    setCartError("");

    if (!user) {
      setCartError("Vui lòng đăng nhập để thanh toán.");
      return;
    }

    if (selectedItems.length === 0) {
      setCartError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    localStorage.setItem(
      getCheckoutSelectionKey(user.id || user.email),
      JSON.stringify(selectedItems.map((item) => item.id))
    );

    navigate("/gio-hang/thanh-toan");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-16 pt-28 text-[#1d1d1f]">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
        >
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_330px] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-zinc-200 bg-[#fbfbfd] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Giỏ hàng
              </p>
              <motion.h1
                variants={titleContainerVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-zinc-950 md:text-6xl"
              >
                <span className="block">
                  {["Chọn", "sản", "phẩm"].map((word, idx) => (
                    <motion.span
                      key={`w1-${idx}`}
                      variants={titleWordVariants}
                      className="inline-block mr-[0.25em] last:mr-0 cursor-default transition-transform hover:scale-105"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <span className="block">
                  {["cần", "thanh", "toán."].map((word, idx) => (
                    <motion.span
                      key={`w2-${idx}`}
                      variants={titleWordVariants}
                      className="inline-block mr-[0.25em] last:mr-0 cursor-default transition-transform hover:scale-105"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>
              <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-zinc-500">
                Bạn có thể mua toàn bộ giỏ hàng hoặc chỉ chọn một vài sản phẩm. Các sản phẩm chưa chọn sẽ vẫn được giữ lại trong giỏ.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#f5f5f7] p-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <span className="text-sm font-bold text-zinc-500">Tổng giỏ hàng</span>
                <span className="text-sm font-extrabold text-zinc-950">{totalItems} sản phẩm</span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <span className="text-sm font-bold text-zinc-500">Đang chọn</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-500">{selectedTotalItems} sản phẩm</p>
                  <motion.p
                    key={selectedTotalPrice}
                    initial={{ scale: 1.1, color: "#18181b" }}
                    animate={{ scale: 1, color: "#09090b" }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl font-extrabold tracking-tight text-zinc-950"
                  >
                    {formatCartPrice(selectedTotalPrice)}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.section
              key="empty-cart"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-[34px] border border-zinc-200 bg-white px-6 py-20 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#f5f5f7] text-zinc-400"
              >
                <ShoppingBag className="h-9 w-9" />
              </motion.div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-zinc-500">
                Hãy chọn PC, laptop, linh kiện hoặc phụ kiện rồi thêm vào giỏ hàng.
              </p>
              <Link
                to="/store"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-bold text-white transition hover:bg-zinc-800 active:scale-95"
              >
                Tiếp tục mua hàng
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.section>
          ) : (
            <motion.div
              key="cart-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]"
            >
              <section className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                <div className="flex flex-col gap-4 border-b border-zinc-100 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Sản phẩm trong giỏ
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight text-zinc-950">
                      Chọn mặt hàng muốn mua
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={toggleSelectAll}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          allSelected ? "border-zinc-950 bg-zinc-950" : "border-zinc-300 bg-white"
                        }`}
                      >
                        {allSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </span>
                      {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleDeleteSelected}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa đã chọn
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleClearCart}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 text-xs font-bold text-white transition hover:bg-zinc-800"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Xóa tất cả
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {cartError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="mx-5 overflow-hidden rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 md:mx-6"
                    >
                      {cartError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="divide-y divide-zinc-100">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => {
                      const checked = selectedIds.has(item.id);
                      return (
                        <motion.article
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -60, scale: 0.95, transition: { duration: 0.22 } }}
                          transition={{ layout: { type: "spring", stiffness: 400, damping: 32 } }}
                          className={`grid gap-4 p-4 transition md:p-5 xl:grid-cols-[40px_116px_1fr_auto] xl:items-center ${
                            checked ? "bg-white" : "bg-[#fbfbfd] opacity-75"
                          }`}
                        >
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
                              checked
                                ? "border-zinc-950 bg-zinc-950 text-white"
                                : "border-zinc-300 bg-white text-transparent hover:border-zinc-500"
                            }`}
                            aria-label={checked ? "Bỏ chọn sản phẩm" : "Chọn sản phẩm"}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </motion.button>

                          <div className="flex h-[108px] w-[108px] items-center justify-center overflow-hidden rounded-[24px] border border-zinc-100 bg-[#f5f5f7]">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-contain p-3 transition duration-300 hover:scale-105"
                              />
                            ) : (
                              <ShoppingBag className="h-8 w-8 text-zinc-300" />
                            )}
                          </div>

                          <div className="min-w-0">
                            {item.category && (
                              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                                {item.category}
                              </p>
                            )}
                            <h3 className="text-[16px] font-extrabold leading-snug tracking-tight text-zinc-950">
                              {item.name}
                            </h3>
                            {item.specs && (
                              <p className="mt-2 max-w-2xl whitespace-pre-line text-xs font-medium leading-5 text-zinc-500">
                                {item.specs}
                              </p>
                            )}
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <p className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-extrabold text-zinc-950">
                                {formatCartPrice(item.price)}
                              </p>
                              <span className="text-xs font-semibold text-zinc-400">
                                Tổng dòng: {formatCartPrice(parseCartPrice(item.price) * item.quantity)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 xl:flex-col xl:items-end">
                            <div className="flex items-center overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm">
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-10 w-10 items-center justify-center text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
                                aria-label="Giảm số lượng"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </motion.button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.25 }}
                                animate={{ scale: 1 }}
                                className="min-w-9 text-center text-sm font-extrabold text-zinc-950"
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-10 w-10 items-center justify-center text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
                                aria-label="Tăng số lượng"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </motion.button>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-zinc-50 px-4 text-xs font-bold text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
                              aria-label="Xóa sản phẩm"
                            >
                              <Trash2 className="h-4 w-4" />
                              Xóa
                            </motion.button>
                          </div>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </section>

              <aside className="h-fit space-y-5 lg:sticky lg:top-28">
                <section className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-6">
                  <h2 className="text-xl font-extrabold tracking-tight text-zinc-950">
                    Tóm tắt lựa chọn
                  </h2>

                  <div className="mt-5 space-y-3 border-b border-zinc-100 pb-5 text-sm font-semibold text-zinc-500">
                    <div className="flex items-center justify-between">
                      <span>Tổng giỏ hàng</span>
                      <span className="font-extrabold text-zinc-950">{formatCartPrice(totalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Số lượng đã chọn</span>
                      <span className="font-extrabold text-zinc-950">{selectedTotalItems}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Chưa chọn</span>
                      <span className="font-extrabold text-zinc-950">
                        {Math.max(0, totalItems - selectedTotalItems)} sản phẩm
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <span className="text-sm font-bold text-zinc-500">Cần thanh toán</span>
                    <motion.span
                      key={selectedTotalPrice}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-extrabold tracking-tight text-zinc-950"
                    >
                      {formatCartPrice(selectedTotalPrice)}
                    </motion.span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleGoCheckout}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 text-sm font-extrabold text-white transition hover:bg-zinc-800"
                  >
                    Thanh toán sản phẩm đã chọn
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>

                  <p className="mt-3 text-center text-xs font-semibold leading-5 text-zinc-400">
                    Các sản phẩm chưa chọn sẽ tiếp tục nằm trong giỏ hàng sau khi thanh toán.
                  </p>
                </section>

                <section className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-zinc-950">Gợi ý thao tác</h3>
                  <div className="mt-4 space-y-3 text-sm font-semibold text-zinc-600">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-zinc-950" />
                      Chọn từng sản phẩm để mua riêng
                    </div>
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-4 w-4 text-zinc-950" />
                      Sản phẩm chưa chọn vẫn được giữ lại
                    </div>
                    <div className="flex items-center gap-3">
                      <Trash2 className="h-4 w-4 text-zinc-950" />
                      Có thể xóa riêng hoặc xóa toàn bộ
                    </div>
                  </div>
                </section>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
