"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const FONT_PAIRINGS = [
  { heading: "Playfair Display", body: "Inter", label: "Elegan Modern" },
  { heading: "Cormorant Garamond", body: "Inter", label: "Klasik" },
  { heading: "DM Serif Display", body: "DM Sans", label: "Romantis" },
  { heading: "Fraunces", body: "Inter", label: "Mewah" },
  { heading: "Montserrat", body: "Merriweather", label: "Formal" },
  { heading: "Lora", body: "Inter", label: "Natural" },
];

const COLOR_PRESETS = [
  {
    primary: "#d946ef",
    secondary: "#c026d3",
    accent: "#fdf4ff",
    label: "Pink",
  },
  {
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    accent: "#f5f3ff",
    label: "Ungu",
  },
  {
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#fffbeb",
    label: "Emas",
  },
  {
    primary: "#06b6d4",
    secondary: "#0891b2",
    accent: "#ecfeff",
    label: "Biru",
  },
  {
    primary: "#10b981",
    secondary: "#059669",
    accent: "#ecfdf5",
    label: "Hijau",
  },
  {
    primary: "#ef4444",
    secondary: "#dc2626",
    accent: "#fef2f2",
    label: "Merah",
  },
  {
    primary: "#ec4899",
    secondary: "#db2777",
    accent: "#fdf2f8",
    label: "Rose",
  },
  {
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#eef2ff",
    label: "Indigo",
  },
];

type TabId = "content" | "appearance" | "guests";

export default function EditInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const { appearance, content, setAppearance, setContent } = useEditorStore();
  const [activeTab, setActiveTab] = useState<TabId>("content");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");

  const loadInvitation = useCallback(async () => {
    const res = await fetch(`/api/invitations/${params.id}`);
    const data = await res.json();
    if (data.invitation) {
      const inv = data.invitation;
      setSlug(inv.slug);
      if (inv.appearance && typeof inv.appearance === "object") {
        setAppearance(inv.appearance);
      }
      if (inv.content && typeof inv.content === "object") {
        setContent(inv.content);
      }
      setContent({
        title: inv.title || "",
        groomName: inv.groomName || "",
        brideName: inv.brideName || "",
        date: inv.date ? new Date(inv.date).toISOString().split("T")[0] : "",
        location: inv.location || "",
        time: inv.time || "",
        story: inv.story || "",
      });
    }
    setLoading(false);
  }, [params.id, setAppearance, setContent]);

  useEffect(() => {
    loadInvitation();
  }, [loadInvitation]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/invitations/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...content, appearance, content }),
    });
    setSaving(false);
  };

  const handleFontPair = (pair: (typeof FONT_PAIRINGS)[0]) => {
    setAppearance({ fontHeading: pair.heading, fontBody: pair.body });
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

  const selectedFontPair = FONT_PAIRINGS.find(
    (f) =>
      f.heading === appearance.fontHeading && f.body === appearance.fontBody,
  );

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "content", label: "Konten", icon: "📝" },
    { id: "appearance", label: "Tampilan", icon: "🎨" },
    { id: "guests", label: "Tamu", icon: "👥" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel */}
      <div className="w-full lg:w-[420px] lg:min-w-[420px] flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-primary text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scroll">
          {/* Content Tab */}
          {activeTab === "content" && (
            <Card>
              <CardHeader>
                <CardTitle>📋 Detail Acara</CardTitle>
                <CardDescription>Informasi utama undangan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Judul Undangan</Label>
                  <Input
                    value={content.title || ""}
                    onChange={(e) => setContent({ title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Mempelai Pria</Label>
                    <Input
                      value={content.groomName || ""}
                      onChange={(e) =>
                        setContent({ groomName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mempelai Wanita</Label>
                    <Input
                      value={content.brideName || ""}
                      onChange={(e) =>
                        setContent({ brideName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Acara</Label>
                  <Input
                    type="date"
                    value={content.date || ""}
                    onChange={(e) => setContent({ date: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Waktu</Label>
                    <Input
                      type="time"
                      value={content.time || ""}
                      onChange={(e) => setContent({ time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lokasi</Label>
                    <Input
                      value={content.location || ""}
                      onChange={(e) => setContent({ location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cerita / Pesan</Label>
                  <Textarea
                    value={content.story || ""}
                    onChange={(e) => setContent({ story: e.target.value })}
                    placeholder="Tulis cerita atau pesan untuk tamu..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <>
              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>🎨 Palet Warna</CardTitle>
                  <CardDescription>Atur warna tema undangan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    {
                      label: "Warna Primer",
                      key: "primaryColor" as const,
                      value: appearance.primaryColor,
                    },
                    {
                      label: "Warna Sekunder",
                      key: "secondaryColor" as const,
                      value: appearance.secondaryColor,
                    },
                    {
                      label: "Warna Aksen (Background)",
                      key: "accentColor" as const,
                      value: appearance.accentColor,
                    },
                  ].map((color) => (
                    <div key={color.key}>
                      <Label className="mb-2 block">{color.label}</Label>
                      <div className="flex gap-3 items-center">
                        <div className="relative">
                          <input
                            type="color"
                            value={color.value}
                            onChange={(e) =>
                              setAppearance({ [color.key]: e.target.value })
                            }
                            className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer bg-white p-0.5"
                          />
                          <div
                            className="absolute inset-0.5 rounded-lg pointer-events-none"
                            style={{ backgroundColor: color.value }}
                          />
                        </div>
                        <Input
                          value={color.value}
                          onChange={(e) =>
                            setAppearance({ [color.key]: e.target.value })
                          }
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Presets */}
                  <div>
                    <Label className="mb-3 block">Preset Warna</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() =>
                            setAppearance({
                              primaryColor: preset.primary,
                              secondaryColor: preset.secondary,
                              accentColor: preset.accent,
                            })
                          }
                          className={`p-3 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md ${
                            appearance.primaryColor === preset.primary
                              ? "border-pink-300 bg-pink-50 shadow-sm"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                          title={preset.label}
                        >
                          <div className="flex gap-1 justify-center mb-1.5">
                            <div
                              className="w-5 h-5 rounded-full border border-white/50 shadow-sm"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div
                              className="w-5 h-5 rounded-full border border-white/50 shadow-sm"
                              style={{ backgroundColor: preset.secondary }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fonts */}
              <Card>
                <CardHeader>
                  <CardTitle>🔤 Pasangan Font</CardTitle>
                  <CardDescription>
                    Pilih kombinasi font untuk heading & body
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {FONT_PAIRINGS.map((pair) => (
                      <button
                        key={pair.label}
                        onClick={() => handleFontPair(pair)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedFontPair?.label === pair.label
                            ? "border-pink-300 bg-pink-50 shadow-sm"
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {pair.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              <span style={{ fontFamily: pair.heading }}>
                                {pair.heading}
                              </span>
                              {" + "}
                              <span style={{ fontFamily: pair.body }}>
                                {pair.body}
                              </span>
                            </div>
                          </div>
                          {selectedFontPair?.label === pair.label && (
                            <span className="text-pink-500 text-lg">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Guests Tab */}
          {activeTab === "guests" && (
            <Card>
              <CardHeader>
                <CardTitle>👥 Manajemen Tamu</CardTitle>
                <CardDescription>Kelola daftar tamu undangan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-500 text-sm leading-relaxed">
                  Kelola daftar tamu undangan Anda, lihat konfirmasi RSVP, dan
                  baca pesan dari buku tamu digital.
                </p>
                <Link href={`/dashboard/invitations/${params.id}/guests`}>
                  <Button variant="default" className="w-full">
                    <span className="flex items-center gap-2">
                      Buka Manajemen Tamu
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
            size="lg"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              <span className="flex items-center gap-2">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Simpan Perubahan
              </span>
            )}
          </Button>
          {slug && (
            <Link
              href={`/invitation/${slug}`}
              target="_blank"
              className="block text-center text-sm text-gray-500 hover:text-pink-600 mt-3 font-medium transition-colors"
            >
              👁️ Lihat undangan publik →
            </Link>
          )}
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              👁️ Preview Langsung
            </span>
          </div>
          <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
            {appearance.fontHeading} | {appearance.fontBody}
          </span>
        </div>
        <div className="h-full overflow-y-auto bg-gray-50">
          <div
            className="min-h-full flex items-start justify-center p-8"
            style={{ backgroundColor: appearance.accentColor }}
          >
            <div
              className="max-w-sm w-full bg-white shadow-xl rounded-3xl overflow-hidden animate-scale-in"
              style={{ fontFamily: appearance.fontBody }}
            >
              {/* Cover */}
              <div
                className="h-44 flex flex-col items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${appearance.primaryColor}, ${appearance.secondaryColor})`,
                }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-5 left-5 w-20 h-20 bg-white rounded-full blur-2xl" />
                  <div className="absolute bottom-5 right-5 w-32 h-32 bg-white rounded-full blur-2xl" />
                </div>
                <div className="text-4xl mb-2 relative z-10">💍</div>
                <div
                  className="text-xl font-bold text-white relative z-10 px-6 text-center"
                  style={{ fontFamily: appearance.fontHeading }}
                >
                  {content.title || "Undangan Pernikahan"}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 text-center space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                    The Wedding of
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: appearance.fontHeading,
                      color: appearance.primaryColor,
                    }}
                  >
                    {content.groomName || "_______"}
                    <span className="text-gray-300 mx-2">&amp;</span>
                    {content.brideName || "_______"}
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-5 space-y-3">
                  {content.date && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>📅</span>
                      <span>
                        {new Date(
                          content.date + "T00:00:00",
                        ).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    {content.time && (
                      <span className="flex items-center gap-1">
                        ⏰ {content.time}
                      </span>
                    )}
                    {content.location && (
                      <span className="flex items-center gap-1">
                        📍 {content.location}
                      </span>
                    )}
                  </div>
                </div>

                {content.story && (
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-sm text-gray-500 italic leading-relaxed">
                      "{content.story}"
                    </p>
                  </div>
                )}

                <button
                  className="text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${appearance.primaryColor}, ${appearance.secondaryColor})`,
                  }}
                >
                  Konfirmasi Kehadiran
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
