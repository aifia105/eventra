"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"client" | "org">("client");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
      }),
    });

    setLoading(false);

    const data = await res.json();
    if (!res.ok) {
      console.error("Registration error:", data.error);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex min-h-screen bg-accent/30">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center rounded-r-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <Image
          src="/images/auth.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="relative z-10 text-center mb-20 text-white px-8">
          <h1 className="text-6xl font-bold">Eventra</h1>
          <p className="text-2xl opacity-90 font-semibold">
            Start managing events today
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 relative z-10 shadow-2xl items-center justify-center  px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl space-y-8">
          <div className="lg:hidden text-center">
            <h1 className="text-3xl font-bold text-primary">Eventra</h1>
          </div>

          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
            <p className="mt-1 text-sm text-gray-500">
              Join Eventra to manage your events
            </p>
          </div>

          <div className="flex gap-2 p-1 bg-transparent rounded-lg">
            <button
              type="button"
              onClick={() => setAccountType("client")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                accountType === "client"
                  ? "bg-primary-lighter/10 text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Client Account
            </button>
            <button
              type="button"
              onClick={() => setAccountType("org")}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                accountType === "org"
                  ? "bg-primary-lighter/10 text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Organization
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {accountType === "org" ? "Organization name" : "Full name"}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="mt-1 block w-full rounded-lg border bg-white border-gray-300 px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition"
                placeholder={
                  accountType === "org" ? "Your Company Ltd" : "Xin Zhao"
                }
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-lg border bg-white border-gray-300 px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border bg-white border-gray-300 px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border bg-white border-gray-300 px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-light active:scale-[0.98] disabled:opacity-60 transition cursor-pointer"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-light transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
