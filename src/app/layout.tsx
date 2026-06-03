import type { Metadata } from "next";
import { Geist } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vobilo — Sälj för laget",
  description:
    "Hjälp ert lag eller er klass att samla in pengar. Sälj riktigt bra produkter till familj och vänner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
