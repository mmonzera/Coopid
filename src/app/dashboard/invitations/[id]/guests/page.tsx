"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Users, UserPlus, CheckCircle2, XCircle, Clock, Upload, ArrowLeft, MessageSquare, Copy, Send, Save } from "lucide-react";
import Link from "next/link";

interface Guest {
  id: string;
  name: string;
  phone: string;
  attendanceStatus: string;
  message: string;
}

export default function GuestsPage() {
  const params = useParams();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGuest, setNewGuest] = useState({ name: "", phone: "" });
  const [bulkText, setBulkText] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [invitationContent, setInvitationContent] = useState<any>({});
  const [slug, setSlug] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("Halo [Nama],\n\nKami mengundang Anda untuk hadir di pernikahan kami. Silakan klik link berikut untuk melihat detail undangan:\n\n[Link]\n\nTerima kasih!");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  const loadGuests = async () => {
    const res = await fetch(`/api/invitations/${params.id}`);
    const data = await res.json();
    setGuests(data.invitation?.guests || []);
    setSlug(data.invitation?.slug || "");
    const content = data.invitation?.content || {};
    setInvitationContent(content);
    if (content.messageTemplate) {
      setMessageTemplate(content.messageTemplate);
    }
    setLoading(false);
  };

  const saveTemplate = async () => {
    setIsSavingTemplate(true);
    await fetch(`/api/invitations/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: {
          ...invitationContent,
          messageTemplate
        }
      })
    });
    setIsSavingTemplate(false);
  };

  useEffect(() => {
    loadGuests();
  }, [params.id]);

  const addGuest = async () => {
    if (!newGuest.name) return;
    const res = await fetch(`/api/invitations/${params.id}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGuest),
    });
    if (res.ok) {
      setNewGuest({ name: "", phone: "" });
      loadGuests();
    }
  };

  const bulkImport = async () => {
    const names = bulkText
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    if (names.length === 0) return;

    for (const name of names) {
      await fetch(`/api/invitations/${params.id}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    }
    setBulkText("");
    setShowBulk(false);
    loadGuests();
  };

  const generateLink = (guestName: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/invitation/${slug}?to=${encodeURIComponent(guestName)}`;
  };

  const generateMessage = (guest: Guest) => {
    const link = generateLink(guest.name);
    return messageTemplate.replace(/\[Nama\]/g, guest.name).replace(/\[Link\]/g, link);
  };

  const handleCopy = (guest: Guest) => {
    const message = generateMessage(guest);
    navigator.clipboard.writeText(message);
    alert("Pesan berhasil disalin!");
  };

  const handleSendWA = (guest: Guest) => {
    if (!guest.phone) {
      alert("Tamu ini belum memiliki nomor WhatsApp.");
      return;
    }
    const message = generateMessage(guest);
    let phone = guest.phone.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.substring(1);
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-pink-200 rounded-full" />
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
      </div>
    );
  }

  const pendingGuests = guests.filter((g) => g.attendanceStatus === "pending");
  const acceptedGuests = guests.filter(
    (g) => g.attendanceStatus === "accepted",
  );
  const declinedGuests = guests.filter(
    (g) => g.attendanceStatus === "declined",
  );

  return (
    <div className="max-w-5xl mx-auto w-full px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 border border-gray-100 shadow-sm transition-all hover:scale-105">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buku Tamu & RSVP</h1>
            <p className="text-gray-500 mt-1">Kelola undangan dan konfirmasi kehadiran tamu Anda</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            label: "Menunggu",
            value: pendingGuests.length,
            icon: <Clock size={24} className="text-amber-500" />,
            color: "text-amber-600",
            bg: "bg-gradient-to-br from-amber-50 to-white",
            border: "border-amber-100",
          },
          {
            label: "Hadir",
            value: acceptedGuests.length,
            icon: <CheckCircle2 size={24} className="text-emerald-500" />,
            color: "text-emerald-600",
            bg: "bg-gradient-to-br from-emerald-50 to-white",
            border: "border-emerald-100",
          },
          {
            label: "Tidak Hadir",
            value: declinedGuests.length,
            icon: <XCircle size={24} className="text-red-500" />,
            color: "text-red-600",
            bg: "bg-gradient-to-br from-red-50 to-white",
            border: "border-red-100",
          },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div className="relative z-10">
              <div className={`text-4xl font-black ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </div>
            <div className="absolute -bottom-4 -right-4 text-white opacity-[0.4] scale-150 transform group-hover:scale-125 transition-transform duration-700">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Add Guest & Bulk */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tambah Tamu Baru</h2>
            <p className="text-sm text-gray-500 mb-6">Tambahkan secara manual atau import dari daftar nama.</p>
            
            <div className="space-y-4">
              <div>
                <input
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  placeholder="Nama lengkap tamu"
                  className="w-full h-12 bg-gray-50/50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>
              <div>
                <input
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  placeholder="No. WhatsApp (Opsional)"
                  className="w-full h-12 bg-gray-50/50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>
              <button 
                onClick={addGuest} 
                disabled={!newGuest.name}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl"
              >
                <UserPlus size={18} /> Tambahkan Tamu
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
              <button
                onClick={() => setShowBulk(!showBulk)}
                className="w-full h-12 bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Upload size={18} /> Import Massal
              </button>

              {showBulk && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-xs text-gray-500 mb-3 font-medium">Masukkan satu nama per baris:</p>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    className="w-full h-32 rounded-xl border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none"
                    placeholder="Budi Santoso&#10;Keluarga Andi"
                  />
                  <button
                    onClick={bulkImport}
                    disabled={!bulkText.trim()}
                    className="w-full mt-3 h-10 bg-gradient-primary disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Import {bulkText.split("\n").filter((n) => n.trim()).length} Tamu
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                className="w-full h-12 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare size={18} /> Template Pesan
              </button>

              {showTemplateEditor && (
                <div className="mt-2 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Custom Template</p>
                    <button 
                      onClick={saveTemplate}
                      disabled={isSavingTemplate}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1 hover:text-indigo-800 disabled:opacity-50"
                    >
                      {isSavingTemplate ? "Saving..." : <><Save size={12} /> Save</>}
                    </button>
                  </div>
                  <textarea
                    value={messageTemplate}
                    onChange={(e) => setMessageTemplate(e.target.value)}
                    className="w-full h-40 rounded-xl border border-indigo-100 bg-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-medium leading-relaxed"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-[9px] text-indigo-400 font-bold">Variabel tersedia:</p>
                    <div className="flex gap-2">
                      <span className="px-1.5 py-0.5 bg-indigo-100 rounded text-[9px] font-black text-indigo-600">[Nama]</span>
                      <span className="px-1.5 py-0.5 bg-indigo-100 rounded text-[9px] font-black text-indigo-600">[Link]</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Guest List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-pink-500">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Daftar Semua Tamu</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{guests.length} Undangan Terdaftar</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {guests.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4 border border-gray-100">
                    👥
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Belum ada tamu</h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-[200px]">Mulai tambahkan daftar tamu Anda melalui form di samping.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {guests.map((guest) => (
                    <div key={guest.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between group rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-[1rem] flex items-center justify-center text-lg font-black text-pink-600 shadow-sm border border-white">
                          {guest.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                            {guest.name}
                          </div>
                          {guest.phone ? (
                            <div className="text-xs text-gray-500 font-medium">
                              {guest.phone}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 italic">
                              Tidak ada No. WA
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="hidden group-hover:flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-300">
                          <button
                            onClick={() => handleCopy(guest)}
                            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            title="Salin Pesan"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => handleSendWA(guest)}
                            className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 hover:shadow-sm transition-all"
                            title="Kirim via WhatsApp"
                          >
                            <Send size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          {guest.message && (
                            <div className="hidden md:block max-w-[150px]">
                              <p className="text-xs text-gray-500 italic truncate border-l-2 border-gray-200 pl-3">"{guest.message}"</p>
                            </div>
                          )}
                          
                          <div>
                            {guest.attendanceStatus === "accepted" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold shadow-sm">
                                <CheckCircle2 size={14} /> Hadir
                              </span>
                            ) : guest.attendanceStatus === "declined" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-100 font-bold shadow-sm">
                                <XCircle size={14} /> Tidak Hadir
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 font-bold shadow-sm">
                                <Clock size={14} /> Menunggu
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
