"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { fetchTabungan, fetchSummary, fetchMonthlyChart, fetchLaporan } from "@/lib/api";

export function useRecentActivity(tahunAjaranId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!tahunAjaranId) return;
    setLoading(true);
    try {
      const rows = await fetchTabungan({ tahunAjaranId });
      setData(rows.slice(0, 10));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tahunAjaranId]);

  // Initial load
  useEffect(() => { load(); }, [load]);

  // Realtime subscription on tabungan table
  useEffect(() => {
    if (!tahunAjaranId) return;
    const channel = supabase
      .channel("tabungan-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tabungan" }, () => {
        load(); // Re-fetch on any change
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [tahunAjaranId, load]);

  return { data, loading, error, refetch: load };
}

export function useDashboardSummary(tahunAjaranId) {
  const [summary, setSummary] = useState(null);
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!tahunAjaranId) return;
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        fetchSummary(tahunAjaranId),
        fetchMonthlyChart(tahunAjaranId),
      ]);
      setSummary(s);
      setChart(c);
    } catch (e) {
      console.error("Dashboard summary error:", e);
    } finally {
      setLoading(false);
    }
  }, [tahunAjaranId]);

  useEffect(() => { load(); }, [load]);

  // Realtime: refresh summary on tabungan changes
  useEffect(() => {
    if (!tahunAjaranId) return;
    const channel = supabase
      .channel("summary-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tabungan" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [tahunAjaranId, load]);

  return { summary, chart, loading, refetch: load };
}

export function useLaporan(tahunAjaranId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (filters = {}) => {
    if (!tahunAjaranId) return;
    setLoading(true);
    try {
      const rows = await fetchLaporan({ tahunAjaranId, ...filters });
      setData(rows);
    } catch (e) {
      console.error("Laporan error:", e);
    } finally {
      setLoading(false);
    }
  }, [tahunAjaranId]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, refetch: load };
}
