import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isAuth = location.pathname.startsWith('/auth');

  return (
    <div
      className={`min-h-screen text-[#1d1d1f] font-sans selection:bg-blue-200${isAuth ? ' auth-page' : ' bg-[#f5f5f7]'}`}
      style={isAuth ? { background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, #f5f5f7 55%, rgba(192, 132, 252, 0.15) 100%)' } : undefined}
    >
      <Navbar />
      <main className="pt-24 pb-12 relative z-10 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
