import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, Loader2, PackageCheck, ReceiptText, Trash2, Truck, XCircle } from "lucide-react";
import { API_BASE, useAuth } from "../../context/AuthContext";
import { formatCartPrice, parseCartPrice, type CartItem } from "../../context/CartContext";

type Order = {
  id: string;
  userId: string;
  email: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  paymentMethod?: string;
  paymentStatus: "success" | "pending" | "cancelled";
  status: "created" | "paid" | "processing" | "shipping" | "done" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

const statusSteps = [
  { id: "created", label: "Đã đặt hàng", Icon: ReceiptText },
  { id: "paid", label: "Đã thanh toán", Icon: CheckCircle2 },
  { id: "processing", label: "Đang xử lý", Icon: PackageCheck },
  { id: "shipping", label: "Đang giao", Icon: Truck },
  { id: "done", label: "Hoàn tất", Icon: CheckCircle2 },
];

const statusText: Record<Order["status"], string> = {
  created: "Đã đặt hàng",
  paid: "Đã thanh toán",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  done: "Hoàn tất",
  cancelled: "Đã hủy",
};

function getPaymentMethodLabel(method?: string) {
  if (method === "COD") return "Thanh toán khi nhận hàng (COD)";
  if (method === "MOMO_FAKE") return "Ví MoMo (QR)";
  if (method === "BANK_QR_FAKE") return "Chuyển khoản Ngân hàng (QR)";
  return "Thanh toán trực tuyến";
}

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getStepIndex(status: Order["status"]) {
  return Math.max(0, statusSteps.findIndex((step) => step.id === status));
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    setError("");
    fetch(`${API_BASE}/api/orders?userId=${encodeURIComponent(user.id)}&email=${encodeURIComponent(user.email)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Không thể tải đơn hàng.");
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message || "Không thể tải đơn hàng."))
      .finally(() => setFetching(false));
  }, [user]);

  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setCancellingId(cancelModalOrder.id);
    try {
      const response = await fetch(`${API_BASE}/api/orders/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: cancelModalOrder.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Không thể hủy đơn hàng.");

      setOrders((prev) =>
        prev.map((o) => (o.id === cancelModalOrder.id ? { ...o, status: "cancelled", paymentStatus: "pending" } : o))
      );
      setCancelModalOrder(null);
    } catch (err: any) {
      alert(err.message || "Hủy đơn hàng thất bại");
    } finally {
      setCancellingId(null);
    }
  };

  const totalSpent = useMemo(
    () => orders.filter(o => o.status !== "cancelled").reduce((sum, order) => sum + parseCartPrice(order.totalPrice), 0),
    [orders]
  );

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-950" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-28 pb-16">
      <div className="mx-auto max-w-[1180px] px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              Theo dõi đơn hàng
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
              Đơn hàng của bạn
            </h1>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">Tổng đã đặt</p>
            <p className="mt-1 text-xl font-extrabold text-zinc-950">{formatCartPrice(totalSpent)}</p>
          </div>
        </div>

        {fetching ? (
          <div className="flex h-64 items-center justify-center rounded-[28px] border border-zinc-200 bg-white">
            <Loader2 className="h-7 w-7 animate-spin text-zinc-400" />
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-100 bg-red-50 px-6 py-10 text-center text-sm font-bold text-red-600">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[28px] border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
            <Clock className="mx-auto mb-4 h-10 w-10 text-zinc-300" />
            <h2 className="text-xl font-extrabold text-zinc-950">Chưa có đơn hàng</h2>
            <p className="mt-2 text-sm font-medium text-zinc-500">
              Sau khi thanh toán thành công, đơn sẽ xuất hiện ở đây.
            </p>
            <Link
              to="/store"
              className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
              Mua sản phẩm
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const currentStep = getStepIndex(order.status);
              const isCancelled = order.status === "cancelled";
              const canCancel = !isCancelled && order.status !== "shipping" && order.status !== "done";

              return (
                <article key={order.id} className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-extrabold text-zinc-950">{order.id}</h2>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                            isCancelled
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {statusText[order.status] || "Đang xử lý"}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
                            order.paymentMethod === "COD"
                              ? "bg-amber-50 text-amber-800 border-amber-200/80"
                              : "bg-blue-50 text-blue-800 border-blue-200/80"
                          }`}
                        >
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-zinc-400">
                        {formatDate(order.createdAt)} • {order.customerName} • {order.phone}
                      </p>
                      <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-zinc-500">
                        {order.address}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                      <div className="text-left lg:text-right">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                          Tổng tiền
                        </p>
                        <p className={`mt-1 text-2xl font-extrabold ${isCancelled ? "text-zinc-400 line-through" : "text-zinc-950"}`}>
                          {formatCartPrice(order.totalPrice)}
                        </p>
                      </div>
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => setCancelModalOrder(order)}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50/60 px-4 text-xs font-extrabold text-red-600 transition hover:bg-red-100 active:scale-95 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {order.paymentMethod === "COD" ? "Hủy đơn COD" : "Hủy đơn hàng"}
                        </button>
                      )}
                    </div>
                  </div>

                  {isCancelled ? (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span>Đơn hàng này đã được hủy thành công.</span>
                    </div>
                  ) : (
                    <div className="mt-5 grid gap-3 sm:grid-cols-5">
                      {statusSteps.map(({ id, label, Icon }, index) => {
                        const active = index <= currentStep;
                        return (
                          <div
                            key={id}
                            className={`rounded-2xl border px-3 py-3 ${
                              active
                                ? "border-zinc-950 bg-zinc-950 text-white"
                                : "border-zinc-100 bg-zinc-50 text-zinc-400"
                            }`}
                          >
                            <Icon className="mb-2 h-4 w-4" />
                            <p className="text-xs font-extrabold">{label}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-5 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-3">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain p-1.5" />
                          ) : (
                            <PackageCheck className="h-5 w-5 text-zinc-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold text-zinc-950">{item.name}</p>
                          <p className="text-xs font-semibold text-zinc-400">x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-extrabold text-zinc-950">
                          {formatCartPrice(parseCartPrice(item.price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Modal xác nhận hủy đơn */}
        {cancelModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertCircle className="h-7 w-7" />
              </div>

              <h3 className="text-center text-xl font-extrabold text-zinc-950">
                Xác nhận hủy đơn hàng?
              </h3>
              <p className="mt-2 text-center text-sm font-medium leading-relaxed text-zinc-500">
                Bạn có chắc chắn muốn hủy đơn hàng{" "}
                <span className="font-extrabold text-zinc-950">{cancelModalOrder.id}</span>?
              </p>

              {cancelModalOrder.paymentMethod === "COD" ? (
                <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 text-left text-xs font-semibold text-amber-900 leading-relaxed">
                  💡 Đây là đơn hàng <b>Thanh toán khi nhận hàng (COD)</b>. Đơn hàng sẽ được hủy ngay lập tức mà không phát sinh bất kỳ khoản phí nào.
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-200/80 p-3.5 text-left text-xs font-semibold text-blue-900 leading-relaxed">
                  💡 Đơn hàng này đã được thanh toán trực tuyến. Khi hủy đơn, trạng thái sẽ chuyển sang <b>Đã hủy</b> để cửa hàng xử lý hoàn tiền.
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="flex-1 h-11 rounded-full border border-zinc-200 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
                  disabled={cancellingId === cancelModalOrder.id}
                >
                  Bỏ qua
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancellingId === cancelModalOrder.id}
                  className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                >
                  {cancellingId === cancelModalOrder.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang hủy...
                    </>
                  ) : (
                    cancelModalOrder.paymentMethod === "COD" ? "Hủy đơn COD" : "Xác nhận hủy"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
