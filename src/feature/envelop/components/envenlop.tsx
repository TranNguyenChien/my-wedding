"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { site } from "@/constants/site";
import {
  ensureGsapReady,
  gsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";

interface EnvelopProps {
  setIsOpen: (isOpen: boolean) => void;
}

const Envelop: React.FC<EnvelopProps> = ({ setIsOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ensureGsapReady();
      if (prefersReducedMotion()) return;

      gsap.from(containerRef.current?.children ?? [], {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
      });
    },
    { scope: containerRef },
  );

  const handleOpen = () => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) {
      setIsOpen(true);
      return;
    }

    gsap.to(el, {
      opacity: 0,
      scale: 0.94,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => setIsOpen(true),
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center sm:gap-10"
      onClick={handleOpen}
    >
      <p className="font-body text-[11px] tracking-[0.35em] text-foreground/70 sm:text-xs">
        BẠN NHẬN ĐƯỢC MỘT BỨC THƯ TỪ
      </p>

      <h1 className="font-script text-5xl leading-none text-burgundy-700 sm:text-6xl md:text-7xl">
        {site.bride.shortName} &amp; {site.groom.shortName}
      </h1>

      <button
        type="button"
        aria-label="Mở thiệp mời"
        className="animate-envelope-float relative mt-2 w-full max-w-[320px] cursor-pointer sm:max-w-sm"
      >
        <div className="relative aspect-748/517 w-full">
          <Image
            src="/images/envelop/envelope.png"
            alt="envelope"
            fill
            sizes="(min-width: 640px) 384px, 320px"
            preload
            className="object-contain"
          />
          <Image
            src="/images/envelop/lace-trim.png"
            alt="lace trim"
            width={820}
            height={450}
            className="absolute top-0 left-1.5 h-auto w-full scale-110"
          />

          <span className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-3xl tracking-[0.15em] text-white sm:text-xl">
            {site.monogram}
          </span>

          <Image
            src="/images/envelop/pearl.png"
            alt="pearl"
            width={160}
            height={160}
            className="absolute -bottom-2 -left-4 h-auto w-11 sm:w-14"
          />
          <Image
            src="/images/envelop/pearl.png"
            alt="pearl"
            width={160}
            height={160}
            className="absolute -bottom-6 left-6 h-auto w-6 sm:w-7"
          />

          <Image
            src="/images/envelop/leaf-branch.png"
            alt="leaf branch"
            width={344}
            height={800}
            className="absolute -right-4 -bottom-10 h-auto w-24 rotate-18 sm:w-28"
          />
        </div>
      </button>

      <p className="font-body text-lg text-foreground">Click để mở</p>
    </div>
  );
};

export default Envelop;
