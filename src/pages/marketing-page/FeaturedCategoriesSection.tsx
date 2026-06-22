import CategoryList from '../../components/CategoryList';
 
export default function FeaturedCategoriesSection() {
  return (
    <section className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pb-12 pt-4">
      <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 pt-4 pb-10 px-6 lg:pt-5 lg:pb-12 lg:px-8">
        <h2 className="text-[2rem] font-bold tracking-tight text-[#1d1d1f] mb-8">
          Danh mục nổi bật
        </h2>
        <CategoryList />
      </div>
    </section>
  );
}
  