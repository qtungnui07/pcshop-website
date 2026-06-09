import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-blue-200">
      <Navbar />
      <main className="pt-24 pb-12 relative z-10 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
