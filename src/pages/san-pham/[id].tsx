import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ChevronRight, Shield, Truck, RotateCcw, Star, ArrowLeft, Check, ShoppingBag, Heart, 
  Gift, Sparkles, AlertCircle, Info, ThumbsUp 
} from "lucide-react";
import AddToCartButton from "../../components/AddToCartButton";
import { formatCartPrice, useCart } from "../../context/CartContext";
import { latestProducts } from "../../constants/data";
import { pcProducts } from "../../constants/pcData";

const fallbackLaptops = [
  { id: "1", name: "ASUS TUF Gaming A15", brand: "ASUS", price: "20.990.000đ", specs: "Ryzen 5 7535HS / 16GB / 512GB SSD / RTX 3050 / 144Hz", badge: "Bán chạy", img: "" },
  { id: "2", name: "Acer Nitro V 15", brand: "Acer", price: "21.490.000đ", specs: "Core i5-13420H / 16GB / 512GB SSD / RTX 4050 / 144Hz", badge: "Hot", img: "" },
  { id: "3", name: "MSI Cyborg 15", brand: "MSI", price: "22.990.000đ", specs: "Core i7-13620H / 16GB / 512GB SSD / RTX 4060 / 144Hz", badge: "Mới", img: "" },
  { id: "4", name: "Lenovo Legion 5 Slim", brand: "Lenovo", price: "34.990.000đ", specs: "Ryzen 7 7840HS / 16GB / 512GB SSD / RTX 4060 / 165Hz WQXGA", badge: "Premium", img: "" }
];

const fallbackAccessories = [
  { id: "1", name: "Màn hình ASUS VY249HE", brand: "ASUS", category: "Màn hình", price: "2.890.000đ", image: "", colors: ["Đen"] },
  { id: "2", name: "Bàn phím cơ Akko 3087", brand: "Akko", category: "Bàn phím", price: "1.390.000đ", image: "", colors: ["Hồng", "Xám"] },
  { id: "3", name: "Chuột Logitech G102 Lightsync", brand: "Logitech", category: "Chuột", price: "390.000đ", image: "", colors: ["Đen", "Trắng"] }
];

const fallbackComponents = [
  { name: "G.Skill Trident Z5 RGB", specs: "16GB (2x8GB) DDR5 6000MHz", price: "2.890.000đ", badge: "Mới", category: "RAM" },
  { name: "Intel Core i7-14700K", specs: "20 Cores / 28 Threads up to 5.6GHz LGA1700", price: "10.490.000đ", badge: "Hot", category: "CPU" },
  { name: "ASUS Dual GeForce RTX 4060 White", specs: "8GB GDDR6 / 128-bit / 2 Fan / White", price: "8.490.000đ", badge: "Mới", category: "VGA" }
];

// Helper to determine API Base URL
const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:3001`)
  : "http://localhost:3001";

interface NormalizedProduct {
  id: string;
  name: string;
  specs: string;
  price: number | string;
  image: string;
  category: string;
  brand?: string;
  colors?: string[];
  badge?: string;
  from?: string; // for PC gradients
  to?: string;
}

// Helper to compare strings case-insensitively and ignore special characters/spaces
const isNameMatch = (itemName: string, targetName: string) => {
  if (!itemName || !targetName) return false;
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean(itemName) === clean(targetName);
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<NormalizedProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImgIdx, setActiveImgIdx] = useState(0);



  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    setActiveImgIdx(0);

    const fetchProduct = async () => {
      try {
        if (id.startsWith("latest-")) {
          // Resolve from static latestProducts
          const title = id.replace("latest-", "");
          const match = latestProducts.find(p => p.title === title);
          if (match) {
            const normalized: NormalizedProduct = {
              id,
              name: match.title,
              specs: match.description,
              price: match.price,
              image: "", // no image in latestProducts data
              category: "Cửa hàng",
              badge: match.badge || undefined,
              from: match.from,
              to: match.to
            };
            setProduct(normalized);
            setLoading(false);
          } else {
            throw new Error("Không tìm thấy sản phẩm");
          }
          return;
        }

        let data: any[] = [];

        if (id.startsWith("laptop-")) {
          const laptopId = id.replace("laptop-", "");
          try {
            const res = await fetch(`${API_BASE}/api/laptops`);
            if (!res.ok) throw new Error("API error");
            data = await res.json();
          } catch {
            console.warn("Backend offline. Using offline laptop fallback dataset.");
            data = fallbackLaptops;
          }
          
          // Find matching laptop (by name, ID or index)
          let match = data.find((item: any, idx: number) => 
            isNameMatch(item.name, laptopId) || 
            String(item.id) === laptopId ||
            String(idx + 1) === laptopId
          );
          if (!match && data.length > 0 && !isNaN(Number(laptopId))) {
            match = data[parseInt(laptopId, 10) - 1];
          }

          if (match) {
            const normalized: NormalizedProduct = {
              id,
              name: match.name,
              specs: match.specs || "",
              price: match.price,
              image: match.image || match.img || "",
              category: "Laptop",
              brand: match.brand,
              badge: match.badge
            };
            setProduct(normalized);

            // Related: other laptops
            const related = data
              .filter((item: any) => item.name !== match.name)
              .slice(0, 4)
              .map((item: any) => ({
                id: `laptop-${item.name}`,
                name: item.name,
                specs: item.specs || "",
                price: item.price,
                image: item.image || item.img || "",
                category: "Laptop"
              }));
            setRelatedProducts(related);
          } else {
            throw new Error("Không tìm thấy laptop");
          }
        } 
        else if (id.startsWith("pc-")) {
          const pcId = id.replace("pc-featured-", "").replace("pc-", "");
          try {
            const res = await fetch(`${API_BASE}/api/featured-pcs`);
            if (!res.ok) throw new Error("API error");
            data = await res.json();
          } catch {
            console.warn("Backend offline. Using offline PC fallback dataset.");
            data = pcProducts.map(p => ({
              id: p.id,
              name: p.name,
              specs: p.specs,
              price: p.priceStr,
              image: p.img,
              badge: p.badge,
              from: p.from,
              to: p.to
            }));
          }

          // Find match (by name, ID or index)
          let match = data.find((item: any, idx: number) => 
            isNameMatch(item.name, pcId) || 
            String(idx) === pcId || 
            item.name?.replace(/\s+/g, '-').toLowerCase() === pcId ||
            item.id === pcId
          );

          if (!match && !isNaN(Number(pcId))) {
            match = data[Number(pcId)];
          }

          if (match) {
            const normalized: NormalizedProduct = {
              id,
              name: match.name,
              specs: match.specs || "",
              price: match.price,
              image: match.image || "",
              category: "PC",
              badge: match.badge,
              from: match.from,
              to: match.to
            };
            setProduct(normalized);

            // Related
            const related = data
              .filter((item: any) => item.name !== match.name)
              .slice(0, 4)
              .map((item: any) => ({
                id: `pc-${item.name}`,
                name: item.name,
                specs: item.specs || "",
                price: item.price,
                image: item.image || "",
                category: "PC"
              }));
            setRelatedProducts(related);
          } else {
            throw new Error("Không tìm thấy PC");
          }
        }
        else if (id.startsWith("accessory-")) {
          const accId = id.replace("accessory-", "");
          try {
            const res = await fetch(`${API_BASE}/api/accessories`);
            if (!res.ok) throw new Error("API error");
            data = await res.json();
          } catch {
            console.warn("Backend offline. Using offline accessories fallback dataset.");
            data = fallbackAccessories;
          }

          const match = data.find((item: any) => 
            isNameMatch(item.name, accId) || 
            String(item.id) === accId
          );
          if (match) {
            const normalized: NormalizedProduct = {
              id,
              name: match.name,
              specs: `${match.brand} • ${match.category}`,
              price: match.price,
              image: match.image || "",
              category: `Phụ kiện - ${match.category}`,
              brand: match.brand,
              colors: match.colors,
              badge: match.badge
            };
            setProduct(normalized);
            if (match.colors && match.colors.length > 0) {
              setSelectedColor(match.colors[0]);
            }

            // Related
            const related = data
              .filter((item: any) => item.name !== match.name && item.category === match.category)
              .slice(0, 4)
              .map((item: any) => ({
                id: `accessory-${item.name}`,
                name: item.name,
                specs: `${item.brand} • ${item.category}`,
                price: item.price,
                image: item.image || "",
                category: `Phụ kiện - ${item.category}`
              }));
            setRelatedProducts(related);
          } else {
            throw new Error("Không tìm thấy phụ kiện");
          }
        }
        else if (id.startsWith("component-")) {
          try {
            const res = await fetch(`${API_BASE}/api/components`);
            if (!res.ok) throw new Error("API error");
            data = await res.json();
          } catch {
            console.warn("Backend offline. Using offline components fallback dataset.");
            data = fallbackComponents;
          }

          const match = data.find((item: any) => {
            const key = `component-${item.category || "linh-kien"}-${item.name}`;
            return isNameMatch(key, id);
          });

          if (match) {
            const normalized: NormalizedProduct = {
              id,
              name: match.name,
              specs: match.specs || "",
              price: match.price,
              image: match.image || "",
              category: match.category || "Linh kiện",
              badge: match.badge
            };
            setProduct(normalized);

            // Related
            const related = data
              .filter((item: any) => item.name !== match.name && item.category === match.category)
              .slice(0, 4)
              .map((item: any) => ({
                id: `component-${item.category || "linh-kien"}-${item.name}`,
                name: item.name,
                specs: item.specs || "",
                price: item.price,
                image: item.image || "",
                category: item.category || "Linh kiện"
              }));
            setRelatedProducts(related);
          } else {
            throw new Error("Không tìm thấy linh kiện");
          }
        } else {
          throw new Error("Mã sản phẩm không hợp lệ");
        }
      } catch (err: any) {
        console.error("Fetch product detail error:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải chi tiết sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Split specs by newlines or bullets for simple bullet view
  const specList = useMemo(() => {
    if (!product?.specs) return [];
    return product.specs.split(/[•\n/|]+/).map(s => s.trim()).filter(Boolean);
  }, [product]);

  // Parse specs dynamically into a highly structured list for the specs table
  const parsedSpecs = useMemo(() => {
    if (!product?.specs) return [];
    const rawParts = product.specs.split(/[\n•|]+/);
    const result: { label: string; value: string }[] = [];

    rawParts.forEach(part => {
      const trimmed = part.trim();
      if (!trimmed) return;

      let label = "Thông số khác";
      let val = trimmed;

      if (trimmed.toLowerCase().includes("cores") || trimmed.toLowerCase().includes("threads") || trimmed.toLowerCase().includes("ryzen") || trimmed.toLowerCase().includes("intel") || trimmed.toLowerCase().includes("core i")) {
        label = "Vi xử lý (CPU)";
      } else if (trimmed.toLowerCase().includes("ddr") || trimmed.toLowerCase().includes("ram") || (trimmed.toLowerCase().includes("gb") && (trimmed.toLowerCase().includes("bus") || trimmed.toLowerCase().includes("mhz")))) {
        label = "Bộ nhớ (RAM)";
      } else if (trimmed.toLowerCase().includes("gb gddr") || trimmed.toLowerCase().includes("rtx") || trimmed.toLowerCase().includes("vga") || trimmed.toLowerCase().includes("geforce") || trimmed.toLowerCase().includes("radeon")) {
        label = "Card đồ họa (VGA)";
      } else if (trimmed.toLowerCase().includes("ssd") || trimmed.toLowerCase().includes("hdd") || trimmed.toLowerCase().includes("nvme") || trimmed.toLowerCase().includes("sata") || trimmed.toLowerCase().includes("ổ cứng")) {
        label = "Ổ cứng lưu trữ";
      } else if (trimmed.toLowerCase().includes("inch") || trimmed.toLowerCase().includes("screen") || trimmed.toLowerCase().includes("display") || trimmed.toLowerCase().includes("fhd") || trimmed.toLowerCase().includes("hz")) {
        label = "Màn hình";
      } else if (trimmed.toLowerCase().includes("w ") || trimmed.toLowerCase().includes("watt") || trimmed.toLowerCase().includes("gold") || trimmed.toLowerCase().includes("bronze") || trimmed.toLowerCase().includes("modular")) {
        label = "Nguồn (PSU)";
      } else if (trimmed.toLowerCase().includes("fan") || trimmed.toLowerCase().includes("cooling") || trimmed.toLowerCase().includes("aio") || trimmed.toLowerCase().includes("cooler") || trimmed.toLowerCase().includes("tản nhiệt")) {
        label = "Tản nhiệt";
      } else if (trimmed.toLowerCase().includes("tower") || trimmed.toLowerCase().includes("case") || trimmed.toLowerCase().includes("atx") || trimmed.toLowerCase().includes("vỏ máy")) {
        label = "Vỏ case";
      } else if (trimmed.toLowerCase().includes("lga") || trimmed.toLowerCase().includes("am5") || trimmed.toLowerCase().includes("chipset") || trimmed.toLowerCase().includes("b760") || trimmed.toLowerCase().includes("z790") || trimmed.toLowerCase().includes("mainboard")) {
        label = "Bo mạch chủ";
      }

      if (trimmed.includes(":")) {
        const parts = trimmed.split(":");
        label = parts[0].trim();
        val = parts.slice(1).join(":").trim();
      }

      result.push({ label, value: val });
    });

    return result;
  }, [product]);

  // Handle immediate purchase
  const handleBuyNow = () => {
    if (!product) return;
    const success = addItem({
      id: product.id,
      name: product.name,
      specs: product.specs,
      price: product.price,
      image: product.image,
      category: product.category
    });
    if (success) {
      navigate("/gio-hang");
    }
  };

  // Mock feedback/reviews
  const mockReviews = useMemo(() => {
    const cat = (product?.category || "").toLowerCase();
    if (cat.includes("laptop")) {
      return [
        { name: "Nguyễn Tiến Hưng", date: "10/06/2026", rating: 5, comment: "Laptop dùng siêu mượt, màn hình màu sắc chuẩn xác, tần số quét 144Hz chơi game không giật lag. Pin trâu xài cả ngày." },
        { name: "Trần Minh Hoàng", date: "05/06/2026", rating: 5, comment: "Thiết kế mỏng nhẹ, bàn phím gõ rất êm tai. Mua tại cửa hàng được tặng thêm chuột và balo cao cấp." },
        { name: "Lê Văn Đạt", date: "28/05/2026", rating: 4, comment: "Máy mát, chạy êm. Nói chung rất đáng đồng tiền bát gạo cho phân khúc cấu hình này." }
      ];
    }
    if (cat.includes("pc")) {
      return [
        { name: "Nguyễn Tiến Hưng", date: "10/06/2026", rating: 5, comment: "Cấu hình PC quá khủng, chiến mọi game AAA max setting cực mượt. Hệ thống tản nhiệt hoạt động rất mát mẻ." },
        { name: "Trần Minh Hoàng", date: "05/06/2026", rating: 5, comment: "Dây cáp đi gọn gàng, LED RGB đồng bộ tuyệt đẹp. Nhân viên hỗ trợ lắp ráp và cài đặt sẵn phần mềm rất tận tình." },
        { name: "Lê Văn Đạt", date: "28/05/2026", rating: 4, comment: "Nguồn khỏe, hiệu năng ổn định khi render 3D và dựng phim. Hài lòng với chính sách bảo hành 3 năm." }
      ];
    }
    if (cat.includes("phụ kiện") || cat.includes("accessory")) {
      return [
        { name: "Nguyễn Tiến Hưng", date: "10/06/2026", rating: 5, comment: "Phụ kiện hoàn thiện tinh tế, độ nhạy cao và kết nối không dây rất ổn định. Đúng chuẩn hàng chính hãng." },
        { name: "Trần Minh Hoàng", date: "05/06/2026", rating: 5, comment: "Màu sắc rất đẹp, thiết kế công thái học cầm nắm lâu không bị mỏi tay. Giá cả hợp lý." },
        { name: "Lê Văn Đạt", date: "28/05/2026", rating: 4, comment: "Đóng gói bọc xốp chống sốc rất kỹ càng, giao hàng nhanh. Dùng rất sướng." }
      ];
    }
    return [
      { name: "Nguyễn Tiến Hưng", date: "10/06/2026", rating: 5, comment: "Sản phẩm linh kiện chính hãng, đóng gói cẩn thận, test thông số chuẩn chỉnh. Dịch vụ chăm sóc khách hàng tốt!" },
      { name: "Trần Minh Hoàng", date: "05/06/2026", rating: 5, comment: "Linh kiện chạy ổn định, cắm vào nhận ngay. Rất hài lòng." },
      { name: "Lê Văn Đạt", date: "28/05/2026", rating: 4, comment: "Hiệu năng tốt, bảo hành chính hãng lâu dài giúp yên tâm sử dụng. Đánh giá 5 sao!" }
    ];
  }, [product?.category]);

  // Dynamic visual gallery CSS transformation values depending on thumb clicked
  const getGalleryTransformClass = (_idx: number) => {
    return ""; // Flat layout (ko nghiêng nghiêng)
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f5f5f7] py-20">
        <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium text-sm">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f5f5f7] py-20 px-4 text-center">
        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-zinc-500 max-w-md mb-8">{error || "Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã được gỡ bỏ khỏi hệ thống."}</p>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full font-bold shadow transition hover:bg-zinc-800 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>
    );
  }

  const bgStyle = product.from && product.to
    ? { background: `linear-gradient(135deg, #${product.from}, #${product.to})` }
    : { background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)" };

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-16 pt-6">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mb-6">
          <Link to="/" className="hover:text-black transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/store" className="hover:text-black transition-colors">Cửa hàng</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-400 capitalize">{product.category.replace("Phụ kiện - ", "")}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 font-semibold truncate max-w-[200px] md:max-w-none">{product.name}</span>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-950 font-bold mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Interactive Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            
            {/* Gallery Thumbnails List */}
            <div className="order-2 md:order-1 flex md:flex-col gap-3 justify-center md:justify-start">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border flex items-center justify-center p-2 overflow-hidden transition-all duration-300 cursor-pointer shadow-sm relative shrink-0 ${
                    activeImgIdx === idx 
                      ? "border-zinc-950 ring-2 ring-zinc-900/10 scale-105" 
                      : "border-zinc-200/60 hover:border-zinc-400 hover:scale-[1.02]"
                  }`}
                >
                  <div className="absolute inset-0 bg-zinc-50 opacity-40" />
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={`${product.name} view ${idx + 1}`}
                      className={`max-w-[85%] max-h-[85%] object-contain transition-transform duration-300 ${getGalleryTransformClass(idx)}`}
                    />
                  ) : (
                    <Sparkles className="w-5 h-5 text-zinc-400" />
                  )}
                  <span className="absolute bottom-1 right-1.5 text-[8px] font-black text-zinc-400">#0{idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Main Interactive Screen */}
            <div className="order-1 md:order-2 flex-1 bg-white rounded-[2.5rem] p-8 md:p-12 border border-zinc-200/50 shadow-sm relative aspect-[4/3] flex items-center justify-center overflow-hidden select-none">
              <div 
                className="absolute inset-0 opacity-10 blur-3xl pointer-events-none scale-110 transition-transform duration-700"
                style={bgStyle}
              />

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className={`max-w-[85%] max-h-[85%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out relative z-10 ${getGalleryTransformClass(activeImgIdx)}`}
                />
              ) : (
                <div 
                  className="w-full h-full rounded-2xl flex items-center justify-center"
                  style={bgStyle}
                >
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                    <span className="text-xs font-bold tracking-wider">ẢNH SẢN PHẨM</span>
                  </div>
                </div>
              )}

              {product.badge && (
                <span className="absolute top-6 left-6 px-4 py-2 bg-zinc-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm z-10">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Info & Action Box */}
          <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 md:p-10 border border-zinc-200/50 shadow-sm flex flex-col justify-between">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center gap-2 mb-3 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-blue-600 font-extrabold">{product.brand || "PC Shop"}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-6">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xs font-bold text-zinc-800">5.0</span>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs font-semibold text-zinc-500 hover:underline cursor-pointer">3 đánh giá</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-black text-zinc-950 mb-6">
                {formatCartPrice(product.price)}
              </div>

              {/* Promo Offers & Installments Box */}
              <div className="mb-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-amber-950">
                <div className="font-bold flex items-center gap-1.5 mb-2.5 text-amber-900 uppercase tracking-wider">
                  <Gift className="w-4 h-4 shrink-0 text-amber-700" /> Quà tặng & Khuyến mãi đặc biệt
                </div>
                <ul className="space-y-2 pl-1 text-amber-900/95 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 w-1.5 h-1.5 bg-amber-600 rounded-full shrink-0" />
                    <span>Giảm thêm 5% (tối đa 500.000đ) khi thanh toán chuyển khoản hoặc ví VNPAY.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 w-1.5 h-1.5 bg-amber-600 rounded-full shrink-0" />
                    <span>Tặng gói vệ sinh định kỳ máy tính miễn phí trong 12 tháng.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 w-1.5 h-1.5 bg-amber-600 rounded-full shrink-0" />
                    <span>Hỗ trợ trả góp lãi suất 0% thông qua thẻ tín dụng (kỳ hạn đến 12 tháng).</span>
                  </li>
                </ul>
              </div>

              {/* Highlights list */}
              {specList.length > 0 && (
                <div className="mb-8 border-t border-zinc-100 pt-6">
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-4">Điểm nổi bật</h3>
                  <ul className="grid grid-cols-1 gap-2.5">
                    {specList.slice(0, 4).map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 font-medium">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8 border-t border-zinc-100 pt-6">
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-4">Chọn màu sắc</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          selectedColor === color
                            ? "border-zinc-900 bg-zinc-950 text-white shadow-sm"
                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buying Action Box */}
            <div className="border-t border-zinc-100 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 h-12 inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-950 hover:bg-zinc-850 text-white text-sm font-bold shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Mua ngay
                </button>
                <div className="flex items-center gap-3">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      specs: product.specs,
                      price: product.price,
                      image: product.image,
                      category: product.category
                    }}
                    label="Thêm vào giỏ"
                    className="h-12 text-sm font-bold shadow-md px-6 hover:scale-[1.01]"
                  />
                  <button 
                    onClick={() => setLiked(!liked)} 
                    className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-full border border-zinc-200 bg-white transition hover:scale-105 active:scale-95 cursor-pointer ${
                      liked ? "text-red-500 bg-red-50/50 border-red-100" : "text-zinc-400 hover:text-zinc-700"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Store Benefits */}
              <div className="grid grid-cols-3 gap-3 border-t border-zinc-100/60 pt-6">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Shield className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
                  <span className="text-[10px] font-black text-zinc-800 uppercase tracking-wider leading-none">Chính hãng</span>
                  <span className="text-[9px] text-zinc-400 leading-tight">Bảo hành 36 tháng</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Truck className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
                  <span className="text-[10px] font-black text-zinc-800 uppercase tracking-wider leading-none">Giao hàng</span>
                  <span className="text-[9px] text-zinc-400 leading-tight">Miễn phí toàn quốc</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <RotateCcw className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
                  <span className="text-[10px] font-black text-zinc-800 uppercase tracking-wider leading-none">Đổi trả</span>
                  <span className="text-[9px] text-zinc-400 leading-tight">7 ngày hoàn tiền</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs Block & Warranty Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Detailed Specifications Table */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 border border-zinc-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 mb-6 flex items-center gap-2">
              Thông số kỹ thuật chi tiết
            </h2>
            {parsedSpecs.length > 0 ? (
              <div className="overflow-hidden border border-zinc-100 rounded-2xl">
                <table className="w-full text-sm text-left border-collapse">
                  <tbody>
                    {parsedSpecs.map((spec, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-b border-zinc-100/80 last:border-b-0 hover:bg-zinc-50/50 transition-colors ${
                          idx % 2 === 0 ? "bg-zinc-50/30" : "bg-white"
                        }`}
                      >
                        <td className="w-1/3 py-4 px-5 font-bold text-zinc-500 text-xs uppercase tracking-wider">
                          {spec.label}
                        </td>
                        <td className="py-4 px-5 font-semibold text-zinc-800">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-400 text-sm">
                Không tìm thấy cấu hình chi tiết cho thiết bị này.
              </div>
            )}
          </div>

          {/* Warranty / Delivery policies */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 border border-zinc-200/50 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 mb-6">Chính sách mua hàng &amp; bảo hành</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Bảo hành 100% chính hãng</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-1">Dịch vụ sửa chữa tại nhà hoặc trung tâm bảo hành được ủy quyền. Hỗ trợ thay linh kiện chính hãng miễn phí.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Giao hàng hỏa tốc trong 2h</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-1">Hỗ trợ giao hàng hỏa tốc nội thành Hà Nội &amp; TP.HCM. Khách hàng kiểm tra sản phẩm trước khi thanh toán.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Trả hàng hoàn tiền linh hoạt</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-1">Lỗi kỹ thuật do nhà sản xuất được đổi mới sản phẩm tương đương hoặc hoàn tiền 100% trong vòng 7 ngày đầu.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 rounded-xl bg-zinc-50 border border-zinc-200/50 flex gap-3 text-xs text-zinc-500 leading-relaxed">
              <Info className="w-4.5 h-4.5 shrink-0 text-zinc-400" />
              <span>Giá bán đã bao gồm thuế GTGT (VAT) và được cập nhật liên tục dựa theo chính sách khuyến mãi thị trường của cửa hàng.</span>
            </div>
          </div>

        </div>

        {/* Detailed Reviews tabs block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Reviews column */}
          <div className="lg:col-span-12 bg-white rounded-[2rem] p-8 md:p-10 border border-zinc-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 mb-8 flex items-center gap-2">
              Khách hàng đánh giá <span className="px-2 py-0.5 text-xs bg-zinc-100 rounded-full font-bold text-zinc-600">3 đánh giá</span>
            </h2>
            
            {/* Advanced Rating Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-zinc-100 pb-8 mb-8">
              <div className="md:col-span-4 flex flex-col items-center text-center border-r border-zinc-100/80 pr-4">
                <span className="text-5xl font-black text-zinc-900">5.0</span>
                <div className="flex text-amber-400 my-2">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xs font-semibold text-zinc-400">Điểm đánh giá trung bình dựa trên đánh giá thực tế</span>
              </div>
              
              {/* Bars chart */}
              <div className="md:col-span-8 space-y-2 max-w-lg w-full">
                {[
                  { star: 5, percent: 92, count: 3 },
                  { star: 4, percent: 8, count: 0 },
                  { star: 3, percent: 0, count: 0 },
                  { star: 2, percent: 0, count: 0 },
                  { star: 1, percent: 0, count: 0 }
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-3 text-xs font-semibold">
                    <span className="w-8 text-zinc-500 shrink-0 text-right">{row.star} sao</span>
                    <div className="flex-1 bg-zinc-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-zinc-400 text-right shrink-0">{row.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-6">
              {mockReviews.map((rev, idx) => (
                <div key={idx} className="pb-6 border-b border-zinc-100 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-zinc-900">{rev.name}</h4>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                          <Check className="w-2.5 h-2.5" /> Đã mua hàng
                        </span>
                      </div>
                      <div className="flex text-amber-400 mt-1">
                        {Array.from({ length: 5 }).map((_, rIdx) => (
                          <Star 
                            key={rIdx} 
                            className={`w-3.5 h-3.5 ${rIdx < rev.rating ? "fill-current" : "text-zinc-200"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-zinc-400 font-semibold">{rev.date}</span>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-3">{rev.comment}</p>
                  <button className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-blue-600 font-bold transition-colors cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5" /> Hữu ích (1)
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-zinc-200/50 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-950 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    navigate(`/san-pham/${p.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group bg-zinc-50 hover:bg-white rounded-2xl border border-zinc-100 p-4 hover:shadow-md hover:border-zinc-200 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="aspect-[4/3] bg-white rounded-xl flex items-center justify-center p-3 mb-3 border border-zinc-100 group-hover:scale-[1.01] transition-transform duration-300">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-zinc-200 animate-pulse" />
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 leading-tight mb-1 line-clamp-2">{p.name}</h3>
                    <p className="text-xs text-zinc-400 mb-3 truncate">{p.specs}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-zinc-900">{formatCartPrice(p.price)}</span>
                    <span className="p-2 rounded-full bg-zinc-900 text-white group-hover:bg-zinc-800 transition duration-300">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
