import { useParams, Navigate } from 'react-router-dom';

export default function LaptopCategoryPage() {
  const { category } = useParams();
  
  if (!category) {
    return <Navigate to="/laptop" replace />;
  }

  const catLower = category.toLowerCase();
  const knownBrands = ['asus', 'msi', 'acer', 'lenovo', 'dell', 'hp', 'gigabyte', 'apple'];
  
  if (knownBrands.includes(catLower)) {
    return <Navigate to={`/laptop?thuong-hieu=${catLower}`} replace />;
  }

  return <Navigate to={`/laptop?filter=${catLower}`} replace />;
}
