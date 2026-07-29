import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronRight, Shield, Truck, RotateCcw, Star, ArrowLeft, Check, ShoppingBag, Heart, 
  Gift, Sparkles, AlertCircle, Info, ThumbsUp 
} from "lucide-react";
import AddToCartButton from "../../components/AddToCartButton";
import { useAuth } from "../../context/AuthContext";
import { formatCartPrice, useCart } from "../../context/CartContext";


// Helper to determine API Base URL
const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:3001`)
  : "http://localhost:3001";

const detailContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

const detailItemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const viewportAnimation = {
  initial: { opacity: 0, y: 34, scale: 0.965 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

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

interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  category: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  helpfulUserIds?: string[];
  helpfulCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewSummary {
  average: number;
  count: number;
  distribution: { star: number; count: number; percent: number }[];
}

const parseApiResponse = async (res: Response) => {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    if (text === "Not Found") {
      return { error: "API đánh giá chưa sẵn sàng. Hãy restart/deploy backend mới." };
    }
    return { error: text };
  }
};

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
  const { user } = useAuth();
  const [product, setProduct] = useState<NormalizedProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary>({
    average: 0,
    count: 0,
    distribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0, percent: 0 }))
  });
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState<string | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [helpfulSubmitting, setHelpfulSubmitting] = useState<Set<string>>(new Set());
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    setActiveImgIdx(0);
    setReviews([]);
    setReviewSummary({
      average: 0,
      count: 0,
      distribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0, percent: 0 }))
    });
    setReviewRating(null);
    setReviewComment(null);

    const fetchProduct = async () => {
      try {
        if (id.startsWith("latest-")) {
          // Legacy URL format — resolve via PC API
          const title = id.replace("latest-", "");
          let data: any[] = [];
          try {
            const res = await fetch(`${API_BASE}/api/featured-pcs`);
            if (!res.ok) throw new Error("API error");
            data = await res.json();
          } catch {
            console.warn("Backend offline for latest- lookup.");
          }
          const match = data.find((item: any) => isNameMatch(item.name, title));
          if (match) {
            const normalized: NormalizedProduct = {
              id,
              name: match.name,
              specs: match.specs || "",
              price: match.price,
              image: match.image || "",
              category: "PC",
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
            console.warn("Backend offline. Using empty laptop fallback.");
            data = [];
          }
          
          // Find matching laptop (by name, ID or index)
          let match = data.find((item: any, idx: number) => 
            isNameMatch(item.name, laptopId) || 
            String(item.id) === id ||
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
                id: item.id || `laptop-${item.name}`,
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
            console.warn("Backend offline. Using empty PC fallback.");
            data = [];
          }

          // Find match (by name, ID or index)
          let match = data.find((item: any, idx: number) => 
            isNameMatch(item.name, pcId) || 
            String(item.id) === id ||
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
                id: item.id || `pc-${item.name}`,
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
            console.warn("Backend offline. Using empty accessories fallback.");
            data = [];
          }

          const match = data.find((item: any) => 
            isNameMatch(item.name, accId) || 
            String(item.id) === accId
          );
          if (match) {
            const normalized: NormalizedProduct = {
              id,
              name: match.name,
              specs: match.specs || `${match.brand} • ${match.category}`,
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
            console.warn("Backend offline. Using empty components fallback.");
            data = [];
          }

          const match = data.find((item: any) => {
            const key = `component-${item.category || "linh-kien"}-${item.name}`;
            return String(item.id) === id || isNameMatch(key, id);
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
                id: item.id || `component-${item.category || "linh-kien"}-${item.name}`,
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

  useEffect(() => {
    if (!id || !product) return;

    const fetchReviews = async () => {
      setReviewError("");
      try {
        const params = new URLSearchParams({
          productId: id,
          productName: product.name,
          category: product.category
        });
        const res = await fetch(`${API_BASE}/api/reviews?${params.toString()}`);
        const data = await parseApiResponse(res);
        if (!res.ok) throw new Error(data.error || "Không thể tải đánh giá");
        setReviews(data.reviews || []);
        setReviewSummary(data.summary || {
          average: 0,
          count: 0,
          distribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0, percent: 0 }))
        });
      } catch (err: any) {
        setReviewError(err.message || "Không thể tải đánh giá");
      }
    };

    fetchReviews();
  }, [id, product]);

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

  const currentUserReview = useMemo(() => {
    if (!user) return null;
    return reviews.find((review) => review.userId === user.id) || null;
  }, [reviews, user]);

  const effectiveReviewRating = reviewRating ?? currentUserReview?.rating ?? 5;
  const effectiveReviewComment = reviewComment ?? currentUserReview?.comment ?? "";

  const handleSubmitReview = async () => {
    if (!product || !id || !user) return;

    setReviewSubmitting(true);
    setReviewError("");
    setReviewSuccess("");
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          productName: product.name,
          category: product.category,
          userId: user.id,
          email: user.email,
          rating: effectiveReviewRating,
          comment: effectiveReviewComment
        })
      });
      const data = await parseApiResponse(res);
      if (!res.ok) throw new Error(data.error || "Không thể gửi đánh giá");
      setReviews(data.reviews || []);
      setReviewSummary(data.summary);
      setReviewRating(null);
      setReviewComment(null);
      setReviewSuccess(currentUserReview ? "Đã cập nhật đánh giá của bạn." : "Đã gửi đánh giá của bạn.");
    } catch (err: any) {
      setReviewError(err.message || "Không thể gửi đánh giá");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const getReviewHelpfulCount = (review: ProductReview) => {
    if (typeof review.helpfulCount === "number") return review.helpfulCount;
    return review.helpfulUserIds?.length || 0;
  };

  const isReviewHelpful = (review: ProductReview) => {
    if (!user) return false;
    return Boolean(review.helpfulUserIds?.includes(user.id));
  };

  const handleToggleReviewHelpful = async (review: ProductReview) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setHelpfulSubmitting((prev) => new Set(prev).add(review.id));
    setReviewError("");
    setReviewSuccess("");
    try {
      const res = await fetch(`${API_BASE}/api/reviews/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review.id,
          userId: user.id,
          email: user.email
        })
      });
      const data = await parseApiResponse(res);
      if (!res.ok) throw new Error(data.error || "Không thể cập nhật hữu ích");
      setReviews(data.reviews || []);
      if (data.summary) setReviewSummary(data.summary);
    } catch (err: any) {
      setReviewError(err.message || "Không thể cập nhật hữu ích");
    } finally {
      setHelpfulSubmitting((prev) => {
        const next = new Set(prev);
        next.delete(review.id);
        return next;
      });
    }
  };

  const formatReviewDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  };

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
    <motion.div
      className="bg-[#f5f5f7] min-h-screen pb-16 pt-6"
      variants={detailContainerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <motion.div variants={detailItemVariants} className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mb-6">
          <Link to="/" className="hover:text-black transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/store" className="hover:text-black transition-colors">Cửa hàng</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-400 capitalize">{product.category.replace("Phụ kiện - ", "")}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 font-semibold truncate max-w-[200px] md:max-w-none">{product.name}</span>
        </motion.div>

        {/* Back Button */}
        <motion.button
          variants={detailItemVariants}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-950 font-bold mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </motion.button>

        {/* Main Product Section */}
        <motion.div variants={detailContainerVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Interactive Image Gallery */}
          <motion.div variants={detailItemVariants} className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            
            {/* Gallery Thumbnails List */}
            <div className="order-2 md:order-1 flex md:flex-col gap-3 justify-center md:justify-start">
              {[0, 1, 2, 3].map((idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -12, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.18 + idx * 0.06, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
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
                </motion.button>
              ))}
            </div>

            {/* Main Interactive Screen */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.14, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 md:order-2 flex-1 bg-white rounded-[2.5rem] p-8 md:p-12 border border-zinc-200/50 shadow-sm relative aspect-[4/3] flex items-center justify-center overflow-hidden select-none"
            >
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
            </motion.div>
          </motion.div>

          {/* Right Column: Info & Action Box */}
          <motion.div variants={detailItemVariants} className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 md:p-10 border border-zinc-200/50 shadow-sm flex flex-col justify-between">
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
                  {Array.from({ length: 5 }).map((_, rIdx) => (
                    <Star
                      key={rIdx}
                      className={`w-4 h-4 ${rIdx < Math.round(reviewSummary.average || 0) ? "fill-current" : "text-zinc-200"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-800">{reviewSummary.average.toFixed(1)}</span>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs font-semibold text-zinc-500 hover:underline cursor-pointer">{reviewSummary.count} đánh giá</span>
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
          </motion.div>
        </motion.div>

        {/* Detailed Specs Block & Warranty Block */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          variants={detailContainerVariants}
        >
          
          {/* Detailed Specifications Table */}
          <motion.div variants={detailItemVariants} className="lg:col-span-7 bg-white rounded-[2rem] p-8 border border-zinc-200/50 shadow-sm">
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
          </motion.div>

          {/* Warranty / Delivery policies */}
          <motion.div variants={detailItemVariants} className="lg:col-span-5 bg-white rounded-[2rem] p-8 border border-zinc-200/50 shadow-sm flex flex-col justify-between">
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
          </motion.div>

        </motion.div>

        {/* Detailed Reviews tabs block */}
        <motion.div
          {...viewportAnimation}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12"
        >
          
          {/* Reviews column */}
          <div className="lg:col-span-12 bg-white rounded-[2rem] p-8 md:p-10 border border-zinc-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 mb-8 flex items-center gap-2">
              Khách hàng đánh giá <span className="px-2 py-0.5 text-xs bg-zinc-100 rounded-full font-bold text-zinc-600">{reviewSummary.count} đánh giá</span>
            </h2>
            
            {/* Advanced Rating Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-zinc-100 pb-8 mb-8">
              <div className="md:col-span-4 flex flex-col items-center text-center border-r border-zinc-100/80 pr-4">
                <span className="text-5xl font-black text-zinc-900">{reviewSummary.average.toFixed(1)}</span>
                <div className="flex text-amber-400 my-2">
                  {Array.from({ length: 5 }).map((_, rIdx) => (
                    <Star
                      key={rIdx}
                      className={`w-5 h-5 ${rIdx < Math.round(reviewSummary.average || 0) ? "fill-current" : "text-zinc-200"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-zinc-400">Điểm đánh giá trung bình dựa trên đánh giá thực tế</span>
              </div>
              
              {/* Bars chart */}
              <div className="md:col-span-8 space-y-2 max-w-lg w-full">
                {reviewSummary.distribution.map((row) => (
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

            <div className="border-b border-zinc-100 pb-8 mb-8">
              {user ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">
                        {currentUserReview ? "Cập nhật đánh giá của bạn" : "Viết đánh giá của bạn"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const starValue = idx + 1;
                        return (
                          <button
                            key={starValue}
                            type="button"
                            onClick={() => setReviewRating(starValue)}
                            className="p-1 rounded-full transition hover:bg-white cursor-pointer"
                            aria-label={`${starValue} sao`}
                          >
                            <Star className={`w-6 h-6 ${starValue <= effectiveReviewRating ? "fill-current" : "text-zinc-300"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <textarea
                    value={effectiveReviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    rows={4}
                    maxLength={600}
                    placeholder="Chia sẻ cảm nhận thật của bạn về sản phẩm..."
                    className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                  />
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs font-semibold">
                      {reviewError && <span className="text-red-500">{reviewError}</span>}
                      {reviewSuccess && <span className="text-emerald-600">{reviewSuccess}</span>}
                      {!reviewError && !reviewSuccess && <span className="text-zinc-400">Tối thiểu 3 ký tự. Mỗi tài khoản có một đánh giá cho mỗi sản phẩm.</span>}
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={reviewSubmitting || effectiveReviewComment.trim().length < 3}
                      className="h-10 inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                    >
                      {reviewSubmitting ? "Đang gửi..." : currentUserReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">Đăng nhập để đánh giá sản phẩm</h3>
                    <p className="text-xs text-zinc-500 mt-1">Bạn vẫn có thể đọc toàn bộ đánh giá khi chưa đăng nhập.</p>
                  </div>
                  <Link
                    to="/auth"
                    className="h-10 inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 text-xs font-bold text-white transition hover:bg-zinc-800"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>

            {/* Reviews list */}
            <div className="space-y-6">
              {reviews.map((rev) => {
                const helpful = isReviewHelpful(rev);
                const helpfulCount = getReviewHelpfulCount(rev);
                const isSubmittingHelpful = helpfulSubmitting.has(rev.id);

                return (
                  <div key={rev.id} className="pb-6 border-b border-zinc-100 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-zinc-900">{rev.userName}</h4>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                              <Check className="w-2.5 h-2.5" /> Đã mua hàng
                            </span>
                          )}
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
                      <span className="text-xs text-zinc-400 font-semibold">{formatReviewDate(rev.updatedAt || rev.createdAt)}</span>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed mb-3">{rev.comment}</p>
                    <button
                      type="button"
                      onClick={() => handleToggleReviewHelpful(rev)}
                      disabled={isSubmittingHelpful}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60 ${
                        helpful ? "text-blue-600" : "text-zinc-400 hover:text-blue-600"
                      }`}
                      aria-pressed={helpful}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${helpful ? "fill-current" : ""}`} /> Hữu ích ({helpfulCount})
                    </button>
                  </div>
                );
              })}
              {reviews.length === 0 && (
                <div className="py-8 text-center text-sm font-semibold text-zinc-400">
                  Chưa có đánh giá nào cho sản phẩm này.
                </div>
              )}
            </div>
          </div>

        </motion.div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <motion.div
            {...viewportAnimation}
            className="bg-white rounded-[2rem] p-8 md:p-10 border border-zinc-200/50 shadow-sm"
          >
            <h2 className="text-xl font-bold text-zinc-950 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 22, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.09, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
