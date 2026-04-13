import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bruno Ravanhani | Engenheiro de Software .NET & React",
  description:
    "Portfólio de Bruno Ravanhani, Engenheiro de Software Sênior especializado em .NET e React, com 10 anos de experiência.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth`}>
      <body className="bg-[#0f172a] text-[#e2e8f0] antialiased">
        <Navbar />
        {children}
      </body>

    </html>
  );
}
