import { supabase } from "@/lib/supabase";

// ── Tahun Ajaran ──────────────────────────────────────────────

export async function fetchTahunAjaran() {
  const { data, error } = await supabase
    .from("tahun_ajaran")
    .select("*")
    .order("tahun", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTahunAjaran(tahun) {
  const { data, error } = await supabase
    .from("tahun_ajaran")
    .insert({ tahun, status: "Berjalan" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTahunAjaranStatus(id, status) {
  const { data, error } = await supabase
    .from("tahun_ajaran")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Siswa ─────────────────────────────────────────────────────

export async function fetchSiswa(tahunAjaranId) {
  let query = supabase.from("siswa").select("*, tahun_ajaran(tahun)").order("nama");
  if (tahunAjaranId) query = query.eq("tahun_ajaran_id", tahunAjaranId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * FIX: Find existing siswa by nama+kelas+tahun, or insert if not found.
 * Prevents duplicate siswa rows on every tabungan input.
 */
export async function findOrCreateSiswa({ nama, kelas, tahunAjaranId }) {
  // Try to find existing
  const { data: existing, error: findErr } = await supabase
    .from("siswa")
    .select("*")
    .eq("nama", nama.trim())
    .eq("kelas", kelas)
    .eq("tahun_ajaran_id", tahunAjaranId)
    .maybeSingle();

  if (findErr) throw findErr;
  if (existing) return existing;

  // Not found — create new
  const { data: created, error: createErr } = await supabase
    .from("siswa")
    .insert({ nama: nama.trim(), kelas, tahun_ajaran_id: tahunAjaranId })
    .select()
    .single();
  if (createErr) throw createErr;
  return created;
}

// ── Tabungan (Transaksi) ──────────────────────────────────────

export async function fetchTabungan({ tahunAjaranId, siswaId, kategori } = {}) {
  let query = supabase.from("v_aktivitas_terbaru").select("*");
  if (tahunAjaranId) query = query.eq("tahun_ajaran_id", tahunAjaranId);
  if (siswaId) query = query.eq("siswa_id", siswaId);
  if (kategori) query = query.eq("kategori", kategori);
  const { data, error } = await query.limit(100);
  if (error) throw error;
  return data;
}

export async function insertTabungan({ siswaId, tahunAjaranId, kategori, jumlah, tanggal, catatan }) {
  const { data, error } = await supabase
    .from("tabungan")
    .insert({
      siswa_id: siswaId,
      tahun_ajaran_id: tahunAjaranId,
      kategori,
      jumlah: Number(jumlah),
      tanggal,
      catatan: catatan || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTabungan(id) {
  const { error } = await supabase.from("tabungan").delete().eq("id", id);
  if (error) throw error;
}

// ── Laporan ───────────────────────────────────────────────────

export async function fetchLaporan({ tahunAjaranId, kelas, kategori } = {}) {
  let query = supabase.from("v_tabungan_siswa").select("*");
  if (tahunAjaranId) query = query.eq("tahun_ajaran_id", tahunAjaranId);
  if (kelas) query = query.eq("kelas", kelas);
  if (kategori) query = query.eq("kategori", kategori);
  const { data, error } = await query.order("nama");
  if (error) throw error;
  return data;
}

// ── Dashboard Summary ─────────────────────────────────────────

export async function fetchSummary(tahunAjaranId) {
  const { data, error } = await supabase
    .from("v_summary_tahun")
    .select("*")
    .eq("id", tahunAjaranId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchMonthlyChart(tahunAjaranId) {
  const { data, error } = await supabase
    .from("tabungan")
    .select("jumlah, tanggal")
    .eq("tahun_ajaran_id", tahunAjaranId)
    .order("tanggal");
  if (error) throw error;

  // Aggregate by month into running total
  const byMonth = {};
  data.forEach(({ jumlah, tanggal }) => {
    const key = tanggal.slice(0, 7); // "YYYY-MM"
    byMonth[key] = (byMonth[key] || 0) + jumlah;
  });

  let running = 0;
  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, val]) => {
      running += val;
      const [year, m] = month.split("-");
      const label = new Date(Number(year), Number(m) - 1)
        .toLocaleString("id-ID", { month: "short" });
      return { bulan: label, nilai: running };
    });
}
