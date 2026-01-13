import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CheckSquare, Calendar, AlertCircle } from "lucide-react";

async function getTasks() {
  const session = await getServerSession(authOptions);
  if (!session) return { today: [], upcoming: [] };

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id, status: "open" },
    include: { client: { select: { name: true } } },
    orderBy: { dueDate: "asc" },
  });

  const dueTodayOrOverdue = tasks.filter(t => t.dueDate && t.dueDate <= today);
  const upcoming = tasks.filter(t => !t.dueDate || t.dueDate > today);

  return { today: dueTodayOrOverdue, upcoming };
}

export default async function TasksPage() {
  const { today, upcoming } = await getTasks();

  return (
    <div className="max-w-4xl">
       <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Add Task</button>
       </div>

       <div className="space-y-8">
            <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" /> Due Today & Overdue
                </h2>
                {today.length === 0 ? (
                    <p className="text-gray-500 italic">No urgent tasks.</p>
                ) : (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                        {today.map(task => (
                            <div key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <div className="flex items-center">
                                    <button className="w-5 h-5 border-2 border-gray-300 rounded mr-3 hover:border-indigo-500" />
                                    <div>
                                        <p className="text-gray-900 dark:text-white font-medium">{task.title}</p>
                                        {task.client && <p className="text-xs text-gray-500">{task.client.name}</p>}
                                    </div>
                                </div>
                                <div className="text-sm text-red-500 font-medium">
                                    {task.dueDate?.toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

             <section>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-indigo-500" /> Upcoming
                </h2>
                {upcoming.length === 0 ? (
                    <p className="text-gray-500 italic">No upcoming tasks.</p>
                ) : (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                         {upcoming.map(task => (
                            <div key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <div className="flex items-center">
                                    <button className="w-5 h-5 border-2 border-gray-300 rounded mr-3 hover:border-indigo-500" />
                                    <div>
                                        <p className="text-gray-900 dark:text-white font-medium">{task.title}</p>
                                        {task.client && <p className="text-xs text-gray-500">{task.client.name}</p>}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {task.dueDate ? task.dueDate.toLocaleDateString() : "No due date"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
       </div>
    </div>
  );
}
