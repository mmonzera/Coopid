"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InvitationData {
  id: string;
  title: string;
  slug: string;
  groomName: string;
  brideName: string;
  date: string;
  location: string;
  time: string;
  story: string;
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontHeading: string;
    fontBody: string;
  };
  guests: { id: string; name: string; message: string | null }[];
  galleries: { id: string; imageUrl: string; caption: string }[];
  music: { url: string; title: string } | null;
}

export default function PublicInvitationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [attendance, setAttendance] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rsvpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/invitations/public/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setInvitation(data.invitation);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleRSVP = async (status: string) => {
    setAttendance(status);
    setSubmitting(true);
    await fetch(`/api/invitations/${invitation?.id}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: guestName,
        attendanceStatus: status,
        message,
      }),
    });
    setSubmitting(false);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-pink-200 rounded-full" />
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center animate-fade-in">
          <div className="text-7xl mb-6">😢</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Undangan Tidak Ditemukan
          </h1>
          <p className="text-gray-500 mt-2">
            Mungkin link ini sudah tidak tersedia.
          </p>
        </div>
      </div>
    );
  }

  const app = invitation.appearance || {
    primaryColor: "#d946ef",
    secondaryColor: "#c026d3",
    accentColor: "#fdf4ff",
    fontHeading: "Playfair Display",
    fontBody: "Inter",
  };

  // Cover Screen
  if (!isOpen) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${app.primaryColor}, ${app.secondaryColor})`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-white/20 rounded-full" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white/20 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white/30 rounded-full" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-lg mx-auto animate-fade-in">
          <div className="text-6xl mb-6 animate-float">💍</div>
          <p className="text-sm uppercase tracking-[0.3em] opacity-60 mb-4">
            The Wedding of
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
            style={{ fontFamily: app.fontHeading }}
          >
            {invitation.groomName}
            <br />
            <span className="text-2xl md:text-3xl opacity-60">&amp;</span>
            <br />
            {invitation.brideName}
          </h1>
          <div className="w-16 h-0.5 bg-white/40 mx-auto my-6" />
          <p className="text-lg opacity-80 mb-2">Kepada Yth.</p>
          <p className="text-xl md:text-2xl font-semibold mb-10">{guestName}</p>
          <button
            onClick={handleOpen}
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-3.5 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Buka Undangan
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const guestMessages = invitation.guests.filter((g) => g.message);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: app.accentColor,
        fontFamily: app.fontBody,
      }}
    >
      {/* Floating Music Button */}
      {invitation.music && (
        <>
          <audio ref={audioRef} src={invitation.music.url} loop />
          <button
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center z-50 hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">{isPlaying ? "🔊" : "🔇"}</span>
          </button>
        </>
      )}

      {/* Hero Section */}
      <div
        className="py-24 px-6 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${app.primaryColor}, ${app.secondaryColor})`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="text-5xl mb-4">💍</div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/60 mb-3">
            The Wedding of
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
            style={{ fontFamily: app.fontHeading }}
          >
            {invitation.groomName}
            <span className="text-white/50 mx-3">&amp;</span>
            {invitation.brideName}
          </h1>
          <p className="text-white/70 text-sm mt-4">{invitation.title}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-6 py-16 space-y-10">
        {/* Salam Pembuka */}
        <div className="text-center animate-fade-in">
          <p className="text-gray-600 leading-relaxed">
            Assalamualaikum Warahmatullahi Wabarakatuh
          </p>
          <div className="w-12 h-0.5 bg-pink-300 mx-auto my-4" />
          <p className="text-gray-500 text-sm leading-relaxed">
            Maha Suci Allah yang telah menciptakan makhluk-Nya
            berpasang-pasangan. Dengan memohon rahmat dan ridho Allah SWT, kami
            bermaksud menyelenggarakan acara pernikahan kami:
          </p>
        </div>

        {/* Couple Names */}
        <div className="text-center animate-fade-in-up">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: app.fontHeading, color: app.primaryColor }}
          >
            {invitation.groomName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Putra dari Bapak ..... & Ibu .....
          </p>
          <div className="text-2xl my-4 text-gray-300">&amp;</div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: app.fontHeading, color: app.primaryColor }}
          >
            {invitation.brideName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Putri dari Bapak ..... & Ibu .....
          </p>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-3xl shadow-lg shadow-pink-100/50 p-8 text-center space-y-6 animate-fade-in-up">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: app.fontHeading, color: app.primaryColor }}
          >
            🕊️ Akad & Resepsi
          </h2>

          <div className="space-y-4">
            {invitation.date && (
              <div className="p-4 bg-pink-50/50 rounded-2xl">
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                  Hari & Tanggal
                </div>
                <div className="font-semibold text-gray-900">
                  {formatDate(invitation.date)}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {invitation.time && (
                <div className="p-4 bg-purple-50/50 rounded-2xl">
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                    Waktu
                  </div>
                  <div className="font-semibold text-gray-900">
                    {invitation.time}
                  </div>
                </div>
              )}
              {invitation.location && (
                <div className="p-4 bg-amber-50/50 rounded-2xl">
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                    Lokasi
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {invitation.location}
                  </div>
                </div>
              )}
            </div>
          </div>

          {invitation.story && (
            <div className="border-t border-gray-100 pt-6">
              <p className="text-gray-600 italic leading-relaxed text-sm">
                "{invitation.story}"
              </p>
            </div>
          )}
        </div>

        {/* Gallery */}
        {invitation.galleries && invitation.galleries.length > 0 && (
          <div className="animate-fade-in-up">
            <h2
              className="text-xl font-bold text-center mb-6"
              style={{ fontFamily: app.fontHeading, color: app.primaryColor }}
            >
              📸 Galeri Foto
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {invitation.galleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <img
                    src={gallery.imageUrl}
                    alt={gallery.caption || "Foto"}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {gallery.caption && (
                    <div className="p-2.5 text-xs text-gray-500 bg-white text-center">
                      {gallery.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RSVP Section */}
        <div
          ref={rsvpRef}
          className="bg-white rounded-3xl shadow-lg shadow-pink-100/50 p-8 animate-fade-in-up"
        >
          <h2
            className="text-xl font-bold text-center mb-6"
            style={{ fontFamily: app.fontHeading, color: app.primaryColor }}
          >
            ✅ Konfirmasi Kehadiran
          </h2>

          {!attendance ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💌</span>
                </div>
                <p className="text-gray-700 font-medium">
                  Hai, <strong>{guestName}</strong>!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Apakah Anda dapat menghadiri acara pernikahan kami?
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleRSVP("accepted")}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-200 h-12"
                >
                  👍 Ya, Saya Hadir
                </Button>
                <Button
                  onClick={() => handleRSVP("declined")}
                  disabled={submitting}
                  variant="outline"
                  className="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  👎 Maaf, Tidak Bisa
                </Button>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ucapan & Doa untuk Mempelai
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis ucapan selamat dan doa terbaik..."
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 animate-scale-in">
              <div className="text-5xl mb-4">
                {attendance === "accepted" ? "🎉" : "😊"}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Terima kasih, {guestName}!
              </h3>
              <p className="text-gray-500">
                {attendance === "accepted"
                  ? "Kami tunggu kehadirannya di acara pernikahan!"
                  : "Doa terbaik dari Anda sangat berarti untuk kami."}
              </p>
            </div>
          )}
        </div>

        {/* Digital Guestbook */}
        <div className="bg-white rounded-3xl shadow-lg shadow-pink-100/50 p-8 animate-fade-in-up">
          <h2
            className="text-xl font-bold text-center mb-6"
            style={{ fontFamily: app.fontHeading, color: app.primaryColor }}
          >
            💌 Buku Tamu Digital
          </h2>
          {guestMessages.length > 0 ? (
            <div className="space-y-4">
              {guestMessages
                .slice(-10)
                .reverse()
                .map((guest, i) => (
                  <div
                    key={guest.id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {guest.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-medium text-sm text-gray-900">
                        {guest.name}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic ml-10">
                      "{guest.message}"
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📖</div>
              <p className="text-gray-400 text-sm">
                Belum ada ucapan. Jadilah yang pertama memberikan doa & ucapan!
              </p>
            </div>
          )}
        </div>

        {/* Closing */}
        <div className="text-center py-8 animate-fade-in">
          <p className="text-gray-500 text-sm leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan apabila
            Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
          <div className="w-12 h-0.5 bg-pink-300 mx-auto my-6" />
          <p className="text-gray-600 font-medium">
            Wassalamualaikum Warahmatullahi Wabarakatuh
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-600 rounded-md flex items-center justify-center text-white text-[8px] font-bold">
              C
            </div>
            <span className="text-xs font-semibold text-gray-400">Coopid</span>
          </div>
          <p className="text-xs text-gray-400">
            💝 Undangan Digital • Doa restu Anda sangat berarti
          </p>
        </div>
      </div>
    </div>
  );
}
