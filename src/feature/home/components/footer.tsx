import Image from "next/image";
import { site } from "@/constants/site";
import { Reveal } from "@/components/motion/reveal";

const Footer: React.FC = () => {
  const { bankId, accountNumber, accountName } = site.bankAccount;
  const hasBankInfo =
    bankId !== "TODO" && accountNumber !== "TODO" && accountName !== "TODO";
  const qrUrl = hasBankInfo
    ? `https://img.vietqr.io/image/${bankId}-${accountNumber}-compact2.png?accountName=${encodeURIComponent(accountName)}`
    : null;

  return (
    <footer className="flex w-full flex-col items-center gap-10 px-6 pt-16">
      <Reveal className="flex flex-col items-center gap-4">
        {qrUrl ? (
          <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-gold-400/40 bg-white">
            <Image
              src={qrUrl}
              alt="Mã QR chuyển khoản"
              fill
              sizes="176px"
              className="object-contain p-2"
            />
          </div>
        ) : (
          <div className="flex h-44 w-44 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold-400/50 bg-white/40 px-4 text-center">
            <p className="font-body text-[11px] text-foreground/50">
              Thông tin chuyển khoản sẽ được cập nhật
            </p>
          </div>
        )}
        <p className="font-script text-2xl text-burgundy-700">
          {site.groom.shortName} &amp; {site.bride.shortName}
        </p>
      </Reveal>

      <Reveal className="relative h-[45svh] w-full overflow-hidden">
        <Image
          src="/images/gallery/CN0091.jpg"
          alt=""
          fill
          sizes="(min-width: 640px) 448px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-burgundy-900/40" />
        <p className="absolute inset-x-0 bottom-10 text-center font-script text-3xl text-white">
          Thank you
        </p>
      </Reveal>
    </footer>
  );
};

export default Footer;
