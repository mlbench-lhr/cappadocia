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
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
