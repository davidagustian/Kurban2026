"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useTahunAjaran } from "@/hooks/useTahunAjaran";

const fmt = (n) => "Rp " + n.toLocaleString("id-ID");

export default function Arsip() {
  const { list, loading, create } = useTahunAjaran();
  const [showModal, setShowModal] = useState(false);
  const [newTahun, setNewTahun] = useState("");
  const [creating, setCreating] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleCreate = async () => {
    if (!newTahun.trim()) { setErrMsg("Tahun ajaran wajib diisi (contoh: 2025/2026)"); return; }
    setCreating(true);
    try {
      await create(newTahun.trim());
      setShowModal(false);
      setNewTahun("");
      setErrMsg("");
    } catch (e) {
      setErrMsg(e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[17px] font-bold text-[#1a1a18]">Arsip Tahun Ajaran</h2>
          <p className="text-[12.5px] text-[#5F5E5A] mt-0.5">Riwayat program tabungan kurban</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="ti ti-plus" /> Mulai Tahun Ajaran Baru
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-[#888780] text-sm">
          <i className="ti ti-loader-2 animate-spin text-lg" /> Memuat arsip...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {list.map((a) => (
            <Card key={a.id} hover className="p-5">
              <p className="text-[22px] font-bold text-[#1a1a18] mb-1">{a.tahun}</p>
              <div className="mb-4">
                <Badge variant={a.status === "Berjalan" ? "blue" : "green"}>{a.status}</Badge>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Total Tabungan", val: fmt(a.total_tabungan ?? 0) },
                  { label: "Jumlah Peserta", val: `${a.total_peserta ?? 0} siswa` },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-[12.5px] py-1.5 border-b border-black/[0.07] last:border-0">
                    <span className="text-[#5F5E5A]">{s.label}</span>
                    <span className="font-semibold text-[#1a1a18]">{s.val}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-black/[0.09] text-[12px] font-medium text-[#5F5E5A] hover:bg-[#F1EFE8] transition-colors">
                <i className="ti ti-eye text-[15px]" /> Lihat Detail
              </button>
            </Card>
          ))}
          {list.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 py-16 text-center text-[#888780] text-sm">
              Belum ada data tahun ajaran.
            </div>
          )}
        </div>
      )}

      {/* Modal buat tahun ajaran baru */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#1a1a18]">Tahun Ajaran Baru</h3>
              <button onClick={() => { setShowModal(false); setErrMsg(""); }}
                className="text-[#888780] hover:text-[#1a1a18] transition-colors">
                <i className="ti ti-x text-lg" />
              </button>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-[12.5px] font-medium text-[#1a1a18]">Tahun Ajaran</label>
              <input type="text" placeholder="Contoh: 2025/2026" value={newTahun}
                onChange={(e) => setNewTahun(e.target.value)}
                className="px-3 py-2 text-[13.5px] rounded-md border border-black/[0.09] bg-white outline-none focus:border-[#639922] focus:ring-2 focus:ring-[#639922]/10" />
              {errMsg && <p className="text-[11px] text-[#E24B4A]">{errMsg}</p>}
            </div>
            <div className="flex gap-2.5">
              <Button variant="primary" onClick={handleCreate}
                className={"flex-1 justify-center " + (creating ? "opacity-60 pointer-events-none" : "")}>
                {creating ? <><i className="ti ti-loader-2 animate-spin" /> Menyimpan...</> : "Simpan"}
              </Button>
              <Button variant="secondary" onClick={() => { setShowModal(false); setErrMsg(""); }}>Batal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
