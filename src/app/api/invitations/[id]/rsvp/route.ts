import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, attendanceStatus, message } = await request.json();

    // Find existing guest or create new one
    const existingGuest = await prisma.guest.findFirst({
      where: { invitationId: params.id, name },
    });

    if (existingGuest) {
      const guest = await prisma.guest.update({
        where: { id: existingGuest.id },
        data: { attendanceStatus, message },
      });
      return NextResponse.json({ guest });
    }

    const guest = await prisma.guest.create({
      data: {
        name,
        attendanceStatus,
        message: message || null,
        invitationId: params.id,
      },
    });

    return NextResponse.json({ guest }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan RSVP" },
      { status: 500 }
    );
  }
}
