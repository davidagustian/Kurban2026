import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

export default function RecentActivity({ data = [], loading = false }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[#1a1a18]">Aktivitas Terbaru</p>
        <span className="text-xs text-[#888780]">{data.length} transaksi terbaru</span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-[#888780] text-sm">
          <i className="ti ti-loader-2 animate-spin text-lg" /> Memuat...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr>
                {["Siswa", "Kelas", "Kategori", "Jumlah", "Tanggal"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#888780] uppercase tracking-wider pb-2.5 border-b border-black/[0.09]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((a) => {
                const isGreen = a.kategori === "Tabungan Kurban";
                return (
                  <tr key={a.id} className="border-b border-black/[0.05] last:border-0">
                    <td className="py-2.5 font-medium text-[#1a1a18]">{a.nama}</td>
                    <td className="py-2.5 text-[#5F5E5A]">{a.kelas}</td>
                    <td className="py-2.5"><Badge variant={isGreen ? "green" : "blue"}>{a.kategori}</Badge></td>
                    <td className={"py-2.5 font-semibold " + (isGreen ? "text-[#3B6D11]" : "text-[#185FA5]")}>
                      {fmt(a.jumlah)}
                    </td>
                    <td className="py-2.5 text-xs text-[#888780]">
                      {new Date(a.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-[#888780] text-sm">Belum ada transaksi.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
