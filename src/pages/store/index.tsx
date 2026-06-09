import StoreHeader from '../../components/StoreHeader';
import CategoryList from '../../components/CategoryList';
import ProductCarousel from '../../components/ProductCarousel';

export default function Store() {
  return (
    <>
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <StoreHeader />
        <CategoryList />
      </div>
      <ProductCarousel />
    </>
  );
}
