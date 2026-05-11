"use client";

const navItems = [
  { page: "dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
  { page: "input", icon: "ti-circle-plus", label: "Input Tabungan" },
  { page: "laporan", icon: "ti-report-analytics", label: "Laporan" },
  { page: "arsip", icon: "ti-archive", label: "Arsip" },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-[220px] bg-white border-r border-black/[0.09] flex flex-col py-5 flex-shrink-0 hidden md:flex">
      {/* Brand */}
      <div className="px-5 pb-6 border-b border-black/[0.09] mb-2">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center mb-2.5">
          <i className="ti ti-pig-money text-white text-xl" aria-hidden="true" />
        </div>
        <div className="text-[13px] font-semibold text-[#1a1a18] leading-tight">Kurban Savings</div>
        <div className="text-[11px] text-[#5F5E5A]">Manager</div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1">
        <p className="text-[10px] font-semibold text-[#888780] uppercase tracking-wider px-2 mb-1 mt-2">Menu Utama</p>
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`
              w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer text-[13.5px] mb-0.5
              transition-all duration-150 text-left
              ${activePage === item.page
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "text-[#5F5E5A] hover:bg-[#F1EFE8] hover:text-[#1a1a18]"
              }
            `}
          >
            <i className={`ti ${item.icon} text-[17px] ${activePage === item.page ? "text-indigo-600" : ""}`} aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 pt-4 border-t border-black/[0.09]">
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
          <i className="ti ti-calendar-event text-[13px]" aria-hidden="true" /> 2024/2025
        </span>
      </div>
    </aside>
  );
}
