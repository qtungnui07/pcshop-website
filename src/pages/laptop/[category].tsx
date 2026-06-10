import { useParams } from 'react-router-dom';
import StoreHeader from '../../components/StoreHeader';

export default function LaptopCategoryPage() {
  const { category } = useParams();
  
  return (
    <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-8 pb-16">
      <StoreHeader
        title={`Laptop: ${category?.replace(/-/g, ' ')}`}
      />
      <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-zinc-100 mt-6">
        <p className="text-zinc-400 text-lg">Các dòng máy Laptop {category?.replace(/-/g, ' ')} đang được cập nhật.</p>
      </div>
    </div>
  );
}
