import { serve } from "bun";

const PORT = 3001;
const DATA_FILE = "./backend/data.json";

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
    image: `http://localhost:${PORT}/images/pc-infinity.png`
  },
  {
    badge: "Mới",
    badgeColor: "#2563eb",
    name: "PC Gaming Frost",
    specs: "Ryzen 7 7800X3D • RTX 4070 Ti\n32GB RAM • 1TB SSD",
    price: "32.990.000đ",
    from: "#1d4ed8",
    to: "#38bdf8",
    image: `http://localhost:${PORT}/images/pc-frost.png`
  },
  {
    badge: "Hot",
    badgeColor: "#dc2626",
    name: "PC Gaming Nebula",
    specs: "i9-14900K • RTX 4080 SUPER\n32GB RAM • 2TB SSD",
    price: "45.990.000đ",
    from: "#0f172a",
    to: "#1e40af",
    image: `http://localhost:${PORT}/images/pc-nebula.png`
  },
  {
    badge: "",
    badgeColor: "",
    name: "PC Workstation Pro",
    specs: "Threadripper 7970X • RTX 4090\n64GB RAM • 2TB SSD",
    price: "89.990.000đ",
    from: "#18181b",
    to: "#3f3f46",
    image: `http://localhost:${PORT}/images/pc-workstation.png`
  },
  {
    badge: "",
    badgeColor: "",
    name: "PC Mini White",
    specs: "Ryzen 5 7600 • RTX 4060\n16GB RAM • 1TB SSD",
    price: "18.990.000đ",
    from: "#e2e8f0",
    to: "#f1f5f9",
    image: `http://localhost:${PORT}/images/pc-mini.png`
  },
  {
    badge: "Sale",
    badgeColor: "#e11d48",
    name: "PC Gaming Cyberpunk",
    specs: "Ryzen 5 7600X • RTX 4070\n32GB RAM • 1TB SSD",
    price: "24.500.000đ",
    from: "#f59e0b",
    to: "#e11d48",
    image: `http://localhost:${PORT}/images/pc-infinity.png`
  },
  {
    badge: "Mới",
    badgeColor: "#2563eb",
    name: "PC Gaming Liquid Ice",
    specs: "i9-13900K • RTX 4070 Ti SUPER\n32GB RAM • 2TB SSD",
    price: "38.990.000đ",
    from: "#06b6d4",
    to: "#3b82f6",
    image: `http://localhost:${PORT}/images/pc-frost.png`
  },
  {
    badge: "",
    badgeColor: "",
    name: "PC Creator Studio",
    specs: "i7-14700 • RTX 4060 Ti 16GB\n32GB RAM • 1TB SSD",
    price: "27.800.000đ",
    from: "#4b5563",
    to: "#1f2937",
    image: `http://localhost:${PORT}/images/pc-workstation.png`
  },
  {
    badge: "",
    badgeColor: "",
    name: "PC Mini Carbon",
    specs: "Ryzen 7 7700 • RTX 4070 ITX\n32GB RAM • 1TB SSD",
    price: "29.990.000đ",
    from: "#374151",
    to: "#111827",
    image: `http://localhost:${PORT}/images/pc-mini.png`
  },
  {
    badge: "Hot",
    badgeColor: "#dc2626",
    name: "PC Gaming Supernova",
    specs: "Ryzen 9 7900X • RTX 4070 Ti SUPER\n64GB RAM • 2TB SSD",
    price: "39.990.000đ",
    from: "#4338ca",
    to: "#6d28d9",
    image: `http://localhost:${PORT}/images/pc-nebula.png`
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

async function readData() {
  const file = Bun.file(DATA_FILE);
  let db: any = null;
  if (await file.exists()) {
    try {
      db = await file.json();
    } catch (e) {
      console.error("Failed parsing data.json, resetting to defaults", e);
    }
  }

  // Handle migration from old Array format to new Object format
  if (!db || Array.isArray(db)) {
    db = {
      pcs: Array.isArray(db) ? db : defaultPCs,
      components: defaultComponents,
      laptops: defaultLaptops,
      accessories: defaultAccessories,
      tickets: defaultTickets
    };
    await writeData(db);
  } else {
    // Fill in missing sections just in case
    let modified = false;
    if (!db.pcs) { db.pcs = defaultPCs; modified = true; }
    if (!db.components) { db.components = defaultComponents; modified = true; }
    if (!db.laptops) { db.laptops = defaultLaptops; modified = true; }
    if (!db.accessories) { db.accessories = defaultAccessories; modified = true; }
    if (!db.tickets) { db.tickets = defaultTickets; modified = true; }
    if (modified) {
      await writeData(db);
    }
  }
  return db;
}

async function writeData(data: any) {
  await Bun.write(DATA_FILE, JSON.stringify(data, null, 2));
}

serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
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
      return Response.json(db.pcs, { headers });
    }

    // GET Components
    if (url.pathname === "/api/components" && req.method === "GET") {
      const db = await readData();
      return Response.json(db.components, { headers });
    }

    // GET Laptops
    if (url.pathname === "/api/laptops" && req.method === "GET") {
      const db = await readData();
      return Response.json(db.laptops, { headers });
    }

    // GET Accessories
    if (url.pathname === "/api/accessories" && req.method === "GET") {
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

    return new Response("Not Found", { status: 404, headers });
  },
});

console.log(`[Backend] Bun server running on http://localhost:${PORT}`);
