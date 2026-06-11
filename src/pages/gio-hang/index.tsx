import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, Loader2, Minus, Plus, QrCode, ShoppingBag, Smartphone, Trash2 } from "lucide-react";
import { useCart, formatCartPrice, parseCartPrice } from "../../context/CartContext";
import { API_BASE, useAuth } from "../../context/AuthContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"MOMO_FAKE" | "BANK_QR_FAKE">("MOMO_FAKE");
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (!user) return;
    setCustomerName(user.name || "");
    setPhone(user.phone || "");
    setAddress(user.address || "");
  }, [user]);

  const handleCheckout = async (event: FormEvent) => {
    event.preventDefault();
    setCheckoutError("");

    if (!user) {
      setCheckoutError("Vui lòng đăng nhập để thanh toán.");
      return;
    }

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setCheckoutError("Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ nhận hàng.");
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          customerName: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          note: note.trim(),
          items,
          totalItems,
          totalPrice,
          paymentMethod,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể tạo đơn hàng.");
      }

      clearCart();
      navigate("/don-hang");
    } catch (error: any) {
      setCheckoutError(error.message || "Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-28 pb-16">
      <div className="mx-auto max-w-[1180px] px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              Giỏ hàng
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
              Sản phẩm đã chọn
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            >
              Xóa giỏ hàng
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-extrabold text-zinc-950">Giỏ hàng đang trống</h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-zinc-500">
              Chọn sản phẩm bằng nút dấu cộng trên card để thêm vào giỏ hàng.
            </p>
            <Link
              to="/store"
              className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 border-b border-zinc-100 p-4 last:border-b-0 sm:grid-cols-[96px_1fr_auto] sm:items-center"
                >
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain p-2" />
                    ) : (
                      <ShoppingBag className="h-7 w-7 text-zinc-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    {item.category && (
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                        {item.category}
                      </p>
                    )}
                    <h2 className="text-[15px] font-extrabold leading-snug text-zinc-950">{item.name}</h2>
                    {item.specs && (
                      <p className="mt-1 max-w-xl whitespace-pre-line text-xs font-medium leading-5 text-zinc-500">
                        {item.specs}
                      </p>
                    )}
                    <p className="mt-3 text-sm font-extrabold text-zinc-950">{formatCartPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="flex items-center overflow-hidden rounded-full border border-zinc-200 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-extrabold text-zinc-950">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-sm font-extrabold text-zinc-950">
                        {formatCartPrice(parseCartPrice(item.price) * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-zinc-950">Tổng đơn</h2>
              <div className="mt-5 space-y-3 border-b border-zinc-100 pb-5 text-sm font-semibold text-zinc-500">
                <div className="flex items-center justify-between">
                  <span>Số lượng</span>
                  <span className="text-zinc-950">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tạm tính</span>
                  <span className="text-zinc-950">{formatCartPrice(totalPrice)}</span>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-500">Tổng cộng</span>
                <span className="text-2xl font-extrabold text-zinc-950">{formatCartPrice(totalPrice)}</span>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(true)}
                className="mt-6 h-12 w-full rounded-full bg-zinc-950 text-sm font-extrabold text-white transition hover:bg-zinc-800 active:scale-[0.99] cursor-pointer"
              >
                Thanh toán
              </button>
            </aside>
          </div>
        )}

        {items.length > 0 && checkoutOpen && (
          <form
            onSubmit={handleCheckout}
            className="mt-6 grid gap-6 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_360px]"
          >
            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Thanh toán
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold text-zinc-950">Thông tin nhận hàng</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-500 transition hover:bg-zinc-50 cursor-pointer"
                >
                  Đóng
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-zinc-500">Họ tên</span>
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-400"
                    placeholder="Nguyễn Văn A"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-zinc-500">Số điện thoại</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-400"
                    placeholder="09xx xxx xxx"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-bold text-zinc-500">Địa chỉ nhận hàng</span>
                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="min-h-24 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-400"
                  placeholder="Số nhà, phường/xã, quận/huyện, tỉnh/thành..."
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-bold text-zinc-500">Ghi chú</span>
                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-400"
                  placeholder="Ví dụ: giao buổi tối, gọi trước khi giao..."
                />
              </label>

              {checkoutError && (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
                  {checkoutError}
                </p>
              )}
            </section>

            <aside className={`rounded-3xl p-5 text-white ${paymentMethod === "MOMO_FAKE" ? "bg-[#a50064]" : "bg-zinc-950"}`}>
              <div className="flex items-center gap-2 text-sm font-extrabold">
                {paymentMethod === "MOMO_FAKE" ? <Smartphone className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
                {paymentMethod === "MOMO_FAKE" ? "MoMo giả lập" : "QR ngân hàng giả lập"}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-white/10 p-1">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("MOMO_FAKE")}
                  className={`flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    paymentMethod === "MOMO_FAKE" ? "bg-white text-[#a50064]" : "text-white/75 hover:bg-white/10"
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  MoMo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("BANK_QR_FAKE")}
                  className={`flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    paymentMethod === "BANK_QR_FAKE" ? "bg-white text-zinc-950" : "text-white/75 hover:bg-white/10"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  QR Bank
                </button>
              </div>

              <div className="mt-4 rounded-2xl bg-white p-4">
                {paymentMethod === "MOMO_FAKE" && (
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a50064] text-lg font-black text-white">
                      M
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#a50064]">MoMo Pay Demo</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">Sandbox fake</p>
                    </div>
                  </div>
                )}
                <div className="relative grid aspect-square grid-cols-9 gap-1 overflow-hidden rounded-xl bg-white p-1">
                  {Array.from({ length: 81 }).map((_, index) => {
                    const active =
                      index % 2 === 0 ||
                      index % 7 === 0 ||
                      index === 40 ||
                      (paymentMethod === "MOMO_FAKE" && (index % 11 === 0 || index === 22 || index === 58));

                    return (
                      <span
                        key={index}
                        className={`rounded-[3px] ${
                          active
                            ? paymentMethod === "MOMO_FAKE"
                              ? "bg-[#a50064]"
                              : "bg-zinc-950"
                            : "bg-zinc-100"
                        }`}
                      />
                    );
                  })}
                  <div className={`absolute left-3 top-3 h-10 w-10 rounded-md border-[6px] ${paymentMethod === "MOMO_FAKE" ? "border-[#a50064]" : "border-zinc-950"} bg-white`} />
                  <div className={`absolute right-3 top-3 h-10 w-10 rounded-md border-[6px] ${paymentMethod === "MOMO_FAKE" ? "border-[#a50064]" : "border-zinc-950"} bg-white`} />
                  <div className={`absolute bottom-3 left-3 h-10 w-10 rounded-md border-[6px] ${paymentMethod === "MOMO_FAKE" ? "border-[#a50064]" : "border-zinc-950"} bg-white`} />
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-4 text-white/70">
                  <span>Phương thức</span>
                  <span className="font-bold text-white">{paymentMethod === "MOMO_FAKE" ? "Ví MoMo demo" : "Chuyển khoản demo"}</span>
                </div>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span>Nội dung</span>
                  <span className="font-bold text-white">PCSTORE-{user?.id?.slice(-5) || "ORDER"}</span>
                </div>
                <div className="flex justify-between gap-4 text-zinc-300">
                  <span>Số tiền</span>
                  <span className="font-extrabold text-white">{formatCartPrice(totalPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-extrabold text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xác nhận...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Tôi đã thanh toán
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[11px] font-semibold leading-5 text-zinc-400">
                Đây là thanh toán giả lập: không trừ tiền, bấm xác nhận là hệ thống tự tạo đơn thành công.
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
