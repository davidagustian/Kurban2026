import Card from "@/components/ui/Card";

const chartKelas = [
  { label: "Kelas I–II", pct: 40, color: "#97C459" },
  { label: "Kelas III–IV", pct: 39, color: "#85B7EB" },
  { label: "Kelas V–VI", pct: 21, color: "#FAC775" },
];

export default function ChartSection({ chartData = [], totalPeserta = 0 }) {
  const maxVal = Math.max(...chartData.map((d) => d.nilai), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
      <Card className="p-5 lg:col-span-2">
        <p className="text-sm font-semibold text-[#1a1a18] mb-4">Perkembangan Tabungan per Bulan</p>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-36 text-[#888780] text-xs">Belum ada data transaksi</div>
        ) : (
          <div className="flex items-end gap-2 h-36">
            {chartData.map((d, i) => {
              const pct = (d.nilai / maxVal) * 100;
              const isLast = i === chartData.length - 1;
              return (
                <div key={d.bulan} className="flex-1 flex flex-col items-center gap-1.5 h-full">
                  <span className="text-[9px] text-[#888780] leading-none">
                    {isLast ? (d.nilai / 1_000_000).toFixed(1) + "jt" : ""}
                  </span>
                  <div className="flex-1 flex items-end w-full">
                    <div className="w-full rounded-t-[3px] hover:opacity-75 cursor-pointer transition-opacity"
                      style={{ height: `${pct}%`, minHeight: 4, background: isLast ? "#639922" : "#C0DD97" }} />
                  </div>
                  <span className="text-[10px] text-[#888780]">{d.bulan}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <p className="text-sm font-semibold text-[#1a1a18] mb-4">Distribusi Kelas</p>
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 90 90" className="-rotate-90" width="96" height="96">
              <circle cx="45" cy="45" r="35" fill="none" stroke="#F1EFE8" strokeWidth="12" />
              <circle cx="45" cy="45" r="35" fill="none" stroke="#97C459" strokeWidth="12"
                strokeDasharray="88 132" strokeDashoffset="0" />
              <circle cx="45" cy="45" r="35" fill="none" stroke="#85B7EB" strokeWidth="12"
                strokeDasharray="54 166" strokeDashoffset="-88" />
              <circle cx="45" cy="45" r="35" fill="none" stroke="#FAC775" strokeWidth="12"
                strokeDasharray="46 174" strokeDashoffset="-142" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold text-[#1a1a18]">{totalPeserta}</span>
              <span className="text-[9px] text-[#888780]">siswa</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            {chartKelas.map((k) => (
              <div key={k.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: k.color }} />
                <span className="text-xs text-[#5F5E5A]">{k.label} ({k.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
