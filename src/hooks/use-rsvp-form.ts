"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { submitRsvp } from "@/services/rsvp";
import { rsvpSchema, type RsvpFormData } from "@/types/rsvp";

// Shared by RsvpForm (plain) and GuestbookSection (maroon-themed) so both
// forms stay backed by the same validation/submit logic.
export function useRsvpForm() {
  const form = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      phone: "",
      attendance: "yes",
      guestCount: 1,
      message: "",
    },
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const attendance = useWatch({ control: form.control, name: "attendance" });

  async function onSubmit(data: RsvpFormData) {
    setServerError(null);
    const result = await submitRsvp(data);

    if (result.success) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setServerError(result.error ?? "Đã có lỗi xảy ra");
    }
  }

  return { ...form, status, serverError, attendance, onSubmit };
}
