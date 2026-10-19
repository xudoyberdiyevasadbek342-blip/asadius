import { continueRender, delayRender, staticFile } from "remotion";

export const fontFamily = "Montserrat";

// Shriftlar public/fonts papkasida, internetsiz ham ishlaydi
const parts: [string, string][] = [
  ["latin", "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"],
  ["latin-ext", "U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF"],
  ["cyrillic", "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"],
];

const handle = delayRender("Shriftlar yuklanmoqda");
Promise.all(
  parts.map(([subset, unicodeRange]) => {
    const font = new FontFace(
      fontFamily,
      `url(${staticFile(`fonts/montserrat-${subset}-800-normal.woff2`)}) format("woff2")`,
      { weight: "800", unicodeRange },
    );
    return font.load().then(() => document.fonts.add(font));
  }),
).then(() => continueRender(handle));
