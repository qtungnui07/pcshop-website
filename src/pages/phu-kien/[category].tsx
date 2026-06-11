import { useParams } from 'react-router-dom';

export default function DynamicCategoryPage() {
  const { category } = useParams();
  return (
    <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 text-center pt-20">
      <h1 className="text-4xl font-semibold mb-4 tracking-tight capitalize">Chi tiết: {category?.replace(/-/g, ' ')}</h1>
      <p className="text-[#86868b] text-lg">Sản phẩm thuộc danh mục này sẽ hiển thị ở đây.</p>
    </div>
  );
}
