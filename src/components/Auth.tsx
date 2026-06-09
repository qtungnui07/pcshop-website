import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, GitBranch, Globe } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-[calc(100vh-2.75rem)] w-full flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background with abstract animated shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-400/20 blur-[120px]" />
      </div>

      <motion.div
        className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 relative z-10"
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
              onClick={() => setIsLogin(true)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full relative z-10 transition-colors ${isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
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
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                  {isLogin && (
                    <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">Quên mật khẩu?</a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
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
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors gap-2 text-sm font-medium text-gray-700">
              <GitBranch className="w-5 h-5" />
              Github
            </button>
            <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors gap-2 text-sm font-medium text-gray-700">
              <Globe className="w-5 h-5 text-blue-500" />
              Google
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
