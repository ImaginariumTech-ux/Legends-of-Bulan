import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Legends of Bulan ",
  description: "All wars are fought twice",
  icons: {
    icon: "/lob.png",
    apple: "/lob.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable}`}>
      <body className="antialiased min-h-screen relative font-sans">
        <div className="grain-overlay" />
        <Preloader />
        {children}
      </body>
    </html>
  );
}
