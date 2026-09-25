"use client";

import { useWishes } from "@/hooks/use-wishes";
import { site } from "@/constants/site";
import { Reveal } from "@/components/motion/reveal";

const Guestbook: React.FC = () => {
  const { register, handleSubmit, formState, onSubmit, status, serverError, wishes } =
    useWishes();
  const { errors, isSubmitting } = formState;
  const ceremony = site.le_tan_hon_ceremony;

  return (
    <section className="w-full px-6 py-16">
      <Reveal className="mb-2 text-center">
        <h2 className="font-script text-4xl text-burgundy-700">Sổ Lưu Bút</h2>
      </Reveal>
      <Reveal delay={0.05} className="mb-8 text-center">
        <p className="font-body text-xs text-foreground/60">
          Gửi lời chúc phúc đến {site.groom.name} &amp; {site.bride.name}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <input
            {...register("name")}
            placeholder="Tên của bạn"
            className="rounded-full border border-gold-400/50 bg-white/60 px-4 py-2.5 font-body text-sm outline-none focus:border-burgundy-600"
          />
          {errors.name && (
            <p className="text-xs text-burgundy-700">{errors.name.message}</p>
          )}

          <textarea
            {...register("message")}
            placeholder="Lời chúc của bạn"
            rows={3}
            className="rounded-2xl border border-gold-400/50 bg-white/60 px-4 py-2.5 font-body text-sm outline-none focus:border-burgundy-600"
          />
          {errors.message && (
            <p className="text-xs text-burgundy-700">
              {errors.message.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 rounded-full bg-burgundy-700 px-6 py-2.5 font-body text-xs tracking-[0.2em] text-white transition-opacity disabled:opacity-60"
          >
            GỬI LỜI CHÚC
          </button>

          {status === "success" && (
            <p className="text-center text-xs text-burgundy-700">
              Cảm ơn bạn đã gửi lời chúc!
            </p>
          )}
          {status === "error" && serverError && (
            <p className="text-center text-xs text-burgundy-700">
              {serverError}
            </p>
          )}
        </form>
      </Reveal>

      {wishes.length > 0 && (
        <ul className="mt-8 flex flex-col gap-4">
          {wishes.slice(0, 6).map((wish, i) => (
            <li
              key={`${wish.timestamp}-${i}`}
              className="rounded-xl bg-white/50 p-4"
            >
              <p className="font-body text-sm text-foreground/90">
                {wish.message}
              </p>
              <p className="mt-1 font-body text-xs text-burgundy-600">
                — {wish.name}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 text-center">
        <div>
          <p className="font-body text-xs font-semibold tracking-[0.2em] text-burgundy-700">
            QUÀ CƯỚI
          </p>
          <p className="mt-1 font-body text-xs text-foreground/60">
            Sự hiện diện của bạn là niềm hạnh phúc lớn nhất của chúng tôi.
          </p>
        </div>
        <div>
          <p className="font-body text-xs font-semibold tracking-[0.2em] text-burgundy-700">
            LỜI CẢM ƠN
          </p>
          <p className="mt-1 font-body text-xs text-foreground/60">
            Cảm ơn bạn đã dành thời gian đến chung vui cùng gia đình chúng
            tôi.
          </p>
        </div>
        <div>
          <p className="font-body text-xs font-semibold tracking-[0.2em] text-burgundy-700">
            LỊCH TRÌNH
          </p>
          <p className="mt-1 font-body text-xs text-foreground/60">
            {ceremony.venueName} — {ceremony.dateLine}, lúc {ceremony.time}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Guestbook;
