import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { Inter } from "next/font/google";
import Link from "next/link";
import logo from "@/public/logo.png";

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
        <div className="h-fit min-h-screen flex flex-col w-full px-[20px] xl:px-[100px] py-[32px]">
          <div className="w-full pb-[32px] flex items-center justify-start h-[110px]">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <img src={logo.src} alt="Logo" />
            </Link>
          </div>
          <main className="w-full mt-[40px]">{children}</main>
        </div>
      </body>
    </html>
  );
}
