import { cookies } from "next/headers";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { defaultLocale, isAppLocale } from "@/lib/i18n";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalbitsolutions.com"),
  title: {
    default: "Digital Bit Solutions",
    template: "%s | Digital Bit Solutions",
  },
  description:
    "Landing premium y mini CMS para Digital Bit Solutions: software a medida, automatizacion e IA para equipos pequenos que buscan una ejecucion seria.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const htmlLang = isAppLocale(localeCookie) ? localeCookie : defaultLocale;

  return (
    <html lang={htmlLang} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${plexMono.variable} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
