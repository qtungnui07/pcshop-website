export default function StoreHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 xl:mb-12 2xl:mb-16 pt-8">
      <h1 className="text-3xl md:text-4xl xl:text-[44px] 2xl:text-[48px] font-semibold tracking-tight text-[#1d1d1f]">
        Cửa Hàng
      </h1>
      <div className="mt-4 md:mt-0 text-left md:text-right">
        <p className="text-[#86868b] text-sm md:text-base font-medium">
          Cách tốt nhất để mua <br className="hidden md:block" /> <span className="text-[#1d1d1f]">linh kiện bạn thích.</span>
        </p>
      </div>
    </div>
  );
}
