import HeroSection from './marketing-page/HeroSection';
import CategoriesSection from './marketing-page/CategoriesSection';
import FeaturedProductsSection from './marketing-page/FeaturedProductsSection';
import TrustBadgesSection from './marketing-page/TrustBadgesSection';
import BrandSection from './marketing-page/BrandSection';

export default function Home() {
  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      {/* ══════════════════ HERO ══════════════════ */}
      <HeroSection />

      {/* ══════════════════ CATEGORIES ══════════════════ */}
      <CategoriesSection />

      {/* ══════════════════ FEATURED PRODUCTS ══════════════════ */}
      <FeaturedProductsSection />

      {/* ══════════════════ TRUST BADGES ══════════════════ */}
      <TrustBadgesSection />

      {/* ══════════════════ BRAND / VIDEO ══════════════════ */}
      <BrandSection />
    </div>
  );
}
