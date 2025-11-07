import "@/app/globals.css";
import { Navigation } from "@/components/navigation";
import DashboardLayout from "@/components/providers/DashboardLayout";
import { Inter } from "next/font/google";

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
    <div className={`${inter.variable} font-sans`}>{children}</div>
  );
}
