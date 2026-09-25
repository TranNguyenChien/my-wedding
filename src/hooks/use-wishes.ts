"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { fetchWishes, submitWish } from "@/services/wishes";
import { wishSchema, type Wish, type WishFormData } from "@/types/wishes";

export function useWishes() {
  const form = useForm<WishFormData>({
    resolver: zodResolver(wishSchema),
    defaultValues: { name: "", message: "" },
  });
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishes()
      .then(setWishes)
      .finally(() => setIsLoading(false));
  }, []);

  async function onSubmit(data: WishFormData) {
    setServerError(null);
    const result = await submitWish(data);

    if (result.success) {
      setStatus("success");
      setWishes((prev) => [{ ...data, timestamp: new Date().toISOString() }, ...prev]);
      form.reset();
    } else {
      setStatus("error");
      setServerError(result.error ?? "Đã có lỗi xảy ra");
    }
  }

  return { ...form, wishes, isLoading, status, serverError, onSubmit };
}
