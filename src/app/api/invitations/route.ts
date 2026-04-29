import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/userId=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invitations = await prisma.invitation.findMany({
    where: { userId },
    include: { _count: { select: { guests: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ invitations });
}

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug =
      body.slug ||
      `inv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const invitation = await prisma.invitation.create({
      data: {
        title: body.title || "Undangan Pernikahan",
        groomName: body.groomName || "",
        brideName: body.brideName || "",
        date: body.date ? new Date(body.date) : null,
        location: body.location || "",
        time: body.time || "",
        slug,
        userId,
        appearance: JSON.stringify(
          body.appearance || {
            primaryColor: "#d946ef",
            secondaryColor: "#c026d3",
            accentColor: "#fdf4ff",
            fontHeading: "Playfair Display",
            fontBody: "Inter",
          },
        ),
        content: JSON.stringify(body.content || {}),
      },
    });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error("Create invitation error:", error);
    return NextResponse.json(
      { error: "Gagal membuat undangan" },
      { status: 500 },
    );
  }
}
