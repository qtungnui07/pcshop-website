import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Search,
  Monitor,
  Laptop,
  Cpu,
  Keyboard,
  Mouse,
  Speaker,
  Webcam,
  Grid3X3,
  Cable,
  HelpCircle,
  Headphones,
  Users,
  Lock,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Receipt,
  Phone,
  Mail,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

interface PCItem {
  badge?: string;
  badgeColor?: string;
  name: string;
  specs: string;
  price: string;
  from: string;
  to: string;
  image?: string;
}

interface LaptopItem {
  brand?: string;
  name: string;
  specs: string;
  price: string;
  img?: string;
  image?: string;
}

interface ComponentItem {
  name: string;
  specs: string;
  price: string;
  badge?: string;
  badgeColor?: string;
  image?: string;
  color?: string;
  category?: string;
}

interface AccessoryItem {
  id?: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  badge?: string;
  colors: string[];
  image: string;
  fallbackIcon?: string;
}

interface AccessoryComboItem {
  id?: string | number;
  title: string;
  name?: string;
  desc?: string;
  specs?: string;
  productIds: Array<string | number>;
  discountPercent: number;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
}

const PORT = 3001;
const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:${PORT}`)
  : `http://localhost:${PORT}`;

const CATEGORIES = [
  { id: "pc", name: "Máy tính để bàn (PC)", icon: Monitor, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "laptop", name: "Laptop / Notebook", icon: Laptop, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "linh-kien", name: "Linh kiện PC", icon: Cpu, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "phu-kien", name: "Phụ kiện Gaming", icon: Keyboard, color: "text-orange-600 bg-orange-50 border-orange-200" },
  { id: "tickets", name: "Hỗ trợ (Tickets)", icon: HelpCircle, color: "text-teal-600 bg-teal-50 border-teal-200" },
  { id: "accounts", name: "Quản lý Tài khoản", icon: Users, color: "text-red-600 bg-red-50 border-red-200" }
];

const ACCESSORY_ICONS: Record<string, React.ElementType> = {
  Headphones,
  Keyboard,
  Mouse,
  Grid3X3,
  Speaker,
  Webcam,
  Monitor,
  Cable,
  HelpCircle
};

const staffMembers = [
  {
    name: "Đinh Quang Tùng",
    role: "CEO & Director",
    email: "tungdq@pcshop.vn",
    phone: "0912 345 678",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=tung",
    department: "Ban Giám Đốc",
    status: "online"
  },
  {
    name: "Trịnh Phan Tuấn Anh",
    role: "Technical Lead",
    email: "anhtp@pcshop.vn",
    phone: "0987 654 321",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=tuananh",
    department: "Phòng Công Nghệ",
    status: "online"
  },
  {
    name: "Nguyễn Tuấn Dũng",
    role: "Customer Support Lead",
    email: "dungnt@pcshop.vn",
    phone: "1900 8198 (Ext 101)",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=tuandung",
    department: "Chăm sóc khách hàng",
    status: "busy"
  },
  {
    name: "Đoàn Trần Gia Phong",
    role: "Warehouse Co-Manager",
    email: "phongdt@pcshop.vn",
    phone: "0909 999 888",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=phong",
    department: "Quản Lý Kho Hàng",
    status: "online"
  },
  {
    name: "Lê Tiến Hưng",
    role: "Warehouse Co-Manager",
    email: "hunglt@pcshop.vn",
    phone: "0909 111 222",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=hung",
    department: "Quản Lý Kho Hàng",
    status: "online"
  }
];

export default function AdminIndex() {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>("pc");

  // Database arrays
  const [pcs, setPcs] = useState<PCItem[]>([]);
  const [laptops, setLaptops] = useState<LaptopItem[]>([]);
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [accessoryCombos, setAccessoryCombos] = useState<AccessoryComboItem[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const view = searchParams.get("view") || "dashboard";

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Fetch all databases on mount
  const fetchData = async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const authHeader = { "Authorization": `Bearer ${user.email}` };
      const [pcsRes, laptopsRes, componentsRes, accessoriesRes, accessoryCombosRes, ticketsRes, accountsRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/api/featured-pcs`).then(r => r.json()),
        fetch(`${API_BASE}/api/laptops`).then(r => r.json()),
        fetch(`${API_BASE}/api/components`).then(r => r.json()),
        fetch(`${API_BASE}/api/accessories`).then(r => r.json()),
        fetch(`${API_BASE}/api/accessory-combos`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/tickets`, { headers: authHeader }).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/accounts`, { headers: authHeader }).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/orders`, { headers: authHeader }).then(r => r.ok ? r.json() : [])
      ]);

      setPcs(pcsRes);
      setLaptops(laptopsRes);
      setComponents(componentsRes);
      setAccessories(accessoriesRes);
      setAccessoryCombos(accessoryCombosRes);
      setTickets(ticketsRes);
      setAccounts(accountsRes);
      setOrders(ordersRes);

      setSearchQuery("");
    } catch (err) {
      console.error("Error loading products in admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  // Determine current active list for Products view
  const getActiveList = () => {
    if (activeCategory === "pc") return pcs;
    if (activeCategory === "laptop") return laptops;
    if (activeCategory === "linh-kien") return components;
    if (activeCategory === "phu-kien") return accessories;
    if (activeCategory === "combo-phu-kien") return accessoryCombos;
    if (activeCategory === "tickets") return tickets;
    return accounts;
  };

  const getFilteredList = () => {
    const list = getActiveList();
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();

    return list.filter((item: any) => {
      const matchName = item.name?.toLowerCase().includes(q);
      const matchSpecs = item.specs?.toLowerCase().includes(q);
      const matchBrand = item.brand?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchEmail = item.email?.toLowerCase().includes(q);
      const matchRole = item.role?.toLowerCase().includes(q);
      const matchProvider = item.provider?.toLowerCase().includes(q);
      const matchTicketTitle = item.title?.toLowerCase().includes(q);
      const matchComboTitle = item.title?.toLowerCase().includes(q);
      const matchComboDesc = item.desc?.toLowerCase().includes(q);
      const matchTicketStatus = item.status?.toLowerCase().includes(q);
      const matchTicketId = item.id?.toLowerCase().includes(q);
      return matchName || matchSpecs || matchBrand || matchCategory || matchEmail || matchRole || matchProvider || matchTicketTitle || matchComboTitle || matchComboDesc || matchTicketStatus || matchTicketId;
    });
  };

  // Direct Auto-Save to Backend
  const autoSaveCategory = async (category: string, updatedList: any[]) => {
    if (!user || user.role !== "admin") return;
    let url = "";
    if (category === "pc") url = `${API_BASE}/api/featured-pcs`;
    else if (category === "laptop") url = `${API_BASE}/api/laptops`;
    else if (category === "linh-kien") url = `${API_BASE}/api/components`;
    else if (category === "phu-kien") url = `${API_BASE}/api/accessories`;
    else if (category === "combo-phu-kien") url = `${API_BASE}/api/accessory-combos`;
    else if (category === "tickets") url = `${API_BASE}/api/tickets/bulk`;
    else if (category === "accounts") url = `${API_BASE}/api/accounts`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.email}`
        },
        body: JSON.stringify(updatedList)
      });
      if (!res.ok) throw new Error("API responded with error code");
    } catch (err) {
      console.error("Auto-save failed for " + category + ":", err);
      alert("Tự động lưu thất bại. Vui lòng kiểm tra lại kết nối!");
    }
  };

  // Re-ordering handler
  const handleMove = async (indexInFilteredList: number, direction: "up" | "down") => {
    const filteredList = getFilteredList();
    const activeList = [...getActiveList()];

    const item = filteredList[indexInFilteredList];
    const originalIndex = activeList.findIndex(x => x === item);
    if (originalIndex === -1) return;

    let targetIndex = originalIndex;
    if (direction === "up") {
      let searchIdx = indexInFilteredList - 1;
      if (searchIdx < 0) return;
      targetIndex = activeList.findIndex(x => x === filteredList[searchIdx]);
    } else {
      let searchIdx = indexInFilteredList + 1;
      if (searchIdx >= filteredList.length) return;
      targetIndex = activeList.findIndex(x => x === filteredList[searchIdx]);
    }

    if (targetIndex === -1 || targetIndex === originalIndex) return;

    // Swap original items
    const temp = activeList[originalIndex];
    activeList[originalIndex] = activeList[targetIndex];
    activeList[targetIndex] = temp;

    // Update state
    updateActiveListState(activeList);
    
    // Auto-save direct
    await autoSaveCategory(activeCategory, activeList);
    showToast("Đã cập nhật thứ tự!");
  };

  const updateActiveListState = (newList: any[]) => {
    if (activeCategory === "pc") setPcs(newList);
    else if (activeCategory === "laptop") setLaptops(newList);
    else if (activeCategory === "linh-kien") setComponents(newList);
    else if (activeCategory === "phu-kien") setAccessories(newList);
    else if (activeCategory === "combo-phu-kien") setAccessoryCombos(newList);
    else if (activeCategory === "tickets") setTickets(newList);
    else setAccounts(newList);
  };

  // Delete item
  const handleDelete = async (indexInFilteredList: number) => {
    const filteredList = getFilteredList();
    const activeList = getActiveList();
    const item = filteredList[indexInFilteredList];

    if (activeCategory === "accounts" && user && item.email === user.email) {
      alert("Bạn không thể tự xóa tài khoản của chính mình!");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa "${item.name || item.title || item.email}" khỏi danh sách?`)) return;

    const newList = activeList.filter(x => x !== item);
    updateActiveListState(newList);

    // Auto-save direct
    await autoSaveCategory(activeCategory, newList);
    showToast("Đã xóa thành công!");
  };

  // Ticket Status Direct Save
  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/tickets/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.email}`
        },
        body: JSON.stringify({ id: ticketId, status: newStatus })
      });
      if (!res.ok) throw new Error("API call failed");

      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      showToast("Đã cập nhật trạng thái hỗ trợ!");
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật Ticket");
    }
  };

  // Order Status & Payment Status Direct Save
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.email}`
        },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      if (!res.ok) throw new Error("API call failed");

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o));
      showToast("Đã lưu trạng thái đơn hàng!");
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật trạng thái đơn hàng");
    }
  };

  const handleUpdateOrderPayment = async (orderId: string, newPaymentStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.email}`
        },
        body: JSON.stringify({ id: orderId, paymentStatus: newPaymentStatus })
      });
      if (!res.ok) throw new Error("API call failed");

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newPaymentStatus, updatedAt: new Date().toISOString() } : o));
      showToast("Đã lưu trạng thái thanh toán!");
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật thanh toán đơn hàng");
    }
  };

  // Order Delete Direct Save
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderId}?`)) return;
    const updatedOrders = orders.filter(o => o.id !== orderId);
    try {
      const res = await fetch(`${API_BASE}/api/orders/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.email}`
        },
        body: JSON.stringify(updatedOrders)
      });
      if (!res.ok) throw new Error("API call failed");

      setOrders(updatedOrders);
      showToast("Đã xóa đơn hàng thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa đơn hàng");
    }
  };

  const getProductsByIds = (productIds: Array<string | number>) => {
    return productIds
      .map((id) => accessories.find((product) => String(product.id) === String(id)))
      .filter((product): product is AccessoryItem => Boolean(product));
  };

  const getComboOriginalPrice = (productIds: Array<string | number>) => {
    return getProductsByIds(productIds).reduce((sum, product) => sum + Number(product.price || 0), 0);
  };

  const getComboDiscountedPrice = (productIds: Array<string | number>, discountPercent: number | string) => {
    const originalPrice = getComboOriginalPrice(productIds);
    const discount = Math.min(90, Math.max(0, Number(String(discountPercent).replace(/[^\d]/g, "")) || 0));
    return Math.max(0, Math.round(originalPrice * (100 - discount) / 100));
  };

  const formatPrice = (val: number | string) => {
    const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^\d]/g, ""));
    if (isNaN(num)) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(num) + "đ";
  };

  // Auth screen checking
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-zinc-500 font-semibold">Đang xác thực thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl shadow-xl p-10 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-6 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Từ chối truy cập</h1>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
            Tài khoản của bạn không có quyền truy cập vào bảng điều khiển Admin.
            Vui lòng đăng nhập bằng tài khoản Quản trị viên để tiếp tục.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <a
              href="/auth"
              className="w-full bg-zinc-950 hover:bg-zinc-900 text-white text-sm font-bold py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              Đăng nhập Admin
            </a>
            <a
              href="/"
              className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-sm font-semibold py-3 rounded-xl border border-zinc-200 transition-colors"
            >
              Quay về trang chủ
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // Statistics calculation for Dashboard
  const activeOrders = orders.filter(o => o.status !== "cancelled");
  const totalRevenue = activeOrders.reduce((sum, order) => {
    if (order.paymentStatus === "success") {
      return sum + Number(order.totalPrice || 0);
    }
    return sum;
  }, 0);
  const avgOrderValue = activeOrders.length > 0 ? Math.round(totalRevenue / activeOrders.length) : 0;
  const totalProducts = pcs.length + laptops.length + components.length + accessories.length;

  // Pie chart stats: Order Statuses
  const processingCount = orders.filter(o => o.status === "processing").length;
  const completedCount = orders.filter(o => o.status === "completed").length;
  const cancelledCount = orders.filter(o => o.status === "cancelled").length;
  const chartTotal = orders.length || 1;

  const circ = 2 * Math.PI * 40; // R=40, C=251.3
  const completedDash = (completedCount / chartTotal) * circ;
  const processingDash = (processingCount / chartTotal) * circ;
  const cancelledDash = (cancelledCount / chartTotal) * circ;

  const completedOffset = 0;
  const processingOffset = completedDash;
  const cancelledOffset = completedDash + processingDash;

  // Bar chart stats: Top 5 Best Selling products
  const productSales: Record<string, { name: string; count: number; image?: string; price?: any }> = {};
  orders.forEach(order => {
    if (order.status !== "cancelled" && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        const key = item.name;
        if (!productSales[key]) {
          productSales[key] = { name: item.name, count: 0, image: item.image, price: item.price };
        }
        productSales[key].count += item.quantity || 1;
      });
    }
  });
  const bestSellers = Object.values(productSales)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxSalesCount = Math.max(...bestSellers.map(x => x.count), 1);

  // Search filter for Invoice/Order View
  const getFilteredOrders = () => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.email?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q) ||
      o.paymentMethod?.toLowerCase().includes(q)
    );
  };

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded">
              Hệ Thống Admin
            </span>
            <span className="bg-zinc-100 text-zinc-600 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              ⚡️ Tự động lưu hoạt động
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 capitalize">
            {view === "dashboard" ? "Bảng giám sát hoạt động" : 
             view === "products" ? "Quản lý dữ liệu sản phẩm" : 
             view === "orders" ? "Quản lý hóa đơn mua hàng" : 
             view === "tickets" ? "Quản lý yêu cầu hỗ trợ" :
             view === "accounts" ? "Quản lý danh sách tài khoản" : "Thông tin liên hệ nhân viên"}
          </h1>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 disabled:opacity-50 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 bg-white shadow-sm"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Tải lại dữ liệu
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-3">
          <div className="w-9 h-9 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs font-bold">Đang tải cơ sở dữ liệu...</p>
        </div>
      ) : (
        <div className="w-full">
          
          {/* ────────────────────────────────────────────────────────── */}
          {/* VIEW: DASHBOARD                                            */}
          {/* ────────────────────────────────────────────────────────── */}
          {view === "dashboard" && (
            <div className="space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Doanh Thu</p>
                    <p className="text-xl font-black text-zinc-900 mt-0.5">{formatPrice(totalRevenue)}</p>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Số Đơn Hàng</p>
                    <p className="text-xl font-black text-zinc-900 mt-0.5">{orders.length} đơn</p>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Giá Trị Trung Bình</p>
                    <p className="text-xl font-black text-zinc-900 mt-0.5">{formatPrice(avgOrderValue)}</p>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Tổng Sản Phẩm</p>
                    <p className="text-xl font-black text-zinc-900 mt-0.5">{totalProducts} sản phẩm</p>
                  </div>
                </div>
              </div>

              {/* Charts Section Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Order Status conversion Donut Chart */}
                <div className="lg:col-span-5 bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-900 uppercase tracking-wider mb-1">Tỷ lệ đặt đơn</h3>
                    <p className="text-xs text-zinc-400">Tỷ lệ chia theo trạng thái hoạt động hiện thời</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6">
                    {/* SVG Donut */}
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background grey ring */}
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f4f4f5" strokeWidth="10" />
                        
                        {/* Completed ring */}
                        {completedCount > 0 && (
                          <circle 
                            cx="50" cy="50" r="40" fill="transparent" 
                            stroke="#10b981" strokeWidth="10" 
                            strokeDasharray={`${completedDash} ${circ}`} 
                            strokeDashoffset={-completedOffset}
                          />
                        )}
                        {/* Processing ring */}
                        {processingCount > 0 && (
                          <circle 
                            cx="50" cy="50" r="40" fill="transparent" 
                            stroke="#f97316" strokeWidth="10" 
                            strokeDasharray={`${processingDash} ${circ}`} 
                            strokeDashoffset={-processingOffset}
                          />
                        )}
                        {/* Cancelled ring */}
                        {cancelledCount > 0 && (
                          <circle 
                            cx="50" cy="50" r="40" fill="transparent" 
                            stroke="#ef4444" strokeWidth="10" 
                            strokeDasharray={`${cancelledDash} ${circ}`} 
                            strokeDashoffset={-cancelledOffset}
                          />
                        )}
                      </svg>
                      {/* Centered Total Count */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-black text-zinc-800 leading-none">{orders.length}</span>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Đơn</span>
                      </div>
                    </div>

                    {/* Legends */}
                    <div className="space-y-2 text-xs font-bold text-zinc-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                        <span>Hoàn thành: {completedCount} ({Math.round(completedCount/chartTotal*100)}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-orange-500" />
                        <span>Đang xử lý: {processingCount} ({Math.round(processingCount/chartTotal*100)}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-red-500" />
                        <span>Đã hủy: {cancelledCount} ({Math.round(cancelledCount/chartTotal*100)}%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 pt-3 text-[11px] font-semibold text-zinc-400 flex items-center justify-between">
                    <span>Tổng đơn nhận: {orders.length}</span>
                    <span className="text-emerald-600">Thành công {Math.round((completedCount/chartTotal)*100)}%</span>
                  </div>
                </div>

                {/* Best Sellers Horizontal Bar Chart */}
                <div className="lg:col-span-7 bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-900 uppercase tracking-wider mb-1">Hàng được mua nhiều nhất</h3>
                    <p className="text-xs text-zinc-400">Top 5 sản phẩm bán chạy nhất được đặt mua</p>
                  </div>

                  {bestSellers.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400 text-xs font-bold">Chưa có dữ liệu giao dịch.</div>
                  ) : (
                    <div className="space-y-4 py-4">
                      {bestSellers.map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-zinc-800 truncate max-w-[280px] sm:max-w-[400px]">
                              {idx + 1}. {item.name}
                            </span>
                            <span className="font-black text-zinc-600 shrink-0">{item.count} lượt chọn</span>
                          </div>
                          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.count / maxSalesCount) * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-zinc-100 pt-3 text-[11px] font-bold text-zinc-400 flex items-center justify-between">
                    <span>Top 5 sản phẩm thịnh hành</span>
                    <span className="text-blue-500 flex items-center gap-1">Xem chi tiết <Sparkles className="w-3.5 h-3.5" /></span>
                  </div>
                </div>

              </div>

              {/* Stock Inventory level cards layout */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
                <h3 className="font-extrabold text-sm text-zinc-900 uppercase tracking-wider mb-4">Mức độ dự trữ kho</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
                  <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl">
                    <p className="text-xs text-purple-600 font-bold uppercase">Máy bàn (PC)</p>
                    <p className="text-2xl font-black text-purple-900 mt-1">{pcs.length}</p>
                    <span className="text-[10px] text-zinc-400 font-semibold">cấu hình bán ra</span>
                  </div>

                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <p className="text-xs text-blue-600 font-bold uppercase">Laptop</p>
                    <p className="text-2xl font-black text-blue-900 mt-1">{laptops.length}</p>
                    <span className="text-[10px] text-zinc-400 font-semibold">mã máy sẵn kho</span>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                    <p className="text-xs text-emerald-600 font-bold uppercase">Linh kiện</p>
                    <p className="text-2xl font-black text-emerald-900 mt-1">{components.length}</p>
                    <span className="text-[10px] text-zinc-400 font-semibold">mã bộ phận thay thế</span>
                  </div>

                  <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl">
                    <p className="text-xs text-orange-600 font-bold uppercase">Phụ kiện</p>
                    <p className="text-2xl font-black text-zinc-900 mt-1">{accessories.length}</p>
                    <span className="text-[10px] text-zinc-400 font-semibold">phụ kiện ghép đôi</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* VIEW: PRODUCTS                                             */}
          {/* ────────────────────────────────────────────────────────── */}
          {view === "products" && (
            <div className="space-y-6">
              
              {/* Category selector buttons layout */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                {CATEGORIES.slice(0, 4).concat({ id: "combo-phu-kien", name: "Combo phụ kiện", icon: Sparkles, color: "text-amber-600 bg-amber-50 border-amber-200" }).map((cat) => {
                  const CatIcon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setSearchQuery("");
                      }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition cursor-pointer ${isActive
                          ? `${cat.color} ring-2 ring-zinc-950/5 font-extrabold shadow-sm scale-[1.01]`
                          : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800"
                        }`}
                    >
                      <CatIcon className="w-4 h-4 shrink-0" />
                      <span className="text-xs tracking-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Toolbar: Search and Create */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-2xl shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder={`Tìm kiếm sản phẩm...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:border-zinc-800 outline-none transition"
                  />
                </div>

                <Link
                  to={`/admin/edit?category=${activeCategory}&index=-1`}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-950 text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 text-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm cấu hình mới
                </Link>
              </div>

              {/* Product list */}
              {getFilteredList().length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400 text-xs font-bold bg-white">
                  {searchQuery.trim() ? "Không tìm thấy sản phẩm nào khớp từ khóa." : "Không có sản phẩm nào trong danh mục này."}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {getFilteredList().map((item: any, idx) => {
                    const originalIndex = getActiveList().findIndex(x => x === item);

                    return (
                      <div
                        key={originalIndex}
                        className="flex items-center justify-between bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl p-4 shadow-sm transition"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          
                          {/* Thumbnail images based on category */}
                          {activeCategory === "pc" && (
                            <div className="w-14 h-14 bg-zinc-950 rounded-xl flex items-center justify-center p-1 border border-zinc-200 relative overflow-hidden shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <div className="w-full h-full rounded" style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }} />
                              )}
                              {item.badge && (
                                <span className="absolute bottom-0 left-0 right-0 text-[7px] font-extrabold text-white text-center py-0.5" style={{ background: item.badgeColor || '#000' }}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          )}

                          {activeCategory === "laptop" && (
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-1 border border-zinc-200 relative overflow-hidden shrink-0">
                              {(item.img || item.image) ? (
                                <img src={item.img || item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <Laptop className="w-6 h-6 text-zinc-300" />
                              )}
                            </div>
                          )}

                          {activeCategory === "linh-kien" && (
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-zinc-100 relative overflow-hidden shrink-0">
                              <Cpu className="w-6 h-6 text-zinc-400" />
                              {item.image && (
                                <img src={item.image} alt={item.name} className="absolute inset-1 m-auto max-w-[calc(100%-8px)] max-h-[calc(100%-8px)] object-contain" />
                              )}
                            </div>
                          )}

                          {activeCategory === "phu-kien" && (
                            <div className="w-14 h-14 bg-zinc-50 rounded-xl flex items-center justify-center p-1 border border-zinc-200 relative overflow-hidden shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-cover rounded" />
                              ) : (
                                (() => {
                                  const IconComp = ACCESSORY_ICONS[item.fallbackIcon || "Keyboard"] || Keyboard;
                                  return <IconComp className="w-6 h-6 text-zinc-400" />;
                                })()
                              )}
                            </div>
                          )}

                          {activeCategory === "combo-phu-kien" && (
                            <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center p-1 border border-amber-100 relative overflow-hidden shrink-0">
                              {(item.image || getProductsByIds(item.productIds || [])[0]?.image) ? (
                                <img src={item.image || getProductsByIds(item.productIds || [])[0]?.image} alt={item.title} className="max-w-full max-h-full object-cover rounded" />
                              ) : (
                                <Sparkles className="w-6 h-6 text-amber-500" />
                              )}
                            </div>
                          )}

                          {/* Product Details info block */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {item.brand && (
                                <span className="bg-zinc-100 text-zinc-700 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                  {item.brand}
                                </span>
                              )}
                              <h4 className="text-xs font-bold text-zinc-900 truncate">
                                {item.name || item.title}
                              </h4>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-semibold truncate">
                              {item.specs ? item.specs.replace(/\n/g, ' • ') : item.desc || ''}
                            </p>
                            <p className="text-[10px] font-extrabold text-zinc-800 mt-1">
                              {activeCategory === "phu-kien" ? formatPrice(item.price) : 
                               activeCategory === "combo-phu-kien" ? formatPrice(getComboDiscountedPrice(item.productIds, item.discountPercent)) :
                               item.price}
                            </p>
                          </div>

                        </div>

                        {/* Reorder and Delete controls */}
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleMove(idx, "up")}
                              disabled={idx === 0}
                              className="p-0.5 hover:bg-zinc-100 disabled:opacity-30 rounded cursor-pointer"
                              title="Di chuyển lên"
                            >
                              <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                            </button>
                            <button
                              onClick={() => handleMove(idx, "down")}
                              disabled={idx === getFilteredList().length - 1}
                              className="p-0.5 hover:bg-zinc-100 disabled:opacity-30 rounded cursor-pointer"
                              title="Di chuyển xuống"
                            >
                              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                            </button>
                          </div>

                          <Link
                            to={`/admin/edit?category=${activeCategory}&index=${originalIndex}`}
                            className="p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl transition"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition"
                            title="Xóa cấu hình"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* VIEW: ORDERS (INVOICES)                                    */}
          {/* ────────────────────────────────────────────────────────── */}
          {view === "orders" && (
            <div className="space-y-6">
              
              {/* Search Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-2xl shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hóa đơn theo Mã đơn, Tên, SĐT, Email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:border-zinc-800 outline-none transition"
                  />
                </div>
              </div>

              {/* Order List layout */}
              {getFilteredOrders().length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400 text-xs font-bold bg-white">
                  Chưa có hóa đơn nào phù hợp.
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredOrders().map((order: any) => {
                    const isExpanded = !!expandedOrders[order.id];
                    return (
                      <div key={order.id} className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden transition hover:border-zinc-300">
                        {/* Header summary info row */}
                        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-50/50 border-b border-zinc-100">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-black text-zinc-900">{order.id}</span>
                              <span className="text-[10px] text-zinc-400">•</span>
                              <span className="text-[11px] text-zinc-500 font-bold">
                                {new Date(order.createdAt).toLocaleString("vi-VN")}
                              </span>
                            </div>
                            <h4 className="text-xs font-extrabold text-zinc-800 mt-1">
                              KH: {order.customerName} • {order.phone}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            {/* Update Payment status dropdown */}
                            <div className="flex flex-col">
                              <label className="text-[9px] uppercase font-black text-zinc-400 tracking-wider mb-0.5">Thanh toán</label>
                              <select
                                value={order.paymentStatus}
                                onChange={(e) => handleUpdateOrderPayment(order.id, e.target.value)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg outline-none cursor-pointer border ${
                                  order.paymentStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                                }`}
                              >
                                <option value="pending">Chưa trả</option>
                                <option value="success">Đã thanh toán</option>
                              </select>
                            </div>

                            {/* Update Order status dropdown */}
                            <div className="flex flex-col">
                              <label className="text-[9px] uppercase font-black text-zinc-400 tracking-wider mb-0.5">Tiến trình</label>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg outline-none cursor-pointer border ${
                                  order.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                  order.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-800' :
                                  'bg-blue-50 border-blue-200 text-blue-800'
                                }`}
                              >
                                <option value="processing">Đang xử lý</option>
                                <option value="completed">Đã bàn giao</option>
                                <option value="cancelled">Hủy đơn</option>
                              </select>
                            </div>

                            <button
                              onClick={() => {
                                setExpandedOrders(prev => ({ ...prev, [order.id]: !isExpanded }));
                              }}
                              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-bold rounded-xl transition cursor-pointer"
                            >
                              {isExpanded ? "Thu nhỏ" : "Xem mặt hàng"}
                            </button>

                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Xóa đơn hàng"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Details section */}
                        {isExpanded && (
                          <div className="p-4 bg-white space-y-4">
                            {/* Contact & Delivery Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div>
                                <h5 className="font-extrabold text-zinc-500 uppercase text-[9px] tracking-wider mb-1">Thông tin giao nhận</h5>
                                <p className="text-zinc-800 leading-relaxed">
                                  <span className="font-bold">Địa chỉ:</span> {order.address} <br />
                                  <span className="font-bold">Email:</span> {order.email} <br />
                                  <span className="font-bold">Ghi chú:</span> {order.note || "Không có ghi chú"}
                                </p>
                              </div>
                              <div>
                                <h5 className="font-extrabold text-zinc-500 uppercase text-[9px] tracking-wider mb-1">Phương thức thanh toán</h5>
                                <p className="text-zinc-800 leading-relaxed">
                                  <span className="font-bold">Cổng kết nối:</span> {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : 
                                   order.paymentMethod === "MOMO_FAKE" ? "Ví điện tử MoMo FAKE" : "Ngân hàng QR code FAKE"}
                                </p>
                              </div>
                            </div>

                            {/* Products Item Table */}
                            <div>
                              <h5 className="font-extrabold text-zinc-500 uppercase text-[9px] tracking-wider mb-2">Mặt hàng đặt mua</h5>
                              <div className="border border-zinc-100 rounded-xl overflow-hidden">
                                {order.items.map((item: any, sIdx: number) => (
                                  <div key={sIdx} className="flex justify-between items-center p-3 border-b border-zinc-100 last:border-b-0 text-xs">
                                    <div className="flex items-center gap-3">
                                      {item.image && (
                                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-zinc-50 border rounded-lg p-0.5" />
                                      )}
                                      <div>
                                        <h6 className="font-bold text-zinc-900 leading-tight">{item.name}</h6>
                                        {item.specs && (
                                          <p className="text-[10px] text-zinc-400 mt-0.5">{item.specs}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right font-semibold text-zinc-700 shrink-0 ml-4">
                                      {formatPrice(item.price)} x {item.quantity}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Bottom invoice total */}
                            <div className="flex justify-between items-center border-t border-zinc-100 pt-3">
                              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tổng cộng: {order.totalItems} sản phẩm</span>
                              <span className="text-sm font-black text-blue-600">{formatPrice(order.totalPrice)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* VIEW: TICKETS (SUPPORT)                                    */}
          {/* ────────────────────────────────────────────────────────── */}
          {view === "tickets" && (
            <div className="space-y-6">
              
              {/* Tickets Search */}
              <div className="bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-2xl shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hỗ trợ theo tên, email, tiêu đề, mã máy..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:border-zinc-800 outline-none transition"
                  />
                </div>
              </div>

              {/* Tickets List */}
              {tickets.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400 text-xs font-bold bg-white">
                  Chưa có yêu cầu hỗ trợ nào.
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.filter(t => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return t.contactName?.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.contactEmail.toLowerCase().includes(q);
                  }).map((item) => (
                    <div key={item.id} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-zinc-300 transition">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-zinc-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-zinc-800">{item.id}</span>
                            <span className="bg-zinc-100 text-zinc-600 text-[8px] font-black uppercase px-2 py-0.5 rounded">
                              {item.categoryLabel}
                            </span>
                          </div>
                          <h4 className="text-xs font-extrabold text-zinc-900 mt-1">{item.title}</h4>
                        </div>

                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateTicketStatus(item.id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg outline-none cursor-pointer border ${
                            item.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                            item.status === 'processing' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                            item.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-800' :
                            'bg-orange-50 border-orange-200 text-orange-800'
                          }`}
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="processing">Đang xử lý</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <h5 className="font-extrabold text-zinc-400 uppercase text-[9px] tracking-wider mb-1">Khách Hàng</h5>
                          <p className="text-zinc-800 leading-relaxed">
                            <span className="font-bold">{item.contactName}</span> <br />
                            SĐT: {item.contactPhone} <br />
                            Email: {item.contactEmail} <br />
                            Địa chỉ: {item.contactAddress}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-extrabold text-zinc-400 uppercase text-[9px] tracking-wider mb-1">Mã Máy / Ngày mua</h5>
                          <p className="text-zinc-800 leading-relaxed">
                            Sản phẩm: {item.productName} <br />
                            Serial: {item.serialNumber} <br />
                            Mua ngày: {item.purchaseDate} ({item.purchaseLocation === "online" ? "Mua online" : "Tại cửa hàng"})
                          </p>
                        </div>
                      </div>

                      <div className="bg-zinc-50 border border-zinc-150 p-3.5 rounded-xl text-xs text-zinc-700 leading-relaxed">
                        <span className="font-extrabold text-zinc-500 uppercase text-[9px] tracking-wider block mb-1">Nội dung chi tiết</span>
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* VIEW: ACCOUNTS                                             */}
          {/* ────────────────────────────────────────────────────────── */}
          {view === "accounts" && (
            <div className="space-y-6">
              
              {/* Accounts Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-2xl shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài khoản..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:border-zinc-800 outline-none transition"
                  />
                </div>

                <Link
                  to="/admin/edit?category=accounts&index=-1"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-950 text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tạo tài khoản mới
                </Link>
              </div>

              {/* Accounts List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.filter(acc => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return acc.name?.toLowerCase().includes(q) || acc.email?.toLowerCase().includes(q);
                }).map((acc) => {
                  const originalIndex = accounts.findIndex(x => x === acc);
                  return (
                    <div key={acc.id} className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex justify-between items-center hover:border-zinc-300 transition">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img 
                          src={acc.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(acc.name)}`} 
                          alt={acc.name} 
                          className="w-12 h-12 bg-zinc-50 border rounded-xl object-contain shrink-0 p-0.5" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-zinc-900 truncate">{acc.name}</h4>
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${acc.role === 'admin' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-zinc-50 border border-zinc-200 text-zinc-600'}`}>
                              {acc.role}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-semibold truncate mt-0.5">{acc.email}</p>
                          <span className="text-[9px] text-zinc-400 font-bold uppercase mt-1 block">Provider: {acc.provider || "local"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-4">
                        <Link
                          to={`/admin/edit?category=accounts&index=${originalIndex}`}
                          className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-xl transition"
                          title="Chỉnh sửa tài khoản"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={async () => {
                            if (user && acc.email === user.email) {
                              alert("Không thể tự xóa chính mình!");
                              return;
                            }
                            if (!confirm(`Xóa tài khoản ${acc.email}?`)) return;
                            const updated = accounts.filter(a => a.id !== acc.id);
                            setAccounts(updated);
                            await autoSaveCategory("accounts", updated);
                            showToast("Đã xóa tài khoản!");
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* VIEW: STAFF (CONTACT DIRECTORY)                            */}
          {/* ────────────────────────────────────────────────────────── */}
          {view === "staff" && (
            <div className="space-y-6">
              
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm text-xs font-semibold leading-relaxed text-zinc-500">
                <p>Bảng điều khiển nhân viên kỹ thuật và điều hành của cửa hàng. Bạn có thể sử dụng các thông tin liên hệ dưới đây để phân công hoặc trao đổi nội bộ.</p>
              </div>

              {/* Staff grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {staffMembers.map((staff, idx) => (
                  <div key={idx} className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 hover:border-zinc-300 transition flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Status Badge overlay */}
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        staff.status === 'online' ? 'bg-emerald-500' :
                        staff.status === 'busy' ? 'bg-amber-500' : 'bg-zinc-300'
                      }`} />
                      <span className="text-[9px] uppercase font-black tracking-wider text-zinc-400">
                        {staff.status}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-3.5 mb-4">
                        <img src={staff.avatar} alt={staff.name} className="w-12 h-12 rounded-2xl border border-zinc-250 bg-zinc-50 p-0.5 object-cover" />
                        <div>
                          <h4 className="text-xs font-black text-zinc-900 leading-snug">{staff.name}</h4>
                          <span className="bg-blue-50 border border-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded mt-1 inline-block">
                            {staff.department}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-zinc-400" />
                          <span>{staff.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-zinc-400" />
                          <a href={`mailto:${staff.email}`} className="text-blue-600 font-bold hover:underline truncate">{staff.email}</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-zinc-400" />
                          <a href={`tel:${staff.phone.replace(/[^\d]/g, "")}`} className="font-bold text-zinc-700 hover:text-zinc-950">{staff.phone}</a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-100 flex gap-2">
                      <a 
                        href={`mailto:${staff.email}`} 
                        className="flex-1 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[10px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Mail className="w-3 h-3" /> Gửi mail
                      </a>
                      <a 
                        href={`tel:${staff.phone.replace(/[^\d]/g, "")}`} 
                        className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-950 text-white font-bold text-[10px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3 h-3" /> Gọi điện
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* FLOAT AUTO-SAVE INDICATOR TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white text-xs font-bold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 border border-zinc-800"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Tự động lưu: {toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
