import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Inject Turnstile script explicitly
    if (!document.getElementById("cloudflare-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cloudflare-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    let interval: any;
    const renderWidget = () => {
      if ((window as any).turnstile && turnstileRef.current && !widgetIdRef.current) {
        clearInterval(interval);
        try {
          widgetIdRef.current = (window as any).turnstile.render(turnstileRef.current, {
            sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
            callback: (token: string) => {
              setTurnstileToken(token);
              setError(undefined);
            },
            "expired-callback": () => {
              setTurnstileToken(null);
            },
            "error-callback": () => {
              setTurnstileToken(null);
            }
          });
        } catch (e) {
          console.error("Turnstile render error:", e);
        }
      }
    };

    interval = setInterval(renderWidget, 100);
    return () => {
      clearInterval(interval);
      if (widgetIdRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          console.error("Turnstile cleanup error:", e);
        }
      }
    };
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!email.trim()) {
      setError('Vui lòng nhập email của bạn');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không đúng định dạng');
      return;
    }

    if (!turnstileToken) {
      setError('Vui lòng hoàn thành xác thực Captcha');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, turnstileToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
        // Reset Turnstile on error so user can try again
        if ((window as any).turnstile && widgetIdRef.current) {
          (window as any).turnstile.reset(widgetIdRef.current);
        }
        setTurnstileToken(null);
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
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
        <div className="mb-6">
          <Link to="/auth" className="inline-flex items-center text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại đăng nhập
          </Link>
        </div>

        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
          Quên mật khẩu?
        </h2>
        
        <p className="text-gray-500 text-sm mb-8">
          {!isSubmitted 
            ? 'Nhập email của bạn để nhận liên kết thiết lập lại mật khẩu.' 
            : 'Vui lòng kiểm tra hộp thư đến của bạn để tiếp tục.'}
        </p>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="forgot-form"
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
            >
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
                      if (error) setError(undefined);
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-gray-900 focus:ring-2 transition-all outline-none ${
                      error
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    style={{ paddingLeft: '40px' }}
                    placeholder="you@example.com"
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

              {/* Turnstile Captcha */}
              <div className="flex justify-center my-4 overflow-hidden min-h-[65px]">
                <div ref={turnstileRef} className="mx-auto"></div>
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
                {isLoading ? 'Đang gửi liên kết...' : 'Gửi liên kết khôi phục'}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="forgot-success"
              className="text-center py-6 space-y-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Email đã được gửi!</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-2">
                Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến địa chỉ email <strong className="text-gray-800 font-semibold">{email}</strong>.
              </p>
              <div className="pt-4">
                <Link to="/auth">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 px-4 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors border border-gray-200"
                  >
                    Quay về trang đăng nhập
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
