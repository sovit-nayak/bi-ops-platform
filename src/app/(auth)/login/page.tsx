"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/overview");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">

      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="5" y1="4" x2="5" y2="14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="13" y1="4" x2="13" y2="14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="5" y1="9" x2="13" y2="9" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="5" cy="4" r="1.5" fill="white"/>
                <circle cx="13" cy="4" r="1.5" fill="white"/>
                <circle cx="5" cy="14" r="1.5" fill="white"/>
                <circle cx="13" cy="14" r="1.5" fill="white"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">Helm</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your Helm account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8">

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 hover:border-white/[0.12] transition-all focus-within:border-orange-500/40">
                <Mail className="w-4 h-4 text-gray-600 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="bg-transparent text-sm text-white placeholder-gray-600 outline-none w-full"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 hover:border-white/[0.12] transition-all focus-within:border-orange-500/40">
                <Lock className="w-4 h-4 text-gray-600 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-transparent text-sm text-white placeholder-gray-600 outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Demo access */}
          <Link
            href="/overview"
            className="w-full flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.12] text-gray-300 font-medium py-2.5 rounded-xl transition-all text-sm"
          >
            View demo without signing in
          </Link>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-orange-400 hover:text-orange-300 transition-colors">
            Sign up free
          </Link>
        </p>

      </div>
    </div>
  );
}