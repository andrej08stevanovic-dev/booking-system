import type { Metadata } from "next";
import { Fraunces, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { TopProgressBar } from "@/components/TopProgressBar";
import { DEMO_CLINIC } from "@/config/demo-data";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

// Display serif — samo za velike naslove (H1/H2). Daje "premium ordinacija"
// ton koji geometrijski sans sam ne može; UI/dugmad ostaju na Jakarti.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${DEMO_CLINIC.name} — ${DEMO_CLINIC.tagline}`,
  description: `Online zakazivanje termina — ${DEMO_CLINIC.tagline}, ${DEMO_CLINIC.city}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${jakarta.variable} ${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <TopProgressBar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
