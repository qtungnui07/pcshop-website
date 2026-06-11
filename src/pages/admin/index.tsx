import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  ChevronUp,
  ChevronDown,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Image,
  AlertTriangle,
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
  Lock
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
  color?: string; // fallback color representation
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

const PORT = 3001;
const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:${PORT}`)
  : `http://localhost:${PORT}`;

// Image templates served by backend for PCs
const PC_IMAGE_TEMPLATES = [
  { name: "Infinity RGB (Purple/Pink)", filename: "pc-infinity.png", url: `${API_BASE}/images/pc-infinity.png` },
  { name: "Frost RGB (White/Cyan)", filename: "pc-frost.png", url: `${API_BASE}/images/pc-frost.png` },
  { name: "Nebula RGB (Space/Dark)", filename: "pc-nebula.png", url: `${API_BASE}/images/pc-nebula.png` },
  { name: "Workstation Pro (Black/Clean)", filename: "pc-workstation.png", url: `${API_BASE}/images/pc-workstation.png` },
  { name: "Mini White (Compact ITX)", filename: "pc-mini.png", url: `${API_BASE}/images/pc-mini.png` }
];

// Gradient color presets
const GRADIENT_PRESETS = [
  { name: "Purple Dream", from: "#7c3aed", to: "#ec4899" },
  { name: "Ocean Breeze", from: "#1d4ed8", to: "#38bdf8" },
  { name: "Dark Nebula", from: "#0f172a", to: "#1e40af" },
  { name: "Slate Metal", from: "#18181b", to: "#3f3f46" },
  { name: "Soft Light", from: "#e2e8f0", to: "#f1f5f9" },
  { name: "Cyber Sunset", from: "#f59e0b", to: "#e11d48" },
  { name: "Cyan Spark", from: "#06b6d4", to: "#3b82f6" }
];

// Categories configuration
const CATEGORIES = [
  { id: "pc", name: "Máy tính để bàn (PC)", icon: Monitor, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "laptop", name: "Laptop / Notebook", icon: Laptop, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "linh-kien", name: "Linh kiện PC", icon: Cpu, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "phu-kien", name: "Phụ kiện Gaming", icon: Keyboard, color: "text-orange-600 bg-orange-50 border-orange-200" },
  { id: "tickets", name: "Hỗ trợ (Tickets)", icon: HelpCircle, color: "text-teal-600 bg-teal-50 border-teal-200" },
  { id: "accounts", name: "Quản lý Tài khoản", icon: Users, color: "text-red-600 bg-red-50 border-red-200" }
];

// Icon mapping for accessory icons
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

const ACCESSORY_COLOR_OPTIONS = [
  { name: "Đen", hex: "#000000" },
  { name: "Trắng", hex: "#ffffff" },
  { name: "Hồng", hex: "#f472b6" },
  { name: "Xanh lá", hex: "#34d399" },
  { name: "Xanh dương", hex: "#38bdf8" },
  { name: "Tím", hex: "#a78bfa" }
];

// Autofill Templates
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
      image: `http://localhost:${PORT}/images/pc-frost.png`
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
      image: `http://localhost:${PORT}/images/pc-nebula.png`
    },
    {
      templateName: "Infinity Ryzen 9 (Hi-End)",
      name: "PC Showcase Infinity Dual-AIO",
      specs: "AMD Ryzen 9 7900X • RTX 4080 SUPER\n64GB DDR5 RAM • 2TB NVMe SSD",
      price: "58.990.000đ",
      from: "#0f172a",
      to: "#1e40af",
      badge: "Hot",
      badgeColor: "#8b5cf6",
      image: `http://localhost:${PORT}/images/pc-infinity.png`
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
    },
    {
      templateName: "Dell XPS 14 Premium (Creator)",
      brand: "Dell",
      name: "Dell XPS 14 9440 Intel Ultra",
      specs: "Intel Core Ultra 7 155H / 16GB DDR5 /\n1TB SSD / RTX 4050 / 14.5\" 3.2K OLED",
      price: "47.890.000 đ",
      img: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/xs9320nt-cnb-00000ff090-gy.psd?fmt=png-alpha"
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
      templateName: "Intel Core i5-14600K CPU",
      name: "Intel Core i5-14600K CPU Box",
      specs: "14 Cores / 20 Threads up to 5.3GHz 24MB Cache LGA1700",
      price: "7.890.000đ",
      badge: "",
      badgeColor: "#1d1d1f",
      color: "#1a1a2e"
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
      templateName: "G Pro X Superlight 2 (Chuột)",
      name: "Logitech G Pro X Superlight 2 Dex",
      brand: "Logitech",
      category: "Chuột",
      price: 3890000,
      badge: "Mới",
      colors: ["Đen", "Trắng", "Hồng"],
      image: "https://images.unsplash.com/photo-1707858004668-d33b9a1d1956?auto=format&fit=crop&w=1600&q=85",
      fallbackIcon: "Mouse"
    },
    {
      templateName: "Razer BlackWidow V4 Pro (Bàn phím)",
      name: "Razer BlackWidow V4 Pro Green Switch",
      brand: "Razer",
      category: "Bàn phím",
      price: 5290000,
      badge: "Hot",
      colors: ["Đen"],
      image: "https://images.unsplash.com/photo-1661588756719-8c7bd8bdc72d?auto=format&fit=crop&w=1200&q=85",
      fallbackIcon: "Keyboard"
    },
    {
      templateName: "UGREEN Hub Type-C 9-in-1 (Cáp/Hub)",
      name: "UGREEN Hub 9-in-1 USB-C Dual HDMI 4K",
      brand: "UGREEN",
      category: "Cáp & Hub",
      price: 1290000,
      badge: "",
      colors: ["Đen", "Trắng"],
      image: "https://images.unsplash.com/photo-1707858057802-ab1227691ed5?auto=format&fit=crop&w=1200&q=85",
      fallbackIcon: "Cable"
    }
  ]
};

export default function AdminIndex() {
  const { user, loading: authLoading } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("pc");
  
  // Database arrays
  const [pcs, setPcs] = useState<PCItem[]>([]);
  const [laptops, setLaptops] = useState<LaptopItem[]>([]);
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Dirty state tracking per category
  const [dirty, setDirty] = useState<Record<string, boolean>>({
    pc: false,
    laptop: false,
    "linh-kien": false,
    "phu-kien": false,
    tickets: false,
    accounts: false
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Editor states
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Shared Form inputs
  const [formName, setFormName] = useState("");
  const [formSpecs, setFormSpecs] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formBadgeColor, setFormBadgeColor] = useState("#1d1d1f");
  const [formImage, setFormImage] = useState("");
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Account specific inputs
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountRole, setAccountRole] = useState<"admin" | "user">("user");

  // Ticket specific state
  const [ticketStatus, setTicketStatus] = useState<string>("pending");

  // PC specific inputs
  const [formFrom, setFormFrom] = useState("#7c3aed");
  const [formTo, setFormTo] = useState("#ec4899");

  // Laptop / Accessory specific brand input
  const [formBrand, setFormBrand] = useState("");

  // Linh kiện specific inputs
  const [formLinhKienCategory, setFormLinhKienCategory] = useState("RAM");
  const [formLinhKienColor, setFormLinhKienColor] = useState("#e0e7ef");

  // Phụ kiện specific inputs
  const [formPhuKienCategory, setFormPhuKienCategory] = useState("Tai nghe");
  const [formPhuKienColors, setFormPhuKienColors] = useState<string[]>([]);
  const [formPhuKienFallbackIcon, setFormPhuKienFallbackIcon] = useState("Headphones");

  // Validation feedback
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch all databases on mount
  const fetchData = async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const authHeader = { "Authorization": `Bearer ${user.email}` };
      const [pcsRes, laptopsRes, componentsRes, accessoriesRes, ticketsRes, accountsRes] = await Promise.all([
        fetch(`${API_BASE}/api/featured-pcs`).then(r => r.json()),
        fetch(`${API_BASE}/api/laptops`).then(r => r.json()),
        fetch(`${API_BASE}/api/components`).then(r => r.json()),
        fetch(`${API_BASE}/api/accessories`).then(r => r.json()),
        fetch(`${API_BASE}/api/tickets`, { headers: authHeader }).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/accounts`, { headers: authHeader }).then(r => r.ok ? r.json() : [])
      ]);
      
      setPcs(pcsRes);
      setLaptops(laptopsRes);
      setComponents(componentsRes);
      setAccessories(accessoriesRes);
      setTickets(ticketsRes);
      setAccounts(accountsRes);
      
      setDirty({ pc: false, laptop: false, "linh-kien": false, "phu-kien": false, tickets: false, accounts: false });
      setEditingIndex(null);
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

  // Determine current active list
  const getActiveList = () => {
    if (activeCategory === "pc") return pcs;
    if (activeCategory === "laptop") return laptops;
    if (activeCategory === "linh-kien") return components;
    if (activeCategory === "phu-kien") return accessories;
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
      const matchTicketStatus = item.status?.toLowerCase().includes(q);
      const matchTicketId = item.id?.toLowerCase().includes(q);
      return matchName || matchSpecs || matchBrand || matchCategory || matchEmail || matchRole || matchProvider || matchTicketTitle || matchTicketStatus || matchTicketId;
    });
  };

  // Re-ordering handler
  const handleMove = (indexInFilteredList: number, direction: "up" | "down") => {
    const filteredList = getFilteredList();
    const activeList = [...getActiveList()];
    
    const item = filteredList[indexInFilteredList];
    const originalIndex = activeList.findIndex(x => x === item);
    if (originalIndex === -1) return;

    let targetIndex = originalIndex;
    if (direction === "up") {
      // Find the previous element that is also in the filtered view to preserve search ordering
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
    setDirty({ ...dirty, [activeCategory]: true });
  };

  const updateActiveListState = (newList: any[]) => {
    if (activeCategory === "pc") setPcs(newList);
    else if (activeCategory === "laptop") setLaptops(newList);
    else if (activeCategory === "linh-kien") setComponents(newList);
    else if (activeCategory === "phu-kien") setAccessories(newList);
    else if (activeCategory === "tickets") setTickets(newList);
    else setAccounts(newList);
  };

  // Delete item
  const handleDelete = (indexInFilteredList: number) => {
    const filteredList = getFilteredList();
    const activeList = getActiveList();
    const item = filteredList[indexInFilteredList];
    
    if (activeCategory === "accounts" && user && item.email === user.email) {
      alert("Bạn không thể tự xóa tài khoản của chính mình!");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa "${item.name}" khỏi danh sách?`)) return;

    const newList = activeList.filter(x => x !== item);
    updateActiveListState(newList);
    setDirty({ ...dirty, [activeCategory]: true });
    
    if (editingIndex === indexInFilteredList) {
      setEditingIndex(null);
    }
  };

  // Start Create Item
  const handleStartCreate = () => {
    setEditingIndex(-1); // -1 is new item
    setFormErrors({});

    // Reset fields to category-specific defaults
    setFormName("");
    setFormSpecs("");
    setFormPrice("");
    setFormBadge("");
    setFormBadgeColor("#1d1d1f");
    setCustomImageUrl("");
    setIsCustomImage(false);

    if (activeCategory === "accounts") {
      setAccountName("");
      setAccountEmail("");
      setAccountPassword("");
      setAccountRole("user");
    } else if (activeCategory === "pc") {
      setFormImage(PC_IMAGE_TEMPLATES[0].url);
      setFormFrom("#7c3aed");
      setFormTo("#ec4899");
    } else if (activeCategory === "laptop") {
      setFormBrand("ASUS");
      setFormImage("");
    } else if (activeCategory === "linh-kien") {
      setFormLinhKienCategory("RAM");
      setFormLinhKienColor("#e0e7ef");
    } else {
      setFormBrand("Logitech");
      setFormPhuKienCategory("Chuột");
      setFormPhuKienColors(["Đen"]);
      setFormPhuKienFallbackIcon("Mouse");
      setFormImage("");
    }
  };

  // Start Edit Item
  const handleStartEdit = (indexInFilteredList: number) => {
    const filteredList = getFilteredList();
    const item: any = filteredList[indexInFilteredList];
    
    // Find index in original array
    const originalList = getActiveList();
    const originalIndex = originalList.findIndex(x => x === item);
    if (originalIndex === -1) return;

    setEditingIndex(originalIndex);
    setFormErrors({});

    if (activeCategory === "accounts") {
      setAccountName(item.name || "");
      setAccountEmail(item.email || "");
      setAccountPassword(""); // clear password input for editing (empty means keep current)
      setAccountRole(item.role || "user");
    } else if (activeCategory === "tickets") {
      setTicketStatus(item.status || "pending");
    } else {
      // Populate fields
      setFormName(item.name);
      setFormSpecs(item.specs || "");
      setFormPrice(String(item.price || ""));
      setFormBadge(item.badge || "");
      setFormBadgeColor(item.badgeColor || "#1d1d1f");

      if (activeCategory === "pc") {
        setFormFrom(item.from || "#7c3aed");
        setFormTo(item.to || "#ec4899");
        const isTemplate = PC_IMAGE_TEMPLATES.some(t => t.url === item.image);
        if (isTemplate) {
          setFormImage(item.image || PC_IMAGE_TEMPLATES[0].url);
          setIsCustomImage(false);
        } else {
          setFormImage("custom");
          setIsCustomImage(true);
          setCustomImageUrl(item.image || "");
        }
      } else if (activeCategory === "laptop") {
        setFormBrand(item.brand || "");
        setFormImage(item.img || item.image || "");
      } else if (activeCategory === "linh-kien") {
        setFormLinhKienColor(item.color || "#e0e7ef");
        // Derive category if not stored explicitly
        setFormLinhKienCategory(item.category || "RAM");
      } else {
        setFormBrand(item.brand || "");
        setFormPhuKienCategory(item.category || "Chuột");
        setFormPhuKienColors(item.colors || []);
        setFormPhuKienFallbackIcon(item.fallbackIcon || "Mouse");
        setFormImage(item.image || "");
      }
    }
  };

  // Autofill Template Selector handler
  const handleAutofill = (template: any) => {
    setFormName(template.name);
    setFormSpecs(template.specs);
    setFormPrice(String(template.price));
    setFormBadge(template.badge || "");
    setFormBadgeColor(template.badgeColor || "#1d1d1f");

    if (activeCategory === "pc") {
      setFormFrom(template.from);
      setFormTo(template.to);
      setFormImage(template.image);
      setIsCustomImage(false);
    } else if (activeCategory === "laptop") {
      setFormBrand(template.brand);
      setFormImage(template.img || template.image || "");
    } else if (activeCategory === "linh-kien") {
      setFormLinhKienColor(template.color);
    } else {
      setFormBrand(template.brand);
      setFormPhuKienCategory(template.category);
      setFormPhuKienColors(template.colors);
      setFormPhuKienFallbackIcon(template.fallbackIcon);
      setFormImage(template.image);
    }
  };

  // Validation rules before submitting
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (activeCategory === "accounts") {
      if (!accountName.trim()) errors.name = "Họ và tên không được trống.";
      if (!accountEmail.trim()) errors.email = "Email không được trống.";
      else if (!/\S+@\S+\.\S+/.test(accountEmail)) errors.email = "Email không đúng định dạng.";
      if (editingIndex === -1 && !accountPassword.trim()) errors.password = "Mật khẩu không được trống.";
    } else if (activeCategory === "tickets") {
      // Nothing to validate for tickets
    } else {
      if (!formName.trim()) errors.name = "Tên sản phẩm không được trống.";
      if (!formPrice.trim() && typeof formPrice !== "number") errors.price = "Giá hiển thị không được trống.";

      if (activeCategory === "laptop" && !formBrand.trim()) {
        errors.brand = "Thương hiệu không được để trống.";
      }

      if (activeCategory === "phu-kien") {
        if (!formBrand.trim()) errors.brand = "Thương hiệu không được trống.";
        if (formPhuKienColors.length === 0) errors.colors = "Vui lòng chọn ít nhất một màu sắc.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submit handler
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let newItem: any = {};
    const originalList = [...getActiveList()];

    if (activeCategory === "accounts") {
      const isNew = editingIndex === -1;
      const existing = isNew ? null : (originalList[editingIndex!] as any);
      newItem = {
        id: isNew ? `acc-${Date.now()}` : existing.id,
        name: accountName.trim(),
        email: accountEmail.toLowerCase().trim(),
        password: accountPassword ? accountPassword : (isNew ? "" : existing.password || ""),
        role: accountRole,
        avatar: isNew ? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(accountName)}` : existing.avatar || "",
        provider: isNew ? "local" : existing.provider || "local"
      };
    } else if (activeCategory === "tickets") {
      newItem = { ...originalList[editingIndex!], status: ticketStatus };
    } else if (activeCategory === "pc") {
      const imgUrl = isCustomImage ? customImageUrl : formImage;
      const pcItem: PCItem = {
        name: formName.trim(),
        specs: formSpecs.trim(),
        price: formPrice.trim(),
        badge: formBadge.trim(),
        badgeColor: formBadgeColor,
        from: formFrom,
        to: formTo,
        image: imgUrl
      };
      newItem = pcItem;
    } else if (activeCategory === "laptop") {
      const laptopItem: LaptopItem = {
        brand: formBrand.trim(),
        name: formName.trim(),
        specs: formSpecs.trim(),
        price: formPrice.trim(),
        img: formImage.trim(),
        image: formImage.trim() // store in both keys for maximum page compatibility
      };
      newItem = laptopItem;
    } else if (activeCategory === "linh-kien") {
      const componentItem: ComponentItem = {
        name: formName.trim(),
        specs: formSpecs.trim(),
        price: formPrice.trim(),
        badge: formBadge.trim(),
        badgeColor: formBadgeColor,
        color: formLinhKienColor
      };
      newItem = componentItem;
    } else {
      // Parse price if entered with points or characters
      let numericPrice = parseFloat(formPrice.replace(/[^\d]/g, ""));
      if (isNaN(numericPrice)) numericPrice = 0;

      const accessoryItem: AccessoryItem = {
        id: editingIndex === -1 ? Math.floor(100 + Math.random() * 900) : (originalList[editingIndex!] as any).id || Date.now(),
        name: formName.trim(),
        brand: formBrand.trim(),
        category: formPhuKienCategory,
        price: numericPrice,
        badge: formBadge.trim(),
        colors: formPhuKienColors,
        image: formImage.trim(),
        fallbackIcon: formPhuKienFallbackIcon
      };
      newItem = accessoryItem;
    }

    if (editingIndex === -1) {
      originalList.push(newItem);
    } else if (editingIndex !== null) {
      originalList[editingIndex] = newItem;
    }

    updateActiveListState(originalList);
    setDirty({ ...dirty, [activeCategory]: true });
    setEditingIndex(null); // close editing pane
  };

  // Submit list to backend JSON database
  const handleSaveToDatabase = async () => {
    if (!user || user.role !== "admin") return;
    setSaving(true);
    let url = "";
    let payload: any = [];

    if (activeCategory === "pc") {
      url = `${API_BASE}/api/featured-pcs`;
      payload = pcs;
    } else if (activeCategory === "laptop") {
      url = `${API_BASE}/api/laptops`;
      payload = laptops;
    } else if (activeCategory === "linh-kien") {
      url = `${API_BASE}/api/components`;
      payload = components;
    } else if (activeCategory === "phu-kien") {
      url = `${API_BASE}/api/accessories`;
      payload = accessories;
    } else if (activeCategory === "tickets") {
      url = `${API_BASE}/api/tickets/bulk`;
      payload = tickets;
    } else {
      url = `${API_BASE}/api/accounts`;
      payload = accounts;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.email}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("API responded with error code");
      
      setDirty({ ...dirty, [activeCategory]: false });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed saving to DB:", err);
      alert("Không thể lưu cấu hình mới. Vui lòng kiểm tra lại trạng thái terminal của backend!");
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

  // Format helper for accessory prices in the admin list
  const formatAccessoryPrice = (val: number | string) => {
    const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^\d]/g, ""));
    if (isNaN(num)) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(num) + "đ";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-zinc-950 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-semibold">Đang xác thực thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl p-10 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-6 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Từ chối truy cập</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Tài khoản của bạn không có quyền truy cập vào bảng điều khiển Admin. 
            Vui lòng đăng nhập bằng tài khoản Quản trị viên để tiếp tục.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <a
              href="/auth"
              className="w-full bg-zinc-950 hover:bg-zinc-900 text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-zinc-950/10 transition-colors flex items-center justify-center gap-2"
            >
              Đăng nhập Admin
            </a>
            <a
              href="/"
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold py-3 rounded-xl border border-gray-200 transition-colors"
            >
              Quay về trang chủ
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1450px] mx-auto px-4 md:px-8 py-6 text-zinc-800 font-sans">
      
      {/* ── HEADER & GLOBAL CONTROLS ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">
              Bảng điều khiển Admin
            </span>
            {dirty[activeCategory] && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Thay đổi chưa lưu
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">
            Quản lý Sản phẩm Cửa hàng
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 disabled:opacity-50 text-sm font-semibold rounded-xl transition-all cursor-pointer active:scale-95 bg-white"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Tải lại
          </button>
          
          <button
            onClick={handleSaveToDatabase}
            disabled={saving || getActiveList().length === 0}
            className={`flex items-center gap-1.5 px-5 py-2 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer active:scale-95 ${
              dirty[activeCategory]
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10'
                : 'bg-zinc-800 hover:bg-zinc-950 disabled:opacity-50'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Đã lưu thành công!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu Cơ sở dữ liệu'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── CATEGORY SWITCHER TABS ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-8">
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setEditingIndex(null);
                setSearchQuery("");
              }}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? `${cat.color} ring-2 ring-zinc-950/5 font-extrabold shadow-sm scale-[1.02]`
                  : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800"
              }`}
            >
              <div className={`p-2 rounded-xl ${isActive ? 'bg-white shadow-sm' : 'bg-zinc-100'}`}>
                <CatIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Danh mục</p>
                <p className="text-sm tracking-tight">{cat.name}</p>
              </div>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-3">
          <div className="w-9 h-9 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-sm font-bold">Đang kết nối cơ sở dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT: PRODUCT LIST (7 Columns) ────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            
            {/* Toolbar: Search & Create */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder={`Tìm kiếm trong ${CATEGORIES.find(c => c.id === activeCategory)?.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-zinc-950/5 focus:border-zinc-800 outline-none transition-all"
                />
              </div>
              
              <button
                onClick={handleStartCreate}
                disabled={activeCategory === "tickets"}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-950 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer active:scale-95 ${activeCategory === "tickets" ? "hidden" : ""}`}
              >
                <Plus className="w-4 h-4" /> {activeCategory === "accounts" ? "Tạo tài khoản mới" : "Thêm sản phẩm mới"}
              </button>
            </div>

            {/* List Container */}
            {getFilteredList().length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400">
                {searchQuery.trim() ? "Không tìm thấy sản phẩm nào khớp từ khóa." : "Không có sản phẩm nào trong danh mục này."}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {getFilteredList().map((item: any, idx) => {
                  const originalIndex = getActiveList().findIndex(x => x === item);
                  
                  return (
                    <div
                      key={originalIndex}
                      className={`flex items-center justify-between bg-white border rounded-2xl p-4 transition-all shadow-sm ${
                        editingIndex === originalIndex
                          ? "ring-2 ring-zinc-950 border-transparent bg-zinc-50/20"
                          : "border-zinc-200/80 hover:border-zinc-300"
                      }`}
                    >
                      {/* Product details info row */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        
                        {/* Dynamic Thumbnail */}
                        {activeCategory === "pc" && (
                          <div className="w-16 h-16 bg-[#0c0c0e] rounded-xl flex items-center justify-center p-1 border border-zinc-200 relative overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <div className="w-full h-full rounded-lg" style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }} />
                            )}
                            {item.badge && (
                              <span className="absolute bottom-0 left-0 right-0 text-[8px] font-extrabold text-white text-center py-0.5" style={{ background: item.badgeColor || '#000' }}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {activeCategory === "laptop" && (
                          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 border border-zinc-200 relative overflow-hidden flex-shrink-0">
                            {(item.img || item.image) ? (
                              <img src={item.img || item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <Laptop className="w-7 h-7 text-zinc-300" />
                            )}
                          </div>
                        )}

                        {activeCategory === "linh-kien" && (
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-zinc-200 relative overflow-hidden flex-shrink-0" style={{ background: `linear-gradient(135deg, ${item.color || '#e0e7ef'}22 0%, ${item.color || '#e0e7ef'}44 100%)` }}>
                            <Cpu className="w-7 h-7 text-zinc-400" />
                            {item.badge && (
                              <span className="absolute bottom-0 left-0 right-0 text-[8px] font-extrabold text-white text-center py-0.5" style={{ background: item.badgeColor || '#22c55e' }}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {activeCategory === "phu-kien" && (
                          <div className="w-16 h-16 bg-zinc-50 rounded-xl flex items-center justify-center p-1 border border-zinc-200 relative overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="max-w-full max-h-full object-cover rounded" />
                            ) : (
                              (() => {
                                const IconComp = ACCESSORY_ICONS[item.fallbackIcon || "Keyboard"] || Keyboard;
                                return <IconComp className="w-7 h-7 text-zinc-400" />;
                              })()
                            )}
                            {item.badge && (
                              <span className="absolute bottom-0 left-0 right-0 text-[8px] font-extrabold text-white text-center py-0.5 bg-zinc-950">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                        {activeCategory === "accounts" && (
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center p-1 border border-zinc-200 relative overflow-hidden bg-zinc-50 flex-shrink-0">
                            {item.avatar ? (
                              <img src={item.avatar} alt={item.name} className="w-12 h-12 object-contain" />
                            ) : (
                              <Users className="w-7 h-7 text-zinc-400" />
                            )}
                          </div>
                        )}
                        {activeCategory === "tickets" && (
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center p-1 border border-zinc-200 relative overflow-hidden bg-zinc-50 flex-shrink-0">
                            <HelpCircle className="w-7 h-7 text-zinc-400" />
                          </div>
                        )}

                        {/* Title and Specs */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {activeCategory === "accounts" ? (
                              <>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  item.role === "admin" ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-700"
                                }`}>
                                  {item.role}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  item.provider === "google" ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-500"
                                }`}>
                                  {item.provider}
                                </span>
                                <h3 className="text-sm font-bold text-zinc-900 truncate">
                                  {item.name}
                                </h3>
                              </>
                            ) : activeCategory === "tickets" ? (
                              <>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                  item.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                  item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  {item.status}
                                </span>
                                <span className="bg-zinc-100 text-zinc-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                  {item.categoryLabel}
                                </span>
                                <h3 className="text-sm font-bold text-zinc-900 truncate">
                                  {item.title}
                                </h3>
                              </>
                            ) : (
                              <>
                                {item.brand && (
                                  <span className="bg-zinc-100 text-zinc-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    {item.brand}
                                  </span>
                                )}
                                <h3 className="text-sm font-bold text-zinc-900 truncate">
                                  {item.name}
                                </h3>
                              </>
                            )}
                          </div>
                          
                          {activeCategory === "accounts" ? (
                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed truncate max-w-[450px]">
                              {item.email}
                            </p>
                          ) : activeCategory === "tickets" ? (
                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed truncate max-w-[450px]">
                              {item.contactEmail} • #{item.id}
                            </p>
                          ) : (
                            <p className="text-[11px] text-zinc-400 font-medium whitespace-pre-line leading-relaxed truncate max-w-[450px]">
                              {item.specs ? item.specs.replace(/\n/g, ' • ') : ''}
                            </p>
                          )}

                          {activeCategory !== "accounts" && activeCategory !== "tickets" && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-zinc-800">
                                {activeCategory === "phu-kien" ? formatAccessoryPrice(item.price) : item.price}
                              </span>
                              {activeCategory === "phu-kien" && item.colors && (
                                <div className="flex gap-1">
                                  {item.colors.map((c: string) => (
                                    <span key={c} className="text-[8px] font-bold px-1 bg-zinc-100 rounded text-zinc-500">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Reorder and Action Tools */}
                      <div className="flex items-center gap-1.5 ml-4 flex-shrink-0">
                        {activeCategory !== "accounts" && activeCategory !== "tickets" && (
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleMove(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 hover:bg-zinc-100 disabled:opacity-30 rounded transition-colors cursor-pointer"
                              title="Di chuyển lên"
                            >
                              <ChevronUp className="w-4 h-4 text-zinc-500" />
                            </button>
                            <button
                              onClick={() => handleMove(idx, "down")}
                              disabled={idx === getFilteredList().length - 1}
                              className="p-1 hover:bg-zinc-100 disabled:opacity-30 rounded transition-colors cursor-pointer"
                              title="Di chuyển xuống"
                            >
                              <ChevronDown className="w-4 h-4 text-zinc-500" />
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => handleStartEdit(idx)}
                          className="p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl transition-all cursor-pointer"
                          title={activeCategory === "accounts" ? "Chỉnh sửa tài khoản" : activeCategory === "tickets" ? "Cập nhật Ticket" : "Chỉnh sửa sản phẩm"}
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all cursor-pointer"
                          title={activeCategory === "accounts" ? "Xóa tài khoản" : activeCategory === "tickets" ? "Xóa Ticket" : "Xóa cấu hình"}
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT: EDITOR FORM PANE (4-5 Columns) ────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <AnimatePresence mode="wait">
              {editingIndex !== null ? (
                <motion.form
                  key="edit-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  onSubmit={handleSaveForm}
                  className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm sticky top-24"
                >
                  <h2 className="text-sm font-extrabold text-zinc-900 mb-4 flex items-center gap-1.5 border-b border-zinc-100 pb-3">
                    <Sparkles className="w-5 h-5 text-zinc-950" />
                    {activeCategory === "accounts"
                      ? (editingIndex === -1 ? 'Tạo tài khoản mới' : `Chỉnh sửa tài khoản #${editingIndex + 1}`)
                      : (editingIndex === -1 ? 'Thêm sản phẩm mới' : `Chỉnh sửa #${editingIndex + 1}`)}
                  </h2>

                  {/* SMART TEMPLATE DROPDOWN */}
                  {activeCategory !== "accounts" && activeCategory !== "tickets" && (
                    <div className="mb-4 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                      <label className="block mb-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        ⚡️ Chọn cấu hình nhanh (Autofill Template)
                      </label>
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            const templates = AUTOFILL_TEMPLATES[activeCategory] || [];
                            const t = templates.find((x: any) => x.templateName === val);
                            if (t) handleAutofill(t);
                          }
                        }}
                        className="w-full px-2 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-semibold focus:border-zinc-800 outline-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>-- Chọn mẫu có sẵn --</option>
                        {(AUTOFILL_TEMPLATES[activeCategory] || []).map((t: any) => (
                          <option key={t.templateName} value={t.templateName}>
                            {t.templateName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* FORM FIELDS (DYNAMIC BASED ON CATEGORY) */}
                  <div className="space-y-4 text-xs font-semibold text-zinc-600">
                    {activeCategory === "tickets" ? (
                      <div>
                        <label className="block mb-1.5 text-zinc-700">Trạng thái Ticket</label>
                        <select
                          value={ticketStatus}
                          onChange={(e) => setTicketStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none"
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="processing">Đang xử lý</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                        <div className="mt-4 p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2 text-sm leading-relaxed text-zinc-800">
                           <p><span className="font-bold text-zinc-500">Khách hàng:</span> {getActiveList()[editingIndex!]?.contactName}</p>
                           <p><span className="font-bold text-zinc-500">Email:</span> {getActiveList()[editingIndex!]?.contactEmail}</p>
                           <p><span className="font-bold text-zinc-500">SĐT:</span> {getActiveList()[editingIndex!]?.contactPhone}</p>
                           <p><span className="font-bold text-zinc-500">Địa chỉ:</span> {getActiveList()[editingIndex!]?.contactAddress}</p>
                           <p><span className="font-bold text-zinc-500">Sản phẩm:</span> {getActiveList()[editingIndex!]?.productName} ({getActiveList()[editingIndex!]?.serialNumber})</p>
                           <p><span className="font-bold text-zinc-500">Chi tiết vấn đề:</span> {getActiveList()[editingIndex!]?.description}</p>
                        </div>
                      </div>
                    ) : activeCategory !== "accounts" ? (
                      <>
                        {/* Brand field for Laptop / Accessory */}
                    {(activeCategory === "laptop" || activeCategory === "phu-kien") && (
                      <div>
                        <label className="block mb-1 text-zinc-700">Thương hiệu</label>
                        <input
                          type="text"
                          required
                          value={formBrand}
                          onChange={(e) => {
                            setFormBrand(e.target.value);
                            setFormErrors({ ...formErrors, brand: "" });
                          }}
                          placeholder="Ví dụ: ASUS, Logitech, Razer..."
                          className={`w-full px-3 py-2 border rounded-lg text-sm font-medium outline-none transition-all ${
                            formErrors.brand ? 'border-red-500 focus:ring-red-500/10' : 'border-zinc-200 focus:border-zinc-900'
                          }`}
                        />
                        {formErrors.brand && <span className="text-[10px] text-red-500 mt-1 block font-bold">{formErrors.brand}</span>}
                      </div>
                    )}

                    {/* Category selectors */}
                    {activeCategory === "linh-kien" && (
                      <div>
                        <label className="block mb-1.5 text-zinc-700">Danh mục Linh kiện</label>
                        <select
                          value={formLinhKienCategory}
                          onChange={(e) => setFormLinhKienCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none"
                        >
                          <option value="RAM">RAM</option>
                          <option value="CPU">CPU - Vi xử lý</option>
                          <option value="VGA">VGA - Card màn hình</option>
                          <option value="Mainboard">Mainboard - Bo mạch chủ</option>
                          <option value="SSD">SSD - Ổ cứng thể rắn</option>
                          <option value="HDD">HDD - Ổ cứng cơ</option>
                          <option value="PSU">PSU - Nguồn máy tính</option>
                          <option value="Cooling">Tản nhiệt</option>
                          <option value="Case">Vỏ máy tính (Case)</option>
                        </select>
                      </div>
                    )}

                    {activeCategory === "phu-kien" && (
                      <div>
                        <label className="block mb-1.5 text-zinc-700">Danh mục Phụ kiện</label>
                        <select
                          value={formPhuKienCategory}
                          onChange={(e) => setFormPhuKienCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none"
                        >
                          <option value="Tai nghe">Tai nghe</option>
                          <option value="Bàn phím">Bàn phím</option>
                          <option value="Chuột">Chuột</option>
                          <option value="Lót chuột">Lót chuột</option>
                          <option value="Loa">Loa</option>
                          <option value="Webcam">Webcam</option>
                          <option value="Giá đỡ">Giá đỡ</option>
                          <option value="Cáp & Hub">Cáp & Hub</option>
                        </select>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label className="block mb-1 text-zinc-700">Tên sản phẩm</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => {
                          setFormName(e.target.value);
                          setFormErrors({ ...formErrors, name: "" });
                        }}
                        placeholder="Nhập tên sản phẩm..."
                        className={`w-full px-3 py-2 border rounded-lg text-sm font-medium outline-none transition-all ${
                          formErrors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-zinc-200 focus:border-zinc-900'
                        }`}
                      />
                      {formErrors.name && <span className="text-[10px] text-red-500 mt-1 block font-bold">{formErrors.name}</span>}
                    </div>

                    {/* Specs */}
                    <div>
                      <label className="block mb-1.5 text-zinc-700">Thông số kỹ thuật (Ấn Enter xuống dòng)</label>
                      <textarea
                        rows={3}
                        required
                        value={formSpecs}
                        onChange={(e) => setFormSpecs(e.target.value)}
                        placeholder={
                          activeCategory === "pc"
                            ? "Intel Core i7 • RTX 4070 SUPER\n32GB RAM • 1TB SSD"
                            : activeCategory === "laptop"
                            ? "Core i7 / 16GB / 512GB SSD / 14\" FHD+"
                            : "Nhập thông số chi tiết sản phẩm..."
                        }
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none resize-none"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block mb-1 text-zinc-700">Giá hiển thị</label>
                      <input
                        type="text"
                        required
                        value={formPrice}
                        onChange={(e) => {
                          setFormPrice(e.target.value);
                          setFormErrors({ ...formErrors, price: "" });
                        }}
                        placeholder={activeCategory === "phu-kien" ? "Ví dụ: 3990000 (chỉ nhập số)" : "Ví dụ: 28.990.000đ"}
                        className={`w-full px-3 py-2 border rounded-lg text-sm font-medium outline-none transition-all ${
                          formErrors.price ? 'border-red-500 focus:ring-red-500/10' : 'border-zinc-200 focus:border-zinc-900'
                        }`}
                      />
                      {formErrors.price && <span className="text-[10px] text-red-500 mt-1 block font-bold">{formErrors.price}</span>}
                    </div>

                    {/* Badge & Color */}
                    {activeCategory !== "laptop" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 text-zinc-700">Nhãn (Badge)</label>
                          <input
                            type="text"
                            value={formBadge}
                            onChange={(e) => setFormBadge(e.target.value)}
                            placeholder="Mới, Hot, Bán chạy..."
                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-zinc-700">Màu sắc Nhãn</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={formBadgeColor}
                              onChange={(e) => setFormBadgeColor(e.target.value)}
                              className="w-10 h-9 p-0 border border-zinc-200 rounded-lg cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formBadgeColor}
                              onChange={(e) => setFormBadgeColor(e.target.value)}
                              className="w-full px-2 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:border-zinc-900 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fallback Color for components */}
                    {activeCategory === "linh-kien" && (
                      <div className="border border-zinc-150 rounded-xl p-3 bg-zinc-50">
                        <label className="block mb-1.5 text-zinc-700 font-bold">Màu nền đại diện</label>
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            value={formLinhKienColor}
                            onChange={(e) => setFormLinhKienColor(e.target.value)}
                            className="w-10 h-9 p-0 border border-zinc-200 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formLinhKienColor}
                            onChange={(e) => setFormLinhKienColor(e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-mono focus:border-zinc-900 outline-none bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Fallback Gradients for PCs */}
                    {activeCategory === "pc" && (
                      <div className="border border-zinc-150 rounded-xl p-3 bg-zinc-50">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-zinc-700 font-bold">Màu nền fallback</label>
                          <span className="text-[10px] text-zinc-400">Không hiển thị nếu có ảnh</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {GRADIENT_PRESETS.map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => { setFormFrom(p.from); setFormTo(p.to); }}
                              className="px-2 py-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-[9px] font-bold cursor-pointer"
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 text-[10px] text-zinc-500">Màu Đầu (From)</label>
                            <div className="flex gap-1.5 items-center">
                              <input type="color" value={formFrom} onChange={(e) => setFormFrom(e.target.value)} className="w-8 h-8 p-0 border border-zinc-200 rounded-lg cursor-pointer" />
                              <input type="text" value={formFrom} onChange={(e) => setFormFrom(e.target.value)} className="w-full px-2 py-1 border border-zinc-200 rounded-lg text-[10px] font-mono outline-none bg-white" />
                            </div>
                          </div>
                          <div>
                            <label className="block mb-1 text-[10px] text-zinc-500">Màu Cuối (To)</label>
                            <div className="flex gap-1.5 items-center">
                              <input type="color" value={formTo} onChange={(e) => setFormTo(e.target.value)} className="w-8 h-8 p-0 border border-zinc-200 rounded-lg cursor-pointer" />
                              <input type="text" value={formTo} onChange={(e) => setFormTo(e.target.value)} className="w-full px-2 py-1 border border-zinc-200 rounded-lg text-[10px] font-mono outline-none bg-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Colors Selector for Accessories */}
                    {activeCategory === "phu-kien" && (
                      <div>
                        <label className="block mb-1 text-zinc-700">Màu sắc sản phẩm</label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          {ACCESSORY_COLOR_OPTIONS.map((c) => {
                            const isChecked = formPhuKienColors.includes(c.name);
                            return (
                              <button
                                type="button"
                                key={c.name}
                                onClick={() => handleToggleColorCheckbox(c.name)}
                                className={`flex items-center gap-1.5 p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                  isChecked
                                    ? 'border-zinc-900 bg-zinc-950/5 font-extrabold'
                                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                                }`}
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-zinc-200"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span className="text-[11px] text-zinc-800">{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                        {formErrors.colors && <span className="text-[10px] text-red-500 mt-1 block font-bold">{formErrors.colors}</span>}
                      </div>
                    )}

                    {/* Fallback Icon for Accessories */}
                    {activeCategory === "phu-kien" && (
                      <div>
                        <label className="block mb-1.5 text-zinc-700">Icon đại diện (Khi lỗi hình ảnh)</label>
                        <div className="flex gap-3 items-center">
                          <select
                            value={formPhuKienFallbackIcon}
                            onChange={(e) => setFormPhuKienFallbackIcon(e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none"
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
                          
                          {/* Live Icon preview */}
                          <div className="w-10 h-10 border border-zinc-200 rounded-lg bg-zinc-50 flex items-center justify-center flex-shrink-0">
                            {(() => {
                              const PreviewIcon = ACCESSORY_ICONS[formPhuKienFallbackIcon] || Keyboard;
                              return <PreviewIcon className="w-5 h-5 text-zinc-800" />;
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image / Image templates */}
                    {activeCategory === "pc" ? (
                      <div>
                        <label className="block mb-1.5 text-zinc-700 flex items-center gap-1">
                          <Image className="w-4 h-4 text-zinc-400" /> Hình ảnh sản phẩm
                        </label>
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
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none mb-2"
                        >
                          {PC_IMAGE_TEMPLATES.map((img) => (
                            <option key={img.filename} value={img.url}>{img.name}</option>
                          ))}
                          <option value="custom">-- Nhập link ảnh tùy chỉnh --</option>
                        </select>

                        {isCustomImage && (
                          <input
                            type="url"
                            required
                            value={customImageUrl}
                            onChange={(e) => setCustomImageUrl(e.target.value)}
                            placeholder="https://example.com/pc-image.png"
                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none"
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block mb-1 text-zinc-700 flex items-center gap-1">
                          <Image className="w-4 h-4 text-zinc-400" /> Link hình ảnh sản phẩm
                        </label>
                        <input
                          type="url"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="https://images.unsplash.com/... hoặc /src/assets/..."
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none"
                        />
                      </div>
                    )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        {/* Name */}
                        <div>
                          <label className="block mb-1 text-zinc-700">Họ và tên</label>
                          <input
                            type="text"
                            required
                            value={accountName}
                            onChange={(e) => {
                              setAccountName(e.target.value);
                              setFormErrors({ ...formErrors, name: "" });
                            }}
                            placeholder="Nhập họ và tên..."
                            className={`w-full px-3 py-2 border rounded-lg text-sm font-medium outline-none transition-all ${
                              formErrors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-zinc-200 focus:border-zinc-900'
                            }`}
                          />
                          {formErrors.name && <span className="text-[10px] text-red-500 mt-1 block font-bold">{formErrors.name}</span>}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block mb-1 text-zinc-700">Địa chỉ Email</label>
                          <input
                            type="email"
                            required
                            value={accountEmail}
                            onChange={(e) => {
                              setAccountEmail(e.target.value);
                              setFormErrors({ ...formErrors, email: "" });
                            }}
                            placeholder="username@qtitpc.dev..."
                            className={`w-full px-3 py-2 border rounded-lg text-sm font-medium outline-none transition-all ${
                              formErrors.email ? 'border-red-500 focus:ring-red-500/10' : 'border-zinc-200 focus:border-zinc-900'
                            }`}
                          />
                          {formErrors.email && <span className="text-[10px] text-red-500 mt-1 block font-bold">{formErrors.email}</span>}
                        </div>

                        {/* Password */}
                        <div>
                          <label className="block mb-1 text-zinc-700">Mật khẩu {editingIndex !== -1 && "(Để trống nếu không đổi)"}</label>
                          <input
                            type="password"
                            value={accountPassword}
                            onChange={(e) => {
                              setAccountPassword(e.target.value);
                              setFormErrors({ ...formErrors, password: "" });
                            }}
                            placeholder={editingIndex === -1 ? "Nhập mật khẩu..." : "••••••••"}
                            className={`w-full px-3 py-2 border rounded-lg text-sm font-medium outline-none transition-all ${
                              formErrors.password ? 'border-red-500 focus:ring-red-500/10' : 'border-zinc-200 focus:border-zinc-900'
                            }`}
                          />
                          {formErrors.password && <span className="text-[10px] text-red-500 mt-1 block font-bold">{formErrors.password}</span>}
                        </div>

                        {/* Role selector */}
                        <div>
                          <label className="block mb-1 text-zinc-700">Vai trò (Role)</label>
                          <select
                            value={accountRole}
                            onChange={(e) => setAccountRole(e.target.value as "admin" | "user")}
                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:border-zinc-900 outline-none"
                          >
                            <option value="user">Thành viên (User)</option>
                            <option value="admin">Quản trị viên (Admin)</option>
                          </select>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Form submit buttons */}
                  <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 mt-5">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-950 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4" /> {editingIndex === -1 ? 'Thêm mới' : 'Cập nhật'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                </motion.form>
              ) : (
                <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl p-6 text-center text-zinc-400 flex flex-col items-center justify-center gap-2.5 py-16">
                  <Sparkles className="w-8 h-8 text-zinc-300 animate-pulse" />
                  <p className="text-xs font-bold text-zinc-500">Chưa chọn cấu hình</p>
                  <p className="text-[10px] leading-relaxed max-w-[210px]">
                    Hãy nhấn nút "Chỉnh sửa" trên một card {activeCategory === "accounts" ? "tài khoản" : "sản phẩm"} hoặc nút "{activeCategory === "accounts" ? "Tạo tài khoản mới" : "Thêm sản phẩm mới"}" để bắt đầu chỉnh sửa.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}
    </div>
  );
}
