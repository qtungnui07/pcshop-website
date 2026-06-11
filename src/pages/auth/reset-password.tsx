import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, ArrowRight, ShieldAlert, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../../context/AuthContext';

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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [email, setEmail] = useState('');
  const [tokenError, setTokenError] = useState<string | undefined>(undefined);

  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Password requirements
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setTokenError('Đường dẫn khôi phục không hợp lệ (thiếu token).');
      setIsVerifyingToken(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
        const data = await response.json();
        
        if (!response.ok || !data.valid) {
          setIsTokenValid(false);
          setTokenError(data.error || 'Đường dẫn khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.');
        } else {
          setIsTokenValid(true);
          setEmail(data.email || '');
        }
      } catch (err) {
        console.error(err);
        setTokenError('Không thể kết nối đến máy chủ để xác thực mã.');
      } finally {
        setIsVerifyingToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!password) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasSpecial) {
      setError('Mật khẩu chưa đáp ứng đầy đủ yêu cầu bảo mật');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
        setIsLoading(false);
        return;
      }

      navigate('/auth?resetSuccess=true', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4 relative z-10">
      <motion.div
        className="w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          {isVerifyingToken && (
            <motion.div
              key="verifying"
              className="text-center py-12 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-center">
                <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Đang xác thực liên kết khôi phục...
              </p>
            </motion.div>
          )}

          {!isVerifyingToken && !isTokenValid && (
            <motion.div
              key="invalid-token"
              className="text-center py-6 space-y-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-center">
                <ShieldAlert className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Liên kết không hợp lệ</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-2">
                {tokenError}
              </p>
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/auth/forgot-password">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 px-4 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-gray-900/20"
                  >
                    Yêu cầu liên kết mới
                  </motion.button>
                </Link>
                <Link to="/auth">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 px-4 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors border border-gray-200"
                  >
                    Quay lại đăng nhập
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}

          {!isVerifyingToken && isTokenValid && (
            <motion.div
              key="reset-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <Link to="/auth" className="inline-flex items-center text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Hủy khôi phục
                </Link>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
                Mật khẩu mới
              </h2>
              
              <p className="text-gray-500 text-sm mb-6">
                Thiết lập mật khẩu mới cho tài khoản <strong className="text-gray-800 font-semibold">{email}</strong>.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(undefined);
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-gray-900 focus:ring-2 transition-all outline-none ${
                        error
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      style={{ paddingLeft: '40px' }}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password requirements */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 mt-2 border-t border-gray-100/80 overflow-hidden">
                    <RequirementItem satisfied={hasMinLength} label="Tối thiểu 8 ký tự" />
                    <RequirementItem satisfied={hasUppercase} label="1 ký tự viết hoa" />
                    <RequirementItem satisfied={hasLowercase} label="1 ký tự viết thường" />
                    <RequirementItem satisfied={hasSpecial} label="1 ký tự đặc biệt" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError(undefined);
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-gray-900 focus:ring-2 transition-all outline-none ${
                        error
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      style={{ paddingLeft: '40px' }}
                      placeholder="Nhập lại mật khẩu mới"
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-1 font-medium pl-1"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  whileHover={isLoading ? {} : { scale: 1.01 }}
                  whileTap={isLoading ? {} : { scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-6 py-3 px-4 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center group ${
                    isLoading 
                      ? 'bg-gray-400 text-white cursor-not-allowed shadow-none' 
                      : 'bg-gray-900 text-white shadow-gray-900/20 hover:bg-gray-800'
                  }`}
                >
                  {isLoading ? 'Đang cập nhật mật khẩu...' : 'Đặt lại mật khẩu'}
                  {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </motion.button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
