import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Providers } from "@/components/custom/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jiko Admin Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
