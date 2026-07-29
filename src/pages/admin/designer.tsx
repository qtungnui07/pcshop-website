import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, ChevronDown, ChevronUp, Copy,
  Eye, EyeOff, ImagePlus, Layers3, Lock, LockOpen, Play, Plus,
  Redo2, RotateCcw, Save, Sparkles, Trash2, Type, Undo2, GripVertical
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type LayerType = "text" | "image";
type AnimationType = "none" | "fade" | "slide-up" | "slide-left" | "scale" | "blur";

export interface DesignerLayer {
  id: string;
  type: LayerType;
  name: string;
  text?: string;
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  align?: "left" | "center" | "right";
  radius?: number;
  opacity: number;
  hidden?: boolean;
  locked?: boolean;
  animation: AnimationType;
}

export interface FlashcardDesign {
  id: string;
  name: string;
  target: "product" | "offer";
  sourceKey?: string;
  width: number;
  height: number;
  radius: number;
  backgroundFrom: string;
  backgroundTo: string;
  backgroundAngle: number;
  layers: DesignerLayer[];
  updatedAt: string;
}

const STORAGE_KEY = "novapc-flashcard-designs";
const ACTIVE_KEY = "novapc-active-flashcard-design";
const APPLIED_KEY = "novapc-applied-flashcard-designs";
const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:3001`)
  : "http://localhost:3001";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const starterDesigns: FlashcardDesign[] = [
  {
    id: "product-card",
    name: "Card sản phẩm",
    target: "product",
    width: 400,
    height: 500,
    radius: 32,
    backgroundFrom: "#2563eb",
    backgroundTo: "#38bdf8",
    backgroundAngle: 135,
    updatedAt: new Date().toISOString(),
    layers: [
      { id: "badge", type: "text", name: "Nhãn", text: "BÁN CHẠY", x: 32, y: 30, width: 220, height: 24, fontSize: 12, fontWeight: 700, color: "#dbeafe", align: "left", opacity: 1, animation: "fade" },
      { id: "title", type: "text", name: "Tên sản phẩm", text: "PC Gaming Infinity", x: 32, y: 72, width: 336, height: 58, fontSize: 30, fontWeight: 750, color: "#ffffff", align: "left", opacity: 1, animation: "slide-up" },
      { id: "description", type: "text", name: "Cấu hình", text: "i7-14700K · RTX 4070 SUPER\n32GB RAM · 1TB SSD", x: 32, y: 142, width: 320, height: 68, fontSize: 16, fontWeight: 500, color: "#dbeafe", align: "left", opacity: 1, animation: "slide-up" },
      { id: "price", type: "text", name: "Giá", text: "28.990.000đ", x: 32, y: 440, width: 230, height: 30, fontSize: 18, fontWeight: 650, color: "#ffffff", align: "left", opacity: 1, animation: "fade" },
    ],
  },
  {
    id: "offer-card-1",
    name: "Trải nghiệm vượt trội",
    target: "offer",
    sourceKey: "offer:0",
    width: 400,
    height: 500,
    radius: 32,
    backgroundFrom: "#d8b4fe",
    backgroundTo: "#93c5fd",
    backgroundAngle: 145,
    updatedAt: new Date().toISOString(),
    layers: [
      { id: "offer-badge", type: "text", name: "Nhãn", text: "MỚI MẺ", x: 32, y: 30, width: 180, height: 24, fontSize: 12, fontWeight: 700, color: "#3b2766", align: "left", opacity: 1, animation: "fade" },
      { id: "offer-title", type: "text", name: "Tiêu đề", text: "Trải nghiệm vượt trội", x: 32, y: 78, width: 336, height: 72, fontSize: 30, fontWeight: 750, color: "#17122b", align: "left", opacity: 1, animation: "slide-up" },
      { id: "offer-desc", type: "text", name: "Mô tả", text: "Nâng tầm không gian làm việc của bạn với hệ sinh thái đa dạng.", x: 32, y: 160, width: 310, height: 84, fontSize: 16, fontWeight: 500, color: "#493f68", align: "left", opacity: 1, animation: "slide-up" },
    ],
  },
  {
    id: "offer-card-2", name: "Combo Siêu Tiết Kiệm", target: "offer", sourceKey: "offer:1",
    width: 400, height: 500, radius: 32, backgroundFrom: "#fbc2eb", backgroundTo: "#a6c1ee",
    backgroundAngle: 135, updatedAt: new Date().toISOString(),
    layers: [
      { id: "offer2-badge", type: "text", name: "Nhãn", text: "ƯU ĐÃI", x: 32, y: 30, width: 180, height: 24, fontSize: 12, fontWeight: 700, color: "#4b2855", align: "left", opacity: 1, animation: "fade" },
      { id: "offer2-title", type: "text", name: "Tiêu đề", text: "Combo Siêu Tiết Kiệm", x: 32, y: 78, width: 336, height: 72, fontSize: 30, fontWeight: 750, color: "#23162a", align: "left", opacity: 1, animation: "slide-up" },
      { id: "offer2-desc", type: "text", name: "Mô tả", text: "Mua PC kèm màn hình và phụ kiện để nhận ngay giá hời.", x: 32, y: 160, width: 310, height: 84, fontSize: 16, fontWeight: 500, color: "#5d4865", align: "left", opacity: 1, animation: "slide-up" },
    ],
  },
];

function loadDesigns() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return starterDesigns.slice(1);
    const parsed = JSON.parse(value) as FlashcardDesign[];
    const realDesigns = parsed.filter((item) => item.id !== "product-card" && item.id !== "offer-card");
    if (!realDesigns.some((item) => item.sourceKey === "offer:0")) realDesigns.unshift(starterDesigns[1]);
    if (!realDesigns.some((item) => item.sourceKey === "offer:1")) realDesigns.push(starterDesigns[2]);
    return realDesigns;
  } catch {
    return starterDesigns;
  }
}

export default function FlashcardDesigner() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<FlashcardDesign[]>(loadDesigns);
  const [activeId, setActiveId] = useState(designs[0]?.id || "");
  const [selectedId, setSelectedId] = useState(designs[0]?.layers[0]?.id || "");
  const [previewKey, setPreviewKey] = useState(0);
  const [saveState, setSaveState] = useState<"saved" | "published" | "unsaved" | "saving" | "error">("saved");
  const [saveError, setSaveError] = useState("");
  const [history, setHistory] = useState<FlashcardDesign[]>([]);
  const [future, setFuture] = useState<FlashcardDesign[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const dragRef = useRef<{ id: string; sx: number; sy: number; x: number; y: number } | null>(null);
  const layerDragRef = useRef<string | null>(null);

  const design = designs.find((item) => item.id === activeId) || designs[0];
  const selected = design?.layers.find((layer) => layer.id === selectedId);
  const scale = useMemo(() => Math.min(1, 520 / (design?.height || 500)), [design?.height]);
  const productDesigns = designs.filter((item) => item.target === "product");
  const offerDesigns = designs.filter((item) => item.target === "offer");

  const commit = (updater: (current: FlashcardDesign) => FlashcardDesign) => {
    if (!design) return;
    setHistory((items) => [...items.slice(-29), design]);
    setFuture([]);
    setDesigns((items) => items.map((item) => item.id === design.id ? updater(item) : item));
    setSaveState("unsaved");
  };

  const updateLayer = (patch: Partial<DesignerLayer>) => {
    if (!selected) return;
    commit((current) => ({
      ...current,
      layers: current.layers.map((layer) => layer.id === selected.id ? { ...layer, ...patch } : layer),
      updatedAt: new Date().toISOString(),
    }));
  };

  const moveLayer = (layerId: string, direction: "front" | "back") => {
    commit((current) => {
      const index = current.layers.findIndex((layer) => layer.id === layerId);
      const target = direction === "front" ? index + 1 : index - 1;
      if (index < 0 || target < 0 || target >= current.layers.length) return current;
      const layers = [...current.layers];
      [layers[index], layers[target]] = [layers[target], layers[index]];
      return { ...current, layers };
    });
  };

  const save = async (designsToSave = designs) => {
    if (!user || user.role !== "admin") {
      setSaveError("Bạn cần đăng nhập bằng tài khoản quản trị để lưu thiết kế.");
      setSaveState("error");
      return false;
    }

    setSaveState("saving");
    setSaveError("");
    try {
      let browserCacheWarning = "";
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(designsToSave));
      } catch {
        browserCacheWarning = "Bản sao trên trình duyệt không lưu được, nhưng dữ liệu vẫn được lưu trên máy chủ.";
      }
      const response = await fetch(`${API_BASE}/api/flashcard-designs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.email}`,
        },
        body: JSON.stringify(designsToSave),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Máy chủ không thể lưu thiết kế.");
      setSaveError(browserCacheWarning);
      setSaveState("saved");
      return true;
    } catch (error: any) {
      setSaveError(error.message || "Không thể lưu thiết kế. Vui lòng thử lại.");
      setSaveState("error");
      return false;
    }
  };

  const applyDesign = async () => {
    if (!design) return;
    if (!(await save())) return;
    setSaveState("saving");
    setSaveError("");
    try {
      const response = await fetch(`${API_BASE}/api/flashcard-designs/applied`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.email || ""}`,
        },
        body: JSON.stringify(design),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Không thể áp dụng thiết kế lên website.");
      setSaveState("published");
    } catch (error: any) {
      setSaveError(error.message || "Không thể áp dụng thiết kế lên website.");
      setSaveState("error");
      return;
    }
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(design));
    const sourceKey = design.sourceKey || `${design.target}:default`;
    let applied: Record<string, FlashcardDesign>;
    try { applied = JSON.parse(localStorage.getItem(APPLIED_KEY) || "{}"); } catch { applied = {}; }
    applied[sourceKey] = design;
    localStorage.setItem(APPLIED_KEY, JSON.stringify(applied));
    window.dispatchEvent(new Event("novapc-flashcard-design-updated"));
  };

  const addText = () => {
    const layer: DesignerLayer = {
      id: createId(), type: "text", name: "Văn bản mới", text: "Nhập nội dung",
      x: 40, y: 40, width: 260, height: 54, fontSize: 24, fontWeight: 650,
      color: "#ffffff", align: "left", opacity: 1, animation: "fade",
    };
    commit((current) => ({ ...current, layers: [...current.layers, layer] }));
    setSelectedId(layer.id);
  };

  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const layer: DesignerLayer = {
        id: createId(), type: "image", name: file.name, src: String(reader.result),
        x: 60, y: 120, width: 280, height: 220, radius: 18, opacity: 1, animation: "scale",
      };
      commit((current) => ({ ...current, layers: [...current.layers, layer] }));
      setSelectedId(layer.id);
    };
    reader.readAsDataURL(file);
  };

  const duplicateDesign = () => {
    if (!design) return;
    const copy = { ...design, id: createId(), name: `${design.name} bản sao`, updatedAt: new Date().toISOString(), layers: design.layers.map((layer) => ({ ...layer, id: createId() })) };
    setDesigns((items) => [...items, copy]);
    setActiveId(copy.id);
    setSelectedId(copy.layers[0]?.id || "");
    setSaveState("unsaved");
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous || !design) return;
    setFuture((items) => [design, ...items]);
    setDesigns((items) => items.map((item) => item.id === design.id ? previous : item));
    setHistory((items) => items.slice(0, -1));
  };

  const redo = () => {
    const next = future[0];
    if (!next || !design) return;
    setHistory((items) => [...items, design]);
    setDesigns((items) => items.map((item) => item.id === design.id ? next : item));
    setFuture((items) => items.slice(1));
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/featured-pcs`)
      .then((response) => response.json())
      .then((products: Array<{ name?: string; title?: string; badge?: string; specs?: string; description?: string; price?: string; from?: string; to?: string }>) => {
        if (!Array.isArray(products)) return;
        const generated = products.map((product, index) => {
          const name = product.name || product.title || `Sản phẩm ${index + 1}`;
          const sourceKey = `product:${name}`;
          const base = starterDesigns[0];
          return {
            ...base,
            id: `product-${encodeURIComponent(name)}`,
            name,
            sourceKey,
            backgroundFrom: product.from || base.backgroundFrom,
            backgroundTo: product.to || base.backgroundTo,
            updatedAt: new Date().toISOString(),
            layers: base.layers.map((layer) => ({
              ...layer,
              id: `${layer.id}-${index}`,
              text: layer.name === "Nhãn" ? (product.badge || "MỚI")
                : layer.name === "Tên sản phẩm" ? name
                : layer.name === "Cấu hình" ? (product.specs || product.description || "")
                : layer.name === "Giá" ? (product.price || "")
                : layer.text,
            })),
          } satisfies FlashcardDesign;
        });
        setDesigns((current) => {
          const savedBySource = new Map(current.filter((item) => item.sourceKey?.startsWith("product:")).map((item) => [item.sourceKey, item]));
          const syncedProducts = generated.map((item) => {
            const saved = savedBySource.get(item.sourceKey);
            if (!saved) return item;
            return {
              ...saved,
              name: item.name,
              layers: saved.layers.map((layer) => {
                const liveLayer = item.layers.find((candidate) => candidate.name === layer.name);
                return liveLayer && ["Nhãn", "Tên sản phẩm", "Cấu hình", "Giá"].includes(layer.name)
                  ? { ...layer, text: liveLayer.text }
                  : layer;
              }),
            };
          });
          const nonProducts = current.filter((item) => !item.sourceKey?.startsWith("product:") && item.id !== "product-card" && item.id !== "offer-card");
          return [...syncedProducts, ...nonProducts];
        });
        if (generated[0]) {
          setActiveId(generated[0].id);
          setSelectedId(generated[0].layers[0]?.id || "");
        }
      })
      .catch(() => {
        setCatalogError(true);
      })
      .finally(() => setCatalogLoading(false));
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    let active = true;
    fetch(`${API_BASE}/api/flashcard-designs`, {
      headers: { "Authorization": `Bearer ${user.email}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Không thể tải thiết kế đã lưu.");
        return data;
      })
      .then((savedDesigns: FlashcardDesign[]) => {
        if (!active || !Array.isArray(savedDesigns) || savedDesigns.length === 0) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDesigns));
        setDesigns(savedDesigns);
        setActiveId(savedDesigns[0].id);
        setSelectedId(savedDesigns[0].layers[0]?.id || "");
        setSaveState("saved");
      })
      .catch((error: any) => {
        if (active) {
          setSaveError(error.message || "Không thể tải thiết kế đã lưu.");
        }
      });
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !design) return;
      updateLayer({
        x: Math.max(0, Math.min(design.width - (selected?.width || 0), drag.x + (event.clientX - drag.sx) / scale)),
        y: Math.max(0, Math.min(design.height - (selected?.height || 0), drag.y + (event.clientY - drag.sy) / scale)),
      });
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  // Pointer listeners intentionally bind to the current canvas snapshot.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design, selected, scale]);

  if (!design) return null;

  return (
    <div className="designer-shell">
      <header className="designer-topbar">
        <div>
          <p className="designer-kicker">NovaPC Studio</p>
          <div className="flex items-center gap-3">
            <input className="designer-name-input" value={design.name} onChange={(event) => commit((current) => ({ ...current, name: event.target.value }))} />
            <span className={`designer-save-state ${saveState === "saved" || saveState === "published" ? "is-saved" : ""} ${saveState === "error" ? "is-error" : ""}`} title={saveError}>
              {saveState === "published" ? "Đã áp dụng" : saveState === "saved" ? "Đã lưu nháp" : saveState === "saving" ? "Đang lưu..." : saveState === "error" ? "Không lưu được" : "Chưa lưu"}
            </span>
          </div>
        </div>
        <div className="designer-actions">
          <button onClick={undo} disabled={!history.length} title="Hoàn tác"><Undo2 /></button>
          <button onClick={redo} disabled={!future.length} title="Làm lại"><Redo2 /></button>
          <button onClick={() => setPreviewKey((key) => key + 1)}><Play /> Xem animation</button>
          <button onClick={() => { void save(); }} disabled={saveState === "saving"}><Save /> {saveState === "saving" ? "Đang lưu" : "Lưu nháp"}</button>
          <button className="is-primary" onClick={applyDesign} disabled={saveState === "saving"}><Sparkles /> Áp dụng</button>
        </div>
      </header>

      <div className="designer-workspace">
        <aside className="designer-panel designer-left">
          <div className="designer-panel-heading"><Layers3 /> Flashcards <span className="designer-count">{catalogLoading ? "Đang tải" : designs.length}</span></div>
          {catalogError && <p className="designer-catalog-error">Không tải được danh sách sản phẩm. Các bản đã lưu vẫn hiển thị.</p>}
          <div className="designer-presets">
            {[
              { label: "Sản phẩm", items: productDesigns },
              { label: "Ưu đãi", items: offerDesigns },
            ].map((group) => (
              <section className="designer-preset-group" key={group.label}>
                <div className="designer-preset-group-title"><span>{group.label}</span><b>{group.items.length}</b></div>
                {group.items.map((item) => (
                  <button key={item.id} className={item.id === design.id ? "is-active" : ""} onClick={() => { setActiveId(item.id); setSelectedId(item.layers[0]?.id || ""); }}>
                    <span className="designer-preset-swatch" style={{ background: `linear-gradient(${item.backgroundAngle}deg, ${item.backgroundFrom}, ${item.backgroundTo})` }} />
                    <span><strong>{item.name}</strong><small>{item.width} × {item.height}</small></span>
                  </button>
                ))}
              </section>
            ))}
          </div>
          <div className="designer-add-row">
            <button onClick={duplicateDesign}><Copy /> Nhân bản</button>
            <button onClick={() => {
              const blank: FlashcardDesign = { ...starterDesigns[0], id: createId(), name: "Flashcard mới", target: "product", updatedAt: new Date().toISOString(), layers: [] };
              setDesigns((items) => [...items, blank]); setActiveId(blank.id); setSelectedId(""); setSaveState("unsaved");
            }}><Plus /> Tạo mới</button>
          </div>

          <div className="designer-panel-heading designer-layer-title"><Layers3 /> Layers</div>
          <div className="designer-layer-list">
            {[...design.layers].reverse().map((layer) => (
              <button
                key={layer.id}
                draggable
                className={layer.id === selectedId ? "is-active" : ""}
                onClick={() => setSelectedId(layer.id)}
                onDragStart={() => { layerDragRef.current = layer.id; }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const draggedId = layerDragRef.current;
                  if (!draggedId || draggedId === layer.id) return;
                  commit((current) => {
                    const layers = [...current.layers];
                    const from = layers.findIndex((item) => item.id === draggedId);
                    const to = layers.findIndex((item) => item.id === layer.id);
                    if (from < 0 || to < 0) return current;
                    const [moved] = layers.splice(from, 1);
                    layers.splice(to, 0, moved);
                    return { ...current, layers };
                  });
                  layerDragRef.current = null;
                }}
              >
                <GripVertical className="designer-layer-grip" />
                {layer.type === "text" ? <Type /> : <ImagePlus />}
                <span>{layer.name}</span>
                <small className="designer-layer-z">z{design.layers.indexOf(layer) + 1}</small>
                <i
                  title="Đưa ra trước"
                  className="designer-layer-order"
                  onClick={(event) => { event.stopPropagation(); moveLayer(layer.id, "front"); }}
                ><ChevronUp /></i>
                <i
                  title="Đưa ra sau"
                  className="designer-layer-order"
                  onClick={(event) => { event.stopPropagation(); moveLayer(layer.id, "back"); }}
                ><ChevronDown /></i>
                <i onClick={(event) => { event.stopPropagation(); commit((current) => ({ ...current, layers: current.layers.map((item) => item.id === layer.id ? { ...item, hidden: !item.hidden } : item) })); }}>
                  {layer.hidden ? <EyeOff /> : <Eye />}
                </i>
              </button>
            ))}
          </div>
          <div className="designer-add-row">
            <button onClick={addText}><Type /> Thêm chữ</button>
            <label><ImagePlus /> Thêm ảnh<input type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && addImage(event.target.files[0])} /></label>
          </div>
        </aside>

        <main className="designer-stage">
          <div className="designer-stage-toolbar">
            <span>{Math.round(scale * 100)}%</span>
            <span>{design.width} × {design.height}px</span>
          </div>
          <div className="designer-canvas-wrap">
            <div
              key={previewKey}
              className="designer-canvas"
              style={{
                width: design.width, height: design.height, borderRadius: design.radius,
                background: `linear-gradient(${design.backgroundAngle}deg, ${design.backgroundFrom}, ${design.backgroundTo})`,
                transform: `scale(${scale})`,
              }}
              onPointerDown={() => setSelectedId("")}
            >
              {design.layers.map((layer) => !layer.hidden && (
                <div
                  key={`${previewKey}-${layer.id}`}
                  className={`designer-canvas-layer designer-animation-${layer.animation} ${layer.id === selectedId ? "is-selected" : ""}`}
                  style={{
                    left: layer.x, top: layer.y, width: layer.width, height: layer.height,
                    opacity: layer.opacity, color: layer.color, fontSize: layer.fontSize,
                    fontWeight: layer.fontWeight, textAlign: layer.align,
                    borderRadius: layer.radius,
                  }}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    setSelectedId(layer.id);
                    if (!layer.locked) dragRef.current = { id: layer.id, sx: event.clientX, sy: event.clientY, x: layer.x, y: layer.y };
                  }}
                >
                  {layer.type === "text" ? <span>{layer.text}</span> : <img src={layer.src} alt="" draggable={false} />}
                </div>
              ))}
            </div>
          </div>
        </main>

        <aside className="designer-panel designer-right">
          <div className="designer-panel-heading">Thuộc tính</div>
          <section className="designer-properties">
            <h3>Nền card</h3>
            <label className="designer-field">Áp dụng cho
              <select value={design.target || "product"} onChange={(event) => commit((current) => ({ ...current, target: event.target.value as "product" | "offer" }))}>
                <option value="product">Carousel sản phẩm</option>
                <option value="offer">Banner ưu đãi</option>
              </select>
            </label>
            <div className="designer-color-grid">
              <label>Màu đầu<input type="color" value={design.backgroundFrom} onChange={(event) => commit((current) => ({ ...current, backgroundFrom: event.target.value }))} /></label>
              <label>Màu cuối<input type="color" value={design.backgroundTo} onChange={(event) => commit((current) => ({ ...current, backgroundTo: event.target.value }))} /></label>
            </div>
            <Range label="Góc gradient" value={design.backgroundAngle} min={0} max={360} onChange={(value) => commit((current) => ({ ...current, backgroundAngle: value }))} />
            <Range label="Bo góc" value={design.radius} min={0} max={64} onChange={(value) => commit((current) => ({ ...current, radius: value }))} />
          </section>

          {selected ? (
            <section className="designer-properties">
              <div className="flex items-center justify-between">
                <h3>{selected.name}</h3>
                <div className="designer-icon-actions">
                  <button onClick={() => updateLayer({ locked: !selected.locked })}>{selected.locked ? <Lock /> : <LockOpen />}</button>
                  <button onClick={() => commit((current) => ({ ...current, layers: current.layers.filter((layer) => layer.id !== selected.id) }))}><Trash2 /></button>
                </div>
              </div>
              {selected.type === "text" && (
                <>
                  <label className="designer-field">Nội dung<textarea value={selected.text} onChange={(event) => updateLayer({ text: event.target.value })} /></label>
                  <div className="designer-two-cols">
                    <label className="designer-field">Cỡ chữ<input type="number" value={selected.fontSize} onChange={(event) => updateLayer({ fontSize: Number(event.target.value) })} /></label>
                    <label className="designer-field">Độ đậm<select value={selected.fontWeight} onChange={(event) => updateLayer({ fontWeight: Number(event.target.value) })}><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Extra bold</option></select></label>
                  </div>
                  <div className="designer-align-row">
                    <button className={selected.align === "left" ? "is-active" : ""} onClick={() => updateLayer({ align: "left" })}><AlignLeft /></button>
                    <button className={selected.align === "center" ? "is-active" : ""} onClick={() => updateLayer({ align: "center" })}><AlignCenter /></button>
                    <button className={selected.align === "right" ? "is-active" : ""} onClick={() => updateLayer({ align: "right" })}><AlignRight /></button>
                    <input type="color" value={selected.color} onChange={(event) => updateLayer({ color: event.target.value })} />
                  </div>
                </>
              )}
              <div className="designer-two-cols">
                <label className="designer-field">X<input type="number" value={Math.round(selected.x)} onChange={(event) => updateLayer({ x: Number(event.target.value) })} /></label>
                <label className="designer-field">Y<input type="number" value={Math.round(selected.y)} onChange={(event) => updateLayer({ y: Number(event.target.value) })} /></label>
                <label className="designer-field">Rộng<input type="number" value={selected.width} onChange={(event) => updateLayer({ width: Number(event.target.value) })} /></label>
                <label className="designer-field">Cao<input type="number" value={selected.height} onChange={(event) => updateLayer({ height: Number(event.target.value) })} /></label>
              </div>
              <Range label="Độ trong suốt" value={Math.round(selected.opacity * 100)} min={0} max={100} onChange={(value) => updateLayer({ opacity: value / 100 })} />
              <label className="designer-field">Animation<select value={selected.animation} onChange={(event) => updateLayer({ animation: event.target.value as AnimationType })}><option value="none">Không</option><option value="fade">Fade in</option><option value="slide-up">Trượt lên</option><option value="slide-left">Trượt trái</option><option value="scale">Phóng nhẹ</option><option value="blur">Blur reveal</option></select></label>
              <div className="designer-order-row">
                <button onClick={() => commit((current) => {
                  const index = current.layers.findIndex((layer) => layer.id === selected.id);
                  if (index >= current.layers.length - 1) return current;
                  const layers = [...current.layers]; [layers[index], layers[index + 1]] = [layers[index + 1], layers[index]];
                  return { ...current, layers };
                })}><ChevronUp /> Đưa lên</button>
                <button onClick={() => commit((current) => {
                  const index = current.layers.findIndex((layer) => layer.id === selected.id);
                  if (index <= 0) return current;
                  const layers = [...current.layers]; [layers[index], layers[index - 1]] = [layers[index - 1], layers[index]];
                  return { ...current, layers };
                })}><ChevronDown /> Đưa xuống</button>
              </div>
            </section>
          ) : <div className="designer-empty-properties"><Layers3 /><p>Chọn một layer để chỉnh thuộc tính.</p></div>}
          <button className="designer-reset" onClick={() => { setDesigns(starterDesigns); setActiveId(starterDesigns[0].id); setSelectedId(starterDesigns[0].layers[0].id); setSaveState("unsaved"); }}><RotateCcw /> Khôi phục preset mặc định</button>
        </aside>
      </div>
    </div>
  );
}

function Range({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label className="designer-range"><span>{label}<b>{value}</b></span><input type="range" value={value} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
