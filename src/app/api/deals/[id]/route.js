import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  
  try {
    const body = await request.json();
    const deal = await prisma.deal.update({
      where: { id, userId: session.user.id },
      data: body, 
    });
    return NextResponse.json(deal);
  } catch (error) {
     return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    await prisma.deal.delete({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true });
}
