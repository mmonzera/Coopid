import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/userId=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: {
      guests: true,
      galleries: { orderBy: { order: "asc" } },
      music: true,
    },
  });

  if (!invitation) {
    return NextResponse.json(
      { error: "Undangan tidak ditemukan" },
      { status: 404 },
    );
  }

  // Parse JSON strings for SQLite compatibility
  const parsed = {
    ...invitation,
    appearance:
      typeof invitation.appearance === "string"
        ? JSON.parse(invitation.appearance)
        : invitation.appearance,
    content:
      typeof invitation.content === "string"
        ? JSON.parse(invitation.content)
        : invitation.content,
  };

  return NextResponse.json({ invitation: parsed });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const invitation = await prisma.invitation.update({
      where: { id },
      data: {
        title: body.title,
        groomName: body.groomName,
        brideName: body.brideName,
        date: body.date ? new Date(body.date) : undefined,
        location: body.location,
        time: body.time,
        appearance:
          typeof body.appearance === "object"
            ? JSON.stringify(body.appearance)
            : body.appearance,
        content:
          typeof body.content === "object"
            ? JSON.stringify(body.content)
            : body.content,
        status: body.status,
        isMusicEnabled: body.isMusicEnabled,
      },
    });

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("Update invitation error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui undangan" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.invitation.delete({ where: { id } });
    return NextResponse.json({ message: "Undangan berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus undangan" },
      { status: 500 },
    );
  }
}
