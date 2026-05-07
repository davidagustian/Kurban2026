"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useTahunAjaran } from "@/hooks/useTahunAjaran";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import Dashboard from "@/_pages/Dashboard";
import InputTabungan from "@/_pages/InputTabungan";
import Laporan from "@/_pages/Laporan";
import Arsip from "@/_pages/Arsip";
import LoginPage from "@/_pages/auth/LoginPage";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  input: "Input Tabungan",
  laporan: "Laporan",
  arsip: "Arsip",
};

function AppShell() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const { active: tahunAjaran, list, setActive, loading: tahunLoading } = useTahunAjaran();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center gap-3 text-[#888780]">
        <i className="ti ti-loader-2 animate-spin text-2xl" />
        <span className="text-sm">Memuat aplikasi...</span>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const pages = { dashboard: Dashboard, input: InputTabungan, laporan: Laporan, arsip: Arsip };
  const PageComponent = pages[activePage];
  const pageProps = { tahunAjaranId: tahunAjaran?.id };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F6F2] font-sans">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-black/[0.09] px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-base font-semibold text-[#1a1a18]">{PAGE_TITLES[activePage]}</h1>
          <div className="flex items-center gap-3">
            {/* Tahun ajaran switcher */}
            {list.length > 0 && (
              <select
                value={tahunAjaran?.id ?? ""}
                onChange={(e) => setActive(list.find((t) => t.id === e.target.value))}
                className="text-xs px-2.5 py-1.5 rounded-md border border-black/[0.09] bg-[#EAF3DE] text-[#3B6D11] font-semibold outline-none cursor-pointer"
              >
                {list.map((t) => (
                  <option key={t.id} value={t.id}>{t.tahun}</option>
                ))}
              </select>
            )}
            <span className="text-xs text-[#5F5E5A] hidden sm:block truncate max-w-[160px]">{user.email}</span>
            <button
              onClick={signOut}
              title="Keluar"
              className="w-8 h-8 rounded-full bg-[#639922] flex items-center justify-center text-white hover:bg-[#3B6D11] transition-colors"
            >
              <i className="ti ti-logout text-sm" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
          {tahunLoading ? (
            <div className="flex items-center justify-center h-32 gap-2 text-[#888780] text-sm">
              <i className="ti ti-loader-2 animate-spin text-lg" /> Memuat tahun ajaran...
            </div>
          ) : !tahunAjaran ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-[#888780]">
              <i className="ti ti-calendar-off text-4xl" />
              <p className="text-sm">Belum ada tahun ajaran aktif.</p>
              <button
                onClick={() => setActivePage("arsip")}
                className="text-xs text-[#639922] font-semibold hover:underline"
              >
                Buat tahun ajaran baru →
              </button>
            </div>
          ) : (
            <PageComponent {...pageProps} />
          )}
        </main>
      </div>

      <MobileNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
