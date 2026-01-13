import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ClientDetailView from "./ClientDetailView";

async function getClient(id) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const client = await prisma.client.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      deals: { orderBy: { updatedAt: "desc" } },
      tasks: { orderBy: { dueDate: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
    }
  });

  return client;
}

export default async function ClientPage({ params }) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  return <ClientDetailView client={client} />;
}
