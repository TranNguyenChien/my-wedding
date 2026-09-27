"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { submitRsvp } from "@/services/rsvp";
import { rsvpSchema, type RsvpEvent, type RsvpFormData } from "@/types/rsvp";

// `event` is fixed per page (not a visible field) and survives form.reset()
// because it lives in defaultValues.
export function useRsvpForm(event: RsvpEvent) {
  const form = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      event,
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

  /** Quay lại form trống sau khi gửi thành công (gửi thêm cho người khác). */
  function resetStatus() {
    setStatus("idle");
    setServerError(null);
  }

  return { ...form, status, serverError, attendance, onSubmit, resetStatus };
}
