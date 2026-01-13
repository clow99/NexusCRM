import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createDealSchema = z.object({
  title: z.string().min(1),
  clientId: z.string().uuid(),
  value: z.number().nonnegative().default(0),
  currency: z.string().default("USD"),
  stage: z.enum(["prospect", "proposal", "negotiation", "won", "lost"]).default("prospect"),
  probability: z.number().min(0).max(100).default(0),
  expectedCloseDate: z.string().optional().transform(str => str ? new Date(str) : null),
});

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const deals = await prisma.deal.findMany({
    where: { userId: session.user.id },
    include: { client: { select: { id: true, name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(deals);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const validatedData = createDealSchema.parse(body);

    const deal = await prisma.deal.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
