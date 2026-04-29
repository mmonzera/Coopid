import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, phone } = await request.json();
    const guest = await prisma.guest.create({
      data: {
        name,
        phone: phone || null,
        invitationId: params.id,
      },
    });
    return NextResponse.json({ guest }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menambah tamu" },
      { status: 500 }
    );
  }
}
