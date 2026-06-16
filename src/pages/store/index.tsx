import StoreHeader from '../../components/StoreHeader';
import CategoryList from '../../components/CategoryList';
import ProductCarousel from '../../components/ProductCarousel';
import { latestProducts, hotProducts } from '../../constants/data';

export default function Store() {
  return (
    <>
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <StoreHeader
          title="Cửa Hàng"
          subtitle="Cách tốt nhất để mua"
          highlightText="linh kiện bạn thích."
        />
        <CategoryList />
      </div>
      <ProductCarousel
        title="Thế hệ mới nhất."
        subtitle="Xem ngay có gì mới."
        products={latestProducts}
      />
      <ProductCarousel
        title="12"
        subtitle="123"
        products={hotProducts}
      />
    </>
  );
}

