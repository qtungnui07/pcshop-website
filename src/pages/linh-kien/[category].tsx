import { useParams, Navigate } from 'react-router-dom';

export default function DynamicCategoryPage() {
  const { category } = useParams();
  if (!category) return <Navigate to="/linh-kien" replace />;
  return <Navigate to={`/linh-kien?category=${category.toLowerCase()}`} replace />;
}
