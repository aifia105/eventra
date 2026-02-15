import { Sidebar } from "./sidebar";
import { auth } from "@/lib/config/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar role={session.user.role as "client" | "org"} />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
