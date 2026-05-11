"use client";

const navItems = [
  { page: "dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
  { page: "input", icon: "ti-circle-plus", label: "Input" },
  { page: "laporan", icon: "ti-report-analytics", label: "Laporan" },
  { page: "arsip", icon: "ti-archive", label: "Arsip" },
];

export default function MobileNav({ activePage, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/[0.09] pb-3 pt-2 z-50 md:hidden">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors duration-150
              ${activePage === item.page ? "text-indigo-600" : "text-slate-400"}`}
          >
            <i className={`ti ${item.icon} text-[22px]`} aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
