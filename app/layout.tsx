import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/components/providers/redux-provider";

export const metadata: Metadata = {
  title: "Opportunitree",
  description:
    "A comprehensive educational platform for students, teachers, and administrators",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ReduxProvider>
            <AuthProvider>
              {children}
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </ReduxProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
