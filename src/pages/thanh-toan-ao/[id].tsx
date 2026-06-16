import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, CreditCard, Loader2, Smartphone } from "lucide-react";
import { API_BASE } from "../../context/AuthContext";
import { formatCartPrice, type CartItem } from "../../context/CartContext";

type PaymentSession = {
  id: string;
  status: "pending" | "paid" | "expired";
  paymentMethod: "MOMO_FAKE" | "BANK_QR_FAKE";
  orderId?: string;
  expiresAt: string;
  orderPayload: {
    customerName: string;
    phone: string;
    address: string;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
  };
};

export default function FakePaymentPage() {
  const { id } = useParams();
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/payments/${id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Không tìm thấy phiên thanh toán.");
        setSession(data.session);
      })
      .catch((err) => setError(err.message || "Không thể tải thanh toán."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!session) return;

    const updateCountdown = () => {
      setRemainingSeconds(Math.max(0, Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / 1000)));
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [session]);

  const formattedCountdown = `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")}`;
  const totalItems = useMemo(
    () => session?.orderPayload.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
    [session]
  );

  const handleConfirm = async () => {
    if (!id) return;
    setConfirming(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const response = await fetch(`${API_BASE}/api/payments/${id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Không thể xác nhận thanh toán.");
      setSession(data.session);
    } catch (err: any) {
      setError(err.message || "Không thể xác nhận thanh toán.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#a50064] text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-4">
        <div className="max-w-sm rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-extrabold text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const paid = session.status === "paid";
  const expired = session.status === "expired" || remainingSeconds <= 0;
  const isMomo = session.paymentMethod === "MOMO_FAKE";

  return (
    <div className={`min-h-screen px-4 py-8 text-white ${isMomo ? "bg-[#a50064]" : "bg-zinc-950"}`}>
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl font-black ${isMomo ? "text-[#a50064]" : "text-zinc-950"}`}>
            {isMomo ? "M" : <CreditCard className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-lg font-black">{isMomo ? "MoMo Pay Demo" : "Bank QR Demo"}</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Thanh toán giả lập</p>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-5 text-zinc-950 shadow-2xl">
          {paid ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
              <h1 className="text-2xl font-black">Thanh toán thành công</h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-zinc-500">
                Đơn {session.orderId} đã được tạo. Bạn có thể quay lại web trên máy tính để xem đơn hàng.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Mã thanh toán
                  </p>
                  <h1 className="mt-1 text-lg font-black">{session.id}</h1>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-black ${expired ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                  {expired ? "Hết hạn" : formattedCountdown}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Người nhận</p>
                  <p className="mt-1 text-sm font-black">{session.orderPayload.customerName}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-zinc-500">
                    {session.orderPayload.phone} • {session.orderPayload.address}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Sản phẩm</p>
                  <p className="mt-1 text-sm font-black">{totalItems} sản phẩm</p>
                  <div className="mt-3 max-h-36 space-y-2 overflow-y-auto pr-1">
                    {session.orderPayload.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-xs font-bold text-zinc-500">
                        <span className="truncate">{item.name}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4 text-white">
                  <span className="text-sm font-bold text-white/60">Số tiền</span>
                  <span className="text-xl font-black">{formatCartPrice(session.orderPayload.totalPrice)}</span>
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming || expired}
                className={`mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 ${isMomo ? "bg-[#a50064] hover:bg-[#8c0056]" : "bg-zinc-950 hover:bg-zinc-800"}`}
              >
                {confirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xác nhận...
                  </>
                ) : (
                  <>
                    {isMomo ? <Smartphone className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                    Tôi đã thanh toán
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-xs font-semibold leading-5 text-white/60">
          Đây là trang thanh toán ảo dùng cho demo, không phát sinh giao dịch thật.
        </p>
      </div>
    </div>
  );
}
