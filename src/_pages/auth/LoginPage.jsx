"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await signIn(email, password);
    if (err) setError(err.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-[10px] border border-black/[0.09] shadow-sm p-8 w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg overflow-hidden">
          <Image src="public/assets/logo-kurban.svg" alt="Logo" width={36} height={36} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1a1a18] leading-tight">Kurban Savings</p>
            <p className="text-xs text-[#5F5E5A]">Manager</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-[#1a1a18] mb-1">Masuk ke Dashboard</h2>
        <p className="text-xs text-[#5F5E5A] mb-6">Gunakan akun admin yang telah didaftarkan</p>

        {error && (
          <div className="flex items-center gap-2 bg-[#FCEBEB] border border-[#F7C1C1] rounded-md px-3 py-2.5 mb-4 text-xs text-[#A32D2D]">
            <i className="ti ti-alert-circle text-sm" aria-hidden="true" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            id="email" label="Email" type="email" placeholder="admin@sekolah.sch.id"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password" label="Password" type="password" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          variant="primary"
          onClick={handleLogin}
          className={`w-full mt-6 justify-center ${loading ? "opacity-60 pointer-events-none" : ""}`}
        >
          {loading ? <><i className="ti ti-loader-2 animate-spin" /> Memuat...</> : <><i className="ti ti-login" /> Masuk</>}
        </Button>

        <p className="text-[11px] text-[#888780] text-center mt-4">
          Lupa password? Hubungi administrator sistem.
        </p>
      </div>
    </div>
  );
}
