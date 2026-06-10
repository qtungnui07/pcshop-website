import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Save, ChevronUp, ChevronDown, Sparkles, RotateCcw, CheckCircle2, Image, AlertTriangle, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PCItem {
  badge: string;
  badgeColor: string;
  name: string;
  specs: string;
  price: string;
  from: string;
  to: string;
  image?: string;
}

const PORT = 3001;

// Image templates served by backend
const IMAGE_TEMPLATES = [
  { name: "Infinity RGB (Purple/Pink)", filename: "pc-infinity.png", url: `http://localhost:${PORT}/images/pc-infinity.png` },
  { name: "Frost RGB (White/Cyan)", filename: "pc-frost.png", url: `http://localhost:${PORT}/images/pc-frost.png` },
  { name: "Nebula RGB (Space/Dark)", filename: "pc-nebula.png", url: `http://localhost:${PORT}/images/pc-nebula.png` },
  { name: "Workstation Pro (Black/Clean)", filename: "pc-workstation.png", url: `http://localhost:${PORT}/images/pc-workstation.png` },
  { name: "Mini White (Compact ITX)", filename: "pc-mini.png", url: `http://localhost:${PORT}/images/pc-mini.png` }
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

export default function AdminIndex() {
  const [pcs, setPcs] = useState<PCItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formSpecs, setFormSpecs] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formBadgeColor, setFormBadgeColor] = useState("#1d1d1f");
  const [formFrom, setFormFrom] = useState("#7c3aed");
  const [formTo, setFormTo] = useState("#ec4899");
  const [formImage, setFormImage] = useState(IMAGE_TEMPLATES[0].url);
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Fetch PC configurations from Bun server
  const fetchPCs = () => {
    setLoading(true);
    fetch(`http://localhost:${PORT}/api/featured-pcs`)
      .then((res) => res.json())
      .then((data) => {
        setPcs(data);
        setHasChanges(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching PCs in admin panel:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPCs();
  }, []);

  // Set form values for editing or creating
  const handleStartEdit = (index: number) => {
    const pc = pcs[index];
    setEditingIndex(index);
    setFormName(pc.name);
    setFormSpecs(pc.specs);
    setFormPrice(pc.price);
    setFormBadge(pc.badge || "");
    setFormBadgeColor(pc.badgeColor || "#1d1d1f");
    setFormFrom(pc.from);
    setFormTo(pc.to);

    const isTemplate = IMAGE_TEMPLATES.some(t => t.url === pc.image);
    if (isTemplate) {
      setFormImage(pc.image || IMAGE_TEMPLATES[0].url);
      setIsCustomImage(false);
    } else {
      setFormImage("custom");
      setIsCustomImage(true);
      setCustomImageUrl(pc.image || "");
    }
  };

  const handleStartCreate = () => {
    setEditingIndex(-1); // -1 means new item
    setFormName("");
    setFormSpecs("");
    setFormPrice("");
    setFormBadge("");
    setFormBadgeColor("#1d1d1f");
    setFormFrom("#7c3aed");
    setFormTo("#ec4899");
    setFormImage(IMAGE_TEMPLATES[0].url);
    setIsCustomImage(false);
    setCustomImageUrl("");
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const imgUrl = isCustomImage ? customImageUrl : formImage;

    const newItem: PCItem = {
      name: formName,
      specs: formSpecs,
      price: formPrice,
      badge: formBadge,
      badgeColor: formBadgeColor,
      from: formFrom,
      to: formTo,
      image: imgUrl
    };

    const updated = [...pcs];
    if (editingIndex === -1) {
      updated.push(newItem);
    } else if (editingIndex !== null) {
      updated[editingIndex] = newItem;
    }

    setPcs(updated);
    setHasChanges(true);
    setEditingIndex(null); // Close form
  };

  // Reorder PCs
  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === pcs.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...pcs];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setPcs(updated);
    setHasChanges(true);
  };

  // Delete PC
  const handleDelete = (index: number) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa cấu hình "${pcs[index].name}" không?`)) return;
    const updated = pcs.filter((_, i) => i !== index);
    setPcs(updated);
    setHasChanges(true);
    if (editingIndex === index) setEditingIndex(null);
  };

  // Save changes to backend server database (data.json)
  const handleSaveToDatabase = () => {
    setSaving(true);
    fetch(`http://localhost:${PORT}/api/featured-pcs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pcs)
    })
      .then((res) => res.json())
      .then(() => {
        setSaving(false);
        setHasChanges(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      })
      .catch((err) => {
        console.error("Error saving PCs to backend:", err);
        setSaving(false);
        alert("Không thể lưu dữ liệu vào backend. Vui lòng kiểm tra terminal backend!");
      });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-6 text-zinc-800">
      
      {/* ── HEADER & ACTIONS ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Admin Panel</span>
            {hasChanges && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> Có thay đổi chưa lưu
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950">Quản lý Cấu hình PC</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchPCs} 
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 border border-zinc-300 hover:bg-zinc-100 disabled:opacity-50 text-sm font-semibold rounded-xl transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới
          </button>
          
          <button 
            onClick={handleSaveToDatabase} 
            disabled={saving || pcs.length === 0}
            className={`flex items-center gap-1.5 px-5 py-2 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer active:scale-95 ${
              hasChanges 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10' 
                : 'bg-zinc-800 hover:bg-zinc-900 disabled:opacity-50'
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
          <p className="text-sm font-semibold">Đang tải danh sách PC từ máy chủ...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT: PC LIST & REORDERING (8 Columns) ────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-zinc-50 border border-zinc-200/80 px-4 py-3 rounded-xl mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <List className="w-4 h-4" /> Danh sách PC ({pcs.length})
              </span>
              <button 
                onClick={handleStartCreate}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm PC mới
              </button>
            </div>

            {pcs.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400">
                Chưa có cấu hình PC nào trong danh sách. Hãy nhấn nút "Thêm PC mới"!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pcs.map((pc, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between bg-white border rounded-2xl p-3.5 transition-all shadow-sm ${
                      editingIndex === idx ? 'ring-2 ring-blue-500 border-transparent bg-blue-50/10' : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Thumbnail Container */}
                      <div className="w-14 h-14 bg-[#0c0c0e] rounded-xl flex items-center justify-center p-1 border border-zinc-200/80 relative overflow-hidden flex-shrink-0">
                        {pc.image ? (
                          <img 
                            src={pc.image} 
                            alt={pc.name} 
                            className="max-w-full max-h-full object-contain" 
                          />
                        ) : (
                          <div 
                            className="w-full h-full rounded-lg" 
                            style={{ background: `linear-gradient(135deg, ${pc.from}, ${pc.to})` }} 
                          />
                        )}
                        {pc.badge && (
                          <span 
                            className="absolute bottom-0 left-0 right-0 text-[8px] font-bold text-white text-center py-0.5"
                            style={{ background: pc.badgeColor || '#000' }}
                          >
                            {pc.badge}
                          </span>
                        )}
                      </div>

                      {/* Specs and details */}
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-zinc-950 truncate mb-0.5">{pc.name}</h3>
                        <p className="text-[11px] text-zinc-400 font-medium whitespace-pre-line leading-relaxed truncate">{pc.specs.replace('\n', ' • ')}</p>
                        <span className="inline-block mt-1 text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">{pc.price}</span>
                      </div>
                    </div>

                    {/* Actions and Reorder */}
                    <div className="flex items-center gap-1.5 ml-4 flex-shrink-0">
                      {/* Move controls */}
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
                          disabled={idx === pcs.length - 1}
                          className="p-1 hover:bg-zinc-100 disabled:opacity-30 rounded transition-colors cursor-pointer"
                          title="Di chuyển xuống"
                        >
                          <ChevronDown className="w-4 h-4 text-zinc-500" />
                        </button>
                      </div>

                      {/* Edit/Delete */}
                      <button 
                        onClick={() => handleStartEdit(idx)}
                        className="p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl transition-all cursor-pointer"
                        title="Chỉnh sửa cấu hình"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all cursor-pointer"
                        title="Xóa cấu hình"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: EDIT / ADD FORM (4-5 Columns) ─────────────────── */}
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
                  <h2 className="text-base font-extrabold text-zinc-950 mb-4 flex items-center gap-1.5 border-b border-zinc-100 pb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    {editingIndex === -1 ? 'Thêm PC cấu hình mới' : `Chỉnh sửa #${editingIndex + 1}`}
                  </h2>

                  {/* Form inputs */}
                  <div className="space-y-4 text-xs font-semibold text-zinc-600">
                    
                    {/* Name */}
                    <div>
                      <label className="block mb-1.5 text-zinc-700">Tên máy tính</label>
                      <input 
                        type="text" 
                        required 
                        value={formName} 
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ví dụ: PC Gaming Frost"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Specs */}
                    <div>
                      <label className="block mb-1.5 text-zinc-700">Thông số cấu hình (Phân dòng bằng Enter)</label>
                      <textarea 
                        rows={2} 
                        required 
                        value={formSpecs} 
                        onChange={(e) => setFormSpecs(e.target.value)}
                        placeholder="Ryzen 7 7800X3D • RTX 4070 Ti&#10;32GB RAM • 1TB SSD"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block mb-1.5 text-zinc-700">Giá hiển thị</label>
                      <input 
                        type="text" 
                        required 
                        value={formPrice} 
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="Ví dụ: 32.990.000đ"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Badge & Color */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1.5 text-zinc-700">Badge (Nhãn)</label>
                        <input 
                          type="text" 
                          value={formBadge} 
                          onChange={(e) => setFormBadge(e.target.value)}
                          placeholder="Mới, Hot, Bán chạy..."
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-zinc-700">Màu Badge</label>
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
                            className="w-full px-2 py-2 border border-zinc-200 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gradients */}
                    <div className="border border-zinc-100 rounded-xl p-3 bg-zinc-50">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-zinc-700 font-bold">Màu nền fallback</label>
                        <span className="text-[10px] text-zinc-400">Không hiển thị nếu có ảnh</span>
                      </div>
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {GRADIENT_PRESETS.map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => { setFormFrom(p.from); setFormTo(p.to); }}
                            className="px-2 py-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 text-[10px] text-zinc-500">Màu Bắt đầu (From)</label>
                          <div className="flex gap-1.5 items-center">
                            <input type="color" value={formFrom} onChange={(e) => setFormFrom(e.target.value)} className="w-8 h-8 p-0 border border-zinc-200 rounded-lg cursor-pointer" />
                            <input type="text" value={formFrom} onChange={(e) => setFormFrom(e.target.value)} className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-[10px] font-mono outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-[10px] text-zinc-500">Màu Kết thúc (To)</label>
                          <div className="flex gap-1.5 items-center">
                            <input type="color" value={formTo} onChange={(e) => setFormTo(e.target.value)} className="w-8 h-8 p-0 border border-zinc-200 rounded-lg cursor-pointer" />
                            <input type="text" value={formTo} onChange={(e) => setFormTo(e.target.value)} className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-[10px] font-mono outline-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image selection */}
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
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none mb-2"
                      >
                        {IMAGE_TEMPLATES.map((img) => (
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
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                      )}
                    </div>
                  </div>

                  {/* Form actions */}
                  <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 mt-5">
                    <button 
                      type="submit"
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/10 cursor-pointer active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4" /> {editingIndex === -1 ? 'Thêm mới' : 'Cập nhật'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditingIndex(null)}
                      className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                </motion.form>
              ) : (
                <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl p-6 text-center text-zinc-400 flex flex-col items-center justify-center gap-2.5 py-12">
                  <Sparkles className="w-8 h-8 text-zinc-300" />
                  <p className="text-xs font-bold text-zinc-500">Chưa chọn cấu hình nào</p>
                  <p className="text-[10px] leading-relaxed max-w-[200px]">Hãy nhấn "Chỉnh sửa" trên một card PC hoặc nút "Thêm PC mới" để bắt đầu chỉnh sửa thông tin.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}
    </div>
  );
}
