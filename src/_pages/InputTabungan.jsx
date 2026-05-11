"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { findOrCreateSiswa, insertTabungan } from "@/lib/api";

const initialForm = { nama: "", kelas: "", jumlah: "", tanggal: new Date().toISOString().split("T")[0], catatan: "" };
const initialErrors = { nama: "", kelas: "", kategori: "", jumlah: "", tanggal: "" };

export default function InputTabungan({ tahunAjaranId }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errMsg, setErrMsg] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = { ...initialErrors };
    let ok = true;
    if (!form.nama.trim()) { errs.nama = "Nama wajib diisi"; ok = false; }
    if (!form.kelas) { errs.kelas = "Pilih kelas"; ok = false; }
    if (!kategori) { errs.kategori = "Pilih kategori"; ok = false; }
    if (!form.jumlah || Number(form.jumlah) <= 0) { errs.jumlah = "Jumlah tidak valid"; ok = false; }
    if (!form.tanggal) { errs.tanggal = "Tanggal wajib diisi"; ok = false; }
    setErrors(errs);
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus("loading");
    setErrMsg("");
    try {
      // 1. Upsert siswa (cari by nama+kelas atau buat baru)
      const siswa = await findOrCreateSiswa({ nama: form.nama.trim(), kelas: form.kelas, tahunAjaranId });
      // 2. Insert tabungan
      await insertTabungan({
        siswaId: siswa.id,
        tahunAjaranId,
        kategori: kategori === "tabungan" ? "Tabungan Kurban" : "Belajar Kurban",
        jumlah: Number(form.jumlah),
        tanggal: form.tanggal,
        catatan: form.catatan,
      });
      setStatus("success");
      setTimeout(() => { setForm(initialForm); setKategori(""); setErrors(initialErrors); setStatus(null); }, 2500);
    } catch (e) {
      setStatus("error");
      setErrMsg(e.message);
    }
  };

  const handleReset = () => { setForm(initialForm); setKategori(""); setErrors(initialErrors); setStatus(null); setErrMsg(""); };

  return (
    <Card className="p-7 max-w-xl">
      <h2 className="text-[17px] font-bold text-[#1a1a18] mb-1">Input Tabungan</h2>
      <p className="text-[13px] text-[#5F5E5A] mb-6">Tambahkan data tabungan siswa baru</p>

      {status === "success" && (
        <div className="flex items-center gap-2 bg-[#EAF3DE] border border-[#C0DD97] rounded-md px-4 py-3 mb-5 text-[13px] text-[#3B6D11]">
          <i className="ti ti-circle-check text-base" /> Data berhasil disimpan!
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 bg-[#FCEBEB] border border-[#F7C1C1] rounded-md px-4 py-3 mb-5 text-[13px] text-[#A32D2D]">
          <i className="ti ti-alert-circle text-base" /> {errMsg || "Terjadi kesalahan, coba lagi."}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="f-nama" label="Nama Siswa" placeholder="Masukkan nama siswa"
          value={form.nama} onChange={set("nama")} error={errors.nama} />
        <div className="flex flex-col gap-1.5">
  <label className="text-[12.5px] font-semibold text-slate-600 uppercase tracking-wide">Kelas</label>
  <select id="f-kelas" value={form.kelas} onChange={set("kelas")}
    className="px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
    <option value="">Pilih kelas</option>
    {JENJANG.map((j) => (
      <optgroup key={j.label} label={j.label}>
        {j.kelas.map((k) => <option key={k} value={k}>{k}</option>)}
      </optgroup>
    ))}
  </select>
  {errors.kelas && <p className="text-[11px] text-red-500">{errors.kelas}</p>}
</div>
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-[12.5px] font-medium text-[#1a1a18]">Kategori</label>
          <div className="flex gap-2.5">
            {[
              { key: "tabungan", label: "Tabungan Kurban", sub: "Kelompok", dot: "#639922", border: "border-[#639922]", bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]" },
              { key: "belajar", label: "Belajar Kurban", sub: "Individu", dot: "#378ADD", border: "border-[#378ADD]", bg: "bg-[#E6F1FB]", text: "text-[#185FA5]" },
            ].map((k) => (
              <button key={k.key} type="button"
                onClick={() => { setKategori(k.key); setErrors((e) => ({ ...e, kategori: "" })); }}
                className={"flex-1 flex items-center gap-2 px-3 py-2.5 rounded-md border-[1.5px] cursor-pointer transition-all duration-150 " +
                  (kategori === k.key ? `${k.border} ${k.bg} ${k.text} font-semibold` : "border-black/[0.09] text-[#5F5E5A] hover:border-[#888780]")}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: k.dot }} />
                <div>
                  <div className="text-[13px]">{k.label}</div>
                  <div className="text-[11px] opacity-70">{k.sub}</div>
                </div>
              </button>
            ))}
          </div>
          {errors.kategori && <p className="text-[11px] text-[#E24B4A]">{errors.kategori}</p>}
        </div>

        <Input id="f-jumlah" label="Jumlah Tabungan (Rp)" placeholder="Contoh: 50000"
          type="number" value={form.jumlah} onChange={set("jumlah")} error={errors.jumlah} />
        <Input id="f-tanggal" label="Tanggal"
          type="date" value={form.tanggal} onChange={set("tanggal")} error={errors.tanggal} />
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-[12.5px] font-medium text-[#1a1a18]">Catatan (opsional)</label>
          <textarea value={form.catatan} onChange={set("catatan")} rows={2}
            placeholder="Tambahkan catatan jika perlu..."
            className="px-3 py-2 text-[13.5px] rounded-md border border-black/[0.09] bg-white text-[#1a1a18] outline-none resize-none focus:border-[#639922] focus:ring-2 focus:ring-[#639922]/10 transition-all" />
        </div>
      </div>

      <div className="flex gap-2.5 mt-6">
        <Button variant="primary" onClick={handleSubmit}
          className={status === "loading" ? "opacity-60 pointer-events-none" : ""}>
          {status === "loading"
            ? <><i className="ti ti-loader-2 animate-spin" /> Menyimpan...</>
            : <><i className="ti ti-device-floppy" /> Simpan</>}
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          <i className="ti ti-refresh" /> Reset
        </Button>
      </div>
    </Card>
  );
}
