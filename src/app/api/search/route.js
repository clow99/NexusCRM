import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
      return NextResponse.json({ clients: [], deals: [], tasks: [] });
  }

  const userId = session.user.id;

  const [clients, deals, tasks] = await Promise.all([
    prisma.client.findMany({
      where: {
        userId,
        OR: [
            { name: { contains: q } },
            { company: { contains: q } },
            { email: { contains: q } }
        ]
      },
      take: 5
    }),
    prisma.deal.findMany({
      where: {
        userId,
        title: { contains: q }
      },
      include: { client: { select: { name: true } } },
      take: 5
    }),
    prisma.task.findMany({
      where: {
        userId,
        title: { contains: q }
      },
      include: { client: { select: { name: true } } },
      take: 5
    })
  ]);

  return NextResponse.json({ clients, deals, tasks });
}
