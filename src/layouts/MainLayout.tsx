import { Outlet, useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  Users, 
  HelpCircle, 
  Contact, 
  LogOut, 
  ArrowLeft, 
  Menu, 
  X,
  Shield
} from 'lucide-react';

function AdminFooter() {
  return (
    <footer className="w-full bg-white border-t border-zinc-200 py-4 px-6 md:px-8 text-center text-xs font-semibold text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-2">
      <div>
        © 2026 <span className="font-extrabold text-zinc-800">PCshop Control Panel</span>. All rights reserved.
      </div>
      <div className="flex gap-4 items-center">
        <span>Hỗ trợ kỹ thuật: <a href="tel:19008198" className="hover:text-zinc-800 transition">1900 8198</a></span>
        <span className="hidden sm:inline text-zinc-300">|</span>
        <span>Email: <a href="mailto:support@pcshop.vn" className="hover:text-zinc-800 transition">support@pcshop.vn</a></span>
        <span className="hidden sm:inline text-zinc-300">|</span>
        <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-mono font-bold">v1.4.2</span>
      </div>
    </footer>
  );
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isHome = location.pathname === '/';

  const isAuth = location.pathname.startsWith('/auth');
  const isAdmin = location.pathname.startsWith('/admin');

  // Determine active view to highlight sidebar item correctly
  const getActiveView = () => {
    if (location.pathname === '/admin/edit') {
      const category = searchParams.get('category') || '';
      if (category === 'accounts') return 'accounts';
      return 'products'; // Editing products maps to product management
    }
    return searchParams.get('view') || 'dashboard';
  };

  const activeView = getActiveView();
  const showAdminSidebar = isAdmin && user && user.role === 'admin';

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { label: 'Quản lý sản phẩm', icon: ShoppingBag, view: 'products' },
    { label: 'Quản lý hóa đơn', icon: Receipt, view: 'orders' },
    { label: 'Hỗ trợ (Tickets)', icon: HelpCircle, view: 'tickets' },
    { label: 'Quản lý tài khoản', icon: Users, view: 'accounts' },
    { label: 'Thông tin nhân viên', icon: Contact, view: 'staff' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // 1. Admin Layout Rendering
  if (showAdminSidebar) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] text-zinc-900 font-sans antialiased relative">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3.5 bg-zinc-950 text-white sticky top-0 z-40 border-b border-zinc-800 shadow-md">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-sm">PCshop Admin</span>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
            className="p-1.5 hover:bg-zinc-800 rounded-xl transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Backdrop for mobile drawer */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          />
        )}

        {/* Responsive Sidebar */}
        <aside className={`
          fixed top-0 bottom-0 left-0 z-30 w-[260px] bg-zinc-950 text-zinc-400 border-r border-zinc-900 
          flex flex-col justify-between transition-transform duration-300 lg:translate-x-0
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:sticky lg:h-screen
        `}>
          {/* Top Logo Section */}
          <div>
            <div className="flex items-center gap-3.5 px-6 py-5 border-b border-zinc-900">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-black text-white text-base tracking-tight leading-tight">PCshop Portal</h1>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Hệ thống quản trị</p>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="px-3.5 py-6 space-y-1">
              {menuItems.map((item) => {
                const isActive = activeView === item.view;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.view}
                    to={`/admin?view=${item.view}`}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-900 text-white shadow-sm ring-1 ring-white/5' 
                        : 'hover:bg-zinc-900/50 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Profile and Sign Out Section */}
          <div className="p-4 border-t border-zinc-900 bg-zinc-900/10">
            {/* User Profile Summary */}
            {user && (
              <div className="flex items-center gap-3 mb-4 px-2">
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(user.name)}`} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-xl object-cover bg-zinc-800 border border-zinc-800"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-white truncate leading-snug">{user.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate leading-none mt-0.5">{user.email}</p>
                </div>
              </div>
            )}

            {/* Navigation utilities */}
            <div className="space-y-1">
              <Link 
                to="/" 
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-900 hover:text-white transition w-full cursor-pointer text-zinc-500"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Về trang khách hàng</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition w-full text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất hệ thống</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
          <AdminFooter />
        </div>
      </div>
    );
  }

  // 2. Default Client Layout (or Loading)
  return (
    <div
      className={`min-h-screen text-[#1d1d1f] font-sans selection:bg-blue-200 flex flex-col relative ${
        isAuth ? 'auth-page bg-[#f5f5f7]' : 'bg-[#f5f5f7]'
      }`}
      style={
        isAuth
          ? {
              background:
                'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, #f5f5f7 55%, rgba(192, 132, 252, 0.15) 100%)',
            }
          : undefined
      }
    >
      <Navbar />
      
      {/* Abstract background glow shapes spanning the whole layout on auth pages */}
      {isAuth && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[60%] h-[600px] rounded-full bg-blue-400/15 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[50%] h-[700px] rounded-full bg-purple-400/15 blur-[120px]" />
        </div>
      )}
 
      <main className={`relative z-10 flex-1 w-full ${isAuth ? 'flex flex-col items-center justify-center pt-32 pb-20' : isHome ? 'pt-16 pb-12' : 'pt-24 pb-12'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

