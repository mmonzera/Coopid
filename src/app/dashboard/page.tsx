"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ExternalLink, CheckCircle2, Trash2, AlertTriangle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface Invitation {
  id: string;
  title: string;
  slug: string;
  groomName: string;
  brideName: string;
  createdAt: string;
  _count: { guests: number };
}

export default function DashboardPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState<Invitation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("success") === "saved") {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        // Clean up URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("success");
        router.replace(`/dashboard?${params.toString()}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  const fetchInvitations = () => {
    setLoading(true);
    fetch("/api/invitations")
      .then((res) => res.json())
      .then((data) => {
        setInvitations(data.invitations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleDelete = async () => {
    if (!invitationToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/invitations/${invitationToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInvitations(invitations.filter((i) => i.id !== invitationToDelete.id));
        setShowDeleteConfirm(false);
        setInvitationToDelete(null);
      } else {
        alert("Gagal menghapus undangan");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-pink-200 rounded-full" />
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
      </div>
    );
  }

  // Stats
  const totalGuests = invitations.reduce(
    (sum, inv) => sum + inv._count.guests,
    0,
  );

  return (
    <div className="w-full px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Kelola undangan pernikahan Anda</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {invitations.length > 0 && (
              <button
                onClick={() => setShowReport(true)}
                className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-50 hover:shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                📊 Lihat Laporan
              </button>
            )}
            {invitations.length > 0 && (
              <Link
                href="/dashboard/invitations/new"
                className="w-full sm:w-auto bg-gradient-primary text-white px-6 py-3 rounded-full text-sm font-bold hover:shadow-glow transition-all duration-300 inline-flex items-center justify-center gap-2 btn-shimmer"
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
                Buat Undangan Baru
              </Link>
            )}
          </div>
        </div>

        {/* Invitations Grid or Empty State */}
        {invitations.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl animate-float">💍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Belum Ada Undangan
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Mulai petualangan indah Anda! Buat undangan pernikahan digital
              pertama Anda sekarang.
            </p>
            <Link
              href="/dashboard/invitations/new"
              className="bg-gradient-primary text-white px-8 py-3.5 rounded-full font-medium hover:shadow-glow transition-all duration-300 inline-flex items-center gap-2"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Buat Undangan Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {invitations.map((inv, idx) => (
              <div
                key={inv.id}
                className="group bg-white rounded-[2rem] border border-gray-100 hover:border-pink-100 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-500 overflow-hidden animate-fade-in-up flex flex-col"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Card Cover */}
                <div className="h-44 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setInvitationToDelete(inv);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-8 h-8 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all duration-300"
                      title="Hapus Undangan"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-white font-black text-xl truncate mb-1">
                      {inv.title || "Undangan Baru"}
                    </h3>
                    <p className="text-white/90 text-sm font-medium truncate drop-shadow-sm">
                      {inv.groomName || "Groom"} & {inv.brideName || "Bride"}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-6 px-1">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      👥 <span className="text-gray-700">{inv._count.guests}</span> tamu
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      📅{" "}
                      <span className="text-gray-700">
                        {new Date(inv.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/invitations/${inv.id}/edit`}
                        className="flex-1 text-center bg-gradient-primary text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:shadow-glow transition-all duration-300"
                      >
                        Edit Design
                      </Link>
                      <Link
                        href={`/invitation/${inv.slug}`}
                        target="_blank"
                        className="w-12 flex items-center justify-center border border-gray-200 text-gray-500 rounded-xl hover:border-pink-200 hover:text-pink-600 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                        title="Lihat Website"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                    <Link
                      href={`/dashboard/invitations/${inv.id}/guests`}
                      className="w-full text-center bg-purple-50 text-purple-700 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-purple-100 transition-all duration-300 border border-purple-100/50"
                    >
                      Buku Tamu & RSVP
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 lg:p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
            <button 
              onClick={() => setShowReport(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2">Laporan Keseluruhan</h2>
            <p className="text-xs font-medium text-gray-500 mb-8">Ringkasan performa dan RSVP untuk semua undangan Anda.</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-purple-50/50 p-5 rounded-2xl border border-purple-100 hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-[1rem] flex items-center justify-center text-2xl shadow-inner border border-white">👥</div>
                  <span className="font-bold text-gray-800 text-sm">Total Tamu Diundang</span>
                </div>
                <span className="text-3xl font-black text-purple-600">{totalGuests}</span>
              </div>
              
              <div className="flex items-center justify-between bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-[1rem] flex items-center justify-center text-2xl shadow-inner border border-white">✅</div>
                  <span className="font-bold text-gray-800 text-sm">RSVP Hadir</span>
                </div>
                <span className="text-3xl font-black text-emerald-600">—</span>
              </div>
              
              <div className="flex items-center justify-between bg-amber-50/50 p-5 rounded-2xl border border-amber-100 hover:bg-amber-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-[1rem] flex items-center justify-center text-2xl shadow-inner border border-white">⏳</div>
                  <span className="font-bold text-gray-800 text-sm">Menunggu Konfirmasi</span>
                </div>
                <span className="text-3xl font-black text-amber-600">—</span>
              </div>
            </div>

            <button 
              onClick={() => setShowReport(false)}
              className="w-full mt-8 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
            >
              Tutup Laporan
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 mx-auto border-4 border-white shadow-inner">
              <AlertTriangle size={40} />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2">Hapus Undangan?</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed px-4">
              Tindakan ini tidak dapat dibatalkan. Seluruh data tamu dan desain untuk <span className="font-bold text-gray-900">"{invitationToDelete?.title}"</span> akan dihapus permanen.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="py-4 px-6 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="py-4 px-6 bg-red-600 text-white rounded-2xl text-sm font-bold hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Berhasil Disimpan!</p>
              <p className="text-[10px] text-gray-400 font-medium">Undangan pernikahan Anda telah diperbarui.</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
