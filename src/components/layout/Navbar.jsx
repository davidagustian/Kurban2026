const pageTitles = {
  dashboard: "Dashboard",
  input: "Input Tabungan",
  laporan: "Laporan",
  arsip: "Arsip",
};

export default function Navbar({ activePage }) {
  return (
    <header className="bg-white border-b border-black/[0.09] px-7 py-3.5 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-base font-semibold text-[#1a1a18]">{pageTitles[activePage]}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#5F5E5A] hidden sm:block">SDN Nusantara 01</span>
        <div className="w-8 h-8 rounded-full bg-[#639922] flex items-center justify-center text-xs font-semibold text-white">
          AD
        </div>
      </div>
    </header>
  );
}
