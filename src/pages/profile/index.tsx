import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Shield,
  Loader2,
  Check
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PORT = 3001;
const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:${PORT}`)
  : `http://localhost:${PORT}`;

function RequirementItem({ satisfied, label }: { satisfied: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        <motion.div
          className="absolute inset-0 rounded-full border"
          animate={{
            scale: satisfied ? [1, 1.15, 1] : 1,
            borderColor: satisfied ? '#22c55e' : '#e5e7eb',
            backgroundColor: satisfied ? 'rgba(34, 197, 94, 0.08)' : 'rgba(0, 0, 0, 0)',
          }}
          transition={{ duration: 0.3 }}
        />
        {satisfied ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <Check className="w-2.5 h-2.5 text-green-600" strokeWidth={3} />
          </motion.div>
        ) : (
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        )}
      </div>
      <span className={`text-[11px] transition-colors duration-300 ${satisfied ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

export default function ProfileIndex() {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"info" | "security">("info");
  
  // Profile info states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  
  // Password change states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password requirements
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasSpecial;

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Sync state with user profile
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
      </div>
    );
  }

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side image check
    const allowedExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      setError("Chỉ chấp nhận các định dạng ảnh PNG, JPG, JPEG, GIF, WEBP.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "users");

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể tải ảnh lên máy chủ");
      }

      setAvatar(data.url);
      
      // Update account DB with new avatar
      const updateRes = await updateProfile({
        name,
        phone,
        address,
        avatar: data.url
      });

      if (updateRes.success) {
        setSuccess("Cập nhật ảnh đại diện thành công!");
      } else {
        setError(updateRes.error || "Không thể lưu ảnh đại diện vào hồ sơ");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi kết nối khi tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  // Handle save changes
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Họ và tên không được để trống.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        avatar
      });

      if (res.success) {
        setSuccess("Đã lưu thay đổi thông tin cá nhân!");
      } else {
        setError(res.error || "Lỗi lưu thông tin.");
      }
    } catch (err) {
      setError("Không thể lưu thông tin. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setSaving(false);
    }
  };

  // Handle change password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng điền mật khẩu mới.");
      return;
    }

    if (!isPasswordValid) {
      setError("Mật khẩu mới không đạt yêu cầu bảo mật.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setSaving(true);

    try {
      const res = await updateProfile({
        name,
        phone,
        address,
        avatar,
        newPassword
      });

      if (res.success) {
        setSuccess("Thay đổi mật khẩu thành công!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(res.error || "Lỗi thay đổi mật khẩu.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi kết nối.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pt-24 pb-16 px-4">
      <div className="max-w-[850px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Summary */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
              
              {/* Avatar Uploader container */}
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-zinc-950 flex items-center justify-center bg-gray-50">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-black animate-spin" />
                  ) : avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-950 text-white flex items-center justify-center text-2xl font-bold">
                      {name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  )}
                </div>
                
                {/* Hover Camera Overlay */}
                <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-6 h-6 text-white" />
                </div>

                {/* Hidden input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <h2 className="mt-4 text-base font-bold text-gray-900">{name}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
              
              <div className="mt-4 flex items-center gap-1.5">
                {user.role === "admin" ? (
                  <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                    <Shield className="w-3 h-3 animate-pulse" /> Quản trị viên
                  </span>
                ) : (
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                    Thành viên
                  </span>
                )}
                {user.provider === "google" && (
                  <span className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100">
                    Google Auth
                  </span>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="w-full mt-8 flex flex-col gap-1 border-t border-gray-100 pt-4">
                <button
                  onClick={() => { setActiveTab("info"); setError(null); setSuccess(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                    activeTab === "info"
                      ? "bg-zinc-950 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Thông tin cá nhân
                </button>
                {user.provider === "local" && (
                  <button
                    onClick={() => { setActiveTab("security"); setError(null); setSuccess(null); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                      activeTab === "security"
                        ? "bg-zinc-950 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    Đổi mật khẩu
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Tab Forms */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px]">
              
              <AnimatePresence mode="wait">
                
                {/* Form: General Info */}
                {activeTab === "info" && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Thông tin cá nhân</h3>
                    
                    <form onSubmit={handleSaveInfo} className="space-y-5">
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Họ và tên</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <User className="h-4.5 w-4.5 text-gray-400" />
                          </span>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none transition-all"
                            placeholder="Nhập họ và tên của bạn"
                            required
                          />
                        </div>
                      </div>

                      {/* Email input (Read-only) */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Địa chỉ Email</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Mail className="h-4.5 w-4.5 text-gray-400" />
                          </span>
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full bg-gray-100/70 border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-gray-400 outline-none cursor-not-allowed"
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-gray-400">Không thể thay đổi email tài khoản.</p>
                      </div>

                      {/* Phone input */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Số điện thoại</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Phone className="h-4.5 w-4.5 text-gray-400" />
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none transition-all"
                            placeholder="Số điện thoại di động"
                          />
                        </div>
                      </div>

                      {/* Default Address input */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Địa chỉ nhận hàng mặc định</label>
                        <div className="relative">
                          <span className="absolute top-3.5 left-3.5 flex items-center pointer-events-none">
                            <MapPin className="h-4.5 w-4.5 text-gray-400" />
                          </span>
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none transition-all resize-none"
                            placeholder="Nhập địa chỉ đầy đủ (Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố)"
                          />
                        </div>
                      </div>

                      {/* Toast Alerts */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2.5 text-red-600 text-xs font-medium"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                          </motion.div>
                        )}
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2.5 text-green-600 text-xs font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{success}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 disabled:bg-zinc-400 text-white font-semibold text-sm py-3 px-6 rounded-2xl cursor-pointer transition-all shadow-sm"
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Lưu thông tin
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}

                {/* Form: Security (Password change) */}
                {activeTab === "security" && user.provider === "local" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Đổi mật khẩu</h3>

                    <form onSubmit={handleUpdatePassword} className="space-y-5">
                      
                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Mật khẩu mới</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <KeyRound className="h-4.5 w-4.5 text-gray-400" />
                          </span>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none transition-all"
                            placeholder="Nhập mật khẩu mới"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Requirements Validation */}
                      {newPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2.5"
                        >
                          <RequirementItem satisfied={hasMinLength} label="Tối thiểu 8 ký tự" />
                          <RequirementItem satisfied={hasUppercase} label="Có ít nhất 1 chữ in hoa" />
                          <RequirementItem satisfied={hasLowercase} label="Có ít nhất 1 chữ thường" />
                          <RequirementItem satisfied={hasSpecial} label="Có ít nhất 1 ký tự đặc biệt (!@#...)" />
                        </motion.div>
                      )}

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Nhập lại mật khẩu mới</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <KeyRound className="h-4.5 w-4.5 text-gray-400" />
                          </span>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-50/60 border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none transition-all"
                            placeholder="Nhập lại mật khẩu mới"
                            required
                          />
                        </div>
                      </div>

                      {/* Toast Alerts */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2.5 text-red-600 text-xs font-medium"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                          </motion.div>
                        )}
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2.5 text-green-600 text-xs font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{success}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={saving || !isPasswordValid || newPassword !== confirmPassword}
                          className="flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 disabled:bg-zinc-400 text-white font-semibold text-sm py-3 px-6 rounded-2xl cursor-pointer transition-all shadow-sm"
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Cập nhật mật khẩu
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
