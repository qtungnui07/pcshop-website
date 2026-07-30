import { useParams, Navigate } from 'react-router-dom';

export default function DynamicCategoryPage() {
  const { category } = useParams();
  if (!category) return <Navigate to="/phu-kien" replace />;
  return <Navigate to={`/phu-kien?category=${category.toLowerCase()}`} replace />;
}
