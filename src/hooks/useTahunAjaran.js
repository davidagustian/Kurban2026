"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { createTahunAjaran } from "@/lib/api";

export function useTahunAjaran() {
  const [list, setList] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Use v_summary_tahun so Arsip page gets total_tabungan + total_peserta too
      const { data, error } = await supabase
        .from("v_summary_tahun")
        .select("*")
        .order("tahun", { ascending: false });
      if (error) throw error;
      setList(data ?? []);
      setActive((prev) => {
        if (prev) return data?.find((r) => r.id === prev.id) ?? prev;
        return data?.find((r) => r.status === "Berjalan") ?? data?.[0] ?? null;
      });
    } catch (e) {
      console.error("Tahun ajaran error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Realtime: refresh when tabungan or tahun_ajaran changes
  useEffect(() => {
    const channel = supabase
      .channel("tahun-ajaran-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tahun_ajaran" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "tabungan" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  const create = async (tahun) => {
    const row = await createTahunAjaran(tahun);
    await load();
    return row;
  };

  return { list, active, setActive, loading, refetch: load, create };
}
