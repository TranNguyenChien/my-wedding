import {
  Be_Vietnam_Pro,
  Pinyon_Script,
  Playfair_Display,
  Yeseva_One,
} from "next/font/google";

export const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-script",
});

/** All Vietnamese copy: labels, nav, form, buttons, body text. */
export const playfairBody = Playfair_Display({
  weight: ["400", "500", "600"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
});

/** Dates, times and countdown digits. */
/** Small uppercase labels and body copy on the Lễ Tân Hôn page. */
export const beVietnamText = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
});

export const yesevaTime = Yeseva_One({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-time",
});
