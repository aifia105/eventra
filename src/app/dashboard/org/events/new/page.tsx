"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { eventSchema, EventInput } from "@/lib/validations/event";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Lock,
  Globe,
  Loader2,
} from "lucide-react";
import Link from "next/link";

async function createEvent(data: EventInput) {
  const response = await fetch("/api/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create event");
  }

  return response.json();
}

const eventTypeOptions = [
  { value: "public", label: "Public Event" },
  { value: "private", label: "Private Event" },
];

interface EventTypeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

function EventTypeDropdown({ value, onChange }: EventTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = eventTypeOptions.find((opt) => opt.value === value) || eventTypeOptions[0];

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-200"
      >
        <span className="flex-1 text-left truncate">{selected.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-full rounded-xl bg-white shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-[300px] overflow-y-auto p-2">
              {eventTypeOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors duration-150",
                    value === option.value
                      ? "text-primary font-medium"
                      : "text-gray-700 hover:bg-gray-50 rounded-lg",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      location: "",
      availableSeats: 0,
      type: "public",
    },
  });

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      toast.success("Event created successfully!");
      router.push("/dashboard/org/events");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create event");
    },
  });

  function onSubmit(values: EventInput) {
    mutation.mutate(values);
  }

  return (
    <div className=" space-y-6">
      <div className="flex items-center gap-8">
        <Link
          href="/dashboard/org/events"
          className="flex items-center justify-center h-10 w-10 rounded-xl border bg-white hover:bg-accent/20 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-500 mt-1">
            Fill in the details to create your event
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-semibold text-gray-900 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-primary" />
              Event Title
            </label>
            <input
              id="title"
              placeholder="e.g., Carthage Music Festival 2026"
              className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm font-medium text-red-600 flex items-center gap-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="date"
              className="text-sm font-semibold text-gray-900 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-primary" />
              Date & Time
            </label>
            <input
              id="date"
              type="datetime-local"
              className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-20 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              {...register("date")}
            />
            {errors.date && (
              <p className="text-sm font-medium text-red-600">
                {errors.date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-sm font-semibold text-gray-900 flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </label>
            <input
              id="location"
              placeholder="e.g., Carthage, Tunisia"
              className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-sm font-medium text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="availableSeats"
                className="text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                <Users className="h-4 w-4 text-primary" />
                Available Seats
              </label>
              <input
                id="availableSeats"
                type="number"
                min="1"
                placeholder="100"
                className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                {...register("availableSeats", { valueAsNumber: true })}
              />
              {errors.availableSeats && (
                <p className="text-sm font-medium text-red-600">
                  {errors.availableSeats.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                <Globe className="h-4 w-4 text-primary" />
                Event Type
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <EventTypeDropdown
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.type && (
                <p className="text-sm font-medium text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-14">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center rounded-xl text-sm font-semibold h-12 px-8 bg-primary text-white hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
