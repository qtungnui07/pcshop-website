import Navbar from './components/Navbar';
import StoreHeader from './components/StoreHeader';
import CategoryList from './components/CategoryList';
import ProductCarousel from './components/ProductCarousel';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-blue-200">
      <Navbar />
      <main className="pt-24 pb-12 relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <StoreHeader />
          <CategoryList />
        </div>
        <ProductCarousel />
      </main>
      <Footer />
    </div>
  );
}

export default App;