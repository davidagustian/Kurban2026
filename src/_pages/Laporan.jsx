"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { kelasList } from "@/data/dummyData";
import { useLaporan } from "@/hooks/useTabungan";

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");
const TARGET = { "Tabungan Kurban": 1470000, "Belajar Kurban": 200000 };

export default function Laporan({ tahunAjaranId }) {
  const [filterKelas, setFilterKelas] = useState("");
  const [filterKat, setFilterKat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const { data, loading, refetch } = useLaporan(tahunAjaranId);

  const handleCari = () => refetch({ kelas: filterKelas || undefined, kategori: filterKat || undefined });

  const filtered = data.filter((r) => {
    const target = TARGET[r.kategori] ?? 200000;
    const ok = r.total >= target;
    return (
      (!filterStatus || (filterStatus === "Tercapai" ? ok : !ok)) &&
      (!search || r.nama.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-3.5">
      <Card className="p-5">
        <p className="text-sm font-semibold text-[#1a1a18] mb-4">Filter Laporan</p>
        <div className="flex flex-wrap gap-3 items-end">
          {[
            { label: "Kelas", val: filterKelas, set: setFilterKelas, opts: kelasList, ph: "Semua Kelas" },
            { label: "Kategori", val: filterKat, set: setFilterKat, opts: ["Tabungan Kurban", "Belajar Kurban"], ph: "Semua Kategori" },
            { label: "Status", val: filterStatus, set: setFilterStatus, opts: ["Tercapai", "Belum"], ph: "Semua Status" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <label className="text-[11.5px] font-medium text-[#5F5E5A]">{f.label}</label>
              <select value={f.val} onChange={(e) => f.set(e.target.value)}
                className="px-3 py-2 text-[13px] rounded-md border border-black/[0.09] bg-white text-[#1a1a18] outline-none focus:border-[#639922]">
                <option value="">{f.ph}</option>
                {f.opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-[11.5px] font-medium text-[#5F5E5A]">Cari nama</label>
            <input type="text" placeholder="Nama siswa..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-[13px] rounded-md border border-black/[0.09] bg-white text-[#1a1a18] outline-none focus:border-[#639922] w-44" />
          </div>
          <Button variant="primary" onClick={handleCari}>
            <i className="ti ti-search" /> Cari
          </Button>
        </div>
      </Card>

      <Card className="p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#1a1a18]">
            Data Tabungan Siswa
            <span className="ml-2 text-xs font-normal text-[#888780]">({filtered.length} data)</span>
          </p>
          <Button variant="secondary" className="text-xs py-1.5 px-3">
            <i className="ti ti-download" /> Export
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-[#888780] text-sm">
            <i className="ti ti-loader-2 animate-spin text-lg" /> Memuat data...
          </div>
        ) : (
          <table className="w-full text-sm min-w-[580px]">
            <thead>
              <tr>
                {["No","Nama Siswa","Kelas","Kategori","Total Tabungan","Target","Status"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#888780] uppercase tracking-wider pb-3 border-b border-black/[0.09]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const target = TARGET[r.kategori] ?? 200000;
                const ok = r.total >= target;
                return (
                  <tr key={r.siswa_id + r.kategori} className="border-b border-black/[0.05] last:border-0 hover:bg-[#F7F6F2] transition-colors">
                    <td className="py-3 text-[#888780]">{i + 1}</td>
                    <td className="py-3 font-medium text-[#1a1a18]">{r.nama}</td>
                    <td className="py-3 text-[#5F5E5A]">{r.kelas}</td>
                    <td className="py-3"><Badge variant={r.kategori === "Tabungan Kurban" ? "green" : "blue"}>{r.kategori}</Badge></td>
                    <td className="py-3 font-medium text-[#1a1a18]">{fmt(r.total)}</td>
                    <td className="py-3 text-[#5F5E5A]">{fmt(target)}</td>
                    <td className="py-3"><Badge variant={ok ? "green" : "amber"}>{ok ? "Tercapai" : "Belum"}</Badge></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-[#888780] text-sm">Tidak ada data yang sesuai filter.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
