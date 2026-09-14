import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist_Mono, Inter } from "next/font/google";

import { NeedHelpWidget } from "@/components/help/need-help-widget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "AFC Partner Portal",
  description: "Web prototype for the AFC partner portal",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Suspense fallback={null}>
          <NeedHelpWidget />
        </Suspense>
      </body>
    </html>
  );
}
