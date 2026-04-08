import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from "@/components/layout/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "スター引越センター - 営業案件管理",
  description: "スター引越センター 社内営業案件管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`h-full antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-full bg-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
