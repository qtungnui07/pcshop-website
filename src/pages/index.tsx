import HeroSection from './marketing-page/HeroSection';
import CategoriesSection from './marketing-page/CategoriesSection';
import LaptopCategoriesSection from './marketing-page/LaptopCategoriesSection';
import TrustBadgesSection from './marketing-page/TrustBadgesSection';
import BrandSection from './marketing-page/BrandSection';
import FeaturedCategoriesSection from './marketing-page/FeaturedCategoriesSection';
import ProductCarousel from './marketing-page/ProductCarousel';
import TwoBannerCardsSection from './marketing-page/TwoBannerCardsSection';

export default function Home() {
  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      {/* ══════════════════ HERO ══════════════════ */}
      <HeroSection />

      {/* ══════════════════ FEATURED CATEGORIES ══════════════════ */}
      <FeaturedCategoriesSection />

      {/* ══════════════════ PRODUCT CAROUSEL ══════════════════ */}
      <ProductCarousel />

      {/* ══════════════════ TWO BANNER CARDS ══════════════════ */}
      <TwoBannerCardsSection />

      {/* ══════════════════ CATEGORIES ══════════════════ */}
      <CategoriesSection />
      
      {/* ══════════════════ LAPTOP CATEGORIES ══════════════════ */}
      <LaptopCategoriesSection />

      {/* ══════════════════ TRUST BADGES ══════════════════ */}
      <TrustBadgesSection />

      {/* ══════════════════ BRAND / VIDEO ══════════════════ */}
      <BrandSection />
    </div>
  );
}