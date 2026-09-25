"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";
import { Reveal } from "@/components/motion/reveal";
import { useRsvpForm } from "@/hooks/use-rsvp-form";
import { cn } from "@/lib/utils";
import type { RsvpFormData } from "@/types/rsvp";
import { useInvitation } from "../invitation-context";
import HeartRule from "./ui/heart-rule";

const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

const LABEL =
  "mb-[19px] block font-text text-[9px] font-medium tracking-[2px] text-[#864541]";
const FIELD =
  "mt-2.5 w-full rounded-lg border border-[#7b3d3c]/30 bg-[#fffdf8]/55 px-3.5 py-3 font-text text-[12px] leading-normal font-light tracking-normal text-cocoa outline-none transition-[border-color,box-shadow] focus:border-wine focus:shadow-[0_0_0_3px_#74131c0c]";

const ATTENDANCE = [
  { value: "yes", label: "Tôi sẽ tham dự", mark: "♥" },
  { value: "no", label: "Rất tiếc, tôi không thể tham dự", mark: "♡" },
] as const;

const RsvpSection: React.FC = () => {
  const content = useInvitation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    status,
    serverError,
    attendance,
    onSubmit,
  } = useRsvpForm();
  const [submitted, setSubmitted] = useState<RsvpFormData | null>(null);
  const guestRef = useRef<HTMLLabelElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const isAttending = attendance === "yes";

  // Ô "số lượng khách" trượt mở / đóng theo lựa chọn tham dự.
  useGSAP(
    () => {
      ensureGsapReady();
      const el = guestRef.current;
      if (!el) return;
      const duration = prefersReducedMotion() ? 0 : 0.45;
      gsap.to(el, {
        height: isAttending ? "auto" : 0,
        autoAlpha: isAttending ? 1 : 0,
        marginBottom: isAttending ? 19 : 0,
        duration,
        ease: "power2.inOut",
      });
    },
    { dependencies: [isAttending] },
  );

  useGSAP(
    () => {
      if (status === "idle" || !statusRef.current || prefersReducedMotion()) return;
      gsap.from(statusRef.current, { autoAlpha: 0, y: 12, duration: 0.5, ease: "power2.out" });
    },
    { dependencies: [status, serverError] },
  );

  const submit = handleSubmit(async (data) => {
    setSubmitted(data);
    await onSubmit(data);
  });

  const successMessage =
    submitted?.attendance === "yes"
      ? `Cảm ơn bạn! Gia đình đã ghi nhận ${submitted.guestCount} người tham dự vào ngày ${content.dateShort}.`
      : `Gia đình đã nhận được lời nhắn. Cảm ơn bạn đã dành tình cảm cho ${content.groomName} và ${content.brideName}.`;

  return (
    <section
      id="xac-nhan"
      aria-labelledby="rsvp-title"
      className="relative overflow-hidden bg-[linear-gradient(145deg,#fffaf4,#f7ebdd)] px-[5%] pt-[70px] pb-[65px]"
    >
      <Reveal className="relative z-[3]">
        <h2
          id="rsvp-title"
          className="font-display text-[56px] leading-[0.9] text-wine"
        >
          RSVP
        </h2>
        <p className="-mt-0.5 font-script text-[45px] leading-[0.95] text-wine">
          Xác nhận tham dự
        </p>
        <HeartRule align="start" />
        <p className="font-text text-[11px] leading-[1.7] font-light text-taupe">
          Sự hiện diện của bạn là niềm vui lớn lao đối với chúng mình. Hãy xác
          nhận để chúng mình có thể chuẩn bị thật chu đáo nhé!
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={submit} noValidate className="relative z-[3] mt-8">
          <label className={LABEL}>
            HỌ VÀ TÊN <span className="text-wine">*</span>
            <input
              type="text"
              autoComplete="name"
              maxLength={100}
              placeholder="Nhập họ và tên của bạn"
              aria-invalid={!!errors.name}
              className={FIELD}
              {...register("name")}
            />
            {errors.name && (
              <span className="mt-1.5 block font-text text-[10px] tracking-normal text-[#a3222d]">
                {errors.name.message}
              </span>
            )}
          </label>

          <fieldset className={LABEL}>
            <legend>
              XÁC NHẬN THAM DỰ <span className="text-wine">*</span>
            </legend>
            <div className="mt-2.5 grid gap-3">
              {ATTENDANCE.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex min-h-[58px] cursor-pointer items-center gap-2.5 rounded-[7px] border px-[15px] py-3 font-text text-[11px] leading-[1.45] font-light tracking-normal transition-colors",
                    attendance === option.value
                      ? "border-[#9b3439] bg-[#fff9f3] text-wine"
                      : "border-[#7b3d3c]/30 text-taupe",
                  )}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="size-[17px] accent-wine"
                    {...register("attendance")}
                  />
                  <span>{option.label}</span>
                  <b aria-hidden="true" className="ml-auto text-[15px] text-wine">
                    {option.mark}
                  </b>
                </label>
              ))}
            </div>
          </fieldset>

          <label ref={guestRef} className={cn(LABEL, "overflow-hidden")}>
            SỐ LƯỢNG NGƯỜI THAM DỰ <span className="text-wine">*</span>
            {/* Không `disabled`: RHF sẽ bỏ giá trị và Zod chặn gửi khi "không tham dự". */}
            <select
              className={FIELD}
              {...register("guestCount", { valueAsNumber: true })}
            >
              {GUEST_OPTIONS.map((count) => (
                <option key={count} value={count}>
                  {count} người
                </option>
              ))}
            </select>
          </label>

          <label className={LABEL}>
            LỜI NHẮN (KHÔNG BẮT BUỘC)
            <textarea
              rows={4}
              maxLength={500}
              placeholder="Gửi lời nhắn đến cô dâu chú rể nhé…"
              className={cn(FIELD, "resize-y")}
              {...register("message")}
            />
          </label>

          {status !== "idle" && (
            <p
              ref={statusRef}
              role="status"
              className={cn(
                "mb-4 rounded-md border p-3 font-text text-[11px] leading-[1.55]",
                status === "success"
                  ? "border-[#3f6a41]/35 text-[#3f6a41]"
                  : "border-[#913c3e]/35 text-[#7b161f]",
              )}
            >
              {status === "success" ? successMessage : serverError}
            </p>
          )}

          {status !== "success" && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer justify-center gap-5 rounded-full bg-[linear-gradient(90deg,#861421,#6b0e18)] px-[22px] py-4 font-display text-[18px] leading-none text-[#fffaf1] transition-[opacity,translate] hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-55"
            >
              {isSubmitting ? "Đang gửi lời xác nhận" : "Gửi xác nhận"}
              <span aria-hidden="true">⟶</span>
            </button>
          )}
        </form>
      </Reveal>
    </section>
  );
};

export default RsvpSection;
