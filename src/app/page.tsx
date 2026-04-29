import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-sm font-bold group-hover:shadow-glow transition-all duration-300">
                C
              </div>
              <span className="font-bold text-xl text-gray-900">Coopid</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 text-sm font-medium"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-gradient-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:shadow-glow transition-all duration-300 btn-shimmer"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-100/40 to-purple-100/40 rounded-full blur-3xl" />
        </div>

        {/* Floating decorations */}
        <div className="absolute top-32 left-[15%] text-2xl animate-float opacity-20">
          💍
        </div>
        <div
          className="absolute top-48 right-[20%] text-3xl animate-float opacity-20"
          style={{ animationDelay: "1s" }}
        >
          💝
        </div>
        <div
          className="absolute bottom-48 left-[10%] text-2xl animate-float opacity-20"
          style={{ animationDelay: "2s" }}
        >
          ✨
        </div>
        <div
          className="absolute top-1/3 right-[30%] text-xl animate-float opacity-20"
          style={{ animationDelay: "0.5s" }}
        >
          🕊️
        </div>
        <div
          className="absolute bottom-1/3 right-[15%] text-2xl animate-float opacity-20"
          style={{ animationDelay: "1.5s" }}
        >
          💐
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 border border-pink-200 rounded-full text-sm font-medium text-pink-600 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              Undangan Digital Modern untuk Momen Istimewa
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Buat Undangan
              <br />
              <span className="text-gradient">Pernikahan Impian</span>
              <br />
              Dalam Hitungan Menit
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Buat, kustomisasi, dan bagikan undangan pernikahan digital yang
              memukau dengan mudah. Dilengkapi RSVP online, galeri foto
              interaktif, dan musik latar yang romantis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-gradient-primary text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:shadow-glow-lg transition-all duration-300 btn-shimmer inline-flex items-center gap-2"
              >
                Mulai Buat Gratis
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900 border border-gray-200 px-8 py-3.5 rounded-full text-lg font-medium hover:border-pink-200 hover:shadow-soft transition-all duration-300"
              >
                Lihat Fitur
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 pt-12 border-t border-gray-100">
              {[
                { value: "500+", label: "Undangan Dibuat" },
                { value: "10rb+", label: "Tamu Terundang" },
                { value: "⭐ 4.9", label: "Rating Pengguna" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center animate-fade-in-up animate-delay-${(i + 1) * 100}`}
                >
                  <div className="text-2xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 px-4 bg-gradient-to-b from-white to-pink-50/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full text-sm font-medium text-purple-600 mb-4">
              ✨ Fitur Unggulan
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dari desain hingga undangan terkirim, semua dalam satu platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎨",
                title: "Visual Editor",
                desc: "Kustomisasi warna, font, dan layout dengan preview instan yang responsif",
                gradient: "from-pink-500 to-rose-500",
                delay: 0,
              },
              {
                icon: "👥",
                title: "Manajemen Tamu",
                desc: "Kelola daftar tamu dengan RSVP online, import massal, dan guestbook digital",
                gradient: "from-purple-500 to-violet-500",
                delay: 100,
              },
              {
                icon: "🎵",
                title: "Media & Musik",
                desc: "Upload foto galeri, video background, dan musik latar favorit Anda",
                gradient: "from-blue-500 to-cyan-500",
                delay: 200,
              },
              {
                icon: "🔗",
                title: "Link Personalisasi",
                desc: "Bagikan link unik dengan sapaan personal untuk setiap tamu undangan",
                gradient: "from-emerald-500 to-teal-500",
                delay: 300,
              },
              {
                icon: "📊",
                title: "Dashboard Real-time",
                desc: "Pantau konfirmasi kehadiran dan pesan tamu secara langsung",
                gradient: "from-orange-500 to-amber-500",
                delay: 400,
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                desc: "Tampilan optimal di semua perangkat, dari HP hingga desktop",
                gradient: "from-indigo-500 to-purple-500",
                delay: 500,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                />
                <div className="relative">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 border border-pink-200 rounded-full text-sm font-medium text-pink-600 mb-4">
              🚀 Cara Kerja
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Mulai dalam 3 Langkah Mudah
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Buat undangan impian Anda tanpa ribet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "📝",
                title: "Buat Project",
                desc: "Daftar gratis dan buat project undangan baru dengan mengisi detail acara Anda",
                color: "from-pink-500 to-purple-600",
              },
              {
                step: "02",
                icon: "🎨",
                title: "Kustomisasi Desain",
                desc: "Pilih tema, atur warna dan font, upload foto & musik sesuai selera Anda",
                color: "from-purple-500 to-indigo-600",
              },
              {
                step: "03",
                icon: "💌",
                title: "Bagikan ke Tamu",
                desc: "Dapatkan link unik dan bagikan ke tamu undangan melalui WhatsApp atau media sosial",
                color: "from-indigo-500 to-blue-600",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center animate-fade-in-up p-8"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-pink-200/50`}
                >
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-gradient mb-2">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-4 bg-gradient-to-b from-pink-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-sm font-medium text-amber-600 mb-4">
            💬 Testimonial
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed mb-8">
            "Bikin undangan jadi super gampang! Desainnya cantik, tamu pada suka
            sama RSVP online-nya. Recommended banget buat calon pengantin! 💕"
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Andini & Rizky</div>
              <div className="text-sm text-gray-500">Pengantin Baru 🎊</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-pink-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Buat Undangan Impian?
          </h2>
          <p className="text-lg text-pink-100 mb-10 max-w-xl mx-auto">
            Gratis! Buat undangan digital pertama Anda sekarang dan buat momen
            pernikahan Anda semakin berkesan.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-3.5 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Mulai Sekarang
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">
              C
            </div>
            <span className="font-bold text-lg text-white">Coopid</span>
          </div>
          <p className="text-sm">
            © 2024 Coopid Wedding Invitation Builder. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <Link href="#" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Bantuan
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
