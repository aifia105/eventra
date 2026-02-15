"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      role: "client",
    },
  });

  const role = watch("role");

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Registration failed");
      }

      return responseData;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data);
  };

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
              onClick={() => setValue("role", "client", { shouldValidate: true })}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${role === "client"
                  ? "bg-primary-lighter/10 text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Client Account
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "org", { shouldValidate: true })}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${role === "org"
                  ? "bg-primary-lighter/10 text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Organization
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {role === "org" ? "Organization name" : "Full name"}
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className={`mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition ${errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                  }`}
                placeholder={
                  role === "org" ? "Your Company Ltd" : "Xin Zhao"
                }
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
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
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition ${errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                  }`}
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
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
                autoComplete="new-password"
                className={`mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition ${errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                  }`}
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
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
                type="password"
                autoComplete="new-password"
                className={`mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-light/40 focus:outline-none transition ${errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                  }`}
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || registerMutation.isPending}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-light active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {registerMutation.isPending ? "Creating account…" : "Create account"}
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
