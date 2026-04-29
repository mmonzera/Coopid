"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white px-12">
          <div
            className="text-7xl mb-6 animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            💝
          </div>
          <h2 className="text-4xl font-bold mb-4">Mulai Perjalanan Anda</h2>
          <p className="text-lg text-pink-100 max-w-md">
            Buat undangan pernikahan digital impian Anda dalam hitungan menit
          </p>
          <div className="mt-12 space-y-4 text-left max-w-sm mx-auto">
            {[
              { icon: "✨", text: "Template premium & kustomisasi bebas" },
              { icon: "🔗", text: "Link personal untuk setiap tamu" },
              { icon: "📊", text: "Pantau RSVP secara real-time" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="w-full max-w-md animate-fade-in">
          <Link
            href="/"
            className="flex items-center gap-2.5 mb-10 justify-center lg:justify-start"
          >
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-sm font-bold">
              C
            </div>
            <span className="font-bold text-xl">Coopid</span>
          </Link>

          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 lg:p-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Buat Akun Baru
            </h1>
            <p className="text-gray-500 mb-8">
              Gratis! Mulai buat undangan pernikahan impian Anda
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="Nama Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="nama@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary text-white py-3 rounded-xl font-medium hover:shadow-glow transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Daftar Gratis"}
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
