"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewInvitationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    groomName: "",
    brideName: "",
    date: "",
    time: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/dashboard/invitations/${data.invitation.id}/edit`);
    } else {
      alert("Gagal membuat undangan");
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-pink-200/50">
            ✨
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Undangan Baru</h1>
            <p className="text-gray-500 mt-1">
              Isi detail acara pernikahan Anda
            </p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
        <CardHeader>
          <CardTitle>Detail Acara</CardTitle>
          <CardDescription>
            Informasi utama undangan pernikahan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Undangan</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Mis: Undangan Pernikahan"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groomName">Nama Mempelai Pria</Label>
                <Input
                  id="groomName"
                  value={form.groomName}
                  onChange={(e) => updateField("groomName", e.target.value)}
                  placeholder="Ahmad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brideName">Nama Mempelai Wanita</Label>
                <Input
                  id="brideName"
                  value={form.brideName}
                  onChange={(e) => updateField("brideName", e.target.value)}
                  placeholder="Siti"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal Acara</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Waktu Acara</Label>
                <Input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => updateField("time", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi Acara</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="Nama Gedung / Alamat"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} size="lg">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan & Lanjutkan ke Editor"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push("/dashboard")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <div className="mt-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Tips</h3>
        <p className="text-sm text-gray-600">
          Jangan khawatir, semua informasi ini bisa diubah nanti di halaman
          editor setelah undangan dibuat.
        </p>
      </div>
    </div>
  );
}
