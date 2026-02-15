"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary-lighter relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <Image
          src="/images/auth.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="relative z-10 text-center mb-20 text-white px-8">
          <h1 className="text-6xl font-bold">Eventra</h1>
          <p className="text-2xl opacity-90">Manage your events with ease</p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex w-full lg:w-1/2 rounded-l-2xl relative z-10 shadow-2xl items-center justify-center bg-accent/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl space-y-8">
          <div className="lg:hidden text-center">
            <h1 className="text-3xl font-bold text-primary">Eventra</h1>
          </div>

          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-500">
              Login to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition"
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
                autoComplete="current-password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-light active:scale-[0.98] disabled:opacity-60 transition cursor-pointer"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary-light transition"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
