"use client";
import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Globe, Building, ArrowLeft, Plus } from "lucide-react";

export default function ClientDetailView({ client }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
       <div className="mb-6">
        <Link href="/clients" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Clients
        </Link>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2 space-x-4 text-sm flex-wrap gap-y-2">
                    {client.company && <span className="flex items-center mr-4"><Building className="w-4 h-4 mr-1"/> {client.company}</span>}
                    {client.email && <span className="flex items-center mr-4"><Mail className="w-4 h-4 mr-1"/> {client.email}</span>}
                    {client.phone && <span className="flex items-center mr-4"><Phone className="w-4 h-4 mr-1"/> {client.phone}</span>}
                    {client.website && <span className="flex items-center mr-4"><Globe className="w-4 h-4 mr-1"/> {client.website}</span>}
                </div>
            </div>
            <div className="flex space-x-2">
                 <button className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Edit Client</button>
            </div>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
            {["overview", "deals", "tasks", "notes"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                        activeTab === tab
                        ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </nav>
      </div>

      <div>
        {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Latest Activity</h3>
                        <p className="text-gray-500 dark:text-gray-400 italic">No recent activity recorded.</p>
                    </div>
                </div>
                 <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                             <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md flex items-center">
                                <Plus className="w-4 h-4 mr-2" /> Add Note
                             </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md flex items-center">
                                <Plus className="w-4 h-4 mr-2" /> Add Task
                             </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md flex items-center">
                                <Plus className="w-4 h-4 mr-2" /> Create Deal
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === "deals" && (
             <div className="space-y-4">
                 <div className="flex justify-between items-center">
                     <h3 className="text-lg font-medium text-gray-900 dark:text-white">Deals ({client.deals.length})</h3>
                      <button className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Add Deal</button>
                 </div>
                 {client.deals.length === 0 ? (
                     <p className="text-gray-500 dark:text-gray-400">No deals found.</p>
                 ) : (
                     <ul className="bg-white dark:bg-gray-800 shadow rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                         {client.deals.map(deal => (
                             <li key={deal.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                 <div className="flex justify-between">
                                     <span className="font-medium text-gray-900 dark:text-white">{deal.title}</span>
                                     <span className="text-gray-500 dark:text-gray-400">{deal.stage}</span>
                                 </div>
                             </li>
                         ))}
                     </ul>
                 )}
             </div>
        )}

         {activeTab === "tasks" && (
             <div className="space-y-4">
                 <div className="flex justify-between items-center">
                     <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tasks ({client.tasks.length})</h3>
                      <button className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Add Task</button>
                 </div>
                 {client.tasks.length === 0 ? (
                     <p className="text-gray-500 dark:text-gray-400">No tasks found.</p>
                 ) : (
                     <ul className="bg-white dark:bg-gray-800 shadow rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                         {client.tasks.map(task => (
                             <li key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                 <div className="flex justify-between">
                                     <span className="font-medium text-gray-900 dark:text-white">{task.title}</span>
                                     <span className="text-gray-500 dark:text-gray-400">{task.status}</span>
                                 </div>
                             </li>
                         ))}
                     </ul>
                 )}
             </div>
        )}

         {activeTab === "notes" && (
             <div className="space-y-4">
                 <div className="flex justify-between items-center">
                     <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notes ({client.notes.length})</h3>
                      <button className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Add Note</button>
                 </div>
                 {client.notes.length === 0 ? (
                     <p className="text-gray-500 dark:text-gray-400">No notes found.</p>
                 ) : (
                     <div className="space-y-4">
                         {client.notes.map(note => (
                             <div key={note.id} className="bg-white dark:bg-gray-800 p-4 shadow rounded-md border border-gray-200 dark:border-gray-700">
                                 <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{note.content}</p>
                                 <p className="text-xs text-gray-500 mt-2">{new Date(note.createdAt).toLocaleString()}</p>
                             </div>
                         ))}
                     </div>
                 )}
             </div>
        )}
      </div>
    </div>
  );
}
