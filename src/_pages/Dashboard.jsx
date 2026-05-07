"use client";

import SummaryCard from "@/components/dashboard/SummaryCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import ChartSection from "@/components/dashboard/ChartSection";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useDashboardSummary, useRecentActivity } from "@/hooks/useTabungan";

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");
const fmtJt = (n) => "Rp " + (n / 1_000_000).toFixed(1) + "jt";
const TARGET_TABUNGAN = 21_000_000;
const TARGET_BELAJAR_PER_SISWA = 200_000;

export default function Dashboard({ tahunAjaranId }) {
  const { summary, chart, loading: sumLoading } = useDashboardSummary(tahunAjaranId);
  const { data: activity, loading: actLoading } = useRecentActivity(tahunAjaranId);

  if (sumLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-[#888780] text-sm gap-2">
        <i className="ti ti-loader-2 animate-spin text-lg" />
        Memuat data dashboard...
      </div>
    );
  }

  const totalTabKurban = summary?.total_tabungan_kurban ?? 0;
  const totalBelajar = summary?.total_belajar_kurban ?? 0;
  const totalPeserta = summary?.total_peserta ?? 0;
  const tabPct = Math.min(100, Math.round((totalTabKurban / TARGET_TABUNGAN) * 100));
  const avgBelajar = totalPeserta > 0 ? Math.round(totalBelajar / totalPeserta) : 0;
  const belajarPct = Math.min(100, Math.round((avgBelajar / TARGET_BELAJAR_PER_SISWA) * 100));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <SummaryCard label="Total Tabungan Kurban" value={fmtJt(totalTabKurban)}
          sub={"dari target " + fmtJt(TARGET_TABUNGAN)} iconClass="ti-cash"
          iconBg="bg-[#EAF3DE]" iconColor="text-[#639922]" />
        <SummaryCard label="Total Belajar Kurban" value={fmtJt(totalBelajar)}
          sub={totalPeserta + " siswa berkontribusi"} iconClass="ti-school"
          iconBg="bg-[#E6F1FB]" iconColor="text-[#378ADD]" />
        <SummaryCard label="Total Peserta" value={totalPeserta} sub="siswa aktif"
          iconClass="ti-users" iconBg="bg-[#FAEEDA]" iconColor="text-[#BA7517]" />
        <SummaryCard label="Total Kelas" value={6} sub="kelas I – VI"
          iconClass="ti-building" iconBg="bg-[#F1EFE8]" iconColor="text-[#5F5E5A]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <ProgressCard title="Tabungan Kurban" sub="Program Kelompok"
          badge={<><i className="ti ti-users text-[11px]" /> Kelompok</>}
          badgeVariant="green" amount={fmt(totalTabKurban)} amountColor="text-[#3B6D11]"
          target={"Target: " + fmt(TARGET_TABUNGAN)} pct={tabPct}
          metaLeft={tabPct + "% tercapai"} metaRight={totalPeserta + " peserta"} />
        <ProgressCard title="Belajar Kurban" sub="Program Individu"
          badge={<><i className="ti ti-user text-[11px]" /> Individu</>}
          badgeVariant="blue" amount={"Rata-rata " + fmt(avgBelajar)} amountColor="text-[#185FA5]"
          target={"Target per siswa: " + fmt(TARGET_BELAJAR_PER_SISWA)} pct={belajarPct}
          metaLeft={belajarPct + "% rata-rata"} metaRight="— siswa lunas" />
      </div>

      <ChartSection chartData={chart} totalPeserta={totalPeserta} />
      <RecentActivity data={activity} loading={actLoading} />
    </div>
  );
}
