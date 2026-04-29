"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  useEffect(() => {
    fetch("/api/invitations")
      .then((res) => res.json())
      .then((data) => {
        setInvitations(data.invitations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Kelola undangan pernikahan Anda</p>
        </div>
        <Link
          href="/dashboard/invitations/new"
          className="bg-gradient-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:shadow-glow transition-all duration-300 inline-flex items-center gap-2 btn-shimmer"
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
      </div>

      {/* Stats Cards */}
      {invitations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Undangan",
              value: invitations.length,
              icon: "💌",
              color: "from-pink-500 to-purple-600",
            },
            {
              label: "Total Tamu",
              value: totalGuests,
              icon: "👥",
              color: "from-purple-500 to-indigo-600",
            },
            {
              label: "RSVP Hadir",
              value: "—",
              icon: "✅",
              color: "from-emerald-500 to-teal-600",
            },
            {
              label: "Menunggu",
              value: "—",
              icon: "⏳",
              color: "from-amber-500 to-orange-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-soft transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <div
                  className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg opacity-20`}
                />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Invitations Grid or Empty State */}
      {invitations.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv, idx) => (
            <div
              key={inv.id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-500 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Card Cover */}
              <div className="h-40 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg truncate">
                    {inv.title}
                  </h3>
                  <p className="text-white/80 text-sm truncate">
                    {inv.groomName} & {inv.brideName}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    👥 {inv._count.guests} tamu
                  </span>
                  <span className="flex items-center gap-1">
                    📅{" "}
                    {new Date(inv.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/invitations/${inv.id}/edit`}
                    className="flex-1 text-center bg-gradient-primary text-white py-2.5 rounded-xl text-sm font-medium hover:shadow-glow transition-all duration-300"
                  >
                    Edit Undangan
                  </Link>
                  <Link
                    href={`/invitation/${inv.slug}`}
                    target="_blank"
                    className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:border-pink-200 hover:text-pink-600 transition-all duration-300"
                  >
                    Lihat
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
