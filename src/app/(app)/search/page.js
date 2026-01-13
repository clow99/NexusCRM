"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search as SearchIcon, Users, Briefcase, CheckSquare, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        if (query.length >= 2) {
            performSearch(query);
        } else {
            setResults(null);
        }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Update URL
  useEffect(() => {
      if (query) {
          router.replace(`/search?q=${encodeURIComponent(query)}`);
      } else {
          router.replace('/search');
      }
  }, [query, router]);

  async function performSearch(q) {
      setLoading(true);
      try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
          if (res.ok) {
              const data = await res.json();
              setResults(data);
          }
      } catch (error) {
          console.error("Search failed", error);
      } finally {
          setLoading(false);
      }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search</h1>
      
      <div className="relative mb-8">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, deals, tasks..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
        />
        {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-indigo-600" />}
      </div>

      {!results && !loading && query.length > 0 && query.length < 2 && (
          <p className="text-gray-500 text-center">Type at least 2 characters to search.</p>
      )}

      {results && (
        <div className="space-y-8">
            {/* Clients */}
            {results.clients.length > 0 && (
                <section>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <Users className="w-5 h-5 mr-2 text-blue-500" /> Clients
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                        {results.clients.map(client => (
                            <Link key={client.id} href={`/clients/${client.id}`} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{client.email} • {client.company}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Deals */}
            {results.deals.length > 0 && (
                <section>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <Briefcase className="w-5 h-5 mr-2 text-green-500" /> Deals
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                        {results.deals.map(deal => (
                             <div key={deal.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-900 dark:text-white">{deal.title}</p>
                                    <span className="text-sm text-gray-500">{deal.stage}</span>
                                </div>
                                {deal.client && <p className="text-sm text-gray-500 dark:text-gray-400">{deal.client.name}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tasks */}
            {results.tasks.length > 0 && (
                <section>
                    <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <CheckSquare className="w-5 h-5 mr-2 text-orange-500" /> Tasks
                    </h2>
                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                        {results.tasks.map(task => (
                             <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex justify-between">
                                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{task.status}</span>
                                </div>
                                {task.client && <p className="text-sm text-gray-500 dark:text-gray-400">{task.client.name}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {results.clients.length === 0 && results.deals.length === 0 && results.tasks.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No results found for "{query}".</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
