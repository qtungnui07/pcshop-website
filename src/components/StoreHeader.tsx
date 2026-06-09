export default function StoreHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pt-8">
      <h1 className="text-4xl md:text-[48px] font-semibold tracking-tight text-[#1d1d1f]">
        Cửa Hàng
      </h1>
      <div className="mt-4 md:mt-0 text-left md:text-right">
        <p className="text-[#86868b] text-sm md:text-base font-medium">
          Cách tốt nhất để mua <br className="hidden md:block" /> <span className="text-[#1d1d1f]">linh kiện bạn thích.</span>
        </p>
        <a href="#" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
          Kết nối với Kỹ thuật viên &gt;
        </a>
      </div>
    </div>
  );
}
