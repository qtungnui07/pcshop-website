import { serve } from "bun";
import { mkdir, rename } from "node:fs/promises";

const PORT = 3001;
const DB_DIR = "./backend/db";

try {
  await mkdir(DB_DIR, { recursive: true });
  await mkdir("./backend/public/images", { recursive: true });
} catch (e: any) {
  if (e.code !== "EEXIST") {
    console.error("Failed creating directory:", e);
  }
}

// Default data initialized if data.json doesn't exist
const defaultPCs = [
  {
    badge: "Bán chạy",
    badgeColor: "#1d1d1f",
    name: "PC Gaming Infinity",
    specs: "i7-14700K • RTX 4070 SUPER\n32GB RAM • 1TB SSD",
    price: "28.990.000đ",
    from: "#7c3aed",
    to: "#ec4899",
    image: `http://localhost:${PORT}/images/pcs/pc-infinity.png`
  },
  {
    badge: "Mới",
    badgeColor: "#2563eb",
    name: "PC Gaming Frost",
    specs: "Ryzen 7 7800X3D • RTX 4070 Ti\n32GB RAM • 1TB SSD",
    price: "32.990.000đ",
    from: "#1d4ed8",
    to: "#38bdf8",
    image: `http://localhost:${PORT}/images/pcs/pc-frost.png`
  },
  {
    badge: "Hot",
    badgeColor: "#dc2626",
    name: "PC Gaming Nebula",
    specs: "i9-14900K • RTX 4080 SUPER\n32GB RAM • 2TB SSD",
    price: "45.990.000đ",
    from: "#0f172a",
    to: "#1e40af",
    image: `http://localhost:${PORT}/images/pcs/pc-nebula.png`
  },
  {
    badge: "",
    badgeColor: "",
    name: "PC Workstation Pro",
    specs: "Threadripper 7970X • RTX 4090\n64GB RAM • 2TB SSD",
    price: "89.990.000đ",
    from: "#18181b",
    to: "#3f3f46",
    image: `http://localhost:${PORT}/images/pcs/pc-workstation.png`
  },
  {
    badge: "",
    badgeColor: "",
    name: "PC Mini White",
    specs: "Ryzen 5 7600 • RTX 4060\n16GB RAM • 1TB SSD",
    price: "18.990.000đ",
    from: "#e2e8f0",
    to: "#f1f5f9",
    image: `http://localhost:${PORT}/images/pcs/pc-mini.png`
  },
  {
    badge: "Sale",
    badgeColor: "#e11d48",
    name: "PC Gaming Cyberpunk",
    specs: "Ryzen 5 7600X • RTX 4070\n32GB RAM • 1TB SSD",
    price: "24.500.000đ",
    from: "#f59e0b",
    to: "#e11d48",
    image: `http://localhost:${PORT}/images/pcs/pc-infinity.png`
  },
  {
    badge: "Mới",
    badgeColor: "#2563eb",
    name: "PC Gaming Liquid Ice",
    specs: "i9-13900K • RTX 4070 Ti SUPER\n32GB RAM • 2TB SSD",
    price: "38.990.000đ",
    from: "#06b6d4",
    to: "#3b82f6",
    image: `http://localhost:${PORT}/images/pcs/pc-frost.png`
  },
  {
    badge: "",
    badgeColor: "",
    name: "PC Creator Studio",
    specs: "i7-14700 • RTX 4060 Ti 16GB\n32GB RAM • 1TB SSD",
    price: "27.800.000đ",
    from: "#4b5563",
    to: "#1f2937",
    image: `http://localhost:${PORT}/images/pcs/pc-workstation.png`
  },
  {
    badge: "",
    badgeColor: "",
    name: "PC Mini Carbon",
    specs: "Ryzen 7 7700 • RTX 4070 ITX\n32GB RAM • 1TB SSD",
    price: "29.990.000đ",
    from: "#374151",
    to: "#111827",
    image: `http://localhost:${PORT}/images/pcs/pc-mini.png`
  },
  {
    badge: "Hot",
    badgeColor: "#dc2626",
    name: "PC Gaming Supernova",
    specs: "Ryzen 9 7900X • RTX 4070 Ti SUPER\n64GB RAM • 2TB SSD",
    price: "39.990.000đ",
    from: "#4338ca",
    to: "#6d28d9",
    image: `http://localhost:${PORT}/images/pcs/pc-nebula.png`
  }
];

const defaultComponents = [
  { name: "G.Skill Trident Z5 RGB",      specs: "18GB (2x8GB) DDR5 6000MHz",  price: "2.890.000đ", badge: "Mới",     badgeColor: "#22c55e", color: "#e0e7ef" },
  { name: "Corsair Vengeance RGB",        specs: "16GB (2x8GB) DDR5 5600MHz",  price: "2.290.000đ", badge: "Bán chạy",badgeColor: "#f97316", color: "#1a1a2e" },
  { name: "Kingston Fury Beast",          specs: "16GB (2x8GB) DDR4 3200MHz",  price: "990.000đ",   color: "#1a1a2e" },
  { name: "G.Skill Ripjaws V",            specs: "16GB (2x8GB) DDR4 3600MHz",  price: "1.290.000đ", color: "#2d2d2d" },
  { name: "Corsair Dominator Platinum",   specs: "32GB (2x16GB) DDR5 6000MHz", price: "5.990.000đ", color: "#c8d0dc" },
  { name: "TeamGroup T-Force Delta RGB",  specs: "32GB (2x16GB) DDR5 6000MHz", price: "4.490.000đ", color: "#111827" },
  { name: "Crucial Pro",                  specs: "32GB (2x16GB) DDR5 4800MHz", price: "1.690.000đ", color: "#1f2937" },
  { name: "Kingston Fury Beast",          specs: "32GB (2x16GB) DDR5 6000MHz", price: "4.290.000đ", color: "#1a1a2e" },
  { name: "G.Skill Trident Z5 RGB",      specs: "32GB (2x16GB) DDR5 6400MHz", price: "5.490.000đ", color: "#e0e7ef" },
  { name: "Corsair Vengeance LPX",        specs: "16GB (2x8GB) DDR4 3200MHz",  price: "1.190.000đ", color: "#111" },
  { name: "Apacer PANTHER",              specs: "16GB (2x8GB) DDR4 3600MHz",  price: "1.090.000đ", color: "#f59e0b" },
  { name: "TeamGroup T-Force Vulcan Z",  specs: "16GB (2x8GB) DDR4 3200MHz",  price: "890.000đ",   color: "#dc2626" }
];

const defaultLaptops = [
  { brand: "ASUS", name: "ASUS ROG Zephyrus G14 2024", specs: "Ryzen 9 8945HS / 16GB /\n1TB SSD / RTX 4060 / 14\" OLED", price: "28.990.000 đ", img: "https://dlcdnwebimgs.asus.com/gain/97f4b8da-e77d-418c-8515-3850123533be/w800" },
  { brand: "Apple", name: "MacBook Air M3 13 inch", specs: "Apple M3 / 16GB / 512GB SSD /\n13.6\" Liquid Retina", price: "24.990.000 đ", img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034" },
  { brand: "Dell", name: "Dell XPS 13 Plus 9320", specs: "Intel Core i7-1360P / 16GB /\n512GB SSD / 13.4\" FHD+", price: "27.490.000 đ", img: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/xs9320nt-cnb-00000ff090-gy.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=555&qlt=100,1&resMode=sharp2&size=555,402&chrss=full" },
  { brand: "Lenovo", name: "Lenovo Yoga Slim 7i Pro", specs: "Intel Core i7-13700H / 16GB /\n1TB SSD / 14.5\" 3K", price: "24.490.000 đ", img: "https://p1-ofp.static.pub/fes/cms/2022/07/12/3og7y6a14mve0h7m99a4zcwf47u10v359190.png" },
  { brand: "HP", name: "HP Spectre x360 14", specs: "Intel Core i7-1355U / 16GB /\n1TB SSD / 14\" 2.8K OLED", price: "26.990.000 đ", img: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08404555.png" },
  { brand: "Acer", name: "Acer Swift Go 14 OLED", specs: "Intel Core Ultra 5 125H / 16GB /\n512GB SSD / 14\" 2.8K OLED", price: "20.990.000 đ", img: "https://images.acer.com/is/image/acer/swift-go-14-sfg14-72-sfg14-73-glare-silver-ui-01?$Product-Cards-XL$" },
  { brand: "ASUS", name: "ASUS TUF Gaming A15", specs: "AMD Ryzen 7 7735HS / 16GB /\n512GB SSD / RTX 4060 / 15.6\" FHD 144Hz", price: "24.490.000 đ", img: "https://dlcdnwebimgs.asus.com/gain/d3ad557c-864a-4d7a-8f4b-2d7c58ed00ee/w800" },
  { brand: "MSI", name: "MSI Stealth 16 Studio", specs: "Intel Core i7-13700H / 32GB /\n1TB SSD / RTX 4070 / 16\" 16:10", price: "37.990.000 đ", img: "https://asset.msi.com/resize/image/global/product/product_1672728476839352c3c97db317e0b510ed9c882193.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png" }
];

const defaultAccessories = [
  {
    id: 1,
    name: "Logitech G Pro X 2",
    brand: "Logitech",
    category: "Tai nghe",
    price: 3990000,
    badge: "Mới",
    colors: ["Đen", "Trắng"],
    image: "https://images.unsplash.com/photo-1713926304458-b8e00dfa9911?auto=format&fit=crop&w=1200&q=85",
    fallbackIcon: "Headphones"
  },
  {
    id: 2,
    name: "Razer BlackWidow V4",
    brand: "Razer",
    category: "Bàn phím",
    price: 4290000,
    badge: "Bán chạy",
    colors: ["Đen"],
    image: "https://images.unsplash.com/photo-1661588756719-8c7bd8bdc72d?auto=format&fit=crop&w=1200&q=85",
    fallbackIcon: "Keyboard"
  },
  {
    id: 3,
    name: "Logitech G Pro X Superlight 2",
    brand: "Logitech",
    category: "Chuột",
    price: 2690000,
    colors: ["Trắng", "Đen", "Hồng"],
    image: "https://images.unsplash.com/photo-1707858004668-d33b9a1d1956?auto=format&fit=crop&w=1600&q=85",
    fallbackIcon: "Mouse"
  },
  {
    id: 4,
    name: "Razer Gigantus V2 Large",
    brand: "Razer",
    category: "Lót chuột",
    price: 490000,
    colors: ["Đen"],
    image: "https://images.unsplash.com/photo-1707858057802-ab1227691ed5?auto=format&fit=crop&w=1200&q=85",
    fallbackIcon: "Grid3X3"
  },
  {
    id: 5,
    name: "Harman Kardon Onyx Studio 8",
    brand: "Harman Kardon",
    category: "Loa",
    price: 5490000,
    colors: ["Đen", "Trắng"],
    image: "https://images.unsplash.com/photo-1715321835688-831f4767cf93?auto=format&fit=crop&w=1200&q=85",
    fallbackIcon: "Speaker"
  },
  {
    id: 6,
    name: "Logitech Brio 4K",
    brand: "Logitech",
    category: "Webcam",
    price: 4690000,
    colors: ["Đen"],
    image: "https://images.unsplash.com/photo-1670278458296-00ff8a63141e?auto=format&fit=crop&w=1200&q=85",
    fallbackIcon: "Webcam"
  },
  {
    id: 7,
    name: "Razer Base Station V2 Chroma",
    brand: "Razer",
    category: "Giá đỡ",
    price: 1590000,
    colors: ["Đen"],
    image: "https://images.unsplash.com/photo-1707858057802-ab1227691ed5?auto=format&fit=crop&w=1200&q=85",
    fallbackIcon: "Monitor"
  },
  {
    id: 8,
    name: "UGREEN USB-C Hub 7-in-1",
    brand: "UGREEN",
    category: "Cáp & Hub",
    price: 890000,
    colors: ["Đen", "Trắng"],
    image: "https://images.unsplash.com/photo-1707858057802-ab1227691ed5?auto=format&fit=crop&w=1200&q=85",
    fallbackIcon: "Cable"
  },
  {
    id: 9,
    name: "Keychron K8 Pro",
    brand: "Keychron",
    category: "Bàn phím",
    price: 3190000,
    colors: ["Đen", "Xanh dương"],
    image: "https://images.unsplash.com/photo-1636858508196-d4043dad51fd?auto=format&fit=crop&w=1200&q=85",
    fallbackIcon: "Keyboard"
  },
  {
    id: 10,
    name: "HyperX Pulsefire Haste 2",
    brand: "HyperX",
    category: "Chuột",
    price: 1290000,
    colors: ["Trắng", "Đen", "Hồng"],
    image: "https://images.unsplash.com/photo-1707858004668-d33b9a1d1956?auto=format&fit=crop&w=1600&q=85",
    fallbackIcon: "Mouse"
  }
];

const defaultTickets = [
  {
    id: "TK-1024",
    category: "warranty",
    categoryLabel: "Bảo hành",
    productCategory: "pc",
    productName: "PC Showcase Ultra White AMD",
    serialNumber: "SN-982736154",
    purchaseDate: "2026-01-15",
    purchaseLocation: "online",
    contactName: "Nguyễn Hoàng Long",
    contactPhone: "0901234567",
    contactEmail: "long.nh@gmail.com",
    contactAddress: "123 Đường Láng, Đống Đa, Hà Nội",
    title: "Lỗi đèn LED quạt tản nhiệt không sáng",
    description: "Máy tính mình mua về chạy rất tốt nhưng hôm qua tự dưng bộ 3 quạt tản nhiệt phía trước bị mất đèn LED ARGB, cánh quạt vẫn quay bình thường. Mình đã kiểm tra phần mềm điều khiển LED nhưng không thấy nhận diện quạt.",
    attachments: ["led_loi.png", "mat_sau_case.jpg"],
    status: "processing",
    createdAt: "2026-06-08T10:30:00.000Z"
  },
  {
    id: "TK-1023",
    category: "consulting",
    categoryLabel: "Tư vấn kỹ thuật",
    productCategory: "laptop",
    productName: "Laptop ASUS ROG Strix G16",
    serialNumber: "ASUS-ROG-G16-2025",
    purchaseDate: "2025-11-20",
    purchaseLocation: "hcm_store",
    contactName: "Trần Minh Quân",
    contactPhone: "0987654321",
    contactEmail: "tmquan@yahoo.com",
    contactAddress: "456 Nguyễn Thị Minh Khai, Quận 1, TP. HCM",
    title: "Tư vấn nâng cấp RAM lên 32GB",
    description: "Mình đang sử dụng bản RAM 16GB (8GBx2) bus 4800MHz. Muốn hỏi bên kỹ thuật xem laptop này hỗ trợ nâng lên tối đa bao nhiêu GB? Nên lắp 1 thanh 32GB hay chạy dual channel 16GBx2? Bên cửa hàng có sẵn hàng không để mình mang qua nâng cấp lấy ngay.",
    attachments: [],
    status: "completed",
    createdAt: "2026-06-05T14:15:00.000Z"
  }
];

const defaultAccounts = [
  {
    id: "acc-1001",
    name: "Quản trị viên",
    email: "admin@qtitpc.dev",
    password: "admin123",
    role: "admin",
    avatar: "",
    provider: "local"
  },
  {
    id: "acc-1002",
    name: "Nguyễn Hoàng Long",
    email: "long.nh@gmail.com",
    password: "user123",
    role: "user",
    avatar: "",
    provider: "local"
  }
];

async function readCollection(name: string, defaultValue: any) {
  const file = Bun.file(`${DB_DIR}/${name}.json`);
  if (await file.exists()) {
    try {
      return await file.json();
    } catch (e) {
      console.error(`Failed parsing ${name}.json, resetting to default`, e);
    }
  }
  await writeCollection(name, defaultValue);
  return defaultValue;
}

async function writeCollection(name: string, data: any) {
  await Bun.write(`${DB_DIR}/${name}.json`, JSON.stringify(data, null, 2));
}

async function readData() {
  // Check if we need to migrate from old data.json
  const oldFile = Bun.file("./backend/data.json");
  let oldDb: any = null;
  if (await oldFile.exists()) {
    try {
      oldDb = await oldFile.json();
      console.log("[Migration] Found old data.json, migrating to separate collection files...");
    } catch (e) {
      console.error("[Migration] Failed parsing old data.json", e);
    }
  }

  const pcs = await readCollection("pcs", oldDb?.pcs ?? defaultPCs);
  const components = await readCollection("components", oldDb?.components ?? defaultComponents);
  const laptops = await readCollection("laptops", oldDb?.laptops ?? defaultLaptops);
  const accessories = await readCollection("accessories", oldDb?.accessories ?? defaultAccessories);
  const tickets = await readCollection("tickets", oldDb?.tickets ?? defaultTickets);
  const accounts = await readCollection("accounts", oldDb?.accounts ?? defaultAccounts);

  // Auto-migrate image URLs to subfolders if they aren't migrated yet
  let pcsChanged = false;
  const migratedPcs = pcs.map((pc: any) => {
    if (pc.image && pc.image.includes("/images/pc-") && !pc.image.includes("/images/pcs/pc-")) {
      pcsChanged = true;
      return { ...pc, image: pc.image.replace("/images/pc-", "/images/pcs/pc-") };
    }
    return pc;
  });
  if (pcsChanged) {
    await writeCollection("pcs", migratedPcs);
  }

  let accountsChanged = false;
  const migratedAccounts = accounts.map((acc: any) => {
    if (acc.avatar && acc.avatar.includes("/images/avatar-") && !acc.avatar.includes("/images/users/avatar-")) {
      accountsChanged = true;
      return { ...acc, avatar: acc.avatar.replace("/images/avatar-", "/images/users/avatar-") };
    }
    return acc;
  });
  if (accountsChanged) {
    await writeCollection("accounts", migratedAccounts);
  }

  // If old file existed, write them out and backup/remove the old file
  if (oldDb) {
    await writeCollection("pcs", pcs);
    await writeCollection("components", components);
    await writeCollection("laptops", laptops);
    await writeCollection("accessories", accessories);
    await writeCollection("tickets", tickets);
    await writeCollection("accounts", accounts);
    
    try {
      await rename("./backend/data.json", "./backend/data.json.bak");
      console.log("[Migration] Successfully migrated data.json to backend/db/*.json. Backup saved to backend/data.json.bak");
    } catch (err) {
      console.error("[Migration] Failed to rename old data.json:", err);
    }
  }

  return { pcs, components, laptops, accessories, tickets, accounts };
}

async function writeData(db: any) {
  if (db.pcs) await writeCollection("pcs", db.pcs);
  if (db.components) await writeCollection("components", db.components);
  if (db.laptops) await writeCollection("laptops", db.laptops);
  if (db.accessories) await writeCollection("accessories", db.accessories);
  if (db.tickets) await writeCollection("tickets", db.tickets);
  if (db.accounts) await writeCollection("accounts", db.accounts);
}

function verifyAdmin(req: Request, db: any): boolean {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const email = authHeader.replace("Bearer ", "").trim();
  const user = db.accounts?.find((u: any) => u.email === email);
  return user && user.role === "admin";
}

serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // Serve static images
    if (url.pathname.startsWith("/images/")) {
      const imageName = url.pathname.replace("/images/", "");
      const filePath = `./backend/public/images/${imageName}`;
      const file = Bun.file(filePath);
      return new Response(file, { headers });
    }

    // GET & POST featured PCs (backward compatible with admin panel)
    if (url.pathname === "/api/featured-pcs") {
      if (req.method === "POST") {
        try {
          const body = await req.json();
          const db = await readData();
          db.pcs = body;
          await writeData(db);
          return Response.json({ success: true }, { headers });
        } catch (err) {
          return Response.json({ error: "Invalid JSON body" }, { status: 400, headers });
        }
      }
      // Default GET
      const db = await readData();
      const origin = `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("x-forwarded-host") || req.headers.get("host") || `localhost:${PORT}`}`;
      const pcsWithOrigin = db.pcs.map((pc: any) => ({
        ...pc,
        image: pc.image ? pc.image.replace(/^https?:\/\/[^\/]+/g, origin) : pc.image
      }));
      return Response.json(pcsWithOrigin, { headers });
    }

    // GET & POST Components
    if (url.pathname === "/api/components") {
      if (req.method === "POST") {
        try {
          const body = await req.json();
          const db = await readData();
          db.components = body;
          await writeData(db);
          return Response.json({ success: true }, { headers });
        } catch (err) {
          return Response.json({ error: "Invalid JSON body" }, { status: 400, headers });
        }
      }
      const db = await readData();
      return Response.json(db.components, { headers });
    }

    // GET & POST Laptops
    if (url.pathname === "/api/laptops") {
      if (req.method === "POST") {
        try {
          const body = await req.json();
          const db = await readData();
          db.laptops = body;
          await writeData(db);
          return Response.json({ success: true }, { headers });
        } catch (err) {
          return Response.json({ error: "Invalid JSON body" }, { status: 400, headers });
        }
      }
      const db = await readData();
      return Response.json(db.laptops, { headers });
    }

    // GET & POST Accessories
    if (url.pathname === "/api/accessories") {
      if (req.method === "POST") {
        try {
          const body = await req.json();
          const db = await readData();
          db.accessories = body;
          await writeData(db);
          return Response.json({ success: true }, { headers });
        } catch (err) {
          return Response.json({ error: "Invalid JSON body" }, { status: 400, headers });
        }
      }
      const db = await readData();
      return Response.json(db.accessories, { headers });
    }

    // GET & POST Support Tickets
    if (url.pathname === "/api/tickets") {
      if (req.method === "POST") {
        try {
          const body = await req.json();
          const db = await readData();
          db.tickets = [body, ...db.tickets];
          await writeData(db);
          return Response.json({ success: true, ticket: body }, { headers });
        } catch (err) {
          return Response.json({ error: "Invalid JSON body" }, { status: 400, headers });
        }
      }
      // Default GET
      const db = await readData();
      return Response.json(db.tickets, { headers });
    }

    // POST Update support ticket (e.g. status)
    if (url.pathname === "/api/tickets/update" && req.method === "POST") {
      try {
        const body = await req.json(); // { id, status }
        const db = await readData();
        db.tickets = db.tickets.map((t: any) => t.id === body.id ? { ...t, ...body } : t);
        await writeData(db);
        return Response.json({ success: true }, { headers });
      } catch (err) {
        return Response.json({ error: "Invalid JSON body or missing id" }, { status: 400, headers });
      }
    }

    // ── AUTHENTICATION ENDPOINTS ──────────────────────────────────────

    // POST /api/auth/register
    if (url.pathname === "/api/auth/register" && req.method === "POST") {
      try {
        const { name, email, password } = await req.json();
        if (!name || !email || !password) {
          return Response.json({ error: "Vui lòng nhập đầy đủ thông tin" }, { status: 400, headers });
        }
        const db = await readData();
        const existing = db.accounts?.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          return Response.json({ error: "Email này đã được sử dụng" }, { status: 400, headers });
        }

        const newUser = {
          id: `acc-${Date.now()}`,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: password,
          role: "user",
          avatar: "",
          provider: "local"
        };

        db.accounts = [...(db.accounts || []), newUser];
        await writeData(db);

        // Don't send password back
        const { password: _, ...userWithoutPassword } = newUser;
        return Response.json({ success: true, user: userWithoutPassword }, { headers });
      } catch (err) {
        return Response.json({ error: "Đã xảy ra lỗi hệ thống" }, { status: 500, headers });
      }
    }

    // POST /api/auth/login
    if (url.pathname === "/api/auth/login" && req.method === "POST") {
      try {
        const { email, password } = await req.json();
        if (!email || !password) {
          return Response.json({ error: "Vui lòng nhập email và mật khẩu" }, { status: 400, headers });
        }
        const db = await readData();
        const user = db.accounts?.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!user) {
          return Response.json({ error: "Email hoặc mật khẩu không chính xác" }, { status: 400, headers });
        }

        const { password: _, ...userWithoutPassword } = user;
        return Response.json({ success: true, user: userWithoutPassword }, { headers });
      } catch (err) {
        return Response.json({ error: "Đã xảy ra lỗi hệ thống" }, { status: 500, headers });
      }
    }

    // POST /api/auth/google-login
    if (url.pathname === "/api/auth/google-login" && req.method === "POST") {
      try {
        const { email, name, avatar } = await req.json();
        if (!email || !name) {
          return Response.json({ error: "Thông tin Google không hợp lệ" }, { status: 400, headers });
        }
        const db = await readData();
        let user = db.accounts?.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (user) {
          // If local user exists, let them log in and associate Google avatar if empty
          let updated = false;
          if (!user.avatar && avatar) {
            user.avatar = avatar;
            updated = true;
          }
          if (user.provider !== "google" && user.provider !== "local") {
            user.provider = "google";
            updated = true;
          }
          if (updated) {
            db.accounts = db.accounts.map((u: any) => u.id === user.id ? user : u);
            await writeData(db);
          }
        } else {
          // Create new user for google auth
          user = {
            id: `acc-${Date.now()}`,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: "", // Google accounts don't have local passwords
            role: email.toLowerCase().trim() === "admin@qtitpc.dev" ? "admin" : "user",
            avatar: avatar || "",
            provider: "google"
          };
          db.accounts = [...(db.accounts || []), user];
          await writeData(db);
        }

        const { password: _, ...userWithoutPassword } = user;
        return Response.json({ success: true, user: userWithoutPassword }, { headers });
      } catch (err) {
        return Response.json({ error: "Đã xảy ra lỗi hệ thống" }, { status: 500, headers });
      }
    }

    // POST /api/upload
    if (url.pathname === "/api/upload" && req.method === "POST") {
      try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) {
          return Response.json({ error: "Không tìm thấy tệp tin gửi lên" }, { status: 400, headers });
        }

        const allowedTypes = ["users", "pcs", "laptops", "phu-kien", "linh-kien"];
        const type = (formData.get("type") as string || "users").toLowerCase().trim();
        const subfolder = allowedTypes.includes(type) ? type : "users";

        const allowedExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
        const extension = file.name.split(".").pop()?.toLowerCase() || "png";
        if (!allowedExtensions.includes(extension)) {
          return Response.json({ error: "Định dạng ảnh không hợp lệ (chỉ chấp nhận PNG, JPG, JPEG, GIF, WEBP)" }, { status: 400, headers });
        }

        const prefix = subfolder === "users" ? "avatar" : "img";
        const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;
        const targetDir = `./backend/public/images/${subfolder}`;
        try {
          await mkdir(targetDir, { recursive: true });
        } catch (e: any) {
          if (e.code !== "EEXIST") throw e;
        }
        const filePath = `${targetDir}/${filename}`;

        const arrayBuffer = await file.arrayBuffer();
        await Bun.write(filePath, arrayBuffer);

        const origin = `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("x-forwarded-host") || req.headers.get("host") || `localhost:${PORT}`}`;
        const imageUrl = `${origin}/images/${subfolder}/${filename}`;

        return Response.json({ success: true, url: imageUrl }, { headers });
      } catch (err) {
        console.error("Upload error:", err);
        return Response.json({ error: "Không thể tải tệp tin lên máy chủ" }, { status: 500, headers });
      }
    }

    // POST /api/auth/update-profile
    if (url.pathname === "/api/auth/update-profile" && req.method === "POST") {
      try {
        const body = await req.json();
        const { email, name, phone, address, avatar, newPassword } = body;
        
        if (!email) {
          return Response.json({ error: "Email không được để trống" }, { status: 400, headers });
        }

        const db = await readData();
        const userIndex = db.accounts.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (userIndex === -1) {
          return Response.json({ error: "Không tìm thấy người dùng" }, { status: 404, headers });
        }

        const user = db.accounts[userIndex];
        
        // Update fields
        user.name = name ? name.trim() : user.name;
        if (phone !== undefined) user.phone = phone.trim();
        if (address !== undefined) user.address = address.trim();
        if (avatar !== undefined) user.avatar = avatar;
        if (newPassword) user.password = newPassword;

        // Save
        db.accounts[userIndex] = user;
        await writeData(db);

        // Remove password before returning
        const { password, ...safeUser } = user;

        return Response.json({ success: true, user: safeUser }, { headers });
      } catch (err) {
        console.error("Update profile error:", err);
        return Response.json({ error: "Không thể lưu thay đổi thông tin cá nhân" }, { status: 500, headers });
      }
    }

    // ── ACCOUNTS MANAGEMENT ENDPOINTS (ADMIN ONLY) ───────────────────

    // GET /api/accounts
    if (url.pathname === "/api/accounts" && req.method === "GET") {
      const db = await readData();
      if (!verifyAdmin(req, db)) {
        return Response.json({ error: "Từ chối truy cập. Chỉ dành cho admin." }, { status: 403, headers });
      }
      return Response.json(db.accounts || [], { headers });
    }

    // POST /api/accounts
    if (url.pathname === "/api/accounts" && req.method === "POST") {
      try {
        const db = await readData();
        if (!verifyAdmin(req, db)) {
          return Response.json({ error: "Từ chối truy cập. Chỉ dành cho admin." }, { status: 403, headers });
        }
        const body = await req.json();
        db.accounts = body;
        await writeData(db);
        return Response.json({ success: true }, { headers });
      } catch (err) {
        return Response.json({ error: "Invalid JSON body" }, { status: 400, headers });
      }
    }

    return new Response("Not Found", { status: 404, headers });
  },
});

console.log(`[Backend] Bun server running on http://localhost:${PORT}`);
