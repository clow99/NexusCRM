import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DealsBoard from "./DealsBoard";

async function getDeals() {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  const deals = await prisma.deal.findMany({
    where: { userId: session.user.id },
    include: { client: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return deals;
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline</h1>
        </div>
        <DealsBoard initialDeals={deals} />
    </div>
  );
}
