import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";

export default async function AppLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar user={session.user} />
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
