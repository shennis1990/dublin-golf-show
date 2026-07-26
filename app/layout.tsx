import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Dublin Golf Show 2027 | Ireland's Festival of Golf",
  description:
    "Ireland's biggest celebration of golf brings together players, brands, destinations and innovators for two unforgettable days at RDS Simmonscourt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans font-light text-foreground">
        {children}
      </body>
    </html>
  );
}
