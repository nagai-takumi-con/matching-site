import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "婚活マッチングサイト",
  description: "Z世代向けの新しい出会いを。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 ${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased text-gray-900 selection:bg-pink-200`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, #f9a8d4 0%, transparent 60%), radial-gradient(circle at 20% 80%, #a5b4fc 0%, transparent 60%)",
        }}
      >
        <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-8 animate-fadeIn">
          {children}
        </main>
      </body>
    </html>
  );
}
