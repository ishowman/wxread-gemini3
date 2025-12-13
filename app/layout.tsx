import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/src/context/AppContext";
import { ToastProvider } from "@/src/components/Toast";
import { Layout as AppLayout } from "@/src/components/Layout";

// Import components that need 'use client' directive
// However, since Layout in components/Layout.tsx uses useApp hook, it must be client side.
// But we want the shell to be server rendered if possible.
// For simplicity in this migration, we'll make the Providers wrap the Client Layout.

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookMarked",
  description: "A modern, responsive book list management system.",
};

// Create a client wrapper for the app logic
import ClientShell from "./client-shell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
         <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}