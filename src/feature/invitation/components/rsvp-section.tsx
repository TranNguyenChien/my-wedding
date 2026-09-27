"use client";

import { useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  CheckCircle,
  HeartStraight,
  PaperPlaneTilt,
  WarningCircle,
} from "@phosphor-icons/react/ssr";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";
import { Reveal } from "@/components/motion/reveal";
import { useRsvpForm } from "@/hooks/use-rsvp-form";
import { cn } from "@/lib/utils";
import { MAX_GUESTS, type RsvpFormData } from "@/types/rsvp";
import { useInvitation } from "../invitation-context";
import GuestStepper from "./ui/guest-stepper";
import SectionHeading from "./ui/section-heading";

const MESSAGE_MAX = 500;

// Bo góc: thẻ 28px, ô nhập / lựa chọn 16px, nút bấm dạng viên thuốc.
const LABEL = "block font-text text-[13px] font-medium text-cocoa";
const FIELD =
  "w-full rounded-2xl border border-wine/15 bg-[#fffdf9] px-4 py-3.5 font-text text-[16px] leading-normal text-cocoa outline-none transition-[border-color,box-shadow] placeholder:text-[#8a7778] focus:border-wine/60 focus:shadow-[0_0_0_4px_rgba(120,19,29,0.07)] aria-invalid:border-[#a3222d]/60";
const ERROR =
  "mt-2 flex items-center gap-1.5 font-text text-[12.5px] text-[#a3222d]";

const ATTENDANCE = [
  {
    value: "yes",
    title: "Sẽ tham dự",
    hint: "Hẹn gặp nhau tại tiệc",
    Icon: HeartStraight,
  },
  {
    value: "no",
    title: "Không thể đến",
    hint: "Gửi lời chúc từ xa",
    Icon: PaperPlaneTilt,
  },
] as const;

const RsvpSection: React.FC = () => {
  const content = useInvitation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    status,
    serverError,
    attendance,
    onSubmit,
    resetStatus,
  } = useRsvpForm(content.rsvpEvent);
  const message = useWatch({ control, name: "message" }) ?? "";
  const [submitted, setSubmitted] = useState<RsvpFormData | null>(null);
  const guestRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const isAttending = attendance === "yes";

  // Khối "số lượng khách" trượt mở / đóng theo lựa chọn tham dự.
  useGSAP(
    () => {
      ensureGsapReady();
      const el = guestRef.current;
      if (!el) return;
      gsap.to(el, {
        height: isAttending ? "auto" : 0,
        autoAlpha: isAttending ? 1 : 0,
        duration: prefersReducedMotion() ? 0 : 0.45,
        ease: "power2.inOut",
      });
    },
    { dependencies: [isAttending, status] },
  );

  useGSAP(
    () => {
      if (status === "idle" || !feedbackRef.current || prefersReducedMotion())
        return;
      gsap.from(feedbackRef.current, {
        autoAlpha: 0,
        y: 16,
        duration: 0.6,
        ease: "power3.out",
      });
    },
    { dependencies: [status, serverError] },
  );

  const submit = handleSubmit(async (data) => {
    setSubmitted(data);
    await onSubmit(data);
  });

  const successTitle =
    submitted?.attendance === "yes" ? "Hẹn gặp bạn nhé!" : "Cảm ơn bạn!";
  const successMessage =
    submitted?.attendance === "yes"
      ? `Gia đình đã ghi nhận ${submitted.guestCount} người tham dự vào ngày ${content.dateShort}.`
      : `Gia đình đã nhận được lời nhắn. Cảm ơn bạn đã dành tình cảm cho ${content.firstName} và ${content.secondName}.`;

  return (
    <section
      id="xac-nhan"
      aria-labelledby="rsvp-title"
      className="relative overflow-hidden bg-[linear-gradient(160deg,#fffaf4_0%,#f7ebdd_100%)] px-5 pt-20 pb-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 size-105 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(164,114,78,0.16),transparent_65%)]"
      />

      <Reveal>
        <SectionHeading
          script="Chung vui"
          title={
            <>
              Xác nhận <em>tham dự</em>
            </>
          }
          titleId="rsvp-title"
        >
          Sự hiện diện của bạn là niềm vui lớn với chúng mình. Xác nhận sớm để
          gia đình chuẩn bị thật chu đáo nhé.
        </SectionHeading>
      </Reveal>

      <Reveal delay={0.1} className="relative z-3 mt-10">
        <div className="rounded-[28px] border border-white/70 bg-white/55 p-5 shadow-[0_24px_60px_-28px_rgba(120,19,29,0.28),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md sm:p-7">
          {status === "success" ? (
            <div
              ref={feedbackRef}
              role="status"
              className="flex flex-col items-center py-6 text-center"
            >
              <span className="grid size-16 place-items-center rounded-full bg-wine/8 text-wine">
                <CheckCircle weight="light" className="size-9" />
              </span>
              <p className="mt-5 font-script text-[44px] leading-none text-wine">
                {successTitle}
              </p>
              <p className="mt-3 max-w-[32ch] font-text text-[14px] leading-[1.7] text-taupe">
                {successMessage}
              </p>
              <button
                type="button"
                onClick={resetStatus}
                className="mt-7 cursor-pointer rounded-full border border-wine/20 px-5 py-2.5 font-text text-[13px] font-medium text-wine transition-[background-color,scale] hover:bg-wine/5 active:scale-[0.98]"
              >
                Xác nhận cho người khác
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div>
                <label htmlFor="rsvp-name" className={LABEL}>
                  Họ và tên <span className="text-wine">*</span>
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Ví dụ: Trần Minh Khang"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "rsvp-name-error" : undefined}
                  className={cn(FIELD, "mt-2")}
                  {...register("name")}
                />
                {errors.name && (
                  <p id="rsvp-name-error" className={ERROR}>
                    <WarningCircle weight="fill" className="size-4 shrink-0" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <fieldset className="mt-6">
                <legend className={LABEL}>
                  Bạn sẽ đến chứ? <span className="text-wine">*</span>
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {ATTENDANCE.map(({ value, title, hint, Icon }) => {
                    const active = attendance === value;
                    return (
                      <label
                        key={value}
                        className={cn(
                          "relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition-[background-color,border-color,color,scale,box-shadow] active:scale-[0.98] has-focus-visible:shadow-[0_0_0_4px_rgba(120,19,29,0.12)]",
                          active
                            ? "border-wine bg-wine text-[#fff8ef] shadow-[0_14px_30px_-16px_rgba(120,19,29,0.6)]"
                            : "border-wine/15 bg-[#fffdf9] text-cocoa hover:border-wine/40",
                        )}
                      >
                        <input
                          type="radio"
                          value={value}
                          className="sr-only"
                          {...register("attendance")}
                        />
                        <Icon
                          weight={active ? "fill" : "regular"}
                          className={cn(
                            "size-6",
                            active ? "text-champagne" : "text-bronze",
                          )}
                        />
                        <span>
                          <span className="block font-text text-[14px] font-semibold">
                            {title}
                          </span>
                          <span
                            className={cn(
                              "mt-0.5 block font-text text-[12px] leading-snug",
                              active ? "text-[#f1ddd6]" : "text-taupe",
                            )}
                          >
                            {hint}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Không `disabled` khi ẩn: RHF sẽ bỏ giá trị và Zod chặn gửi khi "không tham dự". */}
              <div
                ref={guestRef}
                inert={!isAttending}
                className="-mx-1 overflow-hidden px-1"
              >
                <div className="pt-6 pb-1">
                  <label htmlFor="rsvp-guests" className={LABEL}>
                    Số người tham dự <span className="text-wine">*</span>
                  </label>
                  <div className="mt-2">
                    <Controller
                      control={control}
                      name="guestCount"
                      render={({ field, fieldState }) => (
                        <GuestStepper
                          id="rsvp-guests"
                          value={field.value}
                          max={MAX_GUESTS}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          invalid={!!fieldState.error}
                          describedBy="rsvp-guests-help"
                        />
                      )}
                    />
                  </div>
                  <p
                    id="rsvp-guests-help"
                    className="mt-2 font-text text-[12.5px] text-taupe"
                  >
                    Tính cả bạn, tối đa {MAX_GUESTS} người.
                  </p>
                  {errors.guestCount && (
                    <p className={ERROR}>
                      <WarningCircle
                        weight="fill"
                        className="size-4 shrink-0"
                      />
                      {errors.guestCount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="rsvp-message" className={LABEL}>
                    Lời nhắn
                  </label>
                  <span className="nums font-text text-[12px] text-taupe">
                    {message.length}/{MESSAGE_MAX}
                  </span>
                </div>
                <textarea
                  id="rsvp-message"
                  rows={4}
                  maxLength={MESSAGE_MAX}
                  placeholder="Gửi đôi lời chúc đến cô dâu chú rể (không bắt buộc)"
                  className={cn(FIELD, "mt-2 resize-none")}
                  {...register("message")}
                />
              </div>

              {status === "error" && (
                <div
                  ref={feedbackRef}
                  role="alert"
                  className="mt-6 flex items-start gap-2.5 rounded-2xl border border-[#a3222d]/20 bg-[#a3222d]/5 p-4 font-text text-[13px] leading-[1.55] text-[#7b161f]"
                >
                  <WarningCircle
                    weight="fill"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  <span>{serverError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-wine px-6 py-4 font-text text-[15px] font-semibold text-[#fff8ef] shadow-[0_16px_32px_-16px_rgba(120,19,29,0.7)] transition-[background-color,scale,opacity] hover:bg-wine-dark active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi xác nhận"}
                <ArrowRight
                  weight="bold"
                  className={cn(
                    "size-4 transition-transform group-hover:translate-x-1",
                    isSubmitting && "animate-pulse",
                  )}
                />
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
};

export default RsvpSection;
