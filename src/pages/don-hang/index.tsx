import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Loader2, PackageCheck, ReceiptText, Truck } from "lucide-react";
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
  paymentStatus: "success" | "pending";
  status: "created" | "paid" | "processing" | "shipping" | "done";
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
};

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

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + parseCartPrice(order.totalPrice), 0),
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

              return (
                <article key={order.id} className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-extrabold text-zinc-950">{order.id}</h2>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-600">
                          {statusText[order.status] || "Đang xử lý"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-zinc-400">
                        {formatDate(order.createdAt)} • {order.customerName} • {order.phone}
                      </p>
                      <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-zinc-500">
                        {order.address}
                      </p>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                        Tổng tiền
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-zinc-950">
                        {formatCartPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>

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
      </div>
    </div>
  );
}
