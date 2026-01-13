import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  status: z.enum(["lead", "active", "past"]).optional(),
});

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Next.js 15: params is async? Wait, no. Next 13+ app router params are standard objects. 
  // Wait, in Next 15 `params` might be a Promise?
  // User didn't specify version but the `create-next-app` used `@latest` (could be 15).
  // If Next 15, `params` should be awaited.
  // I will check package.json or assume Next 15 safe pattern: `const { id } = await params`.
  // To be safe and compatible with 15 (which is latest), I'll await params.
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      deals: true,
      tasks: true,
      notes: { orderBy: { createdAt: "desc" } },
    }
  });

  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  return NextResponse.json(client);
}

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const validatedData = updateClientSchema.parse(body);

    const client = await prisma.client.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: validatedData,
    });

    return NextResponse.json(client);
  } catch (error) {
    if (error.code === 'P2025') {
       return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.client.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
     if (error.code === 'P2025') {
       return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
