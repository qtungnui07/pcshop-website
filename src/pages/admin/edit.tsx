import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Image
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  { id: "pc", name: "Máy tính để bàn (PC)" },
  { id: "laptop", name: "Laptop / Notebook" },
  { id: "linh-kien", name: "Linh kiện PC" },
  { id: "phu-kien", name: "Phụ kiện Gaming" },
  { id: "combo-phu-kien", name: "Combo phụ kiện" },
  { id: "accounts", name: "Quản lý Tài khoản" }
];

const formatPrice = (val: number | string) => {
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^\d]/g, ""));
  if (isNaN(num)) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(num) + "đ";
};

const PORT = 3001;
const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:${PORT}`)
  : `http://localhost:${PORT}`;

// PC image presets
const PC_IMAGE_TEMPLATES = [
  { name: "Infinity RGB (Purple/Pink)", filename: "pc-infinity.png", url: `${API_BASE}/images/pcs/pc-infinity.png` },
  { name: "Frost RGB (White/Cyan)", filename: "pc-frost.png", url: `${API_BASE}/images/pcs/pc-frost.png` },
  { name: "Nebula RGB (Space/Dark)", filename: "pc-nebula.png", url: `${API_BASE}/images/pcs/pc-nebula.png` },
  { name: "Workstation Pro (Black/Clean)", filename: "pc-workstation.png", url: `${API_BASE}/images/pcs/pc-workstation.png` },
  { name: "Mini White (Compact ITX)", filename: "pc-mini.png", url: `${API_BASE}/images/pcs/pc-mini.png` }
];

const GRADIENT_PRESETS = [
  { name: "Purple Dream", from: "#7c3aed", to: "#ec4899" },
  { name: "Ocean Breeze", from: "#1d4ed8", to: "#38bdf8" },
  { name: "Dark Nebula", from: "#0f172a", to: "#1e40af" },
  { name: "Slate Metal", from: "#18181b", to: "#3f3f46" },
  { name: "Cyber Sunset", from: "#f59e0b", to: "#e11d48" }
];

const ACCESSORY_CATEGORY_OPTIONS = [
  { name: "Màn hình", icon: "Monitor", defaultBrand: "LG" },
  { name: "Bàn phím", icon: "Keyboard", defaultBrand: "Keychron" },
  { name: "Chuột", icon: "Mouse", defaultBrand: "Logitech" },
  { name: "Tai nghe", icon: "Headphones", defaultBrand: "Logitech" },
  { name: "Loa", icon: "Speaker", defaultBrand: "Harman Kardon" },
  { name: "Webcam", icon: "Webcam", defaultBrand: "Logitech" },
  { name: "Lót chuột", icon: "Grid3X3", defaultBrand: "Razer" },
  { name: "Cáp & Hub", icon: "Cable", defaultBrand: "UGREEN" },
  { name: "Giá đỡ", icon: "Monitor", defaultBrand: "Razer" }
];

const ACCESSORY_BRAND_OPTIONS = [
  "Logitech", "Razer", "Corsair", "SteelSeries", "HyperX", "Keychron", "ASUS", "MSI", 
  "LG", "Dell", "Samsung", "AOC", "BenQ", "ViewSonic", "Acer", "Gigabyte", "Sony", 
  "JBL", "Harman Kardon", "Edifier", "UGREEN", "Baseus", "Anker", "Belkin", "TP-Link"
];

const ACCESSORY_COLOR_OPTIONS = [
  { name: "Đen", hex: "#000000" },
  { name: "Trắng", hex: "#ffffff" },
  { name: "Xám", hex: "#9ca3af" },
  { name: "Bạc", hex: "#e5e7eb" },
  { name: "Hồng", hex: "#f472b6" },
  { name: "Xanh dương", hex: "#0ea5e9" },
  { name: "Đỏ", hex: "#ef4444" },
  { name: "Xanh lá", hex: "#10b981" },
  { name: "Tím", hex: "#8b5cf6" }
];

const AUTOFILL_TEMPLATES: Record<string, any[]> = {
  pc: [
    {
      templateName: "Frost White Core i5 (Phổ thông)",
      name: "PC Gaming Frost White",
      specs: "Intel Core i5-14400F • RTX 4060 White\n32GB DDR5 RAM • 1TB NVMe SSD",
      price: "18.990.000đ",
      from: "#1d4ed8",
      to: "#38bdf8",
      badge: "Mới",
      badgeColor: "#2563eb",
      image: `${API_BASE}/images/pcs/pc-frost.png`
    },
    {
      templateName: "Nebula Core i7 (Tầm trung)",
      name: "PC Gaming Nebula RGB",
      specs: "Intel Core i7-14700K • RTX 4070 SUPER\n32GB DDR5 RAM • 2TB NVMe SSD",
      price: "34.500.000đ",
      from: "#7c3aed",
      to: "#ec4899",
      badge: "Bán chạy",
      badgeColor: "#dc2626",
      image: `${API_BASE}/images/pcs/pc-nebula.png`
    }
  ],
  laptop: [
    {
      templateName: "ASUS ROG Zephyrus G14 (Gaming)",
      brand: "ASUS",
      name: "ASUS ROG Zephyrus G14 2026",
      specs: "AMD Ryzen 9 8945HS / 32GB DDR5 /\n1TB SSD / RTX 4070 / 14\" 3K OLED",
      price: "36.990.000 đ",
      img: "https://dlcdnwebimgs.asus.com/gain/97f4b8da-e77d-418c-8515-3850123533be/w800"
    },
    {
      templateName: "MacBook Air M3 (Văn phòng)",
      brand: "Apple",
      name: "MacBook Air M3 15 inch",
      specs: "Apple M3 8-Core CPU / 16GB Unified RAM /\n512GB SSD / 15.3\" Liquid Retina",
      price: "32.490.000 đ",
      img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mba15-midnight-select-202403?wid=904&hei=840&fmt=jpeg"
    }
  ],
  "linh-kien": [
    {
      templateName: "DDR5 Trident Z5 RAM",
      name: "G.Skill Trident Z5 Royal RGB",
      specs: "32GB (2x16GB) DDR5 6400MHz Silver CL32",
      price: "4.890.000đ",
      badge: "Mới",
      badgeColor: "#10b981",
      color: "#e0e7ef"
    },
    {
      templateName: "VGA RTX 4070 Super GPU",
      name: "Gigabyte RTX 4070 SUPER EAGLE OC 12G",
      specs: "12GB GDDR6X / 192-bit / 3 Fan Windforce / LED RGB",
      price: "19.490.000đ",
      badge: "Hot",
      badgeColor: "#f97316",
      color: "#c8d0dc"
    }
  ],
  "phu-kien": [
    {
      templateName: "LG UltraGear 27GP850-B (Màn hình)",
      name: "LG UltraGear 27GP850-B",
      brand: "LG",
      category: "Màn hình",
      price: 6990000,
      badge: "Mới",
      colors: ["Đen"],
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=85",
      fallbackIcon: "Monitor"
    },
    {
      templateName: "Keychron K8 Pro RGB (Bàn phím)",
      name: "Keychron K8 Pro RGB",
      brand: "Keychron",
      category: "Bàn phím",
      price: 3190000,
      badge: "Bán chạy",
      colors: ["Đen", "Xanh dương"],
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=85",
      fallbackIcon: "Keyboard"
    }
  ]
};

export default function AdminEdit() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category") || "pc";
  const indexParam = searchParams.get("index");
  const editIndex = indexParam !== null ? parseInt(indexParam, 10) : -1;
  const isNew = editIndex === -1;

  // DB State for fetching dependencies (combo needs accessory list)
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Form states
  const [formName, setFormName] = useState("");
  const [formSpecs, setFormSpecs] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formBadgeColor, setFormBadgeColor] = useState("#1d1d1f");
  const [formImage, setFormImage] = useState("");
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // PC background gradient fields
  const [formFrom, setFormFrom] = useState("#7c3aed");
  const [formTo, setFormTo] = useState("#ec4899");

  // Brand selector
  const [formBrand, setFormBrand] = useState("");

  // Linh kien fields
  const [formLinhKienCategory, setFormLinhKienCategory] = useState("RAM");
  const [formLinhKienColor, setFormLinhKienColor] = useState("#e0e7ef");

  // Phu kien fields
  const [formPhuKienCategory, setFormPhuKienCategory] = useState("Tai nghe");
  const [formPhuKienColors, setFormPhuKienColors] = useState<string[]>([]);
  const [formPhuKienFallbackIcon, setFormPhuKienFallbackIcon] = useState("Headphones");

  // Combo accessory fields
  const [formComboProductIds, setFormComboProductIds] = useState<string[]>([]);

  // Account specific fields
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountRole, setAccountRole] = useState<"admin" | "user">("user");

  // Validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Fetch full databases on load to map form values
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const loadFormInfo = async () => {
      setLoadingDb(true);
      try {
        const authHeader = { "Authorization": `Bearer ${user.email}` };
        
        // Fetch accessories since combo editing depends on it
        const accRes = await fetch(`${API_BASE}/api/accessories`).then(r => r.json());
        setAccessories(accRes);

        // Fetch current category database to load selected item
        let catUrl = "";
        if (category === "pc") catUrl = `${API_BASE}/api/featured-pcs`;
        else if (category === "laptop") catUrl = `${API_BASE}/api/laptops`;
        else if (category === "linh-kien") catUrl = `${API_BASE}/api/components`;
        else if (category === "phu-kien") catUrl = `${API_BASE}/api/accessories`;
        else if (category === "combo-phu-kien") catUrl = `${API_BASE}/api/accessory-combos`;
        else if (category === "accounts") catUrl = `${API_BASE}/api/accounts`;

        const res = await fetch(catUrl, { headers: authHeader });
        const items = await res.json();

        if (!isNew && items[editIndex]) {
          const item = items[editIndex];
          // Pre-populate fields based on categories
          if (category === "accounts") {
            setAccountName(item.name || "");
            setAccountEmail(item.email || "");
            setAccountRole(item.role || "user");
            setAccountPassword(""); // clear for safety
          } else if (category === "combo-phu-kien") {
            setFormName(item.title || item.name || "");
            setFormSpecs(item.desc || item.specs || "");
            setFormPrice(String(item.discountPercent ?? 0));
            setFormImage(item.image || "");
            setFormComboProductIds((item.productIds || []).map((id: any) => String(id)));
          } else {
            setFormName(item.name || "");
            setFormSpecs(item.specs || "");
            setFormPrice(String(item.price || ""));
            setFormBadge(item.badge || "");
            setFormBadgeColor(item.badgeColor || "#1d1d1f");

            if (category === "pc") {
              setFormFrom(item.from || "#7c3aed");
              setFormTo(item.to || "#ec4899");
              const isTemplate = PC_IMAGE_TEMPLATES.some(t => t.url === item.image);
              if (isTemplate) {
                setFormImage(item.image);
                setIsCustomImage(false);
              } else {
                setFormImage("custom");
                setIsCustomImage(true);
                setCustomImageUrl(item.image || "");
              }
            } else if (category === "laptop") {
              setFormBrand(item.brand || "");
              setFormImage(item.img || item.image || "");
            } else if (category === "linh-kien") {
              setFormLinhKienColor(item.color || "#e0e7ef");
              setFormImage(item.image || "");
              setFormLinhKienCategory(item.category || "RAM");
            } else if (category === "phu-kien") {
              setFormBrand(item.brand || "LG");
              setFormPhuKienCategory(item.category || "Màn hình");
              setFormPhuKienColors(item.colors || []);
              setFormPhuKienFallbackIcon(item.fallbackIcon || "Monitor");
              setFormImage(item.image || "");
            }
          }
        } else {
          // Defaults for new items
          if (category === "pc") {
            setFormImage(PC_IMAGE_TEMPLATES[0].url);
            setFormFrom("#7c3aed");
            setFormTo("#ec4899");
          } else if (category === "laptop") {
            setFormBrand("ASUS");
          } else if (category === "linh-kien") {
            setFormLinhKienCategory("RAM");
            setFormLinhKienColor("#e0e7ef");
          } else if (category === "phu-kien") {
            setFormBrand("LG");
            setFormPhuKienCategory("Màn hình");
            setFormPhuKienColors(["Đen"]);
            setFormPhuKienFallbackIcon("Monitor");
          } else if (category === "combo-phu-kien") {
            setFormName("Combo phụ kiện mới");
            setFormSpecs("Mô tả về lợi ích của combo lắp ghép...");
            setFormPrice("10");
          }
        }
      } catch (err) {
        console.error("Failed loading data to edit", err);
      } finally {
        setLoadingDb(false);
      }
    };

    loadFormInfo();
  }, [user, category, editIndex, isNew]);

  const handleAutofill = (template: any) => {
    setFormName(template.name);
    setFormSpecs(template.specs);
    setFormPrice(String(template.price));
    setFormBadge(template.badge || "");
    setFormBadgeColor(template.badgeColor || "#1d1d1f");

    if (category === "pc") {
      setFormFrom(template.from);
      setFormTo(template.to);
      setFormImage(template.image);
      setIsCustomImage(false);
    } else if (category === "laptop") {
      setFormBrand(template.brand);
      setFormImage(template.img || template.image || "");
    } else if (category === "linh-kien") {
      setFormLinhKienColor(template.color);
      setFormImage(template.image || "");
    } else if (category === "phu-kien") {
      setFormBrand(template.brand);
      setFormPhuKienCategory(template.category);
      setFormPhuKienColors(template.colors);
      setFormPhuKienFallbackIcon(template.fallbackIcon);
      setFormImage(template.image);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (category === "accounts") {
      if (!accountName.trim()) errors.name = "Họ và tên không được trống.";
      if (!accountEmail.trim()) errors.email = "Email không được trống.";
      else if (!/\S+@\S+\.\S+/.test(accountEmail)) errors.email = "Email không đúng định dạng.";
      if (isNew && !accountPassword.trim()) errors.password = "Mật khẩu không được trống.";
    } else if (category === "combo-phu-kien") {
      const discountPercent = Number(String(formPrice).replace(/[^\d]/g, ""));
      if (!formName.trim()) errors.name = "Tên combo không được trống.";
      if (formComboProductIds.length < 2) errors.products = "Combo cần chọn ít nhất 2 sản phẩm.";
      if (Number.isNaN(discountPercent) || discountPercent < 0 || discountPercent > 90) {
        errors.price = "Phần trăm giảm giá phải từ 0 đến 90.";
      }
    } else {
      if (!formName.trim()) errors.name = "Tên sản phẩm không được trống.";
      if (!formPrice.trim() && typeof formPrice !== "number") errors.price = "Giá hiển thị không được trống.";

      if (category === "laptop" && !formBrand.trim()) {
        errors.brand = "Thương hiệu không được để trống.";
      }
      if (category === "phu-kien") {
        if (!formBrand.trim()) errors.brand = "Thương hiệu không được trống.";
        if (formPhuKienColors.length === 0) errors.colors = "Vui lòng chọn ít nhất một màu sắc.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;

    setSaving(true);
    try {
      const authHeader = { "Authorization": `Bearer ${user.email}` };
      
      // 1. Fetch current list of products/accounts from backend
      let catUrl = "";
      if (category === "pc") catUrl = `${API_BASE}/api/featured-pcs`;
      else if (category === "laptop") catUrl = `${API_BASE}/api/laptops`;
      else if (category === "linh-kien") catUrl = `${API_BASE}/api/components`;
      else if (category === "phu-kien") catUrl = `${API_BASE}/api/accessories`;
      else if (category === "combo-phu-kien") catUrl = `${API_BASE}/api/accessory-combos`;
      else if (category === "accounts") catUrl = `${API_BASE}/api/accounts`;

      const listRes = await fetch(catUrl, { headers: authHeader });
      const currentList = await listRes.json();

      // 2. Prepare the new/updated item object
      let newItem: any = {};
      
      if (category === "accounts") {
        const existing = isNew ? null : currentList[editIndex];
        newItem = {
          id: isNew ? `acc-${Date.now()}` : existing.id,
          name: accountName.trim(),
          email: accountEmail.toLowerCase().trim(),
          password: accountPassword ? accountPassword : (isNew ? "" : existing.password || ""),
          role: accountRole,
          avatar: isNew ? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(accountName)}` : existing.avatar || "",
          provider: isNew ? "local" : existing.provider || "local"
        };
      } else if (category === "combo-phu-kien") {
        const existing = isNew ? null : currentList[editIndex];
        const discountPercent = Math.min(90, Math.max(0, Number(String(formPrice).replace(/[^\d]/g, "")) || 0));
        newItem = {
          id: isNew ? `combo-${Date.now()}` : existing?.id || `combo-${Date.now()}`,
          title: formName.trim(),
          name: formName.trim(),
          desc: formSpecs.trim(),
          specs: formSpecs.trim(),
          productIds: formComboProductIds,
          discountPercent,
          image: formImage.trim(),
          isActive: true,
          createdAt: existing?.createdAt || new Date().toISOString()
        };
      } else if (category === "pc") {
        const imgUrl = isCustomImage ? customImageUrl : formImage;
        newItem = {
          name: formName.trim(),
          specs: formSpecs.trim(),
          price: formPrice.trim(),
          badge: formBadge.trim(),
          badgeColor: formBadgeColor,
          from: formFrom,
          to: formTo,
          image: imgUrl
        };
      } else if (category === "laptop") {
        newItem = {
          brand: formBrand.trim(),
          name: formName.trim(),
          specs: formSpecs.trim(),
          price: formPrice.trim(),
          img: formImage.trim(),
          image: formImage.trim()
        };
      } else if (category === "linh-kien") {
        newItem = {
          name: formName.trim(),
          specs: formSpecs.trim(),
          price: formPrice.trim(),
          badge: formBadge.trim(),
          badgeColor: formBadgeColor,
          image: formImage.trim(),
          color: formLinhKienColor,
          category: formLinhKienCategory
        };
      } else if (category === "phu-kien") {
        let numericPrice = parseFloat(formPrice.replace(/[^\d]/g, ""));
        if (isNaN(numericPrice)) numericPrice = 0;

        newItem = {
          id: isNew ? Math.floor(100 + Math.random() * 900) : currentList[editIndex].id || Date.now(),
          name: formName.trim(),
          brand: formBrand.trim(),
          category: formPhuKienCategory,
          specs: formSpecs.trim(),
          price: numericPrice,
          badge: formBadge.trim(),
          colors: formPhuKienColors,
          image: formImage.trim(),
          fallbackIcon: formPhuKienFallbackIcon
        };
      }

      // 3. Write back to list
      if (isNew) {
        currentList.push(newItem);
      } else {
        currentList[editIndex] = newItem;
      }

      // 4. PUT / POST database immediately to auto-save
      const saveRes = await fetch(catUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.email}`
        },
        body: JSON.stringify(currentList)
      });
      if (!saveRes.ok) throw new Error("Auto-save failed");

      // Redirect back with successful save
      navigate(`/admin?view=${category === "accounts" ? "accounts" : "products"}${category === "accounts" ? "" : `&category=${category}`}`);
    } catch (err) {
      console.error(err);
      alert("Không thể lưu cấu hình mới. Vui lòng kiểm tra lại kết nối!");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleColorCheckbox = (colorName: string) => {
    if (formPhuKienColors.includes(colorName)) {
      setFormPhuKienColors(formPhuKienColors.filter(c => c !== colorName));
    } else {
      setFormPhuKienColors([...formPhuKienColors, colorName]);
    }
  };

  const handleToggleComboProduct = (productId: string | number) => {
    const value = String(productId);
    if (formComboProductIds.includes(value)) {
      setFormComboProductIds(formComboProductIds.filter((id) => id !== value));
    } else {
      setFormComboProductIds([...formComboProductIds, value]);
    }
  };

  const getComboOriginalPrice = () => {
    return formComboProductIds
      .map((id) => accessories.find((product) => String(product.id) === String(id)))
      .filter(Boolean)
      .reduce((sum, p) => sum + Number(p.price || 0), 0);
  };

  const getComboDiscountedPrice = () => {
    const orig = getComboOriginalPrice();
    const discount = Math.min(90, Math.max(0, Number(String(formPrice).replace(/[^\d]/g, "")) || 0));
    return Math.round(orig * (100 - discount) / 100);
  };

  if (loadingDb) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-zinc-500">Đang tải thông tin cấu hình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      
      {/* Back button header */}
      <div className="flex items-center gap-3.5 mb-6">
        <button
          onClick={() => navigate(`/admin?view=${category === "accounts" ? "accounts" : "products"}${category === "accounts" ? "" : `&category=${category}`}`)}
          className="p-2 border border-zinc-200 hover:bg-zinc-100 rounded-xl bg-white transition cursor-pointer shadow-sm text-zinc-700 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-black text-zinc-900 capitalize">
            {isNew ? "Thêm mới" : "Chỉnh sửa"} {category === "accounts" ? "tài khoản" : "sản phẩm"}
          </h2>
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            Danh mục: {category === "combo-phu-kien" ? "Combo phụ kiện" : CATEGORIES.find(c => c.id === category)?.name || category}
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveForm} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Form Inputs (7-8 columns) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-4">
          
          {/* Smart template dropdown (except accounts/combo) */}
          {category !== "accounts" && category !== "combo-phu-kien" && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 space-y-1.5">
              <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                ⚡️ Nhập nhanh từ cấu hình mẫu (Autofill Template)
              </label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const templates = AUTOFILL_TEMPLATES[category] || [];
                    const t = templates.find((x: any) => x.templateName === val);
                    if (t) handleAutofill(t);
                  }
                }}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold focus:border-zinc-800 outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>-- Chọn mẫu sản phẩm có sẵn --</option>
                {(AUTOFILL_TEMPLATES[category] || []).map((t: any) => (
                  <option key={t.templateName} value={t.templateName}>{t.templateName}</option>
                ))}
              </select>
            </div>
          )}

          {/* DYNAMIC FIELD INPUTS */}
          <div className="space-y-4 text-xs font-bold text-zinc-600">
            
            {category === "accounts" ? (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-zinc-700">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl font-semibold text-zinc-800 focus:border-zinc-900 outline-none transition"
                    placeholder="Nguyễn Văn A..."
                  />
                  {formErrors.name && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.name}</span>}
                </div>

                <div>
                  <label className="block mb-1 text-zinc-700">Địa chỉ Email</label>
                  <input
                    type="email"
                    required
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl font-semibold text-zinc-800 focus:border-zinc-900 outline-none transition"
                    placeholder="email@company.com..."
                  />
                  {formErrors.email && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.email}</span>}
                </div>

                <div>
                  <label className="block mb-1 text-zinc-700">Mật khẩu {!isNew && "(Để trống nếu không đổi)"}</label>
                  <input
                    type="password"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl font-semibold text-zinc-800 focus:border-zinc-900 outline-none transition"
                    placeholder={isNew ? "Tối thiểu 6 ký tự..." : "••••••••"}
                  />
                  {formErrors.password && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.password}</span>}
                </div>

                <div>
                  <label className="block mb-1 text-zinc-700">Vai trò (Role)</label>
                  <select
                    value={accountRole}
                    onChange={(e) => setAccountRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-zinc-800 font-semibold focus:border-zinc-900 outline-none cursor-pointer bg-white"
                  >
                    <option value="user">Thành viên (User)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Brand select */}
                {category === "laptop" && (
                  <div>
                    <label className="block mb-1 text-zinc-700">Thương hiệu</label>
                    <input
                      type="text"
                      required
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      placeholder="Ví dụ: ASUS, Dell, Apple..."
                      className="w-full px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl font-semibold text-zinc-800 focus:border-zinc-900 outline-none transition"
                    />
                  </div>
                )}

                {category === "phu-kien" && (
                  <div>
                    <label className="block mb-1 text-zinc-700">Thương hiệu</label>
                    <select
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-zinc-800 font-semibold focus:border-zinc-900 outline-none cursor-pointer bg-white"
                    >
                      {ACCESSORY_BRAND_OPTIONS.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category select */}
                {category === "linh-kien" && (
                  <div>
                    <label className="block mb-1 text-zinc-700">Danh mục Linh kiện</label>
                    <select
                      value={formLinhKienCategory}
                      onChange={(e) => setFormLinhKienCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-zinc-800 font-semibold focus:border-zinc-900 outline-none cursor-pointer bg-white"
                    >
                      <option value="RAM">RAM - Bộ nhớ trong</option>
                      <option value="CPU">CPU - Vi xử lý</option>
                      <option value="VGA">VGA - Card màn hình</option>
                      <option value="Mainboard">Mainboard - Bo mạch chủ</option>
                      <option value="SSD">SSD - Ổ cứng thể rắn</option>
                      <option value="PSU">PSU - Nguồn máy tính</option>
                      <option value="Cooling">Cooling - Tản nhiệt</option>
                      <option value="Case">Case - Vỏ máy tính</option>
                    </select>
                  </div>
                )}

                {category === "phu-kien" && (
                  <div>
                    <label className="block mb-1 text-zinc-700">Danh mục Phụ kiện</label>
                    <select
                      value={formPhuKienCategory}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormPhuKienCategory(val);
                        const opt = ACCESSORY_CATEGORY_OPTIONS.find(c => c.name === val);
                        if (opt) {
                          setFormBrand(opt.defaultBrand);
                          setFormPhuKienFallbackIcon(opt.icon);
                        }
                      }}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-zinc-800 font-semibold focus:border-zinc-900 outline-none cursor-pointer bg-white"
                    >
                      {ACCESSORY_CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block mb-1 text-zinc-700">Tên sản phẩm / Combo</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nhập tên sản phẩm..."
                    className="w-full px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl font-semibold text-zinc-800 focus:border-zinc-900 outline-none transition"
                  />
                  {formErrors.name && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.name}</span>}
                </div>

                {/* Specs description */}
                <div>
                  <label className="block mb-1 text-zinc-700">
                    {category === "combo-phu-kien" ? "Mô tả combo" : "Thông số kỹ thuật chi tiết (Ấn Enter xuống dòng)"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formSpecs}
                    onChange={(e) => setFormSpecs(e.target.value)}
                    placeholder="Nhập thông số chi tiết..."
                    className="w-full px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl font-semibold text-zinc-800 focus:border-zinc-900 outline-none transition resize-none"
                  />
                </div>

                {/* Price / Discount percent */}
                <div>
                  <label className="block mb-1 text-zinc-700">
                    {category === "combo-phu-kien" ? "Giảm giá combo (%)" : "Giá hiển thị"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder={category === "combo-phu-kien" ? "Ví dụ: 15" : category === "phu-kien" ? "Ví dụ: 3990000 (chỉ nhập số)" : "Ví dụ: 28.990.000đ"}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl font-semibold text-zinc-800 focus:border-zinc-900 outline-none transition"
                  />
                  {formErrors.price && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.price}</span>}
                </div>

                {/* Combo Selector for accessories */}
                {category === "combo-phu-kien" && (
                  <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50 space-y-3">
                    <label className="block text-zinc-750 font-extrabold uppercase text-[10px] tracking-wider">
                      Chọn các phụ kiện ghép trong Combo
                    </label>
                    <div className="max-h-60 overflow-y-auto rounded-xl border border-zinc-250 bg-white p-2.5 space-y-2">
                      {accessories.length === 0 ? (
                        <p className="text-zinc-400 text-center py-4">Chưa có sản phẩm phụ kiện nào.</p>
                      ) : (
                        accessories.map((product) => {
                          const isChecked = formComboProductIds.includes(String(product.id));
                          return (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleToggleComboProduct(product.id)}
                              className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition ${
                                isChecked ? "border-blue-600 bg-blue-50/50" : "border-zinc-100 hover:border-zinc-250"
                              }`}
                            >
                              <span className={`h-4.5 w-4.5 rounded border flex items-center justify-center ${
                                isChecked ? "border-blue-600 bg-blue-600 text-white" : "border-zinc-300 bg-white"
                              }`}>
                                {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </span>
                              <div className="min-w-0 flex-1 text-xs">
                                <span className="block truncate font-bold text-zinc-900">{product.name}</span>
                                <span className="block text-[10px] text-zinc-450 mt-0.5">
                                  {product.category} • {formatPrice(product.price)}
                                </span>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                    {formErrors.products && <span className="text-[10px] text-red-500 mt-1 block">{formErrors.products}</span>}

                    <div className="rounded-xl bg-white border border-zinc-200 p-3.5 space-y-2">
                      <div className="flex justify-between items-center text-zinc-500 text-xs">
                        <span>Tổng tiền mua lẻ</span>
                        <span className="line-through">{formatPrice(getComboOriginalPrice())}</span>
                      </div>
                      <div className="flex justify-between items-center font-black text-zinc-900 text-xs">
                        <span>Giá bán Combo (đã giảm)</span>
                        <span className="text-blue-600">{formatPrice(getComboDiscountedPrice())}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 border-t border-zinc-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-950 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Đang lưu cấu hình..." : "Lưu & Tự Động Đồng Bộ"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin?view=${category === "accounts" ? "accounts" : "products"}${category === "accounts" ? "" : `&category=${category}`}`)}
              className="px-6 py-3 border border-zinc-200 hover:bg-zinc-55 hover:text-zinc-800 text-zinc-500 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Hủy bỏ
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Visuals / Colors / Image Templates (4-5 columns) */}
        {category !== "accounts" && (
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">

            {/* Live product preview */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-100 px-5 py-3">
                <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900">
                  Xem trước sản phẩm trực tiếp
                </h3>
                <p className="mt-0.5 text-[9px] font-semibold text-zinc-400">Thay đổi ở biểu mẫu sẽ hiển thị ngay tại đây</p>
              </div>

              <div className="p-4">
                <div
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-zinc-100 p-5"
                  style={{
                    background: category === "pc"
                      ? `linear-gradient(135deg, ${formFrom}, ${formTo})`
                      : category === "linh-kien"
                        ? formLinhKienColor
                        : "#fafafa"
                  }}
                >
                  {formBadge && category !== "laptop" && category !== "combo-phu-kien" && (
                    <span
                      className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[8px] font-black uppercase text-white shadow-sm"
                      style={{ backgroundColor: formBadgeColor }}
                    >
                      {formBadge}
                    </span>
                  )}
                  {(isCustomImage ? customImageUrl : formImage) ? (
                    <img
                      src={isCustomImage ? customImageUrl : formImage}
                      alt={formName || "Product preview"}
                      className="max-h-full max-w-full object-contain drop-shadow-lg"
                    />
                  ) : (
                    <Image className="h-10 w-10 text-zinc-300" />
                  )}
                </div>

                <div className="px-1 pb-1 pt-4">
                  {(formBrand || category === "linh-kien" || category === "combo-phu-kien") && (
                    <p className="mb-1 text-[9px] font-black uppercase tracking-wider text-blue-600">
                      {formBrand || (category === "linh-kien" ? formLinhKienCategory : "Combo phụ kiện")}
                    </p>
                  )}
                  <h4 className="line-clamp-2 text-sm font-black leading-snug text-zinc-950">
                    {formName || "Tên sản phẩm sẽ hiển thị tại đây"}
                  </h4>
                  <p className="mt-2 line-clamp-3 whitespace-pre-line text-[10px] font-medium leading-relaxed text-zinc-500">
                    {formSpecs || "Thông số kỹ thuật và mô tả sản phẩm"}
                  </p>
                  <p className="mt-3 text-base font-black text-zinc-950">
                    {category === "combo-phu-kien"
                      ? formatPrice(getComboDiscountedPrice())
                      : category === "phu-kien"
                        ? formatPrice(formPrice)
                        : formPrice || "0đ"}
                  </p>
                  {category === "phu-kien" && formPhuKienColors.length > 0 && (
                    <p className="mt-1 text-[9px] font-semibold text-zinc-400">Màu: {formPhuKienColors.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Badges details settings (Except combo / laptop) */}
            {category !== "laptop" && category !== "combo-phu-kien" && (
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-4 text-xs font-bold">
                <h3 className="font-extrabold text-zinc-900 uppercase text-[10px] tracking-wider border-b border-zinc-100 pb-2.5">
                  Thiết lập Nhãn nổi bật (Badge)
                </h3>
                
                <div className="space-y-3.5">
                  <div>
                    <label className="block mb-1 text-zinc-500">Tên nhãn hiển thị</label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="Mới, Bán chạy, Giảm giá..."
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs outline-none focus:border-zinc-800 bg-zinc-50"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-zinc-500">Màu nền đại diện nhãn</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formBadgeColor}
                        onChange={(e) => setFormBadgeColor(e.target.value)}
                        className="w-10 h-8 p-0 border border-zinc-200 rounded-lg cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={formBadgeColor}
                        onChange={(e) => setFormBadgeColor(e.target.value)}
                        className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono outline-none focus:border-zinc-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PC Fallback settings */}
            {category === "pc" && (
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-4 text-xs font-bold">
                <h3 className="font-extrabold text-zinc-900 uppercase text-[10px] tracking-wider border-b border-zinc-100 pb-2.5">
                  Màu nền Fallback máy tính
                </h3>
                
                <div className="flex flex-wrap gap-1.5">
                  {GRADIENT_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => { setFormFrom(p.from); setFormTo(p.to); }}
                      className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[9px] font-bold hover:bg-zinc-100 cursor-pointer"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block mb-1 text-[10px] text-zinc-400">Màu đầu (From)</label>
                    <input type="color" value={formFrom} onChange={(e) => setFormFrom(e.target.value)} className="w-full h-8 p-0 border border-zinc-200 rounded-lg cursor-pointer" />
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] text-zinc-400">Màu cuối (To)</label>
                    <input type="color" value={formTo} onChange={(e) => setFormTo(e.target.value)} className="w-full h-8 p-0 border border-zinc-200 rounded-lg cursor-pointer" />
                  </div>
                </div>
              </div>
            )}

            {/* Components fallback color */}
            {category === "linh-kien" && (
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-4 text-xs font-bold">
                <h3 className="font-extrabold text-zinc-900 uppercase text-[10px] tracking-wider border-b border-zinc-100 pb-2.5">
                  Màu nền đại diện linh kiện
                </h3>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formLinhKienColor}
                    onChange={(e) => setFormLinhKienColor(e.target.value)}
                    className="w-10 h-8 p-0 border border-zinc-200 rounded-lg cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={formLinhKienColor}
                    onChange={(e) => setFormLinhKienColor(e.target.value)}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono outline-none focus:border-zinc-800"
                  />
                </div>
              </div>
            )}

            {/* Accessories colors & icons options */}
            {category === "phu-kien" && (
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-4 text-xs font-bold">
                <h3 className="font-extrabold text-zinc-900 uppercase text-[10px] tracking-wider border-b border-zinc-100 pb-2.5">
                  Màu sắc sản phẩm bán ra
                </h3>
                
                <div className="grid grid-cols-3 gap-2">
                  {ACCESSORY_COLOR_OPTIONS.map((c) => {
                    const isChecked = formPhuKienColors.includes(c.name);
                    return (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => handleToggleColorCheckbox(c.name)}
                        className={`flex items-center gap-1.5 p-2 rounded-lg border text-left cursor-pointer transition ${
                          isChecked ? 'border-zinc-900 bg-zinc-950/5 font-extrabold' : 'border-zinc-200 bg-white hover:border-zinc-250'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-zinc-200" style={{ backgroundColor: c.hex }} />
                        <span className="text-[10px] text-zinc-800">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
                {formErrors.colors && <span className="text-[10px] text-red-500 block font-bold">{formErrors.colors}</span>}

                <div className="border-t border-zinc-100 pt-4 space-y-3">
                  <label className="block text-zinc-700">Icon đại diện (Khi lỗi hình ảnh)</label>
                  <select
                    value={formPhuKienFallbackIcon}
                    onChange={(e) => setFormPhuKienFallbackIcon(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-semibold focus:border-zinc-800 outline-none cursor-pointer bg-white"
                  >
                    <option value="Headphones">Tai nghe (Headphones)</option>
                    <option value="Keyboard">Bàn phím (Keyboard)</option>
                    <option value="Mouse">Chuột (Mouse)</option>
                    <option value="Grid3X3">Lót chuột (Grid)</option>
                    <option value="Speaker">Loa (Speaker)</option>
                    <option value="Webcam">Webcam (Webcam)</option>
                    <option value="Monitor">Màn hình / Giá đỡ (Monitor)</option>
                    <option value="Cable">Cáp & Hub (Cable)</option>
                    <option value="HelpCircle">Khác (HelpCircle)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Media Image / Image Templates upload */}
            <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm space-y-4 text-xs font-bold">
              <h3 className="font-extrabold text-zinc-900 uppercase text-[10px] tracking-wider border-b border-zinc-100 pb-2.5 flex items-center gap-1.5">
                <Image className="w-4.5 h-4.5 text-zinc-450" />
                Hình ảnh sản phẩm
              </h3>

              {category === "pc" ? (
                <div className="space-y-3">
                  <label className="block text-zinc-550">Chọn ảnh từ mẫu máy PC</label>
                  <select
                    value={isCustomImage ? "custom" : formImage}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "custom") {
                        setIsCustomImage(true);
                        setFormImage("custom");
                      } else {
                        setIsCustomImage(false);
                        setFormImage(val);
                      }
                    }}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-semibold focus:border-zinc-800 outline-none cursor-pointer bg-white mb-2"
                  >
                    {PC_IMAGE_TEMPLATES.map((img) => (
                      <option key={img.filename} value={img.url}>{img.name}</option>
                    ))}
                    <option value="custom">-- Nhập link liên kết tùy chỉnh --</option>
                  </select>

                  {isCustomImage && (
                    <input
                      type="url"
                      required
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-zinc-900 outline-none"
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-zinc-500">Đường dẫn liên kết hình ảnh (URL)</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-zinc-900 outline-none"
                  />
                </div>
              )}

              {/* Dynamic live image preview */}
              <div className="w-full aspect-video border border-zinc-150 rounded-xl bg-zinc-50 flex items-center justify-center p-2 overflow-hidden">
                {(isCustomImage ? customImageUrl : formImage) ? (
                  <img
                    src={isCustomImage ? customImageUrl : formImage}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&auto=format&fit=crop";
                    }}
                  />
                ) : (
                  <div className="text-center text-zinc-400">
                    <Image className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                    <span className="text-[10px] font-bold block">Không có hình ảnh</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </form>
    </div>
  );
}
