import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        guests: {
          select: { id: true, name: true, message: true },
        },
        galleries: {
          orderBy: { order: "asc" },
          select: { id: true, imageUrl: true, caption: true },
        },
        music: {
          select: { url: true, title: true },
        },
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
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
