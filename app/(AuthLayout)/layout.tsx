import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Inter } from "next/font/google";
import Image from "next/image";
import { AuthLayoutProvider } from "./AuthLayoutProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="w-full h-full">
      <body className={`${inter.variable} font-sans w-full h-full`}>
        {children}
      </body>
    </html>
  );
}
