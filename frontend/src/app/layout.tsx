import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bridge-X | 전쟁 지역 청소년 심리 상담 플랫폼",
  description: "전쟁 지역 청소년을 위한 AI 기반 심리 상담 서비스. 안전한 공간에서 마음을 나누세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geist.variable} antialiased`}>
        <Navbar />
        <main className="pt-20 min-h-screen flex flex-col items-center">
          <div className="w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
