import { ShieldCheck, Truck, CheckCircle2, Gamepad2, Palette, Clock, Box } from "lucide-react";

const pcCategories = [
  {
    name: "PC Gaming",
    icon: <Gamepad2 className="w-4.5 h-4.5 text-zinc-500" strokeWidth={2.2} />,
    blockFrom: "#7c3aed",
    blockTo: "#db2777",
    glowColor: "rgba(255,100,200,0.4)"
  },
  {
    name: "PC Đồ Họa",
    icon: <Palette className="w-4.5 h-4.5 text-zinc-500" strokeWidth={2.2} />,
    blockFrom: "#1d4ed8",
    blockTo: "#0ea5e9",
    glowColor: "rgba(100,200,255,0.4)"
  },
  {
    name: "PC Văn Phòng",
    icon: <Clock className="w-4.5 h-4.5 text-zinc-500" strokeWidth={2.2} />,
    blockFrom: "#d97706",
    blockTo: "#fbbf24",
    glowColor: "rgba(255,220,80,0.45)"
  },
  {
    name: "PC Mini",
    icon: <Box className="w-4.5 h-4.5 text-zinc-500" strokeWidth={2.2} />,
    blockFrom: "#059669",
    blockTo: "#10b981",
    glowColor: "rgba(52,211,153,0.45)"
  }
];

export default function PCIndex() {
  return (
    <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-10 md:py-16">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <span className="inline-block px-3 py-1 bg-zinc-200/60 text-zinc-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            PC Gaming & Workstation
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-tight mb-6 whitespace-pre-line">
            PC mạnh mẽ{"\n"}cho mọi nhu cầu.
          </h1>
          <p className="text-lg text-zinc-500 mb-8 max-w-lg leading-relaxed whitespace-pre-line">
            Hiệu năng đỉnh cao, thiết kế tinh tế.{"\n"}Được tối ưu cho Gaming, Work và Sáng tạo.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-row gap-4 mb-12 w-full sm:w-auto">
            <button className="flex-1 sm:flex-initial inline-flex items-center justify-center px-8 py-3 bg-[#1d1d1f] hover:bg-zinc-800 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap">
              Xem PC Gaming <span className="ml-2">→</span>
            </button>
            <button className="flex-1 sm:flex-initial inline-flex items-center justify-center px-8 py-3 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 font-medium rounded-full transition-all duration-300 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap">
              Tự build PC <span className="ml-2">→</span>
            </button>
          </div>

          {/* Hero Bottom Perks */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 w-full pt-8 border-t border-zinc-200/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-zinc-600" strokeWidth={2} />
              <span className="text-[13px] text-zinc-500 leading-tight font-medium whitespace-pre-line">
                Bảo hành lên đến{"\n"}36 tháng
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-zinc-600" strokeWidth={2} />
              <span className="text-[13px] text-zinc-500 leading-tight font-medium whitespace-pre-line">
                Giao hàng nhanh{"\n"}toàn quốc
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-zinc-600" strokeWidth={2} />
              <span className="text-[13px] text-zinc-500 leading-tight font-medium whitespace-pre-line">
                Test máy kỹ càng{"\n"}trước khi giao
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Gradient Block PC Illustration */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <div className="w-full aspect-[4/3] sm:aspect-square md:aspect-[4/3] lg:aspect-square bg-gradient-to-br from-[#f8f9fa] via-[#e9ecef] to-[#dee2e6] rounded-[2.5rem] relative overflow-hidden shadow-xl border border-white flex items-center justify-center p-8 group/hero">
            
            {/* Ambient Lighting Glows */}
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-cyan-200/20 to-indigo-200/20 rounded-full blur-3xl opacity-60" />

            {/* Custom CSS PC Case structure */}
            <div className="w-[62%] h-[88%] bg-[#1b1b1d] rounded-[2.2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] border border-white/10 relative overflow-hidden flex flex-col p-4">
              
              {/* Glass reflection highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
              
              {/* Front Panel Mesh/Glass area */}
              <div className="absolute right-0 top-0 bottom-0 w-10 bg-black/40 border-l border-white/5 z-10 flex flex-col justify-around items-center py-6">
                {/* 3 front RGB fans */}
                {[1, 2, 3].map((f) => (
                  <div key={f} className="w-8 h-8 rounded-full border border-white/10 bg-cyan-100/5 shadow-[0_0_10px_rgba(165,243,252,0.3)] flex items-center justify-center animate-pulse">
                    <div className="w-3.5 h-3.5 rounded-full border border-white/10 bg-cyan-300/20" />
                  </div>
                ))}
              </div>

              {/* Inside components */}
              <div className="flex-1 relative pr-10">
                {/* Rear exhaust fan */}
                <div className="absolute left-1 top-2 w-6 h-6 rounded-full border border-white/10 bg-blue-100/5 shadow-[0_0_8px_rgba(147,197,253,0.3)]" />

                {/* AIO Cooler Screen (32C) */}
                <div className="absolute left-1/3 top-1/4 w-14 h-14 rounded-full border border-white/15 bg-zinc-900 shadow-[0_0_15px_rgba(147,197,253,0.4)] flex items-center justify-center z-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-zinc-400 font-mono leading-none">CPU</span>
                    <span className="text-[11px] text-blue-300 font-mono font-bold leading-none mt-0.5">32°C</span>
                  </div>
                </div>

                {/* GPU with light strip */}
                <div className="absolute left-4 top-[56%] w-36 h-7 bg-zinc-800 rounded shadow-[0_0_12px_rgba(168,85,247,0.3)] border border-white/5 flex items-center px-2">
                  <div className="w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 rounded-full animate-pulse" />
                </div>

                {/* RAM Module slots */}
                <div className="absolute left-[58%] top-6 h-10 w-4 flex gap-0.5">
                  <div className="w-0.5 h-full bg-cyan-400/60 shadow-[0_0_6px_rgba(34,211,238,0.5)] rounded-full" />
                  <div className="w-0.5 h-full bg-cyan-400/60 shadow-[0_0_6px_rgba(34,211,238,0.5)] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP THEO NHU CẦU SECTION */}
      <section className="mt-20 md:mt-28">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Shop theo nhu cầu
          </h2>
          <a href="#" className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 transition-colors flex items-center gap-1">
            Xem tất cả <span className="text-xs">→</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {pcCategories.map((cat, idx) => {
            return (
              <div
                key={idx}
                className="cursor-pointer group bg-white rounded-3xl p-3 border border-zinc-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Block with Gradient */}
                <div
                  className="w-full aspect-[4/3.2] rounded-2xl overflow-hidden relative"
                  style={{ background: `linear-gradient(135deg, ${cat.blockFrom} 0%, ${cat.blockTo} 100%)` }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${cat.glowColor} 0%, transparent 70%)` }}
                  />

                  {/* Icon Badge overlay */}
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-white/50">
                    {cat.icon}
                  </div>
                </div>

                {/* Label inside Card */}
                <div className="flex items-center justify-between px-1.5 pt-3 pb-1">
                  <span className="text-[14px] font-bold text-zinc-800 group-hover:text-zinc-950 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-zinc-400 text-sm group-hover:text-zinc-700 transition-colors transform group-hover:translate-x-1 duration-200">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}
