"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

  const loadGuests = async () => {
    const res = await fetch(`/api/invitations/${params.id}`);
    const data = await res.json();
    setGuests(data.invitation?.guests || []);
    setLoading(false);
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

  const pendingGuests = guests.filter((g) => g.attendanceStatus === "pending");
  const acceptedGuests = guests.filter(
    (g) => g.attendanceStatus === "accepted",
  );
  const declinedGuests = guests.filter(
    (g) => g.attendanceStatus === "declined",
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Tamu</h1>
        <p className="text-gray-500 mt-1">Kelola daftar tamu undangan Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Menunggu",
            value: pendingGuests.length,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-200",
          },
          {
            label: "Hadir",
            value: acceptedGuests.length,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
          },
          {
            label: "Tidak Hadir",
            value: declinedGuests.length,
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-200",
          },
        ].map((stat) => (
          <Card key={stat.label} className={stat.bg}>
            <CardContent className="p-5 text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Single Guest */}
      <Card>
        <CardHeader>
          <CardTitle>Tambah Tamu</CardTitle>
          <CardDescription>
            Tambahkan tamu satu per satu ke undangan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={newGuest.name}
                onChange={(e) =>
                  setNewGuest((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nama tamu"
              />
            </div>
            <div className="flex-1">
              <Input
                value={newGuest.phone}
                onChange={(e) =>
                  setNewGuest((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="No. WhatsApp (opsional)"
              />
            </div>
            <Button onClick={addGuest} disabled={!newGuest.name}>
              Tambah
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Import Toggle */}
      <div>
        <button
          onClick={() => setShowBulk(!showBulk)}
          className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1 transition-colors"
        >
          {showBulk ? "▼" : "▶"} Import massal dari daftar nama
        </button>

        {showBulk && (
          <Card className="mt-3 animate-scale-in">
            <CardHeader>
              <CardTitle>Import Massal</CardTitle>
              <CardDescription>
                Masukkan nama tamu, satu nama per baris
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="w-full min-h-[120px] rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:bg-white transition-all resize-none"
                placeholder={`Nama Tamu 1\nNama Tamu 2\nNama Tamu 3`}
              />
              <Button
                onClick={bulkImport}
                disabled={!bulkText.trim()}
                className="mt-3"
              >
                Import {bulkText.split("\n").filter((n) => n.trim()).length}{" "}
                Tamu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Guest List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Daftar Tamu{" "}
            <span className="text-sm font-normal text-gray-400">
              ({guests.length} tamu)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {guests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-gray-500">
                Belum ada tamu. Tambahkan tamu di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-pink-600">
                      {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {guest.name}
                      </div>
                      {guest.phone && (
                        <div className="text-sm text-gray-500">
                          {guest.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {guest.attendanceStatus === "accepted" ? (
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        ✅ Hadir
                      </span>
                    ) : guest.attendanceStatus === "declined" ? (
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                        ❌ Tidak Hadir
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 font-medium">
                        ⏳ Menunggu
                      </span>
                    )}
                    {guest.message && (
                      <span className="text-sm text-gray-400 italic max-w-[150px] truncate hidden sm:block">
                        "{guest.message}"
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
