-- ============================================================
-- KURBAN SAVINGS MANAGER — Supabase Schema
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabel tahun ajaran (Arsip)
CREATE TABLE IF NOT EXISTS tahun_ajaran (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tahun       VARCHAR(9) NOT NULL UNIQUE,  -- e.g. "2024/2025"
  status      VARCHAR(20) NOT NULL DEFAULT 'Berjalan' CHECK (status IN ('Berjalan', 'Selesai')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel siswa
CREATE TABLE IF NOT EXISTS siswa (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama            TEXT NOT NULL,
  kelas           VARCHAR(20) NOT NULL CHECK (kelas IN ('Kelas I','Kelas II','Kelas III','Kelas IV','Kelas V','Kelas VI')),
  tahun_ajaran_id UUID NOT NULL REFERENCES tahun_ajaran(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel tabungan (transaksi)
CREATE TABLE IF NOT EXISTS tabungan (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id        UUID NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
  tahun_ajaran_id UUID NOT NULL REFERENCES tahun_ajaran(id) ON DELETE CASCADE,
  kategori        VARCHAR(30) NOT NULL CHECK (kategori IN ('Tabungan Kurban', 'Belajar Kurban')),
  jumlah          BIGINT NOT NULL CHECK (jumlah > 0),
  tanggal         DATE NOT NULL,
  catatan         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- VIEWS untuk laporan & dashboard
-- ============================================================

-- View: total tabungan per siswa per kategori
CREATE OR REPLACE VIEW v_tabungan_siswa AS
SELECT
  s.id AS siswa_id,
  s.nama,
  s.kelas,
  t.kategori,
  ta.tahun AS tahun_ajaran,
  ta.id AS tahun_ajaran_id,
  SUM(t.jumlah) AS total,
  COUNT(t.id) AS jumlah_transaksi
FROM siswa s
JOIN tabungan t ON t.siswa_id = s.id
JOIN tahun_ajaran ta ON ta.id = s.tahun_ajaran_id
GROUP BY s.id, s.nama, s.kelas, t.kategori, ta.tahun, ta.id;

-- View: summary per tahun ajaran
CREATE OR REPLACE VIEW v_summary_tahun AS
SELECT
  ta.id,
  ta.tahun,
  ta.status,
  COUNT(DISTINCT s.id) AS total_peserta,
  COALESCE(SUM(t.jumlah), 0) AS total_tabungan,
  COALESCE(SUM(CASE WHEN t.kategori = 'Tabungan Kurban' THEN t.jumlah ELSE 0 END), 0) AS total_tabungan_kurban,
  COALESCE(SUM(CASE WHEN t.kategori = 'Belajar Kurban' THEN t.jumlah ELSE 0 END), 0) AS total_belajar_kurban
FROM tahun_ajaran ta
LEFT JOIN siswa s ON s.tahun_ajaran_id = ta.id
LEFT JOIN tabungan t ON t.tahun_ajaran_id = ta.id
GROUP BY ta.id, ta.tahun, ta.status;

-- View: aktivitas terbaru (join semua tabel)
CREATE OR REPLACE VIEW v_aktivitas_terbaru AS
SELECT
  t.id,
  s.nama,
  s.kelas,
  t.kategori,
  t.jumlah,
  t.tanggal,
  t.catatan,
  t.created_at,
  ta.tahun AS tahun_ajaran
FROM tabungan t
JOIN siswa s ON s.id = t.siswa_id
JOIN tahun_ajaran ta ON ta.id = t.tahun_ajaran_id
ORDER BY t.created_at DESC;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE tahun_ajaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswa        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabungan     ENABLE ROW LEVEL SECURITY;

-- Hanya authenticated user (admin) yang bisa read/write
CREATE POLICY "auth_read_tahun_ajaran"  ON tahun_ajaran FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_insert_tahun_ajaran" ON tahun_ajaran FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_tahun_ajaran" ON tahun_ajaran FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_siswa"   ON siswa FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_insert_siswa" ON siswa FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_siswa" ON siswa FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_tabungan"   ON tabungan FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_insert_tabungan" ON tabungan FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_tabungan" ON tabungan FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_tabungan" ON tabungan FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA (opsional – untuk testing)
-- ============================================================

INSERT INTO tahun_ajaran (tahun, status) VALUES
  ('2024/2025', 'Berjalan'),
  ('2023/2024', 'Selesai'),
  ('2022/2023', 'Selesai')
ON CONFLICT (tahun) DO NOTHING;
