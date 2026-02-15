import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrgDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "org") redirect("/dashboard");

  return (
    <div style={{ padding: 40 }}>
      <h1>Organization Dashboard</h1>
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
