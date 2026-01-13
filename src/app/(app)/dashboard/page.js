import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Users, Briefcase, CheckSquare } from "lucide-react";

async function getStats() {
  const session = await getServerSession(authOptions);
  if (!session) return { clientsCount: 0, activeDealsCount: 0, openTasksCount: 0, recentActivity: [] };

  const userId = session.user.id;

  const [clientsCount, activeDealsCount, openTasksCount, recentClients] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.deal.count({ where: { userId, stage: { notIn: ["won", "lost"] } } }),
    prisma.task.count({ where: { userId, status: "open" } }),
    prisma.client.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 5 })
  ]);

  return { clientsCount, activeDealsCount, openTasksCount, recentClients };
}

export default async function DashboardPage() {
  const { clientsCount, activeDealsCount, openTasksCount, recentClients } = await getStats();
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {session?.user?.name}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Here's what's happening today.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mr-4">
                <Users className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{clientsCount}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 mr-4">
                <Briefcase className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeDealsCount}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 mr-4">
                <CheckSquare className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Open Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{openTasksCount}</p>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Clients</h3>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentClients.map(client => (
                  <li key={client.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <Link href={`/clients/${client.id}`} className="flex justify-between items-center">
                          <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{client.email}</p>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {client.status}
                          </span>
                      </Link>
                  </li>
              ))}
              {recentClients.length === 0 && <li className="px-6 py-4 text-gray-500 italic">No clients yet.</li>}
          </ul>
      </div>
    </div>
  )
}
