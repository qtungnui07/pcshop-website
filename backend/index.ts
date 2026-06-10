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

async function readData() {
  const file = Bun.file(DATA_FILE);
  if (await file.exists()) {
    try {
      return await file.json();
    } catch (e) {
      console.error("Failed parsing data.json, resetting to defaults", e);
    }
  }
  await writeData(defaultPCs);
  return defaultPCs;
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

    // GET & POST featured PCs
    if (url.pathname === "/api/featured-pcs") {
      if (req.method === "POST") {
        try {
          const body = await req.json();
          await writeData(body);
          return Response.json({ success: true }, { headers });
        } catch (err) {
          return Response.json({ error: "Invalid JSON body" }, { status: 400, headers });
        }
      }
      // Default GET
      const data = await readData();
      return Response.json(data, { headers });
    }

    return new Response("Not Found", { status: 404, headers });
  },
});

console.log(`[Backend] Bun server running on http://localhost:${PORT}`);
