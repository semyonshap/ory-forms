import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import { Providers } from "@/components/custom/providers";

export const metadata: Metadata = {
  title: "Jiko Admin Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
