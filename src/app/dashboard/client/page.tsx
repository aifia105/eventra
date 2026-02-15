import { auth, signOut } from "@/lib/config/auth";
import { redirect } from "next/navigation";

export default async function ClientDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "client") redirect("/dashboard");

  return (
    <div style={{ padding: 40 }}>
      <h1>Client Dashboard</h1>
      <p>Welcome, {session.user.name}</p>
      <p>Role: {session.user.role}</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
