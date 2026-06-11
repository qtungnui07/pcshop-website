import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

export default function Auth() {
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Password requirement formulas
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  // Redirect if user is already logged in
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleTabChange = (login: boolean) => {
    setIsLogin(login);
    setName('');
    setEmail('');
    setPassword('');
    setErrors({});
    setGeneralError(null);
  };

  const handleGoogleClick = async () => {
    setGeneralError(null);
    const result = await loginWithGoogle();
    if (!result.success) {
      setGeneralError(result.error || "Đăng nhập bằng Google thất bại");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    const newErrors: { name?: string; email?: string; password?: string } = {};

    // Name check
    if (!isLogin && !name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    // Email check
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    // Password check
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (!isLogin) {
      if (!hasMinLength || !hasUppercase || !hasLowercase || !hasSpecial) {
        newErrors.password = 'Mật khẩu chưa đáp ứng đầy đủ yêu cầu';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isLogin) {
      const result = await login(email, password);
      if (result.success) {
        const savedUser = localStorage.getItem("pcshop_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } else {
        setGeneralError(result.error || "Đăng nhập thất bại");
      }
    } else {
      const result = await register(name, email, password);
      if (result.success) {
        navigate("/");
      } else {
        setGeneralError(result.error || "Đăng ký thất bại");
      }
    }
  };

  return (
    <div className="w-full max-w-xl px-4 relative z-10">
      <motion.div
        className="w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center mb-8 relative">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
            {isLogin ? 'Chào mừng' : 'Tạo tài khoản'}
          </h2>
          <div className="flex bg-gray-200/50 p-1 rounded-full relative">
            <div
              className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out"
              style={{ transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }}
            />
            <button
              onClick={() => handleTabChange(true)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full relative z-10 transition-colors ${isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => handleTabChange(false)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full relative z-10 transition-colors ${!isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Đăng ký
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-8">
          {isLogin
            ? 'Nhập thông tin của bạn để truy cập vào tài khoản.'
            : 'Tham gia cùng chúng tôi để trải nghiệm mua sắm tuyệt vời nhất.'}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-xl text-center"
                >
                  {generalError}
                </motion.div>
              )}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-gray-900 focus:ring-2 transition-all outline-none ${
                        errors.name
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      style={{ paddingLeft: '40px' }}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-1 font-medium pl-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-gray-900 focus:ring-2 transition-all outline-none ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    style={{ paddingLeft: '40px' }}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 mt-1 font-medium pl-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                  {isLogin && (
                    <Link to="/auth/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">Quên mật khẩu?</Link>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-gray-900 focus:ring-2 transition-all outline-none ${
                      errors.password
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    style={{ paddingLeft: '40px' }}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 mt-1 font-medium pl-1"
                  >
                    {errors.password}
                  </motion.p>
                )}

                {/* Password requirement checklist during registration */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 mt-2 border-t border-gray-100/80 overflow-hidden"
                  >
                    <RequirementItem satisfied={hasMinLength} label="Tối thiểu 8 ký tự" />
                    <RequirementItem satisfied={hasUppercase} label="1 ký tự viết hoa" />
                    <RequirementItem satisfied={hasLowercase} label="1 ký tự viết thường" />
                    <RequirementItem satisfied={hasSpecial} label="1 ký tự đặc biệt" />
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full mt-6 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-all flex items-center justify-center group"
              >
                {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-gray-200/60 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-[#fafafa]">
            <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Hoặc</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={handleGoogleClick}
              className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors gap-2 text-sm font-medium text-gray-700 cursor-pointer w-full"
            >
              <div 
                className="w-5 h-5" 
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, #ea4335 0deg, #4285f4 90deg, #34a853 180deg, #fbbc05 270deg, #ea4335 360deg)',
                  WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>')`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              />
              Google
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
