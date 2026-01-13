"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update settings");

      // Update local session
      await update(data);
      setMessage("Settings saved successfully!");
      router.refresh();
    } catch (err) {
      setMessage("Error saving settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
        {message && (
            <div className={`p-3 rounded-md text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                {message}
            </div>
        )}
        
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
            <input 
                name="name" 
                defaultValue={session?.user?.name} 
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" 
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency (ISO)</label>
            <input 
                name="currency" 
                defaultValue={session?.user?.currency || "USD"} 
                maxLength={3}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white uppercase" 
            />
            <p className="mt-1 text-xs text-gray-500">Used for deal values.</p>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
            <select 
                name="timezone" 
                defaultValue={session?.user?.timezone || "UTC"}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
            </select>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button type="submit" disabled={loading} className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
                {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                Save Changes
            </button>
        </div>
      </form>
    </div>
  );
}
