import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
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
        <div className="min-h-screen flex flex-col justify-between">
          <div className="h-fit flex flex-col">
            <Navigation />
            <main className="mx-auto element pt-6 px-4 md:px-0">
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
