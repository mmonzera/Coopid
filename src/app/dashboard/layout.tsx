import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-sm font-bold group-hover:shadow-glow transition-all duration-300">
                C
              </div>
              <span className="font-bold text-xl text-gray-900">Coopid</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/invitations/new"
                className="bg-gradient-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:shadow-glow transition-all duration-300 inline-flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Undangan Baru
              </Link>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Keluar
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
