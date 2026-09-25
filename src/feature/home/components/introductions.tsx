import Image from "next/image";
import { site } from "@/constants/site";

const Introductions: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center gap-10 overflow-hidden p-6 text-center w-full">
      <div className="relative aspect-606/562 w-full">
        {/* Envelope body, opened */}
        <Image
          src="/images/envelop/envelope-open.png"
          alt=""
          fill
          sizes="(min-width: 640px) 448px, 360px"
          className="object-contain z-5"
        />

        <div className="absolute top-[45%] left-[55%] z-6 w-[270px] h-[223px] -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-lg [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]">
          <Image
            src="/images/envelop/wildflowers.png"
            alt=""
            fill
            sizes="(min-width: 640px) 260px, 200px"
            className="object-cover"
          />
        </div>

        {/* Pearl strand draping from behind the card */}
        <Image
          src="/images/envelop/pearl-strand.png"
          alt=""
          width={799}
          height={711}
          className="absolute top-[45%] -right-6 z-6 h-auto w-[44%] scale-200 overflow-hidden"
        />

        {/* Flower bouquet, spilling past the left edge */}
        <Image
          src="/images/envelop/flower-bouquet.png"
          alt=""
          width={799}
          height={711}
          className="absolute top-[-10%] z-3 -left-30 -rotate-90 overflow-hidden"
        />

        {/* Leaf branch, spilling past the right edge */}
        <Image
          src="/images/envelop/leaf-branch.png"
          alt=""
          width={344}
          height={800}
          className="absolute top-[8%] right-5 z-3 h-auto w-[24%] rotate-12"
        />

        {/* Lace heart card with the couple's names */}
        <div className="absolute top-[56%] left-1/2 z-7 w-[68%]  -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/images/envelop/lace-heart-2.png"
            alt=""
            width={551}
            height={532}
            className="-rotate-5 "
          />
          <span className="font-script absolute top-[50%] left-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 text-3xl leading-[1.35] tracking-wide text-burgundy-700">
            {site.bride.name} &amp;
            <br />
            {site.groom.name}
          </span>
        </div>

        {/* Pearl drops, bottom-left */}
        <Image
          src="/images/envelop/pearl.png"
          alt=""
          width={160}
          height={160}
          className="absolute -bottom-[3%] left-[3%] z-7 h-auto w-[14%]"
        />
        <Image
          src="/images/envelop/pearl.png"
          alt=""
          width={160}
          height={160}
          className="absolute -bottom-[3%] left-[18%] z-7 h-auto w-[7%]"
        />
      </div>
    </section>
  );
};

export default Introductions;
