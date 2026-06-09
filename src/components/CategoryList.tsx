import { categories } from '../constants/data';

export default function CategoryList() {
  return (
    <div className="flex overflow-x-auto gap-8 pb-8 scrollbar-hide snap-x">
      {categories.map((item, index) => (
        <div key={index} className="flex flex-col items-center justify-center min-w-[100px] cursor-pointer group snap-start">
          <div className="group-hover:scale-105 transition-transform duration-300">
            {item.icon}
          </div>
          <span className="text-sm font-medium text-[#1d1d1f] mt-1 group-hover:text-blue-600 transition-colors">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
