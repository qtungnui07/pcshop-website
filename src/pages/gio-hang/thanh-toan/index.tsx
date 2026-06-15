import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
  UserRound,
  WalletCards,
} from "lucide-react";
import QRCode from "qrcode";
import {
  useCart,
  formatCartPrice,
  parseCartPrice,
} from "../../../context/CartContext";
import { API_BASE, useAuth } from "../../../context/AuthContext";

type QRPaymentMethod = "MOMO_FAKE" | "BANK_QR_FAKE";
type CheckoutPaymentMethod = QRPaymentMethod | "COD";

type PaymentSession = {
  id: string;
  status: "pending" | "paid" | "expired";
  orderId?: string;
  paymentMethod: QRPaymentMethod;
  expiresAt: string;
};

const getCheckoutSelectionKey = (userId: string) => `pcshop_checkout_selection_${userId}`;
const getPendingPaymentKey = (userId: string) => `pcshop_pending_payment_${userId}`;

export default function CartCheckoutPage() {
  const { items, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("MOMO_FAKE");
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (!user) return;

    setCustomerName(user.name || "");
    setPhone(user.phone || "");
    setAddress(user.address || "");

    const rawSelection = localStorage.getItem(getCheckoutSelectionKey(user.id || user.email));
    if (rawSelection) {
      try {
        const parsed = JSON.parse(rawSelection);
        if (Array.isArray(parsed)) {
          setSelectedIds(parsed.map(String));
        }
      } catch {
        localStorage.removeItem(getCheckoutSelectionKey(user.id || user.email));
      }
    }

    const rawPendingPayment = localStorage.getItem(getPendingPaymentKey(user.id || user.email));
    if (!rawPendingPayment) return;

    try {
      const saved = JSON.parse(rawPendingPayment) as {
        session: PaymentSession;
        paymentMethod: QRPaymentMethod;
        selectedIds?: string[];
        customerName?: string;
        phone?: string;
        address?: string;
        note?: string;
      };

      if (!saved.session || saved.session.status !== "pending") return;
      if (new Date(saved.session.expiresAt).getTime() <= Date.now()) {
        localStorage.removeItem(getPendingPaymentKey(user.id || user.email));
        return;
      }

      const qrUrl = `${window.location.origin}/thanh-toan-ao/${saved.session.id}`;
      QRCode.toDataURL(qrUrl, {
        width: 420,
        margin: 1,
        color: {
          dark: saved.paymentMethod === "MOMO_FAKE" ? "#a50064" : "#09090b",
          light: "#ffffff",
        },
      }).then((image) => {
        setStep(2);
        setPaymentMethod(saved.paymentMethod);
        setPaymentSession(saved.session);
        setQrDataUrl(image);
        setSelectedIds(saved.selectedIds || []);
        setCustomerName(saved.customerName || user.name || "");
        setPhone(saved.phone || user.phone || "");
        setAddress(saved.address || user.address || "");
        setNote(saved.note || "");
      });
    } catch {
      localStorage.removeItem(getPendingPaymentKey(user.id || user.email));
    }
  }, [user]);

  const selectedItems = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return items.filter((item) => selectedSet.has(item.id));
  }, [items, selectedIds]);

  const selectedTotalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + parseCartPrice(item.price) * item.quantity,
    0
  );

  const paymentUrl = paymentSession
    ? `${window.location.origin}/thanh-toan-ao/${paymentSession.id}`
    : "";

  const formattedCountdown = `${Math.floor(remainingSeconds / 60)}:${String(
    remainingSeconds % 60
  ).padStart(2, "0")}`;

  useEffect(() => {
    if (!paymentSession) return;

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((new Date(paymentSession.expiresAt).getTime() - Date.now()) / 1000)
      );
      setRemainingSeconds(remaining);
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [paymentSession]);

  useEffect(() => {
    if (!paymentSession || paymentSession.status !== "pending") return;

    const poll = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/payments/${paymentSession.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Không thể kiểm tra thanh toán.");

        const session = data.session as PaymentSession;
        setPaymentSession(session);

        if (session.status === "paid") {
          finishCheckout();
        }

        if (session.status === "expired") {
          clearPendingPayment();
          setCheckoutError("Mã QR đã hết hạn. Vui lòng tạo mã mới.");
        }
      } catch (error: any) {
        setCheckoutError(error.message || "Không thể kiểm tra trạng thái thanh toán.");
      }
    };

    const interval = window.setInterval(poll, 2000);
    return () => window.clearInterval(interval);
  }, [paymentSession, selectedItems]);

  const clearPendingPayment = () => {
    setPaymentSession(null);
    setQrDataUrl("");
    if (user) {
      localStorage.removeItem(getPendingPaymentKey(user.id || user.email));
    }
  };

  const finishCheckout = () => {
    selectedItems.forEach((item) => removeItem(item.id));

    if (user) {
      localStorage.removeItem(getCheckoutSelectionKey(user.id || user.email));
      localStorage.removeItem(getPendingPaymentKey(user.id || user.email));
    }

    navigate("/don-hang");
  };

  const validateShippingInfo = () => {
    if (!user) {
      setCheckoutError("Vui lòng đăng nhập để thanh toán.");
      return false;
    }

    if (selectedItems.length === 0) {
      setCheckoutError("Bạn chưa chọn sản phẩm nào để thanh toán.");
      return false;
    }

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setCheckoutError("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.");
      return false;
    }

    setCheckoutError("");
    return true;
  };

  const handleGoStepTwo = () => {
    if (!validateShippingInfo()) return;
    setStep(2);
  };

  const createOrderPayload = () => {
    if (!user) return null;

    return {
      userId: user.id,
      email: user.email,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim(),
      items: selectedItems,
      totalItems: selectedTotalItems,
      totalPrice: selectedTotalPrice,
      paymentMethod,
    };
  };

  const handleCODCheckout = async () => {
    const orderPayload = createOrderPayload();
    if (!orderPayload) return;

    const response = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...orderPayload,
        paymentMethod: "COD",
        paymentStatus: "pending",
        status: "processing",
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Không thể tạo đơn hàng COD.");
    }

    finishCheckout();
  };

  const handleQRCheckout = async (method: QRPaymentMethod) => {
    const orderPayload = createOrderPayload();
    if (!orderPayload || !user) return;

    const response = await fetch(`${API_BASE}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethod: method,
        orderPayload: { ...orderPayload, paymentMethod: method },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Không thể tạo phiên thanh toán.");
    }

    const session = data.session as PaymentSession;
    const qrUrl = `${window.location.origin}/thanh-toan-ao/${session.id}`;
    const image = await QRCode.toDataURL(qrUrl, {
      width: 420,
      margin: 1,
      color: {
        dark: method === "MOMO_FAKE" ? "#a50064" : "#09090b",
        light: "#ffffff",
      },
    });

    setPaymentSession(session);
    setQrDataUrl(image);

    localStorage.setItem(
      getPendingPaymentKey(user.id || user.email),
      JSON.stringify({
        session,
        paymentMethod: method,
        selectedIds,
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim(),
      })
    );
  };

  const handlePayment = async () => {
    if (!validateShippingInfo()) return;

    setSubmitting(true);
    setCheckoutError("");

    try {
      if (paymentMethod === "COD") {
        await handleCODCheckout();
      } else {
        await handleQRCheckout(paymentMethod);
      }
    } catch (error: any) {
      setCheckoutError(error.message || "Không thể xử lý thanh toán. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] px-4 pb-16 pt-28 text-[#1d1d1f]">
        <div className="mx-auto max-w-xl rounded-[32px] border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-zinc-300" />
          <h1 className="text-2xl font-extrabold text-zinc-950">Vui lòng đăng nhập</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-zinc-500">
            Bạn cần đăng nhập để tiếp tục thanh toán.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-bold text-white"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] px-4 pb-16 pt-28 text-[#1d1d1f]">
        <div className="mx-auto max-w-xl rounded-[32px] border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-zinc-300" />
          <h1 className="text-2xl font-extrabold text-zinc-950">Chưa có sản phẩm thanh toán</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-zinc-500">
            Hãy quay lại giỏ hàng và chọn sản phẩm muốn mua.
          </p>
          <Link
            to="/gio-hang"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-16 pt-28 text-[#1d1d1f]">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <section className="mb-8 overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <Link
                to="/gio-hang"
                className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-zinc-500 transition hover:text-zinc-950"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại giỏ hàng
              </Link>
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-zinc-950 md:text-6xl">
                Thanh toán
                <br className="hidden sm:block" />
                sản phẩm đã chọn.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-zinc-500">
                Hoàn thành thông tin giao hàng ở bước 1, sau đó chọn phương thức thanh toán ở bước 2.
              </p>
            </div>

            <div className="grid gap-3 rounded-[28px] bg-[#f5f5f7] p-3">
              {[
                { id: 1, title: "Thông tin", desc: "Địa chỉ nhận hàng" },
                { id: 2, title: "Thanh toán", desc: "MoMo, Bank QR hoặc COD" },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border px-4 py-3 transition ${step === item.id
                    ? "border-zinc-950 bg-white shadow-sm"
                    : step > item.id
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-transparent bg-white/60"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${step >= item.id ? "bg-zinc-950 text-white" : "bg-zinc-200 text-zinc-500"
                        }`}
                    >
                      {item.id}
                    </span>
                    <p className="text-sm font-extrabold text-zinc-950">Bước {item.id}: {item.title}</p>
                  </div>
                  <p className="mt-1 pl-8 text-xs font-semibold text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-7">
            {step === 1 ? (
              <section className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] md:p-6">
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Bước 1
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-950">
                    Thông tin nhận hàng
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-zinc-500">
                    Thông tin được điền theo hồ sơ đăng nhập nhưng bạn vẫn có thể chỉnh sửa cho đơn hàng này.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                      <UserRound className="h-3.5 w-3.5" />
                      Họ tên
                    </span>
                    <input
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-zinc-200 bg-[#fbfbfd] px-4 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-500 focus:bg-white"
                      placeholder="Nguyễn Văn A"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                      <Phone className="h-3.5 w-3.5" />
                      Số điện thoại
                    </span>
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-zinc-200 bg-[#fbfbfd] px-4 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-500 focus:bg-white"
                      placeholder="09xx xxx xxx"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                    <MapPin className="h-3.5 w-3.5" />
                    Địa chỉ nhận hàng
                  </span>
                  <textarea
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="min-h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-[#fbfbfd] px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-500 focus:bg-white"
                    placeholder="Số nhà, phường/xã, quận/huyện, tỉnh/thành..."
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Ghi chú đơn hàng
                  </span>
                  <input
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-[#fbfbfd] px-4 text-sm font-semibold text-zinc-950 outline-none transition focus:border-zinc-500 focus:bg-white"
                    placeholder="Ví dụ: giao buổi tối, gọi trước khi giao..."
                  />
                </label>

                {checkoutError && (
                  <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {checkoutError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleGoStepTwo}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 text-sm font-extrabold text-white transition hover:bg-zinc-800 active:scale-[0.99] sm:w-auto sm:px-8"
                >
                  Tiếp tục đến thanh toán
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </section>
            ) : (
              <section className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] md:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Bước 2
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-950">
                      Phương thức thanh toán
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-zinc-500">
                      Chọn một trong ba phương thức thanh toán cho đơn hàng.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setCheckoutError("");
                    }}
                    className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-500 transition hover:bg-zinc-50"
                  >
                    Sửa thông tin
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      id: "MOMO_FAKE" as CheckoutPaymentMethod,
                      title: "MoMo QR",
                      desc: "Tạo mã QR MoMo giả lập",
                      Icon: Smartphone,
                      activeClass: "border-[#a50064] bg-[#fff5fb]",
                      iconClass: "bg-[#a50064] text-white",
                    },
                    {
                      id: "BANK_QR_FAKE" as CheckoutPaymentMethod,
                      title: "Bank QR",
                      desc: "Chuyển khoản ngân hàng demo",
                      Icon: QrCode,
                      activeClass: "border-zinc-950 bg-zinc-50",
                      iconClass: "bg-zinc-950 text-white",
                    },
                    {
                      id: "COD" as CheckoutPaymentMethod,
                      title: "Thanh toán khi nhận hàng",
                      desc: "Tạo đơn hàng COD ngay",
                      Icon: WalletCards,
                      activeClass: "border-emerald-500 bg-emerald-50",
                      iconClass: "bg-emerald-600 text-white",
                    },
                  ].map(({ id, title, desc, Icon, activeClass, iconClass }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(id);
                        setCheckoutError("");
                        if (id !== paymentMethod) {
                          setPaymentSession(null);
                          setQrDataUrl("");
                        }
                      }}
                      className={`rounded-[24px] border p-4 text-left transition ${paymentMethod === id
                        ? activeClass
                        : "border-zinc-200 bg-[#fbfbfd] hover:border-zinc-300"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-zinc-950">{title}</p>
                          <p className="mt-1 text-xs font-semibold leading-5 text-zinc-500">{desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {checkoutError && (
                  <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {checkoutError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={submitting || paymentSession?.status === "pending"}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 text-sm font-extrabold text-white transition hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : paymentSession?.status === "pending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang chờ xác nhận
                    </>
                  ) : paymentMethod === "COD" ? (
                    <>
                      <PackageCheck className="h-4 w-4" />
                      Đặt hàng COD
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4" />
                      Tạo mã QR thanh toán
                    </>
                  )}
                </button>
              </section>
            )}
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-28">
            <section className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-6">
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-950">
                Đơn hàng đã chọn
              </h2>

              <div className="mt-5 max-h-[270px] space-y-3 overflow-y-auto pr-1">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-[#fbfbfd] p-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <ShoppingBag className="h-5 w-5 text-zinc-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-zinc-950">{item.name}</p>
                      <p className="mt-0.5 text-xs font-semibold text-zinc-400">x{item.quantity}</p>
                    </div>
                    <p className="text-xs font-extrabold text-zinc-950">
                      {formatCartPrice(parseCartPrice(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-zinc-100 pt-5 text-sm font-semibold text-zinc-500">
                <div className="flex items-center justify-between">
                  <span>Số lượng</span>
                  <span className="font-extrabold text-zinc-950">{selectedTotalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-extrabold text-emerald-600">Miễn phí</span>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <span className="text-sm font-bold text-zinc-500">Tổng thanh toán</span>
                <span className="text-2xl font-extrabold tracking-tight text-zinc-950">
                  {formatCartPrice(selectedTotalPrice)}
                </span>
              </div>
            </section>

            {step === 2 && paymentMethod !== "COD" && (
              <section className={`overflow-hidden rounded-[30px] p-5 text-white shadow-[0_18px_60px_rgba(15,23,42,0.14)] md:p-6 ${paymentMethod === "MOMO_FAKE" ? "bg-[#a50064]" : "bg-zinc-950"
                }`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold">
                    {paymentMethod === "MOMO_FAKE" ? <Smartphone className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
                    {paymentMethod === "MOMO_FAKE" ? "MoMo QR Demo" : "Bank QR Demo"}
                  </div>
                  {paymentSession?.status === "pending" && (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      {formattedCountdown}
                    </span>
                  )}
                </div>

                <div className="mt-5 rounded-3xl bg-white p-4">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Mã QR thanh toán giả lập"
                      className="aspect-square w-full rounded-2xl bg-white"
                    />
                  ) : (
                    <div className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-zinc-50 text-center">
                      <QrCode className="mb-3 h-12 w-12 text-zinc-300" />
                      <p className="text-sm font-extrabold text-zinc-950">QR sẽ hiện ở đây</p>
                      <p className="mt-1 max-w-[210px] text-xs font-semibold leading-5 text-zinc-400">
                        Chọn phương thức và bấm tạo mã QR.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between gap-4 text-white/70">
                    <span>Phương thức</span>
                    <span className="font-bold text-white">
                      {paymentMethod === "MOMO_FAKE" ? "MoMo QR" : "Bank QR"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-white/70">
                    <span>Nội dung</span>
                    <span className="font-bold text-white">
                      {paymentSession?.id || `PCSTORE-${user.id.slice(-5)}`}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-white/70">
                    <span>Số tiền</span>
                    <span className="font-extrabold text-white">{formatCartPrice(selectedTotalPrice)}</span>
                  </div>

                  {paymentSession && (
                    <a
                      href={paymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block truncate rounded-2xl bg-white/10 px-3 py-2 text-[11px] font-bold text-white/80 transition hover:bg-white/15"
                    >
                      {paymentUrl}
                    </a>
                  )}
                </div>

                <p className="mt-4 text-center text-[11px] font-semibold leading-5 text-white/60">
                  Quét QR bằng điện thoại, bấm xác nhận trên trang mở ra. Website sẽ tự cập nhật đơn hàng.
                </p>
              </section>
            )}

            <section className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-zinc-950">An tâm mua sắm</h3>
              <div className="mt-4 space-y-3">
                {[
                  { Icon: ShieldCheck, text: "Bảo hành chính hãng" },
                  { Icon: PackageCheck, text: "Đổi trả trong 7 ngày" },
                  { Icon: Truck, text: "Giao hàng toàn quốc" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm font-semibold text-zinc-600">
                    <Icon className="h-4 w-4 text-zinc-950" />
                    {text}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
