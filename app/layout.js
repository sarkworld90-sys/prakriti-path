import { Mukta, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MetaPixel from "@/components/MetaPixel";

const body = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const heading = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
});

export const metadata = {
  title: "प्रकृति पथ — अपनी प्रकृति, अपना जीवन पथ",
  description:
    "स्वयं को समझने, जीवन को पहचानने और अपनी दिशा खोजने की एक यात्रा। Prakriti Path — A Journey Towards Self-Discovery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" className={`${body.variable} ${heading.variable}`}>
      {/* Google Translate <body> पर class जोड़ता है — उस पर चेतावनी न आए */}
      <body suppressHydrationWarning>
        {children}
        <LanguageSwitcher />
        <MetaPixel />
      </body>
    </html>
  );
}
