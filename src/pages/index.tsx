import HeroSection from './marketing-page/HeroSection';
import CategoriesSection from './marketing-page/CategoriesSection';
import TrustBadgesSection from './marketing-page/TrustBadgesSection';
import BrandSection from './marketing-page/BrandSection';
import FeaturedCategoriesSection from './marketing-page/FeaturedCategoriesSection';
import ProductCarousel from './marketing-page/ProductCarousel';

export default function Home() {
  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      {/* ══════════════════ HERO ══════════════════ */}
      <HeroSection />

      {/* ══════════════════ FEATURED CATEGORIES ══════════════════ */}
      <FeaturedCategoriesSection />

      {/* ══════════════════ PRODUCT CAROUSEL ══════════════════ */}
      <ProductCarousel />


      {/* ══════════════════ CATEGORIES ══════════════════ */}
      <CategoriesSection />

      {/* ══════════════════ TRUST BADGES ══════════════════ */}
      <TrustBadgesSection />

      {/* ══════════════════ BRAND / VIDEO ══════════════════ */}
      <BrandSection />
    </div>
  );
}