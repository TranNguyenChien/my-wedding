import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

const PHOTOS = [
  "/images/gallery/CN0113.jpg",
  "/images/gallery/CN0163.jpg",
  "/images/gallery/TH_01634.jpg",
  "/images/gallery/TH_01811.jpg",
];

const Gallery: React.FC = () => {
  return (
    <section className="w-full px-4 py-14">
      <Reveal className="mb-8 text-center">
        <h2 className="font-script text-4xl text-burgundy-700">
          Khoảnh Khắc
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 gap-2">
        {PHOTOS.map((src, i) => (
          <Reveal key={src} variant="clip" delay={i * 0.05}>
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg">
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 640px) 224px, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
