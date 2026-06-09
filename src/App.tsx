import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StoreHeader from './components/StoreHeader';
import CategoryList from './components/CategoryList';
import ProductCarousel from './components/ProductCarousel';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'store'>(() => {
    return window.location.hash === '#store' ? 'store' : 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash === '#store' ? 'store' : 'home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-blue-200">
      <Navbar />

      {currentPage === 'store' && (
        <main className="pt-24 pb-12 relative z-10">
          <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
            <StoreHeader />
            <CategoryList />
          </div>
          <ProductCarousel />
        </main>
      )}

      {currentPage === 'home' && (
        <main className="pt-24 pb-12 relative z-10 min-h-screen">
          {/* Blank page */}
        </main>
      )}

      <Footer />
    </div>
  );
}

export default App;