import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

const FullBleedQuote: React.FC = () => {
  return (
    <section className="relative h-[60svh] w-full overflow-hidden">
      <Image
        src="/images/gallery/TH_01913.jpg"
        alt=""
        fill
        sizes="(min-width: 640px) 448px, 100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(61,5,12,0.75), transparent 55%)",
        }}
      />
      <Reveal className="absolute inset-x-0 bottom-10 px-8 text-center text-white">
        <p className="font-script text-2xl leading-snug">
          Hai trái tim, một tình yêu,
          <br />
          một hành trình hạnh phúc
        </p>
      </Reveal>
    </section>
  );
};

export default FullBleedQuote;
