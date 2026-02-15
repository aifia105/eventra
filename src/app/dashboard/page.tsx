import { redirect } from "next/navigation";
import { auth } from "@/lib/config/auth";

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session) redirect("/login");
  redirect(`/dashboard/${session.user.role}`);
}
