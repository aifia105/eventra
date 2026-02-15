"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";


export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error("Invalid email or password");
      }

      return res;
    },
    onSuccess: () => {
      router.push("/dashboard");
      toast.success("Welcome back!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen bg-accent/30 ">
      {/* Left section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center rounded-r-2xl  relative overflow-hidden">
        <div className="absolute inset-0 " />
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

      {/* Right section */}
      <div className="flex w-full lg:w-1/2 relative z-10 shadow-2xl items-center justify-center  px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl space-y-8">
          <div className="lg:hidden text-center">
            <h1 className="text-3xl font-bold text-primary">Eventra</h1>
          </div>

          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-500">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition ${errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary"
                  }`}
                placeholder="you@example.com"
                {...register("email")}
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
                type="password"
                autoComplete="current-password"
                className={`mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition ${errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-primary"
                  }`}
                placeholder="••••••••"
                {...register("password")}
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || loginMutation.isPending}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-light active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {loginMutation.isPending ? "Signing in…" : "Sign in"}
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
