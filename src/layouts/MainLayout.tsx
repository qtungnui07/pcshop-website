import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isAuth = location.pathname.startsWith('/auth');

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

      <main className={`relative z-10 flex-1 flex items-center justify-center ${isAuth ? 'pt-32 pb-20' : 'pt-24 pb-12'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
